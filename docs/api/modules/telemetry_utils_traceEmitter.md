# Module: telemetry/utils/traceEmitter

## Table of contents

### Type Aliases

- [TraceStateCarrier](telemetry_utils_traceEmitter.md#tracestatecarrier)

### Functions

- [emitTrace](telemetry_utils_traceEmitter.md#emittrace)
- [materializeTrace](telemetry_utils_traceEmitter.md#materializetrace)

## Type Aliases

### TraceStateCarrier

Ƭ **TraceStateCarrier**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `metadata?` | `Record`\<`string`, `unknown`\> |

#### Defined in

src/telemetry/utils/traceEmitter.ts:8

## Functions

### emitTrace

▸ **emitTrace**(`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.ctx` | [`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md) |
| `args.event` | `Omit`\<[`TraceEvent`](../interfaces/telemetry_interfaces_traceEvent_interface.TraceEvent.md), ``"ts"`` \| ``"runId"`` \| ``"parentRunId"`` \| ``"orchestrator"``\> |
| `args.options?` | [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md) |
| `args.state?` | [`TraceStateCarrier`](telemetry_utils_traceEmitter.md#tracestatecarrier) |
| `args.trace?` | [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md) |

#### Returns

`void`

#### Defined in

src/telemetry/utils/traceEmitter.ts:17

___

### materializeTrace

▸ **materializeTrace**(`state`): [`TraceEvent`](../interfaces/telemetry_interfaces_traceEvent_interface.TraceEvent.md)[] \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`TraceStateCarrier`](telemetry_utils_traceEmitter.md#tracestatecarrier) |

#### Returns

[`TraceEvent`](../interfaces/telemetry_interfaces_traceEvent_interface.TraceEvent.md)[] \| `undefined`

#### Defined in

src/telemetry/utils/traceEmitter.ts:12
