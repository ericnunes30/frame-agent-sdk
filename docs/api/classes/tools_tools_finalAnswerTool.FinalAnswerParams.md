# Class: FinalAnswerParams

[tools/tools/finalAnswerTool](../modules/tools_tools_finalAnswerTool.md).FinalAnswerParams

Parâmetros para ferramenta de resposta final.

Define a estrutura necessária para encapsular a resposta final
de um agente ao usuário, marcando o término de um ciclo de execução.

## Implements

- [`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md)

## Table of contents

### Constructors

- [constructor](tools_tools_finalAnswerTool.FinalAnswerParams.md#constructor)

### Properties

- [answer](tools_tools_finalAnswerTool.FinalAnswerParams.md#answer)
- [schemaProperties](tools_tools_finalAnswerTool.FinalAnswerParams.md#schemaproperties)

## Constructors

### constructor

• **new FinalAnswerParams**(): [`FinalAnswerParams`](tools_tools_finalAnswerTool.FinalAnswerParams.md)

#### Returns

[`FinalAnswerParams`](tools_tools_finalAnswerTool.FinalAnswerParams.md)

## Properties

### answer

• **answer**: `string`

Resposta final a ser retornada ao usuário

#### Defined in

[src/tools/tools/finalAnswerTool.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/finalAnswerTool.ts#L13)

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

[src/tools/tools/finalAnswerTool.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/finalAnswerTool.ts#L16)
