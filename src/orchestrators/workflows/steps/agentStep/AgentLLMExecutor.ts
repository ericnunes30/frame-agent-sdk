// src/orchestrators/workflows/steps/agentStep/AgentLLMExecutor.ts
import { 
  IWorkflowStep, 
  IWorkflowContext, 
  IWorkflowResult 
} from '../interfaces';
import { AgentRegistry } from '../../../../agents/registry';
import type { IAgent, AgentExecutionOptions } from '../../../../agents/interfaces';
import type { Message } from '../../../../memory';
import { IToolCall } from '../../../../tools/core/interfaces';
import { ToolExecutor } from '../../../../tools/core/toolExecutor';
import { AgentLLMFactory } from './AgentLLMFactory';
import type { LLMConfig, AgentStepOptions } from './interfaces';

/**
 * Executor de agentes LLM registrados
 * 
 * Esta classe é responsável por executar agentes LLM, seja eles pré-registrados
 * ou criados dinamicamente através da AgentLLMFactory.
 */
export class AgentLLMExecutor implements IWorkflowStep {
  public readonly id: string;
  public readonly dependsOn?: string[];
  public readonly async: boolean = true;
  
  private agentId?: string;
  private agent?: IAgent;
  private options: AgentStepOptions;
  
  /**
   * Cria uma nova instância do AgentLLMExecutor
   * 
   * @param id Identificador único do step
   * @param agentConfig Configuração do agente (pode ser ID do agente registrado ou configuração LLM direta)
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

    // Se temos configuração de LLM, criar e registrar o agente dinamicamente
    if (agentConfig && this.options.llmConfig) {
      this.agentId = AgentLLMFactory.createAndRegister(
        this.options.llmConfig,
        agentConfig,
        this.options.providerOptions
      );
    }
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
          success: result.success,
          data: result.content,
          metadata: {
            executionTime,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            agentId: this.agentId || 'inline',
            ...result.metadata
          },
        });
      }
      
      // Atualiza o contexto com o resultado
      this.updateContext(context, result.content);
      
      return {
        success: result.success,
        data: result.content,
        metadata: {
          executionTime,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          agentId: this.agentId || 'inline',
          ...result.metadata
        }
      };
      
    } catch (error) {
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      console.error(`Erro na execução do AgentStep '${this.id}':`, error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Armazena o erro no contexto
      if (context.results) {
        context.results.set(this.id, {
          success: false,
          data: null,
          metadata: {
            executionTime,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            agentId: this.agentId || 'inline',
            errorMessage,
            errorType: error instanceof Error ? error.constructor.name : 'UnknownError'
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
          agentId: this.agentId || 'inline',
          errorMessage,
          errorType: error instanceof Error ? error.constructor.name : 'UnknownError'
        }
      };
    }
  }
  
  /**
   * Obtém ou cria o agente
   */
  private async getAgent(): Promise<IAgent> {
    if (this.agent) {
      return this.agent;
    }
    
    if (this.agentId) {
      // Usa agente registrado
      const registry = AgentRegistry.getInstance();
      this.agent = registry.get(this.agentId) || undefined;
      if (!this.agent) {
        throw new Error(`Agente com ID '${this.agentId}' não encontrado no registro`);
      }
      return this.agent;
    }
    
    throw new Error('Nenhuma configuração de agente válida fornecida');
  }
  
  /**
   * Prepara as mensagens de entrada para o agente
   */
  private prepareMessages(context: IWorkflowContext): Message[] {
    const messages: Message[] = [];
    
    // Adiciona mensagens dos steps anteriores se configurado
    if (this.options.usePreviousResults && context.results) {
      for (const [stepId, result] of context.results) {
        if (result.success && result.data) {
          messages.push({
            role: 'system',
            content: `Resultado do step '${stepId}': ${JSON.stringify(result.data)}`
          });
        }
      }
    }
    
    // Adiciona contexto adicional se fornecido
    if (this.options.context) {
      messages.push({
        role: 'system',
        content: `Contexto adicional: ${JSON.stringify(this.options.context)}`
      });
    }
    
    // Adiciona estado do workflow
    if (context.state) {
      messages.push({
        role: 'system',
        content: `Estado do workflow: ${JSON.stringify(context.state)}`
      });
    }
    
    return messages;
  }
  
  /**
   * Prepara as opções de execução para o agente
   */
  private prepareExecutionOptions(context: IWorkflowContext): AgentExecutionOptions {
    return {
      additionalInstructions: this.options.additionalInstructions,
      tools: this.options.tools,
      temperature: this.options.temperature,
      topP: this.options.topP,
      maxTokens: this.options.maxTokens,
      stream: this.options.stream,
      context: context.state
    };
  }
  
  /**
   * Executa uma promise com timeout
   */
  private async executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout da execução do agente após ${timeoutMs}ms`)), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
  }
  
  /**
   * Executa as ferramentas quando executeTools está habilitado
   */
  private async executeTools(toolCall: any): Promise<any[]> {
    const results: Array<{
      toolCall?: any;
      result?: any;
      error?: string;
      iteration: number;
      success: boolean;
    }> = [];
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
   * Extrai a próxima ação do resultado da ferramenta
   */
  private extractNextAction(toolResult: any): IToolCall | null {
    if (!toolResult) return null;
    
    // Procura por toolCall no resultado
    if (toolResult.toolCall) {
      return this.isValidToolCall(toolResult.toolCall) ? toolResult.toolCall : null;
    }
    
    // Procura por action no resultado
    if (toolResult.action) {
      return this.isValidToolCall(toolResult.action) ? toolResult.action : null;
    }
    
    return null;
  }
  
  /**
   * Verifica se o resultado é final
   */
  private isFinalResult(toolResult: any): boolean {
    if (!toolResult) return true;
    
    // Se tiver conteúdo significativo e não tiver toolCall, é final
    if (toolResult.content && typeof toolResult.content === 'string' && toolResult.content.trim().length > 0) {
      return !toolResult.toolCall;
    }
    
    return false;
  }
  
  /**
   * Atualiza o contexto com o resultado
   */
  private updateContext(context: IWorkflowContext, data: any): void {
    if (!context.state) {
      context.state = {};
    }
    
    // Armazena o resultado no estado
    context.state[this.id] = data;
    
    // Extrai dados específicos se configurado
    if (this.options.extractData) {
      this.extractData(context, data);
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
   * Obtém valor aninhado de um objeto usando path
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }
}