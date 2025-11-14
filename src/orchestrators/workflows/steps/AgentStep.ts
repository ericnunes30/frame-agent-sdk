// src/orchestrators/workflows/steps/AgentStep.ts
import { 
  IWorkflowStep, 
  IWorkflowContext, 
  IWorkflowResult 
} from './interfaces';
import { AgentRegistry } from '../../../agents/registry';
import type { IAgent, AgentExecutionOptions, AgentExecutionResult, IAgentConfig } from '../../../agents/interfaces';
import type { Message } from '../../../memory';
import { IToolCall } from '../../../tools/core/interfaces';
import { ToolExecutor } from '../../../tools/core/toolExecutor';
import { LLM } from '../../../llm';
import type { AgentInfo } from '../../../promptBuilder';

/**
 * Agente adaptador que encapsula chamadas LLM diretas
 * 
 * Esta classe implementa a interface IAgent para permitir que chamadas
 * diretas ao LLM sejam usadas como se fossem agentes registrados.
 */
class LLMBasedAgentAdapter implements IAgent {
  private llm: LLM;
  private agentInfo: AgentInfo;
  private additionalInstructions?: string;
  private tools?: any[];
  
  constructor(
    llm: LLM, 
    config: any, 
    providerOptions?: { 
      temperature?: number; 
      topP?: number; 
      maxTokens?: number; 
      stream?: boolean 
    }
  ) {
    this.llm = llm;
    
    // Extrair informações do agente da configuração
    this.agentInfo = {
      name: config.name || 'DirectLLM',
      goal: config.goal || 'Execute LLM call directly',
      backstory: config.backstory || 'Agent that makes direct LLM calls'
    };
    
    this.additionalInstructions = config.additionalInstructions;
    this.tools = config.tools;
    
    // Aplicar provider options se fornecidas
    if (providerOptions) {
      // Configurar opções no LLM ou passar no execute
    }
  }
  
  get id(): string {
    return 'llm-based-agent';
  }
  
  get type(): string {
    return 'llm-direct';
  }
  
  get config(): IAgentConfig {
    return {
      type: 'chat',
      provider: 'llm-direct',
      model: 'llm-direct',
      agentInfo: this.agentInfo,
      additionalInstructions: this.additionalInstructions,
      tools: this.tools
    };
  }
  
  async execute(
    messages: Message[], 
    options?: AgentExecutionOptions
  ): Promise<AgentExecutionResult> {
    try {
      const startTime = Date.now();
      
      // Preparar parâmetros para chamada LLM
      const llmParams = {
        messages,
        mode: 'chat',
        agentInfo: this.agentInfo,
        additionalInstructions: options?.additionalInstructions || this.additionalInstructions,
        tools: options?.tools || this.tools,
        temperature: options?.temperature,
        topP: options?.topP,
        maxTokens: options?.maxTokens,
        stream: options?.stream
      };
      
      // Fazer chamada direta ao LLM
      const result = await this.llm.invoke(llmParams);
      
      const endTime = Date.now();
      
      return {
        content: result.content,
        messages: [...messages, { role: 'assistant', content: result.content || '' }],
        success: true,
        toolsUsed: [],
        metadata: {
          executionTime: endTime - startTime,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          ...result.metadata
        }
      };
    } catch (error) {
      return {
        content: null,
        messages: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        toolsUsed: [],
        metadata: {
          executionTime: 0,
          startTime: new Date(),
          endTime: new Date()
        }
      };
    }
  }
  
  configure(config: Partial<IAgentConfig>): void {
    // Atualizar configuração do agente
    if (config.agentInfo) {
      this.agentInfo = { ...this.agentInfo, ...config.agentInfo };
    }
    if (config.additionalInstructions) {
      this.additionalInstructions = config.additionalInstructions;
    }
    if (config.tools) {
      this.tools = config.tools;
    }
  }
  
  getInfo(): AgentInfo {
    return this.agentInfo;
  }
  
  validate(): boolean {
    return !!this.llm && !!this.agentInfo.name;
  }
  
