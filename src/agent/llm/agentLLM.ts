// src/llm/llm.ts
import { ProviderAdapter } from '../../providers/adapter/providerAdapter';
import type { Message } from '../../memory';
import type { IProviderResponse } from '../../providers/adapter/providerAdapter.interface';
import type { ProviderConfig } from '../../providers/adapter/providerAdapter.interface';
import { PromptBuilder } from '../../promptBuilder';
import type { PromptBuilderConfig, PromptMode, AgentInfo, ToolSchema } from '../../promptBuilder';

import type { AgentLLMConfig, ProviderDefaults } from '../interfaces/agentLLM.interface';
import type { TraceContext } from '@/telemetry/interfaces/traceContext.interface';
import type { TraceSink } from '@/telemetry/interfaces/traceSink.interface';
import type { TelemetryOptions } from '@/telemetry/interfaces/telemetryOptions.interface';
import type { ContextHooks } from '@/memory';

/**
 * Cliente LLM especializado para agentes de IA.
 * 
 * Esta classe fornece uma interface simplificada e especializada para
 * agentes de IA interagirem com modelos de linguagem, integrando
 * seamlessly com ProviderAdapter e PromptBuilder.
 * 
 * ## CaracterÃ­sticas Principais
 * 
 * - **ConfiguraÃ§Ã£o Fixa**: MantÃ©m modelo e API key fixos para consistÃªncia
 * - **GeraÃ§Ã£o AutomÃ¡tica de Prompts**: IntegraÃ§Ã£o com PromptBuilder para system prompts
 * - **ParÃ¢metros FlexÃ­veis**: Suporte a overrides por chamada
 * - **IntegraÃ§Ã£o Completa**: Funciona com todos os provedores suportados
 * - **Metadados Ricos**: Retorna informaÃ§Ãµes detalhadas da execuÃ§Ã£o
 * 
 * ## Fluxo de OperaÃ§Ã£o
 * 
 * 1. **ConfiguraÃ§Ã£o**: Define modelo, API key e parÃ¢metros padrÃ£o
 * 2. **ConstruÃ§Ã£o de Prompt**: Usa PromptBuilder para gerar system prompt
 * 3. **ExecuÃ§Ã£o**: Chama ProviderAdapter com configuraÃ§Ã£o completa
 * 4. **Retorno**: Fornece conteÃºdo e metadados da resposta
 * 
 * ## IntegraÃ§Ã£o com MÃ³dulos
 * 
 * - **ProviderAdapter**: Para comunicaÃ§Ã£o com provedores LLM
 * - **PromptBuilder**: Para geraÃ§Ã£o automÃ¡tica de system prompts
 * - **Memory**: Para gerenciamento de mensagens e contexto
 * - **Tools**: Para suporte a ferramentas quando configurado
 * 
 * @example
 * ```typescript
 * // ConfiguraÃ§Ã£o bÃ¡sica
 * const agentLLM = new AgentLLM({
 *   model: 'openai-gpt-4',
 *   apiKey: 'sk-...',
 *   defaults: { temperature: 0.7, maxTokens: 1000 }
 * });
 * 
 * // ExecuÃ§Ã£o com modo chat
 * const result1 = await agentLLM.invoke({
 *   messages: [{ role: 'user', content: 'OlÃ¡!' }],
 *   mode: 'chat',
 *   agentInfo: {
 *     name: 'Assistant',
 *     role: 'Helpful assistant',
 *     backstory: 'Friendly and knowledgeable'
 *   }
 * });
 * 
 * // ExecuÃ§Ã£o com ferramentas (modo react)
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
 * @see {@link AgentLLMConfig} Para configuraÃ§Ã£o da classe
 * @see {@link ProviderDefaults} Para parÃ¢metros padrÃ£o
 * @see {@link PromptBuilder} Para geraÃ§Ã£o de prompts
 * @see {@link ProviderAdapter} Para comunicaÃ§Ã£o com provedores
 */
