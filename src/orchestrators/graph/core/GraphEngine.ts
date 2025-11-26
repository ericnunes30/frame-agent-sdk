import type { Message } from '@/memory';
import type { GraphDefinition, GraphNode, GraphRunResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import type { IGraphState } from '@/orchestrators/graph/core/interfaces/graphState.interface';
import { GraphStatus } from '@/orchestrators/graph/core/enums/graphEngine.enum';
import { ChatHistoryManager, TokenizerService } from '@/memory';
import type { IChatHistoryManager } from '@/memory';
import type { AgentLLMConfig } from '@/agent';
import { logger } from '@/utils/logger';

/**
 * Motor de execução de grafos para orquestração de agentes de IA.
 * 
 * Esta classe é o coração do sistema de orquestração baseado em grafos,
 * responsável por executar fluxos de trabalho complexos definidos como
 * grafos acíclicos direcionados (DAGs) com nós e arestas condicionais.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Execução de Grafos**: Processa grafos definidos com nós e arestas
 * - **Gerenciamento de Estado**: Mantém estado global durante execução
 * - **Histórico de Chat**: Integração com ChatHistoryManager para contexto
 * - **Controle de Fluxo**: Suporte a arestas condicionais e paralelas
 * - **Limites de Execução**: Controle de maxSteps para evitar loops infinitos
 * - **Integração LLM**: Suporte nativo para modelos de linguagem
 * 
 * ## Arquitetura do Sistema
 * 
 * - **GraphDefinition**: Define estrutura do grafo (nós, arestas, entry point)
 * - **GraphNode**: Nós individuais com lógica específica de execução
 * - **IGraphState**: Estado global compartilhado entre nós
 * - **GraphStatus**: Status de execução (RUNNING, FINISHED, ERROR, PAUSED)
 * 
 * ## Casos de Uso
 * 
 * - **Workflows Complexos**: Orquestrar múltiplas tarefas interdependentes
 * - **Sistemas Multi-Agente**: Coordenar agentes especializados
 * - **Processamento Condicional**: Roteamento baseado em resultados
 * - **Pipelines de Dados**: Processar dados através de múltiplas etapas
 * - **Automação de Processos**: Automatizar workflows empresariais
 * 
 * @example
 * ```typescript
 * import { GraphEngine } from '@/orchestrators/graph/core/GraphEngine';
 * import { createAgentNode } from '@/orchestrators/graph/builder';
 * 
 * // Definir nós do grafo
 * const agentNode = createAgentNode({
 *   llm: { model: 'gpt-4', apiKey: '...' },
 *   mode: 'react',
 *   agentInfo: { name: 'Assistant', goal: 'Help users', backstory: '...' }
 * });
 * 
 * // Definir grafo
 * const graphDefinition: GraphDefinition = {
 *   nodes: {
 *     start: agentNode,
 *     end: createEndNode()
 *   },
 *   edges: {
 *     start: { default: 'end' }
 *   },
 *   entryPoint: 'start'
 * };
 * 
 * // Executar grafo
 * const engine = new GraphEngine(graphDefinition);
 * const result = await engine.execute({
 *   messages: [{ role: 'user', content: 'Hello!' }],
 *   data: {},
 *   metadata: {}
 * });
 * 
 * console.log('Status:', result.status);
 * console.log('Final state:', result.finalState);
 * ```
 * 
 * @see {@link GraphDefinition} Para definição de grafos
 * @see {@link IGraphState} Para estado do grafo
 * @see {@link GraphStatus} Para status de execução
 */
export class GraphEngine {
  /** Definição completa do grafo a ser executado */
  private readonly definition: GraphDefinition;
  /** Limite máximo de passos de execução */
  private readonly maxSteps?: number;
  /** Nome do módulo para logging */
  private readonly moduleName = 'GraphEngine';
  /** Gerenciador de histórico de chat */
  private chatHistoryManager?: IChatHistoryManager;
  /** Serviço de tokenização para gerenciamento de contexto */
  private tokenizerService?: TokenizerService;
  /** Configuração do LLM (opcional) */
  private readonly llmConfig?: AgentLLMConfig;

  /**
   * Construtor do GraphEngine.
   * 
   * Inicializa o motor de execução com a definição do grafo e opções
   * de configuração, incluindo gerenciamento de histórico e limites
   * de execução.
   * 
   * @param definition Definição completa do grafo a ser executado.
   * Deve incluir nós, arestas e ponto de entrada válidos.
   * 
   * @param options Opções adicionais de configuração.
   * - maxSteps: Limite máximo de passos para evitar loops infinitos
   * - chatHistoryManager: Gerenciador de histórico customizado
   * 
   * @param llmConfig Configuração opcional do LLM.
   * Usada para criar TokenizerService e gerenciar contexto.
   * 
   * @example
   * ```typescript
   * // Configuração básica
   * const engine1 = new GraphEngine(graphDefinition);
   * 
   * // Com opções
   * const engine2 = new GraphEngine(graphDefinition, {
   *   maxSteps: 50,
   *   chatHistoryManager: customChatManager
   * });
   * 
   * // Com configuração LLM
   * const engine3 = new GraphEngine(graphDefinition, {
   *   maxSteps: 30
   * }, {
   *   model: 'gpt-4',
   *   apiKey: 'sk-...',
   *   defaults: { temperature: 0.7 }
   * });
   * ```
   * 
   * @see {@link GraphDefinition} Para formato da definição
   * @see {@link IChatHistoryManager} Para gerenciamento de histórico
   * @see {@link AgentLLMConfig} Para configuração do LLM
   */
  constructor(
    definition: GraphDefinition,
    options?: {
      maxSteps?: number;
      chatHistoryManager?: IChatHistoryManager;
    },
    llmConfig?: AgentLLMConfig
  ) {
    this.definition = definition;
    this.maxSteps = options?.maxSteps;
    this.llmConfig = llmConfig;

    // Configurar ChatHistoryManager fornecido
    if (options?.chatHistoryManager) {
      this.chatHistoryManager = options.chatHistoryManager;
    }

    // Criar TokenizerService se LLM config fornecido
    if (llmConfig) {
      this.tokenizerService = new TokenizerService(llmConfig.model);
    }
  }

  /**
   * Adiciona uma mensagem ao histórico de chat do grafo.
   * 
   * Método utilitário para adicionar mensagens ao ChatHistoryManager
   * interno, permitindo que o grafo mantenha contexto durante a execução.
   * 
   * @param message Mensagem a ser adicionada ao histórico.
   * Deve seguir o formato padrão de Message do sistema.
   * 
   * @example
   * ```typescript
   * const engine = new GraphEngine(graphDefinition);
   * 
   * // Adicionar mensagem do usuário
   * engine.addMessage({
   *   role: 'user',
   *   content: 'Preciso de ajuda com análise de dados'
   * });
   * 
   * // Adicionar resposta do assistente
   * engine.addMessage({
   *   role: 'assistant',
   *   content: 'Claro! Posso ajudar com análise de dados. Que tipo de análise você precisa?'
   * });
   * ```
   * 
   * @see {@link Message} Para formato das mensagens
   */
  public addMessage(message: Message): void {
    if (!this.chatHistoryManager) {
      logger.warn(`[GraphEngine] ChatHistoryManager not initialized, message not added`);
      return;
    }

    this.chatHistoryManager.addMessage(message);
  }

  /**
   * Obtém mensagens do histórico para envio ao LLM.
   * 
   * Retorna o histórico de mensagens trimado e otimizado para
   * envio aos modelos de linguagem, respeitando limites de tokens
   * e mantendo contexto relevante.
   * 
   * @returns Array de mensagens otimizadas para o LLM.
   * Retorna array vazio se ChatHistoryManager não estiver inicializado.
   * 
   * @example
   * ```typescript
   * const engine = new GraphEngine(graphDefinition);
   * 
   * // Adicionar algumas mensagens
   * engine.addMessage({ role: 'user', content: 'Olá' });
   * engine.addMessage({ role: 'assistant', content: 'Olá! Como posso ajudar?' });
   * 
   * // Obter mensagens para LLM
   * const messages = engine.getMessagesForLLM();
   * console.log('Mensagens para LLM:', messages);
   * // [
   * //   { role: 'user', content: 'Olá' },
   * //   { role: 'assistant', content: 'Olá! Como posso ajudar?' }
   * // ]
   * ```
   * 
   * @see {@link Message} Para formato das mensagens
   * @see {@link IChatHistoryManager.getTrimmedHistory()} Para detalhes do trim
   */
  public getMessagesForLLM(): Message[] {
    if (!this.chatHistoryManager) {
      logger.warn(`ChatHistoryManager not initialized, returning empty array`, this.moduleName);
      return [];
    }

    return this.chatHistoryManager.getTrimmedHistory();
  }

  /**
   * Sincroniza estado do grafo com histórico de chat.
   * 
   * Método interno que atualiza o estado do grafo baseado nas
   * mensagens mais recentes do ChatHistoryManager. Atualmente
   * apenas obtém o histórico trimado (implementação futura
   * pode usar este histórico para atualizar estado).
   * 
   * @private
   */
  private syncStateFromChatHistory(): void {
    if (!this.chatHistoryManager) {
      logger.warn(`ChatHistoryManager not initialized, cannot sync state`, this.moduleName);
      return;
    }

    const trimmedHistory = this.chatHistoryManager.getTrimmedHistory();
    // TODO: Usar trimmedHistory para atualizar estado do grafo se necessário
  }

  // Propriedade para rastrear quantas mensagens já foram sincronizadas
  private lastSyncedMessageCount: number = 0;

  /**
   * Garante que o ChatHistoryManager está inicializado e sincronizado.
   * 
   * Método interno que verifica se o ChatHistoryManager existe,
   * criando um novo se necessário. Sincroniza APENAS as novas mensagens
   * do initialState com o ChatHistoryManager para evitar duplicação.
   * 
   * @param initialState Estado inicial do grafo.
   * Usado para sincronizar mensagens com o ChatHistoryManager.
   * 
   * @private
   */
  private ensureChatHistoryManager(initialState: IGraphState): void {
    // Se ChatHistoryManager não existe, criar um novo
    if (!this.chatHistoryManager) {
      // Verificar se temos TokenizerService disponível
      if (!this.tokenizerService) {
        logger.warn(`TokenizerService not available, cannot create ChatHistoryManager`, this.moduleName);
        return;
      }

      // Extrair maxTokens da configuração do LLM
      const maxTokens = this.llmConfig?.defaults?.maxTokens;
      const config = {
        maxContextTokens: maxTokens,
        tokenizer: this.tokenizerService
      };

      // Criar novo ChatHistoryManager
      this.chatHistoryManager = new ChatHistoryManager(config);
      this.lastSyncedMessageCount = 0; // Resetar contador
    }

    // Sincronizar APENAS mensagens novas do estado inicial
    if (initialState.messages && initialState.messages.length > this.lastSyncedMessageCount) {
      const newMessages = initialState.messages.slice(this.lastSyncedMessageCount);
      this.syncMessagesToChatHistory(newMessages);

      // Atualizar contador
      this.lastSyncedMessageCount = initialState.messages.length;
    } else if (initialState.messages && initialState.messages.length < this.lastSyncedMessageCount) {
      // Se o estado tem menos mensagens que o sincronizado (ex: reset de estado),
      // devemos resetar o contador e sincronizar tudo (ou avisar)
      // Por segurança, assumimos que é um novo contexto
      logger.warn('State messages count is less than synced count. Resetting sync.', this.moduleName);
      this.lastSyncedMessageCount = 0;
      // Opcional: limpar ChatHistoryManager se suportado, ou apenas adicionar as do estado
      // Como ChatHistoryManager não tem clear público fácil aqui, vamos apenas adicionar as do estado
      // assumindo que o usuário quer começar "daqui".
      // Mas para evitar duplicação complexa, vamos apenas atualizar o contador para o novo tamanho
      // e adicionar as mensagens se for um reset total.
      // Se for apenas um "undo", o ChatHistoryManager ainda terá as antigas.
      // Para este fix, vamos focar no caso de adição (append-only).
      this.lastSyncedMessageCount = initialState.messages.length;
    }
  }

  /**
   * Sincroniza mensagens para o ChatHistoryManager.
   * 
   * Método interno que adiciona todas as mensagens do array
   * fornecido ao ChatHistoryManager, garantindo que o
   * histórico esteja consistente com o estado do grafo.
   * 
   * @param messages Array de mensagens para sincronizar.
   * 
   * @private
   */
  private syncMessagesToChatHistory(messages: Message[]): void {
    if (!this.chatHistoryManager) {
      logger.warn(`ChatHistoryManager not initialized, cannot sync messages`, this.moduleName);
      return;
    }

    for (const message of messages) {
      this.chatHistoryManager.addMessage(message);
    }
  }

  /**
   * Executa o grafo a partir do estado inicial fornecido.
   * 
   * Este é o método principal do GraphEngine que coordena toda a execução
   * do grafo, gerenciando estado, fluxo de controle e comunicação entre nós.
   * 
   * ## Fluxo de Execução
   * 
   * 1. **Inicialização**: Configura ChatHistoryManager e sincroniza estado
   * 2. **Loop Principal**: Executa nós sequencialmente até conclusão
   * 3. **Execução de Nó**: Chama função do nó com estado atual
   * 4. **Merge de Estado**: Combina resultado do nó com estado global
   * 5. **Roteamento**: Determina próximo nó baseado em arestas
   * 6. **Controle de Fluxo**: Aplica pausas, limites e condições de parada
   * 
   * @param initialState Estado inicial do grafo.
   * Deve incluir mensagens, dados e metadados iniciais.
   * 
   * @returns Promise que resolve para GraphRunResult.
   * Contém estado final e status da execução.
   * 
   * @example
   * ```typescript
   * const engine = new GraphEngine(graphDefinition);
   * 
   * const initialState: IGraphState = {
   *   messages: [{ role: 'user', content: 'Olá, preciso de ajuda!' }],
   *   data: { userId: '123' },
   *   metadata: { sessionId: 'abc-456' }
   * };
   * 
   * const result = await engine.execute(initialState);
   * 
   * console.log('Status:', result.status); // 'FINISHED', 'ERROR', 'PAUSED'
   * console.log('Final state:', result.state);
   * console.log('Messages:', result.state.messages);
   * console.log('Data:', result.state.data);
   * ```
   * 
   * @see {@link IGraphState} Para formato do estado
   * @see {@link GraphRunResult} Para formato do resultado
   * @see {@link GraphStatus} Para status possíveis
   */
  public async execute(initialState: IGraphState): Promise<GraphRunResult> {
    // 1. Inicializar ChatHistoryManager se necessário
    this.ensureChatHistoryManager(initialState);
    logger.info('GraphEngine executing...');
    this.syncStateFromChatHistory();

    // 2. Inicializar estado de execução
    let state = this.bootstrapState(initialState, this.definition.entryPoint);
    let steps = 0;

    // 3. Loop principal de execução
    while (state.status === GraphStatus.RUNNING) {
      // Verificar limite de passos
      this.assertMaxSteps(steps);

      // Obter nó atual
      const nodeName = state.currentNode;
      if (!nodeName) throw new Error('Current node is undefined');
      const node = this.definition.nodes[nodeName];
      if (!node) throw new Error(`Node '${nodeName}' not found`);

      // 4. Executar nó atual
      const delta = await this.runNode(node, state);

      // 5. Merge do resultado com estado global
      state = this.mergeState(state, delta);

      // 6. Determinar próximo nó
      const next = this.resolveNext(nodeName, state, delta.nextNodeOverride);
      state = { ...state, nextNode: next };

      // 7. Aplicar controle de pausa
      state = this.applyPause(state);
      if (state.status !== GraphStatus.RUNNING) break;

      // 8. Atualizar nó atual e incrementar contador
      state = { ...state, currentNode: next };
      steps += 1;

      // 9. Verificar condições de parada
      if (state.status !== GraphStatus.RUNNING) break;
      if (next === this.definition.endNodeName) {
        state = { ...state, status: GraphStatus.FINISHED };
        break;
      }
    }

    // Atualizar o contador de mensagens sincronizadas com o estado final
    // Isso impede que mensagens geradas durante esta execução sejam duplicadas
    // na próxima chamada de ensureChatHistoryManager
    if (state.messages) {
      this.lastSyncedMessageCount = state.messages.length;
    }

    // 10. Retornar resultado final
    return { state, status: state.status };
  }

  /**
   * Retoma a execução de um grafo pausado.
   * 
   * Método que permite continuar a execução de um grafo que foi
   * pausado anteriormente, opcionalmente aceitando input adicional
   * do usuário para prosseguir a execução.
   * 
   * ## Casos de Uso
   * 
   * - **Pausas para Input**: Quando um nó precisa de informações do usuário
   * - **Interrupção Voluntária**: Quando execução é pausada manualmente
   * - **Recuperação de Estado**: Continuar após falhas temporárias
   * - **Workflows Interativos**: Fluxos que requerem interação humana
   * 
   * @param savedState Estado salvo do grafo pausado.
   * Deve ter status PAUSED e conter informações suficientes
   * para retomar a execução.
   * 
   * @param userInput Mensagem opcional do usuário para prosseguir.
   * Adicionada ao histórico e incluída no estado para o próximo nó.
   * 
   * @returns Promise que resolve para GraphRunResult da continuação.
   * 
   * @example
   * ```typescript
   * const engine = new GraphEngine(graphDefinition);
   * 
   * // Primeira execução (pode ser pausada)
   * const initialState = { messages: [{ role: 'user', content: 'Preciso de dados' }] };
   * const result1 = await engine.execute(initialState);
   * 
   * if (result1.status === 'PAUSED') {
   *   console.log('Grafo pausado, aguardando input do usuário');
   *   
   *   // Simular input do usuário
   *   const userInput = { role: 'user', content: 'Aqui estão os dados: [1,2,3,4,5]' };
   *   
   *   // Retomar execução
   *   const result2 = await engine.resume(result1.state, userInput);
   *   console.log('Execução concluída:', result2.status);
   * }
   * ```
   * 
   * @see {@link IGraphState} Para formato do estado
   * @see {@link GraphStatus.PAUSED} Para status de pausa
   * @see {@link execute()} Para execução inicial
   */
  public async resume(savedState: IGraphState, userInput?: Message): Promise<GraphRunResult> {
    // 1. Preparar estado para retomada
    let resumed = { ...savedState };
    resumed = { ...resumed, shouldPause: false, status: GraphStatus.RUNNING };

    // 2. Adicionar input do usuário se fornecido
    if (userInput) {
      this.addMessage(userInput);
      resumed = { ...resumed, messages: [...(resumed.messages ?? []), userInput] };
    }

    // 3. Determinar ponto de entrada para retomada
    const hasNext = Boolean(resumed.nextNode);
    const entry = savedState.status === GraphStatus.PAUSED && hasNext
      ? (resumed.nextNode as string)
      : resumed.currentNode ?? this.definition.entryPoint;

    // 4. Configurar estado para retomada
    resumed = { ...resumed, currentNode: entry, nextNode: entry };

    // 5. Retomar execução
    return this.execute(resumed);
  }

  /**
   * Executa um nó individual do grafo.
   * 
   * Método interno que chama a função do nó com o estado atual
   * e trata erros de execução, garantindo que falhas em nós
   * individuais não quebrem toda a execução do grafo.
   * 
   * @param node Função do nó a ser executada.
   * Deve aceitar estado atual e GraphEngine como parâmetros.
   * 
   * @param state Estado atual do grafo.
   * Passado para o nó para que possa tomar decisões baseadas no contexto.
   * 
   * @returns Promise com resultado da execução do nó.
   * Em caso de erro, retorna estado de erro com logs.
   * 
   * @private
   */
  private async runNode(node: GraphNode, state: IGraphState) {
    try {
      const result = await node(state, this);
      return result;
    } catch (error) {
      logger.error(`Node execution failed: ${(error as Error).message}`, this.moduleName);
      return {
        logs: [`Error in node: ${(error as Error).message}`],
        status: GraphStatus.ERROR
      };
    }
  }

  /**
   * Combina estado atual com resultado de um nó.
   * 
   * Método interno que faz merge do delta retornado por um nó
   * com o estado global do grafo, preservando dados existentes
   * e incorporando novas informações de forma não-destrutiva.
   * 
   * ## Estratégia de Merge
   * 
   * - **Mensagens**: Adiciona ao final do histórico
   * - **Data**: Merge superficial (shallow merge) de objetos
   * - **Metadata**: Merge superficial preservando estrutura
   * - **Logs**: Concatena com logs existentes
   * - **Propriedades Especiais**: Preserva valores quando não fornecidos
   * 
   * @param state Estado atual do grafo.
   * 
   * @param delta Resultado parcial do nó executado.
   * Pode incluir mensagens, data, metadata, logs e controles de fluxo.
   * 
   * @returns Novo estado combinado.
   * 
   * @private
   */
  private mergeState(
    state: IGraphState,
    delta: Partial<IGraphState> & {
      shouldPause?: boolean;
      shouldEnd?: boolean;
      logs?: string[]
    }
  ): IGraphState {
    let newState = { ...state };

    // 1. Processar mensagens (adicionar ao histórico)
    if (delta.messages && delta.messages.length > 0) {
      for (const message of delta.messages) {
        this.addMessage(message);
      }
      newState = { ...newState, messages: [...newState.messages, ...delta.messages] };
    }

    // 2. Merge de dados (shallow merge)
    if (delta.data) {
      newState = { ...newState, data: { ...newState.data, ...delta.data } };
    }

    // 3. Merge de metadados (shallow merge)
    if (delta.metadata) {
      newState = {
        ...newState,
        metadata: { ...(newState.metadata ?? {}), ...delta.metadata }
      };
    }

    // 4. Propriedades especiais (preservar se não fornecidas)
    newState = { ...newState, lastToolCall: delta.lastToolCall ?? newState.lastToolCall };
    newState = { ...newState, lastModelOutput: delta.lastModelOutput ?? newState.lastModelOutput };
    newState = { ...newState, pendingAskUser: delta.pendingAskUser ?? newState.pendingAskUser };
    newState = { ...newState, shouldPause: delta.shouldPause ?? newState.shouldPause };

    // 5. Processar logs (concatenar)
    if (delta.logs && delta.logs.length > 0) {
      const existing = newState.logs ?? [];
      newState = { ...newState, logs: [...existing, ...delta.logs] };
    }

    // 6. Processar status e controles de fluxo
    if (delta.status) {
      newState = { ...newState, status: delta.status };
    }
    if (delta.shouldEnd) {
      newState = { ...newState, status: GraphStatus.FINISHED };
    }

    // 7. Aplicar controle de pausa final
    return this.applyPause(newState);
  }

  /**
   * Combina mensagens com o estado do grafo.
   * 
   * Método utilitário interno para adicionar mensagens ao estado.
   * Atualmente não é usado diretamente (funcionalidade incorporada
   * em mergeState), mas mantido para extensibilidade futura.
   * 
   * @param state Estado atual do grafo.
   * @param messages Mensagens para adicionar.
   * 
   * @returns Estado com mensagens adicionadas.
   * 
   * @private
   * @deprecated Use mergeState diretamente
   */
  private mergeMessages(state: IGraphState, messages?: Message[]): IGraphState {
    if (!messages || messages.length === 0) return state;
    return { ...state, messages: [...state.messages, ...messages] };
  }

  /**
   * Combina logs com o estado do grafo.
   * 
   * Método utilitário interno para adicionar logs ao estado.
   * Atualmente não é usado diretamente (funcionalidade incorporada
   * em mergeState), mas mantido para extensibilidade futura.
   * 
   * @param state Estado atual do grafo.
   * @param logs Logs para adicionar.
   * 
   * @returns Estado com logs adicionados.
   * 
   * @private
   * @deprecated Use mergeState diretamente
   */
  private mergeLogs(state: IGraphState, logs?: string[]): IGraphState {
    if (!logs || logs.length === 0) return state;
    const existing = state.logs ?? [];
    return { ...state, logs: [...existing, ...logs] };
  }

  /**
   * Aplica controle de pausa ao estado.
   * 
   * Método interno que verifica se o estado deve ser pausado
   * baseado em shouldPause ou pendingAskUser, alterando o status
   * para PAUSED quando necessário.
   * 
   * @param state Estado atual do grafo.
   * 
   * @returns Estado com status atualizado se necessário.
   * 
   * @private
   */
  private applyPause(state: IGraphState): IGraphState {
    // Pausar se explicitamente solicitado
    if (state.shouldPause) {
      return { ...state, status: GraphStatus.PAUSED };
    }

    // Pausar se aguardando input do usuário
    if (state.pendingAskUser) {
      return { ...state, status: GraphStatus.PAUSED };
    }

    // Manter status atual
    return state;
  }

  /**
   * Resolve o próximo nó a ser executado.
   * 
   * Método interno que determina qual nó executar next baseado
   * nas arestas definidas no grafo, considerando override opcional
   * e arestas condicionais.
   * 
   * ## Estratégia de Roteamento
   * 
   * 1. **Override**: Se nextNodeOverride fornecido, usar diretamente
   * 2. **Aresta Estática**: Se aresta é string, usar como próximo nó
   * 3. **Aresta Condicional**: Se aresta é função, avaliar com estado atual
   * 4. **Validação**: Verificar se próximo nó existe e é válido
   * 
   * @param current Nome do nó atual em execução.
   * @param state Estado atual do grafo (usado para arestas condicionais).
   * @param override Próximo nó forçado (opcional).
   * 
   * @returns Nome do próximo nó a executar.
   * 
   * @throws Error se aresta não definida ou retorno condicional vazio.
   * 
   * @private
   */
  private resolveNext(current: string, state: IGraphState, override?: string): string {
    // 1. Usar override se fornecido
    if (override) return override;

    // 2. Obter aresta do nó atual
    const edge = this.definition.edges[current];
    if (!edge) {
      throw new Error(`No edge defined for node '${current}'`);
    }

    // 3. Determinar tipo de aresta
    const isString = typeof edge === 'string';
    if (isString) {
      // Aresta estática
      return edge as string;
    } else {
      // Aresta condicional
      const conditional = edge as (s: IGraphState) => string;
      const next = conditional(state);
      if (!next) {
        throw new Error(`Conditional edge from '${current}' returned empty target`);
      }
      return next;
    }
  }

  /**
   * Inicializa estado do grafo para execução.
   * 
   * Método interno que prepara o estado inicial do grafo,
   * definindo valores padrão para propriedades não fornecidas
   * e configurando status de execução.
   * 
   * @param state Estado fornecido pelo usuário.
   * @param entryPoint Nome do nó de entrada do grafo.
   * 
   * @returns Estado inicializado para execução.
   * 
   * @private
   */
  private bootstrapState(state: IGraphState, entryPoint: string): IGraphState {
    // Definir valores padrão para propriedades opcionais
    const messages = state.messages ?? [];
    const data = state.data ?? {};
    const metadata = state.metadata ?? {};
    const logs = state.logs ?? [];

    // Retornar estado inicializado
    return {
      ...state,
      messages,
      data,
      metadata,
      logs,
      status: GraphStatus.RUNNING,
      currentNode: state.currentNode ?? entryPoint,
      nextNode: state.nextNode ?? entryPoint,
    };
  }

  /**
   * Verifica se limite máximo de passos foi excedido.
   * 
   * Método interno que valida se o número de passos executados
   * não excede o limite configurado, prevenindo loops infinitos
   * em grafos mal configurados.
   * 
   * @param count Número atual de passos executados.
   * 
   * @throws Error se maxSteps configurado e excedido.
   * 
   * @private
   */
  private assertMaxSteps(count: number): void {
    // Se não há limite configurado, não validar
    if (!this.maxSteps) return;

    // Se ainda dentro do limite, não fazer nada
    if (count < this.maxSteps) return;

    // Se excedeu o limite, lançar erro
    throw new Error(`Exceeded max steps (${this.maxSteps})`);
  }
}
