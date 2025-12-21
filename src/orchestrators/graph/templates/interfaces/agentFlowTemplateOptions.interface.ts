import type { IAgentNodeOptions } from '@/orchestrators/graph/nodes/interfaces/agentNode.interface';
import type { GraphNode } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import type { AgentFlowTemplateHooks } from '@/orchestrators/graph/templates/interfaces/agentFlowTemplateHooks.interface';
import type { AgentFlowTemplatePolicies } from '@/orchestrators/graph/templates/interfaces/agentFlowTemplatePolicies.interface';

export interface AgentFlowTemplateOptions {
  /**
   * Opções do nó de agente (LLM/prompt/tools/memória/telemetria etc).
   * Reaproveita o contrato já estabilizado do SDK.
   */
  agent: IAgentNodeOptions;

  /** Habilita a validação ReAct antes da detecção de tools. Default: true. */
  enableReactValidation?: boolean;

  /**
   * Permite substituir os hooks padrão.
   * Se omitido, o template usa implementações default (seed/capture).
   */
  hooks?: AgentFlowTemplateHooks;

  /**
   * Políticas de roteamento/finalização.
   * Se omitido, usa defaults compatíveis com o code-cli.
   */
  policies?: AgentFlowTemplatePolicies;

  /**
   * Permite customizar o executor de tools (ex.: wrapper com política de erro).
   * Se omitido, usa `createToolExecutorNode()` com proteção de erro.
   */
  toolExecutor?: GraphNode;

  /**
   * Permite customizar o detector de tools.
   * Se omitido, usa `createToolDetectionNode()`.
   */
  toolDetection?: GraphNode;

  /**
   * Nomes de nós (avançado). Use apenas se o app precisa de IDs estáveis para telemetria.
   */
  nodeIds?: Partial<{
    seed: string;
    agent: string;
    reactValidation: string;
    toolDetection: string;
    askUser: string;
    toolExecutor: string;
    capture: string;
    end: string;
  }>;
}

