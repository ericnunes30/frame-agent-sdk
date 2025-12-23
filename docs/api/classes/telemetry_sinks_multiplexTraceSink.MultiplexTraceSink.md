# Class: MultiplexTraceSink

[telemetry/sinks/multiplexTraceSink](../modules/telemetry_sinks_multiplexTraceSink.md).MultiplexTraceSink

Sink que faz fan-out para múltiplos sinks.

## Implements

- [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md)

## Table of contents

### Constructors

- [constructor](telemetry_sinks_multiplexTraceSink.MultiplexTraceSink.md#constructor)

### Properties

- [sinks](telemetry_sinks_multiplexTraceSink.MultiplexTraceSink.md#sinks)

### Methods

- [emit](telemetry_sinks_multiplexTraceSink.MultiplexTraceSink.md#emit)
- [flush](telemetry_sinks_multiplexTraceSink.MultiplexTraceSink.md#flush)

## Constructors

### constructor

• **new MultiplexTraceSink**(`sinks`): [`MultiplexTraceSink`](telemetry_sinks_multiplexTraceSink.MultiplexTraceSink.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `sinks` | [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md)[] |

#### Returns

[`MultiplexTraceSink`](telemetry_sinks_multiplexTraceSink.MultiplexTraceSink.md)

#### Defined in

[src/telemetry/sinks/multiplexTraceSink.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/sinks/multiplexTraceSink.ts#L8)

## Properties

### sinks

• `Private` `Readonly` **sinks**: [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md)[]

#### Defined in

[src/telemetry/sinks/multiplexTraceSink.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/sinks/multiplexTraceSink.ts#L8)

## Methods

### emit

▸ **emit**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`TraceEvent`](../interfaces/telemetry_interfaces_traceEvent_interface.TraceEvent.md) |

#### Returns

`void`

#### Implementation of

[TraceSink](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md).[emit](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md#emit)

#### Defined in

[src/telemetry/sinks/multiplexTraceSink.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/sinks/multiplexTraceSink.ts#L10)

___

### flush

▸ **flush**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TraceSink](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md).[flush](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md#flush)

#### Defined in

[src/telemetry/sinks/multiplexTraceSink.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/sinks/multiplexTraceSink.ts#L14)
