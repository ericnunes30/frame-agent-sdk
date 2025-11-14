// src/orchestrators/workflows/steps/agentStep/interfaces.ts

/**
 * Configuração de provedor para LLM direto
 */
export interface LLMConfig {
  /**
   * Modelo completo (ex.: 'openaiCompatible-gpt-4o-mini' ou 'openai-gpt-4o')
   */
  model: string;
  
  /**
   * Chave do provedor escolhido
   */
  apiKey: string;
  
  /**
   * URL base para provedores compatíveis
   */
  baseUrl?: string;
  
  /**
   * Valores padrão para temperatura, topP, maxTokens
   */
  defaults?: {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
}

/**
 * Opções do AgentStep
 */
export interface AgentStepOptions {
  /**
   * IDs dos steps dos quais este depende
   */
  dependsOn?: string[];
  
  /**
   * Instruções adicionais para o agente
   */
  additionalInstructions?: string;
  
  /**
   * Ferramentas disponíveis para o agente
   */
  tools?: any[];
  
  /**
   * Temperatura do modelo
   */
  temperature?: number;
  
  /**
   * TopP do modelo
   */
  topP?: number;
  
  /**
   * Máximo de tokens
   */
  maxTokens?: number;
  
  /**
   * Habilita streaming
   */
  stream?: boolean;
  
  /**
   * Timeout da execução em milissegundos
   */
  timeout?: number;
  
  /**
   * Se deve usar os resultados dos steps anteriores como mensagens
   */
  usePreviousResults?: boolean;
  
  /**
   * Dados específicos para extrair do resultado
   */
  extractData?: string | Array<string | { key: string; path?: string; contextKey?: string }>;
  
  /**
   * Contexto adicional para o agente
   */
  context?: Record<string, any>;

  /**
   * Se deve executar as ferramentas automaticamente ou apenas gerar as chamadas
   * - true: Executa as ferramentas e retorna os resultados
   * - false: Apenas gera as chamadas no formato ReAct (padrão)
   */
  executeTools?: boolean;

  /**
   * Número máximo de iterações de execução de ferramentas
   * Aplica-se apenas quando executeTools = true
   */
  maxToolIterations?: number;

  /**
   * Timeout da execução de ferramentas em milissegundos
   * Aplica-se apenas quando executeTools = true
   */
  toolExecutionTimeout?: number;

  /**
   * Configuração direta do LLM para steps que não usam agentes registrados
   */
  llmConfig?: LLMConfig;
  
  /**
   * Configurações específicas do provider para este step
   */
  providerOptions?: {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    stream?: boolean;
  };
}