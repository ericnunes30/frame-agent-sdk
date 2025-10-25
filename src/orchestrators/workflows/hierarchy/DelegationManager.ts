// src/orchestrators/workflows/hierarchy/DelegationManager.ts

import { AgentRole } from './AgentRole';
import { ITask } from './TaskAssigner';
import { StateManager } from '../core/stateManager';
import { AgentStatus } from '../core/enums';

/**
 * Manages the delegation of tasks from a supervisor to subordinate agents.
 *
 * This class handles the logic of executing a task by invoking the appropriate
 * agent and updating the workflow state with the result.
 */
export class DelegationManager {
  /**
   * Delegates a task to the specified agent role.
   * @param task The task to be executed.
   * @param stateManager The state manager for the workflow.
   */
  public static async delegateTask(task: ITask, stateManager: StateManager): Promise<void> {
    const agent = task.agentRole.agent;

    try {
      stateManager.updateNodeState(agent.id, {
        metadata: { status: AgentStatus.RUNNING },
      });

      // The agent's `run` method would be more complex, likely taking the task description
      // as input. This is a simplified representation.
      const output = await agent.run(task.description);

      stateManager.updateNodeState(agent.id, {
        output,
        metadata: { status: AgentStatus.COMPLETED },
      });
    } catch (error) {
      stateManager.updateNodeState(agent.id, {
        output: { error: (error as Error).message },
        metadata: { status: AgentStatus.FAILED },
      });
      throw new Error(`Task delegation failed for agent ${agent.id}: ${(error as Error).message}`);
    }
  }
}
