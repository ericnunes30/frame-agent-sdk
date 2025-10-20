import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { stream } from '../utils';

/**
 * Provedor oficial da OpenAI.
 *
 * Observações:
 * - Espera parâmetros posicionais (compatibilidade legada com testes)
 * - Para uso moderno, prefira `openaiCompatible` com `ProviderConfig` unificado
 */
export class OpenAIProvider {
  public name = 'openai';
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Processa a resposta de streaming da API, acumulando os chunks de conteúdo.
   * @param streamResponse O stream de dados retornado pela API da OpenAI.
   * @returns Uma promessa que resolve para a mensagem completa do assistente.
   * @private
   */
  private async _processStream(
    streamResponse: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
  ): Promise<{ role: string; content: string }> {
    let fullContent = '';
    for await (const chunk of stream(streamResponse)) {
      fullContent += chunk.choices[0]?.delta?.content ?? '';
    }
    return { role: 'assistant', content: fullContent };
  }

  /**
   * Método para interagir com o modelo de linguagem da OpenAI.
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
