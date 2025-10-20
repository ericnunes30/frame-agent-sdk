// src/agents/index.ts
// Importing these modules registers their prompt modes via PromptBuilder.addPromptMode
import './chat/chatAgent';
import './react/reactAgent';

// Optional: expose the list of registered mode ids for convenience
export const AGENT_MODES = ['chat', 'react'] as const;

export type AgentMode = typeof AGENT_MODES[number];
/**
 * Exports relacionados aos agentes.
 * Importar módulos específicos registra modos de prompt (ex.: 'react', 'chat').
 */
