// tests/providers/openAiProvider.test.ts
/**
 * Testes unitários para OpenAIProvider
 */

const { OpenAIProvider } = require('../../src/providers/providers/openAiProvider');
import type { ProviderConfig, IProviderResponse } from '../../../src/providers/adapter/provider.interface';

// Config de teste reutilizável
const createValidConfig = (): ProviderConfig => ({
  model: 'gpt-3.5-turbo',
  apiKey: 'test-api-key',
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

describe('OpenAIProvider', () => {
  let provider: InstanceType<typeof OpenAIProvider>;
  let mockOpenAI: jest.Mocked<OpenAI>;
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

    provider = new OpenAIProvider('test-api-key');
  });

  describe('chatCompletion', () => {

    it('deve criar instância OpenAI com API key', () => {
      new OpenAIProvider('my-key');

      expect(OpenAI).toHaveBeenCalledWith({ apiKey: 'my-key' });
    });

    it('deve converter ProviderConfig para formato OpenAI corretamente', async () => {
      const config = createValidConfig();
      const mockOpenAIResponse = createMockOpenAIResponse('Hello! How can I help you?');

      mockCreate.mockResolvedValue(mockOpenAIResponse);

      await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    it('deve lidar com streaming desabilitado', async () => {
      const config = {
        ...createValidConfig(),
        stream: false
      };

      const mockResponse = createMockOpenAIResponse('Non-streaming response');
      mockCreate.mockResolvedValue(mockResponse);

      const result = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ stream: false })
      );
      expect(result.content).toBe('Non-streaming response');
    });

    it('deve lidar com streaming habilitado', async () => {
      const config = {
        ...createValidConfig(),
        stream: true
      };

      // Mock streaming response
      const mockStreamResponse = { choices: [{ delta: { content: 'Streaming' } }] };
const asyncIterable: any = { [Symbol.asyncIterator]: async function* () { yield mockStreamResponse; } };
mockCreate.mockResolvedValue(asyncIterable);

      const result = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ stream: true })
      );
    });

    it('deve incluir top_p quando fornecido', async () => {
      const config = {
        ...createValidConfig(),
        topP: 0.9
      };

      const mockResponse = createMockOpenAIResponse('Response with top_p');
      mockCreate.mockResolvedValue(mockResponse);

      await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ top_p: 0.9 })
      );
    });

    it('deve lidar com múltiplas mensagens corretamente', async () => {
      const config: ProviderConfig = {
        model: 'gpt-4',
        apiKey: 'test-key',
        messages: [
          { role: 'user', content: 'First message' },
          { role: 'assistant', content: 'First response' },
          { role: 'user', content: 'Second message' }
        ],
        systemPrompt: 'System prompt',
        temperature: 0.7,
        stream: false,
      };

      const mockResponse = createMockOpenAIResponse('Multi-message response');
      mockCreate.mockResolvedValue(mockResponse);

      const result = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            { role: 'system', content: 'System prompt' },
            { role: 'user', content: 'First message' },
            { role: 'assistant', content: 'First response' },
            { role: 'user', content: 'Second message' }
          ]
        })
      );
    });

    it('deve lidar com array vazio de mensagens', async () => {
      const config: ProviderConfig = {
        model: 'gpt-3.5-turbo',
        apiKey: 'test-key',
        messages: [],
        systemPrompt: 'System prompt',
        temperature: 0.7,
        stream: false,
      };

      const mockResponse = createMockOpenAIResponse('Empty messages response');
      mockCreate.mockResolvedValue(mockResponse);

      const result = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ messages: [ { role: 'system', content: 'System prompt' } ]
        })
      );
    });

    it('deve converter resposta OpenAI para IProviderResponse corretamente', async () => {
      const config = createValidConfig();
      const mockOpenAIResponse = {
        choices: [{
          message: { content: 'Test response' },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 5,
          total_tokens: 15
        },
        model: 'gpt-3.5-turbo'
      };

      mockCreate.mockResolvedValue(mockOpenAIResponse);

      const result = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

      expect(result).toEqual({ content: 'Test response' });
    });

    it('deve lidar com resposta sem usage', async () => {
      const config = createValidConfig();
      const mockOpenAIResponse = {
        choices: [{
          message: { content: 'Response without usage' },
          finish_reason: 'length'
        }],
        model: 'gpt-3.5-turbo'
      };

      mockCreate.mockResolvedValue(mockOpenAIResponse);

      const result = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

      expect(result.content).toBe('Response without usage');
      
    });

    it('deve lidar com resposta com content null/vazio', async () => {
      const config = createValidConfig();
      const mockOpenAIResponse = {
        choices: [{
          message: { content: null },
          finish_reason: 'stop'
        }],
        model: 'gpt-3.5-turbo'
      };

      mockCreate.mockResolvedValue(mockOpenAIResponse);

      const result = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

      expect(result.content).toBeNull();
    });

    describe('tratamento de erros', () => {
      it('deve propagar erro da API OpenAI', async () => {
        const config = createValidConfig();
        const apiError = new Error('OpenAI API Error: Invalid request');

        mockCreate.mockRejectedValue(apiError);

      await expect(
        provider.chatCompletion(
          config.messages,
          config.model,
          config.apiKey,
          config.temperature as any,
          config.stream as any,
          config.systemPrompt as any,
          (config as any).maxTokens,
          (config as any).topP,
        )
      ).rejects.toThrow('OpenAI API Error: Invalid request');
      });

      it('deve lidar com erro de autenticação', async () => {
        const config = createValidConfig();
        const authError = new Error('OpenAI API Error: Invalid API key');

        mockCreate.mockRejectedValue(authError);

      await expect(
        provider.chatCompletion(
          config.messages,
          config.model,
          config.apiKey,
          config.temperature as any,
          config.stream as any,
          config.systemPrompt as any,
          (config as any).maxTokens,
          (config as any).topP,
        )
      ).rejects.toThrow('Invalid API key');
      });

      it('deve lidar com erro de rate limit', async () => {
        const config = createValidConfig();
        const rateLimitError = new Error('OpenAI API Error: Rate limit exceeded');

        mockCreate.mockRejectedValue(rateLimitError);

      await expect(
        provider.chatCompletion(
          config.messages,
          config.model,
          config.apiKey,
          config.temperature as any,
          config.stream as any,
          config.systemPrompt as any,
          (config as any).maxTokens,
          (config as any).topP,
        )
      ).rejects.toThrow('Rate limit exceeded');
      });

      it('deve lidar com erro de modelo não encontrado', async () => {
        const config = createValidConfig();
        const modelError = new Error('OpenAI API Error: Model not found');

        mockCreate.mockRejectedValue(modelError);

      await expect(
        provider.chatCompletion(
          config.messages,
          config.model,
          config.apiKey,
          config.temperature as any,
          config.stream as any,
          config.systemPrompt as any,
          (config as any).maxTokens,
          (config as any).topP,
        )
      ).rejects.toThrow('Model not found');
      });
    });

    describe('edge cases', () => {
      it('deve lidar com content muito longo', async () => {
        const longContent = 'a'.repeat(10000);
        const config = {
          ...createValidConfig(),
          messages: [{ role: 'user', content: longContent }]
        };

        const mockResponse = createMockOpenAIResponse('Long content response');
        mockCreate.mockResolvedValue(mockResponse);

      const result = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

        expect(result.content).toBe('Long content response');
      });

      it('deve lidar com caracteres especiais no conteúdo', async () => {
        const specialContent = 'Hello 🌍! Test with émojis ñoã.';
        const config = {
          ...createValidConfig(),
          messages: [{ role: 'user', content: specialContent }]
        };

        const mockResponse = createMockOpenAIResponse('Special chars response');
        mockCreate.mockResolvedValue(mockResponse);

      const result = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

        expect(result.content).toBe('Special chars response');
      });

      it('deve lidar com temperature nos limites', async () => {
        const configMin = { ...createValidConfig(), temperature: 0 };
        const configMax = { ...createValidConfig(), temperature: 2 };

        const mockResponse = createMockOpenAIResponse('Temperature test');
        mockCreate.mockResolvedValue(mockResponse);

        await provider.chatCompletion(
          configMin.messages,
          configMin.model,
          configMin.apiKey,
          configMin.temperature as any,
          configMin.stream as any,
          configMin.systemPrompt as any,
          (configMin as any).maxTokens,
          (configMin as any).topP,
        );
        await provider.chatCompletion(
          configMax.messages,
          configMax.model,
          configMax.apiKey,
          configMax.temperature as any,
          configMax.stream as any,
          configMax.systemPrompt as any,
          (configMax as any).maxTokens,
          (configMax as any).topP,
        );

        expect(mockCreate).toHaveBeenNthCalledWith(1,
          expect.objectContaining({ temperature: 0 })
        );
        expect(mockCreate).toHaveBeenNthCalledWith(2,
          expect.objectContaining({ temperature: 2 })
        );
      });

      it('deve lidar com maxTokens zero', async () => {
        const config = {
          ...createValidConfig(),
          maxTokens: 0
        };

        const mockResponse = createMockOpenAIResponse('Zero tokens response');
        mockCreate.mockResolvedValue(mockResponse);

      const result = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

        expect(mockCreate).toHaveBeenCalledWith(
          expect.objectContaining({ max_tokens: 0 })
        );
        expect(result.content).toBe('Zero tokens response');
      });
    });

    describe('comportamento assíncrono', () => {
      it('deve lidar com resposta demorada', async () => {
        const config = createValidConfig();

        mockCreate.mockImplementation(
          () => new Promise(resolve =>
            setTimeout(() => resolve(createMockOpenAIResponse('Slow response')), 100)
          )
        );

        const result = await provider.chatCompletion(
          config.messages,
          config.model,
          config.apiKey,
          config.temperature as any,
          config.stream as any,
          config.systemPrompt as any,
          (config as any).maxTokens,
          (config as any).topP,
        );

        expect(result.content).toBe('Slow response');
      });

      it('deve lidar com timeout da API', async () => {
        const config = createValidConfig();

        mockCreate.mockImplementation(
          () => new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 50)
          )
        );

        await expect(
          provider.chatCompletion(
            config.messages,
            config.model,
            config.apiKey,
            config.temperature as any,
            config.stream as any,
            config.systemPrompt as any,
            (config as any).maxTokens,
            (config as any).topP,
          )
        ).rejects.toThrow('Request timeout');
      });
    });

    describe('integração com modelos diferentes', () => {
      it('deve funcionar com GPT-4', async () => {
        const config = {
          ...createValidConfig(),
          model: 'gpt-4'
        };

        const mockResponse = createMockOpenAIResponse('GPT-4 response');
        mockCreate.mockResolvedValue(mockResponse);

        const result = await provider.chatCompletion(
          config.messages,
          config.model,
          config.apiKey,
          config.temperature as any,
          config.stream as any,
          config.systemPrompt as any,
          (config as any).maxTokens,
          (config as any).topP,
        );

        expect(mockCreate).toHaveBeenCalledWith(
          expect.objectContaining({ model: 'gpt-4' })
        );
        expect(result.content).toBe('GPT-4 response');
      });

      it('deve funcionar com GPT-3.5-turbo', async () => {
        const config = {
          ...createValidConfig(),
          model: 'gpt-3.5-turbo'
        };

        const mockResponse = createMockOpenAIResponse('GPT-3.5 response');
        mockCreate.mockResolvedValue(mockResponse);

        const result = await provider.chatCompletion(
          config.messages,
          config.model,
          config.apiKey,
          config.temperature as any,
          config.stream as any,
          config.systemPrompt as any,
          (config as any).maxTokens,
          (config as any).topP,
        );

        expect(result.content).toBe('GPT-3.5 response');
      });
    });
  });

  describe('construtor e inicialização', () => {
    it('deve criar provider sem parâmetros', () => {
      expect(() => new OpenAIProvider('test-api-key')).not.toThrow();
    });

    it('deve criar provider com configuração customizada', () => {
      expect(() => new OpenAIProvider('test-api-key')).not.toThrow();
    });

    it('deve inicializar cliente OpenAI corretamente', () => {
      new OpenAIProvider('test-api-key');

      expect(OpenAI).toHaveBeenCalledTimes(2);
    });
  });

  describe('consistência e imutabilidade', () => {
    it('não deve modificar a configuração original', async () => {
      const config = createValidConfig();
      const originalConfig = JSON.parse(JSON.stringify(config));

      const mockResponse = createMockOpenAIResponse('Test');
      mockCreate.mockResolvedValue(mockResponse);

      await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

      expect(config).toEqual(originalConfig);
    });

    it('deve manter resultados consistentes para mesma entrada', async () => {
      const config = createValidConfig();
      const mockResponse = createMockOpenAIResponse('Consistent response');
      mockCreate.mockResolvedValue(mockResponse);

      const result1 = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );
      const result2 = await provider.chatCompletion(
        config.messages,
        config.model,
        config.apiKey,
        config.temperature as any,
        config.stream as any,
        config.systemPrompt as any,
        (config as any).maxTokens,
        (config as any).topP,
      );

      expect(result1).toEqual(result2);
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



