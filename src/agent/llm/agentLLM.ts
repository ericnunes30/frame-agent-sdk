// src/llm/llm.ts
import { ProviderAdapter } from '../../providers/adapter/providerAdapter';
import type { Message } from '../../memory';
import type { IProviderResponse } from '../../providers/adapter/providerAdapter.interface';
import type { ProviderConfig } from '../../providers/adapter/providerAdapter.interface';
import { PromptBuilder } from '../../promptBuilder';
import type { PromptBuilderConfig, PromptMode, AgentInfo, ToolSchema } from '../../promptBuilder';

import type { AgentLLMConfig, ProviderDefaults } from '../interfaces/agentLLM.interface';

/**
 * Cliente AgentLLM baseado no ProviderAdapter.
 * Mantém `model` e `apiKey` fixos e aplica opções a cada chamada.
 *
 * Use `invoke` com `mode` e `agentInfo` obrigatórios para gerar o systemPrompt
 * via PromptBuilder internamente (ex.: modo 'react', 'chat', etc.).
 */
export class AgentLLM {
  private readonly model: string;
  private readonly apiKey: string;
  private readonly defaults: ProviderDefaults;
  private readonly baseUrl?: string;

  /**
   * Cria uma instância de AgentLLM a partir de uma configuração.
   * @param config Configuração para criar a instância AgentLLM
   */
  static fromConfig(config: AgentLLMConfig): AgentLLM {
    return new AgentLLM({
      model: config.model,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      defaults: config.defaults,
    });
  }

  /**
   * Cria uma instância de AgentLLM com modelo/chave fixos.
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
    taskList?: { items: Array<{ id: string; title: string; status: 'pending' | 'in_progress' | 'completed' }> };
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    stream?: boolean;
    promptConfig?: PromptBuilderConfig;
  }): Promise<{ content: string | null; metadata?: Record<string, unknown> }> {


    // Determina qual systemPrompt usar delegando para PromptBuilder
    const promptResult = PromptBuilder.determineSystemPrompt(args);
    const systemPrompt = promptResult.systemPrompt;
    // const promptSource = promptResult.source; // unused but available for debugging

    const spPreview = systemPrompt.length > 1000 ? `${systemPrompt.slice(0, 1000)}...` : systemPrompt;
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

    const resp: IProviderResponse = await ProviderAdapter.chatCompletion(config);
    return { content: resp?.content ?? null, metadata: resp?.metadata };
  }
}
