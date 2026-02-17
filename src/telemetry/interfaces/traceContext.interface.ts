import type { TraceOrchestrator } from '@/telemetry/interfaces/traceEvent.interface';

/**
 * Contexto de execução usado para enriquecer eventos de telemetria sem depender de singletons.
 */
export interface TraceContext {
  runId: string;
  parentRunId?: string;
  orchestrator: TraceOrchestrator;
  sessionId?: string;
  userId?: string;

  agent?: { id?: string; label?: string };
  flow?: { id?: string; kind?: string };
}
