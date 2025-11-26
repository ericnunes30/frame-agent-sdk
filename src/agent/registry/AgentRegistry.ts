// src/agents/registry/AgentRegistry.ts
import type {
  IAgentRegistry,
  AgentRegistryInfo,
  AgentRegistryStats,
  AgentRegistrationOptions
} from '../interfaces/AgentRegistry.interface';
import type { IAgent, IAgentConfig } from '@/agent/interfaces';
import { logger } from '@/utils/logger';

/**
 * Implementação do sistema de registro centralizado de agentes de IA.
 * 
 * Esta classe implementa a interface IAgentRegistry fornecendo um sistema
 * completo para registrar, gerenciar, descobrir e executar agentes de IA
 * de forma centralizada e organizada.
 * 
 * ## Características Principais
 * 
 * - **Padrão Singleton**: Uma única instância global para todo o sistema
 * - **Registro Flexível**: Suporte a agentes customizados com configurações variadas
 * - **Descoberta Dinâmica**: Métodos para listar, filtrar e encontrar agentes
 * - **Instanciação Controlada**: Criação de instâncias com configurações customizadas
 * - **Estatísticas Integradas**: Rastreamento automático de uso e performance
 * - **Validação Automática**: Verificação de configurações durante registro
 * 
 * ## Casos de Uso
 * 
 * - **Bibliotecas de Agentes**: Organizar coleções de agentes reutilizáveis
 * - **Sistemas Multi-Agente**: Coordenar múltiplos agentes especializados
 * - **Workflows Dinâmicos**: Selecionar agentes baseados em contexto
 * - **Plugin Systems**: Suporte a sistemas de plugins de agentes
 * - **Load Balancing**: Distribuir carga entre instâncias de agentes
 * 
 * @example
 * ```typescript
 * // 1. Criar agente customizado
 * class DataAnalysisAgent implements IAgent {
 *   public readonly id = 'data-analyzer';
 *   public readonly type = 'analysis';
 *   public readonly config: IAgentConfig;
 * 
 *   constructor(config: IAgentConfig) {
 *     this.config = config;
 *   }
 * 
 *   async execute(messages: Message[], options?: AgentExecutionOptions): Promise<AgentExecutionResult> {
 *     // Lógica específica de análise de dados
 *     const result = await this.analyzeData(messages);
 *     return {
 *       content: result.summary,
 *       messages: [...messages, { role: 'assistant', content: result.summary }],
 *       success: true,
 *       metadata: { analysisType: 'statistical', confidence: result.confidence }
 *     };
 *   }
 * 
 *   // ... outros métodos da interface IAgent
 * }
 * 
 * // 2. Registrar no sistema
 * AgentRegistry.getInstance().register('data-analyzer', DataAnalysisAgent, {
 *   type: 'analysis',
 *   provider: 'openai',
 *   model: 'gpt-4',
 *   agentInfo: {
 *     name: 'Data Analyzer',
 *     role: 'Statistical analysis expert',
 *     backstory: 'Specialized in data analysis and statistical modeling'
 *   },
 *   llmConfig: { temperature: 0.3 },
 *   tools: [statisticsTool, visualizationTool]
 * }, {
 *   description: 'Agente especializado em análise estatística de dados',
 *   validate: true
 * });
 * 
 * // 3. Usar em workflows
 * const registry = AgentRegistry.getInstance();
 * 
 * // Listar agentes disponíveis
 * const agents = registry.list();
 * console.log('Agentes disponíveis:', agents);
 * 
 * // Filtrar por tipo
 * const analysisAgents = registry.filterByType('analysis');
 * 
 * // Executar diretamente
 * const result = await registry.execute('data-analyzer', [
 *   { role: 'user', content: 'Analyze this dataset: [1,2,3,4,5]' }
 * ], { temperature: 0.2 });
 * 
 * console.log('Resultado:', result.content);
 * ```
 * 
 * @see {@link IAgentRegistry} Para interface completa do registry
 * @see {@link IAgent} Para interface dos agentes
 * @see {@link IAgentConfig} Para configuração de agentes
 */
