// src/agents/registry/AgentRegistry.interface.ts
import type { IAgent, IAgentConfig } from '@/agent/interfaces';

/**
 * Interface para sistema de registro de agentes customizados.
 * 
 * Define o contrato para um registry centralizado que permite
 * registrar, descobrir, gerenciar e instanciar agentes de IA
 * de forma organizada e reutilizável.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Registro Centralizado**: Cadastro de agentes com configurações padrão
 * - **Descoberta Dinâmica**: Localização de agentes por nome ou tipo
 * - **Instanciação Controlada**: Criação de agentes com configurações customizadas
 * - **Gerenciamento de Estado**: Estatísticas de uso e informações de registro
 * - **Limpeza e Manutenção**: Remoção individual ou em lote de registros
 * 
 * ## Casos de Uso
 * 
 * - **Bibliotecas de Agentes**: Organizar coleções de agentes reutilizáveis
 * - **Workflows Dinâmicos**: Selecionar agentes baseados em contexto
 * - **Configuração Centralizada**: Gerenciar configurações padrão
 * - **Analytics**: Rastrear uso e performance de agentes
 * - **Plugin Systems**: Suporte a sistemas de plugins de agentes
 * 
 * @example
 * ```typescript
 * // Registrar agente customizado
 * registry.register('researcher', ResearchAgent, {
 *   type: 'react',
 *   provider: 'openai',
 *   model: 'gpt-4',
 *   agentInfo: {
 *     name: 'Researcher',
 *     role: 'Pesquisador especializado',
 *     backstory: 'Especializado em encontrar informações precisas'
 *   }
 * });
 * 
 * // Usar agente registrado
 * const agent = registry.get('researcher', {
 *   llmConfig: { temperature: 0.3 }
 * });
 * 
 * if (agent) {
 *   const result = await agent.execute(messages);
 * }
 * 
 * // Listar agentes disponíveis
 * const agents = registry.list();
 * console.log('Agentes disponíveis:', agents.map(a => a.name));
 * 
 * // Verificar estatísticas
 * const stats = registry.getStats();
 * console.log('Total de agentes:', stats.totalAgents);
 * console.log('Mais usado:', stats.mostUsed);
 * ```
 * 
 * @see {@link IAgent} Para interface dos agentes
 * @see {@link IAgentConfig} Para configuração de agentes
 * @see {@link AgentRegistryInfo} Para informações de registro
 * @see {@link AgentRegistryStats} Para estatísticas
 */
export interface IAgentRegistry {
  /**
   * Registra um agente customizado no sistema.
   * 
   * Adiciona um novo agente ao registry com sua configuração padrão,
   * permitindo que seja descoberto e instanciado posteriormente.
   * 
   * @param name Nome único do agente no registry.
   * Deve ser único para evitar conflitos. Usado para identificação.
   * 
   * @param agentClass Classe construtora do agente.
   * Deve implementar IAgent e aceitar IAgentConfig no construtor.
   * 
   * @param config Configuração padrão do agente.
   * Usada como base quando o agente é instanciado sem configurações customizadas.
   * 
   * @returns true se o registro foi bem-sucedido, false caso contrário.
   * 
   * @example
   * ```typescript
   * // Registrar agente simples
   * registry.register('chat-assistant', ChatAgent, {
   *   type: 'chat',
   *   provider: 'openai',
   *   model: 'gpt-3.5-turbo',
   *   agentInfo: {
   *     name: 'Chat Assistant',
   *     role: 'Assistente conversacional',
   *     backstory: 'Especialista em conversas naturais'
   *   }
   * });
   * 
   * // Registrar com opções
   * registry.register('researcher', ResearchAgent, researchConfig, {
   *   description: 'Agente especializado em pesquisa',
   *   overwrite: true
   * });
   * ```
   * 
   * @see {@link AgentRegistrationOptions} Para opções de registro
   */
  register(name: string, agentClass: new (config: IAgentConfig) => IAgent, config: IAgentConfig): boolean;

