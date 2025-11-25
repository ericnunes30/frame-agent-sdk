// tests/unit/tools/core/toolRegistry.test.ts
import { toolRegistry } from '@/tools/core/toolRegistry';
import { ITool, IToolParams } from '@/tools/core/interfaces';

// Mock tool para testes
class MockToolParams implements IToolParams {
    query?: string;
}

class MockTool implements ITool<MockToolParams, string> {
    public readonly name: string;
    public readonly description: string;
    public readonly parameterSchema = {};

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    async execute(params: MockToolParams): Promise<string> {
        return `Executed ${this.name} with query: ${params.query || 'none'}`;
    }
}

describe('ToolRegistry', () => {
    // Limpar o registry antes de cada teste
    beforeEach(() => {
        // Criar nova instância limpa para cada teste
        // Como toolRegistry é singleton, vamos limpar suas ferramentas
        const tools = toolRegistry.listTools();
        tools.forEach(tool => {
            // Não há método clear, então vamos apenas ter cuidado com os nomes
        });
    });

    describe('register', () => {
        it('deve registrar uma ferramenta com sucesso', () => {
            // Arrange
            const tool = new MockTool('test_search', 'Ferramenta de busca de teste');

            // Act
            toolRegistry.register(tool);
            const retrieved = toolRegistry.getTool('test_search');

            // Assert
            expect(retrieved).toBeDefined();
            expect(retrieved?.name).toBe('test_search');
            expect(retrieved?.description).toBe('Ferramenta de busca de teste');
        });

        it('deve sobrescrever ferramenta com nome duplicado e emitir warning', () => {
            // Arrange
            const tool1 = new MockTool('duplicate_tool', 'Primeira versão');
            const tool2 = new MockTool('duplicate_tool', 'Segunda versão');
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            // Act
            toolRegistry.register(tool1);
            toolRegistry.register(tool2);

            // Assert
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('duplicate_tool')
            );
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('já está registrada e será sobrescrita')
            );

            const retrieved = toolRegistry.getTool('duplicate_tool');
            expect(retrieved?.description).toBe('Segunda versão');

            // Cleanup
            consoleWarnSpy.mockRestore();
        });
    });

    describe('getTool', () => {
        it('deve recuperar ferramenta registrada pelo nome', () => {
            // Arrange
            const tool = new MockTool('retrieval_test', 'Teste de recuperação');
            toolRegistry.register(tool);

            // Act
            const retrieved = toolRegistry.getTool('retrieval_test');

            // Assert
            expect(retrieved).toBeDefined();
            expect(retrieved).toBe(tool);
        });

        it('deve retornar undefined para ferramenta não registrada', () => {
            // Act
            const retrieved = toolRegistry.getTool('non_existent_tool');

            // Assert
            expect(retrieved).toBeUndefined();
        });
    });

    describe('listTools', () => {
        it('deve listar todas as ferramentas registradas', () => {
            // Arrange
            const tool1 = new MockTool('list_test_1', 'Primeira ferramenta');
            const tool2 = new MockTool('list_test_2', 'Segunda ferramenta');
            const tool3 = new MockTool('list_test_3', 'Terceira ferramenta');

            toolRegistry.register(tool1);
            toolRegistry.register(tool2);
            toolRegistry.register(tool3);

            // Act
            const tools = toolRegistry.listTools();

            // Assert
            expect(tools.length).toBeGreaterThanOrEqual(3);
            const testTools = tools.filter(t => t.name.startsWith('list_test_'));
            expect(testTools).toHaveLength(3);

            const toolNames = testTools.map(t => t.name);
            expect(toolNames).toContain('list_test_1');
            expect(toolNames).toContain('list_test_2');
            expect(toolNames).toContain('list_test_3');
        });

        it('deve retornar array mesmo quando outras ferramentas estão registradas', () => {
            // Act
            const tools = toolRegistry.listTools();

            // Assert
            expect(Array.isArray(tools)).toBe(true);
            expect(tools.length).toBeGreaterThanOrEqual(0);
        });
    });
});
