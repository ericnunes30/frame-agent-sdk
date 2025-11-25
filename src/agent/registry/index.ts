// src/agents/registry/index.ts
/**
 * Registry de Agentes do Frame Agent SDK
 * 
 * Exporta o sistema de registro centralizado que permite
 * desenvolvedores registrarem seus agentes customizados.
 */

// Registry principal
export { AgentRegistry, AgentRegistryInstance } from './AgentRegistry';

// Interfaces e tipos
export type {
  IAgentRegistry,
  AgentRegistryInfo,
  AgentRegistryStats,
  AgentRegistrationOptions,
} from '../interfaces/AgentRegistry.interface';