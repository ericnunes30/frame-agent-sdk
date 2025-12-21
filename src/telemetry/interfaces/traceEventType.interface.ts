/**
 * Tipos oficiais de eventos de telemetria emitidos pelo SDK.
 *
 * Use `custom:${string}` apenas para extensões específicas de aplicações.
 */
export type TraceEventType =
  | 'run_started'
  | 'run_finished'
  | 'node_started'
  | 'node_finished'
  | 'node_error'
  | 'step_started'
  | 'step_finished'
  | 'step_error'
  | 'llm_request_started'
  | 'llm_request_finished'
  | 'llm_request_failed'
  | 'tool_detected'
  | 'tool_execution_started'
  | 'tool_execution_finished'
  | 'tool_execution_failed'
  | `custom:${string}`;
