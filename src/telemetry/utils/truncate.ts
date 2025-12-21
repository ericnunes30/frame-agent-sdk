export function truncateString(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value;
  const head = value.slice(0, Math.max(0, maxChars - 14));
  return `${head}…(truncated)`;
}

export function safeStringify(value: unknown, maxChars: number): string {
  try {
    const s = typeof value === 'string' ? value : JSON.stringify(value);
    return truncateString(s, maxChars);
  } catch {
    return truncateString(String(value), maxChars);
  }
}

