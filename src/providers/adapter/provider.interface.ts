/**
 * Interface para definir o contrato de um provedor
 */
/**
 * Parâmetros de configuração aceitos por quaisquer provedores via ProviderAdapter.
 * Observação: para `openaiCompatible`, `baseUrl` é obrigatório.
 */
export interface ProviderConfig {
  // Parâmetros obrigatórios
  model: string;
  messages: Array<{ role: string; content: string }>;
  apiKey: string;
  temperature: number;
  stream: boolean;
  systemPrompt: string;
  // URL base para provedores compatíveis com OpenAI (obrigatória no openaiCompatible)
  baseUrl?: string;
  
  // Parâmetros opcionais
  maxTokens?: number;
  topP?: number;
  
  // Parâmetros para ferramentas (passadas por prompt)
  tools?: Array<{ name: string; description: string; parameters: any }>;
}

/**
 * Resposta normalizada de um provedor de LLM.
 */
export interface IProviderResponse {
  /** A role do autor da mensagem, que será sempre 'assistant'. */
  role: 'assistant';

  /** O conteúdo de texto gerado pelo modelo. */
  content: string | null;

  /**
   * Um campo opcional para metadados adicionais que um provedor
   * específico possa retornar, como uso de tokens ou razão de finalização.
   */
  metadata?: Record<string, unknown>;
}
