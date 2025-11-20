import { SAPParser } from '../../../tools';
import type { IToolCall } from '../../../tools/core/interfaces';
import type { IGraphState } from '../core/interfaces/graphState.interface';
import type { ConditionalEdge } from '../core/interfaces/graphEngine.interface';
import { ToolRouterKey } from './enums/toolRouter.enum';
import type { IToolRouterOptions } from './interfaces/toolRouter.interface';

export function createToolRouter(options: IToolRouterOptions): ConditionalEdge {
  assertOptions(options);
  return (state) => {
    const text = pickAssistantText(state);
    const parsed = SAPParser.parseAndValidate(text) as unknown as { toolName?: string; params?: Record<string, unknown> };
    const toolName = parsed?.toolName;
    if (!toolName) return options.finishNode;

    if (toolName === 'final_answer') return options.finishNode;

    if (toolName === 'ask_user') {
      return options.askUserNode;
    }

    return options.callToolNode;
  };
}

function pickAssistantText(state: IGraphState): string {
  if (state.lastModelOutput) return state.lastModelOutput;
  const messages = state.messages ?? [];
  const reversed = [...messages].reverse();
  for (const message of reversed) {
    if (message.role === 'assistant') return message.content;
  }
  return '';
}

function createAskUserUpdates(params?: Record<string, unknown>): Partial<IGraphState> {
  const question = params?.question as string | undefined;
  const details = params?.details as string | undefined;
  return {
    pendingAskUser: { question: question ?? '', details },
    shouldPause: true
  };
}

function createToolCallUpdates(toolName: string, params?: Record<string, unknown>): Partial<IGraphState> {
  const call: IToolCall = { toolName, params: (params ?? {}) as any };
  return { lastToolCall: call };
}

function assertOptions(options: IToolRouterOptions): void {
  if (!options) throw new Error('Tool router options are required');
  if (!options.callToolNode) throw new Error('callToolNode is required');
  if (!options.askUserNode) throw new Error('askUserNode is required');
  if (!options.finishNode) throw new Error('finishNode is required');
}

export { ToolRouterKey };
