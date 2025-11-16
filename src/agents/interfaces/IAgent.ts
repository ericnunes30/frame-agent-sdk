// src/agents/interfaces/IAgent.ts
import type { AgentInfo, ToolSchema } from '../../promptBuilder';
import type { Message } from '../../memory';
import type { IAgentConfig } from './IAgentConfig';

/**
 * Interface base para todos os agentes do sistema
 * Define o contrato que todos os agentes devem implementar
 */
export interface IAgent {
  /**
   * Identificador único do agente
   */
  readonly id: string;
  
  /**
   * Tipo do agente (chat, react, etc.)
   */
  readonly type: string;
  
  /**
   * Configuração do agente
   */
  readonly config: IAgentConfig;
  
  /**
   * Executa o agente com as mensagens fornecidas
   * @param messages Mensagens de entrada para o agente
   * @param options Opções adicionais para execução
   * @returns Resultado da execução do agente
   */
  execute(
    messages: Message[], 
    options?: AgentExecutionOptions
  ): Promise<AgentExecutionResult>;
  
  /**
   * Configura o agente com novas opções
   * @param config Nova configuração do agente
   */
  configure(config: Partial<IAgentConfig>): void;
  
  /**
   * Obtém informações sobre o agente
   * @returns Informações do agente
   */
  getInfo(): AgentInfo;
  
  /**
   * Valida se o agente está pronto para execução
   * @returns true se o agente estiver pronto, false caso contrário
   */
  validate(): boolean;
  
  /**
   * Reinicia o estado interno do agente
   */
  reset(): void;
}

/**
 * Opções de execução do agente
 */
export interface AgentExecutionOptions {
  /**
   * Instruções adicionais para o agente
   */
  additionalInstructions?: string;
  
  /**
   * Ferramentas disponíveis para o agente
   */
  tools?: ToolSchema[];
  
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
   * Contexto adicional para execução
   */
  context?: Record<string, any>;
}

/**
 * Resultado da execução do agente
 */
export interface AgentExecutionResult {
  /**
   * Conteúdo gerado pelo agente
   */
  content: string | null;
  
  /**
   * Mensagens geradas durante a execução
   */
  messages: Message[];
  
  /**
   * Ferramentas utilizadas durante a execução
   */
  toolsUsed?: string[];
  
  /**
   * Metadados da execução
   */
  metadata?: {
    /**
     * Tempo de execução em milissegundos
     */
    executionTime: number;
    
    /**
     * Timestamp de início
     */
    startTime: Date;
    
    /**
     * Timestamp de término
     */
    endTime: Date;
    
    /**
     * Token utilizados
     */
    tokensUsed?: number;
    
    /**
     * Custo da execução
     */
    cost?: number;
    
    /**
     * Informações adicionais
     */
    [key: string]: any;
  };
  
  /**
   * Indica se a execução foi bem-sucedida
   */
  success: boolean;
  
  /**
   * Mensagem de erro, se houver
   */
  error?: string;
}