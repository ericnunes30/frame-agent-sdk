import type { StepsDeps, StepsConfig, OrchestrationState, Step, StepContext, AgentStepConfig, IStepsOrchestrator } from '@/orchestrators/steps/interfaces';
import type { AgentLLMConfig } from '../../agent';
import { ToolDetector, ToolExecutor } from '../../tools';
import { PromptBuilder } from '@/promptBuilder';
import { AGENT_MODES } from '@/llmModes';
import type { AgentMode } from '@/llmModes';

/**
 * Orquestrador de steps sequenciais para agentes de IA.
 * 
 * Esta classe implementa um orquestrador mais simples que o GraphEngine,
 * focado na execução sequencial de steps predefinidos e fluxos de
 * agente único com suporte a diferentes modos de operação.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Execução Sequencial**: Processa steps em ordem definida
 * - **Saltos Controlados**: Suporte a jump/next para controle de fluxo
 * - **Modos de Agente**: Suporte a CHAT e REACT modes
 * - **Detecção de Ferramentas**: Integração com ToolDetector para SAP
 * - **Execução de Ferramentas**: Suporte a ToolExecutor para ferramentas
 * - **Gerenciamento de Estado**: Mantém estado entre steps
 * 
 * ## Modos de Operação
 * 
 * - **CHAT**: Execução simples de um turno com LLM
 * - **REACT**: Loop iterativo com reasoning, action e observation
 * - **Custom**: Steps personalizados com lógica específica
 * 
 * ## Casos de Uso
 * 
 * - **Workflows Lineares**: Processos que seguem uma sequência fixa
 * - **Formulários Multi-Step**: Coleta de informações em etapas
 * - **Pipelines Simples**: Processamento linear de dados
 * - **Agentes Conversacionais**: Chatbots com fluxos estruturados
 * - **Automação Básica**: Tarefas automatizadas sequenciais
 * 
 * @example
 * ```typescript
 * import { StepsOrchestrator } from '@/orchestrators/steps/stepsOrchestrator';
 * import { createChatMemory } from '@/memory';
 * import { AgentLLM } from '@/agent/llm/agentLLM';
 * 
 * // Configurar dependências
 * const deps: StepsDeps = {
 *   memory: createChatMemory({ maxContextTokens: 4000 }),
 *   llm: new AgentLLM({ model: 'gpt-4', apiKey: '...' }),
 *   tools: []
 * };
 * 
 * // Configurar orquestrador
 * const config: StepsConfig = {
 *   mode: AGENT_MODES.CHAT,
 *   agentInfo: {
 *     name: 'Assistant',
 *     role: 'Helpful assistant',
 *     backstory: 'Friendly and knowledgeable'
 *   }
 * };
 * 
 * const orchestrator = new StepsOrchestrator(deps, config);
 * 
 * // Executar fluxo simples
 * const result = await orchestrator.runFlow('Hello! How can you help me?');
 * console.log('Resposta:', result.final);
 * ```
 * 
 * @see {@link StepsConfig} Para configuração do orquestrador
 * @see {@link Step} Para definição de steps
 * @see {@link OrchestrationState} Para estado da orquestração
 */
export class StepsOrchestrator implements IStepsOrchestrator {
  /** Dependências necessárias para execução */
  private readonly deps: StepsDeps;
  /** Configuração do orquestrador */
  private readonly config: StepsConfig;
  /** Lista de agentes para execução sequencial */
  private readonly agentConfigs: AgentStepConfig[] = [];

  /**
   * Construtor do StepsOrchestrator.
   * 
   * Inicializa o orquestrador com suas dependências e configuração,
   * preparando-o para executar steps ou fluxos de agente.
   * 
   * @param deps Dependências necessárias (memory, llm, tools).
   * @param config Configuração do orquestrador (mode, agentInfo, etc.).
   * 
   * @example
   * ```typescript
   * const orchestrator = new StepsOrchestrator(deps, config);
   * ```
   * 
   * @see {@link StepsDeps} Para dependências necessárias
   * @see {@link StepsConfig} Para configuração disponível
   */
  constructor(deps: StepsDeps, config: StepsConfig) {
    this.deps = deps;
    this.config = config;
  }

