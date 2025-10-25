// src/orchestrators/workflows/graph/GraphEdge.ts

/**
 * Represents a directed edge in the execution graph, connecting two nodes.
 *
 * An edge defines the flow of control from a source node to a target node,
 * representing a dependency. A workflow cannot proceed to the target node
 * until the source node has successfully completed.
 */
export class GraphEdge {
  public readonly sourceId: string;
  public readonly targetId: string;

  /**
   * Initializes a new instance of the GraphEdge.
   * @param sourceId The unique identifier of the source node.
   * @param targetId The unique identifier of the target node.
   */
  constructor(sourceId: string, targetId: string) {
    if (sourceId === targetId) {
      throw new Error('Graph edges cannot be self-referential.');
    }
    this.sourceId = sourceId;
    this.targetId = targetId;
  }
}
