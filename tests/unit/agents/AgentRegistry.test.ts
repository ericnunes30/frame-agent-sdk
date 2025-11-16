// tests/unit/agents/AgentRegistry.test.ts
import { AgentRegistry } from '../../../src/agents/registry/AgentRegistry';
import { IAgent, IAgentConfig, AgentExecutionResult, AgentExecutionOptions } from '../../../src/agents/interfaces';
import type { Message } from '../../../src/memory';

// Mock agent para testes
class MockAgent implements IAgent {
  public readonly id: string;
  public readonly type: string;
  public readonly config: IAgentConfig;
  
  constructor(config: IAgentConfig) {
    this.id = `mock-${Date.now()}`;
    this.type = config.type || 'mock';
    this.config = config;
  }
  
  async execute(messages: Message[], options?: AgentExecutionOptions): Promise<AgentExecutionResult> {
    return {
      success: true,
      content: `Mock response to: ${messages.map(m => m.content).join(', ')}`,
      messages: messages,
      metadata: {
        executionTime: 100,
        startTime: new Date(),
        endTime: new Date(),
        mock: true
      }
    };
  }
  
  configure(config: Partial<IAgentConfig>): void {
    Object.assign(this.config, config);
  }
  
  getInfo() {
    return this.config.agentInfo;
  }
  
  validate(): boolean {
    return true;
  }
  
  reset(): void {
    // Mock implementation
  }
}

// Mock agent inválido para testes
class InvalidAgent {
  constructor(config: IAgentConfig) {
    // Não implementa IAgent corretamente
  }
}

