# Interface: IToolCall

Estrutura de dados que representa uma chamada de ferramenta.

Esta é a estrutura que o SAP Parser devolve e que serve como
entrada tipada para o ToolExecutor.

**`Example`**

```typescript
// Chamada de ferramenta para calculadora
const toolCall: IToolCall = {
  toolName: 'calculator',
  params: {
    operation: 'add',
    a: 10,
    b: 5
  }
};

// Execução
const result = await ToolExecutor.execute(toolCall);
```

**`Remarks`**

- `toolName` deve corresponder a uma ferramenta registrada
- `params` deve ser compatível com o parameterSchema da ferramenta
- Usada pelo ToolExecutor para localizar e executar ferramentas

**`See`**

 - [ToolExecutor](../classes/ToolExecutor.md) Para execução de chamadas
 - ToolRegistry Para descoberta de ferramentas

## Table of contents

### Properties

- [params](IToolCall.md#params)
- [toolName](IToolCall.md#toolname)

## Properties

### params

• **params**: [`IToolParams`](IToolParams.md)

Parâmetros para a execução da ferramenta.
Devem ser compatíveis com o parameterSchema da ferramenta especificada.

#### Defined in

[src/tools/core/interfaces.ts:251](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/core/interfaces.ts#L251)

___

### toolName

• **toolName**: `string`

Nome da ferramenta a ser executada.
Deve corresponder ao `name` de uma ferramenta registrada no ToolRegistry.

#### Defined in

[src/tools/core/interfaces.ts:245](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/core/interfaces.ts#L245)
