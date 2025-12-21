import 'dotenv/config';
import 'tsconfig-paths/register';

import type { TraceEvent } from '../../src/telemetry/interfaces/traceEvent.interface';
import type { TraceSink } from '../../src/telemetry/interfaces/traceSink.interface';
import { emitTrace } from '../../src/telemetry/utils/traceEmitter';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

class CaptureSink implements TraceSink {
  public readonly events: TraceEvent[] = [];
  emit(event: TraceEvent): void {
    this.events.push(event);
  }
}

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (value == null) return out;
  if (typeof value === 'string') {
    out.push(value);
    return out;
  }
  if (typeof value !== 'object') return out;
  if (Array.isArray(value)) {
    for (const v of value) collectStrings(v, out);
    return out;
  }
  for (const v of Object.values(value as Record<string, unknown>)) {
    collectStrings(v, out);
  }
  return out;
}

async function main() {
  const trace = new CaptureSink();

  const originalSk = 'sk-1234567890abcdefghijklmnopqrstuvwxyzSECRET';
  const originalCpk = 'cpk_1234567890abcdefghijklmnopqrstuvwxyzSECRET';
  const originalBearer = 'Bearer abcdefghijklmnopqrstuvwxyz0123456789';

  const state: { metadata?: Record<string, unknown> } = { metadata: {} };

  emitTrace({
    trace,
    options: {
      enabled: true,
      level: 'info',
      persistToState: true,
      maxEvents: 10,
      maxPayloadChars: 60,
      includePrompts: false,
    },
    ctx: { runId: 'run-redaction', orchestrator: 'graph' },
    state,
    event: {
      type: 'run_started',
      level: 'info',
      message: `OPENAI_API_KEY=${originalSk} ${originalBearer} ${originalCpk}`,
      data: {
        apiKey: originalSk,
        authorization: originalBearer,
        token: originalCpk,
        nested: {
          password: 'super-secret-password',
          text: `OPENAI_API_KEY=${originalSk}`,
          long: `prefix-${'A'.repeat(200)}-${originalSk}-suffix`,
        },
      },
    },
  });

  assert(trace.events.length === 1, 'expected exactly 1 event in sink');
  const evt = trace.events[0];

  const persisted = ((state.metadata as any).trace as TraceEvent[] | undefined) ?? [];
  assert(persisted.length === 1, 'expected event persisted to state.metadata.trace');

  // Key-based redaction
  assert((evt.data as any).apiKey === '[REDACTED]', 'expected data.apiKey redacted');
  assert((evt.data as any).authorization === '[REDACTED]', 'expected data.authorization redacted');
  assert((evt.data as any).nested.password === '[REDACTED]', 'expected nested.password redacted');

  // Regex redaction
  assert(String(evt.message).includes('OPENAI_API_KEY=[REDACTED]'), 'expected env-style API key redacted in message');
  assert(String(evt.message).includes('Bearer [REDACTED]'), 'expected Bearer token redacted in message');
  assert(String(evt.message).includes('cpk_[REDACTED]'), 'expected cpk_ token redacted in message');

  // Truncation (we use a small maxPayloadChars)
  const longOut = String((evt.data as any).nested.long);
  assert(longOut.includes('truncated'), 'expected long field to be truncated');

  // No raw secret leaks in any string field of the event or persisted trace.
  const strings = collectStrings({ evt, persisted });
  assert(!strings.some((s) => s.includes(originalSk)), 'expected no raw sk- secret leak');
  assert(!strings.some((s) => s.includes(originalCpk)), 'expected no raw cpk_ secret leak');
  assert(!strings.some((s) => s.includes(originalBearer)), 'expected no raw Bearer secret leak');

  console.log('[OK] telemetry-redaction');
}

main().catch((err) => {
  console.error('[FAIL] telemetry-redaction');
  console.error(err);
  process.exitCode = 1;
});

