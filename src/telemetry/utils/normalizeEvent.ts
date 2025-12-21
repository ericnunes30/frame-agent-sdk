import type { TraceContext } from '@/telemetry/interfaces/traceContext.interface';
import type { TraceEvent, TraceLevel } from '@/telemetry/interfaces/traceEvent.interface';
import type { TelemetryOptions } from '@/telemetry/interfaces/telemetryOptions.interface';
import { DEFAULT_TELEMETRY_OPTIONS } from '@/telemetry/interfaces/telemetryOptions.interface';
import { redactUnknown } from '@/telemetry/utils/redact';

export function shouldEmit(level: TraceLevel, options?: TelemetryOptions): boolean {
  const cfg = { ...DEFAULT_TELEMETRY_OPTIONS, ...(options ?? {}) };
  if (!cfg.enabled) return false;
  if (cfg.level === 'debug') return true;
  return level !== 'debug';
}

export function normalizeEvent(args: {
  ctx: TraceContext;
  event: Omit<TraceEvent, 'ts' | 'runId' | 'parentRunId' | 'orchestrator'>;
  options?: TelemetryOptions;
}): TraceEvent {
  const cfg = { ...DEFAULT_TELEMETRY_OPTIONS, ...(args.options ?? {}) };
  const base: TraceEvent = {
    ts: new Date().toISOString(),
    runId: args.ctx.runId,
    parentRunId: args.ctx.parentRunId,
    orchestrator: args.ctx.orchestrator,
    agent: args.ctx.agent,
    flow: args.ctx.flow,
    ...args.event,
  };

  const maxChars = cfg.maxPayloadChars;
  const redacted = redactUnknown(base, maxChars) as TraceEvent;
  return redacted;
}
