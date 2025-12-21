# Interface: TraceSink

[telemetry/interfaces/traceSink.interface](../modules/telemetry_interfaces_traceSink_interface.md).TraceSink

Sink de telemetria (push). O SDK nunca deve depender de console/arquivo diretamente.

## Implemented by

- [`MultiplexTraceSink`](../classes/telemetry_sinks_multiplexTraceSink.MultiplexTraceSink.md)

## Table of contents

### Methods

- [emit](telemetry_interfaces_traceSink_interface.TraceSink.md#emit)
- [flush](telemetry_interfaces_traceSink_interface.TraceSink.md#flush)

## Methods

### emit

▸ **emit**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`TraceEvent`](telemetry_interfaces_traceEvent_interface.TraceEvent.md) |

#### Returns

`void`

#### Defined in

src/telemetry/interfaces/traceSink.interface.ts:7

___

### flush

▸ **flush**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

src/telemetry/interfaces/traceSink.interface.ts:8
