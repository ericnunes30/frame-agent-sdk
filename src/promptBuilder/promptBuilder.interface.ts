/** Informações essenciais do agente para compor o System Prompt. */
export interface AgentInfo {
  name: string;
  goal: string;
  backstory: string;
}

/** Descreve uma ferramenta disponível para o agente (JSON Schema). */
export interface ToolSchema {
  name: string;
  description: string;
  parameters: any; 
}

/** Modo do agente (ex.: 'chat', 'react'). */
export type PromptMode = 'react' | 'chat' | string;

/** Configuração para construir o System Prompt via PromptBuilder. */
export interface PromptBuilderConfig {
  /** O modo do agente a ser utilizado (ex.: 'react' ou 'chat'). */
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

