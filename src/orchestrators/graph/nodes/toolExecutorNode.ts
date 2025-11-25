import { ToolExecutor } from '@/tools/core/toolExecutor';
import type { IToolCall } from '@/tools/core/interfaces';
import type { GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';

export function createToolExecutorNode(): GraphNode {
  return async (state, engine): Promise<GraphNodeResult> => {
    const call = state.lastToolCall;
    if (!call) {
      console.warn('[ToolExecutorNode] No pending tool call');
      return { logs: ['No pending tool call'], lastToolCall: undefined };
    }

    console.info(`[ToolExecutorNode] Executando tool call:`, JSON.stringify(call));

    // Execute tool e recebe resultado estruturado
    const toolResult = await executeTool(call);
    const observation = toolResult.observation;
    const toolMetadata = toolResult.metadata;

    const toolResultStr = String(observation);
    console.info(`[ToolExecutorNode] Resultado da tool:`, toolResultStr);

    engine.addMessage({ role: 'tool', content: toolResultStr });

    // Prepara resultado do node
    const nodeResult = {
      lastToolCall: undefined,
      lastModelOutput: toolResultStr,
    };

    // Se a tool retornou metadata, propaga para o state
    if (toolMetadata && Object.keys(toolMetadata).length > 0) {
      console.info(`[ToolExecutorNode] Propagando metadata da tool:`, JSON.stringify(toolMetadata));
      return {
        ...nodeResult,
        metadata: toolMetadata
      };
    }

    return nodeResult;
  };
}

async function executeTool(call: IToolCall) {
  return ToolExecutor.execute(call);
}
