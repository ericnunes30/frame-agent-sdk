# Module: telemetry/interfaces/traceEventType.interface

## Table of contents

### Type Aliases

- [TraceEventType](telemetry_interfaces_traceEventType_interface.md#traceeventtype)

## Type Aliases

### TraceEventType

Ƭ **TraceEventType**: ``"run_started"`` \| ``"run_finished"`` \| ``"node_started"`` \| ``"node_finished"`` \| ``"node_error"`` \| ``"step_started"`` \| ``"step_finished"`` \| ``"step_error"`` \| ``"llm_request_started"`` \| ``"llm_request_finished"`` \| ``"llm_request_failed"`` \| ``"tool_detected"`` \| ``"tool_execution_started"`` \| ``"tool_execution_finished"`` \| ``"tool_execution_failed"`` \| \`custom:$\{string}\`

Tipos oficiais de eventos de telemetria emitidos pelo SDK.

Use `custom:${string}` apenas para extensões específicas de aplicações.

#### Defined in

[src/telemetry/interfaces/traceEventType.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEventType.interface.ts#L6)
