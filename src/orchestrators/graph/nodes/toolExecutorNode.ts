import { ToolExecutor } from '@/tools/core/toolExecutor';
import type { IToolCall } from '@/tools/core/interfaces';
import type { GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import { logger } from '@/utils/logger';
import type { SharedState } from '@/flows/interfaces/sharedState.interface';
import { applySharedPatch } from '@/flows/utils/sharedPatchApplier';
import { createTraceId } from '@/telemetry/utils/id';
import type { ToolPolicy } from '@/tools/policy/toolPolicy.interface';
import { isToolAllowedByPolicy } from '@/tools/policy/toolPolicyApplier';

export function createToolExecutorNode(options?: { toolPolicy?: ToolPolicy }): GraphNode {
  return async (state, engine): Promise<GraphNodeResult> => {
    const call = state.lastToolCall;
    if (!call) {
      logger.warn('[ToolExecutorNode] No pending tool call');
      return { logs: ['No pending tool call'], lastToolCall: undefined };
    }

    if (options?.toolPolicy && !isToolAllowedByPolicy(call.toolName, options.toolPolicy)) {
      engine.emitTrace(state, {
        type: 'custom:tool_execution_denied',
        level: 'warn',
        tool: { name: call.toolName, toolCallId: call.toolCallId, params: call.params },
        message: 'Tool denied by policy',
      });

      engine.addMessage({
        role: 'system',
        content: `Tool "${call.toolName}" is not allowed. Use only the tools exposed in the prompt.`,
      });

      return {
        lastToolCall: undefined,
        metadata: {
          ...(state.metadata ?? {}),
          toolPolicyViolation: { toolName: call.toolName },
        },
        logs: [`Tool denied by policy: ${call.toolName}`],
      };
    }

    logger.info(`[ToolExecutorNode] Executando tool call:`, JSON.stringify(call));

    // Execute tool e recebe resultado estruturado
    const toolCallId = call.toolCallId ?? createTraceId();
    const startedAt = Date.now();
    engine.emitTrace(state, {
      type: 'tool_execution_started',
      level: 'info',
      tool: { name: call.toolName, toolCallId, params: call.params },
    });

    let toolResult;
    try {
      toolResult = await executeTool(call.toolCallId ? call : { ...call, toolCallId });
    } catch (error) {
      engine.emitTrace(state, {
        type: 'tool_execution_failed',
        level: 'error',
        tool: { name: call.toolName, toolCallId },
        timing: { startedAt: new Date(startedAt).toISOString(), durationMs: Date.now() - startedAt },
        message: (error as Error).message,
      });
      throw error;
    }
    const observation = toolResult.observation;
    const toolMetadata = toolResult.metadata;

    let toolResultStr: string;
    if (typeof observation === 'object' && observation !== null) {
      toolResultStr = JSON.stringify(observation);
    } else {
      toolResultStr = String(observation);
    }
    logger.info(`[ToolExecutorNode] Resultado da tool:`, toolResultStr);

    const observationPreview = toolResultStr.length > 1000 ? `${toolResultStr.slice(0, 1000)}…(truncated)` : toolResultStr;

    // Adicionar resultado como mensagem de sistema para React + SAP
    // No sistema React + SAP, o resultado da ferramenta é adicionado como uma mensagem normal
    // para que o LLM possa processar no próximo prompt
    engine.addMessage({ 
      role: 'system', 
      content: `# ${call.toolName} response\n${toolResultStr}`
    });

    // Prepara resultado do node
    const nodeResult = {
      lastToolCall: undefined,
      lastModelOutput: toolResultStr,
    };

    let nextData: Record<string, unknown> | undefined;
    let patchOpsCount = 0;
    if (toolMetadata && typeof toolMetadata === 'object') {
      const metadataObj = toolMetadata as { sharedPatch?: unknown; patch?: unknown };
      const patch = metadataObj.sharedPatch ?? metadataObj.patch;
      if (Array.isArray(patch)) {
        patchOpsCount = patch.length;
        const currentShared = (state.data?.shared ?? {}) as SharedState;
        const nextShared = applySharedPatch(currentShared, patch);
        nextData = { ...(state.data ?? {}), shared: nextShared };
      }
    }

    engine.emitTrace(state, {
      type: 'tool_execution_finished',
      level: 'info',
      tool: { name: call.toolName, toolCallId, observationPreview },
      timing: { startedAt: new Date(startedAt).toISOString(), durationMs: Date.now() - startedAt },
      data: {
        ...(patchOpsCount ? { patchOpsCount } : {}),
        ...(toolMetadata && typeof toolMetadata === 'object'
          ? { metadataKeys: Object.keys(toolMetadata as Record<string, unknown>).slice(0, 32) }
          : {}),
      },
    });

    // Se a tool retornou metadata, propaga para o state
    if (toolMetadata && Object.keys(toolMetadata).length > 0) {
      logger.info(`[ToolExecutorNode] Propagando metadata da tool:`, JSON.stringify(toolMetadata));
      return {
        ...nodeResult,
        data: nextData ?? undefined,
        metadata: toolMetadata
      };
    }

    if (nextData) {
      return {
        ...nodeResult,
        data: nextData
      };
    }

    return nodeResult;
  };
}

async function executeTool(call: IToolCall) {
  return ToolExecutor.execute(call);
}
