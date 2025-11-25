// tests/unit/providers/providers/openAiProvider.test.ts
import { OpenAIProvider } from '@/providers/providers/openAiProvider';
import OpenAI from 'openai';

// Mock OpenAI
jest.mock('openai');

describe('OpenAIProvider', () => {
    let provider: OpenAIProvider;
    let mockClient: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockClient = {
            chat: {
                completions: {
                    create: jest.fn()
                }
            }
        };
        (OpenAI as unknown as jest.Mock).mockImplementation(() => mockClient);
        provider = new OpenAIProvider('test-key');
    });

    describe('chatCompletion', () => {
        it('deve fazer chamada de chat completion sem stream', async () => {
            // Arrange
            const mockResponse = {
                choices: [{ message: { role: 'assistant', content: 'Response' } }]
            };
            mockClient.chat.completions.create.mockResolvedValue(mockResponse);

            const history = [{ role: 'user', content: 'Hi' }];

            // Act
            const result = await provider.chatCompletion(
                history,
                'gpt-4',
                'key',
                0.7,
                false, // useStream
                'System Prompt'
            );

            // Assert
            expect(mockClient.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
                model: 'gpt-4',
                stream: false,
                messages: [
                    { role: 'system', content: 'System Prompt' },
                    { role: 'user', content: 'Hi' }
                ]
            }));
            expect(result).toEqual({ role: 'assistant', content: 'Response' });
        });

        it('deve processar resposta com stream', async () => {
            // Arrange
            async function* mockStreamResponse() {
                yield { choices: [{ delta: { content: 'Hello' } }] };
                yield { choices: [{ delta: { content: ' World' } }] };
            }
            mockClient.chat.completions.create.mockResolvedValue(mockStreamResponse());

            const history = [{ role: 'user', content: 'Hi' }];

            // Act
            const result = await provider.chatCompletion(
                history,
                'gpt-4',
                'key',
                0.7,
                true, // useStream
                'System Prompt'
            );

            // Assert
            expect(mockClient.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
                stream: true
            }));
            expect(result).toEqual({ role: 'assistant', content: 'Hello World' });
        });

        it('deve aplicar parâmetros opcionais (maxTokens, topP)', async () => {
            // Arrange
            mockClient.chat.completions.create.mockResolvedValue({
                choices: [{ message: { content: 'OK' } }]
            });

            // Act
            await provider.chatCompletion(
                [],
                'gpt-4',
                'key',
                0.7,
                false,
                'System',
                100, // maxTokens
                0.9  // topP
            );

            // Assert
            expect(mockClient.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
                max_tokens: 100,
                top_p: 0.9
            }));
        });

        it('deve atualizar cliente se nova apiKey for fornecida', async () => {
            // Arrange
            mockClient.chat.completions.create.mockResolvedValue({
                choices: [{ message: { content: 'OK' } }]
            });

            // Act
            await provider.chatCompletion(
                [],
                'gpt-4',
                'new-key', // Nova key
                0.7,
                false,
                'System'
            );

            // Assert
            expect(OpenAI).toHaveBeenCalledTimes(2); // Constructor + nova chamada
            expect(OpenAI).toHaveBeenLastCalledWith({ apiKey: 'new-key' });
        });
    });
});