  reset(): void {
    // Resetar estado interno se necessário
  }
}

/**
 * Step que executa um agente dentro de um workflow
 * 
 * Este step permite integrar agentes do sistema de forma transparente
 * com o WorkflowBuilder, suportando tanto agentes registrados quanto
 * configurações inline.
 */
export class AgentStep implements IWorkflowStep {
  public readonly id: string;
  public readonly dependsOn?: string[];
  public readonly async: boolean = true;
  
  private agentId?: string;
  private agentConfig?: any;
  private agent?: IAgent;
  private options: AgentStepOptions;
  
  /**
   * Cria uma nova instância do AgentStep
   * 
   * @param id Identificador único do step
   * @param agentConfig Configuração do agente (pode ser ID do agente registrado ou configuração inline)
   * @param options Opções do step
   */
  constructor(
    id: string,
    agentConfig: string | any,
    options: AgentStepOptions = {}
  ) {
    this.id = id;
    this.dependsOn = options.dependsOn;
    this.options = {
      timeout: 30000, // 30 segundos
      executeTools: false, // padrão: não executar ferramentas automaticamente
      maxToolIterations: 5, // máximo de 5 iterações
      toolExecutionTimeout: 10000, // 10 segundos por ferramenta
      ...options,
    };
    
    if (typeof agentConfig === 'string') {
      this.agentId = agentConfig;
      return;
    }

    this.agentConfig = agentConfig;
  }
  
  /**
   * Executa o agente dentro do contexto do workflow
   */
  public async execute(context: IWorkflowContext): Promise<IWorkflowResult> {
    const startTime = Date.now();
    
    try {
      // Obtém ou cria o agente
      const agent = await this.getAgent();
      
      // Prepara as mensagens de entrada
      const messages = this.prepareMessages(context);
      
      // Prepara as opções de execução
      const executionOptions = this.prepareExecutionOptions(context);
      
      // Executa o agente
      const result = await this.executeWithTimeout(
        agent.execute(messages, executionOptions),
        this.options.timeout || 30000 // Default 30 segundos
      );
      
      // Se executeTools estiver habilitado, executa as ferramentas
      let toolResults: any[] = [];
      if (this.options.executeTools && (result as any).toolCall) {
        toolResults = await this.executeTools((result as any).toolCall);
        
        const endTime = Date.now();
        const executionTime = endTime - startTime;
        
        // Armazena o resultado no contexto
        if (context.results) {
          context.results.set(this.id, {
            success: true,
            data: {
              originalResult: result,
              toolResults: toolResults,
              finalOutput: toolResults[toolResults.length - 1]?.result || result.content
            },
            metadata: {
              executionTime,
              startTime: new Date(startTime),
              endTime: new Date(endTime),
              agentId: this.agentId || 'inline',
              toolExecutions: toolResults.length,
            },
          });
        }
        
        // Atualiza o contexto com o resultado
        this.updateContext(context, {
          originalResult: result,
          toolResults: toolResults,
          finalOutput: toolResults[toolResults.length - 1]?.result || result.content
        });
        
        return {
          success: true,
          data: {
            originalResult: result,
            toolResults: toolResults,
            finalOutput: toolResults[toolResults.length - 1]?.result || result.content
          },
          metadata: {
            executionTime,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            agentId: this.agentId || 'inline',
            toolExecutions: toolResults.length,
          }
        };
      }
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Armazena o resultado no contexto
      if (context.results) {
        context.results.set(this.id, {
          success: true,
          data: result,
          metadata: {
            executionTime,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            agentId: this.agentId || 'inline',
            toolExecutions: toolResults.length,
          }
        });
      }
      
      // Atualiza o contexto com o resultado
      this.updateContext(context, result);
      
      return {
        success: true,
        data: result,
        metadata: {
          executionTime,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          agentId: this.agentId || 'inline',
        },
      };
      
    } catch (error) {
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Armazena o erro no contexto
      if (context.results) {
        context.results.set(this.id, {
          success: false,
          data: null,
          metadata: {
            executionTime,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            errorMessage: error instanceof Error ? error.message : String(error),
            errorType: error instanceof Error ? error.constructor.name : 'UnknownError',
            agentId: this.agentId || 'inline',
          },
        });
      }
      
      return {
        success: false,
        data: null,
        metadata: {
          executionTime,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          errorMessage: error instanceof Error ? error.message : String(error),
          errorType: error instanceof Error ? error.constructor.name : 'UnknownError',
          agentId: this.agentId || 'inline',
        },
      };
    }
  }
  
