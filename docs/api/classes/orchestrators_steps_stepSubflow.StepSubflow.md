# Class: StepSubflow

[orchestrators/steps/stepSubflow](../modules/orchestrators_steps_stepSubflow.md).StepSubflow

## Table of contents

### Constructors

- [constructor](orchestrators_steps_stepSubflow.StepSubflow.md#constructor)

### Properties

- [runner](orchestrators_steps_stepSubflow.StepSubflow.md#runner)

### Methods

- [execute](orchestrators_steps_stepSubflow.StepSubflow.md#execute)

## Constructors

### constructor

• **new StepSubflow**(`runner`): [`StepSubflow`](orchestrators_steps_stepSubflow.StepSubflow.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `runner` | [`FlowRunner`](../interfaces/flows_interfaces_flowRunner_interface.FlowRunner.md) |

#### Returns

[`StepSubflow`](orchestrators_steps_stepSubflow.StepSubflow.md)

#### Defined in

src/orchestrators/steps/stepSubflow.ts:7

## Properties

### runner

• `Private` `Readonly` **runner**: [`FlowRunner`](../interfaces/flows_interfaces_flowRunner_interface.FlowRunner.md)

#### Defined in

src/orchestrators/steps/stepSubflow.ts:5

## Methods

### execute

▸ **execute**(`flowId`, `input`, `shared`): `Promise`\<\{ `childState?`: [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) ; `output`: `Record`\<`string`, `unknown`\> ; `patch`: [`SharedPatch`](../interfaces/flows_interfaces_sharedPatch_interface.SharedPatch.md)[] ; `status`: ``"failed"`` \| ``"success"`` \| ``"paused"``  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `flowId` | `string` |
| `input` | `Record`\<`string`, `unknown`\> |
| `shared` | [`SharedState`](../interfaces/flows_interfaces_sharedState_interface.SharedState.md) |

#### Returns

`Promise`\<\{ `childState?`: [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) ; `output`: `Record`\<`string`, `unknown`\> ; `patch`: [`SharedPatch`](../interfaces/flows_interfaces_sharedPatch_interface.SharedPatch.md)[] ; `status`: ``"failed"`` \| ``"success"`` \| ``"paused"``  }\>

#### Defined in

src/orchestrators/steps/stepSubflow.ts:11
