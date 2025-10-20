// tests/promptBuilder/promptBuilder.test.ts
/**
 * Testes unitários para PromptBuilder
 */

import { PromptBuilder } from '../../../src/promptBuilder';
import type { PromptBuilderConfig, AgentInfo, ToolSchema } from '../../../src/promptBuilder';

describe('PromptBuilder', () => {
  beforeEach(() => {
    // Limpa os modos registrados antes de cada teste
    (PromptBuilder as any).promptModes = new Map();
  });

  describe('addPromptMode', () => {
    it('deve registrar um novo modo de prompt', () => {
      const mockMode = jest.fn().mockReturnValue('Test mode prompt');
      PromptBuilder.addPromptMode('test', mockMode);

      const result = PromptBuilder.buildSystemPrompt({
        mode: 'test',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      } as PromptBuilderConfig);

      expect(mockMode).toHaveBeenCalledWith({
        mode: 'test',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      });
      expect(result).toContain('Test mode prompt');
    });

    it('deve permitir registrar múltiplos modos', () => {
      const chatMode = jest.fn().mockReturnValue('Chat mode prompt');
      const reactMode = jest.fn().mockReturnValue('React mode prompt');

      PromptBuilder.addPromptMode('chat', chatMode);
      PromptBuilder.addPromptMode('react', reactMode);

      const chatResult = PromptBuilder.buildSystemPrompt({
        mode: 'chat',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      } as PromptBuilderConfig);

      const reactResult = PromptBuilder.buildSystemPrompt({
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      } as PromptBuilderConfig);

      expect(chatResult).toContain('Chat mode prompt');
      expect(reactResult).toContain('React mode prompt');
    });

    it('deve sobrescrever modo existente', () => {
      const originalMode = jest.fn().mockReturnValue('Original prompt');
      const newMode = jest.fn().mockReturnValue('New prompt');

      PromptBuilder.addPromptMode('test', originalMode);
      PromptBuilder.addPromptMode('test', newMode);

      const result = PromptBuilder.buildSystemPrompt({
        mode: 'test',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      } as PromptBuilderConfig);

      expect(originalMode).toHaveBeenCalledTimes(0);
      expect(newMode).toHaveBeenCalledTimes(1);
      expect(result).toContain('New prompt');
    });

    it('deve lidar com funções de modo que retornam diferentes tipos', () => {
      const stringMode = jest.fn().mockReturnValue('String result');
      const numberMode = jest.fn().mockReturnValue(42);

      PromptBuilder.addPromptMode('string', stringMode);
      PromptBuilder.addPromptMode('number', numberMode);

      const stringResult = PromptBuilder.buildSystemPrompt({
        mode: 'string',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      } as PromptBuilderConfig);

      const numberResult = PromptBuilder.buildSystemPrompt({
        mode: 'number',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      } as PromptBuilderConfig);

      expect(stringResult).toContain('String result');
      expect(numberResult).toContain('42');
    });
  });

  describe('buildSystemPrompt', () => {
    beforeEach(() => {
      // Registrar um modo de teste para os testes
      PromptBuilder.addPromptMode('test', (config: PromptBuilderConfig) => {
        const agentInfo = config.agentInfo;
        let prompt = `You are ${agentInfo.name}.`;

        if (agentInfo.goal) {
          prompt += ` Your goal: ${agentInfo.goal}.`;
        }

        if (agentInfo.backstory) {
          prompt += ` Background: ${agentInfo.backstory}.`;
        }

        if (config.additionalInstructions) {
          prompt += ` Additional: ${config.additionalInstructions}`;
        }

        return prompt;
      });
    });

    it('deve construir prompt com configuração básica', () => {
      const config: PromptBuilderConfig = {
        mode: 'test',
        agentInfo: {
          name: 'Assistant',
          goal: 'Help users',
          backstory: 'AI assistant'
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('You are Assistant. Your goal: Help users. Background: AI assistant.');
    });

    it('deve construir prompt sem backstory', () => {
      const config: PromptBuilderConfig = {
        mode: 'test',
        agentInfo: {
          name: 'Helper',
          goal: 'Provide assistance',
          backstory: ''
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('You are Helper. Your goal: Provide assistance. Background: .');
    });

    it('deve incluir instruções adicionais', () => {
      const config: PromptBuilderConfig = {
        mode: 'test',
        agentInfo: {
          name: 'Bot',
          goal: 'Test tasks',
          backstory: 'Testing bot'
        },
        additionalInstructions: 'Be concise and accurate.'
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('You are Bot. Your goal: Test tasks. Background: Testing bot. Additional: Be concise and accurate.');
    });

    it('deve lidar com modo não registrado', () => {
      const config: PromptBuilderConfig = {
        mode: 'nonexistent' as any,
        agentInfo: {
          name: 'Test',
          goal: 'Test goal',
          backstory: ''
        }
      };

      expect(() => PromptBuilder.buildSystemPrompt(config)).toThrow(/não foi registrado/);
    });

    it('deve passar configuração completa para função de modo', () => {
      const mockMode = jest.fn().mockReturnValue('Mock prompt');
      PromptBuilder.addPromptMode('mock', mockMode);

      const tools: ToolSchema[] = [
        { name: 'search', description: 'Search tool', parameters: {} }
      ];

      const config: PromptBuilderConfig = {
        mode: 'mock',
        agentInfo: {
          name: 'Test Agent',
          goal: 'Test goal',
          backstory: 'Test backstory'
        },
        additionalInstructions: 'Test instructions',
        tools
      };

      PromptBuilder.buildSystemPrompt(config);

      expect(mockMode).toHaveBeenCalledWith(config);
      expect(mockMode).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'mock',
          agentInfo: {
            name: 'Test Agent',
            goal: 'Test goal',
            backstory: 'Test backstory'
          },
          additionalInstructions: 'Test instructions',
          tools
        })
      );
    });

    describe('integração com ferramentas', () => {
      it('deve incluir informações de ferramentas quando disponíveis', () => {
        const toolAwareMode = jest.fn().mockImplementation((config: PromptBuilderConfig) => {
          let prompt = `You are ${config.agentInfo.name}.`;

          if (config.tools && config.tools.length > 0) {
            prompt += ' Available tools: ';
            prompt += config.tools.map(tool => `${tool.name}: ${tool.description}`).join(', ');
          }

          return prompt;
        });

        PromptBuilder.addPromptMode('tool_aware', toolAwareMode);

        const tools: ToolSchema[] = [
          { name: 'search', description: 'Search the web', parameters: {} },
          { name: 'calculator', description: 'Perform calculations', parameters: {} }
        ];

        const config: PromptBuilderConfig = {
          mode: 'tool_aware',
          agentInfo: {
            name: 'ToolAgent',
            goal: 'Use tools effectively',
            backstory: ''
          },
          tools
        };

        const result = PromptBuilder.buildSystemPrompt(config);

        expect(result).toContain('ToolAgent');
        expect(result).toContain('Available tools:');
        expect(result).toContain('search: Search the web');
        expect(result).toContain('calculator: Perform calculations');
      });

      it('deve lidar com array vazio de ferramentas', () => {
        const toolAwareMode = jest.fn().mockImplementation((config: PromptBuilderConfig) => {
          let prompt = `You are ${config.agentInfo.name}.`;

          if (config.tools && config.tools.length > 0) {
            prompt += ' Tools available.';
          } else {
            prompt += ' No tools available.';
          }

          return prompt;
        });

        PromptBuilder.addPromptMode('empty_tools', toolAwareMode);

        const config: PromptBuilderConfig = {
          mode: 'empty_tools',
          agentInfo: {
            name: 'NoToolsAgent',
            goal: 'Test goal',
            backstory: ''
          },
          tools: []
        };

        const result = PromptBuilder.buildSystemPrompt(config);

        expect(result).toContain('No tools available.');
      });
    });
  });

  describe('modos predefinidos (chat e react)', () => {
    beforeEach(() => {
      // Registrar os modos que seriam registrados pelos módulos
      PromptBuilder.addPromptMode('chat', (config: PromptBuilderConfig) => {
        return `Chat mode: You are ${config.agentInfo.name}, a helpful assistant. Goal: ${config.agentInfo.goal}`;
      });

      PromptBuilder.addPromptMode('react', (config: PromptBuilderConfig) => {
        let prompt = `ReAct mode: You are ${config.agentInfo.name}. Goal: ${config.agentInfo.goal}.`;

        if (config.tools && config.tools.length > 0) {
          prompt += ' Use tools when necessary.';
        }

        return prompt;
      });
    });

    it('deve construir prompt para modo chat', () => {
      const config: PromptBuilderConfig = {
        mode: 'chat',
        agentInfo: {
          name: 'ChatAssistant',
          goal: 'Help with general questions',
          backstory: ''
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('Chat mode');
      expect(result).toContain('ChatAssistant');
      expect(result).toContain('Help with general questions');
    });

    it('deve construir prompt para modo react', () => {
      const tools: ToolSchema[] = [
        { name: 'search', description: 'Search tool', parameters: {} }
      ];

      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: {
          name: 'ReactAgent',
          goal: 'Search and analyze information',
          backstory: 'Research assistant'
        },
        tools
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('ReAct mode');
      expect(result).toContain('ReactAgent');
      expect(result).toContain('Search and analyze information');
      expect(result).toContain('Use tools when necessary');
    });

    it('deve construir prompt react sem ferramentas', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: {
          name: 'ReactAgent',
          goal: 'Answer questions',
          backstory: ''
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('ReAct mode');
      expect(result).toContain('ReactAgent');
      expect(result).toContain('Answer questions');
      expect(result).not.toContain('Use tools when necessary');
    });
  });

  describe('edge cases e tratamento de erros', () => {
    it('deve lidar com agentInfo vazio', () => {
      PromptBuilder.addPromptMode('minimal', () => 'Minimal prompt');

      const config: PromptBuilderConfig = {
        mode: 'minimal',
        agentInfo: {
          name: '',
          goal: '',
          backstory: ''
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('Minimal prompt');
    });

    it('deve lidar com funções de modo que lançam erros', () => {
      const errorMode = jest.fn().mockImplementation(() => {
        throw new Error('Mode function error');
      });

      PromptBuilder.addPromptMode('error', errorMode);

      const config: PromptBuilderConfig = {
        mode: 'error',
        agentInfo: {
          name: 'Test',
          goal: 'Test goal',
          backstory: ''
        }
      };

      expect(() => PromptBuilder.buildSystemPrompt(config)).toThrow(/não foi registrado/);
    });

    it('deve lidar com valores null/undefined em agentInfo', () => {
      PromptBuilder.addPromptMode('flexible', (config: PromptBuilderConfig) => {
        const parts = [];
        if (config.agentInfo.name) parts.push(`Name: ${config.agentInfo.name}`);
        if (config.agentInfo.goal) parts.push(`Goal: ${config.agentInfo.goal}`);
        if (config.agentInfo.backstory) parts.push(`Backstory: ${config.agentInfo.backstory}`);
        return parts.join(' | ') || 'No info';
      });

      const config: PromptBuilderConfig = {
        mode: 'flexible',
        agentInfo: {
          name: 'Test Agent',
          goal: null as any,
          backstory: undefined as any
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('Name: Test Agent');
    });

    it('deve lidar com caracteres especiais no conteúdo', () => {
      PromptBuilder.addPromptMode('special', (config: PromptBuilderConfig) => {
        return `Special chars: ${config.agentInfo.name} é um áudio! 🎵`;
      });

      const config: PromptBuilderConfig = {
        mode: 'special',
        agentInfo: {
          name: 'Agente especial',
          goal: 'Test goal',
          backstory: ''
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('Agente especial');
      expect(result).toContain('é um áudio! 🎵');
    });
  });

  describe('persistência e estado', () => {
    it('deve manter modos registrados entre chamadas', () => {
      PromptBuilder.addPromptMode('persistent', () => 'Persistent mode');

      const config1: PromptBuilderConfig = {
        mode: 'persistent',
        agentInfo: { name: 'Test1', goal: 'Goal1', backstory: '' }
      };

      const config2: PromptBuilderConfig = {
        mode: 'persistent',
        agentInfo: { name: 'Test2', goal: 'Goal2', backstory: '' }
      };

      const result1 = PromptBuilder.buildSystemPrompt(config1);
      const result2 = PromptBuilder.buildSystemPrompt(config2);

      expect(result1).toContain('Persistent mode');
      expect(result2).toContain('Persistent mode');
    });

    it('deve permitir verificar se modo está registrado', () => {
      PromptBuilder.addPromptMode('checkable', () => 'Checkable mode');

      // Não há método público para verificar, mas podemos testar indiretamente
      expect(() => {
        PromptBuilder.buildSystemPrompt({
          mode: 'checkable',
          agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
        } as PromptBuilderConfig);
      }).not.toThrow();

      expect(() => {
        PromptBuilder.buildSystemPrompt({
          mode: 'nonexistent' as any,
          agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
        } as PromptBuilderConfig);
      }).toThrow();
    });
  });

  describe('comportamento com configurações complexas', () => {
    it('deve lidar com configurações com many properties', () => {
      const complexMode = jest.fn().mockImplementation((config: PromptBuilderConfig) => {
        const props = Object.keys(config).sort().join(', ');
        return `Complex mode with: ${props}`;
      });

      PromptBuilder.addPromptMode('complex', complexMode);

      const tools: ToolSchema[] = [{ name: 'test', description: 'Test tool', parameters: {} }];

      const config: PromptBuilderConfig = {
        mode: 'complex',
        agentInfo: {
          name: 'ComplexAgent',
          goal: 'Complex goal',
          backstory: 'Complex backstory'
        },
        additionalInstructions: 'Complex instructions',
        tools
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('Complex mode with:');
      expect(result).toContain('additionalInstructions');
      expect(result).toContain('agentInfo');
      expect(result).toContain('mode');
      expect(result).toContain('tools');
    });

    it('deve lidar com instruções adicionais longas', () => {
      const longInstructions = 'This is a very long instruction that spans multiple lines and contains various details about how the agent should behave in different situations. It includes examples and edge cases to consider.';

      PromptBuilder.addPromptMode('long', (config: PromptBuilderConfig) => {
        return `Mode: long\nAgent: ${config.agentInfo.name}\nInstructions: ${config.additionalInstructions || 'None'}`;
      });

      const config: PromptBuilderConfig = {
        mode: 'long',
        agentInfo: {
          name: 'LongInstructionAgent',
          goal: 'Test goal',
          backstory: ''
        },
        additionalInstructions: longInstructions
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('LongInstructionAgent');
      expect(result).toContain(longInstructions);
    });
  });
});
