# Interface: IStepsOrchestrator

[orchestrators/steps/interfaces](../modules/orchestrators_steps_interfaces.md).IStepsOrchestrator

Interface para StepsOrchestrator com suporte a múltiplos agentes

## Implemented by

- [`StepsOrchestrator`](../classes/orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md)

## Table of contents

### Methods

- [addAgent](orchestrators_steps_interfaces.IStepsOrchestrator.md#addagent)
- [executeAgents](orchestrators_steps_interfaces.IStepsOrchestrator.md#executeagents)

## Methods

### addAgent

▸ **addAgent**(`config`): [`IStepsOrchestrator`](orchestrators_steps_interfaces.IStepsOrchestrator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`AgentStepConfig`](orchestrators_steps_interfaces.AgentStepConfig.md) |

#### Returns

[`IStepsOrchestrator`](orchestrators_steps_interfaces.IStepsOrchestrator.md)

#### Defined in

[src/orchestrators/steps/interfaces.ts:86](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/steps/interfaces.ts#L86)

___

### executeAgents

▸ **executeAgents**(`input`): `Promise`\<\{ `final`: `string` ; `pendingAskUser?`: \{ `details?`: `string` ; `question`: `string`  } ; `state`: [`OrchestrationState`](orchestrators_steps_interfaces.OrchestrationState.md)  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` |

#### Returns

`Promise`\<\{ `final`: `string` ; `pendingAskUser?`: \{ `details?`: `string` ; `question`: `string`  } ; `state`: [`OrchestrationState`](orchestrators_steps_interfaces.OrchestrationState.md)  }\>

#### Defined in

[src/orchestrators/steps/interfaces.ts:87](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/steps/interfaces.ts#L87)
