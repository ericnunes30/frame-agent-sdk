/**
 * Parâmetros padrão por provedor (aplicados quando não informados na chamada).
 *
 * - temperature: temperatura do modelo (default sugerido 0.5)
 * - topP: nucleus sampling
 * - maxTokens: limite de tokens de saída
 */
export interface ProviderDefaults {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
}

export interface AgentLLMConfig {
    model: string;
    apiKey: string;
    baseUrl?: string;
    defaults?: ProviderDefaults;
}
