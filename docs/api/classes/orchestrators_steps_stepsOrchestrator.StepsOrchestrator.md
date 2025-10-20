# Class: StepsOrchestrator

[orchestrators/steps/stepsOrchestrator](../modules/orchestrators_steps_stepsOrchestrator.md).StepsOrchestrator

## Table of contents

### Constructors

- [constructor](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#constructor)

### Properties

- [config](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#config)
- [deps](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#deps)

### Methods

- [run](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#run)
- [runFlow](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#runflow)

## Constructors

### constructor

• **new StepsOrchestrator**(`deps`, `config`): [`StepsOrchestrator`](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `deps` | [`StepsDeps`](../interfaces/orchestrators_steps_interfaces.StepsDeps.md) |
| `config` | [`StepsConfig`](../interfaces/orchestrators_steps_interfaces.StepsConfig.md) |

#### Returns

[`StepsOrchestrator`](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md)

#### Defined in

orchestrators/steps/stepsOrchestrator.ts:12

## Properties

### config

• `Private` `Readonly` **config**: [`StepsConfig`](../interfaces/orchestrators_steps_interfaces.StepsConfig.md)

#### Defined in

orchestrators/steps/stepsOrchestrator.ts:10

___

### deps

• `Private` `Readonly` **deps**: [`StepsDeps`](../interfaces/orchestrators_steps_interfaces.StepsDeps.md)

#### Defined in

orchestrators/steps/stepsOrchestrator.ts:9

## Methods

### run

▸ **run**(`steps`, `userInput`): `Promise`\<\{ `final`: `string` ; `state`: [`OrchestrationState`](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md)  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `steps` | [`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)[] |
| `userInput` | `string` |

#### Returns

`Promise`\<\{ `final`: `string` ; `state`: [`OrchestrationState`](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md)  }\>

#### Defined in

orchestrators/steps/stepsOrchestrator.ts:17

___

### runFlow

▸ **runFlow**(`userInput`, `opts?`): `Promise`\<\{ `final`: `string` ; `pendingAskUser?`: \{ `details?`: `string` ; `question`: `string`  } ; `state`: [`OrchestrationState`](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md)  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userInput` | `string` |
| `opts?` | `Object` |
| `opts.maxTurns?` | `number` |

#### Returns

`Promise`\<\{ `final`: `string` ; `pendingAskUser?`: \{ `details?`: `string` ; `question`: `string`  } ; `state`: [`OrchestrationState`](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md)  }\>

#### Defined in

orchestrators/steps/stepsOrchestrator.ts:49
