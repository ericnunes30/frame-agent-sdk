// tests/unit/memory/tokenizer.test.ts
import { TokenizerService } from '@/memory/tokenizer';
import { Message } from '@/memory/memory.interface';

describe('TokenizerService', () => {
    let tokenizer: TokenizerService;

    beforeEach(() => {
        tokenizer = new TokenizerService('gpt-4');
    });

    describe('countTokens', () => {
        it('deve contar tokens de string simples', () => {
            // Arrange
            const messages: Message[] = [
                { role: 'user', content: 'Hello world' } // 11 chars + 10 overhead = 21 chars = ~6 tokens
            ];

            // Act
            const tokens = tokenizer.countTokens(messages);

            // Assert
            // 21 chars / 4 chars per token = 5.25, arredondado para cima = 6
            expect(tokens).toBe(6);
        });

        it('deve contar tokens de array de mensagens', () => {
            // Arrange
            const messages: Message[] = [
                { role: 'system', content: 'You are helpful' }, // 15 + 10 = 25 chars
                { role: 'user', content: 'Hello' },            // 5 + 10 = 15 chars
                { role: 'assistant', content: 'Hi there' }     // 8 + 10 = 18 chars
            ];
            // Total: 58 chars / 4 = 14.5 tokens, arredondado para cima = 15

            // Act
            const tokens = tokenizer.countTokens(messages);

            // Assert
            expect(tokens).toBe(15);
        });

        it('deve retornar 0 para array vazio', () => {
            // Arrange
            const messages: Message[] = [];

            // Act
            const tokens = tokenizer.countTokens(messages);

            // Assert
            expect(tokens).toBe(0);
        });

        it('deve calcular tokens corretamente para mensagem vazia', () => {
            // Arrange
            const messages: Message[] = [
                { role: 'user', content: '' } // 0 + 10 = 10 chars = 2.5 tokens, arredondado = 3
            ];

            // Act
            const tokens = tokenizer.countTokens(messages);

            // Assert
            expect(tokens).toBe(3);
        });

        it('deve calcular tokens para mensagens com diferentes tamanhos', () => {
            // Arrange
            const shortMessage = 'Hi';        // 2 + 10 = 12 chars
            const mediumMessage = 'Hello, how are you?'; // 19 + 10 = 29 chars
            const longMessage = 'This is a longer message with more content to test token counting'; // 65 + 10 = 75 chars

            const messages: Message[] = [
                { role: 'user', content: shortMessage },
                { role: 'assistant', content: mediumMessage },
                { role: 'user', content: longMessage }
            ];
            // Total: 116 chars / 4 = 29 tokens (exato)

            // Act
            const tokens = tokenizer.countTokens(messages);

            // Assert
            expect(tokens).toBe(29);
        });

        it('deve lidar com mensagens sem content (undefined)', () => {
            // Arrange
            const messages: Message[] = [
                { role: 'user', content: undefined }  // 0 + 10 = 10 chars
            ];

            // Act
            const tokens = tokenizer.countTokens(messages);

            // Assert
            expect(tokens).toBe(3); // 10 / 4 = 2.5, arredondado = 3
        });

        it('deve calcular tokens corretamente para caracteres especiais', () => {
            // Arrange
            const messages: Message[] = [
                { role: 'user', content: '你好世界 🚀' } // Unicode characters
            ];
            const charCount = '你好世界 🚀'.length + 10;

            // Act
            const tokens = tokenizer.countTokens(messages);

            // Assert
            expect(tokens).toBe(Math.ceil(charCount / 4));
        });
    });
});