  /**
   * Obtém um agente registrado e retorna uma instância configurada.
   * 
   * Localiza o agente pelo nome e cria uma nova instância com
   * a configuração fornecida (ou a padrão se não especificada).
   * 
   * @param name Nome do agente no registry.
   * 
   * @param config Configuração opcional para sobrescrever a padrão.
   * Propriedades fornecidas substituem as da configuração padrão.
   * 
   * @returns Instância do agente configurado ou null se não encontrado.
   * 
   * @example
   * ```typescript
   * // Usar configuração padrão
   * const agent1 = registry.get('chat-assistant');
   * 
   * // Usar configuração customizada
   * const agent2 = registry.get('researcher', {
   *   llmConfig: { temperature: 0.2 },
   *   additionalInstructions: 'Seja mais técnico'
   * });
   * 
   * if (agent2) {
   *   const result = await agent2.execute(messages);
   * }
   * ```
   */
  get(name: string, config?: Partial<IAgentConfig>): IAgent | null;

  /**
   * Lista todos os agentes registrados no sistema.
   * 
   * Retorna array com informações detalhadas sobre cada agente,
   * incluindo metadados como tipo, descrição, data de registro e uso.
   * 
   * @returns Array com informações dos agentes registrados.
   * 
   * @example
   * ```typescript
   * const agents = registry.list();
   * 
   * agents.forEach(agent => {
   *   console.log(`Nome: ${agent.name}`);
   *   console.log(`Tipo: ${agent.type}`);
   *   console.log(`Descrição: ${agent.description}`);
   *   console.log(`Usado ${agent.usageCount} vezes`);
   *   console.log(`Registrado em: ${agent.registeredAt}`);
   * });
   * ```
   * 
   * @see {@link AgentRegistryInfo} Para formato das informações
   */
  list(): AgentRegistryInfo[];

  /**
   * Remove um agente do registro.
   * 
   * Remove permanentemente um agente do registry, liberando
   * o nome para possível reuso.
   * 
   * @param name Nome do agente a ser removido.
   * 
   * @returns true se a remoção foi bem-sucedida, false caso contrário.
   * 
   * @example
   * ```typescript
   * // Remover agente específico
   * const removed = registry.unregister('old-agent');
   * if (removed) {
   *   console.log('Agente removido com sucesso');
   * }
   * 
   * // Verificar se ainda existe
   * if (!registry.has('old-agent')) {
   *   console.log('Agente não está mais registrado');
   * }
   * ```
   */
  unregister(name: string): boolean;

  /**
   * Verifica se um agente está registrado no sistema.
   * 
   * Consulta rápida para verificar existência sem instanciar o agente.
   * 
   * @param name Nome do agente a ser verificado.
   * 
   * @returns true se o agente está registrado, false caso contrário.
   * 
   * @example
   * ```typescript
   * if (registry.has('researcher')) {
   *   const agent = registry.get('researcher');
   *   // Usar o agente...
   * } else {
   *   console.log('Agente researcher não encontrado');
   * }
   * ```
   */
  has(name: string): boolean;

  /**
   * Limpa todos os registros do sistema.
   * 
   * Remove todos os agentes registrados, resetando o registry
   * ao estado inicial. Útil para limpeza completa ou reset.
   * 
   * @example
   * ```typescript
   * // Limpar todos os registros
   * registry.clear();
   * 
   * // Verificar se foi limpo
   * console.log('Total de agentes:', registry.list().length); // 0
   * ```
   */
  clear(): void;

