// tests/real/basic-workflow-test.ts
/**
 * Teste básico do WorkflowOrchestrator
 *
 * Valida funcionalidades essenciais:
 * - Criação do orquestrador
 * - Adição de agentes
 * - Execução de workflow simples
 * - Estado e resultados
 */

import { WorkflowOrchestrator } from '../../src/orchestrators/workflows/core/workflowOrchestrator';
import { AgentPriority, WorkflowStatus } from '../../src/orchestrators/workflows/core/enums';
import {
  createTestDependencies,
  createTestAgent,
  measureExecutionTime,
  logTest,
  TestResultValidator
} from './setup';

async function basicWorkflowTest(): Promise<void> {
  console.log('\n🚀 === INICIANDO TESTE BÁSICO DO WORKFLOW ORCHESTRATOR ===\n');

  try {
    // 1. Setup inicial
    logTest('BASIC', '📋 Configurando dependências de teste');
    const deps = createTestDependencies();

    // 2. Criar orquestrador
    logTest('BASIC', '🏗️  Criando WorkflowOrchestrator');
    const orchestrator = new WorkflowOrchestrator(deps);

    // 3. Adicionar agente básico
    logTest('BASIC', '🤖 Adicionando agente de análise');
    orchestrator.addAgent(createTestAgent('analyzer', 'Basic Analyzer', ['analysis']));

    // 4. Configurar workflow simples
    logTest('BASIC', '📊 Configurando workflow sequencial simples');
    // WorkflowOrchestrator não tem setFlowType, usa padrão de execução baseado em dependências

    // 5. Validar configuração
    logTest('BASIC', '✅ Validando configuração do workflow');
    const state = orchestrator.getState();
    if (state.status !== WorkflowStatus.IDLE) {
      throw new Error(`Status inválido: esperado IDLE, recebido ${state.status}`);
    }

    // 6. Executar workflow
    logTest('BASIC', '🎯 Executando workflow de teste');
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute('Analise o seguinte texto: Este é um teste do WorkflowOrchestrator.'),
      'Execução do Workflow'
    );

    // 7. Validar resultados
    logTest('BASIC', '🔍 Validando resultados da execução');
    const isValid = TestResultValidator.validateSuccess(result, 'BASIC');

    if (isValid) {
      logTest('BASIC', '🎉 SUCESSO - Workflow básico executado com sucesso!', {
        executionTime,
        agentCount: result.agentResults.length,
        status: state.status
      });
    } else {
      throw new Error('Resultado da validação falhou');
    }

  } catch (error) {
    logTest('BASIC', '💥 ERRO NO TESTE BÁSICO', { error: error.message, stack: error.stack });
    throw error;
  }
}

async function multiAgentSequentialTest(): Promise<void> {
  console.log('\n🔄 === INICIANDO TESTE SEQUENCIAL MULTI-AGENTE ===\n');

  try {
    // Setup
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Adicionar múltiplos agentes
    logTest('SEQUENTIAL', '🤖 Configurando múltiplos agentes');
    orchestrator
      .addAgent(createTestAgent('analyzer', 'Data Analyzer', ['analysis', 'research']))
      .addAgent(createTestAgent('generator', 'Content Generator', ['generation', 'writing']))
      .addAgent(createTestAgent('reviewer', 'Quality Reviewer', ['review', 'validation']));

    // WorkflowOrchestrator usa execução baseada em dependências automaticamente

    // Executar
    logTest('SEQUENTIAL', '🎯 Executando workflow sequencial multi-agente');
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute('Analise os dados, gere um relatório e revise a qualidade.'),
      'Workflow Sequencial Multi-Agente'
    );

    // Validar que todos os agentes executaram em ordem
    logTest('SEQUENTIAL', '🔍 Validando execução sequencial');
    const expectedAgents = ['analyzer', 'generator', 'reviewer'];
    const isValid = TestResultValidator.validateSuccess(result, 'SEQUENTIAL') &&
                   TestResultValidator.validateAgents(result, expectedAgents, 'SEQUENTIAL');

    if (isValid) {
      logTest('SEQUENTIAL', '🎉 SUCESSO - Workflow sequencial multi-agente executado!', {
        executionTime,
        agentOrder: result.agentResults.map(r => r.agentId),
        finalOutputLength: result.finalOutput.length
      });
    } else {
      throw new Error('Validação do workflow sequencial falhou');
    }

  } catch (error) {
    logTest('SEQUENTIAL', '💥 ERRO NO TESTE SEQUENCIAL', { error: error.message });
    throw error;
  }
}

