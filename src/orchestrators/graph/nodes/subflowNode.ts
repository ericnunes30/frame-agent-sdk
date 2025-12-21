import type { GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import type { IGraphState } from '@/orchestrators/graph/core/interfaces/graphState.interface';
import type { FlowRunner } from '@/flows/interfaces/flowRunner.interface';
import type { FlowRegistry } from '@/flows/interfaces/flowRegistry.interface';
import type { SharedState } from '@/flows/interfaces/sharedState.interface';
import { applySharedPatch } from '@/flows/utils/sharedPatchApplier';
import { cloneShared } from '@/flows/utils/sharedClone';

/**
 * Cria um node que executa um subfluxo e aplica patches no shared.
 * Pausas do subfluxo sao propagadas sem pendingAskUser para o grafo pai.
 */
export function createSubflowNode(args: {
  registry: FlowRegistry;
  runner: FlowRunner;
  flowId: string;
}): GraphNode {
  return async (state, engine): Promise<GraphNodeResult> => {
    if (!args.registry.has(args.flowId)) {
      throw new Error(`Flow '${args.flowId}' not registered`);
    }

    const previousSubflow = (state.metadata as { subflow?: { flowId?: string; childState?: unknown } } | undefined)?.subflow;
    const childState = previousSubflow?.flowId === args.flowId
      ? (previousSubflow?.childState as IGraphState | undefined)
      : undefined;

    const shared = cloneShared((state.data?.shared ?? {}) as SharedState);
    const { shared: _shared, ...input } = (state.data ?? {}) as Record<string, unknown>;

    const result = await args.runner.run({
      flowId: args.flowId,
      input,
      shared,
      childState,
      trace: engine.getTraceSink(),
      telemetry: engine.getTelemetryOptions(),
      traceContext: engine.getTraceContext(),
    });

    const nextShared = applySharedPatch(shared, result.patch);

    const subflowMetadata: Record<string, unknown> = {
      flowId: args.flowId,
      status: result.status
    };

    if (result.status === 'paused') {
      subflowMetadata.childState = result.childState;
    }

    const baseResult: GraphNodeResult = {
      data: { ...(state.data ?? {}), shared: nextShared },
      metadata: { ...(state.metadata ?? {}), subflow: subflowMetadata }
    };

    if (result.status === 'paused') {
      return {
        ...baseResult,
        shouldPause: true,
        nextNodeOverride: state.currentNode
      };
    }

    return baseResult;
  };
}
