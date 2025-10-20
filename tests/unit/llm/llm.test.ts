// tests/llm/llm.test.ts
/**
 * Testes unitários para LLM
 */

import { LLM } from '../../../src/llm/llm';
import { ProviderAdapter } from '../../../src/providers/adapter/providerAdapter';
import { PromptBuilder } from '../../../src/promptBuilder';
import type { Message } from '../../../src/memory/memory.interface';
import type { IProviderResponse } from '../../../src/providers/adapter/provider.interface';
import { createMockMessage, createMockLLMResponse } from '../setup';

// Helper de args válidos reutilizável em todo o arquivo
const createValidArgs = () => ({
  messages: [
    createMockMessage('user', 'Hello, world!')
  ] as Message[],
  systemPrompt: 'You are a helpful assistant.'
});

// Mock das dependências
jest.mock('../../src/providers/adapter/providerAdapter');
jest.mock('../../src/promptBuilder');

const mockProviderAdapter = ProviderAdapter as jest.Mocked<typeof ProviderAdapter>;
const mockPromptBuilder = PromptBuilder as jest.Mocked<typeof PromptBuilder>;

describe('LLM', () => {
  let llm: LLM;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock do ProviderAdapter
    mockProviderAdapter.chatCompletion.mockResolvedValue({
      role: 'assistant',
      content: 'Test response',
      metadata: { model: 'gpt-3.5-turbo' }
    });

    // Mock do PromptBuilder
    mockPromptBuilder.buildSystemPrompt.mockReturnValue('Mock system prompt');

    llm = new LLM({
      model: 'gpt-3.5-turbo',
      apiKey: 'test-api-key',
      defaults: {
        temperature: 0.7,
        maxTokens: 1000
      }
    });
  });

  describe('construtor', () => {
    it('deve inicializar com configuração válida', () => {
      const testLLM = new LLM({
        model: 'gpt-4',
        apiKey: 'test-key',
        defaults: {
          temperature: 0.5,
          topP: 0.9,
          maxTokens: 2000
        }
      });

      expect(testLLM).toBeDefined();
    });

    it('deve inicializar com defaults opcionais', () => {
      const testLLM = new LLM({
        model: 'gpt-3.5-turbo',
        apiKey: 'test-key'
      });

      expect(testLLM).toBeDefined();
    });

    it('deve armazenar configurações corretamente', () => {
      expect((llm as any).model).toBe('gpt-3.5-turbo');
      expect((llm as any).apiKey).toBe('test-api-key');
      expect((llm as any).defaults.temperature).toBe(0.7);
      expect((llm as any).defaults.maxTokens).toBe(1000);
    });
  });

  describe('invoke', () => {
    const createValidArgs = () => ({
      messages: [
        createMockMessage('user', 'Hello, world!')
      ] as Message[],
      systemPrompt: 'You are a helpful assistant.'
    });

    it('deve invocar ProviderAdapter com configuração correta', async () => {
      const args = createValidArgs();
      const mockResponse: IProviderResponse = {
        role: 'assistant',
        content: 'Hello! How can I help you?',
        metadata: { model: 'gpt-3.5-turbo' }
      };

      mockProviderAdapter.chatCompletion.mockResolvedValue(mockResponse);

      const result = await llm.invoke(args);

      expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        apiKey: 'test-api-key',
        messages: args.messages,
        systemPrompt: args.systemPrompt,
        temperature: 0.7, // valor do default
        topP: undefined,
        maxTokens: 1000, // valor do default
        stream: false
      });
      expect(result).toEqual({
        content: mockResponse.content,
        metadata: mockResponse.metadata,
      });
    });

    it('deve usar promptConfig quando fornecido', async () => {
      const args = {
        messages: [createMockMessage('user', 'Test')],
        promptConfig: {
          mode: 'chat' as any,
          agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
        }
      };

      mockPromptBuilder.buildSystemPrompt.mockReturnValue('Generated system prompt');
      mockProviderAdapter.chatCompletion.mockResolvedValue({
        role: 'assistant',
        content: 'Response with generated prompt'
      });

      const result = await llm.invoke(args);

      expect(mockPromptBuilder.buildSystemPrompt).toHaveBeenCalledWith(args.promptConfig);
      expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          systemPrompt: 'Generated system prompt'
        })
      );
    });

    it('deve usar systemPrompt diretamente quando promptConfig não fornecido', async () => {
      const args = {
        messages: [createMockMessage('user', 'Test')],
        systemPrompt: 'Direct system prompt'
      };

      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: 'Response with direct prompt'
      });

      const result = await llm.invoke(args);

      expect(mockPromptBuilder.buildSystemPrompt).not.toHaveBeenCalled();
      expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          systemPrompt: 'Direct system prompt'
        })
      );
    });

    it('deve priorizar promptConfig sobre systemPrompt', async () => {
      const args = {
        messages: [createMockMessage('user', 'Test')],
        systemPrompt: 'Direct prompt', // deve ser ignorado
        promptConfig: {
          mode: 'chat' as any,
          agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
        }
      };

      mockPromptBuilder.buildSystemPrompt.mockReturnValue('Generated prompt');
      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: 'Response'
      });

      await llm.invoke(args);

      expect(mockPromptBuilder.buildSystemPrompt).toHaveBeenCalled();
      expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          systemPrompt: 'Generated prompt' // não 'Direct prompt'
        })
      );
    });

    it('deve usar valores de parâmetros quando fornecidos', async () => {
      const args = {
        messages: [createMockMessage('user', 'Test')],
        systemPrompt: 'Test prompt',
        temperature: 0.3,
        topP: 0.8,
        maxTokens: 500,
        stream: true
      };

      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: 'Response with custom params'
      });

      await llm.invoke(args);

      expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        apiKey: 'test-api-key',
        messages: args.messages,
        systemPrompt: args.systemPrompt,
        temperature: 0.3, // valor fornecido
        topP: 0.8, // valor fornecido
        maxTokens: 500, // valor fornecido
        stream: true // valor fornecido
      });
    });

    it('deve usar defaults quando parâmetros não fornecidos', async () => {
      const args = {
        messages: [createMockMessage('user', 'Test')],
        systemPrompt: 'Test prompt'
      };

      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: 'Response with defaults'
      });

      await llm.invoke(args);

      expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        apiKey: 'test-api-key',
        messages: args.messages,
        systemPrompt: args.systemPrompt,
        temperature: 0.7, // default
        topP: undefined, // undefined
        maxTokens: 1000, // default
        stream: false // default
      });
    });

    it('deve lidar com array vazio de mensagens', async () => {
      const args = {
        messages: [] as Message[],
        systemPrompt: 'Test prompt'
      };

      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: 'Empty messages response'
      });

      const result = await llm.invoke(args);

      expect(result.content).toBe('Empty messages response');
    });

    it('deve lidar com múltiplas mensagens', async () => {
      const args = {
        messages: [
          createMockMessage('system', 'System'),
          createMockMessage('user', 'Hello'),
          createMockMessage('assistant', 'Hi'),
          createMockMessage('user', 'How are you?')
        ] as Message[],
        systemPrompt: 'Test prompt'
      };

      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: 'Multi-message response'
      });

      const result = await llm.invoke(args);

      expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: args.messages
        })
      );
      expect(result.content).toBe('Multi-message response');
    });

    it('deve propagar erros do ProviderAdapter', async () => {
      const args = createValidArgs();
      const mockError = new Error('Provider error');

      mockProviderAdapter.chatCompletion.mockRejectedValue(mockError);

      await expect(llm.invoke(args)).rejects.toThrow('Provider error');
    });

    it('deve retornar content null quando provider retorna null', async () => {
      const args = createValidArgs();
      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: null,
        metadata: {}
      });

      const result = await llm.invoke(args);

      expect(result.content).toBeNull();
    });

    it('deve retornar content undefined quando provider retorna undefined', async () => {
      const args = createValidArgs();
      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: undefined,
        metadata: {}
      });

      const result = await llm.invoke(args);

      expect(result.content).toBeNull(); // undefined -> null
    });

    it('deve preservar metadata do provider', async () => {
      const args = createValidArgs();
      const mockMetadata = {
        model: 'gpt-3.5-turbo',
        usage: { total_tokens: 25 },
        finish_reason: 'stop'
      };

      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: 'Response with metadata',
        metadata: mockMetadata
      });

      const result = await llm.invoke(args);

      expect(result.metadata).toEqual(mockMetadata);
    });

    describe('edge cases', () => {
      it('deve lidar com valores extremos de temperatura', async () => {
        const args = {
          messages: [createMockMessage('user', 'Test')],
          systemPrompt: 'Test',
          temperature: 2 // valor máximo comum
        };

        mockProviderAdapter.chatCompletion.mockResolvedValue({
          content: 'High temperature response'
        });

        const result = await llm.invoke(args);

        expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledWith(
          expect.objectContaining({ temperature: 2 })
        );
      });

      it('deve lidar com maxTokens zero', async () => {
        const args = {
          messages: [createMockMessage('user', 'Test')],
          systemPrompt: 'Test',
          maxTokens: 0
        };

        mockProviderAdapter.chatCompletion.mockResolvedValue({
          content: 'Zero tokens response'
        });

        const result = await llm.invoke(args);

        expect(result.content).toBe('Zero tokens response');
      });

      it('deve lidar com valores undefined opcionais', async () => {
        const args = {
          messages: [createMockMessage('user', 'Test')],
          systemPrompt: 'Test',
          temperature: 0.5,
          topP: undefined,
          maxTokens: undefined
        };

        mockProviderAdapter.chatCompletion.mockResolvedValue({
          content: 'Response with undefined params'
        });

        await llm.invoke(args);

        expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledWith(
          expect.objectContaining({
            temperature: 0.5, // usa o valor fornecido
            maxTokens: 1000, // usa default
            topP: undefined
          })
        );
      });
    });
  });

  describe('assertModeRegistered', () => {
    it('deve lançar erro quando modo não está registrado', () => {
      const invalidMode = 'invalid_mode' as any;

      mockPromptBuilder.buildSystemPrompt.mockImplementation(() => {
        throw new Error('Mode not found');
      });

      expect(() => llm.assertModeRegistered(invalidMode)).toThrow(
        "Prompt mode 'invalid_mode' não está registrado. Importe o módulo correspondente (ex.: 'src/agents') antes de invocar."
      );
    });

    it('não deve lançar erro quando modo está registrado', () => {
      const validMode = 'chat' as any;

      mockPromptBuilder.buildSystemPrompt.mockReturnValue('Valid prompt');

      expect(() => llm.assertModeRegistered(validMode)).not.toThrow();
    });

    it('deve usar configuração mínima para validação', () => {
      const mode = 'react' as any;

      mockPromptBuilder.buildSystemPrompt.mockReturnValue('React prompt');

      expect(() => llm.assertModeRegistered(mode)).not.toThrow();

      expect(mockPromptBuilder.buildSystemPrompt).toHaveBeenCalledWith({
        mode,
        agentInfo: { name: 'validator', goal: 'validate mode', backstory: '' }
      });
    });
  });

  describe('invokeWithMode', () => {
    it('deve invocar assertModeRegistered primeiro', async () => {
      const args = {
        messages: [createMockMessage('user', 'Test')],
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' },
        modeAgent: 'chat' as any
      };

      mockPromptBuilder.buildSystemPrompt.mockReturnValue('Chat prompt');
      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: 'Mode response'
      });

      await llm.invokeWithMode(args, 'chat');

      // verify assertModeRegistered foi chamado
      expect(mockPromptBuilder.buildSystemPrompt).toHaveBeenCalledTimes(2);
    });

    it('deve construir promptConfig corretamente', async () => {
      const args = {
        messages: [createMockMessage('user', 'Test')],
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: 'Test backstory' },
        additionalInstructions: 'Additional instructions',
        tools: [{ name: 'search', description: 'Search tool', parameters: {} }],
        temperature: 0.5,
        topP: 0.9,
        maxTokens: 1500,
        stream: true
      };

      const mode = 'react' as any;

      mockPromptBuilder.buildSystemPrompt.mockReturnValue('React prompt');
      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: 'React response'
      });

      await llm.invokeWithMode(args, mode);

      expect(mockPromptBuilder.buildSystemPrompt).toHaveBeenCalledWith({
        mode,
        agentInfo: args.agentInfo,
        additionalInstructions: args.additionalInstructions,
        tools: args.tools
      });
    });

    it('deve invocar invoke internamente com configuração correta', async () => {
      const args = {
        messages: [createMockMessage('user', 'Test')],
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' },
        temperature: 0.4,
        maxTokens: 800
      };

      const mode = 'chat' as any;

      mockPromptBuilder.buildSystemPrompt.mockReturnValue('Chat prompt');
      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: 'Chat response'
      });

      const localLLM = new LLM({ model: 'gpt-3.5-turbo', apiKey: 'test-api-key' });
      const result = await localLLM.invokeWithMode(args, mode);

      expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        apiKey: 'test-api-key',
        messages: args.messages,
        systemPrompt: 'Chat prompt',
        temperature: 0.4,
        maxTokens: 800,
        stream: false,
        topP: undefined
      });
      expect(result.content).toBe('Chat response');
    });

    it('deve lidar com parametros opcionais omitidos', async () => {
      const args = {
        messages: [createMockMessage('user', 'Test')],
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const mode = 'react' as any;

      mockPromptBuilder.buildSystemPrompt.mockReturnValue('React prompt');
      mockProviderAdapter.chatCompletion.mockResolvedValue({
        content: 'React response'
      });

      const result = await llm.invokeWithMode(args, mode);

      expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          temperature: 0.7, // default configurado no beforeEach
          topP: undefined, // não fornecido
          maxTokens: 1000, // default configurado no beforeEach
          stream: false // default
        })
      );
    });

    it('deve propagar erro de modo não registrado', async () => {
      const args = {
        messages: [createMockMessage('user', 'Test')],
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const invalidMode = 'invalid_mode' as any;

      mockPromptBuilder.buildSystemPrompt.mockImplementation(() => {
        throw new Error('Mode not found');
      });

      await expect(llm.invokeWithMode(args, invalidMode)).rejects.toThrow(
        "Prompt mode 'invalid_mode' não está registrado"
      );
    });
  });

  describe('integração e comportamento geral', () => {
    it('deve manter instância única com mesma configuração', () => {
      const llm1 = new LLM({
        model: 'gpt-3.5-turbo',
        apiKey: 'test-key'
      });

      const llm2 = new LLM({
        model: 'gpt-3.5-turbo',
        apiKey: 'test-key'
      });

      expect(llm1).not.toBe(llm2); // instâncias diferentes
    });

    it('deve lidar com múltiplas chamadas simultâneas', async () => {
      const args = createValidArgs();
      const mockResponse = { content: 'Concurrent response' };

      mockProviderAdapter.chatCompletion.mockResolvedValue(mockResponse);

      const promises = Array.from({ length: 5 }, () => llm.invoke(args));
      const results = await Promise.all(promises);

      results.forEach(result => {
        expect(result).toEqual(mockResponse);
      });
      expect(mockProviderAdapter.chatCompletion).toHaveBeenCalledTimes(5);
    });

    it('deve ser consistente entre chamadas', async () => {
      const args = createValidArgs();
      const mockResponse = { content: 'Consistent response' };

      mockProviderAdapter.chatCompletion.mockResolvedValue(mockResponse);

      const result1 = await llm.invoke(args);
      const result2 = await llm.invoke(args);

      expect(result1).toEqual(result2);
      expect(result1).toEqual(mockResponse);
    });
  });
});
