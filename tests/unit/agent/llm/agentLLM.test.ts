// tests/unit/agent/llm/agentLLM.test.ts
import { AgentLLM } from '@/agent/llm/agentLLM';
import { ProviderAdapter } from '@/providers/adapter/providerAdapter';
import { PromptBuilder } from '@/promptBuilder/promptBuilder';
import { Message } from '@/memory/memory.interface';
import { AgentLLMConfig } from '@/agent/interfaces/agentLLM.interface';

// Mocks
jest.mock('@/providers/adapter/providerAdapter');
jest.mock('@/promptBuilder/promptBuilder');

describe('AgentLLM', () => {
    const mockConfig: AgentLLMConfig = {
        model: 'openai-gpt-4',
        apiKey: 'test-key',
        defaults: {
            temperature: 0.7,
            maxTokens: 1000
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock default implementation for PromptBuilder
        (PromptBuilder.determineSystemPrompt as jest.Mock).mockReturnValue({
            systemPrompt: 'Mock System Prompt',
            source: 'test'
        });

        // Mock default implementation for ProviderAdapter
        (ProviderAdapter.chatCompletion as jest.Mock).mockResolvedValue({
            content: 'Mock Response',
            metadata: { usage: { total_tokens: 10 } }
        });
    });

    describe('constructor & fromConfig', () => {
        it('deve criar instância via constructor', () => {
            const agent = new AgentLLM({
                model: 'gpt-4',
                apiKey: 'key'
            });
            expect(agent).toBeInstanceOf(AgentLLM);
        });

        it('deve criar instância via fromConfig', () => {
            const agent = AgentLLM.fromConfig(mockConfig);
            expect(agent).toBeInstanceOf(AgentLLM);
        });
    });

    describe('invoke', () => {
        let agent: AgentLLM;

        beforeEach(() => {
            agent = AgentLLM.fromConfig(mockConfig);
        });

        it('deve invocar provedor com parâmetros corretos', async () => {
            // Arrange
            const messages: Message[] = [{ role: 'user', content: 'Hello' }];

            // Act
            const result = await agent.invoke({
                messages,
                mode: 'chat',
                agentInfo: { name: 'Bot', goal: 'Help', backstory: 'Bot backstory' }
            });

            // Assert
            expect(PromptBuilder.determineSystemPrompt).toHaveBeenCalled();
            expect(ProviderAdapter.chatCompletion).toHaveBeenCalledWith(expect.objectContaining({
                model: 'openai-gpt-4',
                apiKey: 'test-key',
                messages,
                systemPrompt: 'Mock System Prompt',
                temperature: 0.7, // Default from config
                maxTokens: 1000   // Default from config
            }));
            expect(result.content).toBe('Mock Response');
        });

        it('deve permitir override de parâmetros por chamada', async () => {
            // Arrange
            const messages: Message[] = [{ role: 'user', content: 'Hello' }];

            // Act
            await agent.invoke({
                messages,
                mode: 'chat',
                agentInfo: { name: 'Bot', goal: 'Help', backstory: 'Bot backstory' },
                temperature: 0.1,
                maxTokens: 50
            });

            // Assert
            expect(ProviderAdapter.chatCompletion).toHaveBeenCalledWith(expect.objectContaining({
                temperature: 0.1,
                maxTokens: 50
            }));
        });

        it('deve repassar metadados da resposta', async () => {
            // Act
            const result = await agent.invoke({
                messages: [],
                mode: 'chat',
                agentInfo: { name: 'Bot', goal: 'Help', backstory: 'Bot backstory' }
            });

            // Assert
            expect(result.metadata).toEqual({ usage: { total_tokens: 10 } });
        });

        it('deve lidar com resposta nula do provedor', async () => {
            // Arrange
            (ProviderAdapter.chatCompletion as jest.Mock).mockResolvedValue({
                content: null
            });

            // Act
            const result = await agent.invoke({
                messages: [],
                mode: 'chat',
                agentInfo: { name: 'Bot', goal: 'Help', backstory: 'Bot backstory' }
            });

            // Assert
            expect(result.content).toBeNull();
        });

        it('deve passar baseUrl se configurado', async () => {
            // Arrange
            const customAgent = new AgentLLM({
                model: 'local-model',
                apiKey: 'key',
                baseUrl: 'http://localhost:1234'
            });

            // Act
            await customAgent.invoke({
                messages: [],
                mode: 'chat',
                agentInfo: { name: 'Bot', goal: 'Help', backstory: 'Bot backstory' }
            });

            // Assert
            expect(ProviderAdapter.chatCompletion).toHaveBeenCalledWith(expect.objectContaining({
                baseUrl: 'http://localhost:1234'
            }));
        });
    });
});
