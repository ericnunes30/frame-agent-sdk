// tests/orchestrators/stepsOrchestrator.test.ts
/**
 * Testes unitários para StepsOrchestrator
 */

import { StepsOrchestrator } from '../../../src/orchestrators/steps/stepsOrchestrator';
import { ChatHistoryManager } from '../../../src/memory/chatHistoryManager';
import { TokenizerService } from '../../../src/memory/tokenizer';
import { LLM } from '../../../src/llm/llm';
import { PromptBuilder } from '../../../src/promptBuilder';
import { SAPParser } from '../../../src/tools/constructor/sapParser';
import { ToolExecutor } from '../../../src/tools/core/toolExecutor';
import type { StepsDeps, StepsConfig, Step, OrchestrationState } from '../../../src/orchestrators/steps/interfaces';
import type { Message } from '../../../src/memory/memory.interface';
import { createMockMessage, createMockLLMResponse, createMockToolCall } from '../setup';

// Mock das dependências
jest.mock('../../../src/memory/chatHistoryManager');
jest.mock('../../../src/memory/tokenizer');
jest.mock('../../../src/llm/llm');
jest.mock('../../../src/promptBuilder');
jest.mock('../../../src/tools/constructor/sapParser');
jest.mock('../../../src/tools/core/toolExecutor');

const MockChatHistoryManager = ChatHistoryManager as jest.MockedClass<typeof ChatHistoryManager>;
const MockTokenizerService = TokenizerService as jest.MockedClass<typeof TokenizerService>;
const MockLLM = LLM as jest.MockedClass<typeof LLM>;
const MockPromptBuilder = PromptBuilder as jest.Mocked<typeof PromptBuilder>;
const MockSAPParser = SAPParser as jest.Mocked<typeof SAPParser>;
const MockToolExecutor = ToolExecutor as jest.Mocked<typeof ToolExecutor>;

