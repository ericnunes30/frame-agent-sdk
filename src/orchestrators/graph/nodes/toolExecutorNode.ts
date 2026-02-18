import { ToolExecutor } from '@/tools/core/toolExecutor';
import type { IToolCall } from '@/tools/core/interfaces';
import type { GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import { logger } from '@/utils/logger';
import type { SharedState } from '@/flows/interfaces/sharedState.interface';
import { applySharedPatch } from '@/flows/utils/sharedPatchApplier';
import { createTraceId } from '@/telemetry/utils/id';
import type { ToolPolicy } from '@/tools/policy/toolPolicy.interface';
import { isToolAllowedByPolicy } from '@/tools/policy/toolPolicyApplier';

interface ToDoIstPlanGuardOptions {
  enabled?: boolean;
  minInitialPlanItems?: number;
}

interface ToDoIstPlanGuardState {
  enabled: boolean;
  initialPlanReady: boolean;
  minInitialPlanItems: number;
}

type ToDoIstPlanStatus = 'pending' | 'in_progress' | 'completed';

interface ToDoIstPlanItemInput {
  step: string;
  status: ToDoIstPlanStatus;
}

interface ToDoIstPlanItemStored {
  title: string;
  status: ToDoIstPlanStatus;
}

function normalizeToDoIstStatus(value: unknown): ToDoIstPlanStatus | undefined {
  if (value === 'pending' || value === 'in_progress' || value === 'completed') {
    return value;
  }
  return undefined;
}

function readToDoIstPlanFromCall(call: IToolCall): ToDoIstPlanItemInput[] | undefined {
  if (call.toolName !== 'toDoIst') {
    return undefined;
  }

  const params = call.params as Record<string, unknown> | undefined;
  if (!Array.isArray(params?.plan)) {
    return undefined;
  }

  const parsed: ToDoIstPlanItemInput[] = [];
  for (const rawItem of params.plan as unknown[]) {
    const item = rawItem as Record<string, unknown> | null;
    const step = typeof item?.step === 'string' ? item.step.trim() : '';
    const status = normalizeToDoIstStatus(item?.status);
    if (!step || !status) {
      return undefined;
    }

    parsed.push({ step, status });
  }

  return parsed;
}

function readToDoIstPlanFromMetadata(metadata: unknown): ToDoIstPlanItemStored[] {
  if (!metadata || typeof metadata !== 'object') {
    return [];
  }

  const items = (metadata as { taskList?: { items?: unknown } }).taskList?.items;
  if (!Array.isArray(items)) {
    return [];
  }

  const parsed: ToDoIstPlanItemStored[] = [];
  for (const rawItem of items) {
    const item = rawItem as Record<string, unknown> | null;
    const title = typeof item?.title === 'string' ? item.title.trim() : '';
    const status = normalizeToDoIstStatus(item?.status);
    if (!title || !status) {
      continue;
    }

    parsed.push({ title, status });
  }

  return parsed;
}

function readQueuedStatusesByTitle(items: ToDoIstPlanItemStored[]): Map<string, ToDoIstPlanStatus[]> {
  const queuedByTitle = new Map<string, ToDoIstPlanStatus[]>();

  for (const item of items) {
    const queue = queuedByTitle.get(item.title) ?? [];
    queue.push(item.status);
    queuedByTitle.set(item.title, queue);
  }

  return queuedByTitle;
}

function validateToDoIstPlanStructure(
  plan: ToDoIstPlanItemInput[],
  options: { isInitialPlan: boolean }
): { isValid: boolean; message?: string } {
  const inProgressCount = plan.filter((item) => item.status === 'in_progress').length;
  const completedCount = plan.filter((item) => item.status === 'completed').length;
  const isAllCompleted = plan.length > 0 && completedCount === plan.length;

  if (inProgressCount > 1) {
    return {
      isValid: false,
      message: 'Plan guardrail: only one item can be "in_progress" at a time.',
    };
  }

  if (!isAllCompleted && inProgressCount !== 1) {
    return {
      isValid: false,
      message: 'Plan guardrail: while work is active, exactly one item must be "in_progress".',
    };
  }

  if (isAllCompleted && inProgressCount !== 0) {
    return {
      isValid: false,
      message: 'Plan guardrail: a fully completed plan cannot contain "in_progress" items.',
    };
  }

  if (options.isInitialPlan && isAllCompleted) {
    return {
      isValid: false,
      message: 'Plan guardrail: initial update_plan cannot set all items to "completed".',
    };
  }

  return { isValid: true };
}

function validateToDoIstPlanTransitions(
  previousPlan: ToDoIstPlanItemStored[],
  nextPlan: ToDoIstPlanItemInput[]
): { isValid: boolean; message?: string } {
  if (previousPlan.length === 0) {
    return { isValid: true };
  }

  const queuedPreviousStatuses = readQueuedStatusesByTitle(previousPlan);
  let pendingToInProgress = 0;
  let inProgressToCompleted = 0;
  let pendingToCompleted = 0;
  let otherTransitions = 0;
  let changedStatuses = 0;

  for (const item of nextPlan) {
    const queue = queuedPreviousStatuses.get(item.step);
    if (!queue || queue.length === 0) {
      continue;
    }

    const previousStatus = queue.shift()!;
    if (previousStatus === item.status) {
      continue;
    }

    changedStatuses += 1;
    if (previousStatus === 'pending' && item.status === 'in_progress') {
      pendingToInProgress += 1;
      continue;
    }
    if (previousStatus === 'in_progress' && item.status === 'completed') {
      inProgressToCompleted += 1;
      continue;
    }
    if (previousStatus === 'pending' && item.status === 'completed') {
      pendingToCompleted += 1;
      continue;
    }

    otherTransitions += 1;
  }

  if (pendingToCompleted > 0) {
    return {
      isValid: false,
      message: 'Plan guardrail: do not move items directly from "pending" to "completed"; move them through "in_progress" first.',
    };
  }

  if (otherTransitions > 0) {
    return {
      isValid: false,
      message: 'Plan guardrail: invalid status transition detected. Use only pending->in_progress and in_progress->completed transitions.',
    };
  }

  const isNoTransition = changedStatuses === 0;
  const isStartTransition = pendingToInProgress === 1 && inProgressToCompleted === 0 && changedStatuses === 1;
  const isFinishTransition = pendingToInProgress === 0 && inProgressToCompleted === 1 && changedStatuses === 1;
  const isHandoffTransition = pendingToInProgress === 1 && inProgressToCompleted === 1 && changedStatuses === 2;

  if (isNoTransition || isStartTransition || isFinishTransition || isHandoffTransition) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: 'Plan guardrail: use incremental updates (start one item, finish one item, or handoff in one update).',
  };
}

