/**
 * Exemplo de uso do StepsOrchestrator com múltiplos agentes
 * Demonstrando a nova API simplificada
 */

import { StepsOrchestrator } from '../src/orchestrators/steps';
import { ChatHistoryManager, TokenizerService } from '../src/memory';
import { AgentLLM } from '../src/agent';
import { AGENT_MODES } from '../src/llmModes';

async function main() {
  console.log('🚀 Exemplo de StepsOrchestrator com múltiplos agentes\n');

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

  // Criar orquestrador com múltiplos agentes
  const orchestrator = new StepsOrchestrator(deps, baseConfig);

  // Adicionar agentes sequenciais
  const result = await orchestrator
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
    .executeAgents('Analise as tendências de IA para 2025');

  console.log('=== Resultado Final ===');
  console.log('Resposta:', result.final);
  console.log('Estado final:', JSON.stringify(result.state, null, 2));

  if (result.pendingAskUser) {
    console.log('\n⚠️ Pergunta pendente:', result.pendingAskUser.question);
  }
}

// Executar exemplo
if (require.main === module) {
  main().catch(console.error);
}

export { main };
