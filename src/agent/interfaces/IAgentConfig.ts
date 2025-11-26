// src/agents/interfaces/IAgentConfig.ts
import type { AgentInfo } from '../../promptBuilder';
import type { ToolSchema } from '../../promptBuilder/promptBuilder.interface';

// Re-export ToolSchema for convenience
export type { ToolSchema } from '../../promptBuilder/promptBuilder.interface';

/**
 * Tipos de agente suportados pelo sistema.
 * 
 * Define os modos de operação disponíveis para agentes de IA,
 * cada um com comportamentos e capacidades específicas.
 */
export type AgentType = 'chat' | 'react' | string;

/**
 * Configuração base para todos os agentes do sistema.
 * 
 * Esta interface define todos os parâmetros necessários para configurar
 * um agente de IA, incluindo informações do modelo, ferramentas,
 * configurações de memória e parâmetros customizados.
 * 
 * ## Estrutura da Configuração
 * 
 * - **Identificação**: type, provider, model para especificar o agente
 * - **Personalização**: agentInfo, additionalInstructions para comportamento
 * - **Ferramentas**: tools para capacidades estendidas
 * - **LLM**: llmConfig para controle fino do modelo
 * - **Memória**: memoryConfig para gerenciamento de contexto
 * - **Customização**: customConfig para extensibilidade
 * 
 * @example
 * ```typescript
 * // Configuração básica para agente de chat
 * const chatConfig: IAgentConfig = {
 *   type: 'chat',
 *   provider: 'openai',
 *   model: 'gpt-4',
 *   agentInfo: {
 *     name: 'Assistente Virtual',
 *     role: 'Assistente prestativo',
 *     backstory: 'Sou um assistente virtual designed para ajudar usuários'
 *   },
 *   llmConfig: {
 *     temperature: 0.7,
 *     maxTokens: 1000
 *   }
 * };
 * 
 * // Configuração avançada para agente ReAct
 * const reactConfig: IAgentConfig = {
 *   type: 'react',
 *   provider: 'openaiCompatible',
 *   model: 'claude-3-sonnet',
 *   agentInfo: {
 *     name: 'Agente de Pesquisa',
 *     role: 'Pesquisador especializado',
 *     backstory: 'Especializado em encontrar informações precisas e atualizadas'
 *   },
 *   tools: [searchTool, calculatorTool, webScraperTool],
 *   llmConfig: {
 *     temperature: 0.3,
 *     topP: 0.9,
 *     maxTokens: 2000
 *   },
 *   memoryConfig: {
 *     maxContextTokens: 16384,
 *     preserveSystemPrompt: true,
 *     maxMessages: 50
 *   },
 *   customConfig: {
 *     researchDepth: 'comprehensive',
 *     citationStyle: 'apa'
 *   }
 * };
 * ```
 * 
 * @see {@link AgentInfo} Para informações do agente
 * @see {@link ToolSchema} Para definição de ferramentas
 * @see {@link DEFAULT_AGENT_CONFIG} Para configuração padrão
 * @see {@link validateAgentConfig} Para validação de configuração
 */
export interface IAgentConfig {
  /**
   * Tipo/categoria do agente.
   * 
   * Define o comportamento e capacidades do agente:
   * - **'chat'**: Agente conversacional simples
   * - **'react'**: Agente com reasoning e action (ReAct pattern)
   * - **string customizado**: Tipos personalizados para agentes específicos
   * 
   * @example
   * ```typescript
   * type: 'chat'        // Agente conversacional
   * type: 'react'       // Agente com ferramentas
   * type: 'researcher'  // Agente personalizado
   * ```
   */
  type: AgentType;

  /**
   * Provedor do modelo de linguagem.
   * 
   * Identifica qual provedor LLM será usado:
   * - **'openai'**: OpenAI GPT models
   * - **'openaiCompatible'**: APIs compatíveis (Anthropic, Cohere, etc.)
   * - **string customizado**: Outros provedores suportados
   * 
   * @example
   * ```typescript
   * provider: 'openai'              // OpenAI oficial
   * provider: 'openaiCompatible'    // Anthropic, Cohere, etc.
   * provider: 'azure-openai'        // Azure OpenAI
   * provider: 'local-llm'           // Modelos locais
   * ```
   */
  provider: string;

