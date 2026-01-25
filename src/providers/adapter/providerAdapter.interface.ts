import type { TraceContext } from '@/telemetry/interfaces/traceContext.interface';
import type { TraceSink } from '@/telemetry/interfaces/traceSink.interface';
import type { TelemetryOptions } from '@/telemetry/interfaces/telemetryOptions.interface';
import type { Message } from '@/memory';

/**
 * Interface para definir o contrato de um provedor
 * 
 * Este arquivo contém as interfaces fundamentais para o sistema de provedores,
 * definindo contratos unificados que permitem interoperabilidade entre
 * diferentes provedores de LLM através do ProviderAdapter.
 */

/** 
 * Parâmetros de configuração unificados para todos os provedores via ProviderAdapter.
 * 
 * Esta interface padroniza a configuração entre diferentes provedores de LLM,
 * permitindo que o ProviderAdapter forneça uma interface consistente independente
 * do provedor específico sendo usado.
 * 
 * @example
 * ```typescript
 * // Configuração básica para OpenAI
 * const config: ProviderConfig = {
 *   model: 'gpt-4',
 *   messages: [
 *     { role: 'user', content: 'Olá!' }
 *   ],
 *   apiKey: 'sk-...',
 *   temperature: 0.7
 * };
 * 
 * // Configuração para provedor compatível com OpenAI
 * const compatibleConfig: ProviderConfig = {
 *   model: 'claude-3-sonnet',
 *   messages: [...],
 *   apiKey: 'sua-api-key',
 *   baseUrl: 'https://api.anthropic.com', // Obrigatório para compatíveis
 *   temperature: 0.5
 * };
 * ```
 * 
 * @remarks
 * - Para `openaiCompatible`, `baseUrl` é obrigatória
 * - `temperature` tem default de 0.7 se não especificado
 * - `stream` controla resposta em tempo real
 * - `tools` são passadas via prompt (não function calling)
 */
export interface ProviderConfig {
  /** 
   * Nome do modelo a ser usado.
   * Formato varia por provedor:
   * - OpenAI: 'gpt-4', 'gpt-3.5-turbo'
   * - OpenRouter: 'meta-llama/llama-3.1-70b-instruct'
   * - Claude: 'claude-3-sonnet-20240229'
   */
  model: string;

  /**
   * Nome do provedor explícito (opcional).
   * Se fornecido, ignora a inferência baseada no nome do modelo.
   * Ex: 'openai', 'anthropic', 'openaiCompatible'
   */
  provider?: string;

  /** 
   * Array de mensagens da conversa.
   * Cada mensagem deve ter role ('system', 'user', 'assistant') e content.
   */
  messages: Message[];

  /**
   * Capacidades declaradas do provider/modelo (fonte de verdade).
   */
  capabilities?: {
    /**
     * Indica se o modelo suporta conteudo multimodal (imagens) via messages.
     * Default: false (se nao informado).
     */
    supportsVision?: boolean;
  };

  /** 
   * Chave de API do provedor.
   * Deve ser mantida segura e nunca hardcoded no código.
   */
  apiKey: string;

  /** 
   * Controla a criatividade das respostas (0.0 - 2.0).
   * - 0.0: Respostas mais determinísticas e focadas
   * - 0.7: Balance entre criatividade e consistência (default)
   * - 1.0+: Respostas mais criativas e diversas
   * 
   * @default 0.7
   */
  temperature?: number;

  /** 
   * Habilita resposta em streaming (tempo real).
   * Quando true, a resposta é retornada como um iterador assíncrono.
   * 
   * @default false
   */
  stream?: boolean;

  /** 
   * Prompt do sistema que define o comportamento do assistente.
   * É enviado como primeira mensagem com role 'system'.
   */
  systemPrompt?: string;

  /** 
   * URL base da API do provedor.
   * **Obrigatória** para provedores compatíveis com OpenAI.
   * 
   * @example
   * - OpenAI: 'https://api.openai.com/v1'
   * - OpenRouter: 'https://openrouter.ai/api/v1'
   * - Azure OpenAI: 'https://seu-endpoint.openai.azure.com/'
   * - Anthropic: 'https://api.anthropic.com'
   */
  baseUrl?: string;

  /** 
   * Limite máximo de tokens na resposta.
   * Controla o tamanho máximo da resposta gerada.
   * 
   * @default 2048
   */
  maxTokens?: number;

