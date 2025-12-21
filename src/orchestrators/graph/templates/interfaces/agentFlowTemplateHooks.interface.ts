import type { GraphNode } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';

export interface AgentFlowTemplateHooks {
  /**
   * Nó inicial que injeta/normaliza o input no state (ex.: colocar mensagem `role=user`).
   * Deve ser puro: não imprimir, não persistir, apenas atualizar o state.
   */
  seed?: GraphNode;

  /**
   * Nó de captura final: transforma o state em saídas padronizadas (ex.: `data.finalAnswer`).
   * Deve ser puro: não imprimir, não persistir, apenas atualizar o state.
   */
  capture?: GraphNode;
}

