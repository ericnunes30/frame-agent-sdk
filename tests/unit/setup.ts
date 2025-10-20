// tests/setup.ts
/**
 * Setup global para todos os testes
 */

// Configuração do timeout para testes assíncronos
jest.setTimeout(10000);

// Mock para console.log para não poluir o output dos testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock para process.env (útil para testes com variáveis de ambiente)
const originalEnv = { ...process.env };

beforeEach(() => {
  // Restaura o process.env antes de cada teste
  process.env = { ...originalEnv };
});

afterEach(() => {
  // Limpa todos os mocks após cada teste
  jest.clearAllMocks();
});

// Helpers globais para testes
export const createMockMessage = (role: string, content: string) => ({
  role,
  content,
});

export const createMockLLMResponse = (content: string, metadata?: any) => ({
  content,
  metadata: metadata || {},
});

export const createMockToolCall = (toolName: string, params: any) => ({
  toolName,
  params,
});

// Mock para respostas de API OpenAI
export const createMockOpenAIResponse = (content: string, usage?: any) => ({
  choices: [{
    message: { content },
    finish_reason: 'stop'
  }],
  usage: usage || {
    prompt_tokens: 10,
    completion_tokens: 5,
    total_tokens: 15
  }
});

// Função utilitária para esperar async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));