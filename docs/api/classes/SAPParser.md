# Class: SAPParser

O Engine SAP (Schema Aligned Parsing).
ResponsÃ¡vel pela ValidaÃ§Ã£o, CorreÃ§Ã£o e Parsing da saÃ­da bruta do LLM
para o formato tipado IToolCall.

## Table of contents

### Constructors

- [constructor](SAPParser.md#constructor)

### Properties

- [ACTION\_HEADER](SAPParser.md#action_header)

### Methods

- [extractBalancedJson](SAPParser.md#extractbalancedjson)
- [parseAndValidate](SAPParser.md#parseandvalidate)
- [stripCodeFences](SAPParser.md#stripcodefences)

## Constructors

### constructor

• **new SAPParser**(): [`SAPParser`](SAPParser.md)

#### Returns

[`SAPParser`](SAPParser.md)

## Properties

### ACTION\_HEADER

▪ `Static` `Private` `Readonly` **ACTION\_HEADER**: `RegExp`

#### Defined in

[src/tools/constructor/sapParser.ts:24](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/constructor/sapParser.ts#L24)

## Methods

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

[src/tools/constructor/sapParser.ts:31](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/constructor/sapParser.ts#L31)

___

### parseAndValidate

▸ **parseAndValidate**(`rawLLMOutput`): [`IToolCall`](../interfaces/IToolCall.md) \| [`ISAPError`](../interfaces/ISAPError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawLLMOutput` | `string` |

#### Returns

[`IToolCall`](../interfaces/IToolCall.md) \| [`ISAPError`](../interfaces/ISAPError.md)

#### Defined in

[src/tools/constructor/sapParser.ts:46](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/constructor/sapParser.ts#L46)

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

[src/tools/constructor/sapParser.ts:26](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/constructor/sapParser.ts#L26)
