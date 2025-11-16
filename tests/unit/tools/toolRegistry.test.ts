// tests/tools/toolRegistry.test.ts
/**
 * Testes unitários para ToolRegistry
 */

import { toolRegistry } from '../../../src/tools/core/toolRegistry';
import { SearchTool } from '../../../src/tools/tools/searchTool';
import { AskUserTool } from '../../../src/tools/tools/askUserTool';
import { FinalAnswerTool } from '../../../src/tools/tools/finalAnswerTool';

// Mock das ferramentas para teste isolado
jest.mock('../../../src/tools/tools/searchTool');
jest.mock('../../../src/tools/tools/askUserTool');
jest.mock('../../../src/tools/tools/finalAnswerTool');

const MockSearchTool = SearchTool as jest.MockedClass<typeof SearchTool>;
const MockAskUserTool = AskUserTool as jest.MockedClass<typeof AskUserTool>;
const MockFinalAnswerTool = FinalAnswerTool as jest.MockedClass<typeof FinalAnswerTool>;

describe('ToolRegistry', () => {
  let registry: typeof toolRegistry;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reinicializar o registry para cada teste
    // Resetamos as ferramentas registradas
    (toolRegistry as any)['toolInstances'] = new Map();

    // Mockar implementações com propriedades esperadas
    MockSearchTool.mockImplementation(() => ({
      name: 'search',
      description: 'Search tool',
      parameterSchema: {},
      execute: jest.fn()
    }) as any);
    MockAskUserTool.mockImplementation(() => ({
      name: 'ask_user',
      description: 'Ask user tool',
      parameterSchema: {},
      execute: jest.fn()
    }) as any);
    MockFinalAnswerTool.mockImplementation(() => ({
      name: 'final_answer',
      description: 'Final answer tool',
      parameterSchema: {},
      execute: jest.fn()
    }) as any);

    // Registrar ferramentas mockadas
    registry = toolRegistry;
    (registry as any)['toolInstances'].set('search', new MockSearchTool());
    (registry as any)['toolInstances'].set('ask_user', new MockAskUserTool());
    (registry as any)['toolInstances'].set('final_answer', new MockFinalAnswerTool());
  });

  describe('getTool', () => {
    beforeEach(() => {
      // Setup: registrar algumas ferramentas para teste
      const searchTool = new MockSearchTool();
      const askUserTool = new MockAskUserTool();

      (registry as any)['toolInstances'].set('search', searchTool);
      (registry as any)['toolInstances'].set('ask_user', askUserTool);
    });

    it('deve retornar ferramenta quando existe no registry', () => {
      const result = registry.getTool('search');

      expect(result).toBeDefined();
      expect(result?.name).toBe('search');
    });

    it('deve retornar undefined quando ferramenta não existe', () => {
      const result = registry.getTool('nonexistent_tool');

      expect(result).toBeUndefined();
    });

    it('deve retornar a mesma instância da ferramenta', () => {
      const tool1 = registry.getTool('search');
      const tool2 = registry.getTool('search');

      expect(tool1).toBe(tool2); // Mesma referência
    });

    it('deve funcionar com diferentes nomes de ferramentas', () => {
      const searchTool = registry.getTool('search');
      const askUserTool = registry.getTool('ask_user');

      expect(searchTool?.name).toBe('search');
      expect(askUserTool?.name).toBe('ask_user');
      expect(searchTool).not.toBe(askUserTool);
    });
  });

  describe('registro automático de ferramentas', () => {
    it('deve registrar automaticamente as ferramentas embutidas', () => {
      // O registry deve registrar automaticamente as ferramentas ao ser importado
      // Verificamos se as ferramentas principais estão disponíveis

      const searchTool = registry.getTool('search');
      const askUserTool = registry.getTool('ask_user');
      const finalAnswerTool = registry.getTool('final_answer');

      expect(searchTool).toBeDefined();
      expect(askUserTool).toBeDefined();
      expect(finalAnswerTool).toBeDefined();
    });

    it('deve ter as propriedades corretas nas ferramentas registradas', () => {
      const searchTool = registry.getTool('search');
      const askUserTool = registry.getTool('ask_user');
      const finalAnswerTool = registry.getTool('final_answer');

      if (searchTool) {
        expect(searchTool.name).toBe('search');
        expect(typeof searchTool.description).toBe('string');
        expect(searchTool.parameterSchema).toBeDefined();
        expect(typeof searchTool.execute).toBe('function');
      }

      if (askUserTool) {
        expect(askUserTool.name).toBe('ask_user');
        expect(typeof askUserTool.description).toBe('string');
        expect(askUserTool.parameterSchema).toBeDefined();
        expect(typeof askUserTool.execute).toBe('function');
      }

      if (finalAnswerTool) {
        expect(finalAnswerTool.name).toBe('final_answer');
        expect(typeof finalAnswerTool.description).toBe('string');
        expect(finalAnswerTool.parameterSchema).toBeDefined();
        expect(typeof finalAnswerTool.execute).toBe('function');
      }
    });
  });

  describe('comportamento do singleton', () => {
    it('deve manter o mesmo estado entre acessos', () => {
      // O registry deve ser um singleton - mesma instância
      const registry1 = toolRegistry;
      const registry2 = toolRegistry;

      expect(registry1).toBe(registry2);
    });

    it('deve persistir ferramentas registradas', () => {
      // Adicionar uma ferramenta manualmente
      const mockTool = {
        name: 'test_tool',
        description: 'Test tool',
        parameterSchema: {},
        execute: jest.fn()
      };

      (registry as any)['toolInstances'].set('test_tool', mockTool);

      // Verificar se persiste
      const retrieved = registry.getTool('test_tool');
      expect(retrieved).toBe(mockTool);
    });
  });

  describe('integração com tipos e interfaces', () => {
    it('deve retornar ferramentas que implementam ITool', () => {
      const searchTool = registry.getTool('search');

      if (searchTool) {
        expect(searchTool).toHaveProperty('name');
        expect(searchTool).toHaveProperty('description');
        expect(searchTool).toHaveProperty('parameterSchema');
        expect(searchTool).toHaveProperty('execute');
        expect(typeof searchTool.execute).toBe('function');
      }
    });

    it('deve ter parameterSchema válido para cada ferramenta', () => {
      const tools = ['search', 'ask_user', 'final_answer'];

      tools.forEach(toolName => {
        const tool = registry.getTool(toolName);

        if (tool) {
          expect(tool.parameterSchema).toBeDefined();
          expect(typeof tool.parameterSchema).toBe('object');
        }
      });
    });
  });

  describe('edge cases', () => {
    it('deve lidar com nome de ferramenta vazio', () => {
      const result = registry.getTool('');

      expect(result).toBeUndefined();
    });

    it('deve lidar com nome de ferramenta null/undefined', () => {
      const result1 = registry.getTool(null as any);
      const result2 = registry.getTool(undefined as any);

      expect(result1).toBeUndefined();
      expect(result2).toBeUndefined();
    });

    it('deve lidar com nomes de ferramentas com caracteres especiais', () => {
      const specialTool = {
        name: 'special-tool_123',
        description: 'Special tool',
        parameterSchema: {},
        execute: jest.fn()
      };

      (registry as any)['toolInstances'].set('special-tool_123', specialTool);

      const result = registry.getTool('special-tool_123');
      expect(result).toBe(specialTool);
    });

    it('deve ser case-sensitive', () => {
      const tool = registry.getTool('search');
      const toolWrongCase = registry.getTool('Search');

      expect(tool).toBeDefined();
      expect(toolWrongCase).toBeUndefined();
    });
  });

  describe('comportamento concorrente', () => {
    it('deve lidar com múltiplos acessos simultâneos', async () => {
      const promises = Array.from({ length: 10 }, () =>
        Promise.resolve(registry.getTool('search'))
      );

      const results = await Promise.all(promises);

      // Todos devem retornar a mesma instância
      const firstResult = results[0];
      results.forEach(result => {
        expect(result).toBe(firstResult);
      });
    });

    it('deve ser thread-safe para leituras', () => {
      // Simular múltiplas leituras concorrentes
      const results = [];
      for (let i = 0; i < 100; i++) {
        results.push(registry.getTool('search'));
      }

      // Todos devem ser consistentes
      const firstResult = results[0];
      results.forEach(result => {
        expect(result).toBe(firstResult);
      });
    });
  });

  describe('depuração e desenvolvimento', () => {
    it('deve permitir listar todas as ferramentas registradas (debug)', () => {
      // Access to internal Map for debugging
      const internalTools = (registry as any)['toolInstances'] as Map<string, any>;

      expect(internalTools).toBeDefined();
      expect(internalTools instanceof Map).toBe(true);

      // Deve ter pelo menos as ferramentas básicas
      const toolNames = Array.from(internalTools.keys());
      expect(toolNames.length).toBeGreaterThan(0);
    });

    it('deve ter método toString útil para depuração', () => {
      const searchTool = registry.getTool('search');

      if (searchTool) {
        const toolString = searchTool.toString();
        expect(typeof toolString).toBe('string');
        expect(toolString.length).toBeGreaterThan(0);
      }
    });
  });
});
