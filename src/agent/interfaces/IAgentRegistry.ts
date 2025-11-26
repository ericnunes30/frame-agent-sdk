// src/agents/interfaces/IAgentRegistry.ts
import type { IAgent, AgentExecutionResult } from './IAgent';
import type { IAgentConfig } from './IAgentConfig';
import type { Message } from '../../memory';

/**
 * Interface para sistema de registro centralizado de agentes de IA.
 * 
 * Define um registry robusto e completo para gerenciar agentes de IA
 * de forma centralizada, permitindo registro, descoberta, instanciação,
 * execução direta e monitoramento de agentes.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Registro Centralizado**: Cadastro de agentes com configurações completas
 * - **Instanciação Controlada**: Criação de instâncias com configurações customizadas
 * - **Execução Direta**: Execução de agentes sem instanciação manual
 * - **Filtragem e Descoberta**: Busca por tipo, provedor ou características
 * - **Monitoramento**: Estatísticas de uso, performance e erros
 * - **Validação**: Verificação automática de configurações
 * - **Atualização Dinâmica**: Modificação de configurações em tempo real
 * 
 * ## Casos de Uso Avançados
 * 
 * - **Sistemas Multi-Agente**: Coordenar múltiplos agentes especializados
 * - **Load Balancing**: Distribuir carga entre instâncias de agentes
 * - **A/B Testing**: Testar diferentes configurações de agentes
 * - **Monitoring**: Rastrear performance e uso de agentes
 * - **Dynamic Routing**: Direcionar requisições baseado em tipo/capacidades
 * 
 * @example
 * ```typescript
 * // Registrar agentes especializados
 * registry.register('researcher', {
 *   type: 'react',
 *   provider: 'openai',
 *   model: 'gpt-4',
 *   agentInfo: { name: 'Researcher', goal: 'Find information', backstory: 'Expert researcher' },
 *   tools: [searchTool, webScraperTool]
 * });
 * 
 * registry.register('coder', {
 *   type: 'react',
 *   provider: 'openai',
 *   model: 'gpt-4',
 *   agentInfo: { name: 'Coder', goal: 'Write code', backstory: 'Expert programmer' },
 *   tools: [codeAnalyzerTool, fileTool]
 * });
 * 
 * // Executar diretamente do registry
 * const result = await registry.execute('researcher', [
 *   { role: 'user', content: 'Research the latest AI trends' }
 * ], { temperature: 0.3 });
 * 
 * // Filtrar por tipo
 * const reactAgents = registry.filterByType('react');
 * console.log('Agentes ReAct disponíveis:', reactAgents);
 * 
 * // Monitorar estatísticas
 * const stats = registry.getStats();
 * console.log('Taxa de sucesso:', stats.successRate);
 * console.log('Agentes mais usados:', stats.mostUsedAgents);
 * ```
 * 
 * @see {@link IAgent} Para interface dos agentes
 * @see {@link IAgentConfig} Para configuração de agentes
 * @see {@link AgentRegistryInfo} Para informações detalhadas
 * @see {@link AgentRegistryStats} Para estatísticas
 */
export interface IAgentRegistry {
  /**
   * Registra um agente no sistema centralizado.
   * 
   * Adiciona um novo agente ao registry com sua configuração completa,
   * permitindo que seja descoberto, instanciado e executado posteriormente.
   * 
   * @param id Identificador único do agente no registry.
   * Deve ser único para evitar conflitos. Usado para todas as operações.
   * 
   * @param config Configuração completa do agente.
   * Deve incluir type, provider, model, agentInfo e outras configurações.
   * 
   * @param options Opções adicionais de registro.
   * Controla comportamento como sobrescrita, validação e metadados.
   * 
   * @throws Error se o ID já existir (sem overwrite=true) ou configuração inválida.
   * 
   * @example
   * ```typescript
   * // Registro básico
   * registry.register('chat-assistant', {
   *   type: 'chat',
   *   provider: 'openai',
   *   model: 'gpt-3.5-turbo',
   *   agentInfo: { name: 'Assistant', goal: 'Help users', backstory: 'Helpful AI' }
   * });
   * 
   * // Registro com opções
   * registry.register('researcher', researchConfig, {
   *   overwrite: true,
   *   validate: true,
   *   metadata: { category: 'research', version: '1.0' }
   * });
   * ```
   * 
   * @see {@link AgentRegistrationOptions} Para opções de registro
   */
  register(id: string, config: IAgentConfig, options?: AgentRegistrationOptions): void;
  
