import { ToolExecutor } from '@/tools/core/toolExecutor';
import type { IToolCall } from '@/tools/core/interfaces';
import type { GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import { logger } from '@/utils/logger';
import type { SharedState } from '@/flows/interfaces/sharedState.interface';
import { applySharedPatch } from '@/flows/utils/sharedPatchApplier';

export function createToolExecutorNode(): GraphNode {
  return async (state, engine): Promise<GraphNodeResult> => {
    const call = state.lastToolCall;
    if (!call) {
      logger.warn('[ToolExecutorNode] No pending tool call');
      return { logs: ['No pending tool call'], lastToolCall: undefined };
    }

    logger.info(`[ToolExecutorNode] Executando tool call:`, JSON.stringify(call));

    // Execute tool e recebe resultado estruturado
    const toolResult = await executeTool(call);
    const observation = toolResult.observation;
    const toolMetadata = toolResult.metadata;

    let toolResultStr: string;
    if (typeof observation === 'object' && observation !== null) {
      toolResultStr = JSON.stringify(observation);
    } else {
      toolResultStr = String(observation);
    }
    logger.info(`[ToolExecutorNode] Resultado da tool:`, toolResultStr);

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
    if (toolMetadata && typeof toolMetadata === 'object') {
      const metadataObj = toolMetadata as { sharedPatch?: unknown; patch?: unknown };
      const patch = metadataObj.sharedPatch ?? metadataObj.patch;
      if (Array.isArray(patch)) {
        const currentShared = (state.data?.shared ?? {}) as SharedState;
        const nextShared = applySharedPatch(currentShared, patch);
        nextData = { ...(state.data ?? {}), shared: nextShared };
      }
    }

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
