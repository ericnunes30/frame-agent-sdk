import { OpenAICompatibleProvider } from '@/providers/providers/openaiCompatibleProvider';
import OpenAI from 'openai';

jest.mock('openai');

describe('OpenAICompatibleProvider (thinking separation)', () => {
  let provider: OpenAICompatibleProvider;
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    };
    (OpenAI as unknown as jest.Mock).mockImplementation(() => mockClient);
    provider = new OpenAICompatibleProvider('test-key');
  });

  it('non-stream: separa reasoning_content em metadata.thinking', async () => {
    mockClient.chat.completions.create.mockResolvedValue({
      model: 'x',
      usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
      choices: [{ message: { role: 'assistant', content: 'Final answer', reasoning_content: 'Raw thinking' } }],
    });

    const res = await provider.chatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hi' } as any],
      apiKey: 'k',
      baseUrl: 'https://example.com/v1',
      thinking: { mode: 'raw' },
    });

    expect(res.content).toBe('Final answer');
    expect((res.metadata as any).thinking).toBe('Raw thinking');
    expect((res.metadata as any).thinking_type).toBe('raw');
  });

  it('stream: nao mistura reasoning_content em content', async () => {
    async function* mockStream() {
      yield { choices: [{ delta: { reasoning_content: 'THINK1 ' } }] };
      yield { choices: [{ delta: { content: 'Hello' } }] };
      yield { choices: [{ delta: { content: ' World', reasoning_content: 'THINK2' } }] };
    }

    mockClient.chat.completions.create.mockResolvedValue(mockStream());

    const res = await provider.chatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hi' } as any],
      apiKey: 'k',
      baseUrl: 'https://example.com/v1',
      stream: true,
      thinking: { mode: 'raw' },
    });

    expect(res.content).toBe('Hello World');
    expect((res.metadata as any).thinking).toContain('THINK1');
    expect((res.metadata as any).thinking).toContain('THINK2');
  });

  it('non-stream: extrai <think> do content e remove do texto final', async () => {
    mockClient.chat.completions.create.mockResolvedValue({
      model: 'x',
      choices: [{ message: { role: 'assistant', content: '<think>abc</think>Final' } }],
    });

    const res = await provider.chatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hi' } as any],
      apiKey: 'k',
      baseUrl: 'https://example.com/v1',
      thinking: { mode: 'raw' },
    });

    expect(res.content).toBe('Final');
    expect((res.metadata as any).thinking).toBe('abc');
    expect((res.metadata as any).thinking_source).toBeDefined();
  });
});

