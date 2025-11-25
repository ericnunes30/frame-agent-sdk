import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { stream } from '@/providers/utils';
import type { ProviderConfig, IProviderResponse } from '@/providers/adapter/providerAdapter.interface';

/**
 * Provedor compatível com OpenAI que aceita `ProviderConfig` diretamente.
 *
 * Observações:
 * - `baseUrl` é obrigatório (ex.: `https://api.openai.com/v1` ou proxy compatível)
 * - Usa `reasoning_content` como fallback quando `content` vier nulo
 */
export class OpenAICompatibleProvider {
  public name = 'openaiCompatible';
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  private buildMessages(config: ProviderConfig): ChatCompletionMessageParam[] {
    return [
      { role: 'system', content: config.systemPrompt },
      ...config.messages.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
    ];
  }

  async chatCompletion(config: ProviderConfig): Promise<IProviderResponse> {
    // Validação: baseUrl é obrigatória para providers compatíveis com OpenAI
    if (!config.baseUrl) {
      throw new Error("'baseUrl' é obrigatório para o provedor openaiCompatible.");
    }
    // Permite override de apiKey/baseUrl por chamada, se fornecida
    if (config.apiKey) {
      this.client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseUrl });
    }

    const messages = this.buildMessages(config);

    const baseParams: OpenAI.Chat.ChatCompletionCreateParams = {
      messages,
      model: config.model,
      temperature: config.temperature,
    };

    if (config.maxTokens !== undefined) baseParams.max_tokens = config.maxTokens;
    if (config.topP !== undefined) baseParams.top_p = config.topP;

    if (config.stream) {
      const streamResp = await this.client.chat.completions.create({
        ...baseParams,
        stream: true,
      });

      let fullContent = '';
      for await (const chunk of stream(streamResp)) {
        const delta: any = (chunk as any)?.choices?.[0]?.delta ?? {};
        fullContent += delta.content ?? delta.reasoning_content ?? '';
      }
      return { role: 'assistant', content: fullContent } as IProviderResponse;
    }

    const response = await this.client.chat.completions.create({
      ...baseParams,
      stream: false,
    });

    const msg = response.choices[0].message as any;
    const content = msg?.content ?? msg?.reasoning_content ?? null;
    return {
      role: 'assistant',
      content,
      metadata: {
        model: (response as any).model,
        usage: (response as any).usage,
        raw: response,
      },
    } as IProviderResponse as any;
  }
}
