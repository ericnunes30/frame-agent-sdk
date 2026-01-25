import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { stream } from '@/providers/utils';
import type { ProviderConfig, IProviderResponse } from '@/providers/adapter/providerAdapter.interface';

/**
 * Provedor oficial da OpenAI para integração com modelos GPT.
 * 
 * Esta classe implementa a integração direta com a API oficial da OpenAI,
 * oferecendo suporte completo a todos os recursos da plataforma, incluindo
 * streaming, diferentes modelos e parâmetros avançados.
 * 
 * ## Características
 * 
 * - **API Oficial**: Integração direta com OpenAI
 * - **Streaming Nativo**: Suporte completo a respostas em tempo real
 * - **Todos os Modelos**: GPT-4, GPT-3.5-turbo e variantes
 * - **Parâmetros Avançados**: Temperature, topP, maxTokens, etc.
 * - **Compatibilidade Legada**: Suporte a parâmetros posicionais para testes
 * 
 * @example
 * ```typescript
 * import { OpenAIProvider } from '@/providers';
 * 
 * const provider = new OpenAIProvider('sua-api-key-openai');
 * 
 * const response = await provider.chatCompletion(
 *   [
 *     { role: 'user', content: 'Olá!' }
 *   ],
 *   'gpt-4',
 *   'sua-api-key',
 *   0.7,
 *   false,
 *   'Você é um assistente útil.',
 *   1000
 * );
 * 
 * console.log(response.choices[0].message.content);
 * ```
 * 
 * @remarks
 * - Para uso moderno, considere usar `ProviderAdapter` com `ProviderConfig`
 * - Este provedor espera parâmetros posicionais (compatibilidade com testes legados)
 * - Requer API key válida da OpenAI
 * - Suporta todos os modelos disponíveis na plataforma OpenAI
 * 
 * @see {@link ProviderAdapter} Para interface unificada
 * @see {@link OpenAICompatibleProvider} Para provedores compatíveis
 */
export class OpenAIProvider {
  /** Nome identificador do provedor */
  public name = 'openai';
  
  /** Cliente oficial da OpenAI */
  private client: OpenAI;

  /**
   * Cria uma nova instância do provedor OpenAI.
   * 
   * @param apiKey Chave de API da OpenAI.
   * Deve ser uma string válida fornecida pelo usuário.
   * 
   * @example
   * ```typescript
   * const provider = new OpenAIProvider(process.env.OPENAI_API_KEY!);
   * ```
   * 
   * @throws {Error} Se a API key não for fornecida
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key da OpenAI deve ser fornecida');
    }
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Processa respostas em streaming da API da OpenAI.
   * 
   * Método privado que acumula chunks de conteúdo de streaming em uma
   * resposta completa, fornecendo uma interface consistente independente
   * do modo de resposta (streaming ou não).
   * 
   * @param streamResponse Stream de chunks retornado pela API da OpenAI.
   * 
   * @returns Promise que resolve para a mensagem completa do assistente.
   * 
   * @private
   * 
   * @example
   * ```typescript
   * const stream = await this.client.chat.completions.create({...});
   * const fullResponse = await this._processStream(stream);
   * console.log(fullResponse.content); // Conteúdo completo acumulado
   * ```
   */
  private async _processStream(
    streamResponse: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
  ): Promise<{ role: string; content: string }> {
    let fullContent = '';
    
    // Accumula conteúdo de todos os chunks
    for await (const chunk of stream(streamResponse)) {
      const deltaContent = chunk.choices[0]?.delta?.content ?? '';
      fullContent += deltaContent;
    }
    
    return { role: 'assistant', content: fullContent };
  }

