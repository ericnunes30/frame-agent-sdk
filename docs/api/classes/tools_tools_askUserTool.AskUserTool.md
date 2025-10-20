# Class: AskUserTool

[tools/tools/askUserTool](../modules/tools_tools_askUserTool.md).AskUserTool

Classe base abstrata para todas as ferramentas.
Implementa o contrato ITool e define a estrutura fundamental para
o Schema Aligned Parsing (SAP).

## Hierarchy

- [`ToolBase`](tools_constructor_toolBase.ToolBase.md)\<[`AskUserParams`](tools_tools_askUserTool.AskUserParams.md), \{ `details?`: `string` ; `question`: `string` ; `type`: ``"ask_user"``  }\>

  ↳ **`AskUserTool`**

## Table of contents

### Constructors

- [constructor](tools_tools_askUserTool.AskUserTool.md#constructor)

### Properties

- [description](tools_tools_askUserTool.AskUserTool.md#description)
- [name](tools_tools_askUserTool.AskUserTool.md#name)
- [parameterSchema](tools_tools_askUserTool.AskUserTool.md#parameterschema)

### Methods

- [execute](tools_tools_askUserTool.AskUserTool.md#execute)

## Constructors

### constructor

• **new AskUserTool**(): [`AskUserTool`](tools_tools_askUserTool.AskUserTool.md)

#### Returns

[`AskUserTool`](tools_tools_askUserTool.AskUserTool.md)

#### Inherited from

[ToolBase](tools_constructor_toolBase.ToolBase.md).[constructor](tools_constructor_toolBase.ToolBase.md#constructor)

## Properties

### description

• `Readonly` **description**: ``"Pede esclarecimentos ao usuário quando informações adicionais são necessárias para prosseguir."``

Descrição detalhada para o LLM, explicando quando e como usar a ferramenta.

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[description](tools_constructor_toolBase.ToolBase.md#description)

#### Defined in

tools/tools/askUserTool.ts:17

___

### name

• `Readonly` **name**: ``"ask_user"``

Nome único da ferramenta, usado pelo LLM na chamada de função.

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[name](tools_constructor_toolBase.ToolBase.md#name)

#### Defined in

tools/tools/askUserTool.ts:16

___

### parameterSchema

• `Readonly` **parameterSchema**: typeof [`AskUserParams`](tools_tools_askUserTool.AskUserParams.md) = `AskUserParams`

Referência à classe ou tipo TypeScript que define os parâmetros esperados.
Este é o coração do SAP, pois este tipo será usado para gerar o schema.

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[parameterSchema](tools_constructor_toolBase.ToolBase.md#parameterschema)

#### Defined in

tools/tools/askUserTool.ts:18

## Methods

### execute

▸ **execute**(`params`): `Promise`\<\{ `details?`: `string` ; `question`: `string` ; `type`: ``"ask_user"``  }\>

O método onde a lógica de negócio da ferramenta reside.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AskUserParams`](tools_tools_askUserTool.AskUserParams.md) | Os parâmetros de entrada, já validados e tipados pelo SAP Parser/Executor. |

#### Returns

`Promise`\<\{ `details?`: `string` ; `question`: `string` ; `type`: ``"ask_user"``  }\>

Uma Promise com o resultado da execução (a Observação do Agente).

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[execute](tools_constructor_toolBase.ToolBase.md#execute)

#### Defined in

tools/tools/askUserTool.ts:20
