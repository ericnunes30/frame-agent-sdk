import { ToolBase } from '@/tools/constructor/toolBase'
import type { IToolParams, IToolResult } from '@/tools/core/interfaces'

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
    tasks: { type: 'array', items: { type: 'string' }, required: false },
    defaultStatus: { type: 'string', required: false, enum: ['pending', 'in_progress', 'completed'] },
  }
}

/**
 * Tipo de metadata retornado pela TodoListTool.
 * Define a estrutura da lista de tarefas com tipagem forte.
 */
export interface TodoListMetadata {
  taskList: {
    items: Array<{
      id: string;
      title: string;
      status: 'pending' | 'in_progress' | 'completed';
    }>;
  };
}

export class TodoListTool extends ToolBase<
  TodoListParams,
  IToolResult<TodoListMetadata>
> {
  public readonly name = 'todo_list'
  public readonly description = 'Gerencia uma lista de tarefas com status em inglês.'
  public readonly parameterSchema = TodoListParams

  public async execute(
    params: TodoListParams,
  ): Promise<IToolResult<TodoListMetadata>> {
    // Gera ID único
    const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    // Lê taskList atual do contexto (será do state.metadata)
    const currentTaskList = (globalThis as any).__currentTaskList || { items: [] };

    let updatedTaskList = { ...currentTaskList };
    let observation = '';

    switch (params.action) {
      case 'create': {
        const titles: string[] = Array.isArray(params.tasks) ? params.tasks : [];
        const defaultStatus = (params.defaultStatus as any) || 'pending';
        updatedTaskList = {
          items: titles.map((title) => ({
            id: makeId(),
            title: String(title),
            status: defaultStatus
          }))
        };
        observation = `Lista criada com ${titles.length} tarefa(s)`;
        break;
      }

      case 'add': {
        const title = params.title || '';
        const status = (params.status as any) || 'pending';
        if (title) {
          updatedTaskList.items = [
            ...currentTaskList.items,
            { id: makeId(), title, status }
          ];
          observation = `Tarefa "${title}" adicionada`;
        } else {
          observation = 'Título da tarefa não fornecido';
        }
        break;
      }

      case 'update_status': {
        const id = params.id || '';
        const status = params.status as any;
        const idx = updatedTaskList.items.findIndex((i: any) => i.id === id);
        if (idx >= 0 && status) {
          updatedTaskList.items[idx].status = status;
          observation = `Status da tarefa ${id} atualizado para ${status}`;
        } else {
          observation = `Tarefa ${id} não encontrada ou status inválido`;
        }
        break;
      }

      case 'complete_all': {
        updatedTaskList.items = updatedTaskList.items.map((i: any) => ({
          ...i,
          status: 'completed'
        }));
        observation = `Todas as tarefas marcadas como concluídas`;
        break;
      }

      case 'delete_task': {
        const id = params.id || '';
        const initialLength = updatedTaskList.items.length;
        updatedTaskList.items = updatedTaskList.items.filter((i: any) => i.id !== id);
        observation = updatedTaskList.items.length < initialLength
          ? `Tarefa ${id} removida`
          : `Tarefa ${id} não encontrada`;
        break;
      }

      case 'delete_list': {
        updatedTaskList = { items: [] };
        observation = 'Lista de tarefas limpa';
        break;
      }

      default:
        observation = `Ação desconhecida: ${params.action}`;
    }

    // Retorna observation + metadata com taskList atualizada
    return {
      observation,
      metadata: {
        taskList: updatedTaskList
      }
    };
  }
}