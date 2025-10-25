// src/orchestrators/workflows/hierarchy/TaskAssigner.ts

import { AgentRole } from './AgentRole';
import type { IWorkflowState } from '../core/interfaces';

/**
 * Represents a single task to be performed by an agent.
 */
export interface ITask {
  description: string;
  agentRole: AgentRole;
  expectedOutput: string;
}

/**
 * Responsible for assigning tasks to agents based on their roles and the workflow's state.
 *
 * This class is a placeholder for a more sophisticated task assignment strategy.
 * In a real-world scenario, this might involve an LLM call to determine the best
 * agent for a task, but for now, it uses a simple direct-assignment approach.
 */
export class TaskAssigner {
  private readonly tasks: ITask[];

  constructor(tasks: ITask[]) {
    this.tasks = tasks;
  }

  /**
   * Assigns the next task to be executed.
   * This is a simplified implementation that returns the first uncompleted task.
   * @param state The current workflow state.
   * @returns The next task to be executed, or null if all tasks are completed.
   */
  public getNextTask(state: IWorkflowState): ITask | null {
    for (const task of this.tasks) {
      const taskState = state[task.agentRole.agent.id];
      if (!taskState || taskState.metadata?.status !== 'COMPLETED') {
        return task;
      }
    }
    return null;
  }
}
