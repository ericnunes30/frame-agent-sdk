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
  /** Título da tarefa (para ações add e edit) */
  public title?: string
  /** ID da tarefa (para ações que referenciam tarefas específicas) */
  public id?: string
  /** Novo ID da tarefa (para ação edit) */
  public newId?: string
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
      enum: ['create', 'add', 'update_status', 'complete_all', 'delete_task', 'delete_list', 'edit', 'get'] 
    },
    title: { type: 'string', required: false },
    id: { type: 'string', required: false },
    newId: { type: 'string', required: false },
    status: { type: 'string', required: false, enum: ['pending', 'in_progress', 'completed'] },
    tasks: { type: 'array', items: { type: 'string' }, required: false },
    defaultStatus: { type: 'string', required: false, enum: ['pending', 'in_progress', 'completed'] },
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
 * - **create**: Cria nova lista com tarefas iniciais (só se não houver lista ativa)
 * - **add**: Adiciona nova tarefa à lista existente
 * - **update_status**: Atualiza status de tarefa específica
 * - **complete_all**: Marca todas as tarefas como concluídas
 * - **delete_task**: Remove tarefa específica da lista
 * - **delete_list**: Remove todas as tarefas da lista (permite criar nova lista depois)
 * - **edit**: Edita uma tarefa existente (título, status ou ID)
 * - **get**: Retorna a lista de tarefas atual sem modificá-la
 * 
 * ## Regras Importantes
 * 
 * - **Uma lista por vez**: Só pode existir uma lista ativa por vez
 * - **Prevenção de duplicação**: `create` falhará se já houver lista - use `delete_list` primeiro
 * - **Expansão permitida**: Use `add` para expandir a lista existente conforme necessário
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
  public readonly description = 'Gerencia uma lista de tarefas simples (sem subtarefas). IDs são gerados automaticamente na criação - NÃO informe id na ação create.'
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
   * Recalcula IDs sequenciais para todas as tarefas.
   * Ordena por ID numérico antes de recalcular para manter ordem correta.
   */
  private recalculateIds(): void {
    // Ordenar por ID numérico primeiro
    this.currentTaskList.items.sort((a, b) => 
      parseInt(a.id) - parseInt(b.id)
    );
    
    // Reset contador e recalcular IDs
    this.nextId = 0;
    this.currentTaskList.items = this.currentTaskList.items.map(item => ({
      ...item,
      id: this.getNextId()
    }));
  }

  /**
   * Reordena tarefas pelo ID (numérico).
   * Útil após alterações de ID para manter ordem correta.
   */
  private reorderTasksById(): void {
    this.currentTaskList.items.sort((a, b) => 
      parseInt(a.id) - parseInt(b.id)
    );
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
    params: ToDoIstParams,
  ): Promise<IToolResult<TodoListMetadata>> {
    // Lê taskList atual da instância
    const currentTaskList = this.currentTaskList;

    let updatedTaskList = { ...currentTaskList };
    let observation = '';

    switch (params.action) {
      case 'create': {
        // Verificar se já existe uma lista
        if (currentTaskList.items.length > 0) {
          observation = `Já existe lista com ${currentTaskList.items.length} tarefa(s). Use delete_list primeiro para criar uma nova.`;
          break;
        }

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
        observation = `Lista criada com ${titles.length} tarefa(s). IDs: ${taskIds}`;
        break;
      }

      case 'add': {
        const title = params.title || '';
        const status = (params.status as any) || 'pending';
        if (title) {
          let newId: string;
          
          // Se ID específico foi fornecido, usar e recalcular
          if (params.id) {
            const requestedId = parseInt(params.id);
            if (!isNaN(requestedId) && requestedId >= 0) {
              // Inserir com ID específico e recalcular outros IDs
              const newTask = { id: params.id, title, status };
              
              // Encontrar posição correta baseada no ID
              let insertIndex = updatedTaskList.items.findIndex(item => 
                parseInt(item.id) > requestedId
              );
              
              // Atualizar this.currentTaskList diretamente (não usar cópia)
              if (insertIndex === -1) {
                // Adicionar no final
                this.currentTaskList.items = [...currentTaskList.items, newTask];
              } else {
                // Inserir na posição correta
                this.currentTaskList.items = [
                  ...currentTaskList.items.slice(0, insertIndex),
                  newTask,
                  ...currentTaskList.items.slice(insertIndex)
                ];
              }
              
              // Recalcular IDs para manter sequência
              this.recalculateIds();
              // Atualizar a referência updatedTaskList com a lista recalculada
              updatedTaskList = { ...this.currentTaskList };
              // Encontrar o novo ID após recálculo
              const updatedTask = this.currentTaskList.items.find(item => item.title === title);
              newId = updatedTask ? updatedTask.id : this.getNextId();
            } else {
              // ID inválido, usar próximo sequencial
              newId = this.getNextId();
              updatedTaskList.items = [
                ...currentTaskList.items,
                { id: newId, title, status }
              ];
            }
          } else {
            // Usar próximo ID sequencial
            newId = this.getNextId();
            updatedTaskList.items = [
              ...currentTaskList.items,
              { id: newId, title, status }
            ];
          }
          
          // Atualizar taskList da instância
          this.currentTaskList = updatedTaskList;
          // Salvar no disco
          this.saveToDisk();
          observation = `Tarefa "${title}" adicionada (ID: ${newId})`;
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

      case 'delete_task': {
        const id = params.id || '';
        const initialLength = updatedTaskList.items.length;
        updatedTaskList.items = updatedTaskList.items.filter((i: any) => i.id !== id);
        // Atualizar taskList da instância
        this.currentTaskList = updatedTaskList;
        // Salvar no disco
        this.saveToDisk();
        const remaining = updatedTaskList.items.length;
        observation = updatedTaskList.items.length < initialLength
          ? `Tarefa ${id} removida. Restam ${remaining} tarefa(s)`
          : `Tarefa ${id} não encontrada`;
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

      case 'edit': {
        const id = params.id || '';
        const title = params.title;
        const status = params.status as any;
        const newId = params.newId;
        
        const idx = updatedTaskList.items.findIndex((i: any) => i.id === id);
        if (idx >= 0) {
          // Editar tarefa existente
          const task = updatedTaskList.items[idx];
          
          // Atualizar título se fornecido
          if (title !== undefined) {
            task.title = title;
          }
          
          // Atualizar status se fornecido
          if (status) {
            task.status = status;
          }
          
          // Atualizar ID se fornecido
          if (newId) {
            const requestedNewId = parseInt(newId);
            if (!isNaN(requestedNewId) && requestedNewId >= 0) {
              // Verificar se o novo ID já existe
              const existingTaskWithNewId = updatedTaskList.items.find((item, index) => 
                item.id === newId && index !== idx
              );
              
              if (!existingTaskWithNewId) {
                task.id = newId;
                // Recalcular IDs para manter sequência
                this.recalculateIds();
                // Atualizar a referência updatedTaskList com a lista recalculada
                updatedTaskList = { ...this.currentTaskList };
              } else {
                // ID já existe, não permitir duplicação
                observation = `ID ${newId} já está em uso por outra tarefa.`;
              }
            }
          }
          
          // Atualizar taskList da instância
          this.currentTaskList = updatedTaskList;
          // Salvar no disco
          this.saveToDisk();
          observation = `Tarefa ${id} atualizada.`;
        } else {
          observation = `Tarefa ${id} não encontrada`;
        }
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