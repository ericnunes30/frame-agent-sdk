# Class: TodoListParams

Parâmetros para gerenciamento de lista de tarefas.

Define todas as operações possíveis para gerenciar uma lista de tarefas,
incluindo criação, adição, atualização de status e exclusão.

## Implements

- [`IToolParams`](../interfaces/IToolParams.md)

## Table of contents

### Constructors

- [constructor](TodoListParams.md#constructor)

### Properties

- [action](TodoListParams.md#action)
- [defaultStatus](TodoListParams.md#defaultstatus)
- [id](TodoListParams.md#id)
- [status](TodoListParams.md#status)
- [tasks](TodoListParams.md#tasks)
- [title](TodoListParams.md#title)
- [schemaProperties](TodoListParams.md#schemaproperties)

## Constructors

### constructor

• **new TodoListParams**(): [`TodoListParams`](TodoListParams.md)

#### Returns

[`TodoListParams`](TodoListParams.md)

## Properties

### action

• **action**: `string`

Ação a ser executada na lista de tarefas

#### Defined in

[src/tools/tools/todoListTool.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/todoListTool.ts#L12)

___

### defaultStatus

• `Optional` **defaultStatus**: `string`

Status padrão para novas tarefas (para ação create)

#### Defined in

[src/tools/tools/todoListTool.ts:22](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/todoListTool.ts#L22)

___

### id

• `Optional` **id**: `string`

ID da tarefa (para ações que referenciam tarefas específicas)

#### Defined in

[src/tools/tools/todoListTool.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/todoListTool.ts#L16)

___

### status

• `Optional` **status**: `string`

Status da tarefa (pending, in_progress, completed)

#### Defined in

[src/tools/tools/todoListTool.ts:18](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/todoListTool.ts#L18)

___

### tasks

• `Optional` **tasks**: `string`[]

Lista de títulos de tarefas (para ação create)

#### Defined in

[src/tools/tools/todoListTool.ts:20](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/todoListTool.ts#L20)

___

### title

• `Optional` **title**: `string`

Título da tarefa (para ações add)

#### Defined in

[src/tools/tools/todoListTool.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/todoListTool.ts#L14)

___

### schemaProperties

▪ `Static` **schemaProperties**: `Object`

Schema de validação para os parâmetros

#### Type declaration

| Name | Type |
| :------ | :------ |
| `action` | \{ `enum`: `string`[] ; `required`: `boolean` = true; `type`: `string` = 'string' } |
| `action.enum` | `string`[] |
| `action.required` | `boolean` |
| `action.type` | `string` |
| `defaultStatus` | \{ `enum`: `string`[] ; `required`: `boolean` = false; `type`: `string` = 'string' } |
| `defaultStatus.enum` | `string`[] |
| `defaultStatus.required` | `boolean` |
| `defaultStatus.type` | `string` |
| `id` | \{ `required`: `boolean` = false; `type`: `string` = 'string' } |
| `id.required` | `boolean` |
| `id.type` | `string` |
| `status` | \{ `enum`: `string`[] ; `required`: `boolean` = false; `type`: `string` = 'string' } |
| `status.enum` | `string`[] |
| `status.required` | `boolean` |
| `status.type` | `string` |
| `tasks` | \{ `items`: \{ `type`: `string` = 'string' } ; `required`: `boolean` = false; `type`: `string` = 'array' } |
| `tasks.items` | \{ `type`: `string` = 'string' } |
| `tasks.items.type` | `string` |
| `tasks.required` | `boolean` |
| `tasks.type` | `string` |
| `title` | \{ `required`: `boolean` = false; `type`: `string` = 'string' } |
| `title.required` | `boolean` |
| `title.type` | `string` |

#### Defined in

[src/tools/tools/todoListTool.ts:25](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/todoListTool.ts#L25)
