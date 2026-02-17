// tests/unit/providers/adapter/providerAdapter.test.ts
import { ProviderAdapter } from '@/providers/adapter/providerAdapter';
import { getProvider } from '@/providers/providers';
import { ProviderConfig } from '@/providers/adapter/providerAdapter.interface';
import type { TraceContext, TraceSink } from '@/telemetry';

// Mock do ProviderRegistry
jest.mock('@/providers/providers');

describe('ProviderAdapter', () => {
    const mockChatCompletion = jest.fn();

    // Mock Provider Class
    class MockProvider {
        constructor(public apiKey: string) { }
        chatCompletion = mockChatCompletion;
    }

    beforeEach(() => {
        jest.clearAllMocks();
        (getProvider as jest.Mock).mockReturnValue(MockProvider);
        // Mock console.log to avoid cluttering test output
        jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('chatCompletion', () => {
        it('deve parsear modelo e delegar para provedor correto', async () => {
            // Arrange
            const config: ProviderConfig = {
                model: 'mock-gpt-4',
                apiKey: 'key',
                messages: [],
                systemPrompt: 'System',
                temperature: 0.7,
                stream: false
            };

            // Act
            await ProviderAdapter.chatCompletion(config);

            // Assert
            expect(getProvider).toHaveBeenCalledWith('mock');
            expect(mockChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
                model: 'gpt-4', // Prefixo removido
                apiKey: 'key',
                systemPrompt: 'System'
            }));
        });

        it('deve priorizar provedor explícito sobre inferência do modelo', async () => {
            // Arrange
            const config: ProviderConfig = {
                model: 'mock-gpt-4',
                provider: 'explicit-provider',
                apiKey: 'key',
                messages: [],
                systemPrompt: 'System'
            };

            (getProvider as jest.Mock).mockImplementation((name) => {
                if (name === 'explicit-provider') return MockProvider;
                throw new Error(`Provider ${name} not found`);
            });

            // Act
            await ProviderAdapter.chatCompletion(config);

            // Assert
            expect(getProvider).toHaveBeenCalledWith('explicit-provider');
            // Não deve tentar inferir 'mock' do modelo 'mock-gpt-4'
        });

        it('deve usar openaiCompatible se provider não existir mas tiver baseUrl', async () => {
            // Arrange
            (getProvider as jest.Mock).mockImplementation((name) => {
                if (name === 'unknown') throw new Error('Not found');
                return MockProvider;
            });

            const config: ProviderConfig = {
                model: 'unknown-model',
                apiKey: 'key',
                messages: [],
                baseUrl: 'http://local',
                temperature: 0.7,
                stream: false,
                systemPrompt: 'System'
            };

            // Act
            await ProviderAdapter.chatCompletion(config);

            // Assert
            // Deve tentar buscar 'unknown' primeiro (hasProvider check)
            // Se falhar e tiver baseUrl, deve buscar 'openaiCompatible'
            expect(getProvider).toHaveBeenCalledWith('openaiCompatible');
        });

        it('deve lançar erro se provedor não implementar chatCompletion', async () => {
            // Arrange
            class BadProvider { constructor(k: string) { } } // Sem chatCompletion
            (getProvider as jest.Mock).mockReturnValue(BadProvider);

            const config: ProviderConfig = {
                model: 'bad-model',
                apiKey: 'key',
                messages: [],
                temperature: 0.7,
                stream: false,
                systemPrompt: 'System'
            };

            // Act & Assert
            await expect(ProviderAdapter.chatCompletion(config))
                .rejects.toThrow('não implementa o método chatCompletion');
        });

        it('deve incluir prompt/outputPreview quando telemetry.includePrompts=true', async () => {
            // Arrange
            mockChatCompletion.mockResolvedValue({
                content: 'Hello back',
                metadata: {
                    usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
                    finishReason: 'stop'
                }
            });

            const traceEvents: any[] = [];
            const trace: TraceSink = { emit: (event) => traceEvents.push(event) };
            const traceContext: TraceContext = { runId: 'run-123', orchestrator: 'graph' };

            const config: ProviderConfig = {
                model: 'mock-gpt-4',
                apiKey: 'key',
                messages: [{ role: 'user', content: 'Hello' } as any],
                systemPrompt: 'System prompt',
                trace,
                telemetry: { enabled: true, level: 'info', includePrompts: true },
                traceContext
            };

            // Act
            await ProviderAdapter.chatCompletion(config);

            // Assert
            const started = traceEvents.find((e) => e.type === 'llm_request_started');
            const finished = traceEvents.find((e) => e.type === 'llm_request_finished');

            expect(started).toBeDefined();
            expect((started.data as any)?.prompt).toEqual(
                expect.objectContaining({
                    systemPrompt: 'System prompt',
                    messages: [{ role: 'user', content: 'Hello' }]
                })
            );

            expect(finished).toBeDefined();
            expect((finished.data as any)?.outputPreview).toBe('Hello back');
        });
    });
});
