# Interface: ITool\<TParams, TReturn\>

[tools/core/interfaces](../modules/tools_core_interfaces.md).ITool

O contrato principal para a definição de uma ferramenta (Schema Aligned Parsing).

Esta interface define o contrato que todas as ferramentas devem implementar
para serem compatíveis com o sistema de ferramentas do framework.

**`Example`**

```typescript
// Ferramenta com retorno simples
class SimpleTool implements ITool {
  name = 'simple_tool';
  description = 'Uma ferramenta simples';
  parameterSchema = SimpleParams;
  
  async execute(params: SimpleParams): Promise<string> {
    return 'Operação concluída';
  }
}

// Ferramenta com retorno estruturado
class ComplexTool implements ITool<ComplexParams, IToolResult<ComplexMetadata>> {
  name = 'complex_tool';
  description = 'Uma ferramenta complexa';
  parameterSchema = ComplexParams;
  
  async execute(params: ComplexParams): Promise<IToolResult<ComplexMetadata>> {
    return {
      observation: 'Operação concluída',
      metadata: {
        result: 'success',
        timestamp: Date.now()
      }
    };
  }
}
```

**`Remarks`**

- `name` deve ser único no registry
- `description` é usada pelo PromptBuilder para gerar schemas
- `parameterSchema` é convertido automaticamente para formato LLM
- `execute` deve ser assíncrono para suportar operações I/O

**`See`**

 - ToolBase Para classe base que implementa esta interface
 - ToolRegistry Para registro e descoberta de ferramentas
 - SchemaGenerator Para conversão de schemas

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TParams` | extends [`IToolParams`](tools_core_interfaces.IToolParams.md) = [`IToolParams`](tools_core_interfaces.IToolParams.md) | O tipo da CLASSE de parâmetros de entrada. Default: IToolParams |
| `TReturn` | `unknown` | O tipo do valor de retorno do método execute. Default: unknown ## Tipos de Retorno Suportados Ferramentas podem retornar: - **Valor simples** (string, number, object, etc.) - tratado como observation - **IToolResult<TMetadata>** - observation + metadata tipado para atualizar state |

## Implemented by

- [`ToolBase`](../classes/tools_constructor_toolBase.ToolBase.md)

## Table of contents

### Properties

- [description](tools_core_interfaces.ITool.md#description)
- [name](tools_core_interfaces.ITool.md#name)
- [parameterSchema](tools_core_interfaces.ITool.md#parameterschema)

### Methods

- [execute](tools_core_interfaces.ITool.md#execute)

## Properties

### description

• **description**: `string`

Descrição detalhada para o LLM.
Explica quando e como usar a ferramenta, quais parâmetros esperar,
e que tipo de resultado retornar.

#### Defined in

[src/tools/core/interfaces.ts:182](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/core/interfaces.ts#L182)

___

### name

• **name**: `string`

Nome único da ferramenta.
Usado para identificação no registry e chamadas pelo LLM.
Deve ser descritivo e único no sistema.

#### Defined in

[src/tools/core/interfaces.ts:175](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/core/interfaces.ts#L175)

___

### parameterSchema

• `Readonly` **parameterSchema**: `unknown`

Schema dos parâmetros em formato TypeScript ou descriptor.

Pode ser:
- Uma classe TypeScript que implementa IToolParams
- Um objeto descriptor com metadados de validação
- Uma string com schema customizado

Este schema é convertido automaticamente para formato legível por LLMs
pelo SchemaGenerator.

#### Defined in

[src/tools/core/interfaces.ts:195](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/core/interfaces.ts#L195)

## Methods

### execute

▸ **execute**(`params`): `Promise`\<`TReturn`\>

Método principal de execução da ferramenta.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `TParams` | Parâmetros de entrada, já validados e tipados. |

#### Returns

`Promise`\<`TReturn`\>

Promise com o resultado da execução.
Pode ser valor simples ou IToolResult estruturado.

**`Throws`**

Se houver erro durante a execução

#### Defined in

[src/tools/core/interfaces.ts:207](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/core/interfaces.ts#L207)
