import type { Message } from '@/memory';
import type { AgentInfo, PromptBuilderConfig, PromptMode, ToolSchema } from '@/promptBuilder';
import { AgentLLM, type AgentLLMConfig } from '@/agent';
import type { GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import type { IAgentNodeOptions } from '@/orchestrators/graph/nodes/interfaces/agentNode.interface';
import { createToolDetectionNode } from '@/orchestrators/graph/nodes/toolDetectionNode';
import { createToolExecutorNode } from '@/orchestrators/graph/nodes/toolExecutorNode';
import type { TraceContext } from '@/telemetry/interfaces/traceContext.interface';
import type { TraceSink } from '@/telemetry/interfaces/traceSink.interface';
import type { TelemetryOptions } from '@/telemetry/interfaces/telemetryOptions.interface';

export function createAgentNode(options: IAgentNodeOptions): GraphNode {
  assertOptions(options);
  const hasPromptConfig = Boolean(options.promptConfig);
  const hasCustomMessages = Boolean(options.customMessages);
  const autoExecuteTools = options.autoExecuteTools ?? false;
  const skipMemoryCommit = options.skipMemoryCommit ?? false;

  // Cria nós de tool se auto-execução estiver habilitada
  const toolDetectionNode = autoExecuteTools ? createToolDetectionNode() : null;
  const toolExecutorNode = autoExecuteTools ? createToolExecutorNode() : null;

  return async (state, engine): Promise<GraphNodeResult> => {
    // Usa mensagens customizadas se fornecidas, senão usa o histórico do engine
    let messages = hasCustomMessages ? options.customMessages! : engine.getMessagesForLLM();

    // Extrai taskList do metadata se existir
    const taskList = (state.metadata as any)?.taskList;

    // Verificar se há erro de validação ReAct para adicionar feedback temporário
    const validationError = (state.metadata as any)?.validation?.error;
    if (validationError) {
      // Criar uma cópia temporária das mensagens
      const tempMessages = [...messages];
      
      // Adicionar mensagem de erro temporária (não salva no histórico permanente)
      tempMessages.push({
        role: 'system',
        content: `⚠️ ERRO DE FORMATAÇÃO: ${validationError.message}\nPor favor, siga o formato ReAct:\nThought: [seu pensamento]\nAction: [nome_da_ferramenta]\nAction Input: [JSON com parâmetros]`
      });
      
      // Usar as mensagens temporárias para esta chamada ao LLM
      messages = tempMessages;
    }

    // Cria options atualizadas com a taskList do estado
    const runtimeOptions = {
      ...options,
      taskList: taskList || options.taskList
    };

    const baseTraceContext = engine.getTraceContext();
    const traceContext: TraceContext | undefined = baseTraceContext
      ? {
        ...baseTraceContext,
        agent: {
          ...(baseTraceContext.agent ?? {}),
          label: (runtimeOptions.agentInfo as any)?.name ?? baseTraceContext.agent?.label,
        },
      }
      : undefined;

    const response = await invokeAgent({
      options: runtimeOptions,
      messages,
      usePromptConfig: hasPromptConfig,
      taskList: runtimeOptions.taskList, // Passa taskList para invokeAgent
      trace: engine.getTraceSink(),
      telemetry: engine.getTelemetryOptions(),
      traceContext,
    });
    const content = response.content ?? null;
    let updates: GraphNodeResult = {
      lastModelOutput: content,
      metadata: response.metadata ?? undefined,
    };
    // Adiciona ao histórico apenas se skipMemoryCommit não estiver ativo
    if (content && !skipMemoryCommit) {
      const assistantMessage: Message = { role: 'assistant', content };
      // Retornar a mensagem no resultado - o mergeState cuidará de adicionar ao ChatHistoryManager
      updates = {
        ...updates,
        messages: [assistantMessage]
      };
    }

    // Se auto-execução de tools está habilitada, detecta e executa
    if (autoExecuteTools && toolDetectionNode && toolExecutorNode) {
      // Cria um estado temporário com a saída do LLM
      const stateWithOutput = {
        ...state,
        lastModelOutput: content,
        metadata: updates.metadata,
      };

      // Detecta tool na saída
      const detectionResult = await toolDetectionNode(stateWithOutput, engine);

      // Merge resultados da detecção
      updates = {
        ...updates,
        lastToolCall: detectionResult.lastToolCall,
        metadata: detectionResult.metadata ?? updates.metadata,
      };

      // Se uma tool foi detectada, executa
      if (detectionResult.lastToolCall) {
        const stateWithTool = {
          ...state,
          lastToolCall: detectionResult.lastToolCall,
          lastModelOutput: content,
          metadata: updates.metadata,
        };

        const executionResult = await toolExecutorNode(stateWithTool, engine);

        // Merge resultados da execução
        updates = {
          ...updates,
          lastToolCall: executionResult.lastToolCall,
          lastModelOutput: executionResult.lastModelOutput ?? updates.lastModelOutput,
        };
      }
    }

    return updates;
  };
}


function assertOptions(options: IAgentNodeOptions): void {
  if (!options) throw new Error('Agent node options are required');
  if (!options.llm) throw new Error('AgentLLM instance or config is required');
  const hasPromptConfig = Boolean(options.promptConfig);
  if (hasPromptConfig) return;
  if (!options.mode) throw new Error('mode is required when promptConfig is not provided');
  if (!options.agentInfo) throw new Error('agentInfo is required when promptConfig is not provided');
}

function isAgentConfig(obj: AgentLLM | AgentLLMConfig): obj is AgentLLMConfig {
  return 'model' in obj && 'apiKey' in obj;
}

async function invokeAgent(args: {
  options: IAgentNodeOptions;
  messages: Message[];
  usePromptConfig: boolean;
  taskList?: { items: Array<{ id: string; title: string; status: 'pending' | 'in_progress' | 'completed' }> };
  trace?: TraceSink;
  telemetry?: TelemetryOptions;
  traceContext?: TraceContext;
}): Promise<{ content: string | null; metadata?: Record<string, unknown> }> {


  // Normaliza para instância AgentLLM
  const agentInstance = isAgentConfig(args.options.llm)
    ? AgentLLM.fromConfig(args.options.llm)
    : args.options.llm;

  if (args.usePromptConfig) {
    const config = args.options.promptConfig as PromptBuilderConfig;
    return agentInstance.invoke({
      messages: args.messages,
      promptConfig: config,
      temperature: args.options.temperature,
      topP: args.options.topP,
      maxTokens: args.options.maxTokens,
      trace: args.trace,
      telemetry: args.telemetry,
      traceContext: args.traceContext,
    });
  }

  const mode = args.options.mode as PromptMode;
  const agentInfo = args.options.agentInfo as AgentInfo;
  const tools = args.options.tools as ToolSchema[] | undefined;
  return agentInstance.invoke({
    messages: args.messages,
    mode,
    agentInfo,
    additionalInstructions: args.options.additionalInstructions,
    tools,
    taskList: args.taskList, // Passa taskList para agent.invoke
    temperature: args.options.temperature,
    topP: args.options.topP,
    maxTokens: args.options.maxTokens,
    trace: args.trace,
    telemetry: args.telemetry,
    traceContext: args.traceContext,
  });
}
