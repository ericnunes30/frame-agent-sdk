import type { Message } from '@/memory';
import type { AgentInfo, PromptBuilderConfig, PromptMode, ToolSchema } from '@/promptBuilder';
import type { LLM } from '@/llm';
import type { GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import type { IAgentNodeOptions } from '@/orchestrators/graph/nodes/interfaces/agentNode.interface';
import { createLLMFromConfig } from '../core/llmFactory';
import type { LLMConfig } from '../core/interfaces/llmConfig.interface';

export function createAgentNode(options: IAgentNodeOptions): GraphNode {
  assertOptions(options);
  const hasPromptConfig = Boolean(options.promptConfig);

  return async (state, engine): Promise<GraphNodeResult> => {
    const messages = engine.getMessagesForLLM();
    const response = await invokeLLM({
      options,
      messages,
      usePromptConfig: hasPromptConfig,
    });
    const content = response.content ?? null;
    let updates: GraphNodeResult = {
      lastModelOutput: content,
      metadata: response.metadata ?? undefined,
    };
    if (content) {
      engine.addMessage({ role: 'assistant', content });
    }
    console.log(`[AgentNode] Agent node produced output: ${content ? 'assistant message' : 'empty'}`);
    return updates;
  };
}


function assertOptions(options: IAgentNodeOptions): void {
  if (!options) throw new Error('Agent node options are required');
  if (!options.llm) throw new Error('LLM instance or config is required');
  const hasPromptConfig = Boolean(options.promptConfig);
  if (hasPromptConfig) return;
  if (!options.mode) throw new Error('mode is required when promptConfig is not provided');
  if (!options.agentInfo) throw new Error('agentInfo is required when promptConfig is not provided');
}

function isLLMConfig(obj: LLM | LLMConfig): obj is LLMConfig {
  return 'model' in obj && 'apiKey' in obj;
}

async function invokeLLM(args: {
  options: IAgentNodeOptions;
  messages: Message[];
  usePromptConfig: boolean;
}): Promise<{ content: string | null; metadata?: Record<string, unknown> }> {
  
  // 🎯 LOG DO MOMENTO EXATO ANTES DE INVOCAR O LLM
  console.log('\n' + '🚀' + '='.repeat(78));
  console.log('🚀 AGENT NODE - INVOCANDO LLM COM PROMPT COMPLETO');
  console.log('='.repeat(80));
  console.log(`📊 Número de mensagens: ${args.messages.length}`);
  console.log(`🔧 Usando promptConfig: ${args.usePromptConfig}`);
  console.log(`🤖 Modo: ${args.options.mode || 'não definido'}`);
  console.log(`👤 Agente: ${args.options.agentInfo?.name || 'não definido'}`);
  console.log(`🌡️  Temperatura: ${args.options.temperature || 'default'}`);
  console.log(`🔢 Max Tokens: ${args.options.maxTokens || 'default'}`);
  
  if (args.messages && args.messages.length > 0) {
    console.log(`\n💬 MENSAGENS PARA O LLM:`);
    console.log('-'.repeat(60));
    args.messages.forEach((msg, index) => {
      console.log(`\n[${index}] Role: ${msg.role.toUpperCase()}`);
      console.log(`    Content (${msg.content?.length || 0} caracteres):`);
      if (msg.content) {
        console.log('    ' + msg.content.split('\n').join('\n    '));
      }
    });
    console.log('-'.repeat(60));
  }
  console.log('='.repeat(80) + '\n');
  
  // Normaliza para instância LLM
  const llmInstance = isLLMConfig(args.options.llm)
    ? createLLMFromConfig(args.options.llm)
    : args.options.llm;

  if (args.usePromptConfig) {
    const config = args.options.promptConfig as PromptBuilderConfig;
    return llmInstance.invoke({
      messages: args.messages,
      promptConfig: config,
      temperature: args.options.temperature,
      topP: args.options.topP,
      maxTokens: args.options.maxTokens,
    });
  }

  const mode = args.options.mode as PromptMode;
  const agentInfo = args.options.agentInfo as AgentInfo;
  const tools = args.options.tools as ToolSchema[] | undefined;
  return llmInstance.invoke({
    messages: args.messages,
    mode,
    agentInfo,
    additionalInstructions: args.options.additionalInstructions,
    tools,
    temperature: args.options.temperature,
    topP: args.options.topP,
    maxTokens: args.options.maxTokens,
  });
}
