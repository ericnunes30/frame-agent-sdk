# Class: AskUserParams

Parâmetros para a ferramenta AskUserTool.

Define os dados necessários para solicitar informações do usuário
durante a execução de um agente.

## Implements

- [`IToolParams`](../interfaces/IToolParams.md)

## Table of contents

### Constructors

- [constructor](AskUserParams.md#constructor)

### Properties

- [details](AskUserParams.md#details)
- [question](AskUserParams.md#question)
- [schemaProperties](AskUserParams.md#schemaproperties)

## Constructors

### constructor

• **new AskUserParams**(): [`AskUserParams`](AskUserParams.md)

#### Returns

[`AskUserParams`](AskUserParams.md)

## Properties

### details

• `Optional` **details**: `string`

Detalhes adicionais ou contexto para a pergunta (opcional)

#### Defined in

[src/tools/tools/askUserTool.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/askUserTool.ts#L15)

___

### question

• **question**: `string`

Pergunta principal a ser feita ao usuário

#### Defined in

[src/tools/tools/askUserTool.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/askUserTool.ts#L13)

___

### schemaProperties

▪ `Static` **schemaProperties**: `Object`

Schema de validação para os parâmetros

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

[src/tools/tools/askUserTool.ts:18](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/askUserTool.ts#L18)
