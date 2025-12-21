import type { TraceLevel } from '@/telemetry/interfaces/traceEvent.interface';

/**
 * Opções de telemetria para controlar volume, persistência e payload.
 */
export interface TelemetryOptions {
  enabled?: boolean;
  level?: Extract<TraceLevel, 'info' | 'debug'>;
  persistToState?: boolean;
  maxEvents?: number;
  maxPayloadChars?: number;
  includePrompts?: boolean;
}

export const DEFAULT_TELEMETRY_OPTIONS: Required<Pick<
  TelemetryOptions,
  'enabled' | 'level' | 'persistToState' | 'maxEvents' | 'maxPayloadChars' | 'includePrompts'
>> = {
  enabled: false,
  level: 'info',
  persistToState: false,
  maxEvents: 200,
  maxPayloadChars: 4_000,
  includePrompts: false,
};
