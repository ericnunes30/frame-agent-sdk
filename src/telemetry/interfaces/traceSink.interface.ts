import type { TraceEvent } from '@/telemetry/interfaces/traceEvent.interface';

/**
 * Sink de telemetria (push). O SDK nunca deve depender de console/arquivo diretamente.
 */
export interface TraceSink {
  emit(event: TraceEvent): void;
  flush?(): Promise<void>;
}