  /**
   * Obtém estatísticas detalhadas do registro.
   * 
   * Retorna informações agregadas sobre o estado do registry,
   * incluindo contadores, rankings de uso e informações temporais.
   * 
   * @returns Estatísticas sobre os agentes registrados.
   * 
   * @example
   * ```typescript
   * const stats = registry.getStats();
   * 
   * console.log('Total de agentes:', stats.totalAgents);
   * console.log('Por tipo:', stats.agentsByType);
   * console.log('Mais usados:', stats.mostUsed);
   * console.log('Criado em:', stats.createdAt);
   * ```
   * 
   * @see {@link AgentRegistryStats} Para formato das estatísticas
   */
  getStats(): AgentRegistryStats;
}

/**
 * Informações detalhadas sobre um agente registrado no sistema.
 * 
 * Estrutura que contém todos os metadados e informações relevantes
 * sobre um agente no registry, incluindo configuração, estatísticas
 * de uso e informações temporais.
 * 
 * ## Uso das Informações
 * 
 * - **Listagem**: Usada pelo método list() para mostrar agentes disponíveis
 * - **Descoberta**: Facilita encontrar agentes por tipo ou características
 * - **Analytics**: Fornece dados para análise de uso e performance
 * - **Documentação**: Ajuda na geração de documentação automática
 * 
 * @example
 * ```typescript
 * const info: AgentRegistryInfo = {
 *   name: 'researcher',
 *   type: 'react',
 *   description: 'Agente especializado em pesquisa',
 *   config: { /* configuração padrão *\/ },
 *   registeredAt: new Date('2024-01-01'),
 *   usageCount: 42
 * };
 * 
 * console.log(`${info.name} (${info.type}) - Usado ${info.usageCount} vezes`);
 * ```
 * 
 * @see {@link IAgentRegistry} Para operações do registry
 * @see {@link IAgentConfig} Para configuração do agente
 */
export interface AgentRegistryInfo {
  /**
   * Nome único do agente no registry.
   * 
   * Identificador usado para registrar, buscar e referenciar
   * o agente no sistema. Deve ser único entre todos os agentes.
   */
  name: string;

  /**
   * Tipo/categoria do agente.
   * 
   * Define o comportamento e capacidades do agente
   * (ex: 'chat', 'react', 'custom'). Usado para agrupamento
   * e descoberta por tipo.
   */
  type: string;

  /**
   * Descrição opcional do agente.
   * 
   * Texto explicativo sobre a finalidade e capacidades
   * do agente. Útil para documentação e interface de usuário.
   * 
   * @example
   * ```typescript
   * description: 'Agente conversacional para atendimento ao cliente'
   * description: 'Especialista em análise de código e debugging'
   * description: 'Assistente para criação de conteúdo técnico'
   * ```
   */
  description?: string;

  /**
   * Configuração padrão do agente.
   * 
   * Objeto IAgentConfig que define as configurações padrão
   * usadas quando o agente é instanciado. Pode ser sobrescrito
   * no momento da instanciação.
   * 
   * @example
   * ```typescript
   * config: {
   *   type: 'react',
   *   provider: 'openai',
   *   model: 'gpt-4',
   *   agentInfo: { /* informações do agente *\/ },
   *   llmConfig: { temperature: 0.7 },
   *   tools: [/* ferramentas padrão *\/]
   * }
   * ```
   * 
   * @see {@link IAgentConfig} Para estrutura completa da configuração
   */
  config: IAgentConfig;

  /**
   * Data e hora do registro do agente.
   * 
   * Timestamp indicando quando o agente foi adicionado ao registry.
   * Útil para auditoria, versionamento e análise temporal.
   * 
   * @example
   * ```typescript
   * registeredAt: new Date('2024-01-15T10:30:00Z')
   * ```
   */
  registeredAt: Date;

  /**
   * Número total de vezes que o agente foi usado.
   * 
   * Contador que incrementa a cada vez que o agente é
   * instanciado via get(). Útil para analytics e
   * identificação de agentes populares.
   * 
   * @example
   * ```typescript
   * usageCount: 0    // Nunca usado
   * usageCount: 15   // Uso moderado
   * usageCount: 150  // Muito usado
   * ```
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