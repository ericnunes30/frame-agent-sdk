# Class: TodoListTool

Ferramenta para gerenciamento de lista de tarefas.

Esta ferramenta permite que agentes de IA gerenciem listas de tarefas
de forma estruturada, com suporte a diferentes operações como criação,
adição, atualização de status e exclusão de tarefas.

## Funcionalidades Principais

- **Criação de Listas**: Cria novas listas de tarefas com múltiplos itens
- **Gerenciamento de Tarefas**: Adiciona, atualiza e remove tarefas individuais
- **Controle de Status**: Gerencia status das tarefas (pending, in_progress, completed)
- **Operações em Lote**: Marca todas as tarefas como concluídas
- **Limpeza de Lista**: Remove todas as tarefas ou toda a lista

## Ações Suportadas

- **create**: Cria nova lista com tarefas iniciais
- **add**: Adiciona nova tarefa à lista existente
- **update_status**: Atualiza status de tarefa específica
- **complete_all**: Marca todas as tarefas como concluídas
- **delete_task**: Remove tarefa específica da lista
- **delete_list**: Remove todas as tarefas da lista

## Status de Tarefas

- **pending**: Tarefa criada mas não iniciada
- **in_progress**: Tarefa em execução
- **completed**: Tarefa finalizada com sucesso

**`Example`**

```typescript
import { TodoListTool } from '@/tools/tools/todoListTool';
import { toolRegistry } from '@/tools/core/toolRegistry';

// Registrar ferramenta
toolRegistry.register(new TodoListTool());

// Criar nova lista
const createCall = {
  toolName: 'todo_list',
  params: {
    action: 'create',
    tasks: ['Implementar autenticação', 'Criar API', 'Testes unitários'],
    defaultStatus: 'pending'
  }
};

const result = await ToolExecutor.execute(createCall);
console.log(result.observation); // "Lista criada com 3 tarefa(s)"
console.log(result.metadata.taskList.items.length); // 3
```

## Hierarchy

- [`ToolBase`](ToolBase.md)\<[`TodoListParams`](TodoListParams.md), [`IToolResult`](../interfaces/IToolResult.md)\<`TodoListMetadata`\>\>

  ↳ **`TodoListTool`**

## Table of contents

### Constructors

- [constructor](TodoListTool.md#constructor)

### Properties

- [description](TodoListTool.md#description)
- [name](TodoListTool.md#name)
- [parameterSchema](TodoListTool.md#parameterschema)

### Methods

- [execute](TodoListTool.md#execute)

## Constructors

### constructor

• **new TodoListTool**(): [`TodoListTool`](TodoListTool.md)

#### Returns

[`TodoListTool`](TodoListTool.md)

#### Inherited from

[ToolBase](ToolBase.md).[constructor](ToolBase.md#constructor)

## Properties

### description

• `Readonly` **description**: ``"Gerencia uma lista de tarefas com status em inglês."``

Descrição da funcionalidade da ferramenta

#### Overrides

[ToolBase](ToolBase.md).[description](ToolBase.md#description)

#### Defined in

[src/tools/tools/todoListTool.ts:122](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/todoListTool.ts#L122)

___

### name

• `Readonly` **name**: ``"todo_list"``

Nome da ferramenta no sistema

#### Overrides

[ToolBase](ToolBase.md).[name](ToolBase.md#name)

#### Defined in

[src/tools/tools/todoListTool.ts:120](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/todoListTool.ts#L120)

___

### parameterSchema

• `Readonly` **parameterSchema**: typeof [`TodoListParams`](TodoListParams.md) = `TodoListParams`

Schema de parâmetros para validação

#### Overrides

[ToolBase](ToolBase.md).[parameterSchema](ToolBase.md#parameterschema)

#### Defined in

[src/tools/tools/todoListTool.ts:124](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/todoListTool.ts#L124)

## Methods

### execute

▸ **execute**(`params`): `Promise`\<[`IToolResult`](../interfaces/IToolResult.md)\<`TodoListMetadata`\>\>

Executa operação na lista de tarefas.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`TodoListParams`](TodoListParams.md) | Parâmetros da operação a ser executada. |

#### Returns

`Promise`\<[`IToolResult`](../interfaces/IToolResult.md)\<`TodoListMetadata`\>\>

Resultado com observation e metadata atualizada.

**`Example`**

```typescript
const tool = new TodoListTool();

// Adicionar nova tarefa
const result1 = await tool.execute({
  action: 'add',
  title: 'Revisar código',
  status: 'pending'
});

console.log(result1.observation); // "Tarefa 'Revisar código' adicionada"

// Atualizar status
const result2 = await tool.execute({
  action: 'update_status',
  id: 'task-id-123',
  status: 'in_progress'
});

console.log(result2.observation); // "Status da tarefa task-id-123 atualizado para in_progress"
```

#### Overrides

[ToolBase](ToolBase.md).[execute](ToolBase.md#execute)

#### Defined in

[src/tools/tools/todoListTool.ts:156](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/todoListTool.ts#L156)
