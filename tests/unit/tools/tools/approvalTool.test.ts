// tests/unit/tools/tools/approvalTool.test.ts
import { ApprovalTool, ApprovalParams } from '@/tools/tools/approvalTool';

describe('ApprovalTool', () => {
    let tool: ApprovalTool;

    beforeEach(() => {
        tool = new ApprovalTool();
    });

    describe('Metadados da ferramenta', () => {
        it('deve ter nome correto', () => {
            expect(tool.name).toBe('approval');
        });

        it('deve ter descrição apropriada', () => {
            expect(tool.description).toBe(
                'Aprova ou rejeita soluções com feedback detalhado e sugestões de melhoria.'
            );
        });

        it('deve ter schema de parâmetros definido', () => {
            expect(tool.parameterSchema).toBe(ApprovalParams);
        });
    });

    describe('ApprovalParams schema', () => {
        it('deve ter propriedades de schema corretas', () => {
            const schema = ApprovalParams.schemaProperties;

            expect(schema.approved).toEqual({
                type: 'boolean',
                required: true
            });

            expect(schema.feedback).toEqual({
                type: 'string',
                required: true,
                minLength: 1
            });

            expect(schema.suggestions).toEqual({
                type: 'array',
                required: false,
                items: { type: 'string' }
            });
        });
    });

    describe('execute', () => {
        it('deve retornar aprovação com feedback', async () => {
            // Arrange
            const params: ApprovalParams = {
                approved: true,
                feedback: 'Excelente trabalho!'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result).toEqual({
                type: 'approval',
                approved: true,
                feedback: 'Excelente trabalho!',
                suggestions: undefined
            });
        });

        it('deve retornar rejeição com feedback', async () => {
            // Arrange
            const params: ApprovalParams = {
                approved: false,
                feedback: 'Precisa de melhorias'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result).toEqual({
                type: 'approval',
                approved: false,
                feedback: 'Precisa de melhorias',
                suggestions: undefined
            });
        });

        it('deve incluir sugestões quando fornecidas', async () => {
            // Arrange
            const params: ApprovalParams = {
                approved: false,
                feedback: 'Código precisa de refatoração',
                suggestions: [
                    'Adicionar tratamento de erros',
                    'Melhorar nomenclatura de variáveis',
                    'Adicionar testes unitários'
                ]
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result).toEqual({
                type: 'approval',
                approved: false,
                feedback: 'Código precisa de refatoração',
                suggestions: [
                    'Adicionar tratamento de erros',
                    'Melhorar nomenclatura de variáveis',
                    'Adicionar testes unitários'
                ]
            });
        });

        it('deve aceitar array vazio de sugestões', async () => {
            // Arrange
            const params: ApprovalParams = {
                approved: true,
                feedback: 'Aprovado',
                suggestions: []
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.suggestions).toEqual([]);
        });
    });

    describe('Tipo de retorno', () => {
        it('deve sempre retornar type "approval"', async () => {
            // Arrange
            const params: ApprovalParams = {
                approved: true,
                feedback: 'OK'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.type).toBe('approval');
        });
    });
});
