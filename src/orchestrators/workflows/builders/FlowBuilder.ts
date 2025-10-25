// src/orchestrators/workflows/builders/FlowBuilder.ts

import { GraphBuilder } from './GraphBuilder';
import { HierarchyBuilder } from './HierarchyBuilder';
import { FlowType } from '../core/enums';

/**
 * The main user-facing builder for creating any type of workflow.
 *
 * This class acts as a factory for the specific builders, providing a
 * unified starting point for creating either graph-based or hierarchical
 * workflows.
 */
export class FlowBuilder {
  /**
   * Creates a new graph-based workflow.
   * @returns A new instance of the GraphBuilder to start defining the graph.
   */
  public static newGraph(): GraphBuilder {
    return new GraphBuilder();
  }

  /**
   * Creates a new hierarchical workflow.
   * @returns A new instance of the HierarchyBuilder to start defining the team and tasks.
   */
  public static newHierarchy(): HierarchyBuilder {
    return new HierarchyBuilder();
  }

  /**
   * (Placeholder for future implementation)
   * Creates a new integrated workflow that combines graph and hierarchy.
   */
  public static newIntegrated(): any {
    throw new Error('Integrated flows are not yet implemented.');
  }
}
