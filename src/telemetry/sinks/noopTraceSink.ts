import type { TraceSink } from '@/telemetry/interfaces/traceSink.interface';

export const noopTraceSink: TraceSink = {
  emit() {},
};