function toDoIstActionFromCall(call: IToolCall): string | undefined {
  if (call.toolName !== 'toDoIst') {
    return undefined;
  }

  const params = call.params as Record<string, unknown> | undefined;
  return typeof params?.action === 'string' ? params.action : undefined;
}

function toDoIstPlanLengthFromCall(call: IToolCall): number {
  if (call.toolName !== 'toDoIst') {
    return 0;
  }

  const params = call.params as Record<string, unknown> | undefined;
  return Array.isArray(params?.plan) ? params.plan.length : 0;
}

function toDoIstPlanLengthFromMetadata(metadata: unknown): number {
  if (!metadata || typeof metadata !== 'object') {
    return 0;
  }

  const taskList = (metadata as { taskList?: { items?: unknown } }).taskList;
  return Array.isArray(taskList?.items) ? taskList.items.length : 0;
}

function readToDoIstGuardState(
  state: { metadata?: Record<string, unknown> },
  options?: ToDoIstPlanGuardOptions
): ToDoIstPlanGuardState {
  const minInitialPlanItems = Math.max(1, options?.minInitialPlanItems ?? 2);
  const enabled = options?.enabled === true;

  const previousRaw = state.metadata?.todoPlanGuard as Partial<ToDoIstPlanGuardState> | undefined;
  const previousInitialPlanReady = previousRaw?.initialPlanReady === true;

  return {
    enabled,
    initialPlanReady: previousInitialPlanReady,
    minInitialPlanItems,
  };
}

function buildGuardrailValidationError(message: string) {
  return {
    passed: false,
    error: {
      type: 'todoist_guardrail',
      message,
    },
  };
}

// Helper para logs inline que respeita SHOW_TOOL_LOGS_INLINE
const showToolLogs = process.env.SHOW_TOOL_LOGS_INLINE === 'True' || process.env.SHOW_TOOL_LOGS_INLINE === 'true';
const toolLog = (...args: unknown[]) => {
  if (showToolLogs) {
    console.log(...args);
  }
};