  /**
   * Obtém ou cria o agente
   */
  private async getAgent(): Promise<IAgent> {
    // Se já temos um agente criado, retornar
    if (this.agent) {
      return this.agent;
    }
    
    // Se temos um ID de agente registrado, usar o registry
    if (this.agentId) {
      const registry = AgentRegistry.getInstance();
      this.agent = registry.get(this.agentId) || undefined;
      if (!this.agent) {
        throw new Error(`Agente com ID '${this.agentId}' não encontrado no registro`);
      }
      return this.agent;
    }
    
    // Se temos configuração de LLM, criar agente adaptador
    if (this.agentConfig && this.options.llmConfig) {
      return this.createLLMBasedAgent();
    }
    
    // Se temos configuração inline, usar o comportamento antigo
    if (this.agentConfig) {
      // Para configuração inline, precisamos de uma abordagem diferente
      // Como não temos agentes concretos implementados, vamos usar um mock simples
      // Em uma implementação real, isso criaria um agente dinamicamente
      throw new Error('Agentes inline ainda não estão implementados. Use agentes registrados.');
    }
    
    throw new Error('Nenhuma configuração de agente válida fornecida');
  }
  
  /**
   * Cria um agente baseado em LLM
   */
  private createLLMBasedAgent(): IAgent {
    // Criar instância de LLM com configurações fornecidas
    const llm = new LLM({
      model: this.options.llmConfig!.model,
      apiKey: this.options.llmConfig!.apiKey,
      baseUrl: this.options.llmConfig!.baseUrl,
      defaults: this.options.llmConfig!.defaults
    });
    
    // Criar agente adaptador que usa o LLM diretamente
    return new LLMBasedAgentAdapter(llm, this.agentConfig, this.options.providerOptions);
  }
  
  /**
   * Executa as ferramentas quando executeTools está habilitado
   */
  private async executeTools(toolCall: any): Promise<any[]> {
    const results = [];
    let currentToolCall = toolCall;
    let iterations = 0;
    const maxIterations = this.options.maxToolIterations || 5;
    const timeout = this.options.toolExecutionTimeout || 10000;
    
    while (currentToolCall && iterations < maxIterations) {
      try {
        // Valida se é um IToolCall válido
        if (!this.isValidToolCall(currentToolCall)) {
          throw new Error('IToolCall inválido fornecido');
        }
        
        // Executa a ferramenta com timeout
        const toolResult = await this.executeToolWithTimeout(currentToolCall, timeout);
        
        results.push({
          toolCall: currentToolCall,
          result: toolResult,
          iteration: iterations,
          success: true
        });
        
        // Verifica se precisa continuar o ciclo ReAct
        const nextAction = this.extractNextAction(toolResult);
        if (!nextAction || this.isFinalResult(toolResult)) {
          break;
        }
        
        currentToolCall = nextAction;
        iterations++;
        
      } catch (error) {
        results.push({
          toolCall: currentToolCall,
          error: error instanceof Error ? error.message : String(error),
          iteration: iterations,
          success: false
        });
        break;
      }
    }
    
    return results;
  }
  
  /**
   * Valida se é um IToolCall válido
   */
  private isValidToolCall(toolCall: any): boolean {
    return toolCall && 
           typeof toolCall.toolName === 'string' && 
           toolCall.toolName.trim() !== '' &&
           typeof toolCall.params === 'object' &&
           toolCall.params !== null;
  }
  
