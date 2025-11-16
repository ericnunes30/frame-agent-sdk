// src/agents/index.ts
/**
 * Sistema de Agentes do Frame Agent SDK
 * 
 * Este módulo exporta o sistema de agentes que permite:
 * - Registro de agentes customizados criados por desenvolvedores
 * - Integração com workflows através do AgentStep
 * - Uso dos modos de prompt (chat, react) nos agentes
 * 
 * @example
 * ```typescript
 * // Desenvolvedor cria seu agente
 * class MeuAgente implements IAgent {
 *   async execute(messages, options) {
 *     return await this.llm.invoke({ 
 *       messages, 
 *       mode: 'react', // Usa modo do PromptBuilder
 *       tools: this.config.tools 
 *     });
 *   }
 *   // ... implementa outros métodos
 * }
 * 
 * // Registra no AgentRegistry
 * AgentRegistry.register('meu-agente', MeuAgente, config);
 * 
 * // Usa em workflow
 * const workflow = WorkflowBuilder.create()
 *   .addAgentStep('analyze', 'meu-agente', { instructions: 'Analise os dados' })
 *   .execute();
 * ```
 */

// Importa os módulos de modos que registram os comportamentos no PromptBuilder
import './modesAgents';

// Registry centralizado para agentes customizados
export { AgentRegistry, AgentRegistryInstance } from './registry';

// Interfaces e tipos principais
export type {
  IAgent,
  IAgentConfig,
  IAgentRegistry,
  AgentExecutionResult,
  AgentExecutionOptions,
  AgentRegistryInfo,
  AgentRegistryStats,
  AgentRegistrationOptions,
} from './interfaces';

// Tipos utilitários
export type { AgentType } from './interfaces/IAgentConfig';

// Modos de agentes disponíveis
export { AGENT_MODES, AgentMode } from './modesAgents';
export type { AgentMode as AgentModeType } from './modesAgents';

// Constantes e funções utilitárias
export { DEFAULT_AGENT_CONFIG, validateAgentConfig } from './interfaces/IAgentConfig';

// Alias para conveniência
export type {
  IAgentRegistry as AgentRegistryInterface,
} from './interfaces';