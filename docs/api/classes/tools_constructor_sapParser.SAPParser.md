# Class: SAPParser

[tools/constructor/sapParser](../modules/tools_constructor_sapParser.md).SAPParser

O Engine SAP (Schema Aligned Parsing).
ResponsÃ¡vel pela ValidaÃ§Ã£o, CorreÃ§Ã£o e Parsing da saÃ­da bruta do LLM
para o formato tipado IToolCall.

## Table of contents

### Constructors

- [constructor](tools_constructor_sapParser.SAPParser.md#constructor)

### Properties

- [ACTION\_HEADER](tools_constructor_sapParser.SAPParser.md#action_header)

### Methods

- [convertActionInputFormat](tools_constructor_sapParser.SAPParser.md#convertactioninputformat)
- [correctActionHeader](tools_constructor_sapParser.SAPParser.md#correctactionheader)
- [extractBalancedJson](tools_constructor_sapParser.SAPParser.md#extractbalancedjson)
- [parseAndValidate](tools_constructor_sapParser.SAPParser.md#parseandvalidate)
- [stripCodeFences](tools_constructor_sapParser.SAPParser.md#stripcodefences)

## Constructors

### constructor

• **new SAPParser**(): [`SAPParser`](tools_constructor_sapParser.SAPParser.md)

#### Returns

[`SAPParser`](tools_constructor_sapParser.SAPParser.md)

## Properties

### ACTION\_HEADER

▪ `Static` `Private` `Readonly` **ACTION\_HEADER**: `RegExp`

#### Defined in

[src/tools/constructor/sapParser.ts:24](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/constructor/sapParser.ts#L24)

## Methods

### convertActionInputFormat

▸ **convertActionInputFormat**(`text`): `string`

Converte o formato ReAct com "Action Input" para o formato SAP esperado.

Converte:
Action: toolName
Action Input: { ... }

Para:
Action: toolName = { ... }

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/constructor/sapParser.ts:41](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/constructor/sapParser.ts#L41)

___

### correctActionHeader

▸ **correctActionHeader**(`text`): `string`

Corrige formatação comum de saída do LLM para o padrão esperado
Converte: "Action: tool {" -> "Action: tool = {"
         "Action: tool: {" -> "Action: tool = {"

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/constructor/sapParser.ts:67](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/constructor/sapParser.ts#L67)

___

### extractBalancedJson

▸ **extractBalancedJson**(`text`, `startIndex`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `startIndex` | `number` |

#### Returns

`string`

#### Defined in

[src/tools/constructor/sapParser.ts:74](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/constructor/sapParser.ts#L74)

___

### parseAndValidate

▸ **parseAndValidate**(`rawLLMOutput`): [`IToolCall`](../interfaces/tools_core_interfaces.IToolCall.md) \| [`ISAPError`](../interfaces/tools_constructor_sapParser.ISAPError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawLLMOutput` | `string` |

#### Returns

[`IToolCall`](../interfaces/tools_core_interfaces.IToolCall.md) \| [`ISAPError`](../interfaces/tools_constructor_sapParser.ISAPError.md)

#### Defined in

[src/tools/constructor/sapParser.ts:89](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/constructor/sapParser.ts#L89)

___

### stripCodeFences

▸ **stripCodeFences**(`text`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/constructor/sapParser.ts:26](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/constructor/sapParser.ts#L26)
