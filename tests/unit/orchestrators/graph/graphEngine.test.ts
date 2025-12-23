import { GraphEngine } from '@/orchestrators/graph/core/GraphEngine';
import { GraphStatus } from '@/orchestrators/graph/core/enums/graphEngine.enum';
import type { GraphDefinition, GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import type { IGraphState } from '@/orchestrators/graph/core/interfaces/graphState.interface';
import type { Message } from '@/memory';

describe('GraphEngine', () => {
    // Helpers para criar estados e mensagens de teste
    const createInitialState = (overrides?: Partial<IGraphState>): IGraphState => ({
        messages: [],
        data: {},
        status: GraphStatus.RUNNING,
        currentNode: undefined,
        nextNode: undefined,
        logs: [],
        ...overrides,
    });

    const createMessage = (role: 'user' | 'assistant' | 'system', content: string): Message => ({
        role,
        content,
    });

    describe('Construtor', () => {
        it('deve criar instância com definição mínima', () => {
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({ shouldEnd: true }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            expect(engine).toBeInstanceOf(GraphEngine);
        });

        it('deve aceitar maxSteps como opção', () => {
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({ shouldEnd: true }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition, { maxSteps: 10 });
            expect(engine).toBeInstanceOf(GraphEngine);
        });

        it('deve aceitar chatHistoryManager customizado', () => {
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({ shouldEnd: true }),
                },
                edges: {
                    start: 'end',
                },
            };

            const mockChatHistory = {
                addMessage: jest.fn(),
                getTrimmedHistory: jest.fn().mockReturnValue([]),
                clearHistory: jest.fn(),
                addSystemPrompt: jest.fn(),
                getRemainingBudget: jest.fn().mockReturnValue(1000),
                editMessage: jest.fn(),
                deleteMessageRange: jest.fn(),
                getMessageById: jest.fn(),
                exportHistory: jest.fn().mockReturnValue([]),
                importHistory: jest.fn(),
            };

            const engine = new GraphEngine(definition, { chatHistoryManager: mockChatHistory });
            expect(engine).toBeInstanceOf(GraphEngine);
        });
    });

    describe('execute - Execução básica', () => {
        it('deve executar grafo linear simples (2 nós)', async () => {
            const nodeA = jest.fn().mockResolvedValue({});
            const nodeB = jest.fn().mockResolvedValue({ shouldEnd: true });

            const definition: GraphDefinition = {
                entryPoint: 'nodeA',
                endNodeName: 'end',
                nodes: {
                    nodeA,
                    nodeB,
                },
                edges: {
                    nodeA: 'nodeB',
                    nodeB: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            const result = await engine.execute(initialState);

            expect(result.status).toBe(GraphStatus.FINISHED);
            expect(nodeA).toHaveBeenCalledTimes(1);
            expect(nodeB).toHaveBeenCalledTimes(1);
        });

        it('deve executar grafo até nó final', async () => {
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({}),
                    middle: async (state) => ({}),
                },
                edges: {
                    start: 'middle',
                    middle: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            const result = await engine.execute(initialState);

            expect(result.status).toBe(GraphStatus.FINISHED);
            expect(result.state.currentNode).toBe('end');
        });

        it('deve parar quando nó retornar shouldEnd', async () => {
            const nodeA = jest.fn().mockResolvedValue({ shouldEnd: true });
            const nodeB = jest.fn();

            const definition: GraphDefinition = {
                entryPoint: 'nodeA',
                endNodeName: 'end',
                nodes: {
                    nodeA,
                    nodeB,
                },
                edges: {
                    nodeA: 'nodeB',
                    nodeB: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            const result = await engine.execute(initialState);

            expect(result.status).toBe(GraphStatus.FINISHED);
            expect(nodeA).toHaveBeenCalledTimes(1);
            expect(nodeB).not.toHaveBeenCalled();
        });

        it('deve preservar estado entre nós', async () => {
            const states: IGraphState[] = [];

            const definition: GraphDefinition = {
                entryPoint: 'nodeA',
                endNodeName: 'end',
                nodes: {
                    nodeA: async (state) => {
                        states.push(state);
                        return { data: { step: 1 } };
                    },
                    nodeB: async (state) => {
                        states.push(state);
                        return { data: { step: 2 }, shouldEnd: true };
                    },
                },
                edges: {
                    nodeA: 'nodeB',
                    nodeB: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState({ data: { initial: true } });

            await engine.execute(initialState);

            expect(states[0].data).toEqual({ initial: true });
            expect(states[1].data).toEqual({ initial: true, step: 1 });
        });
    });

    describe('execute - Tratamento de erros', () => {
        it('deve lançar erro se nó não for encontrado', async () => {
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({}),
                },
                edges: {
                    start: 'nonexistent',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            await expect(engine.execute(initialState)).rejects.toThrow("Node 'nonexistent' not found");
        });

        it('deve lançar erro se edge não estiver definida', async () => {
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({}),
                    orphan: async (state) => ({}),
                },
                edges: {
                    start: 'end',
                    // orphan não tem edge definida
                },
            };

            const engine = new GraphEngine(definition, { maxSteps: 1 });
            const initialState = createInitialState({ currentNode: 'orphan' });

            await expect(engine.execute(initialState)).rejects.toThrow("No edge defined for node 'orphan'");
        });

        it('deve capturar erro de execução do nó e retornar status ERROR', async () => {
            const failingNode = jest.fn().mockRejectedValue(new Error('Node execution failed'));

            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: failingNode,
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            const result = await engine.execute(initialState);

            expect(result.status).toBe(GraphStatus.FINISHED);
            expect(result.state.logs.join('\n')).toContain('Erro na execu');
            expect(result.state.messages.some((m) => m.role === 'system')).toBe(true);
        });
    });

    describe('execute - Edges condicionais', () => {
        it('deve seguir edge condicional baseado no estado', async () => {
            const conditionalEdge = jest.fn((state: IGraphState) => {
                return state.data.goToB ? 'nodeB' : 'nodeC';
            });

            const nodeA = jest.fn().mockResolvedValue({ data: { goToB: true } });
            const nodeB = jest.fn().mockResolvedValue({ shouldEnd: true });
            const nodeC = jest.fn().mockResolvedValue({ shouldEnd: true });

            const definition: GraphDefinition = {
                entryPoint: 'nodeA',
                endNodeName: 'end',
                nodes: { nodeA, nodeB, nodeC },
                edges: {
                    nodeA: conditionalEdge,
                    nodeB: 'end',
                    nodeC: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            await engine.execute(initialState);

            expect(conditionalEdge).toHaveBeenCalled();
            expect(nodeB).toHaveBeenCalled();
            expect(nodeC).not.toHaveBeenCalled();
        });

        it('deve lançar erro se edge condicional retornar vazio', async () => {
            const emptyConditional = jest.fn().mockReturnValue('');

            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({}),
                },
                edges: {
                    start: emptyConditional,
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            await expect(engine.execute(initialState)).rejects.toThrow("Conditional edge from 'start' returned empty target");
        });
    });

    describe('execute - Controle de fluxo', () => {
        it('deve respeitar nextNodeOverride', async () => {
            const nodeA = jest.fn().mockResolvedValue({ nextNodeOverride: 'nodeC' });
            const nodeB = jest.fn();
            const nodeC = jest.fn().mockResolvedValue({ shouldEnd: true });

            const definition: GraphDefinition = {
                entryPoint: 'nodeA',
                endNodeName: 'end',
                nodes: { nodeA, nodeB, nodeC },
                edges: {
                    nodeA: 'nodeB',
                    nodeB: 'end',
                    nodeC: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            await engine.execute(initialState);

            expect(nodeA).toHaveBeenCalled();
            expect(nodeB).not.toHaveBeenCalled();
            expect(nodeC).toHaveBeenCalled();
        });

        it('deve pausar quando nó retornar shouldPause', async () => {
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({ shouldPause: true }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            const result = await engine.execute(initialState);

            expect(result.status).toBe(GraphStatus.PAUSED);
        });

        it('deve pausar quando estado tiver pendingAskUser', async () => {
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({
                        pendingAskUser: { question: 'Confirma?', details: 'Detalhes aqui' },
                    }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            const result = await engine.execute(initialState);

            expect(result.status).toBe(GraphStatus.PAUSED);
            expect(result.state.pendingAskUser).toEqual({
                question: 'Confirma?',
                details: 'Detalhes aqui',
            });
        });

        it('deve respeitar maxSteps e lançar erro', async () => {
            const infiniteLoop = jest.fn().mockResolvedValue({});

            const definition: GraphDefinition = {
                entryPoint: 'loop',
                endNodeName: 'end',
                nodes: {
                    loop: infiniteLoop,
                },
                edges: {
                    loop: 'loop', // Loop infinito
                },
            };

            const engine = new GraphEngine(definition, { maxSteps: 5 });
            const initialState = createInitialState();

            await expect(engine.execute(initialState)).rejects.toThrow('Exceeded max steps (5)');
            expect(infiniteLoop).toHaveBeenCalledTimes(5);
        });
    });

    describe('execute - Gerenciamento de mensagens', () => {
        it('deve adicionar mensagens ao estado', async () => {
            const newMessage = createMessage('assistant', 'Resposta do agente');

            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({
                        messages: [newMessage],
                        shouldEnd: true,
                    }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState({
                messages: [createMessage('user', 'Pergunta')],
            });

            const result = await engine.execute(initialState);

            expect(result.state.messages).toHaveLength(2);
            expect(result.state.messages[1]).toEqual(newMessage);
        });

        it('deve preservar mensagens existentes ao adicionar novas', async () => {
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({
                        messages: [createMessage('assistant', 'Nova mensagem')],
                        shouldEnd: true,
                    }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState({
                messages: [
                    createMessage('user', 'Msg 1'),
                    createMessage('assistant', 'Msg 2'),
                ],
            });

            const result = await engine.execute(initialState);

            expect(result.state.messages).toHaveLength(3);
        });
    });

    describe('execute - Gerenciamento de logs', () => {
        it('deve adicionar logs ao estado', async () => {
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({
                        logs: ['Log de execução 1', 'Log de execução 2'],
                        shouldEnd: true,
                    }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            const result = await engine.execute(initialState);

            expect(result.state.logs).toContain('Log de execução 1');
            expect(result.state.logs).toContain('Log de execução 2');
        });

        it('deve acumular logs de múltiplos nós', async () => {
            const definition: GraphDefinition = {
                entryPoint: 'nodeA',
                endNodeName: 'end',
                nodes: {
                    nodeA: async (state) => ({ logs: ['Log A'] }),
                    nodeB: async (state) => ({ logs: ['Log B'], shouldEnd: true }),
                },
                edges: {
                    nodeA: 'nodeB',
                    nodeB: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            const result = await engine.execute(initialState);

            expect(result.state.logs).toEqual(expect.arrayContaining(['Log A', 'Log B']));
        });
    });

    describe('execute - Merge de estado', () => {
        it('deve fazer merge de data corretamente', async () => {
            const definition: GraphDefinition = {
                entryPoint: 'nodeA',
                endNodeName: 'end',
                nodes: {
                    nodeA: async (state) => ({ data: { key1: 'value1' } }),
                    nodeB: async (state) => ({ data: { key2: 'value2' }, shouldEnd: true }),
                },
                edges: {
                    nodeA: 'nodeB',
                    nodeB: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState({ data: { initial: 'data' } });

            const result = await engine.execute(initialState);

            expect(result.state.data).toEqual({
                initial: 'data',
                key1: 'value1',
                key2: 'value2',
            });
        });

        it('deve fazer merge de metadata corretamente', async () => {
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({
                        metadata: { timestamp: Date.now() },
                        shouldEnd: true,
                    }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState({ metadata: { sessionId: '123' } });

            const result = await engine.execute(initialState);

            expect(result.state.metadata?.sessionId).toBe('123');
            expect(result.state.metadata?.timestamp).toBeDefined();
        });

        it('deve atualizar lastToolCall e lastModelOutput', async () => {
            const toolCall = {
                toolName: 'test_tool',
                params: { param: 'value' },
            };

            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({
                        lastToolCall: toolCall,
                        lastModelOutput: 'Output do modelo',
                        shouldEnd: true,
                    }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            const result = await engine.execute(initialState);

            expect(result.state.lastToolCall).toEqual(toolCall);
            expect(result.state.lastModelOutput).toBe('Output do modelo');
        });
    });

    describe('resume - Retomada de execução', () => {
        it('deve retomar execução de estado pausado', async () => {
            const nodeA = jest.fn().mockResolvedValue({ shouldPause: true });
            const nodeB = jest.fn().mockResolvedValue({ shouldEnd: true });

            const definition: GraphDefinition = {
                entryPoint: 'nodeA',
                endNodeName: 'end',
                nodes: { nodeA, nodeB },
                edges: {
                    nodeA: 'nodeB',
                    nodeB: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const initialState = createInitialState();

            // Primeira execução - deve pausar
            const pausedResult = await engine.execute(initialState);
            expect(pausedResult.status).toBe(GraphStatus.PAUSED);

            // Retomar execução
            const resumedResult = await engine.resume(pausedResult.state);
            expect(resumedResult.status).toBe(GraphStatus.FINISHED);
            expect(nodeB).toHaveBeenCalled();
        });

        it('deve adicionar userInput ao retomar', async () => {
            const mockChatHistory = {
                addMessage: jest.fn(),
                getTrimmedHistory: jest.fn().mockReturnValue([]),
                clearHistory: jest.fn(),
                addSystemPrompt: jest.fn(),
                getRemainingBudget: jest.fn().mockReturnValue(1000),
                editMessage: jest.fn(),
                deleteMessageRange: jest.fn(),
                getMessageById: jest.fn(),
                exportHistory: jest.fn().mockReturnValue([]),
                importHistory: jest.fn(),
            };

            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({ shouldEnd: true }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition, { chatHistoryManager: mockChatHistory });
            const pausedState = createInitialState({
                status: GraphStatus.PAUSED,
                nextNode: 'start',
            });

            const userInput = createMessage('user', 'Continuando...');
            await engine.resume(pausedState, userInput);

            expect(mockChatHistory.addMessage).toHaveBeenCalledWith(userInput);
        });

        it('deve retomar do nextNode se status for PAUSED', async () => {
            const nodeA = jest.fn();
            const nodeB = jest.fn().mockResolvedValue({ shouldEnd: true });

            const definition: GraphDefinition = {
                entryPoint: 'nodeA',
                endNodeName: 'end',
                nodes: { nodeA, nodeB },
                edges: {
                    nodeA: 'nodeB',
                    nodeB: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const pausedState = createInitialState({
                status: GraphStatus.PAUSED,
                currentNode: 'nodeA',
                nextNode: 'nodeB',
            });

            await engine.resume(pausedState);

            expect(nodeA).not.toHaveBeenCalled();
            expect(nodeB).toHaveBeenCalled();
        });

        it('deve retomar do entry Point se não houver currentNode', async () => {
            const start = jest.fn().mockResolvedValue({ shouldEnd: true });

            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: { start },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const pausedState = createInitialState({
                status: GraphStatus.PAUSED,
                currentNode: undefined,
                nextNode: undefined,
            });

            await engine.resume(pausedState);

            expect(start).toHaveBeenCalled();
        });
    });

    describe('Métodos públicos - add Message e getMessagesForLLM', () => {
        it('addMessage deve emitir warning se chatHistoryManager não estiver inicializado', () => {
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({ shouldEnd: true }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const message = createMessage('user', 'Test');

            engine.addMessage(message);

            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('ChatHistoryManager not initialized')
            );

            consoleWarnSpy.mockRestore();
        });

        it('getMessagesForLLM deve retornar array vazio se chatHistoryManager não estiver inicializado', () => {
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({ shouldEnd: true }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition);
            const messages = engine.getMessagesForLLM();

            expect(messages).toEqual([]);
            expect(consoleWarnSpy).toHaveBeenCalled();

            consoleWarnSpy.mockRestore();
        });

        it('getMessagesForLLM deve retornar mensagens trimmed do chatHistoryManager', () => {
            const trimmedMessages = [
                createMessage('user', 'Pergunta'),
                createMessage('assistant', 'Resposta'),
            ];

            const mockChatHistory = {
                addMessage: jest.fn(),
                getTrimmedHistory: jest.fn().mockReturnValue(trimmedMessages),
                clearHistory: jest.fn(),
                addSystemPrompt: jest.fn(),
                getRemainingBudget: jest.fn().mockReturnValue(1000),
                editMessage: jest.fn(),
                deleteMessageRange: jest.fn(),
                getMessageById: jest.fn(),
                exportHistory: jest.fn().mockReturnValue([]),
                importHistory: jest.fn(),
            };

            const definition: GraphDefinition = {
                entryPoint: 'start',
                endNodeName: 'end',
                nodes: {
                    start: async (state) => ({ shouldEnd: true }),
                },
                edges: {
                    start: 'end',
                },
            };

            const engine = new GraphEngine(definition, { chatHistoryManager: mockChatHistory });
            const messages = engine.getMessagesForLLM();

            expect(messages).toEqual(trimmedMessages);
            expect(mockChatHistory.getTrimmedHistory).toHaveBeenCalled();
        });
    });
});
