# Class: AskUserParams

[tools/tools/askUserTool](../modules/tools_tools_askUserTool.md).AskUserParams

Interface vazia para servir como o tipo base para todas as classes de parâmetros de ferramentas.

## Implements

- [`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md)

## Table of contents

### Constructors

- [constructor](tools_tools_askUserTool.AskUserParams.md#constructor)

### Properties

- [details](tools_tools_askUserTool.AskUserParams.md#details)
- [question](tools_tools_askUserTool.AskUserParams.md#question)
- [schemaProperties](tools_tools_askUserTool.AskUserParams.md#schemaproperties)

## Constructors

### constructor

• **new AskUserParams**(): [`AskUserParams`](tools_tools_askUserTool.AskUserParams.md)

#### Returns

[`AskUserParams`](tools_tools_askUserTool.AskUserParams.md)

## Properties

### details

• `Optional` **details**: `string`

#### Defined in

tools/tools/askUserTool.ts:7

___

### question

• **question**: `string`

#### Defined in

tools/tools/askUserTool.ts:6

___

### schemaProperties

▪ `Static` **schemaProperties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `details` | \{ `minLength`: `number` = 0; `required`: `boolean` = false; `type`: `string` = 'string' } |
| `details.minLength` | `number` |
| `details.required` | `boolean` |
| `details.type` | `string` |
| `question` | \{ `minLength`: `number` = 1; `required`: `boolean` = true; `type`: `string` = 'string' } |
| `question.minLength` | `number` |
| `question.required` | `boolean` |
| `question.type` | `string` |

#### Defined in

tools/tools/askUserTool.ts:9
