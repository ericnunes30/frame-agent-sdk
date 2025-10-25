// src/orchestrators/workflows/hierarchy/AgentRole.ts

import type { IAgent } from '../core/interfaces';

/**
 * Defines the role of an agent within a hierarchical team structure.
 *
 * This class encapsulates the high-level responsibilities of an agent, including
 * its designated role, overarching goals, and any operational constraints.
 * It serves as a blueprint for configuring agents in a CrewAI-inspired system.
 */
export class AgentRole {
  public readonly agent: IAgent;
  public readonly role: string;
  public readonly goals: string[];
  public readonly constraints: string[];

  /**
   * Initializes a new instance of the AgentRole.
   * @param agent The underlying agent that will perform the tasks.
   * @param role A descriptive name for the agent's role (e.g., "Researcher").
   * @param goals A list of high-level goals for this role.
   * @param constraints A list of rules or limitations the agent must adhere to.
   */
  constructor(agent: IAgent, role: string, goals: string[], constraints: string[] = []) {
    this.agent = agent;
    this.role = role;
    this.goals = goals;
    this.constraints = constraints;
  }
}
