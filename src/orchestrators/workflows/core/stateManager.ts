// src/orchestrators/workflows/core/stateManager.ts

import type { IWorkflowState, INodeState } from './interfaces';

/**
 * Manages the state of a workflow execution.
 *
 * This class provides a structured way to interact with the workflow state,
 * ensuring that data for each node is isolated. It allows for getting and
 * updating the state of individual nodes as well as retrieving the entire
 * state tree.
 */
export class StateManager {
  private state: IWorkflowState;

  /**
   * Initializes a new instance of the StateManager.
   * @param initialState Optional initial state for the workflow. Defaults to an empty object.
   */
  constructor(initialState: IWorkflowState = {}) {
    this.state = { ...initialState };
  }

  /**
   * Retrieves the entire current state of the workflow.
   * @returns The complete workflow state.
   */
  public getState(): IWorkflowState {
    return this.state;
  }

  /**
   * Retrieves the state for a specific node.
   * @param nodeId The unique identifier of the node.
   * @returns The state of the node, or undefined if the node does not exist.
   */
  public getNodeState(nodeId: string): INodeState | undefined {
    return this.state[nodeId];
  }

  /**
   * Updates the state of a specific node.
   *
   * If the node already has a state, the new state is merged with the existing
   * state. If the node does not exist, it is created.
   *
   * @param nodeId The unique identifier of the node.
   * @param newNodeState The partial or complete new state for the node.
   */
  public updateNodeState(nodeId: string, newNodeState: Partial<INodeState>): void {
    const existingState = this.state[nodeId] || { output: undefined };
    this.state[nodeId] = {
      ...existingState,
      ...newNodeState,
    };
  }
}
