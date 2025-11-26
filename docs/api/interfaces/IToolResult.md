# Interface: IToolResult\<TMetadata\>

Resultado estruturado de uma execução de ferramenta.

Permite que ferramentas retornem tanto a observação principal quanto
metadados opcionais que podem ser usados para atualizar o estado
do agente ou grafo de execução.

**`Example`**

```typescript
// Resultado simples
const simpleResult: IToolResult = {
  observation: 'Operação concluída com sucesso'
};

// Resultado com metadados
interface CalculatorMetadata {
  result: number;
  operation: string;
  timestamp: number;
}

const complexResult: IToolResult<CalculatorMetadata> = {
  observation: 'Resultado: 15',
  metadata: {
    result: 15,
    operation: 'add',
    timestamp: Date.now()
  }
};
```

**`Remarks`**

- `observation` é sempre obrigatória e contém o resultado principal
- `metadata` é opcional e pode ser usada para atualizar estado
- Metadados são mergeados ao state.metadata do grafo
- Útil para ferramentas que gerenciam estado (ex: todo_list)

**`See`**

 - [ToolExecutor](../classes/ToolExecutor.md) Para execução de ferramentas
 - [ToolBase](../classes/ToolBase.md) Para implementação de ferramentas

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TMetadata` | `Record`\<`string`, `unknown`\> | O tipo customizado de metadados. Default: Record<string, unknown> |

## Table of contents

### Properties

- [metadata](IToolResult.md#metadata)
- [observation](IToolResult.md#observation)

## Properties

### metadata

• `Optional` **metadata**: `TMetadata`

Metadados opcionais que serão mergeados ao state.metadata do grafo.

Útil para ferramentas que precisam atualizar estado persistente,
como listas de tarefas, histórico de operações, configurações, etc.

**`Example`**

```typescript
// Para TodoListTool
metadata: {
  taskList: {
    items: [
      { id: '1', title: 'Task 1', status: 'pending' }
    ]
  }
}

// Para CalculatorTool
metadata: {
  calculationHistory: [10, 15, 20],
  lastOperation: 'add'
}
```

#### Defined in

[src/tools/core/interfaces.ts:110](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/core/interfaces.ts#L110)

___

### observation

• **observation**: `unknown`

A observação/resposta principal da ferramenta.
Este é o valor que será mostrado como resultado da execução.
Pode ser string, number, object, array, etc.

#### Defined in

[src/tools/core/interfaces.ts:84](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/core/interfaces.ts#L84)
