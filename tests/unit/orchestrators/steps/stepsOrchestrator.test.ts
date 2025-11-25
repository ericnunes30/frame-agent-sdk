// tests/unit/orchestrators/steps/stepsOrchestrator.test.ts
import { StepsOrchestrator } from '../../../../src/orchestrators/steps/stepsOrchestrator';
import type { StepsDeps, StepsConfig } from '../../../../src/orchestrators/steps/interfaces';
import { AGENT_MODES } from '../../../../src/llmModes';

describe('StepsOrchestrator', () => {
    let orchestrator: StepsOrchestrator;
    let mockDeps: StepsDeps;
    let mockConfig: StepsConfig;

    beforeEach(() => {
        mockDeps = {
            llm: {
                invoke: jest.fn().mockResolvedValue({
                    content: 'Test response',
                    metadata: {}
                })
            } as any,
            memory: {
                addMessage: jest.fn(),
                getTrimmedHistory: jest.fn().mockReturnValue([]),
                getRemainingBudget: jest.fn().mockReturnValue(1000),
                addSystemPrompt: jest.fn(),
                clearHistory: jest.fn()
            } as any
        };

        mockConfig = {
            mode: AGENT_MODES.CHAT,
            agentInfo: {
                name: 'TestBot',
                goal: 'Test goal',
                backstory: 'Test backstory'
            }
        };

        orchestrator = new StepsOrchestrator(mockDeps, mockConfig);
    });

    describe('Construtor', () => {
        it('deve criar instância com dependências e configuração', () => {
            expect(orchestrator).toBeInstanceOf(StepsOrchestrator);
        });
    });

    describe('runFlow - Modo CHAT', () => {
        it('deve executar um único turno em modo chat', async () => {
            // Arrange
            const userInput = 'Hello';

            // Act
            const result = await orchestrator.runFlow(userInput);

            // Assert
            expect(mockDeps.memory.addMessage).toHaveBeenCalledWith({
                role: 'user',
                content: 'Hello'
            });
            expect(mockDeps.llm.invoke).toHaveBeenCalledTimes(1);
            expect(result.final).toBe('Test response');
        });

        it('deve adicionar resposta do assistente ao histórico', async () => {
            // Arrange
            const userInput = 'Test input';

            // Act
            await orchestrator.runFlow(userInput);

            // Assert
            expect(mockDeps.memory.addMessage).toHaveBeenCalledWith({
                role: 'assistant',
                content: 'Test response'
            });
        });

        it('deve retornar null se LLM não retornar content', async () => {
            // Arrange
            (mockDeps.llm.invoke as jest.Mock).mockResolvedValue({
                content: null,
                metadata: {}
            });

            // Act
            const result = await orchestrator.runFlow('Test');

            // Assert
            expect(result.final).toBeNull();
        });
    });

    describe('runFlow - Modo REACT', () => {
        beforeEach(() => {
            mockConfig.mode = AGENT_MODES.REACT;
            orchestrator = new StepsOrchestrator(mockDeps, mockConfig);
        });

        it('deve parar se budget de tokens for zero', async () => {
            // Arrange
            (mockDeps.memory.getRemainingBudget as jest.Mock).mockReturnValue(0);

            // Act
            const result = await orchestrator.runFlow('Test');

            // Assert
            expect(mockDeps.llm.invoke).not.toHaveBeenCalled();
            expect(result.final).toBeNull();
        });

        it('deve respeitar maxTurns', async () => {
            // Arrange
            (mockDeps.llm.invoke as jest.Mock).mockResolvedValue({
                content: 'Response without tool',
                metadata: {}
            });

            // Act
            await orchestrator.runFlow('Test', { maxTurns: 2 });

            // Assert
            // Deve executar no máximo 2 turnos
            expect(mockDeps.llm.invoke).toHaveBeenCalledTimes(2);
        });
    });

    describe('run - Execução de steps', () => {
        it('deve executar sequência de steps', async () => {
            // Arrange
            const mockStep1 = {
                id: 'step1',
                run: jest.fn().mockResolvedValue({
                    data: { value: 'test' }
                })
            };

            const mockStep2 = {
                id: 'step2',
                run: jest.fn().mockResolvedValue({
                    final: 'Final result'
                })
            };

            const steps = [mockStep1, mockStep2];

            // Act
            const result = await orchestrator.run(steps, 'User input');

            // Assert
            expect(mockStep1.run).toHaveBeenCalled();
            expect(mockStep2.run).toHaveBeenCalled();
            expect(result.final).toBe('Final result');
        });

        it('deve parar execução quando step retornar halt', async () => {
            // Arrange
            const mockStep1 = {
                id: 'step1',
                run: jest.fn().mockResolvedValue({
                    halt: true
                })
            };

            const mockStep2 = {
                id: 'step2',
                run: jest.fn()
            };

            const steps = [mockStep1, mockStep2];

            // Act
            await orchestrator.run(steps, 'User input');

            // Assert
            expect(mockStep1.run).toHaveBeenCalled();
            expect(mockStep2.run).not.toHaveBeenCalled();
        });

        it('deve permitir saltos entre steps usando next', async () => {
            // Arrange
            const mockStep1 = {
                id: 'step1',
                run: jest.fn().mockResolvedValue({
                    next: 'step3'
                })
            };

            const mockStep2 = {
                id: 'step2',
                run: jest.fn()
            };

            const mockStep3 = {
                id: 'step3',
                run: jest.fn().mockResolvedValue({})
            };

            const steps = [mockStep1, mockStep2, mockStep3];

            // Act
            await orchestrator.run(steps, 'User input');

            // Assert
            expect(mockStep1.run).toHaveBeenCalled();
            expect(mockStep2.run).not.toHaveBeenCalled();
            expect(mockStep3.run).toHaveBeenCalled();
        });

        it('deve adicionar input do usuário ao histórico', async () => {
            // Arrange
            const mockStep = {
                id: 'step1',
                run: jest.fn().mockResolvedValue({})
            };

            // Act
            await orchestrator.run([mockStep], 'Test input');

            // Assert
            expect(mockDeps.memory.addMessage).toHaveBeenCalledWith({
                role: 'user',
                content: 'Test input'
            });
        });
    });
});
