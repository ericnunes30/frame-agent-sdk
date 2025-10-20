# Class: FinalAnswerTool

[tools/tools/finalAnswerTool](../modules/tools_tools_finalAnswerTool.md).FinalAnswerTool

Classe base abstrata para todas as ferramentas.
Implementa o contrato ITool e define a estrutura fundamental para
o Schema Aligned Parsing (SAP).

## Hierarchy

- [`ToolBase`](tools_constructor_toolBase.ToolBase.md)\<[`FinalAnswerParams`](tools_tools_finalAnswerTool.FinalAnswerParams.md), \{ `answer`: `string` ; `type`: ``"final_answer"``  }\>

  ↳ **`FinalAnswerTool`**

## Table of contents

### Constructors

- [constructor](tools_tools_finalAnswerTool.FinalAnswerTool.md#constructor)

### Properties

- [description](tools_tools_finalAnswerTool.FinalAnswerTool.md#description)
- [name](tools_tools_finalAnswerTool.FinalAnswerTool.md#name)
- [parameterSchema](tools_tools_finalAnswerTool.FinalAnswerTool.md#parameterschema)

### Methods

- [execute](tools_tools_finalAnswerTool.FinalAnswerTool.md#execute)

## Constructors

### constructor

• **new FinalAnswerTool**(): [`FinalAnswerTool`](tools_tools_finalAnswerTool.FinalAnswerTool.md)

#### Returns

[`FinalAnswerTool`](tools_tools_finalAnswerTool.FinalAnswerTool.md)

#### Inherited from

[ToolBase](tools_constructor_toolBase.ToolBase.md).[constructor](tools_constructor_toolBase.ToolBase.md#constructor)

## Properties

### description

• `Readonly` **description**: ``"Finaliza o ciclo de execução retornando a resposta final para o usuário."``

Descrição detalhada para o LLM, explicando quando e como usar a ferramenta.

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[description](tools_constructor_toolBase.ToolBase.md#description)

#### Defined in

tools/tools/finalAnswerTool.ts:15

___

### name

• `Readonly` **name**: ``"final_answer"``

Nome único da ferramenta, usado pelo LLM na chamada de função.

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[name](tools_constructor_toolBase.ToolBase.md#name)

#### Defined in

tools/tools/finalAnswerTool.ts:14

___

### parameterSchema

• `Readonly` **parameterSchema**: typeof [`FinalAnswerParams`](tools_tools_finalAnswerTool.FinalAnswerParams.md) = `FinalAnswerParams`

Referência à classe ou tipo TypeScript que define os parâmetros esperados.
Este é o coração do SAP, pois este tipo será usado para gerar o schema.

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[parameterSchema](tools_constructor_toolBase.ToolBase.md#parameterschema)

#### Defined in

tools/tools/finalAnswerTool.ts:16

## Methods

### execute

▸ **execute**(`params`): `Promise`\<\{ `answer`: `string` ; `type`: ``"final_answer"``  }\>

O método onde a lógica de negócio da ferramenta reside.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`FinalAnswerParams`](tools_tools_finalAnswerTool.FinalAnswerParams.md) | Os parâmetros de entrada, já validados e tipados pelo SAP Parser/Executor. |

#### Returns

`Promise`\<\{ `answer`: `string` ; `type`: ``"final_answer"``  }\>

Uma Promise com o resultado da execução (a Observação do Agente).

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[execute](tools_constructor_toolBase.ToolBase.md#execute)

#### Defined in

tools/tools/finalAnswerTool.ts:18
