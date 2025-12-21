import type { AgentFlowTemplateAskUserBehavior } from '@/orchestrators/graph/templates/interfaces/agentFlowTemplateAskUserBehavior.type';

export interface AgentFlowTemplatePolicies {
  /**
   * Quando o LLM chamar `ask_user`.
   * - `finish`: encerra o fluxo após capturar a pergunta no state.
   * - `pause`: pausa o fluxo (GraphEngine retorna PAUSED) aguardando `resume()`.
   */
  askUserBehavior?: AgentFlowTemplateAskUserBehavior;

  /**
   * Quando não houver toolcall detectada no output do LLM.
   * - `finish`: encerra após captura (default).
   * - `loop`: volta ao agent (útil para modos não‑ReAct, ou quando a captura deve ser explícita via tool).
   */
  noToolCallBehavior?: 'finish' | 'loop';
}

