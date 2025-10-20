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

orchestrators/steps/interfaces.ts:44

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

orchestrators/steps/interfaces.ts:45
