import type { IGraphState } from '@/orchestrators/graph/core/interfaces/graphState.interface';
import { GraphStatus } from '@/orchestrators/graph/core/enums/graphEngine.enum';
import type { GraphEngine } from '@/orchestrators/graph/core/GraphEngine';

export interface GraphNodeControl {
  nextNodeOverride?: string;
  shouldEnd?: boolean;
}

export interface GraphNodeResult extends Partial<IGraphState>, GraphNodeControl {}

export interface GraphNode {
  (state: IGraphState, engine: GraphEngine): Promise<GraphNodeResult>;
}

export interface ConditionalEdge {
  (state: IGraphState): string;
}

export interface GraphDefinition {
  entryPoint: string;
  endNodeName: string;
  nodes: Record<string, GraphNode>;
  edges: Record<string, string | ConditionalEdge>;
}

export interface GraphRunResult {
  state: IGraphState;
  status: GraphStatus;
}
