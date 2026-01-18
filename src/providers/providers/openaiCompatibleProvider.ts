import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { stream } from '@/providers/utils';
import type { ProviderConfig, IProviderResponse } from '@/providers/adapter/providerAdapter.interface';
import { logger } from '@/utils/logger';
import { hasImages, sanitizeForLogs } from '@/memory';
import { VisionNotSupportedError } from '@/providers/errors';

/**
 * Provedor compatível com OpenAI que aceita `ProviderConfig` diretamente.
 * 
 * Esta classe implementa um provedor genérico que funciona com qualquer API
 * compatível com o formato da OpenAI, incluindo OpenRouter, Azure OpenAI,
 * Anthropic Claude (via API compatível), e outros provedores que seguem
 * o padrão de API da OpenAI.
 * 
 * ## Características
 * 
 * - **Compatibilidade Universal**: Funciona com qualquer API OpenAI-compatible
 * - **ProviderConfig**: Aceita configuração unificada diretamente
 * - **BaseUrl Obrigatória**: Requer URL base do provedor específico
 * - **Fallback Inteligente**: Usa reasoning_content quando content estiver vazio
 * - **Streaming**: Suporte completo a respostas em tempo real
 * 
 * ## Provedores Suportados
 * 
 * - **OpenRouter**: `https://openrouter.ai/api/v1`
 * - **Azure OpenAI**: `https://{seu-endpoint}.openai.azure.com/`
 * - **Anthropic Claude**: `https://api.anthropic.com` (compatível)
 * - **Groq**: `https://api.groq.com/openai/v1`
 * - **Outros**: Qualquer provedor que siga a API da OpenAI
 * 
 * @example
 * ```typescript
 * import { OpenAICompatibleProvider } from '@/providers';
 * 
 * // OpenRouter
 * const openrouter = new OpenAICompatibleProvider('sua-api-key');
 * const response1 = await openrouter.chatCompletion({
 *   model: 'meta-llama/llama-3.1-70b-instruct',
 *   messages: [{ role: 'user', content: 'Olá!' }],
 *   apiKey: 'sk-or-...',
 *   baseUrl: 'https://openrouter.ai/api/v1',
 *   temperature: 0.7
 * });
 * 
 * // Azure OpenAI
 * const azure = new OpenAICompatibleProvider('sua-api-key');
 * const response2 = await azure.chatCompletion({
 *   model: 'gpt-4',
 *   messages: [...],
 *   apiKey: 'sua-azure-key',
 *   baseUrl: 'https://seu-endpoint.openai.azure.com/',
 *   temperature: 0.5
 * });
 * ```
 * 
 * @remarks
 * - `baseUrl` é obrigatória para todos os provedores compatíveis
 * - Funciona com modelos de diferentes provedores via mesmo formato
 * - Fallback para `reasoning_content` em provedores que usam esse campo
 * - Ideal para aplicações que precisam suportar múltiplos provedores
 * 
 * @see {@link ProviderConfig} Para formato de configuração
 * @see {@link ProviderAdapter} Para interface unificada
 */
export class OpenAICompatibleProvider {
  /** Nome identificador do provedor */
  public name = 'openaiCompatible';

  /** Cliente OpenAI configurado com baseUrl customizada */
  private client: OpenAI;

