# Class: ToDoIstTool

[tools/tools/toDoIstTool](../modules/tools_tools_toDoIstTool.md).ToDoIstTool

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

- **create**: Cria nova lista com tarefas iniciais (só se não houver lista ativa)
- **add**: Adiciona nova tarefa à lista existente
- **update_status**: Atualiza status de tarefa específica
- **complete_all**: Marca todas as tarefas como concluídas
- **delete_task**: Remove tarefa específica da lista
- **delete_list**: Remove todas as tarefas da lista (permite criar nova lista depois)
- **edit**: Edita uma tarefa existente (título, status ou ID)
- **get**: Retorna a lista de tarefas atual sem modificá-la

## Regras Importantes

- **Uma lista por vez**: Só pode existir uma lista ativa por vez
- **Prevenção de duplicação**: `create` falhará se já houver lista - use `delete_list` primeiro
- **Expansão permitida**: Use `add` para expandir a lista existente conforme necessário

## Status de Tarefas

- **pending**: Tarefa criada mas não iniciada
- **in_progress**: Tarefa em execução
- **completed**: Tarefa finalizada com sucesso

**`Example`**

```typescript
import { ToDoIstTool } from '@/tools/tools/ToDoIstTool';
import { toolRegistry } from '@/tools/core/toolRegistry';

// Registrar ferramenta
toolRegistry.register(new ToDoIstTool());

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

- [`ToolBase`](tools_constructor_toolBase.ToolBase.md)\<[`ToDoIstParams`](tools_tools_toDoIstTool.ToDoIstParams.md), [`IToolResult`](../interfaces/tools_core_interfaces.IToolResult.md)\<[`TodoListMetadata`](../interfaces/tools_tools_toDoIstTool.TodoListMetadata.md)\>\>

  ↳ **`ToDoIstTool`**

## Table of contents

### Constructors

- [constructor](tools_tools_toDoIstTool.ToDoIstTool.md#constructor)

### Properties

- [currentTaskList](tools_tools_toDoIstTool.ToDoIstTool.md#currenttasklist)
- [description](tools_tools_toDoIstTool.ToDoIstTool.md#description)
- [name](tools_tools_toDoIstTool.ToDoIstTool.md#name)
- [nextId](tools_tools_toDoIstTool.ToDoIstTool.md#nextid)
- [parameterSchema](tools_tools_toDoIstTool.ToDoIstTool.md#parameterschema)
- [persistencePath](tools_tools_toDoIstTool.ToDoIstTool.md#persistencepath)

### Methods

- [execute](tools_tools_toDoIstTool.ToDoIstTool.md#execute)
- [getCurrentTasks](tools_tools_toDoIstTool.ToDoIstTool.md#getcurrenttasks)
- [getNextId](tools_tools_toDoIstTool.ToDoIstTool.md#getnextid)
- [loadFromDisk](tools_tools_toDoIstTool.ToDoIstTool.md#loadfromdisk)
- [recalculateIds](tools_tools_toDoIstTool.ToDoIstTool.md#recalculateids)
- [reorderTasksById](tools_tools_toDoIstTool.ToDoIstTool.md#reordertasksbyid)
- [saveToDisk](tools_tools_toDoIstTool.ToDoIstTool.md#savetodisk)

## Constructors

### constructor

• **new ToDoIstTool**(): [`ToDoIstTool`](tools_tools_toDoIstTool.ToDoIstTool.md)

Construtor - inicializa caminho de persistência e carrega dados existentes

#### Returns

[`ToDoIstTool`](tools_tools_toDoIstTool.ToDoIstTool.md)

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[constructor](tools_constructor_toolBase.ToolBase.md#constructor)

#### Defined in

[src/tools/tools/toDoIstTool.ts:152](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L152)

## Properties

### currentTaskList

• `Private` **currentTaskList**: `Object`

TaskList da instância atual (sem cache estático)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] | Array de itens da lista de tarefas |

#### Defined in

[src/tools/tools/toDoIstTool.ts:141](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L141)

___

### description

• `Readonly` **description**: ``"Gerencia uma lista de tarefas com status em inglês."``

Descrição da funcionalidade da ferramenta

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[description](tools_constructor_toolBase.ToolBase.md#description)

#### Defined in

[src/tools/tools/toDoIstTool.ts:136](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L136)

___

### name

• `Readonly` **name**: ``"toDoIst"``

Nome da ferramenta no sistema

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[name](tools_constructor_toolBase.ToolBase.md#name)

#### Defined in

[src/tools/tools/toDoIstTool.ts:134](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L134)

___

### nextId

• `Private` **nextId**: `number` = `0`

Contador para gerar IDs sequenciais

#### Defined in

[src/tools/tools/toDoIstTool.ts:144](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L144)

___

### parameterSchema

• `Readonly` **parameterSchema**: typeof [`ToDoIstParams`](tools_tools_toDoIstTool.ToDoIstParams.md) = `ToDoIstParams`

Schema de parâmetros para validação

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[parameterSchema](tools_constructor_toolBase.ToolBase.md#parameterschema)

#### Defined in

[src/tools/tools/toDoIstTool.ts:138](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L138)

___

### persistencePath

• `Private` `Readonly` **persistencePath**: `string`

Caminho para arquivo de persistência

#### Defined in

[src/tools/tools/toDoIstTool.ts:147](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L147)

## Methods

### execute

▸ **execute**(`params`): `Promise`\<[`IToolResult`](../interfaces/tools_core_interfaces.IToolResult.md)\<[`TodoListMetadata`](../interfaces/tools_tools_toDoIstTool.TodoListMetadata.md)\>\>

Executa operação na lista de tarefas.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`ToDoIstParams`](tools_tools_toDoIstTool.ToDoIstParams.md) | Parâmetros da operação a ser executada. |

#### Returns

`Promise`\<[`IToolResult`](../interfaces/tools_core_interfaces.IToolResult.md)\<[`TodoListMetadata`](../interfaces/tools_tools_toDoIstTool.TodoListMetadata.md)\>\>

Resultado com observation e metadata atualizada.

**`Example`**

```typescript
const tool = new ToDoIstTool();

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