  /** 
   * Nucleus sampling parameter (0.0 - 1.0).
   * Alternativa ao temperature para controle de diversidade.
   * 
   * @default 1.0
   */
  topP?: number;

  /** 
   * Array de ferramentas disponíveis para o modelo.
   * As tools são passadas via prompt (não function calling nativo).
   * 
   * @example
   * ```typescript
   * tools: [
   *   {
   *     name: 'search',
   *     description: 'Busca informações na web',
   *     parameters: {
   *       type: 'object',
   *       properties: {
   *         query: { type: 'string' }
   *       }
   *     }
   *   }
   * ]
   * ```
   */
  tools?: Array<{
    name: string;
    description: string;
    parameters: any;
  }>;

  /**
   * Sink de telemetria (push) em tempo real.
   * Opcional: o SDK não deve depender de console/arquivo diretamente.
   */
  trace?: TraceSink;

  /**
   * Opções de telemetria (volume/persistência/redaction).
   */
  telemetry?: TelemetryOptions;

  /**
   * Contexto de telemetria para correlação (runId/orchestrator/agent).
   */
  traceContext?: TraceContext;

  /**
   * Configura como o SDK deve lidar com "thinking"/reasoning separado do texto final.
   *
   * Regras do SDK:
   * - `IProviderResponse.content` deve conter apenas o texto final (user-facing).
   * - Quando disponÇðvel, o thinking deve ser retornado em `IProviderResponse.metadata.thinking`.
   * - O SDK nÇœo deve persistir thinking em memÇüria/histÇürico por padrÇœo (como nÇœo entra em `content`).
   */
  thinking?: {
    /**
     * Modo de thinking:
     * - `off`: nÇœo extrai/retorna thinking (mas pode remover tags do texto final para nÇœo vazar).
     * - `summary`: preferir um resumo do reasoning (quando o provedor suportar).
     * - `raw`: retornar thinking bruto quando o provedor expuser (use com cuidado).
     *
     * @default "off"
     */
    mode?: 'off' | 'summary' | 'raw';

    /**
     * EsforÇõo de reasoning quando suportado pelo modelo/provedor.
     * Ex.: OpenAI Responses: low|medium|high; alguns modelos suportam none.
     */
    effort?: 'none' | 'low' | 'medium' | 'high';

    /**
     * Se true, reconstrÇüi o `content` com tags `<thinking>...</thinking>` quando houver thinking.
     * Use apenas para compatibilidade com UIs/pipelines que exigem tags no texto.
     *
     * @default false
     */
    wrapTag?: boolean;
  };
}

/** 
 * Resposta normalizada de qualquer provedor de LLM.
 * 
 * Esta interface padroniza o formato de resposta entre diferentes provedores,
 * garantindo que o código que consome as respostas possa trabalhar com
 * qualquer provedor de forma consistente.
 * 
 * @example
 * ```typescript
 * const response: IProviderResponse = {
 *   role: 'assistant',
 *   content: 'Olá! Como posso ajudá-lo hoje?',
 *   metadata: {
 *     tokensUsed: 150,
 *     finishReason: 'stop',
 *     model: 'gpt-4'
 *   }
 * };
 * ```
 * 
 * @remarks
 * - `role` é sempre 'assistant' para respostas do modelo
 * - `content` pode ser null em caso de erro ou resposta vazia
 * - `metadata` é opcional e varia por provedor
 */
export interface IProviderResponse {
  /** 
   * A role do autor da mensagem.
   * Sempre será 'assistant' para respostas do modelo de linguagem.
   */
  role: 'assistant';

  /** 
   * O conteúdo de texto gerado pelo modelo.
   * Pode ser null em caso de erro ou quando a resposta está sendo processada.
   */
  content: string | null;

  /** 
   * Metadados adicionais específicos do provedor.
   * 
   * Pode incluir informações como:
   * - `tokensUsed`: Número de tokens utilizados
   * - `finishReason`: Razão da finalização ('stop', 'length', 'content_filter')
   * - `model`: Nome do modelo usado
   * - `processingTime`: Tempo de processamento
   * - `cost`: Custo da requisição
   * 
   * @example
   * ```typescript
   * metadata: {
   *   tokensUsed: 150,
   *   finishReason: 'stop',
   *   model: 'gpt-4',
   *   processingTime: 1250,
   *   cost: 0.003
   * }
   * ```
   */
  metadata?: Record<string, unknown>;
}