  /**
   * Obtém um agente registrado (instância compartilhada).
   * 
   * Retorna a instância registrada do agente. Note que esta é
   * uma instância compartilhada, então modificações afetarão
   * todos os usuários. Para instâncias isoladas, use create().
   * 
   * @param id Identificador do agente no registry.
   * 
   * @returns A instância do agente registrado.
   * 
   * @throws Error se o agente não for encontrado.
   * 
   * @example
   * ```typescript
   * const agent = registry.get('researcher');
   * 
   * // ATENÇÃO: Instância compartilhada!
   * agent.configure({ temperature: 0.1 }); // Afeta todos os usuários
   * ```
   * 
   * @see {@link create()} Para instâncias isoladas
   */
  get(id: string): IAgent;
  
  /**
   * Cria uma nova instância isolada do agente.
   * 
   * Cria uma nova instância do agente com a configuração registrada
   * como base, permitindo customizações específicas sem afetar
   * outras instâncias ou o agente registrado.
   * 
   * @param id Identificador do agente no registry.
   * 
   * @param options Opções de criação da instância.
   * Permite customizações e controle de estado da instância.
   * 
   * @returns Nova instância isolada do agente.
   * 
   * @throws Error se o agente não for encontrado.
   * 
   * @example
   * ```typescript
   * // Instância com configuração padrão
   * const agent1 = registry.create('researcher');
   * 
   * // Instância com customizações
   * const agent2 = registry.create('researcher', {
   *   customConfig: { temperature: 0.2, maxTokens: 2000 },
   *   fresh: true
   * });
   * 
   * // Instâncias são independentes
   * agent2.configure({ temperature: 0.9 }); // Não afeta agent1
   * ```
   * 
   * @see {@link get()} Para instância compartilhada
   * @see {@link AgentCreationOptions} Para opções de criação
   */
  create(id: string, options?: AgentCreationOptions): IAgent;
  
  /**
   * Lista todos os agentes registrados no sistema.
   * 
   * Retorna array com IDs de todos os agentes atualmente
   * registrados no registry.
   * 
   * @returns Lista de IDs dos agentes registrados.
   * 
   * @example
   * ```typescript
   * const allAgents = registry.list();
   * console.log('Agentes registrados:', allAgents);
   * // ['chat-assistant', 'researcher', 'coder', 'analyst']
   * ```
   */
  list(): string[];
  
  /**
   * Verifica se um agente está registrado no sistema.
   * 
   * Consulta rápida para verificar existência sem overhead
   * de instanciação.
   * 
   * @param id Identificador do agente a ser verificado.
   * 
   * @returns true se o agente estiver registrado, false caso contrário.
   * 
   * @example
   * ```typescript
   * if (registry.has('researcher')) {
   *   const agent = registry.create('researcher');
   *   // Usar o agente...
   * } else {
   *   console.log('Agente researcher não encontrado');
   * }
   * ```
   */
  has(id: string): boolean;
  
  /**
   * Remove um agente do registry.
   * 
   * Remove permanentemente um agente do sistema, liberando
   * o ID para possível reuso e清理 recursos associados.
   * 
   * @param id Identificador do agente a ser removido.
   * 
   * @returns true se o agente foi removido, false caso contrário.
   * 
   * @example
   * ```typescript
   * const removed = registry.unregister('old-agent');
   * if (removed) {
   *   console.log('Agente removido com sucesso');
   * }
   * 
   * // Verificar remoção
   * console.log('Ainda existe?', registry.has('old-agent')); // false
   * ```
   */
  unregister(id: string): boolean;
  
