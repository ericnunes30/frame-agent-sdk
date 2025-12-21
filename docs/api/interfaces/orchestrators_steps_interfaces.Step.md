# Interface: Step

[orchestrators/steps/interfaces](../modules/orchestrators_steps_interfaces.md).Step

Contrato de um Step executável.

## Table of contents

### Properties

- [id](orchestrators_steps_interfaces.Step.md#id)

### Methods

- [run](orchestrators_steps_interfaces.Step.md#run)

## Properties

### id

• **id**: `string`

#### Defined in

[src/orchestrators/steps/interfaces.ts:69](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/interfaces.ts#L69)

## Methods

### run

▸ **run**(`ctx`): `Promise`\<`void` \| [`StepResultUpdate`](orchestrators_steps_interfaces.StepResultUpdate.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`StepContext`](orchestrators_steps_interfaces.StepContext.md) |

#### Returns

`Promise`\<`void` \| [`StepResultUpdate`](orchestrators_steps_interfaces.StepResultUpdate.md)\>

#### Defined in

[src/orchestrators/steps/interfaces.ts:70](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/interfaces.ts#L70)
