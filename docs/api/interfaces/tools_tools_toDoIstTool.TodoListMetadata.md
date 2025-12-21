# Interface: TodoListMetadata

[tools/tools/toDoIstTool](../modules/tools_tools_toDoIstTool.md).TodoListMetadata

Metadata retornada pela ToDoIstTool.

Define a estrutura completa da lista de tarefas com tipagem forte,
incluindo todos os itens e seus respectivos status.

## Table of contents

### Properties

- [taskList](tools_tools_toDoIstTool.TodoListMetadata.md#tasklist)

## Properties

### taskList

• **taskList**: `Object`

Lista de tarefas com todos os itens e seus status

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] | Array de itens da lista de tarefas |

#### Defined in

[src/tools/tools/toDoIstTool.ts:53](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/toDoIstTool.ts#L53)
