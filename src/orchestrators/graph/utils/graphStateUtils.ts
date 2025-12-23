import type { IGraphState } from '@/orchestrators/graph/core/interfaces/graphState.interface';
import type { Message } from '@/memory';
import { extractText } from '@/memory';

export interface ExtractStateTextOptions {
  trim?: boolean;
  allowFallbackToMessages?: boolean;
  preferDataKeys?: string[];
}

function normalizeText(value: unknown, trim: boolean): string | null {
  if (typeof value === 'string') {
    const normalized = trim ? value.trim() : value;
    return normalized.length ? normalized : null;
  }

  if (Array.isArray(value)) {
    const text = extractText(value as any);
    const normalized = trim ? text.trim() : text;
    return normalized.length ? normalized : null;
  }

  return null;
}

function getLastMessageByRole(messages: readonly Message[] | undefined, role: Message['role']): Message | undefined {
  const list = messages ?? [];
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const message = list[i];
    if (message.role === role) return message;
  }
  return undefined;
}

/**
 * Extrai o "input efetivo" do state de forma padronizada.
 *
 * Ordem padrão:
 * 1) `state.data.input` (ou chaves configuradas em `preferDataKeys`)
 * 2) última mensagem `role=user` em `state.messages` (se habilitado)
 *
 * Retorna `null` se não encontrar.
 */
export function extractInput(state: IGraphState, options?: ExtractStateTextOptions): string | null {
  const trim = options?.trim ?? true;
  const allowFallbackToMessages = options?.allowFallbackToMessages ?? true;

  const preferredKeys = options?.preferDataKeys ?? ['input', 'task', 'prompt', 'userInput', 'question'];
  for (const key of preferredKeys) {
    const text = normalizeText((state.data as any)?.[key], trim);
    if (text) return text;
  }

  if (!allowFallbackToMessages) return null;
  const lastUser = getLastMessageByRole(state.messages, 'user');
  return normalizeText(lastUser?.content, trim);
}

/**
 * Extrai a "final answer" do state de forma padronizada.
 *
 * Ordem padrão:
 * 1) Se `lastToolCall.toolName === 'final_answer'`, usa `params.answer`
 * 2) `state.data.finalAnswer` (quando existir; ex.: capture do template)
 * 3) `state.lastModelOutput`
 * 4) última mensagem `role=assistant` em `state.messages` (se habilitado)
 *
 * Retorna `null` se não encontrar.
 */
export function extractFinalAnswer(state: IGraphState, options?: ExtractStateTextOptions): string | null {
  const trim = options?.trim ?? true;
  const allowFallbackToMessages = options?.allowFallbackToMessages ?? true;

  if (state.lastToolCall?.toolName === 'final_answer') {
    const answer = normalizeText((state.lastToolCall.params as any)?.answer, trim);
    if (answer) return answer;
  }

  const fromData = normalizeText((state.data as any)?.finalAnswer, trim);
  if (fromData) return fromData;

  const fromOutput = normalizeText(state.lastModelOutput, trim);
  if (fromOutput) return fromOutput;

  if (!allowFallbackToMessages) return null;
  const lastAssistant = getLastMessageByRole(state.messages, 'assistant');
  return normalizeText(lastAssistant?.content, trim);
}
