import { AgentRegistry } from '@/agent/registry/AgentRegistry';
import type { IAgent, IAgentConfig, AgentExecutionResult, AgentExecutionOptions } from '@/agent/interfaces';
import type { AgentInfo } from '@/promptBuilder';
import { Message } from '@/memory';

// Mock Agent Implementation
class MockAgent implements IAgent {
    public id: string = 'mock-agent';
    public type: string = 'mock';
    public config: IAgentConfig;

    constructor(config: IAgentConfig) {
        this.config = config;
    }

    async execute(messages: Message[], options?: AgentExecutionOptions): Promise<AgentExecutionResult> {
        return {
            content: 'Mock response',
            messages: [],
            success: true,
            metadata: {
                executionTime: 0,
                startTime: new Date(),
                endTime: new Date()
            }
        };
    }

    configure(config: Partial<IAgentConfig>): void {
        this.config = { ...this.config, ...config };
    }

    getInfo(): AgentInfo {
        return this.config.agentInfo;
    }

    validate(): boolean {
        return true;
    }

    reset(): void { }
}

describe('AgentRegistry', () => {
    let registry: AgentRegistry;
    const mockConfig: IAgentConfig = {
        type: 'mock',
        provider: 'mock-provider',
        model: 'mock-model',
        agentInfo: {
            name: 'Mock Agent',
            goal: 'Test',
            backstory: 'Testing'
        }
    };

    beforeEach(() => {
        // Create a new instance for each test to ensure isolation
        registry = new AgentRegistry();
    });

    describe('register', () => {
        it('should register a valid agent', () => {
            const result = registry.register('test-agent', MockAgent, mockConfig);
            expect(result).toBe(true);
            expect(registry.has('test-agent')).toBe(true);
        });

        it('should fail if name is empty', () => {
            const result = registry.register('', MockAgent, mockConfig);
            expect(result).toBe(false);
        });

        it('should fail if agent class is missing', () => {
            const result = registry.register('test-agent', null as any, mockConfig);
            expect(result).toBe(false);
        });

        it('should fail if config is missing', () => {
            const result = registry.register('test-agent', MockAgent, null as any);
            expect(result).toBe(false);
        });

        it('should fail if agent already exists and overwrite is false', () => {
            registry.register('test-agent', MockAgent, mockConfig);
            const result = registry.register('test-agent', MockAgent, mockConfig);
            expect(result).toBe(false);
        });

        it('should overwrite if agent exists and overwrite is true', () => {
            registry.register('test-agent', MockAgent, mockConfig);
            const result = registry.register('test-agent', MockAgent, mockConfig, { overwrite: true });
            expect(result).toBe(true);
        });

        it('should fail if agent class is invalid (missing methods)', () => {
            class InvalidAgent { }
            const result = registry.register('invalid-agent', InvalidAgent as any, mockConfig);
            expect(result).toBe(false);
        });
    });

    describe('get', () => {
        it('should return a registered agent instance', () => {
            registry.register('test-agent', MockAgent, mockConfig);
            const agent = registry.get('test-agent');
            expect(agent).toBeInstanceOf(MockAgent);
            expect(agent?.config).toEqual(mockConfig);
        });

        it('should return null if agent not found', () => {
            const agent = registry.get('non-existent');
            expect(agent).toBeNull();
        });

        it('should merge config overrides', () => {
            registry.register('test-agent', MockAgent, mockConfig);
            const overrideConfig = { model: 'overridden-model' };
            const agent = registry.get('test-agent', overrideConfig);
            expect(agent?.config.model).toBe('overridden-model');
            expect(agent?.config.provider).toBe('mock-provider');
        });

        it('should increment usage count', () => {
            registry.register('test-agent', MockAgent, mockConfig);
            registry.get('test-agent');
            const stats = registry.getStats();
            const agentStat = stats.mostUsed.find(a => a.name === 'test-agent');
            expect(agentStat?.usageCount).toBe(1);
        });
    });

    describe('list', () => {
        it('should list all registered agents', () => {
            registry.register('agent1', MockAgent, mockConfig);
            registry.register('agent2', MockAgent, mockConfig);
            const list = registry.list();
            expect(list).toHaveLength(2);
            expect(list.map(a => a.name)).toContain('agent1');
            expect(list.map(a => a.name)).toContain('agent2');
        });
    });

    describe('unregister', () => {
        it('should unregister an existing agent', () => {
            registry.register('test-agent', MockAgent, mockConfig);
            const result = registry.unregister('test-agent');
            expect(result).toBe(true);
            expect(registry.has('test-agent')).toBe(false);
        });

        it('should return false if agent does not exist', () => {
            const result = registry.unregister('non-existent');
            expect(result).toBe(false);
        });
    });

    describe('clear', () => {
        it('should clear all agents and stats', () => {
            registry.register('agent1', MockAgent, mockConfig);
            registry.get('agent1'); // Increment usage
            registry.clear();
            expect(registry.list()).toHaveLength(0);
            expect(registry.getStats().totalAgents).toBe(0);
            expect(registry.getStats().mostUsed).toHaveLength(0);
        });
    });

    describe('singleton', () => {
        it('should return the same instance', () => {
            const instance1 = AgentRegistry.getInstance();
            const instance2 = AgentRegistry.getInstance();
            expect(instance1).toBe(instance2);
        });
    });
});
