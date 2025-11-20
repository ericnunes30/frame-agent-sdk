// examples/graphWithLlmConfig.ts
/**
 * Exemplo demonstrando o uso da nova funcionalidade de configuração do LLM no Graph Engine
 * 
 * Este exemplo mostra como usar LLMConfig ao invés de instância LLM,
 * demonstrando a separação de responsabilidades e execução real do Graph Engine.
 */

import 'dotenv/config';
import 'tsconfig-paths/register';
import '../src/agents';

// Tipos e interfaces do Graph Engine
import type { IGraphState } from '../src/orchestrators/graph';
import { GraphBuilder, GraphEngine, GraphStatus, createAgentNode } from '../src/orchestrators/graph';

// Tipos do PromptBuilder
import type { AgentInfo, PromptMode } from '../src/promptBuilder';
import { PromptBuilder } from '../src/promptBuilder';

// Nova interface LLMConfig
import type { LLMConfig } from '../src/orchestrators/graph/core/interfaces/llmConfig.interface';

export function buildSimpleGraph(
  llmConfig: LLMConfig,
  mode: PromptMode,
  agentInfo: AgentInfo,
  maxSteps?: number
): GraphEngine {
  // Validar parâmetros
  if (!llmConfig) throw new Error('llmConfig é obrigatório');
  if (!mode) throw new Error('mode é obrigatório');
  if (!agentInfo) throw new Error('agentInfo é obrigatório');

  const endNodeName = '__end__';
  const builder = new GraphBuilder({ maxSteps, endNodeName });

  // Criar nó do agente usando LLMConfig (nova funcionalidade!)
  const callLlmNode = createAgentNode({
    llm: llmConfig, // <-- Aqui está a nova funcionalidade!
    mode: mode,
    agentInfo: agentInfo,
  });

  builder.addNode('call_llm', callLlmNode);
  builder.addEdge('call_llm', endNodeName); // <-- Adicionar aresta para o nó final
  builder.setEntryPoint('call_llm');
  builder.setEndNode(endNodeName);

  const definition = builder.build();
  const engine = new GraphEngine(definition, { maxSteps: builder.getMaxSteps() });

  return engine;
}

export function createInitialState(userInput?: string): IGraphState {
  const trimmed = String(userInput ?? '').trim();
  const messages = trimmed ? [{ role: 'user' as const, content: trimmed }] : [];
  
  return {
    messages,
    data: {},
    status: GraphStatus.RUNNING,
  };
}

function createLlmConfigFromEnv(): LLMConfig {
  const model = process.env.LLM_MODEL || process.env.OPENAI_MODEL || 'openai-gpt-4o-mini';
  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY (or LLM_API_KEY) é obrigatório para executar o exemplo');
  }
  
  const baseUrl = process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL;
  
  return {
    model,
    apiKey,
    baseUrl,
    defaults: {
      temperature: 0.7,
      topP: 0.9,
    }
  };
}

async function main(): Promise<void> {
  console.log('🚀 Graph Engine com LLMConfig - Exemplo de Execução Real\n');

  try {
    // Configuração do LLM usando variáveis de ambiente
    const llmConfig = createLlmConfigFromEnv();
    console.log('✅ Configuração LLM criada:', { model: llmConfig.model });

    // Informações do agente
    const agentInfo: AgentInfo = {
      name: 'GraphDemo',
      goal: 'Responder perguntas simples de forma direta',
      backstory: 'Agente de demonstração para LLMConfig no Graph Engine'
    };
    
    const mode = 'react' as PromptMode;
    PromptBuilder.buildSystemPrompt({ mode, agentInfo });

    // Construir Graph Engine
    const engine = buildSimpleGraph(llmConfig, mode, agentInfo, 5);
    
    console.log('✅ Graph Engine construído com sucesso');

    // Pergunta do usuário
    const question = process.env.DEMO_USER_INPUT || 'Qual é a capital da França?';
    const stateWithQuestion = createInitialState(question);
    
    console.log('\n=== Executando Graph Engine ===');
    console.log('Pergunta:', question);
    
    // Executar Graph Engine (execução real, sem simulações!)
    const result = await engine.execute(stateWithQuestion);
    
    console.log('\n=== Resultado da Execução ===');
    console.log('Graph status:', result.status);
    console.log('Messages:', result.state.messages);
    console.log('Data:', result.state.data);
    
  } catch (error: unknown) {
    console.error('❌ Erro ao executar exemplo:', (error as Error).message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
}