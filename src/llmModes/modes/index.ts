// src/agents/modesAgents/index.ts
/**
 * Modes de Agentes do Frame Agent SDK
 * 
 * Este módulo exporta os modos de agentes que registram comportamentos
 * específicos no PromptBuilder. São diferentes das classes de agentes concretas.
 */

// Importa os registradores de modos
import './chatMode';
import './reactMode';

// Exporta os nomes dos modos como constantes
export const AGENT_MODES = {
  CHAT: 'chat',
  REACT: 'react'
} as const;

export type AgentMode = typeof AGENT_MODES[keyof typeof AGENT_MODES];

// Exporta a classe utilitária AgentMode (com alias para evitar conflito)
export { AgentMode as AgentModeUtil } from './modeRegistry';