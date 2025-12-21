import type { FlowDefinition } from '@/flows/interfaces/flowDefinition.interface';
import type { FlowRegistry } from '@/flows/interfaces/flowRegistry.interface';

export class FlowRegistryImpl implements FlowRegistry {
  private readonly flows: Map<string, FlowDefinition> = new Map();

  register(flowId: string, flow: FlowDefinition): void {
    if (!flowId || flowId.trim().length === 0) {
      throw new Error('flowId is required');
    }

    if (!flow) {
      throw new Error('flow definition is required');
    }

    if (flow.id && flow.id !== flowId) {
      throw new Error(`flowId '${flowId}' does not match flow.id '${flow.id}'`);
    }

    if (this.flows.has(flowId)) {
      throw new Error(`Flow '${flowId}' already registered`);
    }

    this.flows.set(flowId, flow);
  }

  get(flowId: string): FlowDefinition {
    const flow = this.flows.get(flowId);
    if (!flow) {
      throw new Error(`Flow '${flowId}' not found`);
    }

    return flow;
  }

  has(flowId: string): boolean {
    return this.flows.has(flowId);
  }

  list(): string[] {
    return Array.from(this.flows.keys());
  }

  unregister(flowId: string): void {
    if (!this.flows.has(flowId)) {
      throw new Error(`Flow '${flowId}' not found`);
    }

    this.flows.delete(flowId);
  }
}
