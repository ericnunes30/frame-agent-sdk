import { truncateString } from '@/telemetry/utils/truncate';

const SECRET_KEY_NAMES = new Set([
  'apiKey',
  'api_key',
  'authorization',
  'token',
  'password',
  'secret',
]);

function redactScalar(value: string): string {
  // env-style: FOO_API_KEY=...
  value = value.replace(/([A-Z0-9_]*_API_KEY=)([^\s]+)/g, '$1[REDACTED]');
  // Bearer tokens
  value = value.replace(/Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*/g, 'Bearer [REDACTED]');
  // common key prefixes
  value = value.replace(/\bsk-[^\s]{10,}\b/g, 'sk-[REDACTED]');
  value = value.replace(/\bcpk_[^\s]{10,}\b/g, 'cpk_[REDACTED]');
  return value;
}

export function redactUnknown(value: unknown, maxChars: number): unknown {
  if (value == null) return value;

  if (typeof value === 'string') {
    return truncateString(redactScalar(value), maxChars);
  }

  if (typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map((v) => redactUnknown(v, maxChars));
  }

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SECRET_KEY_NAMES.has(k)) {
      out[k] = '[REDACTED]';
      continue;
    }
    out[k] = redactUnknown(v, maxChars);
  }
  return out;
}
