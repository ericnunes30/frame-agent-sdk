// src/orchestrators/workflows/builders/GraphBuilder.ts

import { GraphNode } from '../graph/GraphNode';
import { GraphEdge } from '../graph/GraphEdge';
import { GraphEngine } from '../graph/GraphEngine';
import { ConditionalRouter } from '../graph/ConditionalRouter';
import { NodeType } from '../core/enums';
import type { IAgent } from '../core/interfaces';

/**
 * A fluent API for constructing graph-based workflows.
 *
 * This builder simplifies the process of creating complex workflows by providing
 * methods to chain together the definition of nodes, edges, and conditional routers.
 */
export class GraphBuilder {
  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private conditionalRouters: ConditionalRouter[] = [];

  /**
   * Adds a new node to the graph.
   * @param id A unique identifier for the node.
   * @param type The type of the node.
   * @param action The agent associated with this node (optional).
   * @returns The builder instance for chaining.
   */
  public addNode(id: string, type: NodeType, action: IAgent | null = null): this {
    if (this.nodes.some(n => n.id === id)) {
      throw new Error(`Node with id "${id}" already exists.`);
    }
    this.nodes.push(new GraphNode(id, type, action));
    return this;
  }

  /**
   * Adds a directed edge connecting two nodes.
   * @param sourceId The ID of the source node.
   * @param targetId The ID of the target node.
   * @returns The builder instance for chaining.
   */
  public addEdge(sourceId: string, targetId: string): this {
    this.edges.push(new GraphEdge(sourceId, targetId));
    return this;
  }

  /**
   * Adds a conditional router to a node.
   * @param sourceId The ID of the node whose output will determine the route.
   * @param routes A map of output values to target node IDs.
   * @returns The builder instance for chaining.
   */
  public addConditionalRouter(sourceId: string, routes: Record<string, string>): this {
    this.conditionalRouters.push(new ConditionalRouter(sourceId, routes));
    return this;
  }

  /**
   * Builds and returns a new GraphEngine instance.
   * @returns A configured instance of the GraphEngine.
   */
  public build(): GraphEngine {
    // Basic validation
    if (this.nodes.length === 0) {
      throw new Error('Cannot build a graph with no nodes.');
    }
    return new GraphEngine(this.nodes, this.edges, this.conditionalRouters);
  }
}
