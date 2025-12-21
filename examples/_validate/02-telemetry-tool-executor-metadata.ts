import 'dotenv/config';
import 'tsconfig-paths/register';

import { GraphEngine } from '../../src/orchestrators/graph/core/GraphEngine';
import type { GraphDefinition } from '../../src/orchestrators/graph/core/interfaces/graphEngine.interface';
import { createToolExecutorNode } from '../../src/orchestrators/graph/nodes/toolExecutorNode';
import { ChatHistoryManager, TokenizerService } from '../../src/memory';
import { toolRegistry } from '../../src/tools/core/toolRegistry';
import type { IToolResult } from '../../src/tools/core/interfaces';
import type { TraceEvent } from '../../src/telemetry/interfaces/traceEvent.interface';
import type { TraceSink } from '../../src/telemetry/interfaces/traceSink.interface';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

class CaptureSink implements TraceSink {
  public readonly events: TraceEvent[] = [];
  emit(event: TraceEvent): void {
    this.events.push(event);
  }
}

class DummyPatchTool {
  public readonly name = 'dummy_patch';
  public readonly description = 'dummy patch tool';
  public readonly parameterSchema: any = {};
  async execute(): Promise<IToolResult> {
    return {
      observation: 'ok',
      metadata: {
        sharedPatch: [{ op: 'set', path: 'dummy.ok', value: true }],
        extra: 'x',
        anotherKey: 123,
      },
    };
  }
}

function createGraph(): GraphDefinition {
  return {
    entryPoint: 'tool',
    endNodeName: 'end',
    nodes: {
      tool: createToolExecutorNode(),
    },
    edges: {
      tool: 'end',
    },
  };
}

async function main() {
  const trace = new CaptureSink();
  const tool = new DummyPatchTool();
  toolRegistry.register(tool as any);

  try {
    const tokenizer = new TokenizerService(process.env.OPENAI_MODEL ?? 'gpt-4');
    const chatHistoryManager = new ChatHistoryManager({ maxContextTokens: 2000, tokenizer });
    const engine = new GraphEngine(
      createGraph(),
      {
        trace,
        telemetry: { enabled: true, level: 'info', persistToState: false, includePrompts: false },
        traceContext: { agent: { label: 'validate-tool-executor' } },
        chatHistoryManager,
      },
      undefined
    );

    const result = await engine.execute({
      messages: [],
      data: { shared: {} },
      metadata: {},
      logs: [],
      lastToolCall: { toolName: 'dummy_patch', params: {}, toolCallId: 't1' },
    } as any);

    const finished = trace.events.find((e) => e.type === 'tool_execution_finished' && e.tool?.name === 'dummy_patch');
    assert(finished, 'expected tool_execution_finished for dummy_patch');

    const data = finished.data ?? {};
    assert(data.patchOpsCount === 1, 'expected patchOpsCount == 1');
    assert(Array.isArray(data.metadataKeys), 'expected metadataKeys array');
    assert((data.metadataKeys as string[]).includes('sharedPatch'), 'expected metadataKeys to include sharedPatch');
    assert((data.metadataKeys as string[]).includes('extra'), 'expected metadataKeys to include extra');

    const shared = (result.state.data as any)?.shared;
    assert(shared?.dummy?.ok === true || shared?.['dummy.ok'] === true, 'expected shared to be patched by sharedPatch');

    console.log('[OK] telemetry-tool-executor-metadata');
    console.log(`- events: ${trace.events.length}`);
    console.log(`- metadataKeys: ${(data.metadataKeys as string[]).join(', ')}`);
  } finally {
    toolRegistry.unregister('dummy_patch');
  }
}

main().catch((err) => {
  console.error('[FAIL] telemetry-tool-executor-metadata');
  console.error(err);
  process.exitCode = 1;
});