  /**
   * Obtém informações detalhadas sobre um agente registrado.
   * 
   * Retorna metadados completos sobre o agente, incluindo
   * configuração, estatísticas de uso e informações temporais.
   * 
   * @param id Identificador do agente no registry.
   * 
   * @returns Informações detalhadas do agente.
   * 
   * @throws Error se o agente não for encontrado.
   * 
   * @example
   * ```typescript
   * const info = registry.getInfo('researcher');
   * console.log('Nome:', info.agentInfo.name);
   * console.log('Tipo:', info.type);
   * console.log('Execuções:', info.executionCount);
   * console.log('Último erro:', info.lastError);
   * console.log('Registrado em:', info.registeredAt);
   * ```
   * 
   * @see {@link AgentRegistryInfo} Para formato das informações
   */
  getInfo(id: string): AgentRegistryInfo;
  
  /**
   * Lista todos os tipos únicos de agentes disponíveis.
   * 
   * Retorna array com todos os tipos diferentes de agentes
   * registrados no sistema (ex: 'chat', 'react', 'custom').
   * 
   * @returns Lista de tipos únicos de agentes.
   * 
   * @example
   * ```typescript
   * const types = registry.listTypes();
   * console.log('Tipos disponíveis:', types);
   * // ['chat', 'react', 'research', 'coding']
   * ```
   */
  listTypes(): string[];
  
  /**
   * Filtra agentes por tipo específico.
   * 
   * Retorna lista de IDs de agentes que correspondem
   * ao tipo especificado.
   * 
   * @param type Tipo do agente para filtrar.
   * 
   * @returns Lista de IDs dos agentes do tipo especificado.
   * 
   * @example
   * ```typescript
   * const reactAgents = registry.filterByType('react');
   * console.log('Agentes ReAct:', reactAgents);
   * // ['researcher', 'coder', 'analyst']
   * 
   * const chatAgents = registry.filterByType('chat');
   * console.log('Agentes de Chat:', chatAgents);
   * // ['assistant', 'support-bot']
   * ```
   */
  filterByType(type: string): string[];
  
  /**
   * Atualiza a configuração de um agente registrado.
   * 
   * Modifica a configuração de um agente existente, permitindo
   * ajustes dinâmicos sem necessidade de re-registro.
   * 
   * @param id Identificador do agente no registry.
   * 
   * @param config Nova configuração parcial do agente.
   * Propriedades fornecidas substituem as existentes.
   * 
   * @param options Opções de atualização.
   * Controla validação e aplicação das mudanças.
   * 
   * @throws Error se o agente não for encontrado ou configuração inválida.
   * 
   * @example
   * ```typescript
   * // Atualizar temperatura
   * registry.update('researcher', {
   *   llmConfig: { temperature: 0.3 }
   * });
   * 
   * // Atualizar com opções
   * registry.update('coder', {
   *   model: 'gpt-4',
   *   tools: [newTool]
   * }, {
   *   validate: true,
   *   applyOnlyToNewInstances: true
   * });
   * ```
   * 
   * @see {@link AgentUpdateOptions} Para opções de atualização
   */
  update(id: string, config: Partial<IAgentConfig>, options?: AgentUpdateOptions): void;
  
  /**
   * Executa um agente diretamente do registry.
   * 
   * Convenience method que cria uma instância temporária do agente,
   * executa com as mensagens fornecidas e retorna o resultado,
   * tudo em uma única operação.
   * 
   * @param id Identificador do agente no registry.
   * 
   * @param messages Mensagens de entrada para o agente.
   * 
   * @param options Opções de execução do agente.
   * Parâmetros como temperatura, tools, instruções extras, etc.
   * 
   * @returns Resultado da execução do agente.
   * 
   * @throws Error se o agente não for encontrado ou execução falhar.
   * 
   * @example
   * ```typescript
   * // Execução simples
   * const result = await registry.execute('assistant', [
   *   { role: 'user', content: 'Hello!' }
   * ]);
   * 
   * // Execução com opções
   * const result2 = await registry.execute('researcher', messages, {
   *   temperature: 0.2,
   *   tools: [searchTool],
   *   additionalInstructions: 'Focus on recent developments'
   * });
   * 
   * if (result2.success) {
   *   console.log('Resposta:', result2.content);
   * } else {
   *   console.error('Erro:', result2.error);
   * }
   * ```
   * 
   * @see {@link AgentExecutionOptions} Para opções de execução
   * @see {@link AgentExecutionResult} Para formato do resultado
   */
  execute(id: string, messages: Message[], options?: AgentExecutionOptions): Promise<AgentExecutionResult>;
  
