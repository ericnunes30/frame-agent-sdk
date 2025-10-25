// src/orchestrators/workflows/builders/HierarchyBuilder.ts

import { Supervisor } from '../hierarchy/Supervisor';
import { AgentRole } from '../hierarchy/AgentRole';
import { ITask } from '../hierarchy/TaskAssigner';

/**
 * A fluent API for constructing hierarchical agent-based workflows.
 *
 * This builder simplifies the setup of a team of agents and their assigned
 * tasks, culminating in the creation of a Supervisor to manage the workflow.
 */
export class HierarchyBuilder {
  private team: AgentRole[] = [];
  private tasks: ITask[] = [];

  /**
   * Adds an agent with a specific role to the team.
   * @param agentRole The AgentRole instance describing the agent and its duties.
   * @returns The builder instance for chaining.
   */
  public addAgent(agentRole: AgentRole): this {
    if (this.team.some(a => a.agent.id === agentRole.agent.id)) {
      throw new Error(`Agent with id "${agentRole.agent.id}" is already in the team.`);
    }
    this.team.push(agentRole);
    return this;
  }

  /**
   * Adds a task to be completed by the team.
   * @param task The task definition.
   * @returns The builder instance for chaining.
   */
  public addTask(task: ITask): this {
    this.tasks.push(task);
    return this;
  }

  /**
   * Builds and returns a new Supervisor instance.
   * @returns A configured instance of the Supervisor.
   */
  public build(): Supervisor {
    if (this.team.length === 0) {
      throw new Error('Cannot build a hierarchy with no agents.');
    }
    if (this.tasks.length === 0) {
      throw new Error('Cannot build a hierarchy with no tasks.');
    }
    // Ensure all tasks are assigned to agents that are actually in the team
    for (const task of this.tasks) {
      if (!this.team.includes(task.agentRole)) {
        throw new Error(`Task "${task.description}" is assigned to an agent not in the team.`);
      }
    }
    return new Supervisor(this.tasks, this.team);
  }
}
