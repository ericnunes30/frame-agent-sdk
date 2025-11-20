// src/agents/registry/AgentRegistry.ts
import type { 
  IAgentRegistry, 
  AgentRegistryInfo, 
  AgentRegistryStats, 
  AgentRegistrationOptions 
} from './AgentRegistry.interface';
import type { IAgent, IAgentConfig } from '../interfaces';

/**
 * Registro centralizado de agentes customizados
 * 
 * Permite que desenvolvedores registrem seus próprios agentes que implementam IAgent
 * e os utilizem posteriormente em workflows ou diretamente.
 * 
 * @example
 * ```typescript
 * // Desenvolvedor cria seu agente
 * class MeuAgente implements IAgent {
 *   async execute(messages, options) {
 *     // Lógica do agente usando modos do PromptBuilder
 *     return await this.llm.invoke({ 
 *       messages, 
 *       mode: 'react',
 *       tools: this.config.tools 
 *     });
 *   }
 *   // ... outros métodos
 * }
 * 
 * // Registra no AgentRegistry
 * AgentRegistry.register('meu-agente', MeuAgente, {
 *   type: 'custom',
 *   provider: 'openai',
 *   model: 'gpt-4o-mini',
 *   agentInfo: { name: 'Meu Agente', goal: 'Analisar dados' }
 * });
 * 
 * // Usa em workflow
 * const workflow = WorkflowBuilder.create()
 *   .addAgentStep('analyze', 'meu-agente', { instructions: 'Analise os dados' })
 *   .execute();
 * ```
 */
export class AgentRegistry implements IAgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, {
    agentClass: new (config: IAgentConfig) => IAgent;
    config: IAgentConfig;
    description?: string;
    registeredAt: Date;
    usageCount: number;
  }> = new Map();

  private stats: AgentRegistryStats;

  /**
   * Construtor - pode ser usado diretamente para testes
   * Use getInstance() para obter o singleton
   */
  public constructor() {
    this.stats = {
      totalAgents: 0,
      agentsByType: {},
      mostUsed: [],
      createdAt: new Date()
    };
  }

  /**
   * Obtém a instância singleton do AgentRegistry
   */
  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  /**
   * Registra um agente customizado
   */
  public register(
    name: string, 
    agentClass: new (config: IAgentConfig) => IAgent, 
    config: IAgentConfig,
    options: AgentRegistrationOptions = {}
  ): boolean {
    try {
      // Validações básicas
      if (!name || name.trim() === '') {
        throw new Error('Nome do agente é obrigatório');
      }

      if (!agentClass) {
        throw new Error('Classe do agente é obrigatória');
      }

      if (!config) {
        throw new Error('Configuração do agente é obrigatória');
      }

      // Verifica se já existe
      if (this.agents.has(name) && !options.overwrite) {
        throw new Error(`Agente '${name}' já está registrado. Use overwrite: true para sobrescrever.`);
      }

      // Valida a configuração criando uma instância temporária
      try {
        const tempAgent = new agentClass(config);
        if (typeof tempAgent.execute !== 'function') {
          throw new Error('Agente deve implementar o método execute');
        }
        if (typeof tempAgent.validate !== 'function') {
          throw new Error('Agente deve implementar o método validate');
        }
        if (typeof tempAgent.getInfo !== 'function') {
          throw new Error('Agente deve implementar o método getInfo');
        }
      } catch (error) {
        throw new Error(`Agente inválido: ${error instanceof Error ? error.message : String(error)}`);
      }

      // Registra o agente
      this.agents.set(name, {
        agentClass,
        config: { ...config },
        description: options.description,
        registeredAt: new Date(),
        usageCount: this.agents.get(name)?.usageCount || 0
      });

      // Atualiza estatísticas
      this.updateStats();

      console.log(`[AgentRegistry] Agente '${name}' registrado com sucesso`);
      return true;

    } catch (error) {
      console.error(`Erro ao registrar agente '${name}': ${error instanceof Error ? error.message : String(error)}`, 'AgentRegistry');
      return false;
    }
  }

  /**
   * Obtém um agente registrado
   */
  public get(name: string, config?: Partial<IAgentConfig>): IAgent | null {
    const registration = this.agents.get(name);
    
    if (!registration) {
      console.warn(`Agente '${name}' não encontrado no registro`, 'AgentRegistry');
      return null;
    }

    try {
      // Mescla configurações se fornecidas
      const finalConfig = config 
        ? { ...registration.config, ...config }
        : registration.config;

      // Cria e retorna instância do agente
      const agent = new registration.agentClass(finalConfig);
      
      // Incrementa contador de uso
      registration.usageCount++;
      this.updateStats();

      return agent;

    } catch (error) {
      console.error(`Erro ao criar instância do agente '${name}': ${error instanceof Error ? error.message : String(error)}`, 'AgentRegistry');
      return null;
    }
  }

  /**
   * Lista todos os agentes registrados
   */
  public list(): AgentRegistryInfo[] {
    return Array.from(this.agents.entries()).map(([name, data]) => ({
      name,
      type: data.config.type,
      description: data.description,
      config: { ...data.config },
      registeredAt: new Date(data.registeredAt),
      usageCount: data.usageCount
    }));
  }

  /**
   * Remove um agente do registro
   */
  public unregister(name: string): boolean {
    if (!this.agents.has(name)) {
      console.warn(`Agente '${name}' não encontrado para remoção`, 'AgentRegistry');
      return false;
    }

    this.agents.delete(name);
    this.updateStats();
    
    console.log(`Agente '${name}' removido do registro`, 'AgentRegistry');
    return true;
  }

  /**
   * Verifica se um agente está registrado
   */
  public has(name: string): boolean {
    return this.agents.has(name);
  }

  /**
   * Limpa todos os registros
   */
  public clear(): void {
    this.agents.clear();
    this.stats = {
      totalAgents: 0,
      agentsByType: {},
      mostUsed: [],
      createdAt: new Date()
    };
    console.log('Registro de agentes limpo', 'AgentRegistry');
  }

  /**
   * Obtém estatísticas do registro
   */
  public getStats(): AgentRegistryStats {
    return { ...this.stats };
  }

  /**
   * Atualiza as estatísticas do registro
   */
  private updateStats(): void {
    const agents = this.list();
    
    this.stats.totalAgents = agents.length;
    
    // Conta por tipo
    this.stats.agentsByType = agents.reduce((acc, agent) => {
      acc[agent.type] = (acc[agent.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Ordena por uso
    this.stats.mostUsed = agents
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5)
      .map(agent => ({
        name: agent.name,
        usageCount: agent.usageCount
      }));
  }
}

// Exporta a instância singleton
export const AgentRegistryInstance = AgentRegistry.getInstance();
