/** Informações essenciais do agente para compor o System Prompt. */
export interface AgentInfo {
  name: string;
  goal: string;
  backstory: string;
}

// Import da interface de tool
import type { ITool } from '@/tools/core/interfaces';

/** 
 * Schema de uma ferramenta para uso no System Prompt.
 * É simplesmente um alias para ITool, pois já contém tudo que precisamos:
 * - name: nome da tool
 * - description: descrição para o LLM
 * - parameterSchema: schema dos parâmetros (será convertido para SAP pelo PromptBuilder)
 */
export type ToolSchema = Pick<ITool, 'name' | 'description' | 'parameterSchema'>;

/** Modo do agente (ex.: 'chat', 'react'). */
export type PromptMode = 'react' | 'chat' | string;

/** Configuração para construir o System Prompt via PromptBuilder. */
export interface PromptBuilderConfig {
  /** O modo do agente a ser utilizado (ex.: 'react' ou 'chat'). */
  mode: PromptMode;
  agentInfo: AgentInfo;
  additionalInstructions?: string;
  /** Tool schemas já formatadas (opcional se toolNames for fornecido) */
  tools?: ToolSchema[];
  /** Nomes de tools registradas no toolRegistry para converter automaticamente (opcional se tools for fornecido) */
  toolNames?: string[];
  taskList?: {
    items: Array<{
      id: string
      title: string
      status: 'pending' | 'in_progress' | 'completed'
    }>
  };
}

