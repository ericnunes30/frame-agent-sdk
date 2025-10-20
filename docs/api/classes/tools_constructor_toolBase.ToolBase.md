# Class: ToolBase\<TParams, TReturn\>

[tools/constructor/toolBase](../modules/tools_constructor_toolBase.md).ToolBase

Classe base abstrata para todas as ferramentas.
Implementa o contrato ITool e define a estrutura fundamental para
o Schema Aligned Parsing (SAP).

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TParams` | extends [`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md) = [`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md) | O tipo da CLASSE de parâmetros de entrada. |
| `TReturn` | `unknown` | O tipo do valor de retorno do método execute. |

## Hierarchy

- **`ToolBase`**

  ↳ [`AskUserTool`](tools_tools_askUserTool.AskUserTool.md)

  ↳ [`FinalAnswerTool`](tools_tools_finalAnswerTool.FinalAnswerTool.md)

  ↳ [`SearchTool`](tools_tools_searchTool.SearchTool.md)

## Implements

- [`ITool`](../interfaces/tools_core_interfaces.ITool.md)\<`TParams`, `TReturn`\>

## Table of contents

### Constructors

- [constructor](tools_constructor_toolBase.ToolBase.md#constructor)

### Properties

- [description](tools_constructor_toolBase.ToolBase.md#description)
- [name](tools_constructor_toolBase.ToolBase.md#name)
- [parameterSchema](tools_constructor_toolBase.ToolBase.md#parameterschema)

### Methods

- [execute](tools_constructor_toolBase.ToolBase.md#execute)

## Constructors

### constructor

• **new ToolBase**\<`TParams`, `TReturn`\>(): [`ToolBase`](tools_constructor_toolBase.ToolBase.md)\<`TParams`, `TReturn`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md) = [`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md) |
| `TReturn` | `unknown` |

#### Returns

[`ToolBase`](tools_constructor_toolBase.ToolBase.md)\<`TParams`, `TReturn`\>

## Properties

### description

• `Readonly` `Abstract` **description**: `string`

Descrição detalhada para o LLM, explicando quando e como usar a ferramenta.

#### Implementation of

[ITool](../interfaces/tools_core_interfaces.ITool.md).[description](../interfaces/tools_core_interfaces.ITool.md#description)

#### Defined in

tools/constructor/toolBase.ts:18

___

### name

• `Readonly` `Abstract` **name**: `string`

Nome único da ferramenta, usado pelo LLM na chamada de função.

#### Implementation of

[ITool](../interfaces/tools_core_interfaces.ITool.md).[name](../interfaces/tools_core_interfaces.ITool.md#name)

#### Defined in

tools/constructor/toolBase.ts:15

___

### parameterSchema

• `Readonly` `Abstract` **parameterSchema**: `unknown`

Referência à classe ou tipo TypeScript que define os parâmetros esperados.
Este é o coração do SAP, pois este tipo será usado para gerar o schema.

#### Implementation of

[ITool](../interfaces/tools_core_interfaces.ITool.md).[parameterSchema](../interfaces/tools_core_interfaces.ITool.md#parameterschema)

#### Defined in

tools/constructor/toolBase.ts:23

## Methods

### execute

▸ **execute**(`params`): `Promise`\<`TReturn`\>

O método onde a lógica de negócio da ferramenta reside.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `TParams` | Os parâmetros de entrada, já validados e tipados pelo SAP Parser/Executor. |

#### Returns

`Promise`\<`TReturn`\>

Uma Promise com o resultado da execução (a Observação do Agente).

#### Implementation of

[ITool](../interfaces/tools_core_interfaces.ITool.md).[execute](../interfaces/tools_core_interfaces.ITool.md#execute)

#### Defined in

tools/constructor/toolBase.ts:30
