// src/orchestrators/workflows/graph/GraphEngine.ts

import { GraphNode } from './GraphNode';
import { GraphEdge } from './GraphEdge';
import { ConditionalRouter } from './ConditionalRouter';
import { ParallelExecutor } from './ParallelExecutor';
import { StateManager } from '../core/stateManager';
import { NodeType } from '../core/enums';

/**
 * The main execution engine for graph-based workflows.
 *
 * This engine traverses a directed acyclic graph (DAG), executes the actions
 * associated with each node, and manages the overall flow of control. It supports

 * parallel execution for independent nodes and conditional routing for dynamic paths.
 */
export class GraphEngine {
  private readonly nodes: Map<string, GraphNode>;
  private readonly edges: GraphEdge[];
  private readonly conditionalRouters: Map<string, ConditionalRouter>;
  private readonly adjacency: Map<string, string[]>;
  private readonly inDegree: Map<string, number>;

  constructor(
    nodes: GraphNode[],
    edges: GraphEdge[],
    conditionalRouters: ConditionalRouter[] = []
  ) {
    this.nodes = new Map(nodes.map((node) => [node.id, node]));
    this.edges = edges;
    this.conditionalRouters = new Map(
      conditionalRouters.map((router) => [router.sourceId, router])
    );
    this.adjacency = new Map();
    this.inDegree = new Map();

    this.buildGraph();
  }

  /**
   * Builds the graph's adjacency list and in-degree map for topological sorting.
   */
  private buildGraph(): void {
    for (const node of this.nodes.values()) {
      this.adjacency.set(node.id, []);
      this.inDegree.set(node.id, 0);
    }

    for (const edge of this.edges) {
      this.adjacency.get(edge.sourceId)?.push(edge.targetId);
      this.inDegree.set(
        edge.targetId,
        (this.inDegree.get(edge.targetId) || 0) + 1
      );
    }
  }

  /**
   * Executes the graph workflow.
   * @param stateManager The state manager for this execution.
   */
  public async run(stateManager: StateManager): Promise<void> {
    const queue: string[] = [];
    for (const [nodeId, degree] of this.inDegree.entries()) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    while (queue.length > 0) {
      const nodesToExecute = this.getRunnableNodes(queue);
      const executableGraphNodes = nodesToExecute.map(
        (id) => this.nodes.get(id)!
      );

      await ParallelExecutor.execute(executableGraphNodes, stateManager);

      for (const nodeId of nodesToExecute) {
        queue.shift();

        // Handle conditional routing
        if (this.conditionalRouters.has(nodeId)) {
          const router = this.conditionalRouters.get(nodeId)!;
          const nextNodeId = router.getNextNode(stateManager.getState());
          if (nextNodeId && this.nodes.has(nextNodeId)) {
            const currentDegree = this.inDegree.get(nextNodeId)!;
            this.inDegree.set(nextNodeId, currentDegree - 1);
            if (currentDegree - 1 === 0) {
              queue.push(nextNodeId);
            }
          }
        } else {
          // Standard flow
          const neighbors = this.adjacency.get(nodeId) || [];
          for (const neighborId of neighbors) {
            const currentDegree = this.inDegree.get(neighborId)!;
            this.inDegree.set(neighborId, currentDegree - 1);
            if (currentDegree - 1 === 0) {
              queue.push(neighborId);
            }
          }
        }
      }
    }
  }

  /**
   * Gets all nodes from the queue that can be run in parallel.
   */
  private getRunnableNodes(queue: string[]): string[] {
    const runnableNodes: string[] = [];
    for (const nodeId of queue) {
      if (this.inDegree.get(nodeId) === 0) {
        runnableNodes.push(nodeId);
      }
    }
    return runnableNodes;
  }
}