  private buildChatMessagesFromConfig(config: ProviderConfig): ChatCompletionMessageParam[] {
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

  private buildResponsesInputFromConfig(config: ProviderConfig): any[] {
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

  private extractThinkingSummaryFromResponsesOutput(output: any[]): string | null {
    if (!Array.isArray(output)) return null;
    const reasoning = output.find((it) => it?.type === 'reasoning');
    const parts = Array.isArray(reasoning?.summary) ? reasoning.summary : [];
    const text = parts.map((p: any) => p?.text ?? '').join('').trim();
    return text.length > 0 ? text : null;
  }

  private async chatCompletionFromConfig(config: ProviderConfig): Promise<IProviderResponse> {
    if (config.apiKey) {
      this.client = new OpenAI({ apiKey: config.apiKey });
    }

    const thinkingMode = config.thinking?.mode ?? 'off';
    const wrapTag = config.thinking?.wrapTag === true;

    // Preferir Responses API quando for solicitado thinking (summary/raw)
    if (thinkingMode !== 'off') {
      const input = this.buildResponsesInputFromConfig(config);
      const reasoning: any = {
        ...(config.thinking?.effort ? { effort: config.thinking.effort } : {}),
        summary: 'auto',
      };

      if (config.stream) {
        const streamResp = await (this.client as any).responses.create({
          model: config.model,
          input,
          reasoning,
          ...(config.maxTokens !== undefined ? { max_output_tokens: config.maxTokens } : {}),
          ...(config.temperature !== undefined ? { temperature: config.temperature } : {}),
          ...(config.topP !== undefined ? { top_p: config.topP } : {}),
          stream: true,
        });

        let finalText = '';
        let thinkingSummary = '';
        let thinkingRaw = '';

        for await (const event of streamResp as AsyncIterable<any>) {
          if (event?.type === 'response.output_text.delta') {
            finalText += event.delta ?? '';
            continue;
          }
          if (event?.type === 'response.reasoning_summary_part.added') {
            thinkingSummary += event.part?.text ?? '';
            continue;
          }
          if (event?.type === 'response.reasoning_summary_text.delta') {
            thinkingSummary += event.delta ?? '';
            continue;
          }
          if (thinkingMode === 'raw' && event?.type === 'response.reasoning_text.delta') {
            thinkingRaw += event.delta ?? '';
            continue;
          }
        }

        const thinking =
          (thinkingMode === 'raw' ? thinkingRaw : thinkingSummary).trim() ||
          thinkingSummary.trim() ||
          null;

        const metadata: Record<string, unknown> = {
          ...(thinking
            ? {
              thinking,
              thinking_type: thinkingMode === 'raw' && thinkingRaw.trim() ? 'raw' : 'summary',
              thinking_source: 'responses_summary',
            }
            : { thinking_source: 'none' }),
        };

        const content =
          wrapTag && thinking
            ? `<thinking>${thinking}</thinking>\n\n${finalText}`
            : finalText || null;

        return { role: 'assistant', content, metadata } as IProviderResponse;
      }

      const response = await (this.client as any).responses.create({
        model: config.model,
        input,
        reasoning,
        ...(config.maxTokens !== undefined ? { max_output_tokens: config.maxTokens } : {}),
        ...(config.temperature !== undefined ? { temperature: config.temperature } : {}),
        ...(config.topP !== undefined ? { top_p: config.topP } : {}),
        stream: false,
      });

      const thinking = this.extractThinkingSummaryFromResponsesOutput(response?.output) ?? null;
      const metadata: Record<string, unknown> = {
        model: response?.model,
        usage: response?.usage,
        raw: response,
        ...(thinking
          ? { thinking, thinking_type: 'summary', thinking_source: 'responses_summary' }
          : { thinking_source: 'none' }),
      };

      const outputText = response?.output_text ?? '';
      const content = wrapTag && thinking ? `<thinking>${thinking}</thinking>\n\n${outputText}` : outputText || null;

      return { role: 'assistant', content, metadata } as IProviderResponse;
    }

    // Default: Chat Completions API (sem thinking)
    const formattedMessages = this.buildChatMessagesFromConfig(config);
    const openAIParams: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: formattedMessages,
      model: config.model,
      temperature: config.temperature,
    };

    if (config.maxTokens !== undefined) openAIParams.max_tokens = config.maxTokens;
    if (config.topP !== undefined) openAIParams.top_p = config.topP;

    if (config.stream) {
      const streamResponse = await this.client.chat.completions.create({
        ...openAIParams,
        stream: true,
        ...(config.thinking?.effort ? ({ reasoning_effort: config.thinking.effort } as any) : {}),
      } as any);
      const msg = await this._processStream(streamResponse as any);
      return { role: 'assistant', content: msg.content, metadata: { thinking_source: 'none' } } as IProviderResponse;
    }

    const response = await this.client.chat.completions.create({
      ...openAIParams,
      stream: false,
      ...(config.thinking?.effort ? ({ reasoning_effort: config.thinking.effort } as any) : {}),
    } as any);

    const content = (response.choices[0]?.message as any)?.content ?? null;
    return {
      role: 'assistant',
      content,
      metadata: {
        model: (response as any).model,
        usage: (response as any).usage,
        raw: response,
        thinking_source: 'none',
      },
    } as IProviderResponse;
  }

  /**
   * Executa uma chamada de chat completion usando a API da OpenAI.
   * 
   * Este método fornece uma interface direta para a API da OpenAI,
   * suportando tanto respostas síncronas quanto streaming.
   * 
   * @param chatHistory Array de mensagens da conversa.
   * Cada mensagem deve ter role ('system', 'user', 'assistant') e content.
   * 
   * @param model Nome do modelo a ser usado.
   * Exemplos: 'gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo-preview'
   * 
   * @param apiKey Chave de API da OpenAI.
   * Se fornecida, sobrescreve a API key do construtor.
   * 
   * @param temperature Controla a criatividade (0.0 - 2.0).
   * 
   * @param useStream Habilita resposta em streaming.
   * 
   * @param systemPrompt Prompt do sistema para definir comportamento.
   * 
   * @param maxTokens Limite máximo de tokens na resposta.
   * 
   * @param topP Nucleus sampling parameter (0.0 - 1.0).
   * 
   * @returns Resposta da API da OpenAI no formato original.
   * 
   * @throws {Error} Se parâmetros inválidos forem fornecidos
   * @throws {Error} Se a API key for inválida
   * @throws {Error} Se houver erro na comunicação com a API
   * 
   * @example
   * ```typescript
   * // Resposta síncrona
   * const response = await provider.chatCompletion(
   *   [{ role: 'user', content: 'Olá!' }],
   *   'gpt-4',
   *   'sk-...',
   *   0.7,
   *   false,
   *   'Você é um assistente útil.',
   *   1000
   * );
   * 
   * console.log(response.choices[0].message.content);
   * 
   * // Resposta com streaming
   * const streamResponse = await provider.chatCompletion(
   *   [{ role: 'user', content: 'Conte uma história...' }],
   *   'gpt-4',
   *   'sk-...',
   *   0.8,
   *   true,
   *   'Você é um contador de histórias.',
   *   2000
   * );
   * 
   * for await (const chunk of streamResponse) {
   *   process.stdout.write(chunk.content);
   * }
   * ```
   * 
   * @remarks
   * - Para uso moderno, considere ProviderAdapter com ProviderConfig
   * - Este método mantém compatibilidade com código legado
   * - System prompt é enviado como primeira mensagem com role 'system'
   * - Streaming retorna um iterador assíncrono de chunks
   */
  async chatCompletion(
    chatHistoryOrConfig: any,
    model: string,
    apiKey: string,
    temperature: number,
    useStream: boolean,
    systemPrompt: string,
    maxTokens?: number,
    topP?: number,
  ): Promise<any> {
    if (chatHistoryOrConfig && typeof chatHistoryOrConfig === 'object' && Array.isArray(chatHistoryOrConfig.messages)) {
      return this.chatCompletionFromConfig(chatHistoryOrConfig as ProviderConfig);
    }

    const chatHistory = chatHistoryOrConfig as Array<{ role: string; content: string }>;

    // Atualizar cliente se nova API key for fornecida
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }

    const formattedMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }))
    ];

    const openAIParams: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: formattedMessages,
      model,
      temperature,
    };

    if (maxTokens !== undefined) {
      openAIParams.max_tokens = maxTokens;
    }
    if (topP !== undefined) {
      openAIParams.top_p = topP;
    }

    // Early return para o caso de streaming.
    if (useStream) {
      const streamResponse = await this.client.chat.completions.create({
        ...openAIParams,
        stream: true,
      });
      // A lógica de iteração foi extraída para o método _processStream.
      return this._processStream(streamResponse);
    }

    // Lógica padrão para o caso não-streaming.
    const response = await this.client.chat.completions.create({
      ...openAIParams,
      stream: false,
    });

    return response.choices[0].message;
  }
}