[ToolBase](tools_constructor_toolBase.ToolBase.md).[execute](tools_constructor_toolBase.ToolBase.md#execute)

#### Defined in

[src/tools/tools/toDoIstTool.ts:283](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L283)

___

### getCurrentTasks

▸ **getCurrentTasks**(): `Object`

Obtém a lista de tarefas atual.

#### Returns

`Object`

TaskList atual com todos os itens e seus status.

| Name | Type | Description |
| :------ | :------ | :------ |
| `items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] | Array de itens da lista de tarefas |

**`Example`**

```typescript
const tool = new ToDoIstTool();
const tasks = tool.getCurrentTasks();
console.log(tasks.items.length); // Número de tarefas
```

#### Defined in

[src/tools/tools/toDoIstTool.ts:179](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L179)

___

### getNextId

▸ **getNextId**(): `string`

Gera próximo ID sequencial.

#### Returns

`string`

Próximo ID numérico como string.

#### Defined in

[src/tools/tools/toDoIstTool.ts:188](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L188)

___

### loadFromDisk

▸ **loadFromDisk**(): `void`

Carrega a lista e o contador do disco.

#### Returns

`void`

#### Defined in

[src/tools/tools/toDoIstTool.ts:238](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L238)

___

### recalculateIds

▸ **recalculateIds**(): `void`

Recalcula IDs sequenciais para todas as tarefas.
Ordena por ID numérico antes de recalcular para manter ordem correta.

#### Returns

`void`

#### Defined in

[src/tools/tools/toDoIstTool.ts:196](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L196)

___

### reorderTasksById

▸ **reorderTasksById**(): `void`

Reordena tarefas pelo ID (numérico).
Útil após alterações de ID para manter ordem correta.

#### Returns

`void`

#### Defined in

[src/tools/tools/toDoIstTool.ts:214](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L214)

___

### saveToDisk

▸ **saveToDisk**(): `void`

Salva a lista atual e o contador no disco.

#### Returns

`void`

#### Defined in

[src/tools/tools/toDoIstTool.ts:223](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/tools/toDoIstTool.ts#L223)