export class AgentLLM {
  /** Modelo de linguagem configurado */
  private readonly model: string;
  /** Chave de API do provedor */
  private readonly apiKey: string;
  /** ParÃ¢metros padrÃ£o de geraÃ§Ã£o */
  private readonly defaults: ProviderDefaults;
  /** URL base customizada (opcional) */
  private readonly baseUrl?: string;
  /** Provedor explÃ­cito (opcional) */
  private readonly provider?: string;

  /**
   * Cria uma instÃ¢ncia de AgentLLM a partir de uma configuraÃ§Ã£o estruturada.
   * 
   * MÃ©todo factory que facilita a criaÃ§Ã£o de instÃ¢ncias usando
   * a configuraÃ§Ã£o completa AgentLLMConfig.
   * 
   * @param config ConfiguraÃ§Ã£o completa do AgentLLM.
   * Deve incluir model e apiKey obrigatoriamente.
   * 
   * @returns Nova instÃ¢ncia de AgentLLM configurada.
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
   * @see {@link AgentLLMConfig} Para formato da configuraÃ§Ã£o
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
   * Cria uma instÃ¢ncia de AgentLLM com parÃ¢metros individuais.
   * 
   * Construtor que permite especificar cada parÃ¢metro separadamente,
   * oferecendo mÃ¡xima flexibilidade na configuraÃ§Ã£o.
   * 
   * @param params ParÃ¢metros de configuraÃ§Ã£o.
   * 
   * @example
   * ```typescript
   * // ConfiguraÃ§Ã£o simples
   * const agentLLM1 = new AgentLLM({
   *   model: 'openai-gpt-3.5-turbo',
   *   apiKey: 'sk-...'
   * });
   * 
   * // ConfiguraÃ§Ã£o com parÃ¢metros padrÃ£o
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
   * @see {@link ProviderDefaults} Para parÃ¢metros padrÃ£o
   */
  constructor(params: { model: string; provider?: string; apiKey: string; defaults?: ProviderDefaults; baseUrl?: string }) {
    this.model = params.model;
    this.provider = params.provider;
    this.apiKey = params.apiKey;
    this.defaults = params.defaults ?? {};
    this.baseUrl = params.baseUrl;
  }

