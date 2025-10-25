// src/orchestrators/workflows/hierarchy/Supervisor.ts

import { TaskAssigner, ITask } from './TaskAssigner';
import { DelegationManager } from './DelegationManager';
import { StateManager } from '../core/stateManager';
import { AgentRole } from './AgentRole';

/**
 * The main orchestrator for a hierarchical team of agents.
 *
 * The Supervisor manages the overall workflow by assigning tasks to subordinate
 * agents and tracking their progress. It acts as the central point of control,
 * ensuring that all tasks are completed in the correct order to achieve the
 * final objective.
 */
export class Supervisor {
  private readonly taskAssigner: TaskAssigner;
  private readonly team: AgentRole[];

  /**
   * Initializes a new instance of the Supervisor.
   * @param tasks A list of tasks to be completed by the team.
   * @param team An array of agent roles that form the team.
   */
  constructor(tasks: ITask[], team: AgentRole[]) {
    this.taskAssigner = new TaskAssigner(tasks);
    this.team = team;
  }

  /**
   * Runs the hierarchical workflow.
   *
   * The Supervisor will continuously ask the TaskAssigner for the next task
   * and use the DelegationManager to execute it until all tasks are complete.
   *
   * @param stateManager The state manager for the workflow execution.
   */
  public async run(stateManager: StateManager): Promise<void> {
    let nextTask = this.taskAssigner.getNextTask(stateManager.getState());

    while (nextTask) {
      await DelegationManager.delegateTask(nextTask, stateManager);
      nextTask = this.taskAssigner.getNextTask(stateManager.getState());
    }
  }
}
