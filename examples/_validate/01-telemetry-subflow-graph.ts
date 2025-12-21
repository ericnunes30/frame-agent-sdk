import 'dotenv/config';
import 'tsconfig-paths/register';

import { GraphEngine } from '../../src/orchestrators/graph/core/GraphEngine';
import type { GraphDefinition } from '../../src/orchestrators/graph/core/interfaces/graphEngine.interface';
import { FlowRegistryImpl } from '../../src/flows/registry/flowRegistryImpl';
import { FlowRunnerImpl } from '../../src/flows/runner/flowRunnerImpl';
import { CallFlowTool } from '../../src/tools/tools/callFlowTool';
import { ChatHistoryManager, TokenizerService } from '../../src/memory';
import type { TraceEvent } from '../../src/telemetry/interfaces/traceEvent.interface';
import type { TraceSink } from '../../src/telemetry/interfaces/traceSink.interface';
import { getActiveTelemetry } from '../../src/telemetry/context/telemetryStore';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

class CaptureSink implements TraceSink {
  public readonly events: TraceEvent[] = [];
  emit(event: TraceEvent): void {
    this.events.push(event);
  }
}

function createChildGraph(): GraphDefinition {
  return {
    entryPoint: 'child',
    endNodeName: 'end',
    nodes: {
      child: async (state) => {
        return {
          data: {
            ...(state.data ?? {}),
            childOutput: 'ok',
            sharedPatch: [{ op: 'set', path: 'child.ok', value: true }],
          },
        };
      },
    },
    edges: {
      child: 'end',
    },
  };
}

function createParentGraph(args: { runner: FlowRunnerImpl }): GraphDefinition {
  return {
    entryPoint: 'invoke',
    endNodeName: 'end',
    nodes: {
      invoke: async (state) => {
        const active = getActiveTelemetry();
        assert(active?.traceContext?.runId, 'getActiveTelemetry() must be available inside GraphEngine node');

        const tool = new CallFlowTool(args.runner);
        const result = await tool.execute({
          flowId: 'child-validate',
          input: { input: 'ping' },
          shared: {},
        } as any);

        return {
          data: {
            ...(state.data ?? {}),
            callFlowObservation: result.observation,
            callFlowMetadata: result.metadata,
          },
        };
      },
    },
    edges: {
      invoke: 'end',
    },
  };
}

async function main() {
  const trace = new CaptureSink();
  const registry = new FlowRegistryImpl();
  const tokenizer = new TokenizerService(process.env.OPENAI_MODEL ?? 'gpt-4');
  const chatHistoryManager = new ChatHistoryManager({ maxContextTokens: 2000, tokenizer });
  const runner = new FlowRunnerImpl(registry, { chatHistoryManager });

  registry.register('child-validate', {
    id: 'child-validate',
    version: '0.0.0',
    kind: 'graph',
    graph: createChildGraph(),
  });

  const parentGraph = createParentGraph({ runner });
  const engine = new GraphEngine(
    parentGraph,
    {
      trace,
      telemetry: { enabled: true, level: 'info', persistToState: false, includePrompts: false },
      traceContext: { agent: { label: 'validate-parent' } },
      chatHistoryManager,
    },
    undefined
  );

  const res = await engine.execute({ messages: [], data: {}, metadata: {}, logs: [] } as any);

  const runStarted = trace.events.find((e) => e.type === 'run_started' && e.orchestrator === 'graph');
  assert(runStarted, 'expected parent run_started');

  const parentRunId = runStarted.runId;
  const childRunStarted = trace.events.find(
    (e) => e.type === 'run_started' && e.orchestrator === 'graph' && e.parentRunId === parentRunId
  );
  assert(childRunStarted, 'expected child run_started with parentRunId == parent runId');

  const nodeEvents = trace.events.filter((e) => e.type === 'node_started' || e.type === 'node_finished');
  assert(nodeEvents.length > 0, 'expected node_started/node_finished events');
  assert(nodeEvents.every((e) => Boolean(e.spanId)), 'expected spanId in all node_started/node_finished events');

  const callFlowMetadata = (res.state.data as any)?.callFlowMetadata;
  assert(callFlowMetadata?.flowId === 'child-validate', 'expected call_flow metadata.flowId == child-validate');
  assert(Array.isArray(callFlowMetadata?.patch), 'expected call_flow metadata.patch array');
  assert(callFlowMetadata.patch.length === 1, 'expected child to emit 1 patch op');

  console.log('[OK] telemetry-subflow-graph');
  console.log(`- events: ${trace.events.length}`);
  console.log(`- parentRunId: ${parentRunId}`);
  console.log(`- childRunId: ${childRunStarted.runId}`);
  console.log(`- call_flow status: ${callFlowMetadata.status}`);
}

main().catch((err) => {
  console.error('[FAIL] telemetry-subflow-graph');
  console.error(err);
  process.exitCode = 1;
});
