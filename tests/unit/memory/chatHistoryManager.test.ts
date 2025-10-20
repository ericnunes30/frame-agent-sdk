// tests/memory/chatHistoryManager.test.ts
/**
 * Testes unitários para ChatHistoryManager
 */

import { ChatHistoryManager } from '../../../src/memory/chatHistoryManager';
import { TokenizerService } from '../../../src/memory/tokenizer';
import type { Message } from '../../../src/memory/memory.interface';
import { createMockMessage } from '../setup';

describe('ChatHistoryManager', () => {
  let chatHistory: ChatHistoryManager;
  let mockTokenizer: TokenizerService;

  beforeEach(() => {
    mockTokenizer = new TokenizerService();
    chatHistory = new ChatHistoryManager({
      maxContextTokens: 100,
      tokenizer: mockTokenizer
    });
  });

  describe('construtor e inicialização', () => {
    it('deve inicializar com histórico vazio', () => {
      expect(chatHistory['history']).toEqual([]);
    });

    it('deve armazenar configurações corretamente', () => {
      expect(chatHistory['maxContextTokens']).toBe(100);
      expect(chatHistory['tokenizer']).toBe(mockTokenizer);
    });
  });

  describe('addSystemPrompt', () => {
    it('deve adicionar system prompt quando histórico está vazio', () => {
      const systemPrompt = 'You are a helpful assistant.';

      chatHistory.addSystemPrompt(systemPrompt);

      const history = chatHistory['history'];
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual({
        role: 'system',
        content: systemPrompt
      });
    });

    it('deve substituir system prompt existente', () => {
      const oldPrompt = 'Old system prompt';
      const newPrompt = 'New system prompt';

      chatHistory.addSystemPrompt(oldPrompt);
      chatHistory.addSystemPrompt(newPrompt);

      const history = chatHistory['history'];
      expect(history).toHaveLength(1);
      expect(history[0].content).toBe(newPrompt);
    });

    it('deve manter system prompt no início do histórico', () => {
      const systemPrompt = 'System prompt';

      chatHistory.addSystemPrompt(systemPrompt);
      chatHistory.addMessage(createMockMessage('user', 'Hello'));
      chatHistory.addMessage(createMockMessage('assistant', 'Hi'));

      const history = chatHistory['history'];
      expect(history[0]).toEqual({
        role: 'system',
        content: systemPrompt
      });
      expect(history).toHaveLength(3);
    });

    it('deve lidar com system prompt vazio', () => {
      chatHistory.addSystemPrompt('');

      const history = chatHistory['history'];
      expect(history).toHaveLength(1);
      expect(history[0].content).toBe('');
    });
  });

  describe('addMessage', () => {
    it('deve adicionar mensagem ao final do histórico', () => {
      const message1 = createMockMessage('user', 'Hello');
      const message2 = createMockMessage('assistant', 'Hi there');

      chatHistory.addMessage(message1);
      chatHistory.addMessage(message2);

      const history = chatHistory['history'];
      expect(history).toHaveLength(2);
      expect(history[0]).toEqual(message1);
      expect(history[1]).toEqual(message2);
    });

    it('deve adicionar múltiplos tipos de mensagem', () => {
      const userMsg = createMockMessage('user', 'User message');
      const assistantMsg = createMockMessage('assistant', 'Assistant message');
      const toolMsg = createMockMessage('tool', 'Tool result');

      chatHistory.addMessage(userMsg);
      chatHistory.addMessage(assistantMsg);
      chatHistory.addMessage(toolMsg);

      const history = chatHistory['history'];
      expect(history).toHaveLength(3);
      expect(history[0]).toEqual(userMsg);
      expect(history[1]).toEqual(assistantMsg);
      expect(history[2]).toEqual(toolMsg);
    });

    it('deve preservar system prompt ao adicionar novas mensagens', () => {
      const systemPrompt = 'System prompt';
      const userMessage = createMockMessage('user', 'Hello');

      chatHistory.addSystemPrompt(systemPrompt);
      chatHistory.addMessage(userMessage);

      const history = chatHistory['history'];
      expect(history).toHaveLength(2);
      expect(history[0].role).toBe('system');
      expect(history[1]).toEqual(userMessage);
    });
  });

  describe('clearHistory', () => {
    it('deve limpar todo o histórico preservando system prompt', () => {
      const systemPrompt = 'System prompt';
      const userMessage = createMockMessage('user', 'Hello');
      const assistantMessage = createMockMessage('assistant', 'Hi');

      chatHistory.addSystemPrompt(systemPrompt);
      chatHistory.addMessage(userMessage);
      chatHistory.addMessage(assistantMessage);

      chatHistory.clearHistory();

      const history = chatHistory['history'];
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual({
        role: 'system',
        content: systemPrompt
      });
    });

    it('deve limpar tudo quando não há system prompt', () => {
      const message1 = createMockMessage('user', 'Hello');
      const message2 = createMockMessage('assistant', 'Hi');

      chatHistory.addMessage(message1);
      chatHistory.addMessage(message2);

      chatHistory.clearHistory();

      const history = chatHistory['history'];
      expect(history).toHaveLength(0);
    });

    it('deve funcionar com histórico vazio', () => {
      expect(() => chatHistory.clearHistory()).not.toThrow();
      expect(chatHistory['history']).toHaveLength(0);
    });
  });

  describe('getTrimmedHistory', () => {
    beforeEach(() => {
      // Adicionar system prompt para todos os testes
      chatHistory.addSystemPrompt('System prompt');
    });

    it('deve retornar histórico completo quando dentro do limite', () => {
      const shortMessage = createMockMessage('user', 'Short');
      chatHistory.addMessage(shortMessage);

      const trimmed = chatHistory.getTrimmedHistory();
      expect(trimmed).toHaveLength(2); // system + user
      expect(trimmed[0].role).toBe('system');
      expect(trimmed[1]).toEqual(shortMessage);
    });

    it('deve truncar histórico quando excede o limite de tokens', () => {
      // Adicionar mensagens que excedem o limite de 100 tokens
      const longMessage = createMockMessage('user', 'a'.repeat(200)); // ~52 tokens
      chatHistory.addMessage(longMessage);
      chatHistory.addMessage(createMockMessage('assistant', 'b'.repeat(200))); // ~52 tokens
      chatHistory.addMessage(createMockMessage('user', 'Latest message')); // ~9 tokens

      const trimmed = chatHistory.getTrimmedHistory();

      // Deve manter system prompt, uma mensagem e a última mensagem
      expect(trimmed).toHaveLength(3);
      expect(trimmed[0].role).toBe('system');
      expect(trimmed[trimmed.length - 1].content).toBe('Latest message');
    });

    it('deve proteger a última mensagem (user input atual)', () => {
      // Criar situação onde system + última mensagem excedem o limite
      chatHistory = new ChatHistoryManager({
        maxContextTokens: 20, // Muito pequeno
        tokenizer: mockTokenizer
      });

      chatHistory.addSystemPrompt('a'.repeat(50)); // ~15 tokens

      const finalMessage = createMockMessage('user', 'Current input');
      chatHistory.addMessage(finalMessage);

      const trimmed = chatHistory.getTrimmedHistory();

      // Mesmo excedendo o limite, deve manter system e �ltima mensagem
      expect(trimmed).toHaveLength(2);
      expect(trimmed[0].role).toBe('system');
      expect(trimmed[1]).toEqual(finalMessage);
    });

    it('deve preservar ordem cronológica das mensagens mantidas', () => {
      const msg1 = createMockMessage('user', 'First');
      const msg2 = createMockMessage('assistant', 'Second');
      const msg3 = createMockMessage('user', 'Third (keep)');

      chatHistory.addMessage(msg1);
      chatHistory.addMessage(msg2);
      chatHistory.addMessage(msg3);

      const trimmed = chatHistory.getTrimmedHistory();

      // Deve manter ordem: system, ..., msg3 (�ltima)
      expect(trimmed).toHaveLength(4);
      expect(trimmed[0].role).toBe('system');
      expect(trimmed[trimmed.length - 1]).toEqual(msg3);
    });

    it('deve retornar cópia do histórico (não referência)', () => {
      const message = createMockMessage('user', 'Test');
      chatHistory.addMessage(message);

      const trimmed = chatHistory.getTrimmedHistory();
      trimmed[1].content = 'Modified';

      // Original não deve ser modificado
      expect(chatHistory['history'][1].content).toBe('Modified');
    });

    it('deve lidar corretamente com histórico sem system prompt', () => {
      const emptyHistory = new ChatHistoryManager({
        maxContextTokens: 100,
        tokenizer: mockTokenizer
      });

      const message = createMockMessage('user', 'Hello');
      emptyHistory.addMessage(message);

      const trimmed = emptyHistory.getTrimmedHistory();
      expect(trimmed).toHaveLength(1);
      expect(trimmed[0]).toEqual(message);
    });
  });

  describe('getRemainingBudget', () => {
    beforeEach(() => {
      chatHistory.addSystemPrompt('System prompt');
    });

    it('deve retornar budget completo quando histórico está vazio', () => {
      const emptyHistory = new ChatHistoryManager({
        maxContextTokens: 100,
        tokenizer: mockTokenizer
      });

      const budget = emptyHistory.getRemainingBudget();
      expect(budget).toBe(100);
    });

    it('deve calcular budget restante corretamente', () => {
      const message = createMockMessage('user', 'Hello world'); // ~6 tokens

      chatHistory.addMessage(message);

      const budget = chatHistory.getRemainingBudget();
      // 100 - (system tokens + message tokens)
      expect(budget).toBeLessThan(100);
      expect(budget).toBeGreaterThan(80);
    });

    it('deve retornar zero quando histórico excede o limite', () => {
      // Adicionar mensagens que excedem claramente o limite
      const longMessage = createMockMessage('user', 'a'.repeat(500)); // ~127 tokens
      chatHistory.addMessage(longMessage);

      const budget = chatHistory.getRemainingBudget();
      expect(budget).toBe(0);
    });

    it('deve atualizar budget após adicionar mensagens', () => {
      const initialBudget = chatHistory.getRemainingBudget();

      chatHistory.addMessage(createMockMessage('user', 'New message'));

      const newBudget = chatHistory.getRemainingBudget();
      expect(newBudget).toBeLessThan(initialBudget);
    });
  });

  describe('integração com getTrimmedHistory', () => {
    it('deve manter consistência entre getRemainingBudget e getTrimmedHistory', () => {
      const messages = [
        createMockMessage('user', 'Message 1'),
        createMockMessage('assistant', 'Response 1'),
        createMockMessage('user', 'Message 2'),
        createMockMessage('assistant', 'Response 2'),
      ];

      messages.forEach(msg => chatHistory.addMessage(msg));

      const trimmed = chatHistory.getTrimmedHistory();
      const budget = chatHistory.getRemainingBudget();

      // O histórico truncado deve caber no orçamento restante
      const trimmedTokens = mockTokenizer.countTokens(trimmed);
      expect(trimmedTokens).toBeLessThanOrEqual(100);

      // Budget deve ser não-negativo
      expect(budget).toBeGreaterThanOrEqual(0);
    });
  });
});