export class AgentRegistry implements IAgentRegistry {
  /** Instância singleton do registry */
  private static instance: AgentRegistry;

  /** Mapa interno de agentes registrados */
  private agents: Map<string, {
    /** Classe construtora do agente */
    agentClass: new (config: IAgentConfig) => IAgent;
    /** Configuração padrão do agente */
    config: IAgentConfig;
    /** Descrição opcional do agente */
    description?: string;
    /** Data de registro */
    registeredAt: Date;
    /** Contador de uso */
    usageCount: number;
  }> = new Map();

  /** Estatísticas do registry */
  private stats: AgentRegistryStats;

  /**
   * Construtor privado para implementar padrão Singleton.
   * 
   * Para obter a instância do registry, use AgentRegistry.getInstance().
   * O construtor pode ser usado diretamente apenas para testes unitários.
   * 
   * @example
   * ```typescript
   * // Para uso normal (recomendado)
   * const registry = AgentRegistry.getInstance();
   * 
   * // Para testes (permite múltiplas instâncias)
   * const testRegistry = new AgentRegistry();
   * ```
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
   * Obtém a instância singleton do AgentRegistry.
   * 
   * Método factory que garante que apenas uma instância do registry
   * exista durante toda a aplicação, proporcionando consistência
   * global no registro e descoberta de agentes.
   * 
   * @returns A instância singleton do AgentRegistry.
   * 
   * @example
   * ```typescript
   * const registry = AgentRegistry.getInstance();
   * 
   * // Todas as chamadas retornam a mesma instância
   * const registry1 = AgentRegistry.getInstance();
   * const registry2 = AgentRegistry.getInstance();
   * 
   * console.log(registry1 === registry2); // true
   * ```
   */
  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  /**
   * Registra um agente customizado no sistema.
   * 
   * Adiciona um novo agente ao registry com sua configuração e metadados,
   * permitindo que seja descoberto, instanciado e executado posteriormente.
   * 
   * @param name Nome único do agente no registry.
   * @param agentClass Classe construtora do agente (deve implementar IAgent).
   * @param config Configuração completa do agente.
   * @param options Opções adicionais de registro.
   * 
   * @returns true se o registro foi bem-sucedido, false caso contrário.
   * 
   * @example
   * ```typescript
   * const registry = AgentRegistry.getInstance();
   * 
   * // Registro básico
   * registry.register('chat-assistant', ChatAgent, {
   *   type: 'chat',
   *   provider: 'openai',
   *   model: 'gpt-3.5-turbo',
   *   agentInfo: { name: 'Assistant', goal: 'Help users', backstory: 'Friendly AI' }
   * });
   * 
   * // Registro com opções
   * registry.register('researcher', ResearchAgent, researchConfig, {
   *   description: 'Specialized research agent',
   *   overwrite: true,
   *   validate: true
   * });
   * ```
   */
  public register(
    name: string,
    agentClass: new (config: IAgentConfig) => IAgent,
    config: IAgentConfig,
    options: AgentRegistrationOptions = {}
  ): boolean {
    try {
      // 1. Validações básicas
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

      return true;

    } catch (error) {
      logger.error(`Erro ao registrar agente '${name}': ${error instanceof Error ? error.message : String(error)}`, 'AgentRegistry');
      return false;
    }
  }

  /**
   * Obtém um agente registrado
   */
  public get(name: string, config?: Partial<IAgentConfig>): IAgent | null {
    const registration = this.agents.get(name);

    if (!registration) {
      logger.warn(`Agente '${name}' não encontrado no registro`, 'AgentRegistry');
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
      logger.error(`Erro ao criar instância do agente '${name}': ${error instanceof Error ? error.message : String(error)}`, 'AgentRegistry');
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
      logger.warn(`Agente '${name}' não encontrado para remoção`, 'AgentRegistry');
      return false;
    }

    this.agents.delete(name);
    this.updateStats();

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