  /**
   * Cria uma nova instância do provedor compatível com OpenAI.
   * 
   * @param apiKey Chave de API do provedor específico.
   * O formato varia por provedor (alguns usam 'sk-', outros formatos diferentes).
   * 
   * @example
   * ```typescript
   * // OpenRouter
   * const provider = new OpenAICompatibleProvider('sk-or-...');
   * 
   * // Azure OpenAI
   * const azureProvider = new OpenAICompatibleProvider('sua-azure-key');
   * ```
   * 
   * @throws {Error} Se a API key não for fornecida
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key é obrigatória para provedores compatíveis com OpenAI');
    }
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Constrói o array de mensagens no formato da API da OpenAI.
   * 
   * Método privado que converte a configuração do ProviderConfig para
   * o formato esperado pela API da OpenAI, incluindo o system prompt
   * como primeira mensagem.
   * 
   * @param config Configuração do provedor contendo messages e systemPrompt.
   * 
   * @returns Array de mensagens formatadas para a API da OpenAI.
   * 
   * @private
   * 
   * @example
   * ```typescript
   * const config = {
   *   systemPrompt: 'Você é um assistente útil.',
   *   messages: [
   *     { role: 'user', content: 'Olá!' }
   *   ]
   * };
   * 
   * const messages = this.buildMessages(config);
   * // [
   * //   { role: 'system', content: 'Você é um assistente útil.' },
   * //   { role: 'user', content: 'Olá!' }
   * // ]
   * ```
   */
  private buildMessages(config: ProviderConfig): ChatCompletionMessageParam[] {
    const normalizeRole = (role: string): 'user' | 'assistant' | 'system' => {
      if (role === 'system') return 'system';
      if (role === 'assistant') return 'assistant';
      return 'user';
    };

    return [
      { role: 'system', content: config.systemPrompt ?? '' },
      ...config.messages.map((m) => ({
        role: normalizeRole(m.role),
        content: m.content as any,
      })),
    ];
  }

  private extractThinkingFromTaggedText(text: string): { finalText: string; thinking: string | null } {
    if (!text) return { finalText: text, thinking: null };

    const blocks: string[] = [];
    let finalText = text;

    const patterns: Array<{ open: string; close: string }> = [
      { open: '<thinking>', close: '</thinking>' },
      { open: '<think>', close: '</think>' },
    ];

    for (const { open, close } of patterns) {
      while (true) {
        const start = finalText.indexOf(open);
        if (start < 0) break;
        const end = finalText.indexOf(close, start + open.length);
        if (end < 0) break;

        const inner = finalText.slice(start + open.length, end);
        blocks.push(inner);
        finalText = finalText.slice(0, start) + finalText.slice(end + close.length);
      }
    }

    const thinking = blocks
      .map((b) => b.trim())
      .filter(Boolean)
      .join('\n\n')
      .trim();

    return { finalText: finalText.trim(), thinking: thinking.length > 0 ? thinking : null };
  }

