// src/orchestrators/workflows/core/flowExecutor.ts

import { GraphEngine } from '../graph/GraphEngine';
import { Supervisor } from '../hierarchy/Supervisor';
import { StateManager } from './stateManager';

/**
 * The type for any executable workflow engine.
 */
type WorkflowEngine = GraphEngine | Supervisor;

/**
 * A unified executor for running any type of compiled workflow.
 *
 * This class abstracts the execution logic, providing a single `run` method
 * that can execute either a graph-based or a hierarchical workflow.
 */
export class FlowExecutor {
  /**
   * Executes the given workflow.
   * @param engine The compiled workflow engine (GraphEngine or Supervisor).
   * @param stateManager The state manager for the execution.
   * @returns A promise that resolves when the workflow is complete.
   */
  public static async run(engine: WorkflowEngine, stateManager: StateManager): Promise<void> {
    // The `run` method is polymorphic and exists on both engines.
    await engine.run(stateManager);
  }
}