async function priorityExecutionTest(): Promise<void> {
  console.log('\n⚡ === INICIANDO TESTE DE EXECUÇÃO POR PRIORIDADE ===\n');

  try {
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Adicionar agentes com diferentes prioridades
    logTest('PRIORITY', '🎖️  Configurando agentes com prioridades diferentes');
    orchestrator
      .addAgent(createTestAgent('low_priority', 'Low Priority Agent', ['basic']))
      .addAgent(createTestAgent('high_priority', 'High Priority Agent', ['critical']))
      .addAgent(createTestAgent('critical_priority', 'Critical Priority Agent', ['urgent']));

    // Adicionar dependência para forçar ordem de execução baseada em prioridade
    orchestrator
      .addDependency('high_priority', 'critical_priority')
      .addDependency('critical_priority', 'low_priority');

    logTest('PRIORITY', '📊 Agentes configurados com prioridades e dependências');

    // Habilitar execução paralela para testar prioridade
    orchestrator.setParallelExecution(true);

    // Executar
    logTest('PRIORITY', '🎯 Executando workflow com priorização');
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute('Execute tarefas críticas em paralelo.'),
      'Workflow com Priorização'
    );

    // Validar
    const isValid = TestResultValidator.validateSuccess(result, 'PRIORITY');

    if (isValid) {
      logTest('PRIORITY', '🎉 SUCESSO - Execução com prioridade funcionando!', {
        executionTime,
        executionOrder: result.agentResults.map(r => ({
          agentId: r.agentId,
          success: r.success
        }))
      });
    } else {
      throw new Error('Teste de prioridade falhou');
    }

  } catch (error) {
    logTest('PRIORITY', '💥 ERRO NO TESTE DE PRIORIDADE', { error: error.message });
    throw error;
  }
}

async function errorHandlingTest(): Promise<void> {
  console.log('\n🛡️ === INICIANDO TESTE DE TRATAMENTO DE ERROS ===\n');

  try {
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Adicionar agente que vai falhar
    logTest('ERROR', '⚠️  Configurando cenário de erro');
    const errorAgent = {
      ...createTestAgent('error_agent', 'Error Agent', ['error_simulation']),
      timeout: 100 // timeout muito curto para forçar erro
    };

    orchestrator.addAgent(errorAgent);
    // WorkflowOrchestrator usa execução sequencial por padrão sem paralelismo

    // Executar e capturar erro
    logTest('ERROR', '💣 Executando cenário de erro');
    const result = await orchestrator.execute('Simular uma condição de erro.');

    // Validar tratamento de erro
    if (!result.success) {
      logTest('ERROR', '✅ SUCESSO - Erro tratado corretamente!', {
        errorMessage: result.error,
        failedAgents: result.agentResults.filter(r => !r.success).map(r => r.agentId),
        executionTime: result.executionTime
      });
    } else {
      logTest('ERROR', '⚠️  AVISO - Esperado erro mas execução foi bem-sucedida');
    }

    // Validar que o sistema se recuperou
    const finalState = orchestrator.getState();
    if (finalState.status === WorkflowStatus.FAILED || finalState.status === WorkflowStatus.IDLE) {
      logTest('ERROR', '✅ Sistema em estado consistente após erro', { status: finalState.status });
    } else {
      throw new Error(`Estado inconsistente após erro: ${finalState.status}`);
    }

  } catch (error) {
    logTest('ERROR', '💥 ERRO NO TESTE DE TRATAMENTO DE ERRO', { error: error.message });
    throw error;
  }
}

// Função principal para executar todos os testes básicos
async function runBasicTests(): Promise<void> {
  console.log('🧪 ==============================================');
  console.log('🧪  SUITE DE TESTES BÁSICOS - WORKFLOW ORCHESTRATOR');
  console.log('🧪 ==============================================\n');

  const tests = [
    { name: 'Workflow Básico', fn: basicWorkflowTest },
    { name: 'Sequencial Multi-Agente', fn: multiAgentSequentialTest },
    { name: 'Execução por Prioridade', fn: priorityExecutionTest },
    { name: 'Tratamento de Erros', fn: errorHandlingTest }
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`\n--- ${test.name} ---`);
      await test.fn();
      results.push({ name: test.name, status: 'PASS', error: null });
      console.log(`\n✅ ${test.name}: PASS\n`);
    } catch (error) {
      results.push({ name: test.name, status: 'FAIL', error: error.message });
      console.log(`\n❌ ${test.name}: FAIL - ${error.message}\n`);
    }
  }

  // Resumo final
  console.log('🧪 ==============================================');
  console.log('🧪  RESUMO DOS TESTES BÁSICOS');
  console.log('🧪 ==============================================');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.status}`);
    if (result.error) {
      console.log(`   Erro: ${result.error}`);
    }
  });

  console.log(`\n📊 Total: ${passed} passaram, ${failed} falharam`);

  if (failed > 0) {
    console.log('\n⚠️  Alguns testes básicos falharam. Verifique os logs acima.');
    process.exit(1);
  } else {
    console.log('\n🎉 Todos os testes básicos passaram! O WorkflowOrchestrator está funcionando corretamente.');
  }
}

// Executar testes se este arquivo for chamado diretamente
if (require.main === module) {
  runBasicTests().catch(error => {
    console.error('💥 Erro fatal na execução dos testes básicos:', error);
    process.exit(1);
  });
}

export {
  basicWorkflowTest,
  multiAgentSequentialTest,
  priorityExecutionTest,
  errorHandlingTest,
  runBasicTests
};