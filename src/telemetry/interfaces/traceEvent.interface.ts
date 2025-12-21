import type { TraceEventType } from '@/telemetry/interfaces/traceEventType.interface';

export type TraceLevel = 'debug' | 'info' | 'warn' | 'error';
export type TraceOrchestrator = 'graph' | 'steps';

/**
 * Evento de telemetria serializável e estável, emitido em tempo real.
 */
export interface TraceEvent {
  ts: string; // ISO string
  runId: string;
  parentRunId?: string;
  orchestrator: TraceOrchestrator;
  type: TraceEventType;
  level: TraceLevel;

  spanId?: string;
  parentSpanId?: string;

  message?: string;

  agent?: { id?: string; label?: string };
  flow?: { id?: string; kind?: string };
  node?: { id: string; name?: string };
  step?: { index?: number; name?: string };

  tool?: { name: string; toolCallId?: string; params?: unknown; observationPreview?: string };
  llm?: {
    provider?: string;
    model?: string;
    stream?: boolean;
    usage?: { prompt?: number; completion?: number; total?: number };
    finishReason?: string;
  };

  timing?: { startedAt?: string; durationMs?: number };
  data?: Record<string, unknown>;
}
