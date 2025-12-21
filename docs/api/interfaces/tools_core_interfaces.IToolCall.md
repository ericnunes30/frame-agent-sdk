# Interface: IToolCall

[tools/core/interfaces](../modules/tools_core_interfaces.md).IToolCall

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

 - ToolExecutor Para execução de chamadas
 - ToolRegistry Para descoberta de ferramentas

## Table of contents

### Properties

- [params](tools_core_interfaces.IToolCall.md#params)
- [thought](tools_core_interfaces.IToolCall.md#thought)
- [toolCallId](tools_core_interfaces.IToolCall.md#toolcallid)
- [toolName](tools_core_interfaces.IToolCall.md#toolname)

## Properties

### params

• **params**: [`IToolParams`](tools_core_interfaces.IToolParams.md)

Parâmetros para a execução da ferramenta.
Devem ser compatíveis com o parameterSchema da ferramenta especificada.

#### Defined in

[src/tools/core/interfaces.ts:251](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/core/interfaces.ts#L251)

___

### thought

• `Optional` **thought**: `string`

Thought extraído da resposta do LLM (opcional).
Usado para exibir o raciocínio do agente no terminal.

#### Defined in

[src/tools/core/interfaces.ts:263](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/core/interfaces.ts#L263)

___

### toolCallId

• `Optional` **toolCallId**: `string`

Identificador de correlaÇõÇœo para tool calls (telemetria).
Permite correlacionar `tool_detected` com `tool_execution_*`.

#### Defined in

[src/tools/core/interfaces.ts:257](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/core/interfaces.ts#L257)

___

### toolName

• **toolName**: `string`

Nome da ferramenta a ser executada.
Deve corresponder ao `name` de uma ferramenta registrada no ToolRegistry.

#### Defined in

[src/tools/core/interfaces.ts:245](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/core/interfaces.ts#L245)
