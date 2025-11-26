import { ToolBase } from '@/tools/constructor/toolBase'
import type { IToolParams, IToolResult } from '@/tools/core/interfaces'

/**
 * Parâmetros para gerenciamento de lista de tarefas.
 * 
 * Define todas as operações possíveis para gerenciar uma lista de tarefas,
 * incluindo criação, adição, atualização de status e exclusão.
 */
export class TodoListParams implements IToolParams {
  /** Ação a ser executada na lista de tarefas */
  public action!: string
  /** Título da tarefa (para ações add) */
  public title?: string
  /** ID da tarefa (para ações que referenciam tarefas específicas) */
  public id?: string
  /** Status da tarefa (pending, in_progress, completed) */
  public status?: string
  /** Lista de títulos de tarefas (para ação create) */
  public tasks?: string[]
  /** Status padrão para novas tarefas (para ação create) */
  public defaultStatus?: string

  /** Schema de validação para os parâmetros */
  static schemaProperties = {
    action: { 
      type: 'string', 
      required: true, 
      enum: ['create', 'add', 'update_status', 'complete_all', 'delete_task', 'delete_list'] 
    },
    title: { type: 'string', required: false },
    id: { type: 'string', required: false },
    status: { type: 'string', required: false, enum: ['pending', 'in_progress', 'completed'] },
    tasks: { type: 'array', items: { type: 'string' }, required: false },
    defaultStatus: { type: 'string', required: false, enum: ['pending', 'in_progress', 'completed'] },
  }
}

/**
 * Metadata retornada pela TodoListTool.
 * 
 * Define a estrutura completa da lista de tarefas com tipagem forte,
 * incluindo todos os itens e seus respectivos status.
 */
export interface TodoListMetadata {
  /** Lista de tarefas com todos os itens e seus status */
  taskList: {
    /** Array de itens da lista de tarefas */
    items: Array<{
      /** Identificador único da tarefa */
      id: string;
      /** Título/descrição da tarefa */
      title: string;
      /** Status atual da tarefa */
      status: 'pending' | 'in_progress' | 'completed';
    }>;
  };
}

/**
 * Ferramenta para gerenciamento de lista de tarefas.
 * 
 * Esta ferramenta permite que agentes de IA gerenciem listas de tarefas
 * de forma estruturada, com suporte a diferentes operações como criação,
 * adição, atualização de status e exclusão de tarefas.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Criação de Listas**: Cria novas listas de tarefas com múltiplos itens
 * - **Gerenciamento de Tarefas**: Adiciona, atualiza e remove tarefas individuais
 * - **Controle de Status**: Gerencia status das tarefas (pending, in_progress, completed)
 * - **Operações em Lote**: Marca todas as tarefas como concluídas
 * - **Limpeza de Lista**: Remove todas as tarefas ou toda a lista
 * 
 * ## Ações Suportadas
 * 
 * - **create**: Cria nova lista com tarefas iniciais
 * - **add**: Adiciona nova tarefa à lista existente
 * - **update_status**: Atualiza status de tarefa específica
 * - **complete_all**: Marca todas as tarefas como concluídas
 * - **delete_task**: Remove tarefa específica da lista
 * - **delete_list**: Remove todas as tarefas da lista
 * 
 * ## Status de Tarefas
 * 
 * - **pending**: Tarefa criada mas não iniciada
 * - **in_progress**: Tarefa em execução
 * - **completed**: Tarefa finalizada com sucesso
 * 
 * @example
 * ```typescript
 * import { TodoListTool } from '@/tools/tools/todoListTool';
 * import { toolRegistry } from '@/tools/core/toolRegistry';
 * 
 * // Registrar ferramenta
 * toolRegistry.register(new TodoListTool());
 * 
 * // Criar nova lista
 * const createCall = {
 *   toolName: 'todo_list',
 *   params: {
 *     action: 'create',
 *     tasks: ['Implementar autenticação', 'Criar API', 'Testes unitários'],
 *     defaultStatus: 'pending'
 *   }
 * };
 * 
 * const result = await ToolExecutor.execute(createCall);
 * console.log(result.observation); // "Lista criada com 3 tarefa(s)"
 * console.log(result.metadata.taskList.items.length); // 3
 * ```
 * 
 * @extends {ToolBase<TodoListParams, IToolResult<TodoListMetadata>>}
 */
export class TodoListTool extends ToolBase<
  TodoListParams,
  IToolResult<TodoListMetadata>
> {
  /** Nome da ferramenta no sistema */
  public readonly name = 'todo_list'
  /** Descrição da funcionalidade da ferramenta */
  public readonly description = 'Gerencia uma lista de tarefas com status em inglês.'
  /** Schema de parâmetros para validação */
  public readonly parameterSchema = TodoListParams

  /**
   * Executa operação na lista de tarefas.
   * 
   * @param params Parâmetros da operação a ser executada.
   * 
   * @returns Resultado com observation e metadata atualizada.
   * 
   * @example
   * ```typescript
   * const tool = new TodoListTool();
   * 
   * // Adicionar nova tarefa
   * const result1 = await tool.execute({
   *   action: 'add',
   *   title: 'Revisar código',
   *   status: 'pending'
   * });
   * 
   * console.log(result1.observation); // "Tarefa 'Revisar código' adicionada"
   * 
   * // Atualizar status
   * const result2 = await tool.execute({
   *   action: 'update_status',
   *   id: 'task-id-123',
   *   status: 'in_progress'
   * });
   * 
   * console.log(result2.observation); // "Status da tarefa task-id-123 atualizado para in_progress"
   * ```
   */
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