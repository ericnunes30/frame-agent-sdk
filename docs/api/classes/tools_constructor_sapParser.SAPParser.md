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

[src/tools/constructor/sapParser.ts:24](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/constructor/sapParser.ts#L24)

## Methods

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

[src/tools/constructor/sapParser.ts:36](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/constructor/sapParser.ts#L36)

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

[src/tools/constructor/sapParser.ts:43](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/constructor/sapParser.ts#L43)

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

[src/tools/constructor/sapParser.ts:58](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/constructor/sapParser.ts#L58)

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

[src/tools/constructor/sapParser.ts:26](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/constructor/sapParser.ts#L26)
