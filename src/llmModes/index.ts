// src/llmModes/index.ts
/**
 * Sistema de Modos LLM do Frame Agent SDK
 * 
 * Este módulo exporta os modos de prompt disponíveis que podem ser
 * utilizados com AgentLLM e outros componentes do SDK.
 */

// Importa os módulos de modos que registram os comportamentos no PromptBuilder
import './modes';

// Modos de agentes disponíveis
export { AGENT_MODES, AgentMode, AgentModeUtil } from './modes';
export type { AgentMode as AgentModeType } from './modes';