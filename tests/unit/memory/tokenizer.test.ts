import { getEncoding } from 'js-tiktoken';
import { TokenizerService } from '@/memory/tokenizer';
import type { Message } from '@/memory/memory.interface';
import { extractText } from '@/memory/utils/messageContentUtils';

function expectedTokensWithTiktoken(messages: Message[]): number {
  const encoding = getEncoding('cl100k_base');
  let total = 0;

  for (const message of messages) {
    const contentText = message.content ? extractText(message.content) : '';
    const contentTokens = contentText ? encoding.encode(contentText).length : 0;
    const roleTokens = message.role ? encoding.encode(message.role).length : 0;
    const idTokens = message.id ? encoding.encode(message.id).length : 0;
    const structuralOverhead = 4;
    total += contentTokens + roleTokens + idTokens + structuralOverhead;
  }

  return total;
}

function expectedTokensWithCharacters(messages: Message[]): number {
  const CHARS_PER_TOKEN = 4;
  const FIXED_CHAR_OVERHEAD_PER_MESSAGE = 15;
  const totalChars = messages.reduce((acc, message) => {
    const contentChars = message.content ? extractText(message.content).length : 0;
    const roleChars = message.role?.length ?? 0;
    const idChars = message.id?.length ?? 0;
    return acc + contentChars + roleChars + idChars + FIXED_CHAR_OVERHEAD_PER_MESSAGE;
  }, 0);
  return Math.ceil(totalChars / CHARS_PER_TOKEN);
}

function expectTokenizerToMatchImplementation(tokens: number, messages: Message[]): void {
  try {
    expect(tokens).toBe(expectedTokensWithTiktoken(messages));
  } catch {
    expect(tokens).toBe(expectedTokensWithCharacters(messages));
  }
}

describe('TokenizerService', () => {
  let tokenizer: TokenizerService;

  beforeEach(() => {
    tokenizer = new TokenizerService('gpt-4');
  });

  describe('countTokens', () => {
    it('deve retornar 0 para array vazio', () => {
      expect(tokenizer.countTokens([])).toBe(0);
    });

    it('deve contar tokens de texto (deterministico)', () => {
      const messages: Message[] = [{ role: 'user', content: 'Hello world' }];
      const tokens = tokenizer.countTokens(messages);
      expectTokenizerToMatchImplementation(tokens, messages);
    });

    it('deve suportar conteudo multimodal (conta apenas texto)', () => {
      const messages: Message[] = [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'hello' },
            { type: 'image_url', image_url: { url: 'data:image/png;base64,AAAA' } },
          ],
        },
      ];
      const tokens = tokenizer.countTokens(messages);
      expectTokenizerToMatchImplementation(tokens, messages);
    });

    it('deve lidar com mensagens sem content (undefined)', () => {
      const messages: Message[] = [{ role: 'user', content: undefined as any }];
      const tokens = tokenizer.countTokens(messages);
      expectTokenizerToMatchImplementation(tokens, messages);
    });
  });
});

