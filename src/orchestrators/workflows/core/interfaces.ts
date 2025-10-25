// src/orchestrators/workflows/core/interfaces.ts

import type { LLM } from '../../../llm';
import type { ToolSchema } from '../../../promptBuilder';
import type { IChatHistoryManager } from '../../../memory';

/**
 * Represents the structured, isolated state for a single node within the workflow.
 * Each node's output and metadata are stored here to prevent collisions.
 */
export interface INodeState {
  output: unknown;
  metadata?: Record<string, any>;
}

/**
 * The global state for a workflow execution, structured as a map where each
 * key is a unique node ID. This ensures data isolation between nodes.
 */
export type IWorkflowState = Record<string, INodeState>;

/**
 * Defines a participant in the workflow. An agent has a specific role,
 * configuration, and access to tools, but is independent of the prompt text
 * which is managed by the PromptBuilder.
 */
export interface IAgent {
  id: string;
  role: string;
  config: {
    llm: LLM;
    memory: IChatHistoryManager;
    tools?: ToolSchema[];
  };
  run(context: any): Promise<any>;
}

/**
 * Represents a complete, executable workflow, composed of agents, nodes, and
 * the connections between them.
 */
export interface IFlow {
  id: string;
  name: string;
  // A ser detalhado: a estrutura do grafo/hierarquia
  structure: any;
}

/**
 * The main contract for the orchestrator, defining the public API for
 * executing workflows.
 */
export interface IOrchestrator {
  /**
   * Executes a given workflow with a specific input.
   * @param flow The workflow definition to execute.
   * @param initialState The initial state or input for the workflow.
   * @returns A promise that resolves with the final state of the workflow.
   */
  run(flow: IFlow, initialState: IWorkflowState): Promise<IWorkflowState>;
}