  /**
   * Invoca o modelo de linguagem com parÃ¢metros flexÃ­veis.
   * 
   * MÃ©todo principal que executa a interaÃ§Ã£o com o LLM. Suporta
   * tanto system prompts customizados quanto geraÃ§Ã£o automÃ¡tica
   * via PromptBuilder usando mode e agentInfo.
   * 
   * ## EstratÃ©gias de Prompt
   * 
   * - **systemPrompt direto**: Use systemPrompt para controle total
   * - **GeraÃ§Ã£o automÃ¡tica**: Use mode + agentInfo para prompts gerados
   * - **PromptBuilder**: IntegraÃ§Ã£o automÃ¡tica com PromptBuilder
   * 
   * @param args ParÃ¢metros de invocaÃ§Ã£o flexÃ­veis.
   * 
   * @returns Promise com conteÃºdo e metadados da resposta.
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
   * // Com geraÃ§Ã£o automÃ¡tica de prompt
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
   * // Com parÃ¢metros especÃ­ficos
   * const result3 = await agentLLM.invoke({
   *   messages: messages,
   *   mode: 'react',
   *   agentInfo: agentInfo,
   *   temperature: 0.3,  // Override do padrÃ£o
   *   maxTokens: 2000,   // Override do padrÃ£o
   *   stream: true       // Habilitar streaming
   * });
   * ```
   */
  public async invoke(args: {
    /** Mensagens da conversa */
    messages: Message[];
    /** Modo de prompt (chat, react, etc.) */
    mode?: PromptMode;
    /** InformaÃ§Ãµes do agente para geraÃ§Ã£o automÃ¡tica de prompt */
    agentInfo?: AgentInfo;
    /** System prompt customizado (sobrescreve geraÃ§Ã£o automÃ¡tica) */
    systemPrompt?: string;
    /** InstruÃ§Ãµes adicionais para o agente */
    additionalInstructions?: string;
    /** Ferramentas disponÃ­veis para o agente */
    tools?: ToolSchema[];
    /** Lista de tarefas para incluir no prompt */
    taskList?: { items: Array<{ id: string; title: string; status: 'pending' | 'in_progress' | 'completed' }> };
    /** Temperatura especÃ­fica para esta chamada */
    temperature?: number;
    /** TopP especÃ­fico para esta chamada */
    topP?: number;
    /** MaxTokens especÃ­fico para esta chamada */
    maxTokens?: number;
    /** Habilitar streaming de resposta */
    stream?: boolean;
    /** ConfiguraÃ§Ã£o customizada do PromptBuilder */
    promptConfig?: PromptBuilderConfig;
    trace?: TraceSink;
    telemetry?: TelemetryOptions;
    traceContext?: TraceContext;
    /** Hooks de contexto (trim/rewrite/retry) */
    contextHooks?: ContextHooks;
  }): Promise<{ content: string | null; metadata?: Record<string, unknown> }> {
    // 1. Determinar system prompt (customizado ou gerado automaticamente)
    const promptResult = PromptBuilder.determineSystemPrompt(args);
    let systemPrompt = promptResult.systemPrompt;
    let messages = args.messages;

    // 2. Resolver parÃ¢metros (especÃ­ficos > padrÃ£o > fallback)
    const temperature = args.temperature ?? this.defaults.temperature ?? 0.5;
    const topP = args.topP ?? this.defaults.topP;
    const maxTokens = args.maxTokens ?? this.defaults.maxTokens;
    const stream = args.stream ?? false;

    // 3. Hooks de contexto (trim/rewrite/retry) - retry sem acoplar no orchestrator
    const hooks = args.contextHooks;
    const maxRetries = Math.max(0, hooks?.maxRetries ?? 0);

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (hooks?.beforeRequest) {
          const before = await hooks.beforeRequest({
            model: this.model,
            attempt,
            messages,
            systemPrompt,
          });

          if (before?.messages) messages = before.messages;
          if (typeof before?.systemPrompt === 'string') systemPrompt = before.systemPrompt;
        }

        const config: ProviderConfig = {
          model: this.model,
          provider: this.provider,
          apiKey: this.apiKey,
          messages,
          systemPrompt,
          temperature,
          stream,
          topP,
          maxTokens,
          baseUrl: this.baseUrl,
          trace: args.trace,
          telemetry: args.telemetry,
          traceContext: args.traceContext,
        };

        const resp: IProviderResponse = await ProviderAdapter.chatCompletion(config);
        return { content: resp?.content ?? null, metadata: resp?.metadata };
      } catch (rawError) {
        const error = rawError instanceof Error ? rawError : new Error(String(rawError));
        lastError = error;

        const isRetryable = hooks?.isRetryableError ? hooks.isRetryableError(error) : defaultIsRetryableError(error);
        const canRetry = attempt < maxRetries && isRetryable;

        if (!canRetry) throw error;

        if (hooks?.onError) {
          const decision = await hooks.onError({
            model: this.model,
            attempt,
            error,
            messages,
            systemPrompt,
          });

          if (decision?.messages) messages = decision.messages;
          if (typeof decision?.systemPrompt === 'string') systemPrompt = decision.systemPrompt;

          if (decision?.retry !== true) throw error;
        }
      }
    }

    throw lastError ?? new Error('AgentLLM.invoke falhou sem erro (estado invÃ¡lido)');
  }
}

function defaultIsRetryableError(error: Error): boolean {
  const message = (error.message ?? '').toLowerCase();
  const keywords = [
    'maximum context length',
    'context length exceeded',
    'maximum tokens',
    'token limit',
    'too many tokens',
    'context window',
    'tokens exceed',
    'prompt is too long',
    'exceeds the maximum',
  ];

  return keywords.some((k) => message.includes(k));
}