  /**
   * Obtém estatísticas completas do registry.
   * 
   * Retorna dados agregados sobre todos os agentes registrados,
   * incluindo contadores, distribuições, performance e rankings.
   * 
   * @returns Estatísticas completas do registry.
   * 
   * @example
   * ```typescript
   * const stats = registry.getStats();
   * 
   * console.log('Total de agentes:', stats.totalAgents);
   * console.log('Total de execuções:', stats.totalExecutions);
   * console.log('Taxa de sucesso:', (stats.successRate * 100).toFixed(1) + '%');
   * console.log('Tempo médio:', stats.averageExecutionTime + 'ms');
   * console.log('Distribuição por tipo:', stats.distributionByType);
   * console.log('Mais usados:', stats.mostUsedAgents);
   * ```
   * 
   * @see {@link AgentRegistryStats} Para formato das estatísticas
   */
  getStats(): AgentRegistryStats;
  
  /**
   * Limpa todos os agentes do registry.
   * 
   * Remove permanentemente todos os agentes registrados,
   * resetando o registry ao estado inicial vazio.
   * 
   * @example
   * ```typescript
   * // Limpar todos os registros
   * registry.clear();
   * 
   * // Verificar se foi limpo
   * console.log('Agentes restantes:', registry.list().length); // 0
   * ```
   */
  clear(): void;
  
  /**
   * Valida todos os agentes registrados no sistema.
   * 
   * Executa validação completa em todos os agentes registrados,
   * retornando lista com erros encontrados para correção.
   * 
   * @returns Lista com mensagens de erro de validação.
   * Array vazio indica que todos os agentes são válidos.
   * 
   * @example
   * ```typescript
   * const errors = registry.validateAll();
   * 
   * if (errors.length === 0) {
   *   console.log('Todos os agentes são válidos');
   * } else {
   *   console.log('Erros encontrados:');
   *   errors.forEach(error => console.log('- ' + error));
   * }
   * ```
   */
  validateAll(): string[];
}

/**
 * Opções para registro de agentes no sistema.
 * 
 * Define parâmetros opcionais que controlam o comportamento
 * durante o registro de agentes, incluindo validação,
 * sobrescrita e metadados.
 * 
 * @example
 * ```typescript
 * // Registro com validação
 * const options1: AgentRegistrationOptions = {
 *   validate: true,
 *   metadata: { version: '1.0', category: 'research' }
 * };
 * 
 * // Registro com sobrescrita
 * const options2: AgentRegistrationOptions = {
 *   overwrite: true,
 *   validate: false
 * };
 * ```
 */
export interface AgentRegistrationOptions {
  /**
   * Se deve sobrescrever um agente existente com o mesmo ID.
   * 
   * Quando true, permite re-registrar um agente com ID existente,
   * substituindo a configuração anterior. Quando false (padrão),
   * o registro falha se o ID já existir.
   * 
   * @example
   * ```typescript
   * overwrite: true   // Substitui agente existente
   * overwrite: false  // Falha se ID já existe (padrão)
   * ```
   */
  overwrite?: boolean;
  
  /**
   * Se deve validar a configuração antes de registrar.
   * 
   * Quando true, executa validação completa da configuração
   * usando validateAgentConfig(). Quando false, registra
   * sem validação (mais rápido mas pode causar erros later).
   * 
   * @example
   * ```typescript
   * validate: true   // Valida configuração (padrão seguro)
   * validate: false  // Pula validação (mais rápido)
   * ```
   */
  validate?: boolean;
  
  /**
   * Metadados adicionais para o agente.
   * 
   * Objeto com informações extras sobre o agente que podem
   * ser usadas para categorização, versionamento, analytics, etc.
   * 
   * @example
   * ```typescript
   * metadata: {
   *   version: '1.0',
   *   category: 'research',
   *   author: 'team-ai',
   *   tags: ['nlp', 'analysis'],
   *   deprecated: false
   * }
   * ```
   */
  metadata?: Record<string, any>;
}

