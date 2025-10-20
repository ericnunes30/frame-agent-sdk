# Class: SearchTool

[tools/tools/searchTool](../modules/tools_tools_searchTool.md).SearchTool

2. Implementação da Tool Concreta
Esta tool usa a SearchParams como seu contrato de entrada (TParams).

## Hierarchy

- [`ToolBase`](tools_constructor_toolBase.ToolBase.md)\<[`SearchParams`](tools_tools_searchTool.SearchParams.md), `string`\>

  ↳ **`SearchTool`**

## Table of contents

### Constructors

- [constructor](tools_tools_searchTool.SearchTool.md#constructor)

### Properties

- [description](tools_tools_searchTool.SearchTool.md#description)
- [name](tools_tools_searchTool.SearchTool.md#name)
- [parameterSchema](tools_tools_searchTool.SearchTool.md#parameterschema)

### Methods

- [execute](tools_tools_searchTool.SearchTool.md#execute)

## Constructors

### constructor

• **new SearchTool**(): [`SearchTool`](tools_tools_searchTool.SearchTool.md)

#### Returns

[`SearchTool`](tools_tools_searchTool.SearchTool.md)

#### Inherited from

[ToolBase](tools_constructor_toolBase.ToolBase.md).[constructor](tools_constructor_toolBase.ToolBase.md#constructor)

## Properties

### description

• `Readonly` **description**: ``"Use esta ferramenta para buscar informações na internet sobre qualquer tópico."``

Descrição detalhada para o LLM, explicando quando e como usar a ferramenta.

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[description](tools_constructor_toolBase.ToolBase.md#description)

#### Defined in

tools/tools/searchTool.ts:29

___

### name

• `Readonly` **name**: ``"search"``

Nome único da ferramenta, usado pelo LLM na chamada de função.

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[name](tools_constructor_toolBase.ToolBase.md#name)

#### Defined in

tools/tools/searchTool.ts:28

___

### parameterSchema

• `Readonly` **parameterSchema**: typeof [`SearchParams`](tools_tools_searchTool.SearchParams.md) = `SearchParams`

Referência à classe ou tipo TypeScript que define os parâmetros esperados.
Este é o coração do SAP, pois este tipo será usado para gerar o schema.

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[parameterSchema](tools_constructor_toolBase.ToolBase.md#parameterschema)

#### Defined in

tools/tools/searchTool.ts:30

## Methods

### execute

▸ **execute**(`params`): `Promise`\<`string`\>

Lógica de negócio da ferramenta.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`SearchParams`](tools_tools_searchTool.SearchParams.md) |

#### Returns

`Promise`\<`string`\>

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[execute](tools_constructor_toolBase.ToolBase.md#execute)

#### Defined in

tools/tools/searchTool.ts:35
