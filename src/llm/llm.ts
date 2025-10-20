// src/llm/llm.ts
import { ProviderAdapter } from '../providers/adapter/providerAdapter';
import type { Message } from '../memory';
import type { IProviderResponse } from '../providers/adapter/provider.interface';
import type { ProviderConfig } from '../providers/adapter/provider.interface';
import { PromptBuilder } from '../promptBuilder';
import type { PromptBuilderConfig, PromptMode, AgentInfo, ToolSchema } from '../promptBuilder';

/**
 * Parâmetros padrão por provedor (aplicados quando não informados na chamada).
 *
 * - temperature: temperatura do modelo (default sugerido 0.5)
 * - topP: nucleus sampling
 * - maxTokens: limite de tokens de saída
 */
interface ProviderDefaults {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}

/**
 * Cliente LLM baseado no ProviderAdapter.
 * Mantém `model` e `apiKey` fixos e aplica opções a cada chamada.
 *
 * Use `invoke` quando já tiver o systemPrompt pronto, ou `invokeWithMode`
 * para gerar o systemPrompt via PromptBuilder (ex.: modo 'react').
 */
export class LLM {
  private readonly model: string;
  private readonly apiKey: string;
  private readonly defaults: ProviderDefaults;
  private readonly baseUrl?: string;

  /**
   * Cria uma instância de LLM com modelo/chave fixos.
   * @param params.model Modelo completo (ex.: 'openaiCompatible-gpt-4o-mini' ou 'openai-gpt-4o')
   * @param params.apiKey Chave do provedor escolhido
   * @param params.defaults Valores padrão (temperature/topP/maxTokens)
   */
  constructor(params: { model: string; apiKey: string; defaults?: ProviderDefaults; baseUrl?: string }) {
    this.model = params.model;
    this.apiKey = params.apiKey;
    this.defaults = params.defaults ?? {};
    this.baseUrl = params.baseUrl;
  }

  /**
   * Invoca o provedor configurado com um conjunto de mensagens.
   * Se `promptConfig` for fornecido, o systemPrompt é gerado via PromptBuilder;
   * caso contrário, usa `systemPrompt` passado.
   * @returns Conteúdo textual e metadados do provedor (quando disponíveis)
   */
  public async invoke(args: {
    messages: Message[];
    systemPrompt?: string;
    /** Se fornecido, sobrescreve `systemPrompt` gerando-o via PromptBuilder. */
    promptConfig?: PromptBuilderConfig;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    stream?: boolean;
  }): Promise<{ content: string | null; metadata?: Record<string, unknown> }> {
    const messages: Message[] = args.messages;
    const systemPrompt = args.promptConfig
      ? PromptBuilder.buildSystemPrompt(args.promptConfig)
      : (args.systemPrompt ?? '');
    const temperature = args.temperature ?? this.defaults.temperature ?? 0.5;
    const topP = args.topP ?? this.defaults.topP;
    const maxTokens = args.maxTokens ?? this.defaults.maxTokens;
    const stream = args.stream ?? false;

    const config: ProviderConfig = {
      model: this.model,
      apiKey: this.apiKey,
      messages,
      systemPrompt,
      temperature,
      stream,
      topP,
      maxTokens,
      baseUrl: this.baseUrl,
    };

    const resp: IProviderResponse = await ProviderAdapter.chatCompletion(config);

    return { content: resp?.content ?? null, metadata: resp?.metadata };
  }

  /**
   * Garante que o modo esteja registrado no PromptBuilder, senão lança erro amigável.
   */
  public assertModeRegistered(mode: PromptMode): void {
    try {
      // Minimal config to trigger builder existence
      PromptBuilder.buildSystemPrompt({
        mode,
        agentInfo: { name: 'validator', goal: 'validate mode', backstory: '' },
      } as unknown as PromptBuilderConfig);
    } catch (e) {
      throw new Error(
        `Prompt mode '${mode}' não está registrado. Importe o módulo correspondente (ex.: 'src/agents') antes de invocar.`
      );
    }
  }

  /**
   * Invoca o provedor gerando o systemPrompt internamente a partir do modo do agente.
   * @param args Parâmetros de entrada (mensagens, agentInfo, tools, etc.)
   * @param modeAgent Modo do agente (ex.: 'react')
   */
  public async invokeWithMode(
    args: {
      messages: Message[];
      agentInfo: AgentInfo;
      additionalInstructions?: string;
      tools?: ToolSchema[];
      temperature?: number;
      topP?: number;
      maxTokens?: number;
      stream?: boolean;
    },
    modeAgent: PromptMode,
  ): Promise<{ content: string | null; metadata?: Record<string, unknown> }> {
    this.assertModeRegistered(modeAgent);

    const promptConfig: PromptBuilderConfig = {
      mode: modeAgent,
      agentInfo: args.agentInfo,
      additionalInstructions: args.additionalInstructions,
      tools: args.tools,
    } as PromptBuilderConfig;

    return this.invoke({
      messages: args.messages,
      promptConfig,
      temperature: args.temperature,
      topP: args.topP,
      maxTokens: args.maxTokens,
      stream: args.stream,
    });
  }
}
