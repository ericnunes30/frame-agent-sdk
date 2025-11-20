import type { Message } from '@/memory';
import type { IToolCall } from '@/tools/core/interfaces';
import { GraphStatus } from '@/orchestrators/graph/core/enums/graphEngine.enum';

export interface IGraphState {
  readonly messages: Message[];
  readonly data: Record<string, unknown>;
  readonly status: GraphStatus;
  readonly currentNode?: string;
  readonly nextNode?: string;
  readonly lastToolCall?: IToolCall;
  readonly lastModelOutput?: string | null;
  readonly pendingAskUser?: { question: string; details?: string };
  readonly metadata?: Record<string, unknown>;
  readonly sessionId?: string;
  readonly shouldPause?: boolean;
  readonly logs?: string[];
}
