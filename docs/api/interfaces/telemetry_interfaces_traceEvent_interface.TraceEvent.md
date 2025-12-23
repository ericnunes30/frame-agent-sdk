# Interface: TraceEvent

[telemetry/interfaces/traceEvent.interface](../modules/telemetry_interfaces_traceEvent_interface.md).TraceEvent

Evento de telemetria serializável e estável, emitido em tempo real.

## Table of contents

### Properties

- [agent](telemetry_interfaces_traceEvent_interface.TraceEvent.md#agent)
- [data](telemetry_interfaces_traceEvent_interface.TraceEvent.md#data)
- [flow](telemetry_interfaces_traceEvent_interface.TraceEvent.md#flow)
- [level](telemetry_interfaces_traceEvent_interface.TraceEvent.md#level)
- [llm](telemetry_interfaces_traceEvent_interface.TraceEvent.md#llm)
- [message](telemetry_interfaces_traceEvent_interface.TraceEvent.md#message)
- [node](telemetry_interfaces_traceEvent_interface.TraceEvent.md#node)
- [orchestrator](telemetry_interfaces_traceEvent_interface.TraceEvent.md#orchestrator)
- [parentRunId](telemetry_interfaces_traceEvent_interface.TraceEvent.md#parentrunid)
- [parentSpanId](telemetry_interfaces_traceEvent_interface.TraceEvent.md#parentspanid)
- [runId](telemetry_interfaces_traceEvent_interface.TraceEvent.md#runid)
- [spanId](telemetry_interfaces_traceEvent_interface.TraceEvent.md#spanid)
- [step](telemetry_interfaces_traceEvent_interface.TraceEvent.md#step)
- [timing](telemetry_interfaces_traceEvent_interface.TraceEvent.md#timing)
- [tool](telemetry_interfaces_traceEvent_interface.TraceEvent.md#tool)
- [ts](telemetry_interfaces_traceEvent_interface.TraceEvent.md#ts)
- [type](telemetry_interfaces_traceEvent_interface.TraceEvent.md#type)

## Properties

### agent

• `Optional` **agent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` |
| `label?` | `string` |

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:22](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L22)

___

### data

• `Optional` **data**: `Record`\<`string`, `unknown`\>

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:37](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L37)

___

### flow

• `Optional` **flow**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` |
| `kind?` | `string` |

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:23](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L23)

___

### level

• **level**: [`TraceLevel`](../modules/telemetry_interfaces_traceEvent_interface.md#tracelevel)

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L15)

___

### llm

• `Optional` **llm**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `finishReason?` | `string` |
| `model?` | `string` |
| `provider?` | `string` |
| `stream?` | `boolean` |
| `usage?` | \{ `completion?`: `number` ; `prompt?`: `number` ; `total?`: `number`  } |
| `usage.completion?` | `number` |
| `usage.prompt?` | `number` |
| `usage.total?` | `number` |

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:28](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L28)

___

### message

• `Optional` **message**: `string`

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:20](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L20)

___

### node

• `Optional` **node**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `name?` | `string` |

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:24](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L24)

___

### orchestrator

• **orchestrator**: [`TraceOrchestrator`](../modules/telemetry_interfaces_traceEvent_interface.md#traceorchestrator)

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L13)

___

### parentRunId

• `Optional` **parentRunId**: `string`

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L12)

___

### parentSpanId

• `Optional` **parentSpanId**: `string`

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:18](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L18)

___

### runId

• **runId**: `string`

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L11)

___

### spanId

• `Optional` **spanId**: `string`

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:17](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L17)

___

### step

• `Optional` **step**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `index?` | `number` |
| `name?` | `string` |

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:25](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L25)

___

### timing

• `Optional` **timing**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `durationMs?` | `number` |
| `startedAt?` | `string` |

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:36](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L36)

___

### tool

• `Optional` **tool**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `observationPreview?` | `string` |
| `params?` | `unknown` |
| `toolCallId?` | `string` |

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:27](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L27)

___

### ts

• **ts**: `string`

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L10)

___

### type

• **type**: [`TraceEventType`](../modules/telemetry_interfaces_traceEventType_interface.md#traceeventtype)

#### Defined in

[src/telemetry/interfaces/traceEvent.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceEvent.interface.ts#L14)
