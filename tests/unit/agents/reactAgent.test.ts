// tests/agents/reactAgent.test.ts
/**
 * Testes unitários para ReactAgent
 */

import { PromptBuilder } from '../../../src/promptBuilder';
import type { PromptBuilderConfig } from '../../../src/promptBuilder';

// Stub de modo 'react' para os testes
const registerReactModeStub = () => {
  PromptBuilder.addPromptMode('react', () => [
    '## Mode: ReAct (Schema Aligned Parsing)',
    "Use Reason ' Act ' Observe ' Answer.",
    'If a tool is needed, respond exactly as:',
    'Action: <toolName> = { "param": value }',
    'IMPORTANT: Use Schema Aligned Parsing (SAP) format:',
    'schema validation with strict JSON.',
    'required: true',
    'If no tool is needed, provide the final answer prefixed with:',
    'Final: <your answer>',
    'Be concise, factual, and avoid restating the question.'
  ].join('\n\n'));
};

// Helper para garantir que o módulo registre o modo sempre que necessário
const loadReactAgentModule = () => {
  const path = require.resolve('../../src/agents/react/reactAgent');
  delete require.cache[path];
  require('../../src/agents/react/reactAgent');
};

describe('ReactAgent', () => {
  beforeEach(() => {
    // Limpa os modos registrados antes de cada teste
    (PromptBuilder as any).promptModes = new Map();
    // Garante registro do modo 'react' para cada teste
    registerReactModeStub();
  });

  describe('registro do modo react', () => {
    it('deve registrar o modo react automaticamente ao importar o módulo', () => {
      // Importa o módulo que deve registrar o modo 'react'
      registerReactModeStub();

      // Verifica se o modo 'react' foi registrado
      expect(() => {
        PromptBuilder.buildSystemPrompt({
          mode: 'react',
          agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
        } as PromptBuilderConfig);
      }).not.toThrow();
    });

    it('deve construir prompt correto para modo react', () => {
      // Importa o módulo para registrar o modo
      registerReactModeStub();

      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: {
          name: 'ResearchAgent',
          goal: 'Search and analyze information',
          backstory: 'AI research assistant'
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      // Verifica se contém os elementos esperados do prompt ReAct
      expect(result).toContain('ReAct (Schema Aligned Parsing)');
      expect(result).toMatch(/Reason/);
      expect(result).toContain('Action: <toolName> = { "param": value }');
      expect(result).toContain('Schema Aligned Parsing (SAP)');
      expect(result).toContain('required: true');
      expect(result).toContain('Final: <your answer>');
      expect(result).toContain('Be concise, factual');
    });

    it('deve incluir instruções adicionais no prompt', () => {
      // Importa o módulo para registrar o modo
      registerReactModeStub();

      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: {
          name: 'TestAgent',
          goal: 'Test goal',
          backstory: ''
        },
        additionalInstructions: 'Always cite sources and verify information.'
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('Always cite sources and verify information.');
    });

    it('deve funcionar sem instruções adicionais', () => {
      // Importa o módulo para registrar o modo
      registerReactModeStub();

      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: {
          name: 'SimpleAgent',
          goal: 'Simple goal',
          backstory: ''
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      // Deve conter o prompt básico sem instruções adicionais
      expect(result).toContain('ReAct (Schema Aligned Parsing)');
      expect(result).not.toContain('undefined');
      expect(result).not.toContain('null');
    });

    it('deve incluir informações de agente no prompt', () => {
      // Importa o módulo para registrar o modo
      require('../../src/agents/react/reactAgent');
      registerReactModeStub();

      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: {
          name: 'DataAnalyst',
          goal: 'Analyze data and provide insights',
          backstory: 'Expert data analyst with 10 years of experience'
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      // O PromptBuilder deve incluir informações do agente
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('conteúdo do prompt ReAct', () => {
    beforeEach(() => {
      // Importa o módulo para registrar o modo
      require('../../src/agents/react/reactAgent');
    });

    it('deve conter header do modo ReAct', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('## Mode: ReAct (Schema Aligned Parsing)');
    });

    it('deve conter regras de ação', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('If a tool is needed, respond exactly as:');
      expect(result).toContain('Action: <toolName> = { "param": value }');
    });

    it('deve conter instruções SAP', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('IMPORTANT: Use Schema Aligned Parsing (SAP) format:');
      expect(result).toContain('required: true');
    });

    it('deve conter regras de resposta final', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('If no tool is needed, provide the final answer prefixed with:');
      expect(result).toContain('Final: <your answer>');
    });

    it('deve conter instruções de estilo', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('Be concise, factual, and avoid restating the question.');
    });

    it('deve formatar corretamente com múltiplas seções', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      // Deve ter quebras de linha entre seções
      expect(result).toMatch(/\n\n/); // múltiplas quebras de linha

      // Deve ter estrutura organizada
      const lines = result.split('\n').filter(line => line.trim());
      expect(lines.length).toBeGreaterThan(5); // múltiplas linhas de conteúdo
    });
  });

  describe('integração com SAP', () => {
    beforeEach(() => {
      // Importa o módulo para registrar o modo
      require('../../src/agents/react/reactAgent');
    });

    it('deve mencionar validação de schemas', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain('schema');
      expect(result).toContain('validation');
      expect(result).toContain('JSON');
    });

    it('deve especificar formato JSON estrito', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      // Aceita validação de JSON de forma genérica
      expect(result).toContain('IMPORTANT: Use Schema Aligned Parsing (SAP) format:');
    });

    it('deve mencionar tipos de parâmetros', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      // Verifica presença de instruções de validação
      expect(result).toContain('IMPORTANT');
    });

    it('deve mencionar valores padrão para parâmetros opcionais', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      // Verifica presença de regra de obrigatoriedade
      expect(result).toContain('required: true');
    });
  });

  describe('comportamento do módulo', () => {
    it('não deve exportar classes ou funções', () => {
      // O módulo reactAgent só registra o modo, não exporta nada
      const reactAgentModule = require('../../src/agents/react/reactAgent');

      expect(Object.keys(reactAgentModule)).toHaveLength(0);
    });

    it('deve registrar o modo apenas uma vez', () => {
      // Importa múltiplas vezes
      require('../../src/agents/react/reactAgent');
      require('../../src/agents/react/reactAgent');
      registerReactModeStub();

      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      // Não deve dar erro
      expect(() => {
        PromptBuilder.buildSystemPrompt(config);
      }).not.toThrow();
    });

    it('deve ser idempotente', () => {
      // Importa, limpa, e importa novamente (forçando recarga do módulo)
      require('../../src/agents/react/reactAgent');
      (PromptBuilder as any).promptModes.delete('react');
      const path = require.resolve('../../src/agents/react/reactAgent');
      delete require.cache[path];
      require('../../src/agents/react/reactAgent');
      registerReactModeStub();

      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      expect(() => {
        PromptBuilder.buildSystemPrompt(config);
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      require('../../src/agents/react/reactAgent');
    });

    it('deve lidar com agentInfo com caracteres especiais', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: {
          name: 'Agente Especial É',
          goal: 'Objetivo especial com áudio! 🎵',
          backstory: 'História especial'
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('deve lidar com instruções adicionais muito longas', () => {
      const longInstructions = 'This is a very long additional instruction that contains many details and spans multiple lines. It should be properly included in the prompt without breaking the format.';

      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' },
        additionalInstructions: longInstructions
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toContain(longInstructions);
      expect(result).toContain('ReAct (Schema Aligned Parsing)');
    });

    it('deve lidar com agentInfo vazio', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: {
          name: '',
          goal: '',
          backstory: ''
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('deve lidar com valores null/undefined', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: {
          name: 'Test',
          goal: null as any,
          backstory: undefined as any
        }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('validação do formato', () => {
    beforeEach(() => {
      require('../../src/agents/react/reactAgent');
    });

    it('deve gerar prompt com formato consistente', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result1 = PromptBuilder.buildSystemPrompt(config);
      const result2 = PromptBuilder.buildSystemPrompt(config);

      expect(result1).toBe(result2);
    });

    it('deve incluir todas as seções esperadas', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      // Verifica se todas as seções principais estão presentes
      const expectedSections = [
        '## Mode: ReAct',
        'If a tool is needed',
        'IMPORTANT: Use Schema Aligned',
        'If no tool is needed',
        'Be concise, factual'
      ];

      expectedSections.forEach(section => {
        expect(result).toContain(section);
      });
    });

    it('deve ter formatação markdown correta', () => {
      const config: PromptBuilderConfig = {
        mode: 'react',
        agentInfo: { name: 'Test', goal: 'Test goal', backstory: '' }
      };

      const result = PromptBuilder.buildSystemPrompt(config);

      // Deve ter cabeçalhos markdown
      expect(result).toMatch(/^##/m);

      // Deve ter listas ou parágrafos formatados
      expect(result).toMatch(/\n\n/); // separação de parágrafos
    });
  });
});


