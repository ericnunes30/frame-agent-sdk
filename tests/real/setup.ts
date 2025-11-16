// tests/real/setup.ts
/**
 * Setup para testes reais do WorkflowOrchestrator
 *
 * Configurações básicas e utilitários compartilhados entre os testes
 */

import { PromptBuilder } from '../../src/promptBuilder';
import { ToolExecutor } from '../../src/tools';
import { WorkflowOrchestrator } from '../../src/orchestrators/workflows/core/workflowOrchestrator';
import { StateManager } from '../../src/orchestrators/workflows/core/stateManager';
import { FlowType, AgentPriority, WorkflowStatus } from '../../src/orchestrators/workflows/core/enums';
import type { WorkflowDeps, WorkflowAgentConfig } from '../../src/orchestrators/workflows/core/interfaces';
import { ChatHistoryManager } from '../../src/memory/chatHistoryManager';

// Mock LLM para testes
export class MockLLM {
  async generateResponse(prompt: string): Promise<string> {
    // Simula resposta baseada no prompt
    if (prompt.includes('analisar')) {
      return 'Análise concluída com sucesso. Identificados 3 pontos principais.';
    }
    if (prompt.includes('gerar')) {
      return 'Conteúdo gerado com base na análise anterior.';
    }
    if (prompt.includes('revisar')) {
      return 'Revisão concluída. Conteúdo aprovado com sugestões menores.';
    }
    return 'Resposta padrão do mock LLM.';
  }
}

// Mock Memory Manager para testes
export class MockMemoryManager {
  private history: any[] = [];

  async addMessage(message: any): Promise<void> {
    this.history.push(message);
  }

  async getHistory(limit?: number): Promise<any[]> {
    return limit ? this.history.slice(-limit) : this.history;
  }

  async clear(): Promise<void> {
    this.history = [];
  }
}

// Cria dependências básicas para testes
export function createTestDependencies(): WorkflowDeps {
  const llm = new MockLLM() as any;
  const memory = new MockMemoryManager() as any;
  const promptBuilder = new PromptBuilder();
  const toolExecutor = new ToolExecutor();

  return {
    memory,
    llm,
    promptBuilder,
    toolExecutor
  };
}

// Cria agente de teste básico
export function createTestAgent(id: string, name: string, capabilities: string[] = []): WorkflowAgentConfig {
  return {
    id,
    info: {
      id,
      name,
      description: `Agente de teste: ${name}`,
      role: 'test',
      instructions: `Agente test para ${name}`,
      capabilities
    },
    provider: 'mock',
    model: 'mock-model',
    temperature: 0.7,
    maxTokens: 1000,
    priority: AgentPriority.NORMAL,
    timeout: 30000,
    metadata: {
      test: true,
      version: '1.0.0'
    }
  };
}

// Cria múltiplos agentes de teste
export function createTestAgents(): WorkflowAgentConfig[] {
  return [
    createTestAgent('analyzer', 'Analyzer Agent', ['analysis', 'research']),
    createTestAgent('generator', 'Generator Agent', ['generation', 'writing']),
    createTestAgent('reviewer', 'Reviewer Agent', ['review', 'validation']),
    createTestAgent('coordinator', 'Coordinator Agent', ['coordination', 'management']),
    createTestAgent('specialist_1', 'Specialist Agent 1', ['specialization', 'domain_expertise']),
    createTestAgent('specialist_2', 'Specialist Agent 2', ['specialization', 'technical_analysis'])
  ];
}

// Casos de teste para diferentes cenários
export const TEST_CASES = {
  SIMPLE_SEQUENTIAL: {
    name: 'Teste Sequencial Simples',
    input: 'Analise este documento e gere um resumo.',
    expectedAgents: ['analyzer', 'generator'],
    flowType: FlowType.SEQUENTIAL
  },

  PARALLEL_EXECUTION: {
    name: 'Teste Execução Paralela',
    input: 'Realize múltiplas análises em paralelo.',
    expectedAgents: ['analyzer', 'specialist_1', 'specialist_2'],
    flowType: FlowType.PARALLEL
  },

  HIERARCHICAL_SUPERVISION: {
    name: 'Teste Supervisão Hierárquica',
    input: 'Coordene uma equipe para analisar e documentar o projeto.',
    expectedAgents: ['coordinator', 'analyzer', 'generator', 'reviewer'],
    flowType: FlowType.HIERARCHICAL
  },

  CONDITIONAL_FLOW: {
    name: 'Teste Fluxo Condicional',
    input: 'Analise e decida o próximo passo baseado nos resultados.',
    expectedAgents: ['analyzer'],
    flowType: FlowType.CONDITIONAL
  },

  HYBRID_WORKFLOW: {
    name: 'Teste Workflow Híbrido',
    input: 'Execute análise completa com coordenação e validação.',
    expectedAgents: ['coordinator', 'analyzer', 'specialist_1', 'specialist_2', 'generator', 'reviewer'],
    flowType: FlowType.HYBRID
  }
};

// Função utilitária para medir performance
export async function measureExecutionTime<T>(
  fn: () => Promise<T>,
  label: string
): Promise<{ result: T; executionTime: number }> {
  const startTime = Date.now();
  const result = await fn();
  const executionTime = Date.now() - startTime;

  console.log(`⏱️  ${label}: ${executionTime}ms`);

  return { result, executionTime };
}

// Função utilitária para logs estruturados
export function logTest(testName: string, message: string, data?: any): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    test: testName,
    message,
    data
  };

  console.log(`🧪 [${testName}] ${message}`);
  if (data) {
    console.log('   Data:', JSON.stringify(data, null, 2));
  }
}

// Validador de resultados
export class TestResultValidator {
  static validateSuccess(result: any, testName: string): boolean {
    if (!result.success) {
      logTest(testName, '❌ Falha no resultado', { error: result.error });
      return false;
    }

    if (!result.agentResults || result.agentResults.length === 0) {
      logTest(testName, '❌ Nenhum resultado de agente');
      return false;
    }

    if (!result.finalOutput) {
      logTest(testName, '❌ Sem output final');
      return false;
    }

    logTest(testName, '✅ Resultado válido', {
      agentCount: result.agentResults.length,
      executionTime: result.executionTime,
      outputLength: result.finalOutput.length
    });

    return true;
  }

  static validateAgents(result: any, expectedAgents: string[], testName: string): boolean {
    const actualAgents = result.agentResults.map((r: any) => r.agentId);
    const missingAgents = expectedAgents.filter(id => !actualAgents.includes(id));

    if (missingAgents.length > 0) {
      logTest(testName, '❌ Agentes ausentes', { missing: missingAgents, actual: actualAgents });
      return false;
    }

    logTest(testName, '✅ Todos os agentes executados', { expected: expectedAgents, actual: actualAgents });
    return true;
  }
}

export default {
  MockLLM,
  MockMemoryManager,
  createTestDependencies,
  createTestAgents,
  TEST_CASES,
  measureExecutionTime,
  logTest,
  TestResultValidator
};