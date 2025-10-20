# Class: SAPParser

[tools/constructor/sapParser](../modules/tools_constructor_sapParser.md).SAPParser

O Engine SAP (Schema Aligned Parsing).
ResponsÃ¡vel pela ValidaÃ§Ã£o, CorreÃ§Ã£o e Parsing da saÃ­da bruta do LLM
para o formato tipado IToolCall.

## Table of contents

### Constructors

- [constructor](tools_constructor_sapParser.SAPParser.md#constructor)

### Properties

- [ACTION\_REGEX](tools_constructor_sapParser.SAPParser.md#action_regex)

### Methods

- [parseAndValidate](tools_constructor_sapParser.SAPParser.md#parseandvalidate)

## Constructors

### constructor

• **new SAPParser**(): [`SAPParser`](tools_constructor_sapParser.SAPParser.md)

#### Returns

[`SAPParser`](tools_constructor_sapParser.SAPParser.md)

## Properties

### ACTION\_REGEX

▪ `Static` `Private` `Readonly` **ACTION\_REGEX**: `RegExp`

#### Defined in

tools/constructor/sapParser.ts:21

## Methods

### parseAndValidate

▸ **parseAndValidate**(`rawLLMOutput`): [`IToolCall`](../interfaces/tools_core_interfaces.IToolCall.md) \| [`ISAPError`](../interfaces/tools_constructor_sapParser.ISAPError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawLLMOutput` | `string` |

#### Returns

[`IToolCall`](../interfaces/tools_core_interfaces.IToolCall.md) \| [`ISAPError`](../interfaces/tools_constructor_sapParser.ISAPError.md)

#### Defined in

tools/constructor/sapParser.ts:23
