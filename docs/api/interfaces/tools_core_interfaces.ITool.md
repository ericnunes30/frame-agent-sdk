# Interface: ITool\<TParams, TReturn\>

[tools/core/interfaces](../modules/tools_core_interfaces.md).ITool

O contrato principal para a definição de uma ferramenta (SAP).

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TParams` | extends [`IToolParams`](tools_core_interfaces.IToolParams.md) = [`IToolParams`](tools_core_interfaces.IToolParams.md) | O tipo da CLASSE de parâmetros de entrada. |
| `TReturn` | `unknown` | O tipo do valor de retorno do método execute. |

## Implemented by

- [`ToolBase`](../classes/tools_constructor_toolBase.ToolBase.md)

## Table of contents

### Properties

- [description](tools_core_interfaces.ITool.md#description)
- [name](tools_core_interfaces.ITool.md#name)
- [parameterSchema](tools_core_interfaces.ITool.md#parameterschema)

### Methods

- [execute](tools_core_interfaces.ITool.md#execute)

## Properties

### description

• **description**: `string`

#### Defined in

tools/core/interfaces.ts:15

___

### name

• **name**: `string`

#### Defined in

tools/core/interfaces.ts:14

___

### parameterSchema

• `Readonly` **parameterSchema**: `unknown`

#### Defined in

tools/core/interfaces.ts:16

## Methods

### execute

▸ **execute**(`params`): `Promise`\<`TReturn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `TParams` |

#### Returns

`Promise`\<`TReturn`\>

#### Defined in

tools/core/interfaces.ts:17