  /**
   * Modelo específico do LLM a ser utilizado.
   * 
   * Nome do modelo conforme suportado pelo provedor:
   * - OpenAI: 'gpt-4', 'gpt-3.5-turbo'
   * - Anthropic: 'claude-3-opus', 'claude-3-sonnet'
   * - Outros: conforme documentação do provedor
   * 
   * @example
   * ```typescript
   * model: 'gpt-4'              // OpenAI GPT-4
   * model: 'claude-3-sonnet'    // Anthropic Claude 3 Sonnet
   * model: 'llama-2-70b'        // Meta Llama 2
   * ```
   */
  model: string;

  /**
   * Informações do agente para compor o system prompt.
   * 
   * Dados estruturados que definem a identidade, papel e
   * comportamento do agente. Usados para construir prompts
   * personalizados e consistentes.
   * 
   * @example
   * ```typescript
   * agentInfo: {
   *   name: 'Assistente de Código',
   *   role: 'Especialista em desenvolvimento de software',
   *   backstory: 'Tenho 10 anos de experiência em TypeScript e Node.js'
   * }
   * ```
   * 
   * @see {@link AgentInfo} Para formato completo das informações
   */
  agentInfo: AgentInfo;

  /**
   * Instruções adicionais para o agente.
   * 
   * Texto livre que será adicionado ao prompt do sistema para
   * personalizar comportamento específico. Útil para casos
   * especiais ou ajustes temporários.
   * 
   * @example
   * ```typescript
   * additionalInstructions: 'Sempre responda em português brasileiro'
   * additionalInstructions: 'Use exemplos práticos e evite jargões técnicos'
   * additionalInstructions: 'Foque em soluções sustentáveis e econômicas'
   * ```
   */
  additionalInstructions?: string;

  /**
   * Ferramentas disponíveis para o agente.
   * 
   * Lista de schemas de ferramentas que o agente pode usar
   * durante a execução. Disponível apenas para agentes que
   * suportam ferramentas (ex: tipo 'react').
   * 
   * @example
   * ```typescript
   * tools: [
   *   { name: 'calculator', description: 'Realiza cálculos', schema: {...} },
   *   { name: 'search', description: 'Busca informações', schema: {...} }
   * ]
   * ```
   * 
   * @see {@link ToolSchema} Para formato dos schemas de ferramenta
   */
  tools?: ToolSchema[];

  /**
   * Configurações específicas do modelo de linguagem.
   * 
   * Parâmetros que controlam o comportamento do LLM durante
   * a geração de texto, permitindo ajuste fino para diferentes
   * casos de uso.
   * 
   * @example
   * ```typescript
   * llmConfig: {
   *   temperature: 0.7,    // Criatividade
   *   topP: 0.9,          // Diversidade vocabular
   *   maxTokens: 2000,    // Limite de resposta
   *   baseUrl: 'https://api.openai.com/v1'  // URL customizada
   * }
   * ```
   */
  llmConfig?: {
    /**
     * Temperatura do modelo (0.0 a 2.0).
     * 
     * Controla criatividade e aleatoriedade:
     * - **0.0-0.3**: Respostas mais determinísticas (tarefas técnicas)
     * - **0.4-0.7**: Equilíbrio (conversas gerais)
     * - **0.8-2.0**: Mais criativas (tarefas criativas)
     * 
     * @example
     * ```typescript
     * temperature: 0.1  // Para cálculos precisos
     * temperature: 0.7  // Para conversas naturais
     * temperature: 1.2  // Para brainstorming
     * ```
     */
    temperature?: number;

    /**
     * Núcleo de sampling (0.0 a 1.0).
     * 
     * Controla diversidade do vocabulário usado:
     * - **0.1**: Vocabulário restrito, respostas previsíveis
     * - **0.5**: Equilíbrio entre previsibilidade e diversidade
     * - **0.9-1.0**: Vocabulário amplo, máxima diversidade
     * 
     * Geralmente usado em conjunto com temperature.
     * 
     * @example
     * ```typescript
     * topP: 0.1   // Respostas conservadoras
     * topP: 0.9   // Respostas diversificadas
     * ```
     */
    topP?: number;

    /**
     * Máximo de tokens de saída.
     * 
     * Limita o tamanho da resposta gerada:
     * - **100-500**: Respostas curtas e diretas
     * - **500-2000**: Respostas médias e detalhadas
     * **2000+**: Respostas longas e abrangentes
     * 
     * @example
     * ```typescript
     * maxTokens: 100   // Resposta muito concisa
     * maxTokens: 1000  // Resposta padrão
     * maxTokens: 4000  // Resposta detalhada
     * ```
     */
    maxTokens?: number;

    /**
     * URL base para provedores compatíveis.
     * 
     * Permite usar APIs customizadas ou provedores
     * compatíveis com OpenAI. Útil para:
     * - APIs self-hosted
     * - Provedores regionais
     * - Ambientes corporativos
     * 
     * @example
     * ```typescript
     * baseUrl: 'https://api.openai.com/v1'           // OpenAI oficial
     * baseUrl: 'https://api.anthropic.com'           // Anthropic
     * baseUrl: 'http://localhost:8000/v1'            // Local
     * ```
     */
    baseUrl?: string;
  };

