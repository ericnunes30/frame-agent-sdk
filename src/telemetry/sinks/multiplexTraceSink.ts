import type { TraceEvent } from '@/telemetry/interfaces/traceEvent.interface';
import type { TraceSink } from '@/telemetry/interfaces/traceSink.interface';

/**
 * Sink que faz fan-out para múltiplos sinks.
 */
export class MultiplexTraceSink implements TraceSink {
  constructor(private readonly sinks: TraceSink[]) {}

  emit(event: TraceEvent): void {
    for (const sink of this.sinks) sink.emit(event);
  }

  async flush(): Promise<void> {
    for (const sink of this.sinks) await sink.flush?.();
  }
}
