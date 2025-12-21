export function createTraceId(): string {
  const anyGlobal = globalThis as any;
  const uuid = anyGlobal?.crypto?.randomUUID?.bind(anyGlobal.crypto);
  if (uuid) return uuid();
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

