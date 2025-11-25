# Interface: Step

Contrato de um Step executável.

## Table of contents

### Properties

- [id](Step.md#id)

### Methods

- [run](Step.md#run)

## Properties

### id

• **id**: `string`

#### Defined in

[src/orchestrators/steps/interfaces.ts:52](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/steps/interfaces.ts#L52)

## Methods

### run

▸ **run**(`ctx`): `Promise`\<`void` \| [`StepResultUpdate`](StepResultUpdate.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`StepContext`](StepContext.md) |

#### Returns

`Promise`\<`void` \| [`StepResultUpdate`](StepResultUpdate.md)\>

#### Defined in

[src/orchestrators/steps/interfaces.ts:53](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/steps/interfaces.ts#L53)
