// examples/graphWithMemoryOverride.ts
/**
 * Exemplo demonstrando o uso do ChatHistoryManager com limite personalizado de tokens
 * 
 * Este exemplo mostra como configurar um ChatHistoryManager com limite menor
 * para testar o truncamento automático de mensagens, preservando o system prompt
 * e a última mensagem do usuário.
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

// Interfaces do LLM
import type { LLMConfig } from '../src/orchestrators/graph/core/interfaces/llmConfig.interface';

// Memory components
import { ChatHistoryManager, TokenizerService } from '../src/memory';

export function buildGraphWithMemoryOverride(
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

  // Configuração avançada do ChatHistoryManager com limite menor
  const tokenizer = new TokenizerService(llmConfig.model);
  const customCHM = new ChatHistoryManager({
    maxContextTokens: 2000,  // Limite menor para testar truncamento
    tokenizer: tokenizer
  });

  // Criar nó do agente usando LLMConfig
  const callLlmNode = createAgentNode({
    llm: llmConfig,
    mode: mode,
    agentInfo: agentInfo,
  });

  builder.addNode('call_llm', callLlmNode);
  builder.addEdge('call_llm', endNodeName);
  builder.setEntryPoint('call_llm');
  builder.setEndNode(endNodeName);

  const definition = builder.build();
  
  // Criar GraphEngine com ChatHistoryManager personalizado
  const engine = new GraphEngine(
    definition, 
    { 
      maxSteps: builder.getMaxSteps(),
      chatHistoryManager: customCHM  // Override do ChatHistoryManager
    },
    llmConfig  // Passar LLMConfig para criar TokenizerService
  );

  return engine;
}

export function createInitialStateWithHistory(userInput?: string): IGraphState {
  const trimmed = String(userInput ?? '').trim();
  
  // Criar um histórico longo para testar truncamento
  const messages = [
    { role: 'system' as const, content: 'System prompt importante que deve ser preservado' },
    { role: 'user' as const, content: 'Pergunta 1 sobre programação' },
    { role: 'assistant' as const, content: 'Resposta longa sobre programação. ' + 'Texto repetido. '.repeat(50) },
    { role: 'user' as const, content: 'Pergunta 2 sobre banco de dados' },
    { role: 'assistant' as const, content: 'Resposta longa sobre banco de dados. ' + 'Texto repetido. '.repeat(50) },
    { role: 'user' as const, content: 'Pergunta 3 sobre redes' },
    { role: 'assistant' as const, content: 'Resposta longa sobre redes. ' + 'Texto repetido. '.repeat(50) },
    { role: 'user' as const, content: 'Pergunta 4 sobre segurança' },
    { role: 'assistant' as const, content: 'Resposta longa sobre segurança. ' + 'Texto repetido. '.repeat(50) },
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
  console.log('🧠 Graph Engine com ChatHistoryManager Personalizado - Teste de Truncamento\n');

  try {
    // Configuração do LLM usando variáveis de ambiente
    const llmConfig = createLlmConfigFromEnv();
    console.log('✅ Configuração LLM criada:', { model: llmConfig.model });

    // Informações do agente
    const agentInfo: AgentInfo = {
      name: 'MemoryTest',
      goal: 'Testar truncamento de memória',
      backstory: 'Agente de teste para validar ChatHistoryManager'
    };
    
    const mode = 'react' as PromptMode;
    PromptBuilder.buildSystemPrompt({ mode, agentInfo });

    // Construir Graph Engine com ChatHistoryManager personalizado
    const engine = buildGraphWithMemoryOverride(llmConfig, mode, agentInfo, 3);
    
    console.log('✅ Graph Engine construído com ChatHistoryManager personalizado');
    console.log('📊 Limite de tokens configurado: 2000');

    // Criar estado inicial com histórico longo
    const question = process.env.DEMO_USER_INPUT || 'Qual é a capital da França?';
    const stateWithHistory = createInitialStateWithHistory(question);
    
    console.log(`\n=== Estado Inicial ===`);
    console.log(`Mensagens no histórico: ${stateWithHistory.messages.length}`);
    console.log(`Primeira mensagem (system): ${stateWithHistory.messages[0].content}`);
    console.log(`Última mensagem (user): ${stateWithHistory.messages[stateWithHistory.messages.length - 1].content}`);
    
    console.log('\n=== Executando Graph Engine ===');
    console.log('Pergunta:', question);
    
    // Executar Graph Engine
    const result = await engine.execute(stateWithHistory);
    
    console.log('\n=== Resultado da Execução ===');
    console.log('Graph status:', result.status);
    console.log('Mensagens finais:', result.state.messages.length);
    
    if (result.state.messages.length > 0) {
      console.log('Primeira mensagem (system):', result.state.messages[0].content);
      console.log('Última mensagem (user):', result.state.messages[result.state.messages.length - 1].content);
      
      // Verificar se o system prompt foi preservado
      const systemPreserved = result.state.messages[0].content.includes('System prompt importante');
      console.log('✅ System prompt preservado:', systemPreserved);
      
      // Verificar se a última mensagem foi preservada
      const lastMessagePreserved = result.state.messages[result.state.messages.length - 1].content === question;
      console.log('✅ Última mensagem preservada:', lastMessagePreserved);
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