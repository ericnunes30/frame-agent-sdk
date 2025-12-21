import type { Message } from '@/memory';

export interface ContextBeforeRequestResult {
  /**
   * Mensagens a serem usadas na chamada ao provider.
   * Se omitido, mantÃ©m as mensagens atuais.
   */
  messages?: Message[];

  /**
   * System prompt a ser usado na chamada ao provider.
   * Se omitido, mantÃ©m o system prompt atual.
   */
  systemPrompt?: string;
}

export interface ContextOnErrorResult extends ContextBeforeRequestResult {
  /**
   * Se true, o AgentLLM deve tentar novamente a chamada ao provider.
   * Se false/undefined, o erro Ã© propagado.
   */
  retry?: boolean;
}

export interface ContextHooks {
  /**
   * Chamado antes de cada request ao provider.
   * Ãštil para trimming/rewrite/normalizaÃ§Ã£o sem acoplar no orchestrator.
   */
  beforeRequest?: (args: {
    model: string;
    attempt: number;
    messages: Message[];
    systemPrompt: string;
  }) => Promise<ContextBeforeRequestResult | undefined> | (ContextBeforeRequestResult | undefined);

  /**
   * Chamado quando o provider falha. Pode decidir retry e retornar mensagens/systemPrompt ajustados.
   * ObservaÃ§Ã£o: o SDK nÃ£o implementa compressÃ£o aqui; apenas fornece o hook.
   */
  onError?: (args: {
    model: string;
    attempt: number;
    error: Error;
    messages: Message[];
    systemPrompt: string;
  }) => Promise<ContextOnErrorResult | undefined> | (ContextOnErrorResult | undefined);

  /**
   * Determina se o erro Ã© elegÃ­vel para retry (ex.: context overflow).
   * Se omitido, o SDK aplica um detector default por keywords.
   */
  isRetryableError?: (error: Error) => boolean;

  /**
   * NÃºmero mÃ¡ximo de retentativas adicionais (alÃ©m da primeira).
   * Default: 0 (sem retry).
   */
  maxRetries?: number;
}

