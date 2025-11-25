// tests/unit/tools/tools/askUserTool.test.ts
import { AskUserTool, AskUserParams } from '@/tools/tools/askUserTool';

describe('AskUserTool', () => {
    let tool: AskUserTool;

    beforeEach(() => {
        tool = new AskUserTool();
    });

    describe('Metadados da ferramenta', () => {
        it('deve ter nome correto', () => {
            expect(tool.name).toBe('ask_user');
        });

        it('deve ter descrição apropriada', () => {
            expect(tool.description).toBe(
                'Pede esclarecimentos ao usuário quando informações adicionais são necessárias para prosseguir.'
            );
        });

        it('deve ter schema de parâmetros definido', () => {
            expect(tool.parameterSchema).toBe(AskUserParams);
        });
    });

    describe('AskUserParams schema', () => {
        it('deve ter propriedades de schema corretas', () => {
            const schema = AskUserParams.schemaProperties;

            expect(schema.question).toEqual({
                type: 'string',
                required: true,
                minLength: 1
            });

            expect(schema.details).toEqual({
                type: 'string',
                required: false,
                minLength: 0
            });
        });
    });

    describe('execute', () => {
        it('deve retornar pergunta simples sem detalhes', async () => {
            // Arrange
            const params: AskUserParams = {
                question: 'Qual é o seu nome?'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result).toEqual({
                type: 'ask_user',
                question: 'Qual é o seu nome?',
                details: undefined
            });
        });

        it('deve retornar pergunta com detalhes', async () => {
            // Arrange
            const params: AskUserParams = {
                question: 'Qual framework você prefere?',
                details: 'Estou considerando React, Vue ou Angular para o projeto.'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result).toEqual({
                type: 'ask_user',
                question: 'Qual framework você prefere?',
                details: 'Estou considerando React, Vue ou Angular para o projeto.'
            });
        });

        it('deve aceitar detalhes vazios', async () => {
            // Arrange
            const params: AskUserParams = {
                question: 'Confirma a operação?',
                details: ''
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result).toEqual({
                type: 'ask_user',
                question: 'Confirma a operação?',
                details: ''
            });
        });

        it('deve lidar com perguntas longas', async () => {
            // Arrange
            const longQuestion = 'Você poderia fornecer mais informações sobre os requisitos do sistema, incluindo tecnologias preferidas, restrições de orçamento e prazo de entrega?';
            const params: AskUserParams = {
                question: longQuestion
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.question).toBe(longQuestion);
        });

        it('deve lidar com detalhes longos', async () => {
            // Arrange
            const longDetails = 'Preciso entender melhor o contexto do projeto para poder sugerir a melhor abordagem. Considere incluir informações sobre a arquitetura atual, dependências existentes e requisitos de performance.';
            const params: AskUserParams = {
                question: 'Pode detalhar os requisitos?',
                details: longDetails
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.details).toBe(longDetails);
        });
    });

    describe('Tipo de retorno', () => {
        it('deve sempre retornar type "ask_user"', async () => {
            // Arrange
            const params: AskUserParams = {
                question: 'Teste?'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.type).toBe('ask_user');
        });
    });

    describe('Casos de uso', () => {
        it('deve solicitar esclarecimento sobre requisitos ambíguos', async () => {
            // Arrange
            const params: AskUserParams = {
                question: 'O sistema deve suportar múltiplos idiomas?',
                details: 'Você mencionou internacionalização, mas não especificou quais idiomas são necessários.'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.type).toBe('ask_user');
            expect(result.question).toContain('múltiplos idiomas');
            expect(result.details).toContain('internacionalização');
        });

        it('deve pedir confirmação de ações críticas', async () => {
            // Arrange
            const params: AskUserParams = {
                question: 'Deseja realmente excluir todos os dados?',
                details: 'Esta ação é irreversível e afetará 1000+ registros.'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.question).toContain('excluir');
            expect(result.details).toContain('irreversível');
        });
    });
});
