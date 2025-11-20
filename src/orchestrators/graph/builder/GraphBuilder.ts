import type { GraphDefinition, GraphNode, ConditionalEdge } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import type { IGraphBuilder, GraphBuilderOptions } from '@/orchestrators/graph/builder/interfaces/graphBuilder.interface';

export class GraphBuilder implements IGraphBuilder {
  private readonly nodes: Record<string, GraphNode>;
  private readonly edges: Record<string, string | ConditionalEdge>;
  private entryPoint?: string;
  private endNodeName: string;
  private readonly maxSteps?: number;

  constructor(options?: GraphBuilderOptions) {
    this.nodes = {};
    this.edges = {};
    this.endNodeName = options?.endNodeName ?? '__end__';
    this.maxSteps = options?.maxSteps;
  }

  public addNode(name: string, node: GraphNode): this {
    this.assertName(name, 'node');
    if (this.nodes[name]) throw new Error(`Node '${name}' already registered`);
    this.nodes[name] = node;
    return this;
  }

  public addEdge(from: string, to: string): this {
    this.assertName(from, 'from');
    this.assertName(to, 'to');
    this.ensureNodeRegistered(from);
    if (to !== this.endNodeName) this.ensureNodeRegistered(to);
    if (this.edges[from]) throw new Error(`Edge for node '${from}' already defined`);
    this.guardSelfLoop(from, to);
    this.edges[from] = to;
    return this;
  }

  public addConditionalEdge(from: string, edge: ConditionalEdge): this {
    this.assertName(from, 'from');
    this.ensureNodeRegistered(from);
    if (this.edges[from]) throw new Error(`Edge for node '${from}' already defined`);
    this.edges[from] = edge;
    return this;
  }

  public setEntryPoint(name: string): this {
    this.assertName(name, 'entryPoint');
    this.ensureNodeRegistered(name);
    this.entryPoint = name;
    return this;
  }

  public setEndNode(name: string): this {
    this.assertName(name, 'endNode');
    this.endNodeName = name;
    return this;
  }

  public build(): GraphDefinition {
    if (!this.entryPoint) throw new Error('Entry point not set');
    this.ensureNodeRegistered(this.entryPoint);
    this.validateEdges();
    return {
      entryPoint: this.entryPoint,
      endNodeName: this.endNodeName,
      nodes: { ...this.nodes },
      edges: { ...this.edges },
    };
  }

  public getMaxSteps(): number | undefined {
    return this.maxSteps;
  }

  private assertName(value: string, label: string): void {
    if (!value) throw new Error(`Missing ${label}`);
    if (value.trim().length === 0) throw new Error(`Empty ${label}`);
  }

  private ensureNodeRegistered(name: string): void {
    const exists = Boolean(this.nodes[name]);
    if (!exists) throw new Error(`Node '${name}' not registered`);
  }

  private guardSelfLoop(from: string, to: string): void {
    const same = from === to;
    if (same) throw new Error(`Self-loop detected on node '${from}' without condition`);
  }

  private validateEdges(): void {
    const keys = Object.keys(this.edges);
    for (const key of keys) {
      this.ensureNodeRegistered(key);
      const edge = this.edges[key];
      const isString = typeof edge === 'string';
      if (isString) {
        const target = edge as string;
        if (target !== this.endNodeName) this.ensureNodeRegistered(target);
        continue;
      }
      const conditional = edge as ConditionalEdge;
      if (typeof conditional !== 'function') throw new Error(`Conditional edge for '${key}' must be a function`);
    }
  }
}
