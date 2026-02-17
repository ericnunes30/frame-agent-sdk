import { ToolBase } from '@/tools/constructor/toolBase'
import type { IToolParams, IToolResult } from '@/tools/core/interfaces'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

/**
 * Parâmetros para gerenciamento de lista de tarefas.
 * 
 * Define todas as operações possíveis para gerenciar uma lista de tarefas,
 * incluindo criação, adição, atualização de status e exclusão.
 */
export class ToDoIstParams implements IToolParams {
  /** Ação a ser executada na lista de tarefas */
  public action!: string
  /** ID da tarefa (para ações que referenciam tarefas específicas) */
  public id?: string
  /** Status da tarefa (pending, in_progress, completed) */
  public status?: string
  /** Título de uma tarefa (para ação add_task) */
  public title?: string
  /** Lista de títulos de tarefas (para ação create) */
  public tasks?: string[]
  /** Status padrão para novas tarefas (para ação create) */
  public defaultStatus?: string
  /** Posição opcional para inserir tarefa(s) (para ação add_task) */
  public insertAt?: number
  /** IDs em ordem de prioridade (para ação reorder_tasks). IDs não listados ficam ao final preservando ordem relativa */
  public orderedIds?: string[]

  /** Schema de validação para os parâmetros */
  static schemaProperties = {
    action: { 
      type: 'string', 
      required: true, 
      enum: ['create', 'add_task', 'remove_task', 'reorder_tasks', 'update_status', 'complete_all', 'delete_list', 'get']
    },
    id: { type: 'string', required: false },
    status: { type: 'string', required: false, enum: ['pending', 'in_progress', 'completed'] },
    title: { type: 'string', required: false },
    tasks: { type: 'array', items: { type: 'string' }, required: false },
    defaultStatus: { type: 'string', required: false, enum: ['pending', 'in_progress', 'completed'] },
    insertAt: { type: 'number', required: false },
    orderedIds: { type: 'array', items: { type: 'string' }, required: false },
  }
}

/**
 * Metadata retornada pela ToDoIstTool.
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
 * atualização de status e exclusão de tarefas.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Criação de Listas**: Cria novas listas de tarefas com múltiplos itens
 * - **Controle de Status**: Gerencia status das tarefas (pending, in_progress, completed)
 * - **Operações em Lote**: Marca todas as tarefas como concluídas
 * - **Limpeza de Lista**: Remove todas as tarefas ou toda a lista
 * 
 * ## Ações Suportadas
 * 
 * - **create**: Cria uma nova lista com tarefas iniciais (sobrescreve a lista atual, se existir)
 * - **add_task**: Adiciona uma ou mais tarefas sem sobrescrever a lista atual
 * - **remove_task**: Remove uma tarefa específica por ID
 * - **reorder_tasks**: Reordena tarefas de forma incremental por IDs priorizados
 * - **update_status**: Atualiza status de tarefa específica
 * - **complete_all**: Marca todas as tarefas como concluídas
 * - **delete_list**: Remove todas as tarefas da lista (permite criar nova lista depois)
 * - **get**: Retorna a lista de tarefas atual sem modificá-la
 * 
 * ## Regras Importantes
 * 
 * - **Uma lista por vez**: Só pode existir uma lista ativa por vez
 * 
 * ## Status de Tarefas
 * 
 * - **pending**: Tarefa criada mas não iniciada
 * - **in_progress**: Tarefa em execução
 * - **completed**: Tarefa finalizada com sucesso
 * 
 * @example
 * ```typescript
 * import { ToDoIstTool } from '@/tools/tools/ToDoIstTool';
 * import { toolRegistry } from '@/tools/core/toolRegistry';
 * 
 * // Registrar ferramenta
 * toolRegistry.register(new ToDoIstTool());
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
 * @extends {ToolBase<ToDoIstParams, IToolResult<TodoListMetadata>>}
 */
export class ToDoIstTool extends ToolBase<
  ToDoIstParams,
  IToolResult<TodoListMetadata>