/**
 * Opções para criação de instâncias de agentes.
 * 
 * Define parâmetros para controlar como instâncias de agentes
 * são criadas, incluindo customizações de configuração e
 * controle de estado.
 * 
 * @example
 * ```typescript
 * // Instância com customizações
 * const options1: AgentCreationOptions = {
 *   customConfig: { temperature: 0.3, maxTokens: 2000 },
 *   fresh: true
 * };
 * 
 * // Instância padrão
 * const options2: AgentCreationOptions = {
 *   fresh: false
 * };
 * ```
 */
export interface AgentCreationOptions {
  /**
   * Configurações customizadas para a instância.
   * 
   * Configuração parcial que será mesclada com a configuração
   * registrada do agente, permitindo customizações específicas
   * para esta instância sem afetar o agente registrado.
   * 
   * @example
   * ```typescript
   * customConfig: {
   *   llmConfig: { temperature: 0.2 },
   *   additionalInstructions: 'Be more technical',
   *   tools: [additionalTool]
   * }
   * ```
   * 
   * @see {@link IAgentConfig} Para estrutura de configuração
   */
  customConfig?: Partial<IAgentConfig>;
  
  /**
   * Se deve criar uma instância limpa (sem estado anterior).
   * 
   * Quando true, a instância é criada com estado completamente
   * limpo, sem histórico ou caches. Quando false (padrão),
   * pode herdar estado de instâncias anteriores.
   * 
   * @example
   * ```typescript
   * fresh: true   // Estado completamente limpo
   * fresh: false  // Pode herdar estado (padrão)
   * ```
   */
  fresh?: boolean;
}

/**
 * Opções para atualização de agentes registrados.
 * 
 * Define parâmetros que controlam como atualizações de configuração
 * são aplicadas, incluindo validação e escopo das mudanças.
 * 
 * @example
 * ```typescript
 * // Atualização com validação
 * const options1: AgentUpdateOptions = {
 *   validate: true,
 *   applyOnlyToNewInstances: false
 * };
 * 
 * // Atualização silenciosa
 * const options2: AgentUpdateOptions = {
 *   validate: false,
 *   metadata: { updatedBy: 'admin', timestamp: Date.now() }
 * };
 * ```
 */
export interface AgentUpdateOptions {
  /**
   * Se deve validar a nova configuração.
   * 
   * Quando true, valida a configuração atualizada antes de
   * aplicar as mudanças. Quando false, aplica diretamente
   * sem validação (mais rápido mas pode causar inconsistências).
   * 
   * @example
   * ```typescript
   * validate: true   // Valida antes de aplicar (padrão seguro)
   * validate: false  // Aplica diretamente (mais rápido)
   * ```
   */
  validate?: boolean;
  
  /**
   * Se deve aplicar as alterações apenas em novas instâncias.
   * 
   * Quando true, as mudanças afetam apenas instâncias criadas
   * após a atualização. Instâncias existentes mantêm a
   * configuração antiga. Quando false, todas as instâncias
   * (incluindo existentes) usam a nova configuração.
   * 
   * @example
   * ```typescript
   * applyOnlyToNewInstances: true   // Só novas instâncias
   * applyOnlyToNewInstances: false  // Todas as instâncias (padrão)
   * ```
   */
  applyOnlyToNewInstances?: boolean;
  
  /**
   * Metadados adicionais para a atualização.
   * 
   * Informações extras sobre a atualização, úteis para
   * auditoria, versionamento e tracking de mudanças.
   * 
   * @example
   * ```typescript
   * metadata: {
   *   updatedBy: 'admin',
   *   timestamp: Date.now(),
   *   reason: 'Performance optimization',
   *   version: '2.0'
   * }
   * ```
   */
  metadata?: Record<string, any>;
}

