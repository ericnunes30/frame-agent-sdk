// src/orchestrators/workflows/graph/ParallelExecutor.ts

import { GraphNode } from './GraphNode';
import { StateManager } from '../core/stateManager';
import { AgentStatus } from '../core/enums';

/**
 * Executes a set of graph nodes in parallel.
 *
 * This executor is designed to run nodes that have no dependencies on each other.
 * It invokes the `run` method of each node's associated agent and updates the
 * state manager with the results upon completion.
 */
export class ParallelExecutor {
  /**
   * Executes the given nodes in parallel.
   * @param nodes An array of GraphNode instances to execute.
   * @param stateManager The state manager for the current workflow execution.
   * @returns A promise that resolves when all parallel nodes have completed.
   */
  public static async execute(nodes: GraphNode[], stateManager: StateManager): Promise<void> {
    const executionPromises = nodes.map(async (node) => {
      if (!node.action) {
        // Skip nodes without actions (e.g., START, END)
        return;
      }

      try {
        // Set the node status to RUNNING
        stateManager.updateNodeState(node.id, { metadata: { status: AgentStatus.RUNNING } });

        const context = stateManager.getNodeState(node.id);
        const output = await node.action.run(context);

        // Update the node state with the output and set status to COMPLETED
        stateManager.updateNodeState(node.id, {
          output,
          metadata: { status: AgentStatus.COMPLETED },
        });
      } catch (error) {
        // In case of an error, update the state and set status to FAILED
        stateManager.updateNodeState(node.id, {
          output: { error: (error as Error).message },
          metadata: { status: AgentStatus.FAILED },
        });
        // Propagate the error to halt the parallel execution
        throw error;
      }
    });

    await Promise.all(executionPromises);
  }
}
