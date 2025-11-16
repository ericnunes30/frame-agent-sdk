// src/agents/interfaces/IAgentConfig.ts
import type { AgentInfo, PromptMode } from '../../promptBuilder';

/**
 * Modos de agente suportados
 */
export type AgentType = 'chat' | 'react' | string;

/**
 * Configuração base para todos os agentes
 */
export interface IAgentConfig {
  /**
   * Tipo do agente
   */
  type: AgentType;
  
  /**
   * Provedor do modelo (openai, openaiCompatible, etc.)
   */
  provider: string;
  
  /**
   * Modelo do LLM a ser utilizado
   */
  model: string;
  
  /**
   * Informações do agente para compor o system prompt
   */
  agentInfo: AgentInfo;
  
  /**
   * Instruções adicionais para o agente
   */
  additionalInstructions?: string;
  
  /**
   * Ferramentas disponíveis para o agente
   */
  tools?: ToolSchema[];
  
  /**
   * Configurações do LLM
   */
  llmConfig?: {
    /**
     * Temperatura do modelo (0.0 a 2.0)
     */
    temperature?: number;
    
    /**
     * Núcleo de sampling (0.0 a 1.0)
     */
    topP?: number;
    
    /**
     * Máximo de tokens de saída
     */
    maxTokens?: number;
    
    /**
     * URL base para provedores compatíveis
     */
    baseUrl?: string;
  };
  
  /**
   * Configurações de memória
   */
  memoryConfig?: {
    /**
     * Máximo de tokens de contexto
     */
    maxContextTokens?: number;
    
    /**
     * Manter mensagens do sistema
     */
    preserveSystemPrompt?: boolean;
    
    /**
     * Limite de mensagens a manter
     */
    maxMessages?: number;
  };
  
  /**
   * Configurações customizadas do agente
   */
  customConfig?: Record<string, any>;
}

/**
 * Esquema de ferramenta para configuração do agente
 */
export interface ToolSchema {
  /**
   * Nome da ferramenta
   */
  name: string;
  
  /**
   * Descrição da ferramenta
   */
  description: string;
  
  /**
   * Schema dos parâmetros (compatível com JSON Schema)
   */
  parameters: {
    /**
     * Tipo do parâmetro
     */
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    
    /**
     * Descrição do parâmetro
     */
    description?: string;
    
    /**
     * Se o parâmetro é obrigatório
     */
    required?: boolean;
    
    /**
     * Valores permitidos (para enum)
     */
    enum?: Array<string | number | boolean>;
    
    /**
     * Valor padrão
     */
    default?: any;
    
    /**
     * Mínimo (para números)
     */
    min?: number;
    
    /**
     * Máximo (para números)
     */
    max?: number;
    
    /**
     * Comprimento mínimo (para strings/arrays)
     */
    minLength?: number;
    
    /**
     * Comprimento máximo (para strings/arrays)
     */
    maxLength?: number;
    
    /**
     * Propriedades adicionais para objetos
     */
    properties?: Record<string, ToolSchema['parameters']>;
    
    /**
     * Itens para arrays
     */
    items?: ToolSchema['parameters'];
  };
}

/**
 * Configuração padrão para agentes
 */
export const DEFAULT_AGENT_CONFIG: Partial<IAgentConfig> = {
  llmConfig: {
    temperature: 0.5,
    topP: 1.0,
    maxTokens: 1000,
  },
  memoryConfig: {
    maxContextTokens: 8192,
    preserveSystemPrompt: true,
    maxMessages: 100,
  },
};

/**
 * Validação básica de configuração do agente
 */
export function validateAgentConfig(config: IAgentConfig): string[] {
  const errors: string[] = [];
  
  if (!config.type) {
    errors.push('Tipo do agente é obrigatório');
  }
  
  if (!config.provider) {
    errors.push('Provedor é obrigatório');
  }
  
  if (!config.model) {
    errors.push('Modelo é obrigatório');
  }
  
  if (!config.agentInfo) {
    errors.push('Informações do agente são obrigatórias');
    return errors;
  }

  if (!config.agentInfo.name) {
    errors.push('Nome do agente é obrigatório');
  }
  
  if (!config.agentInfo.goal) {
    errors.push('Objetivo do agente é obrigatório');
  }
  
  if (!config.agentInfo.backstory) {
    errors.push('Histórico do agente é obrigatório');
  }
  
  // Validações de LLM config
  if (config.llmConfig) {
    if (config.llmConfig.temperature !== undefined && 
        (config.llmConfig.temperature < 0 || config.llmConfig.temperature > 2)) {
      errors.push('Temperatura deve estar entre 0.0 e 2.0');
    }
    
    if (config.llmConfig.topP !== undefined && 
        (config.llmConfig.topP < 0 || config.llmConfig.topP > 1)) {
      errors.push('TopP deve estar entre 0.0 e 1.0');
    }
    
    if (config.llmConfig.maxTokens !== undefined && config.llmConfig.maxTokens <= 0) {
      errors.push('MaxTokens deve ser maior que 0');
    }
  }
  
  return errors;
}