  /**
   * Executa uma chamada de chat completion usando provedor compatível com OpenAI.
   * 
   * Este método implementa a interface IProviderResponse, fornecendo uma
   * camada de compatibilidade que funciona com qualquer API que siga
   * o padrão da OpenAI.
   * 
   * @param config Configuração completa do provedor.
   * Deve incluir model, messages, apiKey e **baseUrl** (obrigatória).
   * 
   * @returns Resposta no formato IProviderResponse unificado.
   * 
   * @throws {Error} Se baseUrl não for fornecida
   * @throws {Error} Se houver erro na comunicação com a API
   * @throws {Error} Se parâmetros inválidos forem fornecidos
   * 
   * @example
   * ```typescript
   * // OpenRouter
   * const response = await provider.chatCompletion({
   *   model: 'meta-llama/llama-3.1-70b-instruct',
   *   messages: [{ role: 'user', content: 'Explique IA' }],
   *   apiKey: 'sk-or-...',
   *   baseUrl: 'https://openrouter.ai/api/v1',
   *   temperature: 0.7,
   *   maxTokens: 1000
   * });
   * 
   * console.log(response.content);
   * 
   * // Com streaming
   * const streamResponse = await provider.chatCompletion({
   *   model: 'claude-3-sonnet',
   *   messages: [...],
   *   apiKey: 'sua-api-key',
   *   baseUrl: 'https://api.anthropic.com',
   *   stream: true
   * });
   * 
   * for await (const chunk of streamResponse) {
   *   process.stdout.write(chunk.content);
   * }
   * ```
   * 
   * @remarks
   * - `baseUrl` é obrigatória e deve apontar para a API do provedor específico
   * - Suporta fallback para `reasoning_content` em provedores que usam esse campo
   * - Streaming retorna iterador assíncrono de chunks
   * - Metadados incluem informações do modelo, uso de tokens e resposta raw
   * 
   * @see {@link ProviderConfig} Para formato da configuração
   * @see {@link IProviderResponse} Para formato da resposta
   */
  async chatCompletion(config: ProviderConfig): Promise<IProviderResponse> {
    // Validação: baseUrl é obrigatória para provedores compatíveis
    if (!config.baseUrl) {
      throw new Error("'baseUrl' é obrigatório para o provedor openaiCompatible.");
    }

    logger.info(`[OpenAICompatibleProvider] Iniciando chatCompletion com modelo: ${config.model}`);
    logger.debug(`[OpenAICompatibleProvider] baseUrl: ${config.baseUrl}`);
    logger.debug(`[OpenAICompatibleProvider] apiKey: ${config.apiKey ? 'presente' : 'ausente'}`);
    logger.debug(`[OpenAICompatibleProvider] messages count: ${config.messages?.length || 0}`);

    const hasAnyImages = (config.messages ?? []).some((m) => hasImages(m.content));
    const supportsVision = config.capabilities?.supportsVision === true;
    if (hasAnyImages && !supportsVision) {
      throw new VisionNotSupportedError(
        'ProviderConfig.capabilities.supportsVision=false but request contains image content',
      );
    }

    // Permite override de apiKey/baseUrl por chamada, se fornecida
    if (config.apiKey) {
      logger.debug(`[OpenAICompatibleProvider] Criando novo cliente OpenAI com baseURL: ${config.baseUrl}`);
      this.client = new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseUrl
      });
    }

    // Construir array de mensagens
    const messages = this.buildMessages(config);
    logger.debug(`[OpenAICompatibleProvider] Mensagens construídas: ${messages.length}`);

    // Parâmetros base da requisição
    const baseParams: OpenAI.Chat.ChatCompletionCreateParams = {
      messages,
      model: config.model,
      temperature: config.temperature,
    };

    // Adicionar parâmetros opcionais
    if (config.maxTokens !== undefined) baseParams.max_tokens = config.maxTokens;
    if (config.topP !== undefined) baseParams.top_p = config.topP;

    logger.debug(`[OpenAICompatibleProvider] Parâmetros da requisição:`, JSON.stringify({
      model: baseParams.model,
      messagesCount: baseParams.messages.length,
      temperature: baseParams.temperature,
      max_tokens: baseParams.max_tokens,
      top_p: baseParams.top_p,
      stream: config.stream
    }, null, 2));

    // Log detalhado das mensagens
    logger.debug(`[OpenAICompatibleProvider] Mensagens completas:`);
    baseParams.messages.forEach((msg, index) => {
      const content = sanitizeForLogs(msg.content as any);
      logger.debug(`  [${index}] role: ${msg.role}, content: "${content}"`);
    });

    // Processar resposta (streaming ou síncrona)
    if (config.stream) {
      logger.info(`[OpenAICompatibleProvider] Iniciando requisição com streaming`);
      try {
        // Resposta em streaming
        const streamResp = await this.client.chat.completions.create({
          ...baseParams,
          stream: true,
          ...(config.thinking?.effort ? ({ reasoning_effort: config.thinking.effort } as any) : {}),
        } as any);
        logger.debug(`[OpenAICompatibleProvider] Streaming iniciado com sucesso`);

        const thinkingMode = config.thinking?.mode ?? 'off';
        const wrapTag = config.thinking?.wrapTag === true;

        let finalText = '';
        let thinkingText = '';
        try {
          for await (const chunk of stream(streamResp as any)) {
            const delta: any = (chunk as any)?.choices?.[0]?.delta ?? {};
            finalText += delta.content ?? '';
            thinkingText += delta.reasoning_content ?? delta.reasoning ?? '';
          }
          logger.debug(`[OpenAICompatibleProvider] Streaming done, preview: ${finalText.substring(0, 100)}...`);
          const usedThinkingAsContent = finalText.trim().length === 0 && thinkingText.trim().length > 0;
          if (usedThinkingAsContent) {
            finalText = thinkingText;
          }

          const fromTags = this.extractThinkingFromTaggedText(finalText);
          finalText = fromTags.finalText;
          if (fromTags.thinking) {
            thinkingText = thinkingText.trim().length > 0 ? `${thinkingText}\n\n${fromTags.thinking}` : fromTags.thinking;
          }

          const metadata: Record<string, unknown> = {
            ...(thinkingMode !== 'off' && thinkingText.trim().length > 0
              ? {
                thinking: thinkingText.trim(),
                thinking_type: 'raw',
                thinking_source: usedThinkingAsContent ? 'field' : (fromTags.thinking ? 'tags' : 'field'),
              }
              : { thinking_source: 'none' }),
            ...(usedThinkingAsContent ? { thinking_used_as_content: true } : {}),
          };

          const content =
            wrapTag && thinkingMode !== 'off' && typeof metadata.thinking === 'string'
              ? `<thinking>${metadata.thinking}</thinking>\n\n${finalText}`
              : finalText;

          return { role: 'assistant', content, metadata } as IProviderResponse;
        } catch (error) {
          logger.error(`[OpenAICompatibleProvider] Erro durante streaming:`, error);
          throw error;
        }
      } catch (error) {
        logger.error(`[OpenAICompatibleProvider] Erro ao criar streaming:`, error);
        throw error;
      }
    }

    // Resposta síncrona
    logger.info(`[OpenAICompatibleProvider] Iniciando requisição síncrona`);
    try {
      const response = await this.client.chat.completions.create({
        ...baseParams,
        stream: false,
        ...(config.thinking?.effort ? ({ reasoning_effort: config.thinking.effort } as any) : {}),
      } as any);
      logger.debug(`[OpenAICompatibleProvider] Requisição síncrona concluída com sucesso`);

      // Extrair conteúdo com fallback para reasoning_content
      const msg = response.choices[0].message as any;
      const thinkingMode = config.thinking?.mode ?? 'off';
      const wrapTag = config.thinking?.wrapTag === true;

      let finalText: string = msg?.content ?? '';
      let thinkingText: string = msg?.reasoning_content ?? msg?.reasoning ?? '';

      const usedThinkingAsContent = finalText.trim().length === 0 && thinkingText.trim().length > 0;
      if (usedThinkingAsContent) {
        finalText = thinkingText;
      }

      const fromTags = this.extractThinkingFromTaggedText(finalText);
      finalText = fromTags.finalText;
      if (fromTags.thinking) {
        thinkingText = thinkingText.trim().length > 0 ? `${thinkingText}\n\n${fromTags.thinking}` : fromTags.thinking;
      }

      const hasThinking = thinkingText.trim().length > 0;
      const thinkingSource = usedThinkingAsContent
        ? 'field'
        : msg?.reasoning_content || msg?.reasoning
          ? 'field'
          : fromTags.thinking
            ? 'tags'
            : 'none';

      const metadata: Record<string, unknown> = {
        model: (response as any).model,
        usage: (response as any).usage,
        raw: response,
        ...(thinkingMode !== 'off' && hasThinking
          ? { thinking: thinkingText.trim(), thinking_type: 'raw', thinking_source: thinkingSource }
          : { thinking_source: 'none' }),
        ...(usedThinkingAsContent ? { thinking_used_as_content: true } : {}),
      };

      const content =
        wrapTag && thinkingMode !== 'off' && typeof metadata.thinking === 'string'
          ? `<thinking>${metadata.thinking}</thinking>\n\n${finalText}`
          : finalText || null;
      logger.debug(`[OpenAICompatibleProvider] Conteúdo recebido: ${content}`);

      return { role: 'assistant', content, metadata } as IProviderResponse;
    } catch (error) {
      logger.error(`[OpenAICompatibleProvider] Erro na requisição síncrona:`, error);
      throw error;
    }
  }
}