  /**
   * Adiciona um agente à sequência de execução.
   * 
   * Este método permite configurar múltiplos agentes que serão executados
   * sequencialmente. Cada agente terá sua própria configuração e será
   * executado até completar (final_answer) antes de passar para o próximo.
   * 
   * @param config Configuração do agente a ser adicionado.
   * @returns Instância do orquestrador para encadeamento (fluent interface).
   * 
   * @example
   * ```typescript
   * const orchestrator = new StepsOrchestrator(deps, baseConfig);
   * await orchestrator
   *   .addAgent({ mode: 'REACT', agentInfo: { name: 'Agent1' } })
   *   .addAgent({ mode: 'REACT', agentInfo: { name: 'Agent2' } })
   *   .run('Input inicial');
   * ```
   */
  public addAgent(config: AgentStepConfig): this {
    this.agentConfigs.push(config);
    return this;
  }

  /**
   * Executa uma sequência de agentes configurados.
   * 
   * Este método executa todos os agentes adicionados via addAgent() em sequência.
   * Cada agente é executado até sua conclusão antes de passar para o próximo.
   * 
   * @param input Input inicial para o primeiro agente.
   * @returns Resultado final da execução com estado e possível pendingAskUser.
   * 
   * @example
   * ```typescript
   * const result = await orchestrator.executeAgents('Processar pedido');
   * console.log('Resultado:', result.final);
   * ```
   */
  public async executeAgents(input: string): Promise<{
    final: string | null;
    state: OrchestrationState;
    pendingAskUser?: { question: string; details?: string };
  }> {
    let currentInput = input;
    let finalResult: string | null = null;
    let finalState: OrchestrationState = { data: {}, final: undefined, lastModelOutput: null };
    let pendingAskUser: { question: string; details?: string } | undefined;

    // Se não há agentes configurados, usa o comportamento padrão
    if (this.agentConfigs.length === 0) {
      return this.runFlow(input);
    }

    // Executa cada agente em sequência
    for (const agentConfig of this.agentConfigs) {
      // Cria uma cópia das dependências se necessário para LLM específico
      const deps = await this.prepareDepsForAgent(agentConfig);
      
      // Cria um orquestrador temporário para este agente
      const tempOrchestrator = new StepsOrchestrator(deps, {
        mode: agentConfig.mode,
        agentInfo: agentConfig.agentInfo,
        additionalInstructions: agentConfig.additionalInstructions,
        tools: agentConfig.tools,
        taskList: agentConfig.taskList
      });

      const result = await tempOrchestrator.runFlow(currentInput);
      
      // Atualiza estado acumulado
      finalState.data = { ...finalState.data, ...result.state.data };
      finalState.lastModelOutput = result.state.lastModelOutput;
      
      // Se houver pergunta pendente, interrompe a execução
      if (result.pendingAskUser) {
        pendingAskUser = result.pendingAskUser;
        break;
      }
      
      // Atualiza input para o próximo agente
      currentInput = result.final || '';
      finalResult = result.final;
    }

    finalState.final = finalResult ?? undefined;
    return { final: finalResult, state: finalState, pendingAskUser };
  }

  /**
   * Prepara as dependências para um agente específico.
   * 
   * @param agentConfig Configuração do agente.
   * @returns Dependências preparadas para o agente.
   */
  private async prepareDepsForAgent(agentConfig: AgentStepConfig): Promise<StepsDeps> {
    // Se o agente tem sua própria configuração LLM, cria uma nova instância
    if (agentConfig.llm && this.isLLMConfig(agentConfig.llm)) {
      const { AgentLLM } = await import('../../agent');
      const llmInstance = new AgentLLM(agentConfig.llm as AgentLLMConfig);
      
      return {
        memory: this.deps.memory,
        llm: llmInstance
      };
    }
    
    // Se o agente tem uma instância LLM, usa ela diretamente
    if (agentConfig.llm && !this.isLLMConfig(agentConfig.llm)) {
      return {
        memory: this.deps.memory,
        llm: agentConfig.llm as any
      };
    }
    
    // Caso contrário, usa as dependências globais
    return this.deps;
  }

