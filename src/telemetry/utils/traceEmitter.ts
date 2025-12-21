import type { TraceContext } from '@/telemetry/interfaces/traceContext.interface';
import type { TraceEvent, TraceLevel } from '@/telemetry/interfaces/traceEvent.interface';
import type { TraceSink } from '@/telemetry/interfaces/traceSink.interface';
import type { TelemetryOptions } from '@/telemetry/interfaces/telemetryOptions.interface';
import { DEFAULT_TELEMETRY_OPTIONS } from '@/telemetry/interfaces/telemetryOptions.interface';
import { normalizeEvent, shouldEmit } from '@/telemetry/utils/normalizeEvent';

export type TraceStateCarrier = {
  metadata?: Record<string, unknown>;
};

export function materializeTrace(state: TraceStateCarrier): TraceEvent[] | undefined {
  const trace = (state.metadata as any)?.trace;
  return Array.isArray(trace) ? (trace as TraceEvent[]) : undefined;
}

export function emitTrace(args: {
  trace?: TraceSink;
  options?: TelemetryOptions;
  ctx: TraceContext;
  state?: TraceStateCarrier;
  event: Omit<TraceEvent, 'ts' | 'runId' | 'parentRunId' | 'orchestrator'>;
}): void {
  const cfg = { ...DEFAULT_TELEMETRY_OPTIONS, ...(args.options ?? {}) };
  const level = args.event.level as TraceLevel;
  if (!shouldEmit(level, cfg)) return;

  const evt = normalizeEvent({ ctx: args.ctx, event: args.event, options: cfg });
  args.trace?.emit(evt);

  if (cfg.persistToState && args.state) {
    const metadata = (args.state.metadata ??= {});
    const prev = (metadata as any).trace;
    const arr: TraceEvent[] = Array.isArray(prev) ? [...prev] : [];
    arr.push(evt);
    const max = Math.max(1, Math.floor(cfg.maxEvents));
    (metadata as any).trace = arr.length <= max ? arr : arr.slice(arr.length - max);
  }
}
