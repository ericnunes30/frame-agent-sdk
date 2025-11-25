// tests/unit/providers/adapter/providerAdapter.test.ts
import { ProviderAdapter } from '@/providers/adapter/providerAdapter';
import { getProvider } from '@/providers/providers';
import { ProviderConfig } from '@/providers/adapter/providerAdapter.interface';

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
    });
});
