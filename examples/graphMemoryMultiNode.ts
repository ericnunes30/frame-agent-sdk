// examples/graphMemoryMultiNode.ts
/**
 * Exemplo demonstrando fluxo com ChatHistoryManager e múltiplas interações
 * 
 * Este exemplo mostra como o ChatHistoryManager preserva mensagens entre
 * diferentes interações do agente, demonstrando o truncamento automático.
 */

import 'dotenv/config';
import 'tsconfig-paths/register';
import '../src/agents';

// Tipos e interfaces do Graph Engine
import type { IGraphState } from '../src/orchestrators/graph';
import { 
  GraphBuilder, 
  GraphEngine, 
  GraphStatus, 
  createAgentNode 
} from '../src/orchestrators/graph';

// Tipos do PromptBuilder
import type { AgentInfo, PromptMode } from '../src/promptBuilder';
import { PromptBuilder } from '../src/promptBuilder';

// Interfaces do LLM
import type { LLMConfig } from '../src/orchestrators/graph/core/interfaces/llmConfig.interface';

export function buildMultiNodeGraph(
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

  // Criar nó do agente
  const agentNode = createAgentNode({
    llm: llmConfig,
    mode: mode,
    agentInfo: agentInfo,
  });

  // Construir grafo simples: agent -> end
  builder.addNode('agent', agentNode);
  builder.addEdge('agent', endNodeName);
  builder.setEntryPoint('agent');
  builder.setEndNode(endNodeName);

  const definition = builder.build();
  
  // Criar GraphEngine com LLMConfig para habilitar ChatHistoryManager
  const engine = new GraphEngine(
    definition, 
    { maxSteps: builder.getMaxSteps() },
    llmConfig  // Passar LLMConfig para criar TokenizerService
  );

  return engine;
}

export function createInitialStateWithMultipleMessages(userInput?: string): IGraphState {
  const trimmed = String(userInput ?? '').trim();
  
  // Criar um histórico com múltiplas mensagens para testar preservação
  const messages = [
    { role: 'system' as const, content: 'Você é um assistente prestativo e conciso.' },
    { role: 'user' as const, content: 'Qual é a capital do Brasil?' },
    { role: 'assistant' as const, content: 'A capital do Brasil é Brasília.' },
    { role: 'user' as const, content: 'E da Argentina?' },
    { role: 'assistant' as const, content: 'A capital da Argentina é Buenos Aires.' },
  ];
  
  // Adicionar a pergunta atual se fornecida
  if (trimmed) {
    messages.push({ role: 'user' as const, content: trimmed });
  }
  
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
  console.log('🔄 Graph Engine com ChatHistoryManager - Teste de Preservação de Mensagens\n');

  try {
    // Configuração do LLM usando variáveis de ambiente
    const llmConfig = createLlmConfigFromEnv();
    console.log('✅ Configuração LLM criada:', { model: llmConfig.model });

    // Informações do agente
    const agentInfo: AgentInfo = {
      name: 'MemoryPreservationAgent',
      goal: 'Preservar histórico de mensagens',
      backstory: 'Agente que demonstra preservação de mensagens no ChatHistoryManager'
    };
    
    const mode = 'react' as PromptMode;
    PromptBuilder.buildSystemPrompt({ mode, agentInfo });

    // Construir Graph Engine
    const engine = buildMultiNodeGraph(llmConfig, mode, agentInfo, 3);
    
    console.log('✅ Graph Engine construído com ChatHistoryManager');

    // Criar estado inicial com múltiplas mensagens
    const question = process.env.DEMO_USER_INPUT || 'E da França?';
    const initialState = createInitialStateWithMultipleMessages(question);
    
    console.log(`\n=== Estado Inicial ===`);
    console.log(`Mensagens no histórico: ${initialState.messages.length}`);
    console.log(`Primeira mensagem (system): ${initialState.messages[0].content}`);
    console.log(`Última mensagem (user): ${initialState.messages[initialState.messages.length - 1].content}`);
    
    console.log('\n=== Executando Graph Engine ===');
    console.log('Pergunta:', question);
    
    // Executar Graph Engine
    const result = await engine.execute(initialState);
    
    console.log('\n=== Resultado da Execução ===');
    console.log('Graph status:', result.status);
    console.log('Mensagens finais:', result.state.messages.length);
    
    if (result.state.messages.length > 0) {
      console.log('\n📋 Histórico de Mensagens:');
      result.state.messages.forEach((msg: { role: string; content: string }, index: number) => {
        console.log(`${index + 1}. [${msg.role.toUpperCase()}]: ${msg.content.substring(0, 80)}${msg.content.length > 80 ? '...' : ''}`);
      });
      
      // Verificar se o histórico foi preservado
      const systemPreserved = result.state.messages[0].role === 'system';
      const userMessages = result.state.messages.filter(msg => msg.role === 'user').length;
      const assistantMessages = result.state.messages.filter(msg => msg.role === 'assistant').length;
      
      console.log(`\n✅ System prompt preservado: ${systemPreserved}`);
      console.log(`✅ Mensagens do usuário: ${userMessages}`);
      console.log(`✅ Mensagens do assistente: ${assistantMessages}`);
      console.log(`✅ Total de mensagens preservadas: ${result.state.messages.length}`);
    }
    
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