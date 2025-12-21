# Module: telemetry/context/telemetryStore

## Table of contents

### Type Aliases

- [ActiveTelemetry](telemetry_context_telemetryStore.md#activetelemetry)

### Functions

- [getActiveTelemetry](telemetry_context_telemetryStore.md#getactivetelemetry)
- [runWithTelemetry](telemetry_context_telemetryStore.md#runwithtelemetry)

## Type Aliases

### ActiveTelemetry

Ƭ **ActiveTelemetry**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `telemetry?` | [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md) |
| `trace?` | [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md) |
| `traceContext?` | [`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md) |

#### Defined in

src/telemetry/context/telemetryStore.ts:6

## Functions

### getActiveTelemetry

▸ **getActiveTelemetry**(): [`ActiveTelemetry`](telemetry_context_telemetryStore.md#activetelemetry) \| `undefined`

#### Returns

[`ActiveTelemetry`](telemetry_context_telemetryStore.md#activetelemetry) \| `undefined`

#### Defined in

src/telemetry/context/telemetryStore.ts:18

___

### runWithTelemetry

▸ **runWithTelemetry**\<`T`\>(`active`, `fn`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `active` | [`ActiveTelemetry`](telemetry_context_telemetryStore.md#activetelemetry) |
| `fn` | () => `T` |

#### Returns

`T`

#### Defined in

src/telemetry/context/telemetryStore.ts:14
