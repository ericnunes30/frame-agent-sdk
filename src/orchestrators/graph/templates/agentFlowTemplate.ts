import type { GraphDefinition, GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import type { IGraphState } from '@/orchestrators/graph/core/interfaces/graphState.interface';
import { GraphStatus } from '@/orchestrators/graph/core/enums/graphEngine.enum';
import { createAgentNode } from '@/orchestrators/graph/nodes/agentNode';
import { createReactValidationNode } from '@/orchestrators/graph/nodes/reactValidationNode';
import { createToolDetectionNode } from '@/orchestrators/graph/nodes/toolDetectionNode';
import { createToolExecutorNode } from '@/orchestrators/graph/nodes/toolExecutorNode';
import type { AgentFlowTemplateOptions } from '@/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface';
import { extractFinalAnswer, extractInput } from '@/orchestrators/graph/utils/graphStateUtils';

type AskUserPayload = { question?: string; details?: string };

function pickString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length ? value : undefined;
}

function defaultSeedNode(): GraphNode {
  return async (state): Promise<GraphNodeResult> => {
    const input = extractInput(state, { allowFallbackToMessages: false });
    if (!input) return {};

    const alreadyHasUserMessage = (state.messages ?? []).some((m) => m.role === 'user');
    if (alreadyHasUserMessage) return {};

    return { messages: [{ role: 'user', content: input }] };
  };
}

function defaultCaptureNode(): GraphNode {
  return async (state): Promise<GraphNodeResult> => {
    const toolName = state.lastToolCall?.toolName;
    const params = (state.lastToolCall?.params ?? {}) as Record<string, unknown>;

    if (toolName === 'final_answer') {
      const answer = extractFinalAnswer(state);
      return answer ? { data: { finalAnswer: answer } } : {};
    }

    if (toolName === 'ask_user') {
      const ask = {
        question: pickString(params.question),
        details: pickString(params.details),
      };
      return { data: { askUser: ask } };
    }

    if (state.lastModelOutput) {
      return { data: { output: state.lastModelOutput } };
    }

    return {};
  };
}

function createAskUserNode(behavior: 'finish' | 'pause'): GraphNode {
  return async (state): Promise<GraphNodeResult> => {
    const params = (state.lastToolCall?.params ?? {}) as AskUserPayload;
    const question = pickString(params.question) ?? '';
    const details = pickString(params.details);

    return {
      data: { askUser: { question, details } },
      ...(behavior === 'pause'
        ? {
          pendingAskUser: { question, details },
          shouldPause: true,
          status: GraphStatus.PAUSED,
        }
        : {}),
    };
  };
}

function createSafeToolExecutorNode(toolPolicy?: import('@/tools/policy/toolPolicy.interface').ToolPolicy): GraphNode {
  const inner = createToolExecutorNode({ toolPolicy });
  return async (state, engine): Promise<GraphNodeResult> => {
    try {
      return await inner(state, engine);
    } catch (error) {
      const message = (error as Error)?.message ?? String(error);
      return {
        lastToolCall: undefined,
        metadata: { toolError: { message, toolName: state.lastToolCall?.toolName } },
        messages: [{ role: 'system', content: `Tool execution failed: ${message}` }],
      };
    }
  };
}

function validationPassed(state: IGraphState): boolean {
  const passed = (state.metadata as any)?.validation?.passed;
  return passed !== false;
}

/**
 * Template opinativo compatível com o pipeline de agente usado no code-cli:
 * `seed → agent → reactValidation → toolDetection → toolExecutor → capture → end`
 */
export function createAgentFlowTemplate(options: AgentFlowTemplateOptions): GraphDefinition {
  const nodeIds = {
    seed: 'seed',
    agent: 'agent',
    reactValidation: 'reactValidation',
    toolDetection: 'toolDetection',
    askUser: 'askUser',
    toolExecutor: 'toolExecutor',
    capture: 'capture',
    end: 'end',
    ...(options.nodeIds ?? {}),
  } as const;

  const policies = {
    askUserBehavior: 'finish',
    noToolCallBehavior: 'finish',
    ...(options.policies ?? {}),
  } as const;

  const enableReactValidation = options.enableReactValidation ?? true;

  const seedNode = options.hooks?.seed ?? defaultSeedNode();
  const captureNode = options.hooks?.capture ?? defaultCaptureNode();

  const agentNode = createAgentNode(options.agent);
  const reactValidationNode = createReactValidationNode();
  const toolDetectionNode = options.toolDetection ?? createToolDetectionNode();
  const toolPolicy = (options.agent as any)?.promptConfig?.toolPolicy as
    | import('@/tools/policy/toolPolicy.interface').ToolPolicy
    | undefined;
  const toolExecutorNode = options.toolExecutor ?? createSafeToolExecutorNode(toolPolicy);
  const askUserNode = createAskUserNode(policies.askUserBehavior);

  const endNode: GraphNode = async (): Promise<GraphNodeResult> => ({ status: GraphStatus.FINISHED });

  const nodes: Record<string, GraphNode> = {
    [nodeIds.seed]: seedNode,
    [nodeIds.agent]: agentNode,
    [nodeIds.reactValidation]: reactValidationNode,
    [nodeIds.toolDetection]: toolDetectionNode,
    [nodeIds.askUser]: askUserNode,
    [nodeIds.toolExecutor]: toolExecutorNode,
    [nodeIds.capture]: captureNode,
    [nodeIds.end]: endNode,
  };

  const edges: GraphDefinition['edges'] = {
    [nodeIds.seed]: nodeIds.agent,
    [nodeIds.agent]: enableReactValidation ? nodeIds.reactValidation : nodeIds.toolDetection,
    [nodeIds.reactValidation]: (state) => (validationPassed(state) ? nodeIds.toolDetection : nodeIds.agent),
    [nodeIds.toolDetection]: (state) => {
      if (!validationPassed(state)) return nodeIds.agent;

      const call = state.lastToolCall;
      if (!call) return policies.noToolCallBehavior === 'loop' ? nodeIds.agent : nodeIds.capture;

      if (call.toolName === 'final_answer') return nodeIds.capture;
      if (call.toolName === 'ask_user') return policies.askUserBehavior === 'pause' ? nodeIds.askUser : nodeIds.capture;
      return nodeIds.toolExecutor;
    },
    [nodeIds.askUser]: nodeIds.agent,
    [nodeIds.toolExecutor]: nodeIds.agent,
    [nodeIds.capture]: nodeIds.end,
    [nodeIds.end]: nodeIds.end,
  };

  return {
    entryPoint: nodeIds.seed,
    endNodeName: nodeIds.end,
    nodes,
    edges,
  };
}
