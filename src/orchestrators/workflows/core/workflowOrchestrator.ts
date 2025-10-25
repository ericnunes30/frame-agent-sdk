// src/orchestrators/workflows/core/workflowOrchestrator.ts

import { FlowBuilder } from '../builders/FlowBuilder';
import { FlowExecutor } from './flowExecutor';
import { StateManager } from './stateManager';
import type { IWorkflowState } from './interfaces';
import type { GraphEngine } from '../graph/GraphEngine';
import type { Supervisor } from '../hierarchy/Supervisor';

/**
 * The main orchestrator for defining and executing complex, multi-agent workflows.
 *
 * This class serves as the primary entry point for the entire workflow system,
 * providing a simple `run` method that handles the creation, execution, and
 * state management of the workflow.
 */
export class WorkflowOrchestrator {
  private readonly engine: GraphEngine | Supervisor;

  /**
   * Initializes a new instance of the WorkflowOrchestrator.
   *
   * @param engine The compiled workflow engine (GraphEngine or Supervisor)
   *               created by one of the builders (GraphBuilder or HierarchyBuilder).
   */
  constructor(engine: GraphEngine | Supervisor) {
    this.engine = engine;
  }

  /**
   * Provides access to the builders for defining a new workflow.
   */
  public static get builder(): typeof FlowBuilder {
    return FlowBuilder;
  }

  /**
   * Runs the configured workflow.
   *
   * @param initialState The initial state for the workflow.
   * @returns A promise that resolves with the final state of the workflow.
   */
  public async run(initialState: IWorkflowState = {}): Promise<IWorkflowState> {
    const stateManager = new StateManager(initialState);
    await FlowExecutor.run(this.engine, stateManager);
    return stateManager.getState();
  }
}
