import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { stream } from '@/providers/utils';

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
    chatHistory: Array<{ role: string; content: string }>,
    model: string,
    apiKey: string,
    temperature: number,
    useStream: boolean,
    systemPrompt: string,
    maxTokens?: number,
    topP?: number,
  ): Promise<any> {
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
