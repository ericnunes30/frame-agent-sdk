// src/llm/llm.ts
import { ProviderAdapter } from '../../providers/adapter/providerAdapter';
import type { Message } from '../../memory';
import type { IProviderResponse } from '../../providers/adapter/providerAdapter.interface';
import type { ProviderConfig } from '../../providers/adapter/providerAdapter.interface';
import { PromptBuilder } from '../../promptBuilder';
import type { PromptBuilderConfig, PromptMode, AgentInfo, ToolSchema } from '../../promptBuilder';

import type { AgentLLMConfig, ProviderDefaults } from '../interfaces/agentLLM.interface';

/**
 * Cliente LLM especializado para agentes de IA.
 * 
 * Esta classe fornece uma interface simplificada e especializada para
 * agentes de IA interagirem com modelos de linguagem, integrando
 * seamlessly com ProviderAdapter e PromptBuilder.
 * 
 * ## Características Principais
 * 
 * - **Configuração Fixa**: Mantém modelo e API key fixos para consistência
 * - **Geração Automática de Prompts**: Integração com PromptBuilder para system prompts
 * - **Parâmetros Flexíveis**: Suporte a overrides por chamada
 * - **Integração Completa**: Funciona com todos os provedores suportados
 * - **Metadados Ricos**: Retorna informações detalhadas da execução
 * 
 * ## Fluxo de Operação
 * 
 * 1. **Configuração**: Define modelo, API key e parâmetros padrão
 * 2. **Construção de Prompt**: Usa PromptBuilder para gerar system prompt
 * 3. **Execução**: Chama ProviderAdapter com configuração completa
 * 4. **Retorno**: Fornece conteúdo e metadados da resposta
 * 
 * ## Integração com Módulos
 * 
 * - **ProviderAdapter**: Para comunicação com provedores LLM
 * - **PromptBuilder**: Para geração automática de system prompts
 * - **Memory**: Para gerenciamento de mensagens e contexto
 * - **Tools**: Para suporte a ferramentas quando configurado
 * 
 * @example
 * ```typescript
 * // Configuração básica
 * const agentLLM = new AgentLLM({
 *   model: 'openai-gpt-4',
 *   apiKey: 'sk-...',
 *   defaults: { temperature: 0.7, maxTokens: 1000 }
 * });
 * 
 * // Execução com modo chat
 * const result1 = await agentLLM.invoke({
 *   messages: [{ role: 'user', content: 'Olá!' }],
 *   mode: 'chat',
 *   agentInfo: {
 *     name: 'Assistant',
 *     role: 'Helpful assistant',
 *     backstory: 'Friendly and knowledgeable'
 *   }
 * });
 * 
 * // Execução com ferramentas (modo react)
 * const result2 = await agentLLM.invoke({
 *   messages: [{ role: 'user', content: 'Calcule 2+2' }],
 *   mode: 'react',
 *   agentInfo: {
 *     name: 'Calculator Assistant',
 *     role: 'Math helper',
 *     backstory: 'Expert in calculations'
 *   },
 *   tools: [calculatorToolSchema]
 * });
 * 
 * console.log(result1.content);
 * console.log(result2.metadata);
 * ```
 * 
 * @see {@link AgentLLMConfig} Para configuração da classe
 * @see {@link ProviderDefaults} Para parâmetros padrão
 * @see {@link PromptBuilder} Para geração de prompts
 * @see {@link ProviderAdapter} Para comunicação com provedores
 */
export class AgentLLM {
  /** Modelo de linguagem configurado */
  private readonly model: string;
  /** Chave de API do provedor */
  private readonly apiKey: string;
  /** Parâmetros padrão de geração */
  private readonly defaults: ProviderDefaults;
  /** URL base customizada (opcional) */
  private readonly baseUrl?: string;
  /** Provedor explícito (opcional) */
  private readonly provider?: string;

  /**
   * Cria uma instância de AgentLLM a partir de uma configuração estruturada.
   * 
   * Método factory que facilita a criação de instâncias usando
   * a configuração completa AgentLLMConfig.
   * 
   * @param config Configuração completa do AgentLLM.
   * Deve incluir model e apiKey obrigatoriamente.
   * 
   * @returns Nova instância de AgentLLM configurada.
   * 
   * @example
   * ```typescript
   * const config: AgentLLMConfig = {
   *   model: 'openai-gpt-4',
   *   apiKey: 'sk-1234567890',
   *   defaults: {
   *     temperature: 0.7,
   *     maxTokens: 1000
   *   },
   *   baseUrl: 'https://api.openai.com/v1'
   * };
   * 
   * const agentLLM = AgentLLM.fromConfig(config);
   * ```
   * 
   * @see {@link AgentLLMConfig} Para formato da configuração
   */
  static fromConfig(config: AgentLLMConfig): AgentLLM {
    return new AgentLLM({
      model: config.model,
      provider: config.provider,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      defaults: config.defaults,
    });
  }

