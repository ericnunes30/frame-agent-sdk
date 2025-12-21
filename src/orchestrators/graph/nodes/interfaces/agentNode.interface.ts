import type { PromptBuilderConfig, PromptMode, AgentInfo, ToolSchema } from '@/promptBuilder';
import type { AgentLLM, AgentLLMConfig } from '@/agent';
import type { Message } from '@/memory';
import type { ContextHooks } from '@/memory';

export interface IAgentNodeOptions {
  llm: AgentLLM | AgentLLMConfig;
  promptConfig?: PromptBuilderConfig;
  mode?: PromptMode;
  agentInfo?: AgentInfo;
  additionalInstructions?: string;
  tools?: ToolSchema[];
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  /** 
   * Mensagens customizadas para usar ao invés do histórico do engine.
   * Útil para contextos isolados ou casos especiais.
   * Se fornecido, sobrescreve o resultado de engine.getMessagesForLLM()
   */
  customMessages?: Message[];
  /**
   * Se true, automaticamente detecta e executa tools na saída do LLM.
   * Isso integra createToolDetectionNode e createToolExecutorNode no agentNode.
   * Padrão: false (apenas invoca LLM sem executar tools)
   */
  autoExecuteTools?: boolean;
  /**
   * Lista de tarefas para injetar no system prompt.
   * Se não fornecido aqui, o agentNode tentará extrair de state.metadata.taskList
   */
  taskList?: { items: Array<{ id: string; title: string; status: 'pending' | 'in_progress' | 'completed' }> };
  /**
   * Se true, não adiciona automaticamente a saída do LLM ao histórico do engine.
   * Útil para workflows onde o commit de memória é condicional (ex: Generator-Critic)
   * @default false
   */
  skipMemoryCommit?: boolean;

  /**
   * Hooks de contexto para trimming/rewrite e retry (ex.: overflow handling).
   * Permite que apps (ex.: code-cli) pluguem estratégias avançadas sem wrappers de Graph.
   */
  contextHooks?: ContextHooks;
}