> {
  /** Nome da ferramenta no sistema */
  public readonly name = 'toDoIst'
  /** Descrição da funcionalidade da ferramenta */
  public readonly description = 'Gerencia uma lista de tarefas simples (sem subtarefas). Ações e parâmetros: create(tasks[], defaultStatus?) [sobrescreve lista]; add_task(title|tasks[], defaultStatus?, insertAt?); remove_task(id); reorder_tasks(orderedIds[]) [IDs não informados mantêm ordem relativa no final]; update_status(id, status); complete_all; delete_list; get. IDs são gerados automaticamente.'
  /** Schema de parâmetros para validação */
  public readonly parameterSchema = ToDoIstParams
  
  /** TaskList da instância atual (sem cache estático) */
  private currentTaskList: TodoListMetadata['taskList'] = { items: [] }
  
  /** Contador para gerar IDs sequenciais */
  private nextId: number = 0
  
  /** Caminho para arquivo de persistência */
  private readonly persistencePath: string

  /**
   * Construtor - inicializa caminho de persistência e carrega dados existentes
   */
  constructor() {
    super();
    // Criar diretório .frame no home do usuário se não existir
    const frameDir = path.join(os.homedir(), '.frame');
    if (!fs.existsSync(frameDir)) {
      fs.mkdirSync(frameDir, { recursive: true });
    }
    
    // Definir caminho do arquivo de persistência
    this.persistencePath = path.join(frameDir, 'todoist.json');
    
    // Carregar dados existentes
    this.loadFromDisk();
  }

  /**
   * Obtém a lista de tarefas atual.
   * 
   * @returns TaskList atual com todos os itens e seus status.
   * 
   * @example
   * ```typescript
   * const tool = new ToDoIstTool();
   * const tasks = tool.getCurrentTasks();
   * console.log(tasks.items.length); // Número de tarefas
   * ```
   */
  public getCurrentTasks(): TodoListMetadata['taskList'] {
    return this.currentTaskList;
  }

  /**
   * Gera próximo ID sequencial.
   * 
   * @returns Próximo ID numérico como string.
   */
  private getNextId(): string {
    return (this.nextId++).toString();
  }

  /**
   * Salva a lista atual e o contador no disco.
   */
  private saveToDisk(): void {
    try {
      const data = {
        taskList: this.currentTaskList,
        nextId: this.nextId
      };
      fs.writeFileSync(this.persistencePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Erro ao salvar lista de tarefas:', error);
    }
  }

  /**
   * Carrega a lista e o contador do disco.
   */
  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.persistencePath)) {
        const data = JSON.parse(fs.readFileSync(this.persistencePath, 'utf-8'));
        this.currentTaskList = data.taskList || { items: [] };
        this.nextId = data.nextId || 0;
      }
    } catch (error) {
      console.error('Erro ao carregar lista de tarefas:', error);
      // Em caso de erro, começar com lista vazia
      this.currentTaskList = { items: [] };
      this.nextId = 0;
    }
  }

  /**
   * Executa operação na lista de tarefas.
   * 
   * @param params Parâmetros da operação a ser executada.
   * 
   * @returns Resultado com observation e metadata atualizada.
   * 
   * @example
   * ```typescript
   * const tool = new ToDoIstTool();
   * 
   * // Atualizar status
   * const result = await tool.execute({
   *   action: 'update_status',
   *   id: 'task-id-123',
   *   status: 'in_progress'
   * });
   * 
   * console.log(result.observation); // "Status da tarefa task-id-123 atualizado para in_progress"
   * ```
   */
  public async execute(
    params: ToDoIstParams,
  ): Promise<IToolResult<TodoListMetadata>> {
    // Lê taskList atual da instância
    const currentTaskList = this.currentTaskList;

    let updatedTaskList = { ...currentTaskList };
    let observation = '';

    switch (params.action) {
      case 'create': {
        const previousCount = currentTaskList.items.length;

        const titles: string[] = Array.isArray(params.tasks) ? params.tasks : [];
        const defaultStatus = (params.defaultStatus as any) || 'pending';

        // Reset contador para começar do 0 - IDs são sempre gerados automaticamente
        this.nextId = 0;

        updatedTaskList = {
          items: titles.map((title) => ({
            id: this.getNextId(),
            title: String(title),
            status: defaultStatus
          }))
        };
        // Atualizar taskList da instância
        this.currentTaskList = updatedTaskList;
        // Salvar no disco
        this.saveToDisk();
        const taskIds = updatedTaskList.items.map(item => item.id).join(', ');
        const overwrittenText = previousCount > 0
          ? ` (sobrescreveu lista anterior com ${previousCount} tarefa(s))`
          : '';
        observation = `Lista criada com ${titles.length} tarefa(s). IDs: ${taskIds}${overwrittenText}`;
        break;
      }

      case 'add_task': {
        const titles: string[] = [];
        if (typeof params.title === 'string' && params.title.trim().length > 0) {
          titles.push(params.title.trim());
        }
        if (Array.isArray(params.tasks)) {
          for (const taskTitle of params.tasks) {
            const normalizedTitle = String(taskTitle).trim();
            if (normalizedTitle.length > 0) titles.push(normalizedTitle);
          }
        }

        if (titles.length === 0) {
          observation = 'Nenhuma tarefa informada para add_task. Use "title" ou "tasks".';
          break;
        }

        const defaultStatus = (params.defaultStatus as any) || 'pending';
        const newItems = titles.map((title) => ({
          id: this.getNextId(),
          title,
          status: defaultStatus
        }));

        const requestedIndex =
          typeof params.insertAt === 'number' && Number.isFinite(params.insertAt)
            ? Math.trunc(params.insertAt)
            : updatedTaskList.items.length;
        const insertAt = Math.max(0, Math.min(requestedIndex, updatedTaskList.items.length));

        updatedTaskList = {
          items: [
            ...updatedTaskList.items.slice(0, insertAt),
            ...newItems,
            ...updatedTaskList.items.slice(insertAt),
          ]
        };

        this.currentTaskList = updatedTaskList;
        this.saveToDisk();
        const taskIds = newItems.map((item) => item.id).join(', ');
        observation = `Adicionada(s) ${newItems.length} tarefa(s) na posição ${insertAt}. IDs: ${taskIds}`;
        break;
      }

      case 'remove_task': {
        const id = params.id || '';
        if (!id) {
          observation = 'Informe "id" para remover uma tarefa.';
          break;
        }

        const taskToRemove = updatedTaskList.items.find((item) => item.id === id);
        if (!taskToRemove) {
          observation = `Tarefa ${id} não encontrada`;
          break;
        }

        updatedTaskList = {
          items: updatedTaskList.items.filter((item) => item.id !== id)
        };
        this.currentTaskList = updatedTaskList;
        this.saveToDisk();
        observation = `Tarefa ${id} removida: "${taskToRemove.title}".`;
        break;
      }

      case 'reorder_tasks': {
        const orderedIds = Array.isArray(params.orderedIds)
          ? params.orderedIds.map((id) => String(id))
          : [];

        if (orderedIds.length === 0) {
          observation = 'Informe "orderedIds" para reordenar tarefas.';
          break;
        }

        const duplicateIds = orderedIds.filter((id, idx) => orderedIds.indexOf(id) !== idx);
        if (duplicateIds.length > 0) {
          observation = `orderedIds contém IDs duplicados: ${Array.from(new Set(duplicateIds)).join(', ')}`;
          break;
        }

        const currentIds = new Set(updatedTaskList.items.map((item) => item.id));
        const invalidIds = orderedIds.filter((id) => !currentIds.has(id));
        if (invalidIds.length > 0) {
          observation = `IDs inválidos em orderedIds: ${invalidIds.join(', ')}`;
          break;
        }

        const byId = new Map(updatedTaskList.items.map((item) => [item.id, item] as const));
        const prioritized = orderedIds.map((id) => byId.get(id)!).filter(Boolean);
        const prioritizedSet = new Set(orderedIds);
        const remaining = updatedTaskList.items.filter((item) => !prioritizedSet.has(item.id));

        updatedTaskList = {
          items: [...prioritized, ...remaining]
        };

        this.currentTaskList = updatedTaskList;
        this.saveToDisk();
        observation = `Ordem atualizada com ${orderedIds.length} tarefa(s) priorizada(s).`;
        break;
      }

      case 'update_status': {
        const id = params.id || '';
        const status = params.status as any;
        const idx = updatedTaskList.items.findIndex((i: any) => i.id === id);
        if (idx >= 0 && status) {
          updatedTaskList.items[idx].status = status;
          // Atualizar taskList da instância
          this.currentTaskList = updatedTaskList;
          // Salvar no disco
          this.saveToDisk();
          // Encontrar próxima tarefa pendente
          const nextPending = updatedTaskList.items.find(item => item.status === 'pending');
          const nextTaskText = nextPending ? ` Próxima pendente: "${nextPending.title}"` : '';
          observation = `Status da tarefa ${id} atualizado para ${status}.${nextTaskText}`;
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
        // Atualizar taskList da instância
        this.currentTaskList = updatedTaskList;
        // Salvar no disco
        this.saveToDisk();
        observation = `Todas as ${updatedTaskList.items.length} tarefas marcadas como concluídas. Use final_answer para finalizar.`;
        break;
      }

      case 'delete_list': {
        updatedTaskList = { items: [] };
        // Reset contador
        this.nextId = 0;
        // Atualizar taskList da instância
        this.currentTaskList = updatedTaskList;
        // Salvar no disco
        this.saveToDisk();
        observation = 'Lista de tarefas limpa. Todas as tarefas removidas.';
        break;
      }

      case 'get': {
        // Apenas retorna a lista atual sem modificá-la
        const taskCount = currentTaskList.items.length;
        const tasksList = currentTaskList.items.map(item => 
          `ID: ${item.id} - "${item.title}" (${item.status})`
        ).join('\n');
        
        observation = `Lista atual (${taskCount} tarefa(s)):\n${tasksList || '(vazia)'}`;
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