/**
 * Informações detalhadas sobre um agente registrado no sistema.
 * 
 * Estrutura completa com metadados, configuração, estatísticas
 * de uso e informações temporais sobre um agente no registry.
 * 
 * ## Uso das Informações
 * 
 * - **Monitoramento**: Rastrear uso, performance e erros
 * - **Analytics**: Analisar padrões de uso e popularidade
 * - **Manutenção**: Identificar agentes problemáticos ou obsoletos
 * - **Documentação**: Gerar catálogos e documentação automática
 * 
 * @example
 * ```typescript
 * const info: AgentRegistryInfo = {
 *   id: 'researcher',
 *   type: 'react',
 *   provider: 'openai',
 *   model: 'gpt-4',
 *   agentInfo: {
 *     name: 'Researcher',
 *     goal: 'Find accurate information',
 *     backstory: 'Expert researcher with 10 years experience'
 *   },
 *   registeredAt: new Date('2024-01-01'),
 *   executionCount: 150,
 *   metadata: { category: 'research', version: '1.2' },
 *   lastError: null,
 *   lastExecutionAt: new Date('2024-01-15T14:30:00')
 * };
 * ```
 * 
 * @see {@link IAgentRegistry} Para operações do registry
 * @see {@link IAgentConfig} Para configuração do agente
 */
export interface AgentRegistryInfo {
  /**
   * Identificador único do agente no registry.
   * 
   * ID usado para todas as operações do registry (get, create, execute, etc.).
   * Deve ser único entre todos os agentes registrados.
   */
  id: string;
  
  /**
   * Tipo/categoria do agente.
   * 
   * Define o comportamento e capacidades do agente
   * (ex: 'chat', 'react', 'research', 'coding').
   * Usado para agrupamento e filtragem.
   */
  type: string;
  
  /**
   * Provedor do modelo de linguagem.
   * 
   * Identifica qual provedor LLM é usado pelo agente
   * (ex: 'openai', 'anthropic', 'cohere').
   */
  provider: string;
  
  /**
   * Modelo específico do LLM utilizado.
   * 
   * Nome do modelo conforme suportado pelo provedor
   * (ex: 'gpt-4', 'claude-3-sonnet', 'command-r').
   */
  model: string;
  
  /**
   * Informações estruturadas do agente.
   * 
   * Dados que definem a identidade, papel e comportamento
   * do agente, usados para construção de prompts.
   * 
   * @example
   * ```typescript
   * agentInfo: {
   *   name: 'Code Assistant',
   *   goal: 'Help developers write better code',
   *   backstory: 'Senior software engineer with expertise in multiple languages'
   * }
   * ```
   */
  agentInfo: {
    /** Nome do agente */
    name: string;
    /** Objetivo/função principal do agente */
    goal: string;
    /** Histórico/contexto do agente */
    backstory: string;
  };
  
  /**
   * Data e hora do registro do agente.
   * 
   * Timestamp indicando quando o agente foi adicionado
   * ao registry. Útil para auditoria e versionamento.
   */
  registeredAt: Date;
  
  /**
   * Número total de execuções do agente.
   * 
   * Contador que incrementa a cada vez que o agente
   * é executado (via execute() ou create()+execute()).
   * Útil para identificar agentes populares.
   */
  executionCount: number;
  
  /**
   * Metadados adicionais do agente.
   * 
   * Informações extras fornecidas durante o registro,
   * como versão, categoria, tags, autor, etc.
   * 
   * @example
   * ```typescript
   * metadata: {
   *   version: '1.0',
   *   category: 'research',
   *   author: 'team-ai',
   *   tags: ['nlp', 'analysis'],
   *   deprecated: false
   * }
   * ```
   */
  metadata?: Record<string, any>;
  
  /**
   * Mensagem do último erro de execução.
   * 
   * Descrição do erro mais recente que ocorreu durante
   * a execução do agente. Null se a última execução
   * foi bem-sucedida.
   * 
   * @example
   * ```typescript
   * lastError: null                                    // Última execução OK
   * lastError: 'API key expired'                       // Erro de autenticação
   * lastError: 'Model gpt-5 not found'                 // Erro de modelo
   * lastError: 'Timeout after 30 seconds'              // Erro de timeout
   * ```
   */
  lastError?: string;
  
  /**
   * Timestamp da última execução do agente.
   * 
   * Momento exato da última vez que o agente foi executado,
   * independentemente do sucesso ou falha. Útil para
   * identificar agentes inativos.
   */
  lastExecutionAt?: Date;
}

