# Interface: TraceContext

[telemetry/interfaces/traceContext.interface](../modules/telemetry_interfaces_traceContext_interface.md).TraceContext

Contexto de execução usado para enriquecer eventos de telemetria sem depender de singletons.

## Table of contents

### Properties

- [agent](telemetry_interfaces_traceContext_interface.TraceContext.md#agent)
- [flow](telemetry_interfaces_traceContext_interface.TraceContext.md#flow)
- [orchestrator](telemetry_interfaces_traceContext_interface.TraceContext.md#orchestrator)
- [parentRunId](telemetry_interfaces_traceContext_interface.TraceContext.md#parentrunid)
- [runId](telemetry_interfaces_traceContext_interface.TraceContext.md#runid)

## Properties

### agent

• `Optional` **agent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` |
| `label?` | `string` |

#### Defined in

[src/telemetry/interfaces/traceContext.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceContext.interface.ts#L11)

___

### flow

• `Optional` **flow**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` |
| `kind?` | `string` |

#### Defined in

[src/telemetry/interfaces/traceContext.interface.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceContext.interface.ts#L12)

___

### orchestrator

• **orchestrator**: [`TraceOrchestrator`](../modules/telemetry_interfaces_traceEvent_interface.md#traceorchestrator)

#### Defined in

[src/telemetry/interfaces/traceContext.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceContext.interface.ts#L9)

___

### parentRunId

• `Optional` **parentRunId**: `string`

#### Defined in

[src/telemetry/interfaces/traceContext.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceContext.interface.ts#L8)

___

### runId

• **runId**: `string`

#### Defined in

[src/telemetry/interfaces/traceContext.interface.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/telemetry/interfaces/traceContext.interface.ts#L7)
