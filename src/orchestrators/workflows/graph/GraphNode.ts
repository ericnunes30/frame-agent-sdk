// src/orchestrators/workflows/graph/GraphNode.ts

import type { IAgent } from '../core/interfaces';
import { NodeType } from '../core/enums';

/**
 * Represents a node in the execution graph.
 *
 * Each node has a unique ID, a specific type, and an associated action,
 * which is typically an agent that performs a task. The node is the fundamental
 * unit of work in the graph.
 */
export class GraphNode {
  public readonly id: string;
  public readonly type: NodeType;
  public readonly action: IAgent | null; // Can be null for non-agent nodes like START/END

  /**
   * Initializes a new instance of the GraphNode.
   * @param id A unique identifier for the node.
   * @param type The type of the node (e.g., AGENT, CONDITIONAL).
   * @param action The agent or function to be executed by this node. Can be null.
   */
  constructor(id: string, type: NodeType, action: IAgent | null = null) {
    this.id = id;
    this.type = type;
    this.action = action;
  }
}
