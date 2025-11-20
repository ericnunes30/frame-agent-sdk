// tests/unit/orchestrators/graph/llmConfig.test.ts
/**
 * Testes unitários para a nova funcionalidade de configuração do LLM no Graph Engine
 */

import { createAgentNode } from '../../../../src/orchestrators/graph/nodes/agentNode';
import { IAgentNodeOptions } from '../../../../src/orchestrators/graph/nodes/interfaces/agentNode.interface';
import { LLMConfig } from '../../../../src/orchestrators/graph/interfaces/llmConfig.interface';
import { Message } from '../../../../src/memory';
import { GraphNodeResult } from '../../../../src/orchestrators/graph/core/interfaces/graphEngine.interface';

// Mock do LLM para testes
const mockLLMInvoke = jest.fn();
const mockLLM = {
  invoke: mockLLMInvoke
};

jest.mock('../../../../src/llm/llm', () => {
  return {
    LLM: jest.fn().mockImplementation(() => mockLLM)
  };
});

describe('Graph Engine - LLM Config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAgentNode with LLMConfig', () => {
    it('deve criar uma instância de LLM a partir da configuração', async () => {
      // Arrange
      const llmConfig: LLMConfig = {
        model: 'test-model',
        apiKey: 'test-api-key',
        baseUrl: 'http://test-api.com',
        defaults: {
          temperature: 0.7,
          topP: 0.9,
          maxTokens: 100
        }
      };

      const options: IAgentNodeOptions = {
        llm: llmConfig,
        mode: 'chat',
        agentInfo: {
          name: 'TestAgent',
          goal: 'Test goal',
          backstory: 'Test backstory'
        }
      };

      const mockResponse = {
        content: 'Test response',
        metadata: { test: 'metadata' }
      };

      mockLLMInvoke.mockResolvedValue(mockResponse);

      // Act
      const agentNode = createAgentNode(options);
      const mockEngine = {
        getMessagesForLLM: jest.fn().mockReturnValue([])
      };
      const result = await agentNode({
        messages: [] as Message[],
        data: {},
        status: 'RUNNING'
      }, mockEngine as any);

      // Assert
      expect(result.lastModelOutput).toBe('Test response');
      expect(result.metadata).toEqual({ test: 'metadata' });
      expect(mockLLMInvoke).toHaveBeenCalled();
    });

    it('deve manter compatibilidade retroativa com instância LLM existente', async () => {
      // Arrange
      const options: IAgentNodeOptions = {
        llm: mockLLM as any,
        mode: 'chat',
        agentInfo: {
          name: 'TestAgent',
          goal: 'Test goal',
          backstory: 'Test backstory'
        }
      };

      const mockResponse = {
        content: 'Retroactive test response',
        metadata: { retro: 'active' }
      };

      mockLLMInvoke.mockResolvedValue(mockResponse);

      // Act
      const agentNode = createAgentNode(options);
      const mockEngine = {
        getMessagesForLLM: jest.fn().mockReturnValue([])
      };
      const result = await agentNode({
        messages: [] as Message[],
        data: {},
        status: 'RUNNING'
      }, mockEngine as any);

      // Assert
      expect(result.lastModelOutput).toBe('Retroactive test response');
      expect(result.metadata).toEqual({ retro: 'active' });
      expect(mockLLMInvoke).toHaveBeenCalled();
    });
  });
});