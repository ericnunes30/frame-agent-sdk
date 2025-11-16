// src/agents/interfaces/index.ts
/**
 * Interfaces do sistema de agentes
 * 
 * Exporta todas as interfaces e tipos relacionados aos agentes.
 */

// Interfaces principais
export type {
  IAgent,
  AgentExecutionResult,
  AgentExecutionOptions,
} from './IAgent';

export type {
  IAgentConfig,
  AgentType,
  ToolSchema,
  DEFAULT_AGENT_CONFIG,
  validateAgentConfig,
} from './IAgentConfig';

export type {
  IAgentRegistry,
  AgentRegistryInfo,
  AgentRegistryStats,
  AgentRegistrationOptions,
} from './IAgentRegistry';