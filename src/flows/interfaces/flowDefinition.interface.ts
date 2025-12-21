import type { GraphDefinition } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';

export type FlowKind = 'graph' | 'agentFlow';

export interface FlowDefinition {
  id: string;
  version: string;
  kind: FlowKind;
  description?: string;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  capabilities?: {
    usesTools?: boolean;
    requiresHuman?: boolean;
  };
  graph?: GraphDefinition;
  factory?: (deps: Record<string, unknown>) => GraphDefinition;
}
