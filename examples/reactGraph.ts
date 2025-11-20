// Configuração e inicialização
import 'dotenv/config';
import 'tsconfig-paths/register';
import '../src/agents';

// Tipos e interfaces de memória
import type { Message } from '../src/memory';

// Componentes do PromptBuilder
import type { AgentInfo, PromptMode, ToolSchema } from '../src/promptBuilder';
import { PromptBuilder } from '../src/promptBuilder';

// Componentes LLM
import type { LLM } from '../src/llm';
import { LLM as LlmClient } from '../src/llm';

// Componentes do Graph Engine
import type { GraphDefinition, IGraphState } from '../src/orchestrators/graph';
import { GraphBuilder, GraphEngine, GraphStatus, createAgentNode, createHumanInLoopNode, createToolExecutorNode, createToolRouter } from '../src/orchestrators/graph';

// Componentes de Tools
import { toolRegistry } from '../src/tools/core/toolRegistry';
import { FinalAnswerTool, AskUserTool, TodoListTool } from '../src/tools';
import { generateTypedSchema } from '../src/tools';

export interface IReactGraphParams {
  llm: LLM;
  mode: PromptMode;
  agentInfo: AgentInfo;
  tools?: ToolSchema[];
  additionalInstructions?: string;
  maxSteps?: number;
}

export function buildReactGraph(params: IReactGraphParams): { definition: GraphDefinition; engine: GraphEngine } {
  assertReactGraphParams(params);
  const endNodeName = '__end__';
  const builder = new GraphBuilder({ maxSteps: params.maxSteps, endNodeName });
  const callLlmNode = createAgentNode({
    llm: params.llm,
    mode: params.mode,
    agentInfo: params.agentInfo,
    additionalInstructions: params.additionalInstructions,
    tools: params.tools,
  });
  const executeToolNode = createToolExecutorNode();
  const humanPauseNode = createHumanInLoopNode();
  const router = createToolRouter({
    callToolNode: 'execute_tool',
    askUserNode: 'ask_user',
    finishNode: endNodeName,
  });

  builder.addNode('call_llm', callLlmNode);
  builder.addNode('execute_tool', executeToolNode);
  builder.addNode('ask_user', humanPauseNode);
  builder.addConditionalEdge('call_llm', router);
  builder.addEdge('execute_tool', 'call_llm');
  builder.addEdge('ask_user', 'call_llm');
  builder.setEntryPoint('call_llm');
  builder.setEndNode(endNodeName);

  const definition = builder.build();
  const engine = new GraphEngine(definition, { maxSteps: builder.getMaxSteps() });
  return { definition, engine };
}

export function createInitialState(userInput: string): IGraphState {
  const trimmed = String(userInput ?? '').trim();
  const messages: Message[] = [];
  const hasInput = trimmed.length > 0;
  if (hasInput) messages.push({ role: 'user', content: trimmed });
  return {
    messages,
    data: {},
    status: GraphStatus.RUNNING,
  };
}

function assertReactGraphParams(params: IReactGraphParams): void {
  if (!params) throw new Error('params are required');
  if (!params.llm) throw new Error('llm is required');
  if (!params.mode) throw new Error('mode is required');
  if (!params.agentInfo) throw new Error('agentInfo is required');
}

function registerDefaultTools(): void {
  toolRegistry.register(new FinalAnswerTool());
  toolRegistry.register(new AskUserTool());
  toolRegistry.register(new TodoListTool());
}

function createLlmFromEnv(): LLM {
  const model = process.env.LLM_MODEL || process.env.OPENAI_MODEL || 'openai-gpt-4o-mini';
  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL;
  if (apiKey) return new LlmClient({ model, apiKey, baseUrl });
  const mock: any = {
    invoke: async (args: { messages: Message[]; systemPrompt?: string; mode?: PromptMode; agentInfo?: AgentInfo; additionalInstructions?: string; tools?: ToolSchema[] }) => {
      const history = args.messages || [];
      const assistantCount = history.filter((m) => m.role === 'assistant').length;
      if (assistantCount === 0) {
        const action = 'Action: todo_list = { "action": "create", "tasks": ["Planejar Sprint", "Configurar CI"], "defaultStatus": "pending" }';
        const thought = 'Thought: Inicializar lista de tarefas';
        return { content: `${thought}\n${action}` };
      }
      const finalAction = 'Action: final_answer = { "answer": "Lista de tarefas criada e exibida no System Prompt." }';
      const thought2 = 'Thought: Verificar atualização da seção Task List';
      return { content: `${thought2}\n${finalAction}` };
    },
  };
  return mock as unknown as LLM;
}

async function main(): Promise<void> {
  registerDefaultTools();
  const llm = createLlmFromEnv();
  const agentInfo: AgentInfo = {
    name: 'GraphDemo',
    goal: 'Resolver a pergunta do usuário usando ReAct',
    backstory: 'Agente de demonstração para o motor de grafos',
  };
  const mode = 'react' as PromptMode;
  PromptBuilder.buildSystemPrompt({ mode, agentInfo }); // garante modo registrado

  const question = process.env.DEMO_USER_INPUT || 'Qual é a capital da França?';
  const tools: ToolSchema[] | undefined = [
    { name: 'todo_list', description: 'Gerencia uma lista de tarefas', parameters: generateTypedSchema(new TodoListTool()) },
  ];
  const { engine } = buildReactGraph({ llm, mode, agentInfo, tools, additionalInstructions: 'Use a ferramenta todo_list para manter a seção Task List atualizada.' });
  const initialState = createInitialState(question);
  const result = await engine.execute(initialState);

  // Saída resumida
  // eslint-disable-next-line no-console
  console.log('Graph status:', result.status);
  // eslint-disable-next-line no-console
  console.log('Messages:', result.state.messages);
  // eslint-disable-next-line no-console
  console.log('Pending ask user:', result.state.pendingAskUser);
}

if (require.main === module) {
  main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Erro ao executar exemplo de graph:', error);
    process.exitCode = 1;
  });
}
