// tests/real/simple-test.ts
/**
 * Teste simples e direto do WorkflowOrchestrator
 * Valida a funcionalidade básica sem complexidade desnecessária
 */

import { WorkflowOrchestrator } from '../../src/orchestrators/workflows/core/workflowOrchestrator';
import { WorkflowStatus } from '../../src/orchestrators/workflows/core/enums';

// Importar para registrar o modo 'react' do PromptBuilder
import '../../src/agents/react/reactAgent';

// Mock simples
class MockLLM {
  async generateResponse(prompt: string): Promise<string> {
    return `Resposta para: ${prompt}`;
  }

  async invoke(prompt: string): Promise<string> {
    return this.generateResponse(prompt);
  }
}

class MockMemory {
  private messages: any[] = [];

  async addMessage(message: any): Promise<void> {
    this.messages.push(message);
  }

  async getHistory(): Promise<any[]> {
    return this.messages;
  }

  async getTrimmedHistory(): Promise<any[]> {
    return this.messages;
  }

  async clear(): Promise<void> {
    this.messages = [];
  }
}

async function simpleTest(): Promise<void> {
  console.log('🧪 Teste Simples do WorkflowOrchestrator\n');

  try {
    // Criar dependências mock
    const deps = {
      memory: new MockMemory() as any,
      llm: new MockLLM() as any,
      promptBuilder: {} as any,
      toolExecutor: {} as any
    };

    // Criar orquestrador
    const orchestrator = new WorkflowOrchestrator(deps);

    // Adicionar agente de teste
    orchestrator.addAgent({
      id: 'test_agent',
      info: {
        name: 'Test Agent',
        goal: 'Executar testes básicos do sistema',
        backstory: 'Agente especializado em validar funcionamento do WorkflowOrchestrator'
      },
      provider: 'mock',
      model: 'mock-model',
      temperature: 0.7,
      maxTokens: 1000
    });

    // Executar workflow
    console.log('🎯 Executando workflow...');
    const result = await orchestrator.execute('Teste simples do WorkflowOrchestrator');

    // Validar resultado
    if (result.success) {
      console.log('✅ SUCESSO - WorkflowOrchestrator funcionando!');
      console.log(`📊 Agentes executados: ${result.agentResults.length}`);
      console.log(`⏱️  Tempo de execução: ${result.executionTime}ms`);
      console.log(`📝 Output: ${result.finalOutput?.substring(0, 100)}...`);
    } else {
      console.log('❌ FALHA - Workflow não executou corretamente');
      console.log(`Erro: ${result.error}`);
    }

    // Verificar estado final
    const finalState = orchestrator.getState();
    console.log(`🏁 Estado final: ${finalState.status}`);

  } catch (error) {
    console.error('💥 Erro no teste:', error);
  }
}

// Executar teste
if (require.main === module) {
  simpleTest();
}

export { simpleTest };