/**
 * Módulo PromptBuilder - Construção Inteligente de Prompts para LLMs
 * 
 * Este módulo fornece um sistema completo para construção de prompts estruturados
 * para modelos de linguagem, oferecendo modos flexíveis, templates reutilizáveis
 * e integração automática com tools e agentes.
 * 
 * ## Componentes Principais
 * 
 * - **PromptBuilder**: Classe principal para construção de prompts
 * - **AgentInfo**: Interface para informações do agente
 * - **PromptBuilderConfig**: Configuração completa para prompts
 * - **PromptMode**: Tipos de modo suportados
 * - **ToolSchema**: Schema de ferramentas para LLMs
 * 
 * ## Uso Básico
 * 
 * ```typescript
 * import { PromptBuilder, AgentInfo } from '@/promptBuilder';
 * 
 * // Definir agente
 * const agentInfo: AgentInfo = {
 *   name: 'Assistente IA',
 *   goal: 'Ajudar usuários com suas tarefas',
 *   backstory: 'Especialista em resolução de problemas'
 * };
 * 
 * // Construir prompt
 * const prompt = PromptBuilder.buildSystemPrompt({
 *   mode: 'chat',
 *   agentInfo
 * });
 * 
 * // Registrar modo customizado
 * PromptBuilder.addPromptMode('custom', (config) => 'Regras customizadas...');
 * ```
 * 
 * @module PromptBuilder
 */

// ==================== Classe Principal ====================

export { 
  /** 
   * Classe utilitária para construção de prompts estruturados.
   * Gerencia modos de prompt, templates e integração com tools.
   */
  PromptBuilder 
} from './promptBuilder';

// ==================== Interfaces e Tipos ====================

export { 
  /** 
   * Informações essenciais do agente para compor o System Prompt.
   * Define nome, objetivo e contexto histórico do agente.
   */
  AgentInfo,
  
  /** 
   * Configuração completa para construção de prompts.
   * Inclui modo, informações do agente, tools e instruções adicionais.
   */
  PromptBuilderConfig,
  
  /** 
   * Tipos de modo suportados pelo sistema de prompts.
   * Define diferentes estratégias de prompting (chat, react, custom).
   */
  PromptMode,
  
  /** 
   * Schema de ferramentas para uso em prompts de LLM.
   * Formato otimizado para comunicação com modelos de linguagem.
   */
  ToolSchema
} from './promptBuilder.interface';

export type { ISkill } from '@/skills/skill.interface';
