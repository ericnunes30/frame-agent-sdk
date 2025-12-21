# Interface: FlowRunner

[flows/interfaces/flowRunner.interface](../modules/flows_interfaces_flowRunner_interface.md).FlowRunner

## Implemented by

- [`FlowRunnerImpl`](../classes/flows_runner_flowRunnerImpl.FlowRunnerImpl.md)

## Table of contents

### Methods

- [run](flows_interfaces_flowRunner_interface.FlowRunner.md#run)

## Methods

### run

▸ **run**(`args`): `Promise`\<\{ `childState?`: [`IGraphState`](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) ; `output`: `Record`\<`string`, `unknown`\> ; `patch`: [`SharedPatch`](flows_interfaces_sharedPatch_interface.SharedPatch.md)[] ; `status`: ``"failed"`` \| ``"success"`` \| ``"paused"``  }\>

Executa um fluxo registrado e retorna status, output, patch e childState.
Implementacoes podem exigir memoria isolada para flows do tipo agentFlow.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.childState?` | [`IGraphState`](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) |
| `args.flowId` | `string` |
| `args.input` | `Record`\<`string`, `unknown`\> |
| `args.policy?` | [`SubflowPolicy`](flows_interfaces_subflowPolicy_interface.SubflowPolicy.md) |
| `args.shared` | [`SharedState`](flows_interfaces_sharedState_interface.SharedState.md) |

#### Returns

`Promise`\<\{ `childState?`: [`IGraphState`](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) ; `output`: `Record`\<`string`, `unknown`\> ; `patch`: [`SharedPatch`](flows_interfaces_sharedPatch_interface.SharedPatch.md)[] ; `status`: ``"failed"`` \| ``"success"`` \| ``"paused"``  }\>

#### Defined in

src/flows/interfaces/flowRunner.interface.ts:11
