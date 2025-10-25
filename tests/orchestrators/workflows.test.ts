// tests/orchestrators/workflows.test.ts

import { StateManager } from '../../src/orchestrators/workflows/core/stateManager';
import { WorkflowOrchestrator } from '../../src/orchestrators/workflows/core/workflowOrchestrator';
import { NodeType } from '../../src/orchestrators/workflows/core/enums';
import { AgentRole } from '../../src/orchestrators/workflows/hierarchy/AgentRole';
import type { IAgent } from '../../src/orchestrators/workflows/core/interfaces';

// Mock Agent Implementation
const mockAgent = (id: string, result: any): IAgent => ({
  id,
  role: `${id}-role`,
  config: {} as any,
  run: jest.fn().mockResolvedValue(result),
});

describe('StateManager', () => {
  it('should initialize with an empty state', () => {
    const sm = new StateManager();
    expect(sm.getState()).toEqual({});
  });

  it('should update and retrieve node state', () => {
    const sm = new StateManager();
    sm.updateNodeState('node1', { output: 'test' });
    expect(sm.getNodeState('node1')).toEqual({ output: 'test' });
    expect(sm.getState()).toEqual({ node1: { output: 'test' } });
  });
});

describe('GraphBuilder & GraphEngine', () => {
  it('should build and run a simple linear graph', async () => {
    const agent1 = mockAgent('agent1', 'output1');
    const agent2 = mockAgent('agent2', 'output2');

    const engine = WorkflowOrchestrator.builder
      .newGraph()
      .addNode('start', NodeType.START)
      .addNode('agent1', NodeType.AGENT, agent1)
      .addNode('agent2', NodeType.AGENT, agent2)
      .addNode('end', NodeType.END)
      .addEdge('start', 'agent1')
      .addEdge('agent1', 'agent2')
      .addEdge('agent2', 'end')
      .build();

    const orchestrator = new WorkflowOrchestrator(engine);
    const finalState = await orchestrator.run();

    expect(agent1.run).toHaveBeenCalled();
    expect(agent2.run).toHaveBeenCalled();
    expect(finalState['agent1'].output).toBe('output1');
    expect(finalState['agent2'].output).toBe('output2');
  });
});

describe('HierarchyBuilder & Supervisor', () => {
  it('should build and run a simple hierarchy', async () => {
    const researcher = mockAgent('researcher', 'research data');
    const writer = mockAgent('writer', 'final report');

    const researcherRole = new AgentRole(researcher, 'Researcher', ['find data']);
    const writerRole = new AgentRole(writer, 'Writer', ['write report']);

    const engine = WorkflowOrchestrator.builder
      .newHierarchy()
      .addAgent(researcherRole)
      .addAgent(writerRole)
      .addTask({ description: 'Find data', agentRole: researcherRole, expectedOutput: 'data' })
      .addTask({ description: 'Write report', agentRole: writerRole, expectedOutput: 'report' })
      .build();

    const orchestrator = new WorkflowOrchestrator(engine);
    const finalState = await orchestrator.run();

    expect(researcher.run).toHaveBeenCalledWith('Find data');
    expect(writer.run).toHaveBeenCalledWith('Write report');
    expect(finalState['researcher'].output).toBe('research data');
    expect(finalState['writer'].output).toBe('final report');
  });
});

describe('WorkflowOrchestrator', () => {
  it('should expose the builder', () => {
    expect(WorkflowOrchestrator.builder).toBeDefined();
    expect(WorkflowOrchestrator.builder.newGraph).toBeInstanceOf(Function);
    expect(WorkflowOrchestrator.builder.newHierarchy).toBeInstanceOf(Function);
  });
});
