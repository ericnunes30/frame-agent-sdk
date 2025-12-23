// src/llm/index.ts
// Exportar AgentLLM
export { AgentLLM, type AgentLLMConfig } from './llm';

// Exportar Interfaces principais (evitando conflitos com registry)
export type {
    IAgent,
    AgentExecutionResult,
    AgentExecutionOptions,
} from './interfaces/IAgent';

export type {
    IAgentConfig,
    AgentType,
} from './interfaces/IAgentConfig';

export { DEFAULT_AGENT_CONFIG, validateAgentConfig } from './interfaces/IAgentConfig';

/**
 * Exporta o cliente LLM de alto nível e sistema de agentes.
 */
