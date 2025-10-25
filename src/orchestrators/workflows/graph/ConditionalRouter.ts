// src/orchestrators/workflows/graph/ConditionalRouter.ts

import type { IWorkflowState } from '../core/interfaces';

/**
 * Defines the contract for a conditional router.
 * A router is a function that determines the next node to execute based on the current state.
 */
export type RouterFunction = (state: IWorkflowState) => string;

/**
 * A simple conditional router that directs the workflow to different nodes
 * based on the output of a source node. This class holds a mapping of
 * possible outcomes to target node IDs.
 */
export class ConditionalRouter {
  public readonly sourceId: string;
  private readonly routes: Record<string, string>;

  /**
   * Initializes a new instance of the ConditionalRouter.
   * @param sourceId The ID of the node whose output will be used for routing.
   * @param routes A dictionary where keys are expected outputs and values are target node IDs.
   */
  constructor(sourceId: string, routes: Record<string, string>) {
    this.sourceId = sourceId;
    this.routes = routes;
  }

  /**
   * Determines the next node ID based on the current workflow state.
   * @param state The current state of the workflow.
   * @returns The ID of the next node to execute, or null if no route matches.
   */
  public getNextNode(state: IWorkflowState): string | null {
    const sourceNodeState = state[this.sourceId];
    if (!sourceNodeState) {
      return null;
    }

    const output = String(sourceNodeState.output);
    return this.routes[output] || null;
  }
}
