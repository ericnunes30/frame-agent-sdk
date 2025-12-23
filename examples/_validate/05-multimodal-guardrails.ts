import 'dotenv/config';
import 'tsconfig-paths/register';

import { OpenAICompatibleProvider } from '../../src/providers/providers/openaiCompatibleProvider';
import { VisionNotSupportedError } from '../../src/providers/errors';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

async function main() {
  const provider = new OpenAICompatibleProvider('fake-key');

  try {
    await provider.chatCompletion({
      provider: 'openaiCompatible',
      model: 'fake-model',
      apiKey: 'fake-key',
      baseUrl: 'https://example.invalid/v1',
      systemPrompt: 'You are helpful.',
      capabilities: { supportsVision: false },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'describe the image' },
            {
              type: 'image_url',
              image_url: {
                url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
              },
            },
          ],
        },
      ],
    });
    throw new Error('Expected VisionNotSupportedError');
  } catch (err) {
    assert(err instanceof VisionNotSupportedError, 'expected VisionNotSupportedError');
  }

  console.log('[OK] multimodal-guardrails');
}

main().catch((err) => {
  console.error('[FAIL] multimodal-guardrails');
  console.error(err);
  process.exitCode = 1;
});