/**
 * Estatísticas completas do sistema de registry de agentes.
 * 
 * Estrutura com dados agregados sobre todos os agentes registrados,
 * incluindo contadores, distribuições, performance e rankings.
 * 
 * ## Métricas Principais
 * 
 * - **Volume**: Total de agentes, tipos e execuções
 * - **Distribuição**: Como os agentes estão categorizados
 * - **Performance**: Taxa de sucesso e tempo médio de execução
 * - **Popularidade**: Rankings dos agentes mais usados
 * 
 * ## Casos de Uso
 * 
 * - **Monitoring**: Acompanhar saúde do sistema
 * - **Analytics**: Entender padrões de uso
 * - **Otimização**: Identificar gargalos e oportunidades
 * - **Relatórios**: Gerar dashboards e relatórios
 * 
 * @example
 * ```typescript
 * const stats: AgentRegistryStats = {
 *   totalAgents: 15,
 *   totalTypes: 4,
 *   distributionByType: {
 *     'chat': 6,
 *     'react': 5,
 *     'research': 3,
 *     'coding': 1
 *   },
 *   totalExecutions: 2847,
 *   successRate: 0.94,
 *   averageExecutionTime: 1250,
 *   mostUsedAgents: [
 *     { id: 'assistant', executions: 892 },
 *     { id: 'researcher', executions: 634 },
 *     { id: 'coder', executions: 445 }
 *   ]
 * };
 * ```
 * 
 * @see {@link IAgentRegistry.getStats()} Para obter estatísticas
 */
export interface AgentRegistryStats {
  /**
   * Total de agentes atualmente registrados no sistema.
   * 
   * Contagem de todos os agentes no registry, independentemente
   * do tipo ou status. Útil para entender o tamanho do sistema.
   */
  totalAgents: number;
  
  /**
   * Total de tipos únicos de agentes disponíveis.
   * 
   * Número de categorias diferentes de agentes (ex: 'chat', 'react').
   * Indica a diversidade de capacidades do sistema.
   */
  totalTypes: number;
  
  /**
   * Distribuição de agentes por tipo.
   * 
   * Objeto que mapeia cada tipo para o número de agentes desse tipo.
   * Útil para entender como os agentes estão categorizados.
   * 
   * @example
   * ```typescript
   * distributionByType: {
   *   'chat': 6,        // 6 agentes de chat
   *   'react': 5,       // 5 agentes ReAct
   *   'research': 3,    // 3 agentes de pesquisa
   *   'coding': 1       // 1 agente de programação
   * }
   * ```
   */
  distributionByType: Record<string, number>;
  
  /**
   * Total de execuções realizadas por todos os agentes.
   * 
   * Soma de todas as execuções (bem-sucedidas e com falha)
   * de todos os agentes registrados. Indicador de atividade
   * geral do sistema.
   */
  totalExecutions: number;
  
  /**
   * Taxa de sucesso das execuções (0.0 a 1.0).
   * 
   * Proporção de execuções bem-sucedidas em relação ao total.
   * Indicador importante da qualidade e confiabilidade do sistema.
   * 
   * @example
   * ```typescript
   * successRate: 0.94  // 94% de sucesso
   * successRate: 0.87  // 87% de sucesso
   * successRate: 1.0   // 100% de sucesso
   * ```
   */
  successRate: number;
  
  /**
   * Tempo médio de execução em milissegundos.
   * 
   * Média do tempo de execução de todos os agentes,
   * calculada apenas sobre execuções bem-sucedidas.
   * Indicador de performance geral do sistema.
   */
  averageExecutionTime: number;
  
  /**
   * Ranking dos agentes mais utilizados.
   * 
   * Array ordenado com os agentes que tiveram mais execuções,
   * útil para identificar quais agentes são mais populares
   * ou críticos para o sistema.
   * 
   * @example
   * ```typescript
   * mostUsedAgents: [
   *   { id: 'assistant', executions: 892 },
   *   { id: 'researcher', executions: 634 },
   *   { id: 'coder', executions: 445 }
   * ]
   * ```
   */
  mostUsedAgents: Array<{
    /** ID do agente */
    id: string;
    /** Número de execuções */
    executions: number;
  }>;
}

