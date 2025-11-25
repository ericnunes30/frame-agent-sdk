// src/agents/registry/AgentRegistry.interface.ts
import type { IAgent, IAgentConfig } from '@/agent/interfaces';

/**
 * Interface para o registro de agentes customizados
 * 
 * Esta interface permite que desenvolvedores registrem seus próprios agentes
 * que podem ser usados posteriormente em workflows ou diretamente.
 */
export interface IAgentRegistry {
  /**
   * Registra um agente customizado
   * @param name Nome único do agente
   * @param agentClass Classe do agente que implementa IAgent
   * @param config Configuração padrão do agente
   * @returns true se o registro foi bem-sucedido, false caso contrário
   */
  register(name: string, agentClass: new (config: IAgentConfig) => IAgent, config: IAgentConfig): boolean;

  /**
   * Obtém um agente registrado
   * @param name Nome do agente
   * @param config Configuração opcional para sobrescrever a padrão
   * @returns Instância do agente ou null se não encontrado
   */
  get(name: string, config?: Partial<IAgentConfig>): IAgent | null;

  /**
   * Lista todos os agentes registrados
   * @returns Array com informações dos agentes registrados
   */
  list(): AgentRegistryInfo[];

  /**
   * Remove um agente do registro
   * @param name Nome do agente
   * @returns true se a remoção foi bem-sucedida, false caso contrário
   */
  unregister(name: string): boolean;

  /**
   * Verifica se um agente está registrado
   * @param name Nome do agente
   * @returns true se o agente está registrado, false caso contrário
   */
  has(name: string): boolean;

  /**
   * Limpa todos os registros
   */
  clear(): void;

  /**
   * Obtém estatísticas do registro
   * @returns Estatísticas sobre os agentes registrados
   */
  getStats(): AgentRegistryStats;
}

/**
 * Informações sobre um agente registrado
 */
export interface AgentRegistryInfo {
  /**
   * Nome do agente
   */
  name: string;

  /**
   * Tipo do agente
   */
  type: string;

  /**
   * Descrição do agente
   */
  description?: string;

  /**
   * Configuração padrão do agente
   */
  config: IAgentConfig;

  /**
   * Data de registro
   */
  registeredAt: Date;

  /**
   * Número de vezes que o agente foi usado
   */
  usageCount: number;
}

/**
 * Estatísticas do registro de agentes
 */
export interface AgentRegistryStats {
  /**
   * Total de agentes registrados
   */
  totalAgents: number;

  /**
   * Agentes por tipo
   */
  agentsByType: Record<string, number>;

  /**
   * Agentes mais usados
   */
  mostUsed: Array<{ name: string; usageCount: number }>;

  /**
   * Data da criação do registro
   */
  createdAt: Date;
}

/**
 * Opções para registro de agentes
 */
export interface AgentRegistrationOptions {
  /**
   * Descrição do agente
   */
  description?: string;

  /**
   * Se deve sobrescrever se já existir
   */
  overwrite?: boolean;
}