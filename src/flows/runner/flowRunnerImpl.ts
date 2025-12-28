import type { FlowRunner } from '@/flows/interfaces/flowRunner.interface';
import type { FlowRegistry } from '@/flows/interfaces/flowRegistry.interface';
import type { FlowDefinition } from '@/flows/interfaces/flowDefinition.interface';
import type { SharedPatch } from '@/flows/interfaces/sharedPatch.interface';
import type { SharedState } from '@/flows/interfaces/sharedState.interface';
import type { SubflowPolicy } from '@/flows/interfaces/subflowPolicy.interface';
import { cloneShared } from '@/flows/utils/sharedClone';
import type { AgentLLMConfig } from '@/agent';
import type { IChatHistoryManager } from '@/memory';
import { GraphEngine } from '@/orchestrators/graph/core/GraphEngine';
import { GraphStatus } from '@/orchestrators/graph/core/enums/graphEngine.enum';
import type { IGraphState } from '@/orchestrators/graph/core/interfaces/graphState.interface';
import type { TraceContext } from '@/telemetry/interfaces/traceContext.interface';
import type { TraceSink } from '@/telemetry/interfaces/traceSink.interface';
import type { TelemetryOptions } from '@/telemetry/interfaces/telemetryOptions.interface';
import { getActiveTelemetry } from '@/telemetry/context/telemetryStore';

type FlowRunnerDeps = Record<string, unknown> & {
  llmConfig?: AgentLLMConfig;
  chatHistoryManager?: IChatHistoryManager;
};

/**
 * Executa subfluxos com isolamento de memoria para agentFlow.
 * - agentFlow exige llmConfig e bloqueia chatHistoryManager compartilhado.
 * - graph pode reutilizar chatHistoryManager quando fornecido.
 */
export class FlowRunnerImpl implements FlowRunner {
  private readonly registry: FlowRegistry;
  private readonly deps?: FlowRunnerDeps;
  private readonly llmConfig?: AgentLLMConfig;
  private readonly chatHistoryManager?: IChatHistoryManager;

  constructor(registry: FlowRegistry, deps?: FlowRunnerDeps) {
    this.registry = registry;
    this.deps = deps;
    this.llmConfig = deps?.llmConfig;
    this.chatHistoryManager = deps?.chatHistoryManager;
  }

  /**
   * Executa um fluxo registrado e retorna status, output, patch e childState.
   */
  async run(args: {
    flowId: string;
    input: Record<string, unknown>;
    shared: SharedState;
    policy?: SubflowPolicy;
    childState?: IGraphState;
    trace?: TraceSink;
    telemetry?: TelemetryOptions;
    traceContext?: TraceContext;
  }): Promise<{
    status: 'success' | 'failed' | 'paused';
    output: Record<string, unknown>;
    patch: SharedPatch[];
    childState?: IGraphState;
  }> {
    const active = getActiveTelemetry();
    const trace = args.trace ?? active?.trace;
    const telemetry = args.telemetry ?? active?.telemetry;
    const parentTraceContext = args.traceContext ?? active?.traceContext;

    const flow = this.registry.get(args.flowId);
    if (flow.kind === 'agentFlow') {
      if (!this.llmConfig) {
        throw new Error(`Flow '${flow.id}' requires llmConfig for isolated memory`);
      }
      if (this.chatHistoryManager) {
        throw new Error(`Flow '${flow.id}' does not allow shared chatHistoryManager`);
      }
    }
    const graph = this.resolveGraph(flow);

    const chatManager = flow.kind === 'agentFlow' ? undefined : this.chatHistoryManager;
    const traceContextBase = {
      // Herdar parentRunId para rastreamento, mas não o agent
      ...(parentTraceContext?.runId && { parentRunId: parentTraceContext.runId }),
      flow: { id: flow.id, kind: flow.kind },
      // Usar o agente do flow atual (não herdar do pai)
      agent: {
        id: flow.id,
        label: flow.id
      }
    };

    const engineOptions = {
      ...(chatManager ? { chatHistoryManager: chatManager } : {}),
      ...(trace ? { trace } : {}),
      ...(telemetry ? { telemetry } : {}),
      traceContext: traceContextBase
    };

    const engine = new GraphEngine(graph, engineOptions, this.llmConfig);

    let result;
    if (args.childState) {
      const resumeNode = args.childState.currentNode ?? args.childState.nextNode;
      const resumeState: IGraphState = {
        ...args.childState,
        pendingAskUser: undefined,
        currentNode: resumeNode ?? args.childState.currentNode,
        nextNode: resumeNode ?? args.childState.nextNode,
        data: {
          ...(args.childState.data ?? {}),
          ...(args.input ?? {}),
          shared: cloneShared(args.shared ?? (args.childState.data?.shared ?? {}))
        },
        metadata: {
          ...(args.childState.metadata ?? {}),
          ...(parentTraceContext?.runId ? { parentRunId: parentTraceContext.runId } : {})
        }
      };

      result = await engine.resume(resumeState);
    } else {
      const initialState: IGraphState = {
        messages: [],
        data: { ...(args.input ?? {}), shared: cloneShared(args.shared ?? {}) },
        metadata: {
          ...(parentTraceContext?.runId ? { parentRunId: parentTraceContext.runId } : {})
        },
        logs: [],
        status: GraphStatus.RUNNING
      };

      result = await engine.execute(initialState);
    }

    const output = extractOutput(result.state);
    const patch = extractPatch(result.state);

    return {
      status: mapStatus(result.status),
      output,
      patch,
      childState: result.status === GraphStatus.PAUSED ? result.state : undefined
    };
  }

  private resolveGraph(flow: FlowDefinition) {
    if (flow.factory) {
      if (!this.deps) {
        throw new Error(`Flow '${flow.id}' requires deps for factory execution`);
      }
      return flow.factory(this.deps);
    }

    if (!flow.graph) {
      throw new Error(`Flow '${flow.id}' has no graph definition`);
    }

    return flow.graph;
  }
}

function mapStatus(status: GraphStatus): 'success' | 'failed' | 'paused' {
  if (status === GraphStatus.FINISHED) return 'success';
  if (status === GraphStatus.PAUSED) return 'paused';
  if (status === GraphStatus.RUNNING) return 'failed';
  if (status === GraphStatus.ERROR) return 'failed';
  if (status === GraphStatus.INTERRUPTED) return 'failed';
  return 'failed';
}

function extractPatch(state: IGraphState): SharedPatch[] {
  const data = (state.data ?? {}) as Record<string, unknown>;
  const sharedPatch = data.sharedPatch;
  return Array.isArray(sharedPatch) ? (sharedPatch as SharedPatch[]) : [];
}

function extractOutput(state: IGraphState): Record<string, unknown> {
  const data = (state.data ?? {}) as Record<string, unknown>;
  const { shared, sharedPatch, ...output } = data;
  return output;
}