describe('StepsOrchestrator', () => {
  let orchestrator: StepsOrchestrator;
  let mockDeps: StepsDeps;
  let mockConfig: StepsConfig;
  let mockMemory: jest.Mocked<ChatHistoryManager>;
  let mockLLM: jest.Mocked<LLM>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    mockMemory = {
      addMessage: jest.fn(),
      getTrimmedHistory: jest.fn().mockReturnValue([]),
      getRemainingBudget: jest.fn().mockReturnValue(1000)
    } as any;

    mockLLM = {
      invoke: jest.fn().mockResolvedValue(createMockLLMResponse('Test response'))
    } as any;

    mockDeps = {
      memory: mockMemory,
      llm: mockLLM
    };

    mockConfig = {
      mode: 'chat',
      agentInfo: {
        name: 'TestAgent',
        goal: 'Test goal',
        backstory: 'Test backstory'
      }
    };

    // Mock PromptBuilder
    MockPromptBuilder.buildSystemPrompt.mockReturnValue('Mock system prompt');

    // Criar orchestrator
    orchestrator = new StepsOrchestrator(mockDeps, mockConfig);
  });

  describe('construtor', () => {
    it('deve inicializar com dependências e configuração', () => {
      expect(orchestrator).toBeDefined();
      expect((orchestrator as any).deps).toBe(mockDeps);
      expect((orchestrator as any).config).toBe(mockConfig);
    });

    it('deve armazenar dependências corretamente', () => {
      const customDeps: StepsDeps = {
        memory: {} as any,
        llm: {} as any
      };

      const customOrchestrator = new StepsOrchestrator(customDeps, mockConfig);

      expect((customOrchestrator as any).deps).toBe(customDeps);
    });

    it('deve armazenar configuração corretamente', () => {
      const customConfig: StepsConfig = {
        mode: 'react',
        agentInfo: {
          name: 'CustomAgent',
          goal: 'Custom goal',
          backstory: ''
        }
      };

      const customOrchestrator = new StepsOrchestrator(mockDeps, customConfig);

      expect((customOrchestrator as any).config).toBe(customConfig);
    });
  });

  describe('run (steps customizados)', () => {
    it('deve executar steps em sequência', async () => {
      const steps: Step[] = [
        {
          id: 'step1',
          run: jest.fn().mockResolvedValue({ data: { step1: 'done' } })
        },
        {
          id: 'step2',
          run: jest.fn().mockResolvedValue({ data: { step2: 'done' } })
        }
      ];

      const result = await orchestrator.run(steps, 'test input');

      expect(steps[0].run).toHaveBeenCalled();
      expect(steps[1].run).toHaveBeenCalled();
      expect(result.final).toBeNull(); // sem final definido
      expect(result.state.data).toEqual({ step1: 'done', step2: 'done' });
    });

    it('deve adicionar input do usuário à memória', async () => {
      const steps: Step[] = [
        {
          id: 'step1',
          run: jest.fn().mockResolvedValue({})
        }
      ];

      const userInput = 'Test user input';

      await orchestrator.run(steps, userInput);

      expect(mockMemory.addMessage).toHaveBeenCalledWith({
        role: 'user',
        content: userInput
      });
    });

    it('deve parar quando step define halt', async () => {
      const steps: Step[] = [
        {
          id: 'step1',
          run: jest.fn().mockResolvedValue({ data: { step1: 'done' } })
        },
        {
          id: 'step2',
          run: jest.fn().mockResolvedValue({ halt: true })
        },
        {
          id: 'step3',
          run: jest.fn().mockResolvedValue({ data: { step3: 'never executed' } })
        }
      ];

      const result = await orchestrator.run(steps, 'test');

      expect(steps[0].run).toHaveBeenCalled();
      expect(steps[1].run).toHaveBeenCalled();
      expect(steps[2].run).not.toHaveBeenCalled();
      expect(result.state.data).toEqual({ step1: 'done' });
    });

    it('deve suportar jumps entre steps', async () => {
      const steps: Step[] = [
        {
          id: 'start',
          run: jest.fn().mockResolvedValue({ next: 'jump_target' })
        },
        {
          id: 'middle',
          run: jest.fn().mockResolvedValue({})
        },
        {
          id: 'jump_target',
          run: jest.fn().mockResolvedValue({ final: 'jump successful' })
        }
      ];

      const result = await orchestrator.run(steps, 'test');

      expect(steps[0].run).toHaveBeenCalled();
      expect(steps[1].run).not.toHaveBeenCalled(); // pulado
      expect(steps[2].run).toHaveBeenCalled();
      expect(result.final).toBe('jump successful');
    });

    it('deve lidar com jump para step inexistente', async () => {
      const steps: Step[] = [
        {
          id: 'step1',
          run: jest.fn().mockResolvedValue({ next: 'nonexistent' })
        },
        {
          id: 'step2',
          run: jest.fn().mockResolvedValue({})
        }
      ];

      const result = await orchestrator.run(steps, 'test');

      expect(steps[0].run).toHaveBeenCalled();
      expect(steps[1].run).toHaveBeenCalled(); // continua para próximo step
      expect(result.final).toBeNull();
    });

    it('deve acumular dados de múltiplos steps', async () => {
      const steps: Step[] = [
        {
          id: 'step1',
          run: jest.fn().mockResolvedValue({ data: { value1: 1, shared: 'first' } })
        },
        {
          id: 'step2',
          run: jest.fn().mockResolvedValue({ data: { value2: 2, shared: 'second' } })
        }
      ];

      const result = await orchestrator.run(steps, 'test');

      expect(result.state.data).toEqual({
        value1: 1,
        shared: 'second', // sobrescrito
        value2: 2
      });
    });

    it('deve lidar com step sem retorno', async () => {
      const steps: Step[] = [
        {
          id: 'step1',
          run: jest.fn().mockResolvedValue(undefined) // sem retorno
        },
        {
          id: 'step2',
          run: jest.fn().mockResolvedValue({ final: 'done' })
        }
      ];

      const result = await orchestrator.run(steps, 'test');

      expect(steps[0].run).toHaveBeenCalled();
      expect(steps[1].run).toHaveBeenCalled();
      expect(result.final).toBe('done');
    });
  });

  describe('runFlow (modo chat)', () => {
    beforeEach(() => {
      mockConfig.mode = 'chat';
      orchestrator = new StepsOrchestrator(mockDeps, mockConfig);
    });

    it('deve executar fluxo chat simples', async () => {
      const userInput = 'Hello, world!';
      const mockResponse = createMockLLMResponse('Hello! How can I help you?');

      mockLLM.invoke.mockResolvedValue(mockResponse);

      const result = await orchestrator.runFlow(userInput);

      expect(mockMemory.addMessage).toHaveBeenCalledWith({
        role: 'user',
        content: userInput
      });

      expect(MockPromptBuilder.buildSystemPrompt).toHaveBeenCalledWith(mockConfig);

      expect(mockLLM.invoke).toHaveBeenCalledWith({
        messages: mockMemory.getTrimmedHistory(),
        systemPrompt: 'Mock system prompt'
      });

      expect(mockMemory.addMessage).toHaveBeenCalledWith({
        role: 'assistant',
        content: 'Hello! How can I help you?'
      });

      expect(result.final).toBe('Hello! How can I help you?');
      expect(result.state.lastModelOutput).toBe('Hello! How can I help you?');
    });

    it('deve lidar com resposta vazia do LLM', async () => {
      mockLLM.invoke.mockResolvedValue(createMockLLMResponse(null));

      const result = await orchestrator.runFlow('test');

      expect(result.final).toBeNull();
      expect(result.state.lastModelOutput).toBeNull();
    });

    it('deve incluir metadata do LLM no estado', async () => {
      const mockResponse = createMockLLMResponse('Response', {
        model: 'gpt-3.5-turbo',
        usage: { total_tokens: 25 }
      });

      mockLLM.invoke.mockResolvedValue(mockResponse);

      const result = await orchestrator.runFlow('test');

      expect(result.state.data.metadata).toEqual({
        model: 'gpt-3.5-turbo',
        usage: { total_tokens: 25 }
      });
    });

    it('deve usar histórico truncado da memória', async () => {
      const mockHistory: Message[] = [
        { role: 'system', content: 'System' },
        { role: 'user', content: 'Previous' }
      ];

      mockMemory.getTrimmedHistory.mockReturnValue(mockHistory);

      mockLLM.invoke.mockResolvedValue(createMockLLMResponse('Response'));

      await orchestrator.runFlow('test');

      expect(mockLLM.invoke).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: mockHistory
        })
      );
    });
  });

  describe('runFlow (modo react)', () => {
    beforeEach(() => {
      mockConfig.mode = 'react';
      orchestrator = new StepsOrchestrator(mockDeps, mockConfig);
    });

    it('deve executar fluxo react com múltiplos turnos', async () => {
      const userInput = 'Search for information about AI';

      // Setup mocks
      mockMemory.getTrimmedHistory.mockReturnValue([]);
      mockMemory.getRemainingBudget.mockReturnValue(1000);

      // Primeira resposta: Action: search = { "query": "AI information" }
      const firstResponse = createMockLLMResponse('Action: search = { "query": "AI information" }');
      mockLLM.invoke.mockResolvedValueOnce(firstResponse);

      // Mock do SAPParser
      MockSAPParser.parseAndValidate.mockReturnValueOnce({
        toolName: 'search',
        params: { query: 'AI information' }
      } as any);

      // Mock do ToolExecutor
      MockToolExecutor.execute.mockResolvedValue('Found information about AI');

      // Segunda resposta: final_answer
      const secondResponse = createMockLLMResponse('Action: final_answer = { "answer": "AI is artificial intelligence" }');
      mockLLM.invoke.mockResolvedValueOnce(secondResponse);
      MockSAPParser.parseAndValidate.mockReturnValueOnce({
        toolName: 'final_answer',
        params: { answer: 'AI is artificial intelligence' }
      } as any);

      const result = await orchestrator.runFlow(userInput, { maxTurns: 5 });

      // Verificações
      expect(mockMemory.addMessage).toHaveBeenCalledWith({
        role: 'user',
        content: userInput
      });

      expect(MockSAPParser.parseAndValidate).toHaveBeenCalledWith('Action: search = { "query": "AI information" }');
      expect(MockToolExecutor.execute).toHaveBeenCalledWith({
        toolName: 'search',
        params: { query: 'AI information' }
      });

      expect(mockMemory.addMessage).toHaveBeenCalledWith({
        role: 'tool',
        content: 'Found information about AI'
      });

      expect(result.final).toBe('AI is artificial intelligence');
    });

    it('deve parar quando atinge maxTurns', async () => {
      mockMemory.getTrimmedHistory.mockReturnValue([]);
      mockMemory.getRemainingBudget.mockReturnValue(1000);

      // Sempre retorna ação (nunca final_answer)
      mockLLM.invoke.mockResolvedValue(createMockLLMResponse('Action: search = { "query": "test" }'));
      MockSAPParser.parseAndValidate.mockReturnValue({
        toolName: 'search',
        params: { query: 'test' }
      } as any);
      MockToolExecutor.execute.mockResolvedValue('Result');

      const result = await orchestrator.runFlow('test', { maxTurns: 2 });

      // Deve parar após maxTurns
      expect(mockLLM.invoke).toHaveBeenCalledTimes(2);
      expect(result.final).toBeNull(); // não houve final_answer
    });

    it('deve parar quando budget de tokens é esgotado', async () => {
      mockMemory.getRemainingBudget.mockReturnValue(0); // sem budget

      const result = await orchestrator.runFlow('test', { maxTurns: 5 });

      expect(mockLLM.invoke).not.toHaveBeenCalled();
      expect(result.final).toBeNull();
    });

    it('deve lidar com final_answer tool', async () => {
      mockMemory.getTrimmedHistory.mockReturnValue([]);
      mockMemory.getRemainingBudget.mockReturnValue(1000);

      // Resposta com final_answer
      mockLLM.invoke.mockResolvedValue(createMockLLMResponse('Action: final_answer = { "answer": "Final answer here" }'));
      MockSAPParser.parseAndValidate.mockReturnValue({
        toolName: 'final_answer',
        params: { answer: 'Final answer here' }
      } as any);

      const result = await orchestrator.runFlow('test');

      expect(result.final).toBe('Final answer here');
      expect(mockMemory.addMessage).toHaveBeenCalledWith({
        role: 'assistant',
        content: 'Final answer here'
      });
    });

    it('deve lidar com ask_user tool', async () => {
      mockMemory.getTrimmedHistory.mockReturnValue([]);
      mockMemory.getRemainingBudget.mockReturnValue(1000);

      mockLLM.invoke.mockResolvedValue(createMockLLMResponse('Action: ask_user = { "question": "What is your name?", "details": "I need this for personalization" }'));
      MockSAPParser.parseAndValidate.mockReturnValue({
        toolName: 'ask_user',
        params: { question: 'What is your name?', details: 'I need this for personalization' }
      } as any);

      const result = await orchestrator.runFlow('test');

      expect(result.final).toBeNull();
      expect(result.pendingAskUser).toEqual({
        question: 'What is your name?',
        details: 'I need this for personalization'
      });

      expect(result.state.data.ask_user).toEqual(result.pendingAskUser);
    });

    it('deve tratar resposta sem tool como final', async () => {
      mockMemory.getTrimmedHistory.mockReturnValue([]);
      mockMemory.getRemainingBudget.mockReturnValue(1000);

      mockLLM.invoke.mockResolvedValue(createMockLLMResponse('This is the final answer without tools'));
      MockSAPParser.parseAndValidate.mockReturnValue({} as any); // sem toolName

      const result = await orchestrator.runFlow('test');

      expect(result.final).toBe('This is the final answer without tools');
    });

    it('deve adicionar respostas do assistente à memória', async () => {
      mockMemory.getTrimmedHistory.mockReturnValue([]);
      mockMemory.getRemainingBudget.mockReturnValue(1000);

      const assistantResponse = 'Action: search = { "query": "test" }';
      mockLLM.invoke.mockResolvedValue(createMockLLMResponse(assistantResponse));
      MockSAPParser.parseAndValidate.mockReturnValue({
        toolName: 'search',
        params: { query: 'test' }
      } as any);
      MockToolExecutor.execute.mockResolvedValue('Search result');

      await orchestrator.runFlow('test');

      expect(mockMemory.addMessage).toHaveBeenCalledWith({
        role: 'assistant',
        content: assistantResponse
      });
    });
  });

  describe('integração e comportamento geral', () => {
    it('deve lidar com erros do LLM', async () => {
      mockLLM.invoke.mockRejectedValue(new Error('LLM API Error'));

      await expect(orchestrator.runFlow('test')).rejects.toThrow('LLM API Error');
    });

    it('deve lidar com erros do SAPParser', async () => {
      mockConfig.mode = 'react';
      orchestrator = new StepsOrchestrator(mockDeps, mockConfig);

      mockMemory.getTrimmedHistory.mockReturnValue([]);
      mockMemory.getRemainingBudget.mockReturnValue(1000);

      mockLLM.invoke.mockResolvedValue(createMockLLMResponse('Invalid action format'));
      MockSAPParser.parseAndValidate.mockReturnValue({
        message: 'Parse error',
        rawOutput: 'Invalid action format'
      } as any);

      const result = await orchestrator.runFlow('test');

      // Deve tratar como erro e continuar/parar apropriadamente
      expect(result.final).toBeNull();
    });

    it('deve lidar com erros do ToolExecutor', async () => {
      mockConfig.mode = 'react';
      orchestrator = new StepsOrchestrator(mockDeps, mockConfig);

      mockMemory.getTrimmedHistory.mockReturnValue([]);
      mockMemory.getRemainingBudget.mockReturnValue(1000);

      mockLLM.invoke.mockResolvedValue(createMockLLMResponse('Action: search = { "query": "test" }'));
      MockSAPParser.parseAndValidate.mockReturnValue({
        toolName: 'search',
        params: { query: 'test' }
      } as any);
      MockToolExecutor.execute.mockRejectedValue(new Error('Tool execution failed'));

      await expect(orchestrator.runFlow('test')).rejects.toThrow('Tool execution failed');
    });

    it('deve manter estado consistente entre execuções', async () => {
      const userInput = 'Test input';
      mockLLM.invoke.mockResolvedValue(createMockLLMResponse('Response'));

      const result1 = await orchestrator.runFlow(userInput);
      const result2 = await orchestrator.runFlow(userInput);

      expect(result1.final).toBe(result2.final);
      expect(mockLLM.invoke).toHaveBeenCalledTimes(2);
    });

    it('deve lidar com opções customizadas', async () => {
      const result = await orchestrator.runFlow('test', { maxTurns: 3 });

      expect(result).toBeDefined();
      expect(typeof result.final).toBe('string');
    });
  });

  describe('edge cases', () => {
    it('deve lidar com userInput vazio', async () => {
      mockLLM.invoke.mockResolvedValue(createMockLLMResponse('Empty input response'));

      const result = await orchestrator.runFlow('');

      expect(mockMemory.addMessage).toHaveBeenCalledWith({
        role: 'user',
        content: ''
      });

      expect(result.final).toBe('Empty input response');
    });

    it('deve lidar com steps array vazio', async () => {
      const result = await orchestrator.run([], 'test');

      expect(result.final).toBeNull();
      expect(result.state.data).toEqual({});
    });

    it('deve lidar com step com id duplicado', async () => {
      const steps: Step[] = [
        { id: 'duplicate', run: jest.fn().mockResolvedValue({ data: { first: 1 } }) },
        { id: 'duplicate', run: jest.fn().mockResolvedValue({ data: { second: 2 } }) }
      ];

      const result = await orchestrator.run(steps, 'test');

      // Deve executar ambos (Map sobrescreve, mas execução é sequencial)
      expect(steps[0].run).toHaveBeenCalled();
      expect(steps[1].run).toHaveBeenCalled();
    });

    it('deve lidar com modo desconhecido', async () => {
      (orchestrator as any).config.mode = 'unknown';

      await expect(orchestrator.runFlow('test')).rejects.toThrow();
    });
  });
});
