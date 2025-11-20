// src/orchestrators/steps/interfaces.ts
import type { IChatHistoryManager } from '../../memory';
import type { LLM } from '../../llm';
import type { ToolSchema, AgentInfo, PromptMode } from '../../promptBuilder';

/** Dependências injetadas nos Steps (memória e cliente LLM). */
export interface StepsDeps {
  memory: IChatHistoryManager;
  llm: LLM;
}

/** Configuração base para construção do system prompt do agente. */
export interface StepsConfig {
  mode: PromptMode;
  agentInfo: AgentInfo;
  additionalInstructions?: string;
  tools?: ToolSchema[];
  taskList?: {
    items: Array<{
      id: string
      title: string
      status: 'pending' | 'in_progress' | 'completed'
    }>
  };
}

/** Estado compartilhado no fluxo de orquestração entre steps. */
export interface OrchestrationState {
  data: Record<string, unknown>;
  final?: string;
  lastModelOutput?: string | null;
}

/** Contexto passado em tempo de execução para cada Step. */
export interface StepContext {
  deps: StepsDeps;
  config: StepsConfig;
  state: OrchestrationState;
}

/** Resultado parcial/final retornado por um Step. */
export interface StepResultUpdate {
  data?: Record<string, unknown>;
  final?: string;
  next?: string;
  halt?: boolean;
}

/** Contrato de um Step executável. */
export interface Step {
  id: string;
  run(ctx: StepContext): Promise<StepResultUpdate | void>;
}

/** Opções para steps que desejam escolher explicitamente o provider por step. */
export interface StepProviderOptions {
  provider: string; // ex.: 'openaiCompatible', 'openai', 'gpt', 'anthropic' (se existir)
  model: string;    // ex.: 'gpt-4o-mini'
  apiKey: string;   // chave do provider alvo (pode ser diferente por step)
  baseUrl?: string; // obrigatório para 'openaiCompatible'
  temperature?: number;
  stream?: boolean;
  topP?: number;
  maxTokens?: number;
}
