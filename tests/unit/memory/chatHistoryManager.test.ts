// tests/unit/memory/chatHistoryManager.test.ts
import { ChatHistoryManager } from '@/memory/chatHistoryManager';
import { ITokenizerService, Message } from '@/memory/memory.interface';

// Mock do Tokenizer
const mockTokenizer: jest.Mocked<ITokenizerService> = {
    countTokens: jest.fn()
};

describe('ChatHistoryManager', () => {
    let chatHistory: ChatHistoryManager;
    const maxContextTokens = 100;

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset default mock implementation
        mockTokenizer.countTokens.mockReturnValue(10);

        chatHistory = new ChatHistoryManager({
            maxContextTokens,
            tokenizer: mockTokenizer
        });
    });

    describe('addSystemPrompt', () => {
        it('deve adicionar system prompt como primeira mensagem', () => {
            // Act
            chatHistory.addSystemPrompt('System instruction');
            const history = chatHistory.getTrimmedHistory();

            // Assert
            expect(history).toHaveLength(1);
            expect(history[0].role).toBe('system');
            expect(history[0].content).toBe('System instruction');
        });

        it('deve substituir system prompt existente', () => {
            // Arrange
            chatHistory.addSystemPrompt('Old instruction');
            chatHistory.addMessage({ role: 'user', content: 'Hi' });

            // Act
            chatHistory.addSystemPrompt('New instruction');
            const history = chatHistory.getTrimmedHistory();

            // Assert
            expect(history).toHaveLength(2);
            expect(history[0].content).toBe('New instruction');
            expect(history[1].content).toBe('Hi');
        });

        it('deve adicionar no início mesmo se já houver mensagens (sem system prompt)', () => {
            // Arrange
            chatHistory.addMessage({ role: 'user', content: 'Hi' });

            // Act
            chatHistory.addSystemPrompt('System instruction');
            const history = chatHistory.getTrimmedHistory();

            // Assert
            expect(history).toHaveLength(2);
            expect(history[0].role).toBe('system');
            expect(history[1].role).toBe('user');
        });
    });

    describe('addMessage', () => {
        it('deve adicionar mensagens ao histórico', () => {
            // Act
            chatHistory.addMessage({ role: 'user', content: 'Hello' });
            chatHistory.addMessage({ role: 'assistant', content: 'Hi' });
            const history = chatHistory.getTrimmedHistory();

            // Assert
            expect(history).toHaveLength(2);
            expect(history[0].role).toBe('user');
            expect(history[1].role).toBe('assistant');
        });
    });

    describe('clearHistory', () => {
        it('deve limpar histórico preservando system prompt', () => {
            // Arrange
            chatHistory.addSystemPrompt('System');
            chatHistory.addMessage({ role: 'user', content: 'User' });

            // Act
            chatHistory.clearHistory();
            const history = chatHistory.getTrimmedHistory();

            // Assert
            expect(history).toHaveLength(1);
            expect(history[0].role).toBe('system');
        });

        it('deve limpar tudo se não houver system prompt', () => {
            // Arrange
            chatHistory.addMessage({ role: 'user', content: 'User' });

            // Act
            chatHistory.clearHistory();
            const history = chatHistory.getTrimmedHistory();

            // Assert
            expect(history).toHaveLength(0);
        });
    });

    describe('getTrimmedHistory', () => {
        it('deve retornar histórico completo se dentro do orçamento', () => {
            // Arrange
            mockTokenizer.countTokens.mockReturnValue(50); // < 100
            chatHistory.addMessage({ role: 'user', content: 'Hi' });

            // Act
            const history = chatHistory.getTrimmedHistory();

            // Assert
            expect(history).toHaveLength(1);
        });

        it('deve aplicar truncamento baseado em tokens', () => {
            // Arrange
            // Configurar mock para retornar valor alto inicialmente, depois baixo
            mockTokenizer.countTokens
                .mockReturnValueOnce(150) // Total inicial > 100
                .mockReturnValueOnce(120) // Ainda > 100 após remover msg 1
                .mockReturnValue(90);     // OK após remover msg 2

            chatHistory.addSystemPrompt('System'); // Index 0 (Protected)
            chatHistory.addMessage({ role: 'user', content: 'Msg 1' }); // Index 1 (Removable)
            chatHistory.addMessage({ role: 'assistant', content: 'Msg 2' }); // Index 2 (Removable)
            chatHistory.addMessage({ role: 'user', content: 'Last' }); // Index 3 (Protected)

            // Act
            const history = chatHistory.getTrimmedHistory();

            // Assert
            // Deve ter removido Msg 1 e Msg 2 para caber
            // Mas espere, a lógica remove um por um.
            // 1. Check total: 150 > 100. Remove index 1 (Msg 1).
            // 2. Check total: 120 > 100. Remove index 1 (agora Msg 2).
            // 3. Check total: 90 <= 100. Stop.
            // Result: System, Last.

            expect(history).toHaveLength(2);
            expect(history[0].role).toBe('system');
            expect(history[1].role).toBe('user');
            expect(history[1].content).toBe('Last');
        });

        it('deve preservar system prompt e última mensagem durante truncamento', () => {
            // Arrange
            mockTokenizer.countTokens.mockReturnValue(200); // Sempre > 100

            chatHistory.addSystemPrompt('System');
            chatHistory.addMessage({ role: 'user', content: 'Msg 1' });
            chatHistory.addMessage({ role: 'user', content: 'Last' });

            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            // Act
            const history = chatHistory.getTrimmedHistory();

            // Assert
            // Deve remover Msg 1.
            // Sobram System e Last.
            // Loop tenta remover index 1 (Last).
            // Mas index 1 == lastProtectedIndex (1).
            // Guard clause deve impedir remoção e break.

            expect(history).toHaveLength(2);
            expect(history[0].role).toBe('system');
            expect(history[1].content).toBe('Last');
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('ALERTA DE CONTEXTO'),
                'ChatHistoryManager'
            );

            consoleWarnSpy.mockRestore();
        });

        it('não deve truncar se tiver poucas mensagens', () => {
            // Arrange
            chatHistory.addSystemPrompt('System');
            chatHistory.addMessage({ role: 'user', content: 'Hi' });
            // Total 2 msgs.

            // Act
            const history = chatHistory.getTrimmedHistory();

            // Assert
            expect(history).toHaveLength(2);
            expect(mockTokenizer.countTokens).not.toHaveBeenCalled(); // Otimização early return
        });
    });

    describe('getRemainingBudget', () => {
        it('deve calcular orçamento restante', () => {
            // Arrange
            mockTokenizer.countTokens.mockReturnValue(30);
            // Max 100

            // Act
            const remaining = chatHistory.getRemainingBudget();

            // Assert
            expect(remaining).toBe(70);
        });

        it('deve retornar 0 se estourar o orçamento', () => {
            // Arrange
            mockTokenizer.countTokens.mockReturnValue(150);

            // Act
            const remaining = chatHistory.getRemainingBudget();

            // Assert
            expect(remaining).toBe(0);
        });
    });
});
