import { ToolBase } from '../constructor/toolBase'
import type { IToolParams } from '../core/interfaces'

export class TodoListParams implements IToolParams {
  public action!: string
  public title?: string
  public id?: string
  public status?: string
  public tasks?: string[]
  public defaultStatus?: string

  static schemaProperties = {
    action: { type: 'string', required: true, enum: ['create', 'add', 'update_status', 'complete_all', 'delete_task', 'delete_list'] },
    title: { type: 'string', required: false },
    id: { type: 'string', required: false },
    status: { type: 'string', required: false, enum: ['pending', 'in_progress', 'completed'] },
    tasks: { type: 'array', required: false },
    defaultStatus: { type: 'string', required: false, enum: ['pending', 'in_progress', 'completed'] },
  }
}

export class TodoListTool extends ToolBase<
  TodoListParams,
  {
    type: 'todo_list'
    action: string
    payload?: {
      title?: string
      id?: string
      status?: string
      tasks?: string[]
      defaultStatus?: string
    }
  }
> {
  public readonly name = 'todo_list'
  public readonly description = 'Gerencia uma lista de tarefas com status em inglês.'
  public readonly parameterSchema = TodoListParams

  public async execute(
    params: TodoListParams,
  ): Promise<{
    type: 'todo_list'
    action: string
    payload?: { title?: string; id?: string; status?: string; tasks?: string[]; defaultStatus?: string }
  }> {
    return {
      type: 'todo_list',
      action: params.action,
      payload: {
        title: params.title,
        id: params.id,
        status: params.status,
        tasks: params.tasks,
        defaultStatus: params.defaultStatus,
      },
    }
  }
}