describe('AgentRegistry', () => {
  let registry: AgentRegistry;
  let mockConfig: IAgentConfig;

  beforeEach(() => {
    registry = new AgentRegistry();
    registry.clear(); // Limpa antes de cada teste
    
    mockConfig = {
      type: 'test',
      provider: 'openai',
      model: 'gpt-4o-mini',
      agentInfo: {
        name: 'Test Agent',
        goal: 'Test agent',
        backstory: 'Test backstory'
      }
    };
    
    // Mock environment variables
    process.env.OPENAI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    registry.clear();
    delete process.env.OPENAI_API_KEY;
  });

  describe('register', () => {
    it('deve registrar um agente válido', () => {
      const result = registry.register('test-agent', MockAgent, mockConfig);
      
      expect(result).toBe(true);
      expect(registry.has('test-agent')).toBe(true);
    });

    it('deve falhar ao registrar com nome vazio', () => {
      const result = registry.register('', MockAgent, mockConfig);
      
      expect(result).toBe(false);
    });

    it('deve falhar ao registrar agente inválido', () => {
      const result = registry.register('invalid', InvalidAgent as any, mockConfig);
      
      expect(result).toBe(false);
    });

    it('deve falhar ao registrar sem configuração', () => {
      const result = registry.register('test-agent', MockAgent, null as any);
      
      expect(result).toBe(false);
    });

    it('deve sobrescrever agente existente com overwrite: true', () => {
      registry.register('test-agent', MockAgent, mockConfig);
      
      const newConfig = { ...mockConfig, type: 'new-type' };
      const result = registry.register('test-agent', MockAgent, newConfig, { overwrite: true });
      
      expect(result).toBe(true);
      
      const agent = registry.get('test-agent');
      expect(agent?.config.type).toBe('new-type');
    });

    it('deve falhar ao sobrescrever sem overwrite: true', () => {
      registry.register('test-agent', MockAgent, mockConfig);
      
      const newConfig = { ...mockConfig, type: 'new-type' };
      const result = registry.register('test-agent', MockAgent, newConfig);
      
      expect(result).toBe(false);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      registry.register('test-agent', MockAgent, mockConfig);
    });

    it('deve obter agente registrado', () => {
      const agent = registry.get('test-agent');
      
      expect(agent).not.toBeNull();
      expect(agent?.type).toBe('test');
      expect(agent?.config.provider).toBe('openai');
    });

    it('deve retornar null para agente não registrado', () => {
      const agent = registry.get('non-existent');
      
      expect(agent).toBeNull();
    });

    it('deve criar nova instância a cada chamada', () => {
      const agent1 = registry.get('test-agent');
      const agent2 = registry.get('test-agent');
      
      expect(agent1).not.toBe(agent2); // Diferentes instâncias
      // Nota: Os IDs podem ser os mesmos se o MockAgent usar o mesmo timestamp
      // O importante é que sejam objetos diferentes na memória
    });

    it('deve aplicar configuração parcial ao obter agente', () => {
      const partialConfig = { model: 'gpt-4' };
      const agent = registry.get('test-agent', partialConfig);
      
      expect(agent?.config.model).toBe('gpt-4');
      expect(agent?.config.provider).toBe('openai'); // Mantém config original
    });
  });

  describe('list', () => {
    it('deve listar agentes registrados vazia quando vazia', () => {
      const list = registry.list();
      
      expect(list).toEqual([]);
    });

    it('deve listar agentes registrados', () => {
      registry.register('agent1', MockAgent, mockConfig);
      registry.register('agent2', MockAgent, { ...mockConfig, type: 'another' });
      
      const list = registry.list();
      
      expect(list).toHaveLength(2);
      expect(list[0].name).toBe('agent1');
      expect(list[1].name).toBe('agent2');
      expect(list[0].type).toBe('test');
      expect(list[1].type).toBe('another');
    });

    it('deve incluir informações corretas na listagem', () => {
      registry.register('test-agent', MockAgent, mockConfig);
      
      const list = registry.list();
      const info = list[0];
      
      expect(info.name).toBe('test-agent');
      expect(info.type).toBe('test');
      expect(info.config).toEqual(mockConfig);
      expect(info.registeredAt).toBeInstanceOf(Date);
      expect(info.usageCount).toBe(0);
    });
  });

  describe('unregister', () => {
    beforeEach(() => {
      registry.register('test-agent', MockAgent, mockConfig);
    });

    it('deve remover agente registrado', () => {
      const result = registry.unregister('test-agent');
      
      expect(result).toBe(true);
      expect(registry.has('test-agent')).toBe(false);
    });

    it('deve retornar false ao remover agente não registrado', () => {
      const result = registry.unregister('non-existent');
      
      expect(result).toBe(false);
    });
  });

  describe('has', () => {
    it('deve retornar false para agente não registrado', () => {
      expect(registry.has('non-existent')).toBe(false);
    });

    it('deve retornar true para agente registrado', () => {
      registry.register('test-agent', MockAgent, mockConfig);
      
      expect(registry.has('test-agent')).toBe(true);
    });
  });

  describe('clear', () => {
    it('deve limpar todos os registros', () => {
      registry.register('agent1', MockAgent, mockConfig);
      registry.register('agent2', MockAgent, mockConfig);
      
      registry.clear();
      
      expect(registry.list()).toHaveLength(0);
      expect(registry.has('agent1')).toBe(false);
      expect(registry.has('agent2')).toBe(false);
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas corretas quando vazio', () => {
      const stats = registry.getStats();
      
      expect(stats.totalAgents).toBe(0);
      expect(stats.agentsByType).toEqual({});
      expect(stats.mostUsed).toEqual([]);
      expect(stats.createdAt).toBeInstanceOf(Date);
    });

    it('deve retornar estatísticas com agentes registrados', () => {
      registry.register('agent1', MockAgent, mockConfig);
      registry.register('agent2', MockAgent, { ...mockConfig, type: 'another' });
      registry.register('agent3', MockAgent, mockConfig);
      
      // Usa alguns agentes para testar estatísticas de uso
      registry.get('agent1');
      registry.get('agent1'); // Usado 2 vezes
      registry.get('agent2'); // Usado 1 vez
      
      const stats = registry.getStats();
      
      expect(stats.totalAgents).toBe(3);
      expect(stats.agentsByType).toEqual({
        'test': 2,
        'another': 1
      });
      expect(stats.mostUsed).toHaveLength(3);
      expect(stats.mostUsed[0]).toEqual({ name: 'agent1', usageCount: 2 });
    });
  });

  describe('uso do agente', () => {
    beforeEach(() => {
      registry.register('test-agent', MockAgent, mockConfig);
    });

    it('deve incrementar contador de uso ao obter agente', () => {
      const stats1 = registry.getStats();
      expect(stats1.mostUsed[0]?.usageCount || 0).toBe(0);
      
      registry.get('test-agent');
      
      const stats2 = registry.getStats();
      expect(stats2.mostUsed[0].usageCount).toBe(1);
    });

    it('deve executar agente corretamente', async () => {
      const agent = registry.get('test-agent');
      expect(agent).not.toBeNull();
      
      const messages = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there' }
      ];
      
      const result = await agent!.execute(messages);
      
      expect(result.success).toBe(true);
      expect(result.content).toContain('Mock response');
      expect(result.messages).toEqual(messages);
      expect(result.metadata?.mock).toBe(true);
    });
  });

  describe('singleton', () => {
    it('deve retornar mesma instância do singleton', () => {
      const instance1 = AgentRegistry.getInstance();
      const instance2 = AgentRegistry.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });
});