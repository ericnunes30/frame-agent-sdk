import { ToolExecutor } from '../../../tools/core/toolExecutor';
import type { IToolCall } from '../../../tools/core/interfaces';
import type { GraphNode, GraphNodeResult } from '../core/interfaces/graphEngine.interface';

export function createToolExecutorNode(): GraphNode {
  return async (state, engine): Promise<GraphNodeResult> => {
    const call = state.lastToolCall;
    if (!call) {
      return { logs: ['No pending tool call'], lastToolCall: undefined };
    }

    const observation = await executeTool(call);
    const toolResult = String(observation);
    
    engine.addMessage({ role: 'tool', content: toolResult });
    console.log(`Tool executed: ${call.toolName}`, 'ToolExecutorNode');

    return {
      lastToolCall: undefined,
      lastModelOutput: toolResult,
    };
  };
}

async function executeTool(call: IToolCall): Promise<unknown> {
  return ToolExecutor.execute(call);
}