  /**
   * Cria uma instância de AgentLLM com parâmetros individuais.
   * 
   * Construtor que permite especificar cada parâmetro separadamente,
   * oferecendo máxima flexibilidade na configuração.
   * 
   * @param params Parâmetros de configuração.
   * 
   * @example
   * ```typescript
   * // Configuração simples
   * const agentLLM1 = new AgentLLM({
   *   model: 'openai-gpt-3.5-turbo',
   *   apiKey: 'sk-...'
   * });
   * 
   * // Configuração com parâmetros padrão
   * const agentLLM2 = new AgentLLM({
   *   model: 'anthropic-claude-3-sonnet',
   *   apiKey: 'sk-ant-...',
   *   defaults: {
   *     temperature: 0.5,
   *     topP: 0.9,
   *     maxTokens: 2000
   *   },
   *   baseUrl: 'https://api.anthropic.com'
   * });
   * ```
   * 
   * @see {@link ProviderDefaults} Para parâmetros padrão
   */
  constructor(params: { model: string; provider?: string; apiKey: string; defaults?: ProviderDefaults; baseUrl?: string }) {
    this.model = params.model;
    this.provider = params.provider;
    this.apiKey = params.apiKey;
    this.defaults = params.defaults ?? {};
    this.baseUrl = params.baseUrl;
  }

  /**
   * Invoca o modelo de linguagem com parâmetros flexíveis.
   * 
   * Método principal que executa a interação com o LLM. Suporta
   * tanto system prompts customizados quanto geração automática
   * via PromptBuilder usando mode e agentInfo.
   * 
   * ## Estratégias de Prompt
   * 
   * - **systemPrompt direto**: Use systemPrompt para controle total
   * - **Geração automática**: Use mode + agentInfo para prompts gerados
   * - **PromptBuilder**: Integração automática com PromptBuilder
   * 
   * @param args Parâmetros de invocação flexíveis.
   * 
   * @returns Promise com conteúdo e metadados da resposta.
   * 
   * @example
   * ```typescript
   * // Com system prompt customizado
   * const result1 = await agentLLM.invoke({
   *   messages: [{ role: 'user', content: 'Hello' }],
   *   systemPrompt: 'You are a helpful assistant.',
   *   temperature: 0.7
   * });
   * 
   * // Com geração automática de prompt
   * const result2 = await agentLLM.invoke({
   *   messages: [{ role: 'user', content: 'Help me with math' }],
   *   mode: 'chat',
   *   agentInfo: {
   *     name: 'Math Tutor',
   *     role: 'Mathematics teacher',
   *     backstory: 'Expert in algebra and calculus'
   *   },
   *   tools: [calculatorTool]
   * });
   * 
   * // Com parâmetros específicos
   * const result3 = await agentLLM.invoke({
   *   messages: messages,
   *   mode: 'react',
   *   agentInfo: agentInfo,
   *   temperature: 0.3,  // Override do padrão
   *   maxTokens: 2000,   // Override do padrão
   *   stream: true       // Habilitar streaming
   * });
   * ```
   */
  public async invoke(args: {
    /** Mensagens da conversa */
    messages: Message[];
    /** Modo de prompt (chat, react, etc.) */
    mode?: PromptMode;
    /** Informações do agente para geração automática de prompt */
    agentInfo?: AgentInfo;
    /** System prompt customizado (sobrescreve geração automática) */
    systemPrompt?: string;
    /** Instruções adicionais para o agente */
    additionalInstructions?: string;
    /** Ferramentas disponíveis para o agente */
    tools?: ToolSchema[];
    /** Lista de tarefas para incluir no prompt */
    taskList?: { items: Array<{ id: string; title: string; status: 'pending' | 'in_progress' | 'completed' }> };
    /** Temperatura específica para esta chamada */
    temperature?: number;
    /** TopP específico para esta chamada */
    topP?: number;
    /** MaxTokens específico para esta chamada */
    maxTokens?: number;
    /** Habilitar streaming de resposta */
    stream?: boolean;
    /** Configuração customizada do PromptBuilder */
    promptConfig?: PromptBuilderConfig;
  }): Promise<{ content: string | null; metadata?: Record<string, unknown> }> {


    // 1. Determinar system prompt (customizado ou gerado automaticamente)
    const promptResult = PromptBuilder.determineSystemPrompt(args);
    const systemPrompt = promptResult.systemPrompt;

    // Preview do prompt para debugging (truncado se muito longo)
    const spPreview = systemPrompt.length > 1000 ? `${systemPrompt.slice(0, 1000)}...` : systemPrompt;

    // 2. Resolver parâmetros (específicos > padrão > fallback)
    const temperature = args.temperature ?? this.defaults.temperature ?? 0.5;
    const topP = args.topP ?? this.defaults.topP;
    const maxTokens = args.maxTokens ?? this.defaults.maxTokens;
    const stream = args.stream ?? false;

    // 3. Configurar ProviderAdapter
    const config: ProviderConfig = {
      model: this.model,
      provider: this.provider,
      apiKey: this.apiKey,
      messages: args.messages,
      systemPrompt,
      temperature,
      stream,
      topP,
      maxTokens,
      baseUrl: this.baseUrl,
    };

    // 4. Executar via ProviderAdapter
    const resp: IProviderResponse = await ProviderAdapter.chatCompletion(config);

    // 5. Retornar resultado estruturado
    return { content: resp?.content ?? null, metadata: resp?.metadata };
  }
}
