// src/orchestrators/workflows/steps/agentStep/AgentLLMFactory.ts
import { AgentRegistry } from '../../../../agents/registry';
import type { IAgent, IAgentConfig, AgentExecutionResult, AgentExecutionOptions } from '../../../../agents/interfaces';
import type { Message } from '../../../../memory';
import { LLM } from '../../../../llm';
import type { AgentInfo } from '../../../../promptBuilder';
import type { LLMConfig } from './interfaces';

/**
 * Fábrica para criação e registro de agentes LLM dinâmicos
 * 
 * Esta classe é responsável por criar agentes que encapsulam chamadas LLM diretas
 * e registrá-los no AgentRegistry para uso posterior.
 */
export class AgentLLMFactory {
  /**
   * Cria um agente LLM dinâmico e o registra no AgentRegistry
   * 
   * @param llmConfig Configurações do LLM
   * @param agentConfig Configurações do agente
   * @param providerOptions Opções específicas do provider
   * @returns ID do agente registrado
   */
  static createAndRegister(
    llmConfig: LLMConfig,
    agentConfig: any,
    providerOptions?: {
      temperature?: number;
      topP?: number;
      maxTokens?: number;
      stream?: boolean;
    }
  ): string {
    // Criar uma classe especial que encapsula as configs do LLM
    class DynamicLLMAgent implements IAgent {
      private agentInfo: AgentInfo;
      private additionalInstructions?: string;
      private tools?: any[];
      
      constructor(_config: IAgentConfig) {
        // Extrair informações do agente da configuração
        this.agentInfo = {
          name: agentConfig?.name || 'DynamicLLMAgent',
          goal: agentConfig?.goal || 'Execute LLM call directly',
          backstory: agentConfig?.backstory || 'Agent that makes direct LLM calls'
        };
        
        this.additionalInstructions = agentConfig?.additionalInstructions;
        this.tools = agentConfig?.tools;
      }
      
      get id(): string {
        return 'llm-based-agent';
      }
      
      get type(): string {
        return 'llm-direct';
      }
      
      get config(): IAgentConfig {
        return {
          type: 'llm-direct' as any,
          provider: 'llm-direct',
          model: llmConfig?.model || 'llm-direct',
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
          
          // Criar instância de LLM com as configs armazenadas
          const llm = new LLM({
            model: llmConfig.model,
            apiKey: llmConfig.apiKey,
            baseUrl: llmConfig.baseUrl,
            defaults: llmConfig.defaults
          });
          
          // Preparar parâmetros para chamada LLM
          const llmParams = {
            messages,
            mode: 'chat' as const,
            agentInfo: this.agentInfo,
            additionalInstructions: options?.additionalInstructions || this.additionalInstructions,
            tools: options?.tools || this.tools,
            temperature: options?.temperature || providerOptions?.temperature,
            topP: options?.topP || providerOptions?.topP,
            maxTokens: options?.maxTokens || providerOptions?.maxTokens,
            stream: options?.stream || providerOptions?.stream
          };
          
          // Fazer chamada direta ao LLM
          const result = await llm.invoke(llmParams);
          
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
        return !!llmConfig?.model && !!llmConfig?.apiKey;
      }
      
      reset(): void {
        // Resetar estado interno se necessário
      }
    }
    
    // Registrar a classe no AgentRegistry
    const registry = AgentRegistry.getInstance();
    const agentId = `llm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; // ID único para o agente
    
    // Criar configuração do agente para registro
    const agentConfigForRegistry: IAgentConfig = {
      type: 'llm-direct' as any,
      provider: 'llm-direct',
      model: llmConfig?.model || 'llm-direct',
      agentInfo: {
        name: agentConfig?.name || 'DynamicLLMAgent',
        goal: agentConfig?.goal || 'Execute LLM call directly',
        backstory: agentConfig?.backstory || 'Agent that makes direct LLM calls'
      },
      additionalInstructions: agentConfig?.additionalInstructions,
      tools: agentConfig?.tools
    };
    
    // Registrar a classe no AgentRegistry
    registry.register(agentId, DynamicLLMAgent as any, agentConfigForRegistry);
    
    return agentId;
  }
}