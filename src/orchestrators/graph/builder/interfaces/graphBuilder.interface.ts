import type { GraphDefinition, GraphNode, ConditionalEdge } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';

export interface GraphBuilderOptions {
  endNodeName?: string;
  maxSteps?: number;
}

export interface IGraphBuilder {
  addNode(name: string, node: GraphNode): this;
  addEdge(from: string, to: string): this;
  addConditionalEdge(from: string, edge: ConditionalEdge): this;
  setEntryPoint(name: string): this;
  setEndNode(name: string): this;
  build(): GraphDefinition;
  getMaxSteps(): number | undefined;
}
