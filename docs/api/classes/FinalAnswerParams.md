# Class: FinalAnswerParams

Parâmetros para ferramenta de resposta final.

Define a estrutura necessária para encapsular a resposta final
de um agente ao usuário, marcando o término de um ciclo de execução.

## Implements

- [`IToolParams`](../interfaces/IToolParams.md)

## Table of contents

### Constructors

- [constructor](FinalAnswerParams.md#constructor)

### Properties

- [answer](FinalAnswerParams.md#answer)
- [schemaProperties](FinalAnswerParams.md#schemaproperties)

## Constructors

### constructor

• **new FinalAnswerParams**(): [`FinalAnswerParams`](FinalAnswerParams.md)

#### Returns

[`FinalAnswerParams`](FinalAnswerParams.md)

## Properties

### answer

• **answer**: `string`

Resposta final a ser retornada ao usuário

#### Defined in

[src/tools/tools/finalAnswerTool.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/finalAnswerTool.ts#L13)

___

### schemaProperties

▪ `Static` **schemaProperties**: `Object`

Schema de validação para os parâmetros

#### Type declaration

| Name | Type |
| :------ | :------ |
| `answer` | \{ `minLength`: `number` = 1; `required`: `boolean` = true; `type`: `string` = 'string' } |
| `answer.minLength` | `number` |
| `answer.required` | `boolean` |
| `answer.type` | `string` |

#### Defined in

[src/tools/tools/finalAnswerTool.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/finalAnswerTool.ts#L16)
