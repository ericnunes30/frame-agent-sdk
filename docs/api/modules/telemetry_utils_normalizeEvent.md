# Module: telemetry/utils/normalizeEvent

## Table of contents

### Functions

- [normalizeEvent](telemetry_utils_normalizeEvent.md#normalizeevent)
- [shouldEmit](telemetry_utils_normalizeEvent.md#shouldemit)

## Functions

### normalizeEvent

▸ **normalizeEvent**(`args`): [`TraceEvent`](../interfaces/telemetry_interfaces_traceEvent_interface.TraceEvent.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.ctx` | [`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md) |
| `args.event` | `Omit`\<[`TraceEvent`](../interfaces/telemetry_interfaces_traceEvent_interface.TraceEvent.md), ``"ts"`` \| ``"runId"`` \| ``"parentRunId"`` \| ``"orchestrator"``\> |
| `args.options?` | [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md) |

#### Returns

[`TraceEvent`](../interfaces/telemetry_interfaces_traceEvent_interface.TraceEvent.md)

#### Defined in

[src/telemetry/utils/normalizeEvent.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/utils/normalizeEvent.ts#L14)

___

### shouldEmit

▸ **shouldEmit**(`level`, `options?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `level` | [`TraceLevel`](telemetry_interfaces_traceEvent_interface.md#tracelevel) |
| `options?` | [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md) |

#### Returns

`boolean`

#### Defined in

[src/telemetry/utils/normalizeEvent.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/utils/normalizeEvent.ts#L7)
