// tests/unit/promptBuilder/promptBuilder.test.ts
import { PromptBuilder } from '@/promptBuilder/promptBuilder';
import { PromptMode, AgentInfo, PromptBuilderConfig, ToolSchema } from '@/promptBuilder/promptBuilder.interface';
import { toolRegistry } from '@/tools/core/toolRegistry';
import { generateTypedSchema } from '@/tools/constructor/schemaGenerator';

// Mocks
jest.mock('@/tools/core/toolRegistry');
jest.mock('@/tools/constructor/schemaGenerator');
jest.mock('@/utils/logger');

describe('PromptBuilder', () => {
    const mockAgentInfo: AgentInfo = {
        name: 'TestAgent',
        goal: 'Test Goal',
        backstory: 'Test Backstory'
    };

    const mockMode: PromptMode = 'test_mode' as PromptMode;

    beforeEach(() => {
        jest.clearAllMocks();
        // Registrar modo de teste
        PromptBuilder.addPromptMode(mockMode, (config) => `Mode Prompt: ${config.mode}`);
    });

    describe('addPromptMode', () => {
        it('deve registrar e usar um novo modo', () => {
            // Arrange
            const newMode = 'custom_mode' as PromptMode;
            PromptBuilder.addPromptMode(newMode, () => 'Custom Prompt');

            // Act
            const result = PromptBuilder.buildSystemPrompt({
                mode: newMode,
                agentInfo: mockAgentInfo
            });

            // Assert
            expect(result).toContain('Custom Prompt');
        });
    });

    describe('buildSystemPrompt', () => {
        it('deve construir system prompt básico com identidade do agente', () => {
            // Act
            const prompt = PromptBuilder.buildSystemPrompt({
                mode: mockMode,
                agentInfo: mockAgentInfo
            });

            // Assert
            expect(prompt).toContain('# Agent Identity');
            expect(prompt).toContain('Name: TestAgent');
            expect(prompt).toContain('Role: Test Goal');
            expect(prompt).toContain('Backstory: Test Backstory');
            expect(prompt).toContain('Mode Prompt: test_mode');
        });

        it('deve incluir instruções adicionais quando fornecidas', () => {
            // Act
            const prompt = PromptBuilder.buildSystemPrompt({
                mode: mockMode,
                agentInfo: mockAgentInfo,
                additionalInstructions: 'Extra instructions'
            });

            // Assert
            expect(prompt).toContain('## Prompt Instructions');
            expect(prompt).toContain('Extra instructions');
        });

        it('deve lançar erro para modo não registrado', () => {
            // Act & Assert
            expect(() => {
                PromptBuilder.buildSystemPrompt({
                    mode: 'invalid_mode' as PromptMode,
                    agentInfo: mockAgentInfo
                });
            }).toThrow('The agent mode \'invalid_mode\' was not registered');
        });

        it('deve incluir task list quando fornecida', () => {
            // Arrange
            const taskList = {
                items: [
                    { id: '1', title: 'Task 1', status: 'pending' as const },
                    { id: '2', title: 'Task 2', status: 'completed' as const }
                ]
            };

            // Act
            const prompt = PromptBuilder.buildSystemPrompt({
                mode: mockMode,
                agentInfo: mockAgentInfo,
                taskList
            });

            // Assert
            expect(prompt).toContain('## Task List');
            expect(prompt).toContain('- [pending] Task 1 (id: 1)');
            expect(prompt).toContain('- [completed] Task 2 (id: 2)');
        });

        it('deve injetar algoritmo de longo prazo quando toDoIst estiver disponível', () => {
            // Arrange
            const tools: ToolSchema[] = [
                { name: 'toDoIst', description: 'Task list tool', parameterSchema: 'class toDoIst = {}' }
            ];

            // Act
            const prompt = PromptBuilder.buildSystemPrompt({
                mode: mockMode,
                agentInfo: mockAgentInfo,
                tools
            });

            // Assert
            expect(prompt).toContain('## Mandatory Plan Protocol (toDoIst)');
            expect(prompt).toContain('Your first planning write must be');
            expect(prompt).toContain('toDoIst');
        });

        it('não deve injetar algoritmo de longo prazo quando toDoIst não estiver disponível', () => {
            // Arrange
            const tools: ToolSchema[] = [
                { name: 'tool1', description: 'Some tool', parameterSchema: 'class tool1 = {}' }
            ];

            // Act
            const prompt = PromptBuilder.buildSystemPrompt({
                mode: mockMode,
                agentInfo: mockAgentInfo,
                tools
            });

            // Assert
            expect(prompt).not.toContain('## Mandatory Plan Protocol (toDoIst)');
        });

        it('não deve injetar protocolo obrigatório quando toDoIst estiver bloqueado por policy', () => {
            const tools: ToolSchema[] = [
                { name: 'toDoIst', description: 'Task list tool', parameterSchema: 'class toDoIst = { action: string }' }
            ];

            const prompt = PromptBuilder.buildSystemPrompt({
                mode: mockMode,
                agentInfo: mockAgentInfo,
                tools,
                toolPolicy: { deny: ['toDoIst'] }
            });

            expect(prompt).not.toContain('## Mandatory Plan Protocol (toDoIst)');
        });
    });

    describe('buildToolsPrompt (via buildSystemPrompt)', () => {
        it('deve indicar que não há ferramentas quando lista é vazia', () => {
            // Act
            const prompt = PromptBuilder.buildSystemPrompt({
                mode: mockMode,
                agentInfo: mockAgentInfo,
                tools: []
            });

            // Assert
            expect(prompt).toContain('You do not have access to tools');
        });

        it('deve formatar ferramentas corretamente', () => {
            // Arrange
                const tools: ToolSchema[] = [
                    { name: 'tool1', description: 'Desc 1', parameterSchema: 'class tool1 = {}' },
                    { name: 'tool2', description: 'Desc 2', parameterSchema: 'class tool2 = {}' }
                ];

                // Act
                const prompt = PromptBuilder.buildSystemPrompt({
                    mode: mockMode,
                    agentInfo: mockAgentInfo,
                    tools
                });

                // Assert: tools with empty schemas are filtradas e a seção indica ausência
                expect(prompt).toContain('## Tools');
                expect(prompt).toContain('You do not have access to tools');
        });

        it('deve gerar schema se parameterSchema não for string', () => {
            // Arrange
            const tools: any[] = [
                { name: 'tool_obj', description: 'Desc Obj', parameterSchema: { type: 'object' } }
            ];
            (generateTypedSchema as jest.Mock).mockReturnValue('class tool_obj = { generated: true }');

            // Act
            const prompt = PromptBuilder.buildSystemPrompt({
                mode: mockMode,
                agentInfo: mockAgentInfo,
                tools
            });

            // Assert
            expect(generateTypedSchema).toHaveBeenCalledWith(tools[0]);
            expect(prompt).toContain('class tool_obj = { generated: true }');
        });
    });

    describe('buildToolSchemasByNames', () => {
        it('deve recuperar tools do registry e gerar schemas', () => {
            // Arrange
            const mockTool = {
                name: 'reg_tool',
                description: 'Registered Tool',
                parameterSchema: {}
            };
            (toolRegistry.getTool as jest.Mock).mockReturnValue(mockTool);
            (generateTypedSchema as jest.Mock).mockReturnValue('class reg_tool = {}');

            // Act
            const schemas = PromptBuilder.buildToolSchemasByNames(['reg_tool']);

            // Assert
            expect(toolRegistry.getTool).toHaveBeenCalledWith('reg_tool');
            expect(schemas).toHaveLength(1);
            expect(schemas[0].name).toBe('reg_tool');
            expect(schemas[0].parameterSchema).toBe('class reg_tool = {}');
        });

        it('deve ignorar tools não encontradas', () => {
            // Arrange
            (toolRegistry.getTool as jest.Mock).mockReturnValue(undefined);

            // Act
            const schemas = PromptBuilder.buildToolSchemasByNames(['missing_tool']);

            // Assert
            expect(schemas).toHaveLength(0);
        });
    });

    describe('determineSystemPrompt', () => {
        it('deve usar promptConfig se fornecido', () => {
            // Arrange
            const config: PromptBuilderConfig = { mode: mockMode, agentInfo: mockAgentInfo };

            // Act
            const result = PromptBuilder.determineSystemPrompt({ promptConfig: config });

            // Assert
            expect(result.source).toBe('promptConfig');
            expect(result.systemPrompt).toContain('Name: TestAgent');
        });

        it('deve aplicar taskList de runtime sobre promptConfig', () => {
            const config: PromptBuilderConfig = {
                mode: mockMode,
                agentInfo: mockAgentInfo
            };

            const result = PromptBuilder.determineSystemPrompt({
                promptConfig: config,
                taskList: {
                    items: [
                        { id: 't1', title: 'Step A', status: 'in_progress' },
                        { id: 't2', title: 'Step B', status: 'pending' }
                    ]
                }
            });

            expect(result.source).toBe('promptConfig');
            expect(result.systemPrompt).toContain('## Task List');
            expect(result.systemPrompt).toContain('- [in_progress] Step A (id: t1)');
            expect(result.systemPrompt).toContain('- [pending] Step B (id: t2)');
        });

        it('deve usar systemPrompt direto se fornecido', () => {
            // Act
            const result = PromptBuilder.determineSystemPrompt({ systemPrompt: 'Direct Prompt' });

            // Assert
            expect(result.source).toBe('systemPrompt');
            expect(result.systemPrompt).toBe('Direct Prompt');
        });

        it('deve construir a partir de mode e agentInfo', () => {
            // Act
            const result = PromptBuilder.determineSystemPrompt({
                mode: mockMode,
                agentInfo: mockAgentInfo
            });

            // Assert
            expect(result.source).toBe('mode+agentInfo+additionalInstructions');
            expect(result.systemPrompt).toContain('Name: TestAgent');
        });

        it('deve lançar erro se argumentos insuficientes', () => {
            // Act & Assert
            expect(() => {
                PromptBuilder.determineSystemPrompt({});
            }).toThrow('Deve fornecer promptConfig, systemPrompt, ou mode+agentInfo');
        });
    });
});
