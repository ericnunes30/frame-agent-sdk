# Class: FlowRunnerImpl

[flows/runner/flowRunnerImpl](../modules/flows_runner_flowRunnerImpl.md).FlowRunnerImpl

Executa subfluxos com isolamento de memoria para agentFlow.
- agentFlow exige llmConfig e bloqueia chatHistoryManager compartilhado.
- graph pode reutilizar chatHistoryManager quando fornecido.

## Implements

- [`FlowRunner`](../interfaces/flows_interfaces_flowRunner_interface.FlowRunner.md)

## Table of contents

### Constructors

- [constructor](flows_runner_flowRunnerImpl.FlowRunnerImpl.md#constructor)

### Properties

- [chatHistoryManager](flows_runner_flowRunnerImpl.FlowRunnerImpl.md#chathistorymanager)
- [deps](flows_runner_flowRunnerImpl.FlowRunnerImpl.md#deps)
- [llmConfig](flows_runner_flowRunnerImpl.FlowRunnerImpl.md#llmconfig)
- [registry](flows_runner_flowRunnerImpl.FlowRunnerImpl.md#registry)

### Methods

- [resolveGraph](flows_runner_flowRunnerImpl.FlowRunnerImpl.md#resolvegraph)
- [run](flows_runner_flowRunnerImpl.FlowRunnerImpl.md#run)

## Constructors

### constructor

• **new FlowRunnerImpl**(`registry`, `deps?`): [`FlowRunnerImpl`](flows_runner_flowRunnerImpl.FlowRunnerImpl.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `registry` | [`FlowRegistry`](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md) |
| `deps?` | `FlowRunnerDeps` |

#### Returns

[`FlowRunnerImpl`](flows_runner_flowRunnerImpl.FlowRunnerImpl.md)

#### Defined in

[src/flows/runner/flowRunnerImpl.ts:34](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/runner/flowRunnerImpl.ts#L34)

## Properties

### chatHistoryManager

• `Private` `Optional` `Readonly` **chatHistoryManager**: [`IChatHistoryManager`](../interfaces/memory_memory_interface.IChatHistoryManager.md)

#### Defined in

[src/flows/runner/flowRunnerImpl.ts:32](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/runner/flowRunnerImpl.ts#L32)

___

### deps

• `Private` `Optional` `Readonly` **deps**: `FlowRunnerDeps`

#### Defined in

[src/flows/runner/flowRunnerImpl.ts:30](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/runner/flowRunnerImpl.ts#L30)

___

### llmConfig

• `Private` `Optional` `Readonly` **llmConfig**: [`AgentLLMConfig`](../interfaces/agent_interfaces_agentLLM_interface.AgentLLMConfig.md)

#### Defined in

[src/flows/runner/flowRunnerImpl.ts:31](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/runner/flowRunnerImpl.ts#L31)

___

### registry

• `Private` `Readonly` **registry**: [`FlowRegistry`](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md)

#### Defined in

[src/flows/runner/flowRunnerImpl.ts:29](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/runner/flowRunnerImpl.ts#L29)

## Methods

### resolveGraph

▸ **resolveGraph**(`flow`): [`GraphDefinition`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `flow` | [`FlowDefinition`](../interfaces/flows_interfaces_flowDefinition_interface.FlowDefinition.md) |

#### Returns

[`GraphDefinition`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

#### Defined in

[src/flows/runner/flowRunnerImpl.ts:135](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/runner/flowRunnerImpl.ts#L135)

___

### run

▸ **run**(`args`): `Promise`\<\{ `childState?`: [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) ; `output`: `Record`\<`string`, `unknown`\> ; `patch`: [`SharedPatch`](../interfaces/flows_interfaces_sharedPatch_interface.SharedPatch.md)[] ; `status`: ``"failed"`` \| ``"success"`` \| ``"paused"``  }\>

Executa um fluxo registrado e retorna status, output, patch e childState.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.childState?` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) |
| `args.flowId` | `string` |
| `args.input` | `Record`\<`string`, `unknown`\> |
| `args.policy?` | [`SubflowPolicy`](../interfaces/flows_interfaces_subflowPolicy_interface.SubflowPolicy.md) |
| `args.shared` | [`SharedState`](../interfaces/flows_interfaces_sharedState_interface.SharedState.md) |
| `args.telemetry?` | [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md) |
| `args.trace?` | [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md) |
| `args.traceContext?` | [`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md) |

#### Returns

`Promise`\<\{ `childState?`: [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) ; `output`: `Record`\<`string`, `unknown`\> ; `patch`: [`SharedPatch`](../interfaces/flows_interfaces_sharedPatch_interface.SharedPatch.md)[] ; `status`: ``"failed"`` \| ``"success"`` \| ``"paused"``  }\>

#### Implementation of

[FlowRunner](../interfaces/flows_interfaces_flowRunner_interface.FlowRunner.md).[run](../interfaces/flows_interfaces_flowRunner_interface.FlowRunner.md#run)

#### Defined in

[src/flows/runner/flowRunnerImpl.ts:44](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/runner/flowRunnerImpl.ts#L44)
