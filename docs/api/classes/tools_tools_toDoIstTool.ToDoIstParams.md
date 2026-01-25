# Class: ToDoIstParams

[tools/tools/toDoIstTool](../modules/tools_tools_toDoIstTool.md).ToDoIstParams

Parâmetros para gerenciamento de lista de tarefas.

Define todas as operações possíveis para gerenciar uma lista de tarefas,
incluindo criação, atualização de status e exclusão.

## Implements

- [`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md)

## Table of contents

### Constructors

- [constructor](tools_tools_toDoIstTool.ToDoIstParams.md#constructor)

### Properties

- [action](tools_tools_toDoIstTool.ToDoIstParams.md#action)
- [defaultStatus](tools_tools_toDoIstTool.ToDoIstParams.md#defaultstatus)
- [id](tools_tools_toDoIstTool.ToDoIstParams.md#id)
- [status](tools_tools_toDoIstTool.ToDoIstParams.md#status)
- [tasks](tools_tools_toDoIstTool.ToDoIstParams.md#tasks)
- [schemaProperties](tools_tools_toDoIstTool.ToDoIstParams.md#schemaproperties)

## Constructors

### constructor

• **new ToDoIstParams**(): [`ToDoIstParams`](tools_tools_toDoIstTool.ToDoIstParams.md)

#### Returns

[`ToDoIstParams`](tools_tools_toDoIstTool.ToDoIstParams.md)

## Properties

### action

• **action**: `string`

Ação a ser executada na lista de tarefas

#### Defined in

[src/tools/tools/toDoIstTool.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/toDoIstTool.ts#L15)

___

### defaultStatus

• `Optional` **defaultStatus**: `string`

Status padrão para novas tarefas (para ação create)

#### Defined in

[src/tools/tools/toDoIstTool.ts:27](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/toDoIstTool.ts#L27)

___

### id

• `Optional` **id**: `string`

ID da tarefa (para ações que referenciam tarefas específicas)

#### Defined in

[src/tools/tools/toDoIstTool.ts:19](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/toDoIstTool.ts#L19)

___

### status

• `Optional` **status**: `string`

Status da tarefa (pending, in_progress, completed)

#### Defined in

[src/tools/tools/toDoIstTool.ts:23](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/toDoIstTool.ts#L23)

___

### tasks

• `Optional` **tasks**: `string`[]

Lista de títulos de tarefas (para ação create)

#### Defined in

[src/tools/tools/toDoIstTool.ts:25](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/toDoIstTool.ts#L25)

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

#### Defined in

[src/tools/tools/toDoIstTool.ts:30](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/toDoIstTool.ts#L30)
