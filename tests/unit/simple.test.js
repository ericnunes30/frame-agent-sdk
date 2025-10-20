// tests/simple.test.js
/**
 * Teste simples em JavaScript para verificar configuração do Jest
 */

describe('Configuração do Jest', () => {
  it('deve executar um teste simples', () => {
    expect(1 + 1).toBe(2);
  });

  it('deve funcionar com mocks', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});