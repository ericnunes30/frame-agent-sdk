import type { FlowDefinition } from '@/flows/interfaces/flowDefinition.interface';

export interface FlowRegistry {
  register(flowId: string, flow: FlowDefinition): void;
  get(flowId: string): FlowDefinition;
  has(flowId: string): boolean;
  list(): string[];
  unregister(flowId: string): void;
}
