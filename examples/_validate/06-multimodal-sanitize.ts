import 'dotenv/config';
import 'tsconfig-paths/register';

import { sanitizeForLogs } from '../../src/memory/utils/messageContentUtils';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

async function main() {
  const dataUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

  const sanitized = sanitizeForLogs([
    { type: 'text', text: 'hello' },
    { type: 'image_url', image_url: { url: dataUrl } },
  ]);

  assert(!sanitized.includes('data:image/'), 'expected sanitized output to NOT include data url');
  assert(sanitized.includes('[image omitted'), 'expected image placeholder');

  console.log('[OK] multimodal-sanitize');
}

main().catch((err) => {
  console.error('[FAIL] multimodal-sanitize');
  console.error(err);
  process.exitCode = 1;
});

