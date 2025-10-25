// src/orchestrators/workflows/core/enums.ts

/**
 * Defines the possible execution states of an agent or a workflow node.
 */
export enum AgentStatus {
  /** The agent is ready to start but has not yet begun execution. */
  PENDING = 'PENDING',
  /** The agent is currently executing its task. */
  RUNNING = 'RUNNING',
  /** The agent has successfully completed its task. */
  COMPLETED = 'COMPLETED',
  /** The agent failed to complete its task. */
  FAILED = 'FAILED',
}

/**
 * Specifies the type of workflow being defined, allowing the orchestrator
 * to use the correct execution engine.
 */
export enum FlowType {
  /** A workflow based on a directed acyclic graph (DAG). */
  GRAPH = 'GRAPH',
  /** A workflow based on a hierarchical structure of agents. */
  HIERARCHY = 'HIERARCHY',
  /** A hybrid workflow combining both graph and hierarchy concepts. */
  INTEGRATED = 'INTEGRATED',
}

/**
 * Distinguishes between different types of nodes within a graph-based workflow.
 */
export enum NodeType {
  /** A standard processing node, typically an agent. */
  AGENT = 'AGENT',
  /** A node that routes the flow based on a condition. */
  CONDITIONAL = 'CONDITIONAL',
  /** An entry point for the workflow. */
  START = 'START',
  /** A terminal point for the workflow. */
  END = 'END',
}
