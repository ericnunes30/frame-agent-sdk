export interface LLMConfig {
  model: string;
  apiKey: string;
  baseUrl?: string;
  defaults?: {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
}