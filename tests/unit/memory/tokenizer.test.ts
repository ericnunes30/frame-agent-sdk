// tests/memory/tokenizer.test.ts
/**
 * Testes unitários para TokenizerService
 */

import { TokenizerService } from '../../../src/memory/tokenizer';
import type { Message } from '../../../src/memory/memory.interface';
import { createMockMessage } from '../setup';

describe('TokenizerService', () => {
  let tokenizer: TokenizerService;

  beforeEach(() => {
    tokenizer = new TokenizerService();
  });

  describe('countTokens', () => {
    it('deve contar tokens corretamente para uma única mensagem', () => {
      const messages: Message[] = [
        createMockMessage('user', 'Hello world')
      ];

      const tokenCount = tokenizer.countTokens(messages);

      // "Hello world" = 11 chars + 10 overhead = 21 chars / 4 = 5.25 => 6 tokens
      expect(tokenCount).toBe(6);
    });

    it('deve contar tokens corretamente para múltiplas mensagens', () => {
      const messages: Message[] = [
        createMockMessage('user', 'Hello'),
        createMockMessage('assistant', 'Hi there! How can I help you?'),
        createMockMessage('user', 'I need help with TypeScript')
      ];

      const tokenCount = tokenizer.countTokens(messages);

      // Cálculo manual:
      // "Hello" = 5 + 10 = 15 chars
      // "Hi there! How can I help you?" = 26 + 10 = 36 chars
      // "I need help with TypeScript" = 25 + 10 = 35 chars
      // Total = 86 chars / 4 = 21.5 => 22 tokens
      expect(tokenCount).toBe(23);
    });

    it('deve lidar com mensagens vazias', () => {
      const messages: Message[] = [
        createMockMessage('user', ''),
        createMockMessage('assistant', '')
      ];

      const tokenCount = tokenizer.countTokens(messages);

      // Mensagens vazias = 0 + 10 overhead cada = 20 chars / 4 = 5 tokens
      expect(tokenCount).toBe(5);
    });

    it('deve lidar com mensagens com conteúdo null/undefined', () => {
      const messages: Message[] = [
        { role: 'user', content: null },
        { role: 'assistant', content: undefined },
        createMockMessage('user', 'test')
      ];

      const tokenCount = tokenizer.countTokens(messages);

      // null/undefined = 0 + 10 overhead cada = 20 chars
      // "test" = 4 + 10 = 14 chars
      // Total = 34 chars / 4 = 8.5 => 9 tokens
      expect(tokenCount).toBe(9);
    });

    it('deve lidar com array vazio de mensagens', () => {
      const messages: Message[] = [];

      const tokenCount = tokenizer.countTokens(messages);

      expect(tokenCount).toBe(0);
    });

    it('deve contar tokens para mensagens longas', () => {
      const longText = 'a'.repeat(1000); // 1000 caracteres
      const messages: Message[] = [
        createMockMessage('user', longText)
      ];

      const tokenCount = tokenizer.countTokens(messages);

      // 1000 chars + 10 overhead = 1010 chars / 4 = 252.5 => 253 tokens
      expect(tokenCount).toBe(253);
    });

    it('deve arredondar para cima corretamente', () => {
      // Testa casos onde a divisão não é exata
      const messages: Message[] = [
        createMockMessage('user', 'abc') // 3 chars + 10 = 13 chars / 4 = 3.25 => 4 tokens
      ];

      const tokenCount = tokenizer.countTokens(messages);

      expect(tokenCount).toBe(4);
    });

    it('deve ignorar o parâmetro model (compatibilidade com interface)', () => {
      const messages: Message[] = [
        createMockMessage('user', 'Hello world')
      ];

      const countTokensAny = (tokenizer.countTokens as any).bind(tokenizer);
      const tokenCount1 = countTokensAny(messages, 'gpt-3.5-turbo');
      const tokenCount2 = countTokensAny(messages, 'gpt-4');

      // Deve ser o mesmo resultado pois o parâmetro model é ignorado
      expect(tokenCount1).toBe(tokenCount2);
    });

    it('deve manter consistência em chamadas repetidas', () => {
      const messages: Message[] = [
        createMockMessage('user', 'Consistent message'),
        createMockMessage('assistant', 'Consistent response')
      ];

      const tokenCount1 = tokenizer.countTokens(messages);
      const tokenCount2 = tokenizer.countTokens(messages);
      const tokenCount3 = tokenizer.countTokens(messages);

      // Todas as chamadas devem retornar o mesmo resultado
      expect(tokenCount1).toBe(tokenCount2);
      expect(tokenCount2).toBe(tokenCount3);
    });
  });

  describe('comportamento com diferentes tipos de conteúdo', () => {
    it('deve lidar com emojis e caracteres especiais', () => {
      const messages: Message[] = [
        createMockMessage('user', 'Hello 🌍! How are you? 🚀')
      ];

      const tokenCount = tokenizer.countTokens(messages);

      // Emojis e caracteres especiais contam como caracteres
      // "Hello 🌍! How are you? 🚀" = 24 chars + 10 = 34 chars / 4 = 8.5 => 9 tokens
      expect(tokenCount).toBe(9);
    });

    it('deve lidar com quebras de linha e espaços', () => {
      const messages: Message[] = [
        createMockMessage('user', 'Line 1\nLine 2\n  Line 3')
      ];

      const tokenCount = tokenizer.countTokens(messages);

      // Quebras de linha e espaços contam como caracteres
      // "Line 1\nLine 2\n  Line 3" = 22 chars + 10 = 32 chars / 4 = 8 => 8 tokens
      expect(tokenCount).toBe(8);
    });

    it('deve lidar com JSON no conteúdo', () => {
      const jsonContent = JSON.stringify({ key: 'value', number: 42 });
      const messages: Message[] = [
        createMockMessage('user', jsonContent)
      ];

      const tokenCount = tokenizer.countTokens(messages);

      // JSON conta como caracteres normais
      expect(tokenCount).toBeGreaterThan(0);
      expect(typeof tokenCount).toBe('number');
    });
  });

  describe('edge cases', () => {
    it('deve lidar com mensagens com apenas espaços', () => {
      const messages: Message[] = [
        createMockMessage('user', '   \n\t   ')  // Espaços, quebra de linha, tab
      ];

      const tokenCount = tokenizer.countTokens(messages);

      // Espaços e whitespace contam como caracteres
      // "   \n\t   " = 7 chars + 10 = 17 chars / 4 = 4.25 => 5 tokens
      expect(tokenCount).toBe(5);
    });

    it('deve lidar com número grande de mensagens curtas', () => {
      const messages: Message[] = Array.from({ length: 100 }, (_, i) =>
        createMockMessage('user', `msg${i}`)
      );

      const tokenCount = tokenizer.countTokens(messages);

      // Soma total: 10 mensagens (14 chars) + 90 mensagens (15 chars)
      // Total chars mensagens = 40 + 450 = 490; overhead = 1000; total = 1490
      // Tokens = ceil(1490 / 4) = 373
      expect(tokenCount).toBe(373);
    });
  });
});
