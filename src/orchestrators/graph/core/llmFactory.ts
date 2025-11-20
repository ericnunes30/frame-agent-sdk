import { LLM } from '../../../llm';
import type { LLMConfig } from './interfaces/llmConfig.interface';

/**
 * Cria uma instância de LLM a partir de uma configuração.
 * 
 * @param config - Configuração para criar a instância LLM
 * @returns Instância de LLM configurada
 */
export function createLLMFromConfig(config: LLMConfig): LLM {
  return new LLM({
    model: config.model,
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    defaults: config.defaults,
  });
}