  /**
   * Configurações de gerenciamento de memória/contexto.
   * 
   * Parâmetros que controlam como o agente gerencia o histórico
   * de conversas e mantém contexto ao longo da sessão.
   * 
   * @example
   * ```typescript
   * memoryConfig: {
   *   maxContextTokens: 8192,      // Limite de tokens de contexto
   *   preserveSystemPrompt: true,  // Manter prompt do sistema
   *   maxMessages: 100             // Máximo de mensagens no histórico
   * }
   * ```
   */
  memoryConfig?: {
    /**
     * Máximo de tokens de contexto.
     * 
     * Limite total de tokens que podem ser mantidos no
     * contexto da conversa. Inclui prompt do sistema,
     * histórico e resposta atual.
     * 
     * @example
     * ```typescript
     * maxContextTokens: 4096   // Contexto limitado
     * maxContextTokens: 8192   // Contexto padrão
     * maxContextTokens: 32768  // Contexto amplo
     * ```
     */
    maxContextTokens?: number;

    /**
     * Manter mensagens do system prompt.
     * 
     * Se true, o prompt do sistema é sempre incluído no
     * contexto, garantindo comportamento consistente.
     * Se false, pode ser removido para economizar tokens.
     * 
     * @example
     * ```typescript
     * preserveSystemPrompt: true   // Sempre incluir (padrão)
     * preserveSystemPrompt: false  // Otimizar tokens
     * ```
     */
    preserveSystemPrompt?: boolean;

    /**
     * Limite de mensagens a manter no histórico.
     * 
     * Número máximo de mensagens da conversa que serão
     * mantidas no contexto. Mensagens antigas são
     * removidas para respeitar limites de tokens.
     * 
     * @example
     * ```typescript
     * maxMessages: 20    // Histórico curto
     * maxMessages: 100   // Histórico padrão
     * maxMessages: 500   // Histórico longo
     * ```
     */
    maxMessages?: number;
  };

  /**
   * Configurações customizadas específicas do agente.
   * 
   * Objeto flexível para parâmetros específicos que não
   * se encaixam nas categorias padrão. Permite extensibilidade
   * sem quebrar a interface principal.
   * 
   * @example
   * ```typescript
   * customConfig: {
   *   // Configurações de pesquisa
   *   researchDepth: 'comprehensive',
   *   citationStyle: 'apa',
   *   
   *   // Configurações de código
   *   preferredLanguage: 'TypeScript',
   *   codeStyle: 'functional',
   *   
   *   // Configurações de domínio
   *   domain: 'healthcare',
   *   complianceLevel: 'strict',
   *   
   *   // Configurações de UI
   *   responseFormat: 'markdown',
   *   includeExamples: true
   * }
   * ```
   */
  customConfig?: Record<string, any>;
}

