// tests/providers/providerAdapter.test.ts
/**
 * Testes unitários para ProviderAdapter
 */

import { ProviderAdapter } from '../../../src/providers/adapter/providerAdapter';
import type { ProviderConfig, IProviderResponse } from '../../../src/providers/adapter/provider.interface';
import { createMockOpenAIResponse } from '../setup';

// Mock do OpenAIProvider
jest.mock('../../src/providers/providers/openAiProvider');
import { OpenAIProvider } from '../../../src/providers/providers/openAiProvider';
const MockOpenAIProvider = OpenAIProvider as jest.MockedClass<typeof OpenAIProvider>;

describe('ProviderAdapter', () => {
  // Helper disponível fora do escopo interno
  const createValidConfig = (): ProviderConfig => ({
    model: 'openai-gpt-3.5-turbo',
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
  let providerAdapter: typeof ProviderAdapter;
  let mockOpenAIProvider: jest.Mocked<OpenAIProvider>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock do OpenAIProvider
    mockOpenAIProvider = {
      chatCompletion: jest.fn(),
    } as any;

    MockOpenAIProvider.mockImplementation(() => mockOpenAIProvider);

    providerAdapter = ProviderAdapter;
  });

  describe('chatCompletion', () => {
    const createValidConfig = (): ProviderConfig => ({
      model: 'openai-gpt-3.5-turbo',
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

    it('deve invocar chatCompletion do provider OpenAI com config válida', async () => {
      const config = createValidConfig();
      const mockResponse: IProviderResponse = {
        role: 'assistant',
        content: 'Hello! How can I help you today?',
        metadata: { model: 'gpt-3.5-turbo', usage: { total_tokens: 25 } }
      };

      mockOpenAIProvider.chatCompletion.mockResolvedValue(mockResponse);

      const result = await providerAdapter.chatCompletion(config);

      expect(mockOpenAIProvider.chatCompletion).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('deve lidar com streaming quando configurado', async () => {
      const config = {
        ...createValidConfig(),
        stream: true
      };

      const mockStreamResponse: IProviderResponse = {
        role: 'assistant',
        content: 'Streaming response...',
        metadata: { streamed: true }
      };

      mockOpenAIProvider.chatCompletion.mockResolvedValue(mockStreamResponse);

      const result = await providerAdapter.chatCompletion(config);

      expect(mockOpenAIProvider.chatCompletion).toHaveBeenCalled();
      expect(result.metadata?.streamed).toBe(true);
    });

    it('deve propagar erros do provider', async () => {
      const config = createValidConfig();
      const mockError = new Error('API Error: Invalid API key');

      mockOpenAIProvider.chatCompletion.mockRejectedValue(mockError);

      await expect(providerAdapter.chatCompletion(config)).rejects.toThrow('API Error: Invalid API key');
    });

    it('deve lidar com resposta vazia do provider', async () => {
      const config = createValidConfig();
      const mockEmptyResponse: IProviderResponse = {
        role: 'assistant',
        content: null,
        metadata: {}
      };

      mockOpenAIProvider.chatCompletion.mockResolvedValue(mockEmptyResponse);

      const result = await providerAdapter.chatCompletion(config);

      expect(result.content).toBeNull();
      expect(result.metadata).toEqual({});
    });

    it('deve lidar com metadata opcional', async () => {
      const config = createValidConfig();
      const mockResponse: IProviderResponse = {
        role: 'assistant',
        content: 'Response without metadata'
      };

      mockOpenAIProvider.chatCompletion.mockResolvedValue(mockResponse);

      const result = await providerAdapter.chatCompletion(config);

      expect(result.content).toBe('Response without metadata');
      expect(result.metadata).toBeUndefined();
    });

    it('deve manter todos os parâmetros da configuração', async () => {
      const config: ProviderConfig = {
        model: 'gpt-4',
        apiKey: 'test-key',
        messages: [
          { role: 'user', content: 'Test message' }
        ],
        systemPrompt: 'Test prompt',
        temperature: 0.5,
        topP: 0.9,
        maxTokens: 500,
        stream: false,
      };

      const mockResponse: IProviderResponse = {
        role: 'assistant',
        content: 'Test response',
        metadata: { model: 'gpt-4' }
      };

      mockOpenAIProvider.chatCompletion.mockResolvedValue(mockResponse);

      await providerAdapter.chatCompletion(config);

      expect(mockOpenAIProvider.chatCompletion).toHaveBeenCalledWith(config);
    });

    describe('validação de configuração', () => {
      it('deve aceitar configuração mínima válida', async () => {
        const minimalConfig: ProviderConfig = {
          model: 'openai-gpt-3.5-turbo',
          apiKey: 'test-key',
          messages: [{ role: 'user', content: 'Hello' }],
          systemPrompt: 'System prompt',
          temperature: 0.7,
          stream: false,
        };

        const mockResponse: IProviderResponse = {
          role: 'assistant',
          content: 'Response'
        };

        mockOpenAIProvider.chatCompletion.mockResolvedValue(mockResponse);

        const result = await providerAdapter.chatCompletion(minimalConfig);

        expect(result.content).toBe('Response');
        expect(mockOpenAIProvider.chatCompletion).toHaveBeenCalled();
      });

      it('deve aceitar array vazio de mensagens', async () => {
        const config: ProviderConfig = {
          model: 'openai-gpt-3.5-turbo',
          apiKey: 'test-key',
          messages: [],
          systemPrompt: 'System prompt',
          temperature: 0.7,
          stream: false,
        };

        const mockResponse: IProviderResponse = {
          role: 'assistant',
          content: 'Empty messages response'
        };

        mockOpenAIProvider.chatCompletion.mockResolvedValue(mockResponse);

        const result = await providerAdapter.chatCompletion(config);

        expect(result.content).toBe('Empty messages response');
      });

      it('deve lidar com múltiplas mensagens', async () => {
        const config: ProviderConfig = {
          model: 'openai-gpt-3.5-turbo',
          apiKey: 'test-key',
          messages: [
            { role: 'system', content: 'System' },
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there!' },
            { role: 'user', content: 'How are you?' }
          ],
          systemPrompt: 'System prompt',
          temperature: 0.7,
          stream: false,
        };

        const mockResponse: IProviderResponse = {
          role: 'assistant',
          content: 'Multi-message response'
        };

        mockOpenAIProvider.chatCompletion.mockResolvedValue(mockResponse);

        const result = await providerAdapter.chatCompletion(config);

        expect(result.content).toBe('Multi-message response');
      });
    });

    describe('comportamento assíncrono', () => {
      it('deve lidar com respostas lentas', async () => {
        const config = createValidConfig();

        // Simular resposta lenta
        mockOpenAIProvider.chatCompletion.mockImplementation(
          () => new Promise(resolve =>
            setTimeout(() => resolve({ role: 'assistant', content: 'Slow response' }), 100)
          )
        );

        const result = await providerAdapter.chatCompletion(config);

        expect(result.content).toBe('Slow response');
      });

      it('deve lidar com timeout', async () => {
        const config = createValidConfig();

        // Simular timeout
        mockOpenAIProvider.chatCompletion.mockImplementation(
          () => new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 50)
          )
        );

        await expect(providerAdapter.chatCompletion(config)).rejects.toThrow('Request timeout');
      });
    });

    describe('tipos de resposta', () => {
      it('deve lidar com resposta string', async () => {
        const config = createValidConfig();
        const mockResponse: IProviderResponse = {
          role: 'assistant',
          content: 'String response',
          metadata: { type: 'string' }
        };

        mockOpenAIProvider.chatCompletion.mockResolvedValue(mockResponse);

        const result = await providerAdapter.chatCompletion(config);

        expect(typeof result.content).toBe('string');
        expect(result.metadata?.type).toBe('string');
      });

      it('deve lidar com response JSON em string', async () => {
        const config = createValidConfig();
        const jsonResponse = JSON.stringify({ data: 'value', number: 42 });
        const mockResponse: IProviderResponse = {
          role: 'assistant',
          content: jsonResponse,
          metadata: { type: 'json' }
        };

        mockOpenAIProvider.chatCompletion.mockResolvedValue(mockResponse);

        const result = await providerAdapter.chatCompletion(config);

        expect(typeof result.content).toBe('string');
        expect(JSON.parse(result.content)).toEqual({ data: 'value', number: 42 });
      });

      it('deve lidar com response contendo markdown', async () => {
        const config = createValidConfig();
        const markdownResponse = '# Title\n\n**Bold text** and `code`';
        const mockResponse: IProviderResponse = {
          role: 'assistant',
          content: markdownResponse,
          metadata: { format: 'markdown' }
        };

        mockOpenAIProvider.chatCompletion.mockResolvedValue(mockResponse);

        const result = await providerAdapter.chatCompletion(config);

        expect(result.content).toBe(markdownResponse);
        expect(result.metadata?.format).toBe('markdown');
      });
    });

    describe('tratamento de erros', () => {
      it('deve lidar com erro de API do provider', async () => {
        const config = createValidConfig();
        const apiError = new Error('API Error: Rate limit exceeded');
        apiError.name = 'RateLimitError';

        mockOpenAIProvider.chatCompletion.mockRejectedValue(apiError);

        await expect(providerAdapter.chatCompletion(config)).rejects.toThrow('Rate limit exceeded');
      });

      it('deve lidar com erro de rede', async () => {
        const config = createValidConfig();
        const networkError = new Error('Network Error: Connection refused');

        mockOpenAIProvider.chatCompletion.mockRejectedValue(networkError);

        await expect(providerAdapter.chatCompletion(config)).rejects.toThrow('Connection refused');
      });

      it('deve lidar com erro inesperado', async () => {
        const config = createValidConfig();
        const unexpectedError = new Error('Unexpected error occurred');

        mockOpenAIProvider.chatCompletion.mockRejectedValue(unexpectedError);

        await expect(providerAdapter.chatCompletion(config)).rejects.toThrow('Unexpected error occurred');
      });
    });

    describe('integração com tipo ProviderResponse', () => {
      it('deve retornar resposta compatível com IProviderResponse', async () => {
        const config = createValidConfig();
        const mockResponse: IProviderResponse = {
          role: 'assistant',
          content: 'Test response',
          metadata: {
            model: 'gpt-3.5-turbo',
            usage: {
              prompt_tokens: 10,
              completion_tokens: 5,
              total_tokens: 15
            },
            finish_reason: 'stop'
          }
        };

        mockOpenAIProvider.chatCompletion.mockResolvedValue(mockResponse);

        const result = await providerAdapter.chatCompletion(config);

        expect(result).toHaveProperty('content');
        expect(result).toHaveProperty('metadata');
        expect(result.metadata).toHaveProperty('model');
        expect(result.metadata).toHaveProperty('usage');
        expect(result.metadata?.usage).toHaveProperty('total_tokens');
      });
    });
  });

  describe('imutabilidade e consistência', () => {
    it('não deve modificar a configuração original', async () => {
      const config = createValidConfig();
      const originalConfig = JSON.parse(JSON.stringify(config));

      mockOpenAIProvider.chatCompletion.mockResolvedValue({
        role: 'assistant',
        content: 'Response'
      } as IProviderResponse);

      await providerAdapter.chatCompletion(config);

      expect(config).toEqual(originalConfig);
    });

    it('deve manter resultados consistentes para mesma configuração', async () => {
      const config = createValidConfig();
      const mockResponse: IProviderResponse = {
        role: 'assistant',
        content: 'Consistent response'
      };

      mockOpenAIProvider.chatCompletion.mockResolvedValue(mockResponse);

      const result1 = await providerAdapter.chatCompletion(config);
      const result2 = await providerAdapter.chatCompletion(config);

      expect(result1).toEqual(result2);
    });
  });
});
