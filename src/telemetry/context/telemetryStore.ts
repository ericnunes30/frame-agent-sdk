import { AsyncLocalStorage } from 'node:async_hooks';
import type { TraceContext } from '@/telemetry/interfaces/traceContext.interface';
import type { TraceSink } from '@/telemetry/interfaces/traceSink.interface';
import type { TelemetryOptions } from '@/telemetry/interfaces/telemetryOptions.interface';

export type ActiveTelemetry = {
  trace?: TraceSink;
  telemetry?: TelemetryOptions;
  traceContext?: TraceContext;
};

const store = new AsyncLocalStorage<ActiveTelemetry>();

export function runWithTelemetry<T>(active: ActiveTelemetry, fn: () => T): T {
  return store.run(active, fn);
}

export function getActiveTelemetry(): ActiveTelemetry | undefined {
  return store.getStore();
}

