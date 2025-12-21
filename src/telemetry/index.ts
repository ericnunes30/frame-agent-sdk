export type { TraceEventType } from '@/telemetry/interfaces/traceEventType.interface';
export type { TraceEvent, TraceLevel, TraceOrchestrator } from '@/telemetry/interfaces/traceEvent.interface';
export type { TraceSink } from '@/telemetry/interfaces/traceSink.interface';
export type { TelemetryOptions } from '@/telemetry/interfaces/telemetryOptions.interface';
export { DEFAULT_TELEMETRY_OPTIONS } from '@/telemetry/interfaces/telemetryOptions.interface';
export type { TraceContext } from '@/telemetry/interfaces/traceContext.interface';

export { noopTraceSink } from '@/telemetry/sinks/noopTraceSink';
export { MultiplexTraceSink } from '@/telemetry/sinks/multiplexTraceSink';

export { emitTrace, materializeTrace } from '@/telemetry/utils/traceEmitter';
export { createTraceId } from '@/telemetry/utils/id';
export { getActiveTelemetry, runWithTelemetry } from '@/telemetry/context/telemetryStore';
