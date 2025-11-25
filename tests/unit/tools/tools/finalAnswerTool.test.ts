// tests/unit/tools/tools/finalAnswerTool.test.ts
import { FinalAnswerTool, FinalAnswerParams } from '@/tools/tools/finalAnswerTool';

describe('FinalAnswerTool', () => {
    let tool: FinalAnswerTool;

    beforeEach(() => {
        tool = new FinalAnswerTool();
    });

    describe('Metadados da ferramenta', () => {
        it('deve ter nome correto', () => {
            expect(tool.name).toBe('final_answer');
        });

        it('deve ter descrição apropriada', () => {
            expect(tool.description).toBe(
                'Finaliza o ciclo de execução retornando a resposta final para o usuário.'
            );
        });

        it('deve ter schema de parâmetros definido', () => {
            expect(tool.parameterSchema).toBe(FinalAnswerParams);
        });
    });

    describe('FinalAnswerParams schema', () => {
        it('deve ter propriedades de schema corretas', () => {
            const schema = FinalAnswerParams.schemaProperties;

            expect(schema.answer).toEqual({
                type: 'string',
                required: true,
                minLength: 1
            });
        });
    });

    describe('execute', () => {
        it('deve retornar resposta simples', async () => {
            // Arrange
            const params: FinalAnswerParams = {
                answer: 'A resposta é 42.'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result).toEqual({
                type: 'final_answer',
                answer: 'A resposta é 42.'
            });
        });

        it('deve retornar resposta detalhada', async () => {
            // Arrange
            const detailedAnswer = `
                Após análise completa do código, identifiquei os seguintes problemas:
                
                1. Falta de validação de entrada
                2. Tratamento inadequado de erros
                3. Performance subótima em loops
                
                Recomendo implementar as correções sugeridas.
            `;
            const params: FinalAnswerParams = {
                answer: detailedAnswer
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.answer).toBe(detailedAnswer);
            expect(result.type).toBe('final_answer');
        });

        it('deve lidar com respostas formatadas em markdown', async () => {
            // Arrange
            const markdownAnswer = `
# Análise Completa

## Problemas Encontrados
- **Erro 1**: Validação ausente
- **Erro 2**: Memory leak

## Soluções Propostas
1. Adicionar validação
2. Implementar cleanup

\`\`\`typescript
function validate(input: string): boolean {
    return input.length > 0;
}
\`\`\`
            `;
            const params: FinalAnswerParams = {
                answer: markdownAnswer
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.answer).toContain('# Análise Completa');
            expect(result.answer).toContain('```typescript');
        });

        it('deve aceitar resposta com caracteres especiais', async () => {
            // Arrange
            const params: FinalAnswerParams = {
                answer: 'Resposta: "Olá!" & <teste> | valor = 100%'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.answer).toBe('Resposta: "Olá!" & <teste> | valor = 100%');
        });

        it('deve aceitar resposta com emojis', async () => {
            // Arrange
            const params: FinalAnswerParams = {
                answer: 'Tudo certo! ✅ Projeto aprovado 🎉'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.answer).toContain('✅');
            expect(result.answer).toContain('🎉');
        });

        it('deve aceitar resposta multilinha', async () => {
            // Arrange
            const params: FinalAnswerParams = {
                answer: 'Linha 1\nLinha 2\nLinha 3'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.answer).toBe('Linha 1\nLinha 2\nLinha 3');
        });
    });

    describe('Tipo de retorno', () => {
        it('deve sempre retornar type "final_answer"', async () => {
            // Arrange
            const params: FinalAnswerParams = {
                answer: 'Teste'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.type).toBe('final_answer');
        });
    });

    describe('Casos de uso', () => {
        it('deve retornar resposta de conclusão de tarefa', async () => {
            // Arrange
            const params: FinalAnswerParams = {
                answer: 'Tarefa concluída com sucesso. Todos os testes passaram e o código foi otimizado.'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.answer).toContain('concluída com sucesso');
            expect(result.type).toBe('final_answer');
        });

        it('deve retornar resposta de erro/falha', async () => {
            // Arrange
            const params: FinalAnswerParams = {
                answer: 'Não foi possível completar a tarefa devido a restrições de API.'
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.answer).toContain('Não foi possível');
        });

        it('deve retornar resposta com dados estruturados', async () => {
            // Arrange
            const params: FinalAnswerParams = {
                answer: JSON.stringify({
                    status: 'success',
                    data: { count: 10, items: ['a', 'b', 'c'] }
                }, null, 2)
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.answer).toContain('"status": "success"');
            expect(result.answer).toContain('"count": 10');
        });

        it('deve retornar resposta vazia (edge case)', async () => {
            // Arrange
            // Nota: O schema exige minLength: 1, mas testamos o comportamento
            const params: FinalAnswerParams = {
                answer: ' ' // Espaço único (tecnicamente válido)
            };

            // Act
            const result = await tool.execute(params);

            // Assert
            expect(result.answer).toBe(' ');
            expect(result.type).toBe('final_answer');
        });
    });
});
