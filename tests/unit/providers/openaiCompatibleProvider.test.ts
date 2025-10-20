// tests/providers/openaiCompatibleProvider.test.ts
/**
 * Testes unitários para OpenAICompatibleProvider
 */

const { OpenAICompatibleProvider } = require('../../../src/providers/providers/openaiCompatibleProvider');
import type { ProviderConfig, IProviderResponse } from '../../../src/providers/adapter/provider.interface';

// Config de teste reutilizável
const createValidConfig = (): ProviderConfig => ({
  model: 'gpt-3.5-turbo',
  apiKey: 'test-api-key',
  baseUrl: 'https://api.openai.com/v1',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, world!' }
  ],
  systemPrompt: 'You are a helpful assistant.',
  temperature: 0.7,
  maxTokens: 1000,
  stream: false,
});

// Mock do módulo OpenAI
jest.mock('openai', () => {
  const MockOpenAI = jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }));
  return { __esModule: true, default: MockOpenAI, OpenAI: MockOpenAI };
});

import { OpenAI } from 'openai';

describe('OpenAICompatibleProvider', () => {
  let provider: InstanceType<typeof OpenAICompatibleProvider>;
  let mockOpenAI: any;
  let mockCreate: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup do mock do OpenAI
    mockCreate = jest.fn();
    mockOpenAI = {
      chat: {
        completions: {
          create: mockCreate
        }
      }
    } as any;

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI);

    provider = new OpenAICompatibleProvider('test-api-key');
  });

  describe('chatCompletion', () => {
    it('deve criar instância OpenAI com API key', () => {
      new OpenAICompatibleProvider('my-key');
      expect(OpenAI).toHaveBeenCalledWith({ apiKey: 'my-key' });
    });

    it('deve aceitar ProviderConfig e retornar resposta (não-stream)', async () => {
      const config = createValidConfig();
      const mockResponse = createMockOpenAIResponse('Non-stream response');
      mockCreate.mockResolvedValue(mockResponse);

      const result: IProviderResponse = await provider.chatCompletion(config);
      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ stream: false }));
      expect(result.content).toBe('Non-stream response');
    });

    it('deve lidar com streaming habilitado', async () => {
      const config: ProviderConfig = { ...createValidConfig(), stream: true };

      const mockStreamChunk = { choices: [{ delta: { content: 'Hello ' } }] };
      const mockStreamChunk2 = { choices: [{ delta: { content: 'World' } }] };
      const asyncIterable: any = { [Symbol.asyncIterator]: async function* () { yield mockStreamChunk; yield mockStreamChunk2; } };
      mockCreate.mockResolvedValue(asyncIterable);

      const result = await provider.chatCompletion(config);
      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ stream: true }));
      expect(result.content).toBe('Hello World');
    });
  });

  describe('validação', () => {
    it('deve exigir baseUrl para openaiCompatible', async () => {
      const config: ProviderConfig = { ...createValidConfig(), baseUrl: undefined as any };
      await expect(provider.chatCompletion(config)).rejects.toThrow(/baseUrl/i);
    });
  });

  describe('consistência e imutabilidade', () => {
    it('não deve modificar a configuração original', async () => {
      const config = createValidConfig();
      const originalConfig = JSON.parse(JSON.stringify(config));

      const mockResponse = createMockOpenAIResponse('Test');
      mockCreate.mockResolvedValue(mockResponse);

      await provider.chatCompletion(config);
      expect(config).toEqual(originalConfig);
    });
  });
});

// Helper function para criar mock response da OpenAI
function createMockOpenAIResponse(content: string, usage?: any) {
  return {
    choices: [{
      message: { content },
      finish_reason: 'stop'
    }],
    usage: usage || {
      prompt_tokens: 10,
      completion_tokens: 5,
      total_tokens: 15
    },
    model: 'gpt-3.5-turbo'
  };
}

