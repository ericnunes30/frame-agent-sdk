// tests/memory/tokenizer.simple.test.ts
/**
 * Teste simples do TokenizerService para verificar configuração
 */

import { TokenizerService } from '../../../src/memory/tokenizer';

describe('TokenizerService (Simple)', () => {
  it('deve criar instância', () => {
    const tokenizer = new TokenizerService();
    expect(tokenizer).toBeDefined();
  });

  it('deve contar tokens para mensagem simples', () => {
    const tokenizer = new TokenizerService();
    const messages = [{ role: 'user', content: 'Hello world' }];
    const count = tokenizer.countTokens(messages);
    expect(count).toBeGreaterThan(0);
  });
});