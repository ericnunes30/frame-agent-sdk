// src/llm/llm.ts
import { ProviderAdapter } from '../providers/adapter/providerAdapter';
import type { Message } from '../memory';
import type { IProviderResponse } from '../providers/adapter/providerAdapter.interface';
import type { ProviderConfig } from '../providers/adapter/providerAdapter.interface';
import { PromptBuilder } from '../promptBuilder';
import type { PromptBuilderConfig, PromptMode, AgentInfo, ToolSchema } from '../promptBuilder';
import { logger } from '../utils';

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
 * Use `invoke` com `mode` e `agentInfo` obrigatórios para gerar o systemPrompt
 * via PromptBuilder internamente (ex.: modo 'react', 'chat', etc.).
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
    
    logger.debug(`LLM instance created with model: ${this.model}`, 'LLM');
  }

  /**
   * Garante que o modo esteja registrado no PromptBuilder, senão lança erro amigável.
   * @private
   */
  private assertModeRegistered(mode: PromptMode): void {
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
   * Invoca o provedor configurado com modo e informações do agente obrigatórios.
   * O systemPrompt é gerado internamente via PromptBuilder a partir do modo e agentInfo.
   *
   * @param args Parâmetros de invocação com mode e agentInfo obrigatórios
   * @returns Conteúdo textual e metadados do provedor (quando disponíveis)
   */
  public async invoke(args: {
    messages: Message[];
    mode?: PromptMode;
    agentInfo?: AgentInfo;
    systemPrompt?: string;
    additionalInstructions?: string;
    tools?: ToolSchema[];
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    stream?: boolean;
    promptConfig?: PromptBuilderConfig;
  }): Promise<{ content: string | null; metadata?: Record<string, unknown> }> {
    logger.debug(`LLM.invoke called with ${args.messages.length} messages`, 'LLM');
    
    // Determina qual systemPrompt usar
    let systemPrompt: string;
    
    if (args.promptConfig) {
      // Usa promptConfig se fornecido
      this.assertModeRegistered(args.promptConfig.mode);
      systemPrompt = PromptBuilder.buildSystemPrompt(args.promptConfig);
    } else if (args.systemPrompt) {
      // Usa systemPrompt direto se fornecido
      systemPrompt = args.systemPrompt;
    } else if (args.mode && args.agentInfo) {
      // Fallback para modo e agentInfo
      this.assertModeRegistered(args.mode);
      const promptConfig: PromptBuilderConfig = {
        mode: args.mode,
        agentInfo: args.agentInfo,
        additionalInstructions: args.additionalInstructions,
        tools: args.tools,
      };
      systemPrompt = PromptBuilder.buildSystemPrompt(promptConfig);
    } else {
      throw new Error('Deve fornecer promptConfig, systemPrompt, ou mode+agentInfo');
    }
    const temperature = args.temperature ?? this.defaults.temperature ?? 0.5;
    const topP = args.topP ?? this.defaults.topP;
    const maxTokens = args.maxTokens ?? this.defaults.maxTokens;
    const stream = args.stream ?? false;

    const config: ProviderConfig = {
      model: this.model,
      apiKey: this.apiKey,
      messages: args.messages,
      systemPrompt,
      temperature,
      stream,
      topP,
      maxTokens,
      baseUrl: this.baseUrl,
    };

    logger.debug(`Calling ProviderAdapter with model: ${config.model}`, 'LLM');
    const resp: IProviderResponse = await ProviderAdapter.chatCompletion(config);
    logger.debug(`ProviderAdapter response received`, 'LLM');
    return { content: resp?.content ?? null, metadata: resp?.metadata };
  }
}