  /**
   * Verifica se um objeto é LLMConfig.
   * 
   * @param obj Objeto a verificar.
   * @returns True se for LLMConfig, false se for instância AgentLLM.
   */
  private isLLMConfig(obj: any): obj is AgentLLMConfig {
    return obj && typeof obj === 'object' && 'model' in obj && !('invoke' in obj);
  }

  /**
   * Executa uma sequência de steps predefinidos.
   * 
   * Este método executa uma lista de steps em ordem sequencial, permitindo
   * controle de fluxo através de jumps e next. Cada step recebe um contexto
   * contendo as dependências, configuração e estado atual da orquestração.
   * 
   * ## Fluxo de Execução
   * 
   * 1. **Inicialização**: Cria estado inicial vazio e adiciona input do usuário
   * 2. **Iteração**: Executa cada step sequencialmente
   * 3. **Controle de Fluxo**: Permite jumps para steps específicos via `next`
   * 4. **Atualização de Estado**: Aplica dados retornados por cada step
   * 5. **Finalização**: Retorna resultado final e estado completo
   * 
   * ## Controle de Fluxo
   * 
   * - **Sequencial**: Por padrão, executa steps em ordem (0, 1, 2, ...)
   * - **Jump**: Step pode definir `res.next` para pular para step específico
   * - **Halt**: Step pode definir `res.halt` para parar execução
   * - **Mapeamento**: Jump usa ID dos steps para navegação
   * 
   * ## Estado da Orquestração
   * 
   * - **data**: Objeto para dados persistentes entre steps
   * - **final**: String final retornada pelo último step executado
   * - **lastModelOutput**: Último output do modelo (se aplicável)
   * 
   * @param steps Lista de steps a serem executados sequencialmente.
   * @param userInput Input inicial do usuário para o fluxo.
   * @returns Resultado da execução com final e estado completo.
   * 
   * @throws {Error} Se step retornar resultado inválido ou houver erro na execução.
   * 
   * @example
   * ```typescript
   * // Definir steps customizados
   * const steps: Step[] = [
   *   {
   *     id: 'collect-info',
   *     name: 'Coletar Informações',
   *     run: async (ctx) => {
   *       const userData = ctx.state.data.userInfo || {};
   *       return {
   *         data: { userInfo: { ...userData, step: 'collect-info' } },
   *         next: 'validate-info'
   *       };
   *     }
   *   },
   *   {
   *     id: 'validate-info',
   *     name: 'Validar Informações',
   *     run: async (ctx) => {
   *       const isValid = ctx.state.data.userInfo?.step === 'collect-info';
   *       return {
   *         data: { validated: isValid },
   *         final: isValid ? 'Informações válidas!' : 'Dados inválidos!'
   *       };
   *     }
   *   }
   * ];
   * 
   * // Executar fluxo
   * const result = await orchestrator.run(steps, 'Preciso de ajuda');
   * console.log('Resultado:', result.final);
   * console.log('Estado:', result.state);
   * ```
   * 
   * @see {@link Step} Para definição de steps
   * @see {@link StepContext} Para contexto disponível nos steps
   * @see {@link OrchestrationState} Para estrutura do estado
   */
  public async run(steps: Step[], userInput: string): Promise<{ final: string | null; state: OrchestrationState }> {
    // initialize state
    const state: OrchestrationState = { data: {}, final: undefined, lastModelOutput: null };

    // seed user input
    this.deps.memory.addMessage({ role: 'user', content: userInput });

    // step iteration
    let index = 0;
    const jumpMap: Map<string, number> = new Map<string, number>(
      steps.map((s, i) => [s.id, i] as [string, number])
    );

    while (index < steps.length) {
      const step = steps[index];
      const ctx: StepContext = { deps: this.deps, config: this.config, state };
      const res = (await step.run(ctx)) || {};

      // apply updates
      if (res.data) state.data = { ...state.data, ...res.data };
      if (typeof res.final === 'string') state.final = res.final;

      if (res.halt) break;
      const ni = res.next ? jumpMap.get(res.next) : undefined;
      if (ni !== undefined) { index = ni; continue; }
      index += 1;
    }

    return { final: state.final ?? null, state };
  }