export function createToolExecutorNode(options?: {
  toolPolicy?: ToolPolicy;
  todoPlanGuard?: ToDoIstPlanGuardOptions;
}): GraphNode {
  return async (state, engine): Promise<GraphNodeResult> => {
    const call = state.lastToolCall;
    toolLog('[ToolExecutorNode] ========== INÍCIO ==========');
    toolLog('[ToolExecutorNode] lastToolCall:', JSON.stringify(call));
    logger.info(`[ToolExecutorNode] INÍCIO - lastToolCall:`, JSON.stringify(call));

    if (!call) {
      toolLog('[ToolExecutorNode] SEM TOOL CALL - retornando');
      logger.warn('[ToolExecutorNode] No pending tool call');
      return { logs: ['No pending tool call'], lastToolCall: undefined };
    }

    toolLog('[ToolExecutorNode] TEM TOOL CALL - executando:', call.toolName);
    logger.info(`[ToolExecutorNode] Executando tool call:`, JSON.stringify(call));

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

    const todoPlanGuard = readToDoIstGuardState(state, options?.todoPlanGuard);
    const toDoIstAction = toDoIstActionFromCall(call);
    const isToDoIstCall = call.toolName === 'toDoIst';
    const isUpdatePlan = isToDoIstCall && toDoIstAction === 'update_plan';
    const isGetPlan = isToDoIstCall && toDoIstAction === 'get_plan';

    if (todoPlanGuard.enabled && !todoPlanGuard.initialPlanReady && !isToDoIstCall) {
      const guardMessage = `Plan guardrail: before using "${call.toolName}", call toDoIst update_plan with the full ordered plan first.`;

      engine.emitTrace(state, {
        type: 'custom:todo_plan_guardrail_blocked',
        level: 'warn',
        tool: { name: call.toolName, toolCallId: call.toolCallId, params: call.params },
        message: guardMessage,
      });

      engine.addMessage({
        role: 'system',
        content:
          `Guardrail: toDoIst is enabled for this agent. Before calling "${call.toolName}", first call:\n` +
          `Action: toDoIst = {"action":"update_plan","plan":[{"step":"...","status":"in_progress"},{"step":"...","status":"pending"}]}\n` +
          `Provide the full ordered plan in one update.`,
      });

      return {
        lastToolCall: undefined,
        metadata: {
          todoPlanGuard,
          validation: buildGuardrailValidationError(guardMessage),
        },
        logs: [guardMessage],
      };
    }

    if (todoPlanGuard.enabled && !todoPlanGuard.initialPlanReady && isUpdatePlan) {
      const planLength = toDoIstPlanLengthFromCall(call);
      if (planLength < todoPlanGuard.minInitialPlanItems) {
        const guardMessage =
          `Plan guardrail: initial update_plan must include at least ${todoPlanGuard.minInitialPlanItems} items in the ordered plan.`;

        engine.emitTrace(state, {
          type: 'custom:todo_plan_guardrail_blocked',
          level: 'warn',
          tool: { name: call.toolName, toolCallId: call.toolCallId, params: call.params },
          message: guardMessage,
        });

        engine.addMessage({
          role: 'system',
          content:
            `Guardrail: initial toDoIst update_plan is too short (${planLength}). ` +
            `Send a full ordered plan with at least ${todoPlanGuard.minInitialPlanItems} items.`,
        });

        return {
          lastToolCall: undefined,
          metadata: {
            todoPlanGuard,
            validation: buildGuardrailValidationError(guardMessage),
          },
          logs: [guardMessage],
        };
      }
    }

    if (todoPlanGuard.enabled && isUpdatePlan) {
      const nextPlan = readToDoIstPlanFromCall(call);
      if (!nextPlan) {
        const guardMessage = 'Plan guardrail: update_plan requires a valid "plan" payload with { step, status } items.';

        engine.emitTrace(state, {
          type: 'custom:todo_plan_guardrail_blocked',
          level: 'warn',
          tool: { name: call.toolName, toolCallId: call.toolCallId, params: call.params },
          message: guardMessage,
        });

        engine.addMessage({
          role: 'system',
          content: `Guardrail: ${guardMessage}`,
        });

        return {
          lastToolCall: undefined,
          metadata: {
            todoPlanGuard,
            validation: buildGuardrailValidationError(guardMessage),
          },
          logs: [guardMessage],
        };
      }

      const previousPlan = readToDoIstPlanFromMetadata(state.metadata);
      const structureValidation = validateToDoIstPlanStructure(nextPlan, {
        isInitialPlan: !todoPlanGuard.initialPlanReady,
      });
      if (!structureValidation.isValid) {
        const guardMessage = structureValidation.message ?? 'Plan guardrail: invalid plan structure.';

        engine.emitTrace(state, {
          type: 'custom:todo_plan_guardrail_blocked',
          level: 'warn',
          tool: { name: call.toolName, toolCallId: call.toolCallId, params: call.params },
          message: guardMessage,
        });

        engine.addMessage({
          role: 'system',
          content: `Guardrail: ${guardMessage}`,
        });

        return {
          lastToolCall: undefined,
          metadata: {
            todoPlanGuard,
            validation: buildGuardrailValidationError(guardMessage),
          },
          logs: [guardMessage],
        };
      }

      const transitionValidation = validateToDoIstPlanTransitions(previousPlan, nextPlan);
      if (!transitionValidation.isValid) {
        const guardMessage = transitionValidation.message ?? 'Plan guardrail: invalid status transition.';

        engine.emitTrace(state, {
          type: 'custom:todo_plan_guardrail_blocked',
          level: 'warn',
          tool: { name: call.toolName, toolCallId: call.toolCallId, params: call.params },
          message: guardMessage,
        });

        engine.addMessage({
          role: 'system',
          content: `Guardrail: ${guardMessage}`,
        });

        return {
          lastToolCall: undefined,
          metadata: {
            todoPlanGuard,
            validation: buildGuardrailValidationError(guardMessage),
          },
          logs: [guardMessage],
        };
      }
    }

    logger.info(`[ToolExecutorNode] Executando tool call:`, JSON.stringify(call));

    // Execute tool e recebe resultado estruturado
    const toolCallId = call.toolCallId ?? createTraceId();
    const startedAt = Date.now();
    toolLog('[ToolExecutorNode] ANTES de emitTrace');
    engine.emitTrace(state, {
      type: 'tool_execution_started',
      level: 'info',
      tool: { name: call.toolName, toolCallId, params: call.params },
    });
    toolLog('[ToolExecutorNode] DEPOIS de emitTrace, ANTES de executeTool');

    let toolResult;
    try {
      toolLog('[ToolExecutorNode] Chamando executeTool...');
      toolResult = await executeTool(call.toolCallId ? call : { ...call, toolCallId });
      toolLog('[ToolExecutorNode] executeTool completou!');
    } catch (error) {
      toolLog('[ToolExecutorNode] ERRO em executeTool:', error);
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

    const nextTodoPlanGuard: ToDoIstPlanGuardState = { ...todoPlanGuard };
    if (nextTodoPlanGuard.enabled && !nextTodoPlanGuard.initialPlanReady && isToDoIstCall) {
      if (isUpdatePlan || isGetPlan) {
        const planLengthFromMetadata = toDoIstPlanLengthFromMetadata(toolMetadata);
        const planLengthFromCall = toDoIstPlanLengthFromCall(call);
        const observedPlanLength = Math.max(planLengthFromMetadata, planLengthFromCall);
        if (observedPlanLength >= nextTodoPlanGuard.minInitialPlanItems) {
          nextTodoPlanGuard.initialPlanReady = true;
        }
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
    const mergedMetadata =
      toolMetadata && typeof toolMetadata === 'object'
        ? {
          ...(toolMetadata as Record<string, unknown>),
          ...(nextTodoPlanGuard.enabled ? { todoPlanGuard: nextTodoPlanGuard } : {}),
        }
        : nextTodoPlanGuard.enabled
          ? { todoPlanGuard: nextTodoPlanGuard }
          : undefined;

    if (mergedMetadata && Object.keys(mergedMetadata).length > 0) {
      logger.info(`[ToolExecutorNode] Propagando metadata da tool:`, JSON.stringify(mergedMetadata));
      return {
        ...nodeResult,
        data: nextData ?? undefined,
        metadata: mergedMetadata
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
  toolLog('[executeTool wrapper] INÍCIO - toolName:', call.toolName);
  const result = await ToolExecutor.execute(call);
  toolLog('[executeTool wrapper] FIM - resultado:', typeof result);
  return result;
}
