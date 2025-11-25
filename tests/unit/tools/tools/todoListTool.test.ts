// tests/unit/tools/tools/todoListTool.test.ts
import { TodoListTool, TodoListParams, TodoListMetadata } from '@/tools/tools/todoListTool';

describe('TodoListTool', () => {
    let tool: TodoListTool;

    beforeEach(() => {
        tool = new TodoListTool();
        // Reset global state mock
        (globalThis as any).__currentTaskList = { items: [] };
    });

    afterEach(() => {
        delete (globalThis as any).__currentTaskList;
    });

    describe('execute', () => {
        it('deve criar uma nova lista de tarefas', async () => {
            // Arrange
            const params: TodoListParams = {
                action: 'create',
                tasks: ['Task 1', 'Task 2']
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.observation).toContain('Lista criada com 2 tarefa(s)');
            expect(result.metadata?.taskList.items).toHaveLength(2);
            expect(result.metadata?.taskList.items[0].title).toBe('Task 1');
            expect(result.metadata?.taskList.items[0].status).toBe('pending');
        });

        it('deve adicionar uma tarefa a uma lista existente', async () => {
            // Arrange
            (globalThis as any).__currentTaskList = {
                items: [{ id: '1', title: 'Existing', status: 'pending' }]
            };
            const params: TodoListParams = {
                action: 'add',
                title: 'New Task'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.observation).toContain('Tarefa "New Task" adicionada');
            expect(result.metadata?.taskList.items).toHaveLength(2);
            expect(result.metadata?.taskList.items[1].title).toBe('New Task');
        });

        it('deve atualizar o status de uma tarefa', async () => {
            // Arrange
            (globalThis as any).__currentTaskList = {
                items: [{ id: '123', title: 'Task', status: 'pending' }]
            };
            const params: TodoListParams = {
                action: 'update_status',
                id: '123',
                status: 'completed'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.observation).toContain('Status da tarefa 123 atualizado para completed');
            expect(result.metadata?.taskList.items[0].status).toBe('completed');
        });

        it('deve completar todas as tarefas', async () => {
            // Arrange
            (globalThis as any).__currentTaskList = {
                items: [
                    { id: '1', title: 'T1', status: 'pending' },
                    { id: '2', title: 'T2', status: 'in_progress' }
                ]
            };
            const params: TodoListParams = { action: 'complete_all' };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.observation).toContain('Todas as tarefas marcadas como concluídas');
            expect(result.metadata?.taskList.items.every((i: any) => i.status === 'completed')).toBe(true);
        });

        it('deve deletar uma tarefa', async () => {
            // Arrange
            (globalThis as any).__currentTaskList = {
                items: [{ id: 'del_id', title: 'To Delete', status: 'pending' }]
            };
            const params: TodoListParams = {
                action: 'delete_task',
                id: 'del_id'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.observation).toContain('Tarefa del_id removida');
            expect(result.metadata?.taskList.items).toHaveLength(0);
        });

        it('deve limpar a lista inteira', async () => {
            // Arrange
            (globalThis as any).__currentTaskList = {
                items: [{ id: '1', title: 'T1', status: 'pending' }]
            };
            const params: TodoListParams = { action: 'delete_list' };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.observation).toContain('Lista de tarefas limpa');
            expect(result.metadata?.taskList.items).toHaveLength(0);
        });

        it('deve lidar com ação desconhecida', async () => {
            // Arrange
            const params: TodoListParams = { action: 'unknown_action' };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.observation).toContain('Ação desconhecida');
        });
    });
});