  /**
   * Executa um fluxo completo de agente único com LLM.
   * 
   * Este é o método principal para executar fluxos de agente, suportando diferentes
   * modos de operação (CHAT e REACT). Utiliza o PromptBuilder para criar prompts
   * do sistema baseados na configuração e integra com o sistema de memória para
   * gerenciar o histórico da conversa.
   * 
   * ## Modos de Operação
   * 
   * ### CHAT Mode
   * - **Execução**: Turno único com LLM
   * - **Fluxo**: Input → System Prompt → LLM → Output
   * - **Uso**: Conversas simples, perguntas diretas, respostas imediatas
   * - **Memória**: Adiciona input do usuário e output do assistente ao histórico
   * 
   * ### REACT Mode
   * - **Execução**: Loop iterativo com reasoning, action e observation
   * - **Fluxo**: Input → Thought → Action → Observation → (repeat)
   * - **Uso**: Tarefas complexas, uso de ferramentas, reasoning passo a passo
   * - **SAP**: Suporte a Structured Action Protocol para ferramentas
   * - **Limite**: Máximo de turnos configurável (padrão: 8)
   * 
   * ## Funcionalidades Avançadas
   * 
   * - **Detecção de Ferramentas**: Parser automático para Structured Action Protocol
   * - **Execução de Ferramentas**: Integração com ToolExecutor para ferramentas
   * - **Gerenciamento de Memória**: Controle automático de tokens e histórico
   * - **Metadados**: Captura e armazenamento de metadados do LLM
   * - **Fluxo de Interrupção**: Suporte a ask_user para pausar e solicitar input
   * 
   * ## Structured Action Protocol (SAP)
   * 
   * O modo REACT utiliza SAP para comunicação estruturada com ferramentas:
   * 
   * ```json
   * {
   *   "toolName": "nome_da_ferramenta",
   *   "params": {
   *     "param1": "valor1",
   *     "param2": "valor2"
   *   }
   * }
   * ```
   * 
   * ### Ferramentas Built-in
   * 
   * - **final_answer**: Finaliza a execução com resposta final
   * - **ask_user**: Pausa execução e solicita input do usuário
   * - **Outras**: Ferramentas customizadas via ToolExecutor
   * 
   * ## Controle de Fluxo
   * 
   * - **Limite de Turnos**: Previne loops infinitos (configurável)
   * - **Budget de Tokens**: Para automaticamente se memória estiver esgotada
   * - **Tratamento de Erros**: Hints automáticos para formato incorreto
   * - **Finalização Natural**: Detecção automática de resposta final
   * 
   * @param userInput Input inicial do usuário para o fluxo.
   * @param opts Opções de configuração (maxTurns para modo REACT).
   * @returns Resultado da execução com final, estado e possível pendingAskUser.
   * 
   * @throws {Error} Se houver erro na comunicação com LLM ou execução de ferramentas.
   * 
   * @example
   * ```typescript
   * // Modo CHAT - Conversa simples
   * const chatResult = await orchestrator.runFlow('Olá, como você está?');
   * console.log('Resposta:', chatResult.final);
   * 
   * // Modo REACT - Com ferramentas
   * const reactResult = await orchestrator.runFlow(
   *   'Preciso calcular 15% de 200 e depois pesquisar sobre o resultado',
   *   { maxTurns: 10 }
   * );
   * console.log('Resultado final:', reactResult.final);
   * console.log('Steps executados:', reactResult.state.data?.steps);
   * 
   * // Com ask_user - Fluxo interrompido
   * if (reactResult.pendingAskUser) {
   *   console.log('Pergunta pendente:', reactResult.pendingAskUser.question);
   *   // Aguardar resposta do usuário...
   * }
   * ```
   * 
   * @see {@link AGENT_MODES} Para modos disponíveis (CHAT, REACT)
   * @see {@link PromptBuilder} Para construção de prompts do sistema
   * @see {@link ToolDetector} Para detecção de SAP
   * @see {@link ToolExecutor} Para execução de ferramentas
   * @see {@link OrchestrationState} Para estrutura do estado retornado
   */
  public async runFlow(userInput: string, opts?: { maxTurns?: number }): Promise<{
    final: string | null;
    state: OrchestrationState;
    pendingAskUser?: { question: string; details?: string };
  }> {
    /** Número máximo de turnos para modo REACT (padrão: 8) */
    const maxTurns = opts?.maxTurns ?? 8;
    /** Estado inicial da orquestração */
    const state: OrchestrationState = { data: {}, final: undefined, lastModelOutput: null };

    // Adiciona input inicial do usuário ao histórico de memória
    this.deps.memory.addMessage({ role: 'user', content: userInput });

    // === MODO CHAT: Execução de turno único ===
    if (this.config.mode === AGENT_MODES.CHAT) {
      // Constrói prompt do sistema baseado na configuração do agente
      const systemPrompt = PromptBuilder.buildSystemPrompt(this.config);
      
      // Invoca LLM com histórico de memória e prompt do sistema
      const { content, metadata } = await this.deps.llm.invoke({
        messages: this.deps.memory.getTrimmedHistory(),
        systemPrompt,
      });
      
      // Atualiza estado com output do modelo
      state.lastModelOutput = content ?? null;
      
      // Adiciona resposta do assistente ao histórico de memória
      if (content) this.deps.memory.addMessage({ role: 'assistant', content });
      
      // Armazena metadados do LLM no estado (se disponíveis)
      if (metadata) state.data.metadata = metadata;
      
      // Retorna resultado final do modo CHAT
      return { final: content ?? null, state };
    }

    // === MODO REACT: Loop iterativo com SAP ===
    /** Contador de turnos executados */
    let turns = 0;
    
    // Inicializa estrutura de dados para steps do REACT
    if (!state.data) state.data = {};
    if (!Array.isArray((state.data as any).steps)) {
      (state.data as any).steps = [] as Array<{ thought?: string; actionName?: string; observation?: string }>;
    }

    // Loop principal do modo REACT
    while (turns < maxTurns) {
      // === GUARD: Verificação de budget de tokens ===
      // Para execução se orçamento de tokens estiver esgotado
      if (this.deps.memory.getRemainingBudget() <= 0) {
        state.final = state.final ?? undefined;
        break;
      }
      
      turns += 1;
      
      // Constrói e invoca LLM para este turno
      const systemPrompt = PromptBuilder.buildSystemPrompt(this.config);
      const { content, metadata } = await this.deps.llm.invoke({
        messages: this.deps.memory.getTrimmedHistory(),
        systemPrompt,
      });
      
      // Atualiza estado com output e metadados do modelo
      state.lastModelOutput = content ?? null;
      if (metadata) state.data.metadata = metadata;

      const text = content ?? '';
      
      // Adiciona output do assistente à memória antes do parsing (para ReAct)
      this.deps.memory.addMessage({ role: 'assistant', content: text });

      // === PARSING: Detecção de Structured Action Protocol ===
      // Usa ToolDetector para analisar output e identificar chamadas de ferramenta
      const detection = ToolDetector.detect(text);

      // Caso 1: Nenhuma ferramenta detectada
      if (!detection.success) {
        // Verifica se é um erro que precisa de hint
        if (detection.error && (detection.error.llmHint || detection.error.message)) {
          const hint = detection.error.llmHint || 'Your tool output does not match the required schema. Fix format and try again using exact JSON.';
          this.deps.memory.addMessage({ role: 'system', content: hint });
          continue; // Continua para próximo turno com hint
        }

        // Nenhuma ferramenta detectada e sem hint de erro
        // Trata como resposta final (ou apenas thought)
        try {
          // Extrai thought do texto usando regex
          const m = text.match(/Thought:\s*([\s\S]*?)(?:\n|$)/i);
          const thought = (m ? m[1] : '').toString().trim();
          if (thought) ((state.data as any).steps as any[]).push({ thought });
        } catch { /* Ignora erros de parsing de thought */ }

        // Define resposta final e encerra loop
        const final = text || null;
        state.final = final ?? undefined;
        break;
      }

      // === FERRAMENTA DETECTADA: Processamento de chamada de ferramenta ===
      // Extrai informações da chamada de ferramenta detectada
      const call = detection.toolCall!;
      const toolName = call.toolName;

      // === FERRAMENTA BUILT-IN: final_answer ===
      // Finaliza execução capturando thought + action antes de terminar
      if (toolName === 'final_answer') {
        // Extrai resposta final dos parâmetros da ferramenta
        const answer = String((call.params as any)?.answer ?? '');
        
        // Captura thought atual para registro no histórico de steps
        try {
          const m = text.match(/Thought:\s*([\s\S]*?)(?:\n|$)/i);
          const thought = (m ? m[1] : '').toString().trim();
          ((state.data as any).steps as any[]).push({ thought, actionName: 'final_answer' });
        } catch { /* Ignora erros de parsing de thought */ }
        
        // Define resposta final (answer, texto completo ou null)
        const final = answer || text || null;
        
        // Adiciona resposta final ao histórico de memória
        if (final) this.deps.memory.addMessage({ role: 'assistant', content: final });
        
        // Atualiza estado e encerra loop REACT
        state.final = final ?? undefined;
        break;
      }

      // === FERRAMENTA BUILT-IN: ask_user ===
      // Pausa execução e retorna pergunta pendente para o usuário
      if (toolName === 'ask_user') {
        // Extrai pergunta e detalhes dos parâmetros
        const question = String((call.params as any)?.question ?? '');
        const details = (call.params as any)?.details as string | undefined;
        
        // Cria objeto de pergunta pendente
        const pending = { question, details };
        
        // Armazena pergunta pendente no estado
        state.data.ask_user = pending;
        
        // Retorna com pendingAskUser para interromper fluxo
        return { final: null, state, pendingAskUser: pending };
      }

      // === FERRAMENTAS CUSTOMIZADAS: Execução e observação ===
      // Captura thought + action ANTES de executar a ferramenta
      /** Índice do step sendo processado para posterior anexação de observation */
      let stepIndex = -1;
      try {
        // Extrai thought do texto usando regex
        const m = text.match(/Thought:\s*([\s\S]*?)(?:\n|$)/i);
        const thought = (m ? m[1] : '').toString().trim();
        
        // Adiciona step ao array de steps e salva índice
        const stepsArr = ((state.data as any).steps as any[]);
        stepIndex = stepsArr.push({ thought, actionName: toolName }) - 1;
      } catch { /* Ignora erros de parsing/captura de thought */ }

      // === EXECUÇÃO DE FERRAMENTA ===
      // Executa ferramenta via ToolExecutor e recebe resultado estruturado
      const toolResult = await ToolExecutor.execute({ toolName, params: call.params } as any);
      const observation = toolResult.observation;
      const toolMetadata = toolResult.metadata;

      // === GERENCIAMENTO DE MEMÓRIA ===
      // Adiciona observation ao histórico de memória como mensagem de ferramenta
      this.deps.memory.addMessage({ role: 'tool', content: String(observation) });

      // === ANEXAÇÃO DE OBSERVATION ===
      // Anexa observation ao último step (se disponível)
      try {
        const stepsArr = ((state.data as any).steps as any[]);
        if (stepIndex >= 0 && stepsArr[stepIndex]) {
          stepsArr[stepIndex].observation = String(observation);
        }
      } catch { /* Ignora erros de anexação de observation */ }

      // === APLICAÇÃO DE METADADOS ===
      // Aplica metadados retornados pela ferramenta (se houver)
      if (toolMetadata) {
        // TaskList é aplicado automaticamente pela ferramenta
        if (toolMetadata.taskList) {
          this.config.taskList = toolMetadata.taskList as any;
        }

        // Outros metadados podem ser aplicados no futuro
        // Exemplo: if (toolMetadata.otherData) { ... }
      }

      // === CONTINUAÇÃO DO LOOP ===
      // Continua para próximo turno do LLM (se não atingiu maxTurns)
    }

    // === FINALIZAÇÃO ===
    // Retorna resultado final da execução do fluxo
    return { final: state.final ?? null, state };
  }
}