/**
 * Configuração padrão para agentes do sistema.
 * 
 * Valores padrão sensatos que podem ser usados como base
 * para configurações de agentes, garantindo comportamento
 * consistente e configurações razoáveis.
 * 
 * ## Valores Padrão
 * 
 * - **LLM**: temperature moderada (0.5), topP completo (1.0), maxTokens padrão (1000)
 * - **Memória**: contexto amplo (8192 tokens), preservar system prompt, histórico médio (100 mensagens)
 * 
 * @example
 * ```typescript
 * // Usar como base para configuração customizada
 * const myConfig: Partial<IAgentConfig> = {
 *   ...DEFAULT_AGENT_CONFIG,
 *   type: 'react',
 *   provider: 'openai',
 *   model: 'gpt-4',
 *   agentInfo: {
 *     name: 'Meu Agente',
 *     role: 'Assistente personalizado',
 *     backstory: 'Agente criado para tarefas específicas'
 *   }
 * };
 * 
 * // Validar configuração baseada no padrão
 * const errors = validateAgentConfig(myConfig as IAgentConfig);
 * if (errors.length > 0) {
 *   console.error('Configuração inválida:', errors);
 * }
 * ```
 * 
 * @see {@link IAgentConfig} Para estrutura completa da configuração
 * @see {@link validateAgentConfig} Para validação de configurações
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
 * Valida configuração de agente e retorna lista de erros.
 * 
 * Função utilitária que verifica se uma configuração de agente
 * está completa e válida, retornando array com mensagens de erro
 * descritivas para problemas encontrados.
 * 
 * ## Validações Realizadas
 * 
 * - **Campos Obrigatórios**: type, provider, model, agentInfo
 * - **AgentInfo**: name, goal, backstory
 * - **LLM Config**: ranges válidos para temperature, topP, maxTokens
 * - **Tipos**: Verificação de tipos básicos
 * 
 * @param config Configuração do agente a ser validada.
 * 
 * @returns Array com mensagens de erro. Array vazio = configuração válida.
 * 
 * @example
 * ```typescript
 * // Configuração válida
 * const validConfig: IAgentConfig = {
 *   type: 'chat',
 *   provider: 'openai',
 *   model: 'gpt-4',
 *   agentInfo: {
 *     name: 'Assistente',
 *     role: 'Ajuda usuários',
 *     backstory: 'Agente prestativo'
 *   }
 * };
 * 
 * const errors = validateAgentConfig(validConfig);
 * console.log(errors.length); // 0
 * 
 * // Configuração inválida
 * const invalidConfig = {
 *   type: '',
 *   provider: 'openai',
 *   model: 'gpt-4'
 * };
 * 
 * const errors2 = validateAgentConfig(invalidConfig as IAgentConfig);
 * console.log(errors2);
 * // ['Tipo do agente é obrigatório', 'Informações do agente são obrigatórias']
 * ```
 * 
 * @see {@link IAgentConfig} Para estrutura da configuração
 * @see {@link DEFAULT_AGENT_CONFIG} Para valores padrão
 */
export function validateAgentConfig(config: IAgentConfig): string[] {
  const errors: string[] = [];

  // 1. Validar campos obrigatórios básicos
  if (!config.type) {
    errors.push('Tipo do agente é obrigatório');
  }

  if (!config.provider) {
    errors.push('Provedor é obrigatório');
  }

  if (!config.model) {
    errors.push('Modelo é obrigatório');
  }

  // 2. Validar agentInfo
  if (!config.agentInfo) {
    errors.push('Informações do agente são obrigatórias');
    return errors; // Não pode validar agentInfo se não existe
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

  // 3. Validar configurações do LLM
  if (config.llmConfig) {
    // Validar temperature
    if (config.llmConfig.temperature !== undefined &&
      (config.llmConfig.temperature < 0 || config.llmConfig.temperature > 2)) {
      errors.push('Temperatura deve estar entre 0.0 e 2.0');
    }

    // Validar topP
    if (config.llmConfig.topP !== undefined &&
      (config.llmConfig.topP < 0 || config.llmConfig.topP > 1)) {
      errors.push('TopP deve estar entre 0.0 e 1.0');
    }

    // Validar maxTokens
    if (config.llmConfig.maxTokens !== undefined && config.llmConfig.maxTokens <= 0) {
      errors.push('MaxTokens deve ser maior que 0');
    }
  }

  return errors;
}