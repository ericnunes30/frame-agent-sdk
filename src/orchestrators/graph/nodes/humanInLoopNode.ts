import { GraphStatus } from '../core/enums/graphEngine.enum';
import type { GraphNode, GraphNodeResult } from '../core/interfaces/graphEngine.interface';

export function createHumanInLoopNode(): GraphNode {
  return async (state, engine): Promise<GraphNodeResult> => {
    // O node apenas pausa a execução para esperar por input humano
    // A resposta do usuário será processada via GraphEngine.resume()
    
    return {
      shouldPause: true,
      status: GraphStatus.PAUSED,
    };
  };
}
