// src/agents/interfaces/IAgentRegistry.ts
import type { IAgent, AgentExecutionResult } from './IAgent';
import type { IAgentConfig } from './IAgentConfig';
import type { Message } from '../../memory';

/**
 * Interface para o registro centralizado de agentes
 */
export interface IAgentRegistry {
  /**
   * Registra um agente no registry
   * @param id Identificador único do agente
   * @param config Configuração do agente
   * @param options Opções de registro
   * @throws Error se o ID já existir ou se a configuração for inválida
   */
  register(id: string, config: IAgentConfig, options?: AgentRegistrationOptions): void;
  
  /**
   * Obtém um agente pelo ID
   * @param id Identificador do agente
   * @returns O agente registrado
   * @throws Error se o agente não for encontrado
   */
  get(id: string): IAgent;
  
  /**
   * Cria uma nova instância de agente com a configuração registrada
   * @param id Identificador do agente
   * @param options Opções de criação
   * @returns Nova instância do agente
   * @throws Error se o agente não for encontrado
   */
  create(id: string, options?: AgentCreationOptions): IAgent;
  
  /**
   * Lista todos os agentes registrados
   * @returns Lista de IDs dos agentes registrados
   */
  list(): string[];
  
  /**
   * Verifica se um agente está registrado
   * @param id Identificador do agente
   * @returns true se o agente estiver registrado, false caso contrário
   */
  has(id: string): boolean;
  
  /**
   * Remove um agente do registry
   * @param id Identificador do agente
   * @returns true se o agente foi removido, false caso contrário
   */
  unregister(id: string): boolean;
  
  /**
   * Obtém informações sobre um agente registrado
   * @param id Identificador do agente
   * @returns Informações do agente
   * @throws Error se o agente não for encontrado
   */
  getInfo(id: string): AgentRegistryInfo;
  
  /**
   * Lista todos os tipos de agentes disponíveis
   * @returns Lista de tipos únicos de agentes
   */
  listTypes(): string[];
  
  /**
   * Filtra agentes por tipo
   * @param type Tipo do agente
   * @returns Lista de IDs dos agentes do tipo especificado
   */
  filterByType(type: string): string[];
  
  /**
   * Atualiza a configuração de um agente registrado
   * @param id Identificador do agente
   * @param config Nova configuração
   * @param options Opções de atualização
   * @throws Error se o agente não for encontrado ou a configuração for inválida
   */
  update(id: string, config: Partial<IAgentConfig>, options?: AgentUpdateOptions): void;
  
  /**
   * Executa um agente diretamente do registry
   * @param id Identificador do agente
   * @param messages Mensagens de entrada
   * @param options Opções de execução
   * @returns Resultado da execução
   * @throws Error se o agente não for encontrado ou a execução falhar
   */
  execute(id: string, messages: Message[], options?: AgentExecutionOptions): Promise<AgentExecutionResult>;
  
  /**
   * Obtém estatísticas do registry
   * @returns Estatísticas do registry
   */
  getStats(): AgentRegistryStats;
  
  /**
   * Limpa todos os agentes do registry
   */
  clear(): void;
  
  /**
   * Valida todos os agentes registrados
   * @returns Lista de erros de validação
   */
  validateAll(): string[];
}

/**
 * Opções de registro do agente
 */
export interface AgentRegistrationOptions {
  /**
   * Se deve sobrescrever um agente existente com o mesmo ID
   */
  overwrite?: boolean;
  
  /**
   * Se deve validar a configuração antes de registrar
   */
  validate?: boolean;
  
  /**
   * Metadados adicionais para o agente
   */
  metadata?: Record<string, any>;
}

/**
 * Opções de criação do agente
 */
export interface AgentCreationOptions {
  /**
   * Configurações customizadas para a instância
   */
  customConfig?: Partial<IAgentConfig>;
  
  /**
   * Se deve criar uma instância limpa (sem estado anterior)
   */
  fresh?: boolean;
}

/**
 * Opções de atualização do agente
 */
export interface AgentUpdateOptions {
  /**
   * Se deve validar a nova configuração
   */
  validate?: boolean;
  
  /**
   * Se deve aplicar as alterações apenas em novas instâncias
   */
  applyOnlyToNewInstances?: boolean;
  
  /**
   * Metadados adicionais
   */
  metadata?: Record<string, any>;
}

/**
 * Informações sobre um agente no registry
 */
export interface AgentRegistryInfo {
  /**
   * ID do agente
   */
  id: string;
  
  /**
   * Tipo do agente
   */
  type: string;
  
  /**
   * Provedor do modelo
   */
  provider: string;
  
  /**
   * Modelo do LLM
   */
  model: string;
  
  /**
   * Informações do agente
   */
  agentInfo: {
    name: string;
    goal: string;
    backstory: string;
  };
  
  /**
   * Data de registro
   */
  registeredAt: Date;
  
  /**
   * Número de execuções
   */
  executionCount: number;
  
  /**
   * Metadados adicionais
   */
  metadata?: Record<string, any>;
  
  /**
   * Último erro de execução
   */
  lastError?: string;
  
  /**
   * Timestamp da última execução
   */
  lastExecutionAt?: Date;
}

/**
 * Estatísticas do registry
 */
export interface AgentRegistryStats {
  /**
   * Total de agentes registrados
   */
  totalAgents: number;
  
  /**
   * Total de tipos de agentes
   */
  totalTypes: number;
  
  /**
   * Distribuição por tipo
   */
  distributionByType: Record<string, number>;
  
  /**
   * Total de execuções
   */
  totalExecutions: number;
  
  /**
   * Taxa de sucesso das execuções
   */
  successRate: number;
  
  /**
   * Média de tempo de execução
   */
  averageExecutionTime: number;
  
  /**
   * Agentes mais utilizados
   */
  mostUsedAgents: Array<{
    id: string;
    executions: number;
  }>;
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
   * Contexto adicional para execução
   */
  context?: Record<string, any>;
}