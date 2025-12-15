/**
 * Teste simples do StepsOrchestrator com múltiplos agentes
 */

import { StepsOrchestrator } from './orchestrators/steps';
import { ChatHistoryManager, TokenizerService } from './memory';
import { AgentLLM } from './agent';
import { AGENT_MODES } from './llmModes';

async function testSteps() {
  console.log('🚀 Testando StepsOrchestrator\n');

  // Configurar dependências base
  const tokenizer = new TokenizerService('gpt-4');
  const memory = new ChatHistoryManager({
    maxContextTokens: 4000,
    tokenizer
  });
  
  const deps = {
    memory,
    llm: new AgentLLM({
      model: process.env.OPENAI_MODEL || 'zai-org/GLM-4.6-FP8',
      apiKey: process.env.OPENAI_API_KEY!,
      baseUrl: process.env.OPENAI_BASE_URL
    })
  };

  // Configuração base do orquestrador
  const baseConfig = {
    mode: AGENT_MODES.CHAT,
    agentInfo: {
      name: 'Coordinator',
      goal: 'Coordinate multiple specialized agents in sequence',
      backstory: 'Coordinates multiple specialized agents'
    }
  };

  // Test 1: Uso simples com runFlow (agente único)
  console.log('=== Test 1: Agente único com runFlow ===');
  const orchestrator1 = new StepsOrchestrator(deps, baseConfig);
  
  try {
    const result1 = await orchestrator1.runFlow('Olá, qual é o seu nome?');
    console.log('✅ Test 1 OK');
    console.log('Resposta:', result1.final);
  } catch (error) {
    console.log('❌ Test 1 falhou:', error.message);
  }

  // Test 2: Múltiplos agentes sequenciais
  console.log('\n=== Test 2: Múltiplos agentes ===');
  const orchestrator2 = new StepsOrchestrator(deps, baseConfig);
  
  try {
    const result2 = await orchestrator2
      .addAgent({
        mode: AGENT_MODES.REACT,
        agentInfo: {
          name: 'DataCollector',
          goal: 'Collect and organize relevant information about the topic',
          backstory: 'Specializes in gathering and organizing information'
        },
        additionalInstructions: 'Focus on collecting relevant data about the topic.',
        llm: {
          model: process.env.OPENAI_MODEL || 'zai-org/GLM-4.6-FP8',
          apiKey: process.env.OPENAI_API_KEY!,
          baseUrl: process.env.OPENAI_BASE_URL,
          defaults: { temperature: 0.3 }
        }
      })
      .addAgent({
        mode: AGENT_MODES.REACT,
        agentInfo: {
          name: 'Analyzer',
          goal: 'Analyze collected data and provide insights',
          backstory: 'Analyzes collected data and provides insights'
        },
        additionalInstructions: 'Analyze the data provided by the previous agent.',
        llm: {
          model: process.env.OPENAI_MODEL || 'zai-org/GLM-4.6-FP8',
          apiKey: process.env.OPENAI_API_KEY!,
          baseUrl: process.env.OPENAI_BASE_URL,
          defaults: { temperature: 0.5 }
        }
      })
      .executeAgents('Me diga 3 fatos interessantes sobre inteligência artificial');

    console.log('✅ Test 2 OK');
    console.log('Resposta final:', result2.final);
    
    if (result2.pendingAskUser) {
      console.log('⚠️ Pergunta pendente:', result2.pendingAskUser.question);
    }
  } catch (error) {
    console.log('❌ Test 2 falhou:', error.message);
    console.log('Stack:', error.stack);
  }

  console.log('\n🏁 Testes concluídos');
}

// Executar teste
if (require.main === module) {
  testSteps().catch(console.error);
}

export { testSteps };
