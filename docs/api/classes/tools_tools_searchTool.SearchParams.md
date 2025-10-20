# Class: SearchParams

[tools/tools/searchTool](../modules/tools_tools_searchTool.md).SearchParams

1. Definição da Classe de Parâmetros de Entrada (Schema Aligned)
Esta classe é referenciada em parameterSchema e deve ser a fonte da verdade para o parsing.
* CORREÇÃO TS2564: O operador '!' (asserção de atribuição definitiva) é usado para indicar 
que as propriedades serão atribuídas pelo SAP Parser em runtime.

## Implements

- [`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md)

## Table of contents

### Constructors

- [constructor](tools_tools_searchTool.SearchParams.md#constructor)

### Properties

- [maxResults](tools_tools_searchTool.SearchParams.md#maxresults)
- [query](tools_tools_searchTool.SearchParams.md#query)
- [schemaProperties](tools_tools_searchTool.SearchParams.md#schemaproperties)

## Constructors

### constructor

• **new SearchParams**(): [`SearchParams`](tools_tools_searchTool.SearchParams.md)

#### Returns

[`SearchParams`](tools_tools_searchTool.SearchParams.md)

## Properties

### maxResults

• **maxResults**: `number`

#### Defined in

tools/tools/searchTool.ts:13

___

### query

• **query**: `string`

#### Defined in

tools/tools/searchTool.ts:12

___

### schemaProperties

▪ `Static` **schemaProperties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `maxResults` | \{ `max`: `number` = 10; `min`: `number` = 1; `required`: `boolean` = false; `type`: `string` = 'number' } |
| `maxResults.max` | `number` |
| `maxResults.min` | `number` |
| `maxResults.required` | `boolean` |
| `maxResults.type` | `string` |
| `query` | \{ `minLength`: `number` = 1; `required`: `boolean` = true; `type`: `string` = 'string' } |
| `query.minLength` | `number` |
| `query.required` | `boolean` |
| `query.type` | `string` |

#### Defined in

tools/tools/searchTool.ts:16