  /**
   * Executa uma ferramenta com timeout
   */
  private async executeToolWithTimeout(toolCall: IToolCall, timeoutMs: number): Promise<any> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout da execução da ferramenta ${toolCall.toolName}`)), timeoutMs);
    });
    
    return Promise.race([ToolExecutor.execute(toolCall), timeoutPromise]);
  }
  
  /**
   * Extrai próxima ação do resultado (para ciclos ReAct)
   */
  private extractNextAction(result: any): IToolCall | null {
    // Se o resultado contiver uma nova ação, retorna
    if (result && result.nextAction && this.isValidToolCall(result.nextAction)) {
      return result.nextAction;
    }
    
    // Se o resultado for uma string e contiver uma nova ação, tenta extrair
    if (typeof result === 'string') {
      // Procura por padrão ReAct na resposta
      const actionMatch = result.match(/Action:\s*(\w+)\s*\(([^)]*)\)/);
      if (actionMatch) {
        try {
          const params = JSON.parse(actionMatch[2]);
          return {
            toolName: actionMatch[1],
            params: params
          };
        } catch (e) {
          // Se não conseguir fazer parse, ignora
        }
      }
    }
    
    return null;
  }
  
  /**
   * Verifica se é um resultado final (não precisa de mais ações)
   */
  private isFinalResult(result: any): boolean {
    // Se for uma string e não contiver "Action:" ou "Thought:", considera final
    if (typeof result === 'string') {
      return !result.includes('Action:') && !result.includes('Thought:');
    }
    
    // Se tiver uma flag indicando que é final
    if (result && result.isFinal === true) {
      return true;
    }
    
    // Por padrão, considera que precisa de mais iterações
    return false;
  }
  
  /**
   * Prepara as mensagens de entrada
   */
  private prepareMessages(context: IWorkflowContext): Message[] {
    const messages: Message[] = [];
    
    // Adiciona mensagens do contexto se existirem
    if (context.state.inputMessages) {
      messages.push(...context.state.inputMessages);
    }
    
    // Adiciona mensagens dos steps anteriores se configurado
    if (this.options.usePreviousResults) {
      const previousMessages = this.extractMessagesFromResults(context);
      messages.push(...previousMessages);
    }
    
    // Adiciona mensagem do usuário se existir
    if (context.state.userMessage) {
      messages.push({
        role: 'user',
        content: context.state.userMessage,
      });
    }
    
    return messages;
  }
  
  /**
   * Extrai mensagens dos resultados dos steps anteriores
   */
  private extractMessagesFromResults(context: IWorkflowContext): Message[] {
    const messages: Message[] = [];
    
    if (!this.dependsOn) {
      return messages;
    }
    
    this.dependsOn.forEach(depId => {
      const result = context.results?.get(depId);
      if (result && result.success && result.data) {
        // Adiciona o resultado como mensagem do assistente
        messages.push({
          role: 'assistant',
          content: JSON.stringify(result.data),
        });
      }
    });
    
    return messages;
  }
  
  /**
   * Prepara as opções de execução
   */
  private prepareExecutionOptions(context: IWorkflowContext): AgentExecutionOptions {
    const options: AgentExecutionOptions = {};
    
    // Adiciona instruções adicionais se configuradas
    if (this.options.additionalInstructions) {
      options.additionalInstructions = this.options.additionalInstructions;
    }
    
    // Adiciona ferramentas se configuradas
    if (this.options.tools) {
      options.tools = this.options.tools;
    }
    
    // Adiciona configurações de LLM se configuradas
    if (this.options.temperature !== undefined) {
      options.temperature = this.options.temperature;
    }
    
    if (this.options.topP !== undefined) {
      options.topP = this.options.topP;
    }
    
    if (this.options.maxTokens !== undefined) {
      options.maxTokens = this.options.maxTokens;
    }
    
    if (this.options.stream !== undefined) {
      options.stream = this.options.stream;
    }
    
    // Adiciona contexto do workflow
    options.context = {
      ...context.state,
      workflowId: context.config?.workflowId,
      stepId: this.id,
    };
    
    return options;
  }
  
  /**
   * Atualiza o contexto com o resultado do agente
   */
  private updateContext(context: IWorkflowContext, result: any): void {
    // Armazena o resultado principal
    context.state[this.id] = result;
    
    // Armazena o conteúdo se existir
    if (result.content) {
      context.state[`${this.id}.content`] = result.content;
    }
    
    // Armazena as ferramentas usadas se existirem
    if (result.toolsUsed) {
      context.state[`${this.id}.toolsUsed`] = result.toolsUsed;
    }
    
    // Armazena metadados se existirem
    if (result.metadata) {
      context.state[`${this.id}.metadata`] = result.metadata;
    }
    
    // Se configurado para extrair dados específicos
    if (this.options.extractData) {
      this.extractData(context, result);
    }
  }
  
  /**
   * Extrai dados específicos do resultado
   */
  private extractData(context: IWorkflowContext, result: any): void {
    const extractors = Array.isArray(this.options.extractData)
      ? this.options.extractData
      : [this.options.extractData];
    
    extractors.forEach((extractor, index) => {
      if (!extractor) return; // Skip undefined extractors
      
      const key = typeof extractor === 'string' ? extractor : extractor?.key || `extracted_${index}`;
      const path = typeof extractor === 'string' ? undefined : extractor?.path;
      
      let value: any;
      
      if (path) {
        // Usa lodash.get ou implementação simples
        value = this.getNestedValue(result, path);
        return;
      }

      value = result[key];
      
      const contextKey = typeof extractor === 'string'
        ? `${this.id}.${key}`
        : extractor?.contextKey || `${this.id}.${key}`;
      
      context.state[contextKey] = value;
    });
  }
  
  /**
   * Obtém valor aninhado de um objeto
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }
  
  /**
   * Executa uma operação com timeout
   */
  private async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout da execução do agente')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
  }

  /**
   * Verifica se o resultado do agente contém uma chamada de ferramenta
   */
  
  
  /**
   * Extrai IToolCall do resultado do agente
   */
  private extractToolCall(result: any): IToolCall | null {
    if (!result) return null;
    
    // Verifica se já é um IToolCall válido
    if (this.isValidToolCall(result)) {
      return result;
    }
    
    // Procura em estruturas comuns de resposta do agente
    if (result.toolCall && this.isValidToolCall(result.toolCall)) {
      return result.toolCall;
    }
    
    if (result.action && this.isValidToolCall(result.action)) {
      return result.action;
    }
    
    // Se o content for uma string, tenta extrair do formato ReAct
    if (typeof result.content === 'string') {
      return this.extractToolCallFromContent(result.content);
    }
    
    return null;
  }
  
  /**
   * Extrai IToolCall de conteúdo no formato ReAct
   */
  private extractToolCallFromContent(content: string): IToolCall | null {
    // Padrão ReAct: Action: toolName({"param": "value"})
    const actionMatch = content.match(/Action:\s*(\w+)\s*\((\{[^}]*\})\)/);
    if (actionMatch) {
      try {
        const params = JSON.parse(actionMatch[2]);
        return {
          toolName: actionMatch[1],
          params: params
        };
      } catch (e) {
        // Se não conseguir fazer parse do JSON, ignora
      }
    }
    
    // Padrão alternativo: Action: toolName param1=value1 param2=value2
    const simpleActionMatch = content.match(/Action:\s*(\w+)\s+(.+)/);
    if (simpleActionMatch) {
      const toolName = simpleActionMatch[1];
      const paramsStr = simpleActionMatch[2];
      
      // Tenta converter parâmetros simples para objeto
      const params: any = {};
      const paramMatches = paramsStr.match(/(\w+)=([^ ]+)/g);
      if (paramMatches) {
        paramMatches.forEach(param => {
          const [key, value] = param.split('=');
          params[key] = value;
        });
      }
      
      return {
        toolName: toolName,
        params: params
      };
    }
    
    return null;
  }
}

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

// Factory function para conveniência
export function createAgentStep(
  id: string,
  agentConfig: string | any,
  options?: AgentStepOptions
): AgentStep {
  return new AgentStep(id, agentConfig, options);
}