/**
 * Opções para execução de agentes via registry.
 * 
 * Define parâmetros que podem ser fornecidos para personalizar
 * a execução de agentes, incluindo configurações do modelo,
 * ferramentas e contexto adicional.
 * 
 * ## Parâmetros de Execução
 * 
 * - **LLM**: temperature, topP, maxTokens para controle do modelo
 * - **Ferramentas**: tools para capacidades estendidas
 * - **Comportamento**: additionalInstructions para personalização
 * - **Interface**: stream para respostas em tempo real
 * - **Contexto**: context para dados adicionais
 * 
 * @example
 * ```typescript
 * // Execução técnica
 * const techOptions: AgentExecutionOptions = {
 *   temperature: 0.2,
 *   maxTokens: 2000,
 *   tools: [calculatorTool, codeAnalyzerTool],
 *   additionalInstructions: 'Be precise and technical'
 * };
 * 
 * // Execução criativa
 * const creativeOptions: AgentExecutionOptions = {
 *   temperature: 0.9,
 *   topP: 0.95,
 *   stream: true,
 *   context: { domain: 'creative', style: 'artistic' }
 * };
 * ```
 * 
 * @see {@link IAgentRegistry.execute()} Para execução via registry
 * @see {@link IAgent.execute()} Para execução direta
 */
export interface AgentExecutionOptions {
  /**
   * Instruções adicionais para o agente.
   * 
   * Texto livre que será adicionado ao prompt do sistema
   * para personalizar o comportamento do agente durante
   * esta execução específica.
   * 
   * @example
   * ```typescript
   * additionalInstructions: 'Always respond in Portuguese'
   * additionalInstructions: 'Focus on practical solutions'
   * additionalInstructions: 'Use simple language and examples'
   * ```
   */
  additionalInstructions?: string;
  
  /**
   * Ferramentas disponíveis para o agente.
   * 
   * Lista de ferramentas que o agente pode usar durante
   * esta execução. Sobrescreve as ferramentas padrão
   * configuradas no agente.
   * 
   * @example
   * ```typescript
   * tools: [calculatorTool, searchTool, webScraperTool]
   * ```
   * 
   * @see {@link ToolSchema} Para formato das ferramentas
   */
  tools?: any[];
  
  /**
   * Temperatura do modelo para esta execução.
   * 
   * Sobrescreve a temperatura configurada no agente.
   * Controla criatividade e aleatoriedade da resposta.
   * 
   * @example
   * ```typescript
   * temperature: 0.1  // Mais determinístico
   * temperature: 0.7  // Equilíbrio (padrão)
   * temperature: 1.0  // Mais criativo
   * ```
   */
  temperature?: number;
  
  /**
   * TopP do modelo para esta execução.
   * 
   * Sobrescreve o topP configurado no agente.
   * Controla diversidade do vocabulário considerado.
   * 
   * @example
   * ```typescript
   * topP: 0.1   // Vocabulário restrito
   * topP: 0.9   // Boa diversidade
   * topP: 1.0   // Sem limitação
   * ```
   */
  topP?: number;
  
  /**
   * Máximo de tokens para esta execução.
   * 
   * Sobrescreve o maxTokens configurado no agente.
   * Limita o tamanho da resposta gerada.
   * 
   * @example
   * ```typescript
   * maxTokens: 100   // Resposta curta
   * maxTokens: 1000  // Resposta padrão
   * maxTokens: 4000  // Resposta longa
   * ```
   */
  maxTokens?: number;
  
  /**
   * Habilita streaming de resposta.
   * 
   * Quando true, a resposta é retornada em chunks conforme
   * gerada, permitindo interfaces mais responsivas.
   * Sobrescreve a configuração de streaming do agente.
   * 
   * @example
   * ```typescript
   * stream: true   // Resposta em tempo real
   * stream: false  // Resposta completa (padrão)
   * ```
   */
  stream?: boolean;
  
  /**
   * Contexto adicional para esta execução.
   * 
   * Objeto com dados extras que podem ser usados pelo agente
   * para enriquecer sua resposta ou tomar decisões. Útil para
   * passar informações específicas desta execução.
   * 
   * @example
   * ```typescript
   * context: {
   *   userId: 'user123',
   *   sessionId: 'session456',
   *   domain: 'healthcare',
   *   preferences: { language: 'pt-BR', tone: 'formal' },
   *   previousTopics: ['diabetes', 'exercise']
   * }
   * ```
   */
  context?: Record<string, any>;
}