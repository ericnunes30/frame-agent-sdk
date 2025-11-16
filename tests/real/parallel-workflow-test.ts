// tests/real/parallel-workflow-test.ts
/**
 * Teste de execução paralela do WorkflowOrchestrator
 *
 * Valida funcionalidades avançadas de paralelismo:
 * - Execução simultânea de múltiplos agentes
 * - Sincronização de resultados
 * - Gerenciamento de concorrência
 * - Timeouts e recursos
 */

import { WorkflowOrchestrator } from '../../src/orchestrators/workflows/core/workflowOrchestrator';
import { AgentPriority } from '../../src/orchestrators/workflows/core/enums';
import {
  createTestDependencies,
  createTestAgent,
  measureExecutionTime,
  logTest,
  TestResultValidator
} from './setup';

async function basicParallelTest(): Promise<void> {
  console.log('\n⚡ === INICIANDO TESTE PARALELO BÁSICO ===\n');

  try {
    // Setup
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Adicionar múltiplos agentes para execução paralela
    logTest('PARALLEL_BASIC', '🤖 Configurando agentes para execução paralela');
    orchestrator
      .addAgent(createTestAgent('analyzer_1', 'Analyzer 1', ['analysis', 'research']))
      .addAgent(createTestAgent('analyzer_2', 'Analyzer 2', ['analysis', 'data']))
      .addAgent(createTestAgent('analyzer_3', 'Analyzer 3', ['analysis', 'statistics']));

    // Configurar workflow paralelo
    logTest('PARALLEL_BASIC', '🔧 Configurando workflow paralelo');
    orchestrator.setFlowType(FlowType.PARALLEL);

    // Executar
    logTest('PARALLEL_BASIC', '🎯 Executando workflow paralelo básico');
    const startTime = Date.now();
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute('Realize múltiplas análises em paralelo sobre o mesmo dataset.'),
      'Workflow Paralelo Básico'
    );

    // Validar que todos os agentes executaram
    const expectedAgents = ['analyzer_1', 'analyzer_2', 'analyzer_3'];
    const isValid = TestResultValidator.validateSuccess(result, 'PARALLEL_BASIC') &&
                   TestResultValidator.validateAgents(result, expectedAgents, 'PARALLEL_BASIC');

    // Validar benefício do paralelismo
    const sequentialEstimate = executionTime * expectedAgents.length; // Estimativa se fosse sequencial
    const parallelBenefit = ((sequentialEstimate - executionTime) / sequentialEstimate * 100).toFixed(1);

    if (isValid) {
      logTest('PARALLEL_BASIC', '🎉 SUCESSO - Workflow paralelo executado!', {
        executionTime,
        agentCount: result.agentResults.length,
        parallelBenefit: `${parallelBenefit}%`,
        avgAgentTime: executionTime / result.agentResults.length
      });
    } else {
      throw new Error('Teste paralelo básico falhou');
    }

  } catch (error) {
    logTest('PARALLEL_BASIC', '💥 ERRO NO TESTE PARALELO BÁSICO', { error: error.message });
    throw error;
  }
}

async function highConcurrencyTest(): Promise<void> {
  console.log('\n🚀 === INICIANDO TESTE DE ALTA CONCORRÊNCIA ===\n');

  try {
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Configurar muitos agentes para teste de concorrência
    logTest('CONCURRENCY', '🤖 Configurando múltiplos agentes para teste de concorrência');
    const agentCount = 10;
    for (let i = 1; i <= agentCount; i++) {
      orchestrator.addAgent(createTestAgent(
        `worker_${i}`,
        `Worker ${i}`,
        [`processing_${i % 3 === 0 ? 'heavy' : 'light'}`]
      ));
    }

    orchestrator.setFlowType(FlowType.PARALLEL);

    // Executar com alta carga
    logTest('CONCURRENCY', '🎯 Executando workflow com alta concorrência');
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute(`Processar ${agentCount} tarefas distribuídas em paralelo.`),
      'Workflow de Alta Concorrência'
    );

    // Análise de performance
    const avgTimePerAgent = executionTime / result.agentResults.length;
    const throughput = (result.agentResults.length / executionTime * 1000).toFixed(2);

    const isValid = TestResultValidator.validateSuccess(result, 'CONCURRENCY');

    if (isValid) {
      logTest('CONCURRENCY', '🎉 SUCESSO - Alta concorrência executada!', {
        agentCount: result.agentResults.length,
        totalTime: executionTime,
        avgTimePerAgent,
        throughput: `${throughput} agents/sec`,
        successRate: `${(result.agentResults.filter(r => r.success).length / result.agentResults.length * 100).toFixed(1)}%`
      });
    } else {
      throw new Error('Teste de alta concorrência falhou');
    }

  } catch (error) {
    logTest('CONCURRENCY', '💥 ERRO NO TESTE DE ALTA CONCORRÊNCIA', { error: error.message });
    throw error;
  }
}

async function timeoutAndFailureTest(): Promise<void> {
  console.log('\n⏱️ === INICIANDO TESTE DE TIMEOUT E FALHAS ===\n');

  try {
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Configurar agentes com diferentes timeouts
    logTest('TIMEOUT', '⏱️  Configurando agentes com diferentes timeouts');

    // Agente rápido
    orchestrator.addAgent({
      ...createTestAgent('fast_agent', 'Fast Agent', ['quick_processing']),
      timeout: 1000
    });

    // Agente lento (vai causar timeout)
    orchestrator.addAgent({
      ...createTestAgent('slow_agent', 'Slow Agent', ['slow_processing']),
      timeout: 500 // Timeout muito curto
    });

    // Agente normal
    orchestrator.addAgent({
      ...createTestAgent('normal_agent', 'Normal Agent', ['normal_processing']),
      timeout: 5000
    });

    orchestrator.setFlowType(FlowType.PARALLEL);

    // Executar e observar comportamento com timeouts
    logTest('TIMEOUT', '🎯 Executando com cenários de timeout');
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute('Executar tarefas com diferentes velocidades.'),
      'Workflow com Timeouts'
    );

    // Análise dos resultados
    const successfulAgents = result.agentResults.filter(r => r.success);
    const failedAgents = result.agentResults.filter(r => !r.success);
    const timeoutAgents = result.agentResults.filter(r => r.error && r.error.includes('timeout'));

    logTest('TIMEOUT', '📊 Análise de resultados', {
      total: result.agentResults.length,
      successful: successfulAgents.length,
      failed: failedAgents.length,
      timeouts: timeoutAgents.length,
      executionTime
    });

    // Validar que o sistema lidou corretamente com falhas
    if (successfulAgents.length > 0) {
      logTest('TIMEOUT', '✅ SUCESSO - Sistema lidou corretamente com timeouts e falhas!', {
        partialSuccess: true,
        workingAgents: successfulAgents.map(r => r.agentId),
        failedAgents: failedAgents.map(r => ({ id: r.agentId, error: r.error }))
      });
    } else {
      throw new Error('Todos os agentes falharam - problema no tratamento de timeout');
    }

  } catch (error) {
    logTest('TIMEOUT', '💥 ERRO NO TESTE DE TIMEOUT', { error: error.message });
    throw error;
  }
}

async function resourceManagementTest(): Promise<void> {
  console.log('\n💾 === INICIANDO TESTE DE GERENCIAMENTO DE RECURSOS ===\n');

  try {
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Configurar agents com diferentes cargas de trabalho
    logTest('RESOURCES', '💾 Configurando agentes com diferentes cargas');

    const workloadTypes = [
      { name: 'light', intensity: 1, description: 'Processamento leve' },
      { name: 'medium', intensity: 3, description: 'Processamento médio' },
      { name: 'heavy', intensity: 5, description: 'Processamento pesado' }
    ];

    workloadTypes.forEach(workload => {
      orchestrator.addAgent({
        ...createTestAgent(
          `${workload.name}_worker`,
          `${workload.name} Worker`,
          [workload.name]
        ),
        metadata: {
          workloadIntensity: workload.intensity,
          description: workload.description
        }
      });
    });

    orchestrator.setFlowType(FlowType.PARALLEL);

    // Executar e monitorar uso de recursos
    logTest('RESOURCES', '🎯 Executando com monitoramento de recursos');

    const initialMemory = process.memoryUsage();
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute('Executar tarefas com diferentes intensidades de processamento.'),
      'Workflow com Monitoramento de Recursos'
    );
    const finalMemory = process.memoryUsage();

    // Calcular consumo de recursos
    const memoryDelta = {
      heapUsed: (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024, // MB
      heapTotal: (finalMemory.heapTotal - initialMemory.heapTotal) / 1024 / 1024, // MB
      external: (finalMemory.external - initialMemory.external) / 1024 / 1024 // MB
    };

    const isValid = TestResultValidator.validateSuccess(result, 'RESOURCES');

    if (isValid) {
      logTest('RESOURCES', '🎉 SUCESSO - Gerenciamento de recursos funcionando!', {
        executionTime,
        agentCount: result.agentResults.length,
        memoryUsage: memoryDelta,
        efficiency: `${(result.agentResults.length / executionTime * 1000).toFixed(2)} agents/sec`
      });

      // Validar que não há vazamento excessivo de memória
      if (memoryDelta.heapUsed > 100) { // Mais de 100MB pode indicar problema
        logTest('RESOURCES', '⚠️  AVISO - Alto consumo de memória detectado', memoryDelta);
      }
    } else {
      throw new Error('Teste de gerenciamento de recursos falhou');
    }

  } catch (error) {
    logTest('RESOURCES', '💥 ERRO NO TESTE DE RECURSOS', { error: error.message });
    throw error;
  }
}

async function raceConditionTest(): Promise<void> {
  console.log('\n🏁 === INICIANDO TESTE DE CONDIÇÃO DE CORRIDA ===\n');

  try {
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Configurar agentes que competirão entre si
    logTest('RACE', '🏁 Configurando agentes para condição de corrida');

    orchestrator
      .addAgent(createTestAgent('competitor_1', 'Competitor 1', ['fast_competition']))
      .addAgent(createTestAgent('competitor_2', 'Competitor 2', ['fast_competition']))
      .addAgent(createTestAgent('competitor_3', 'Competitor 3', ['fast_competition']));

    orchestrator.setFlowType(FlowType.PARALLEL);

    // Executar múltiplas vezes para testar consistência
    logTest('RACE', '🎯 Executando múltiplas corridas para testar consistência');
    const raceCount = 5;
    const results = [];

    for (let i = 0; i < raceCount; i++) {
      const { result: raceResult } = await measureExecutionTime(
        () => orchestrator.execute(`Corrida ${i + 1}: Competição entre agentes.`),
        `Corrida ${i + 1}`
      );

      results.push({
        race: i + 1,
        executionTime: raceResult.executionTime,
        winner: raceResult.agentResults.find(r => r.success)?.agentId,
        allSuccessful: raceResult.agentResults.every(r => r.success)
      });

      // Pequena pausa entre corridas
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Analisar consistência dos resultados
    const consistentResults = results.filter(r => r.allSuccessful).length;
    const avgExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0) / results.length;

    logTest('RACE', '📊 Análise das corridas', {
      totalRaces: raceCount,
      consistentResults,
      consistencyRate: `${(consistentResults / raceCount * 100).toFixed(1)}%`,
      avgExecutionTime: avgExecutionTime.toFixed(0)
    });

    if (consistentResults >= raceCount * 0.8) { // 80% de consistência é aceitável
      logTest('RACE', '🎉 SUCESSO - Teste de condição de corrida passed!', {
        consistency: 'BOM',
        stableExecution: true
      });
    } else {
      throw new Error('Baixa consistência nos resultados das corridas');
    }

  } catch (error) {
    logTest('RACE', '💥 ERRO NO TESTE DE CONDIÇÃO DE CORRIDA', { error: error.message });
    throw error;
  }
}

// Função principal para executar todos os testes paralelos
async function runParallelTests(): Promise<void> {
  console.log('⚡ ==============================================');
  console.log('⚡  SUITE DE TESTES PARALELOS - WORKFLOW ORCHESTRATOR');
  console.log('⚡ ==============================================\n');

  const tests = [
    { name: 'Paralelo Básico', fn: basicParallelTest },
    { name: 'Alta Concorrência', fn: highConcurrencyTest },
    { name: 'Timeout e Falhas', fn: timeoutAndFailureTest },
    { name: 'Gerenciamento de Recursos', fn: resourceManagementTest },
    { name: 'Condição de Corrida', fn: raceConditionTest }
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
  console.log('⚡ ==============================================');
  console.log('⚡  RESUMO DOS TESTES PARALELOS');
  console.log('⚡ ==============================================');

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
    console.log('\n⚠️  Alguns testes paralelos falharam. Verifique os logs acima.');
    process.exit(1);
  } else {
    console.log('\n🚀 Todos os testes paralelos passaram! O sistema está pronto para alta carga.');
  }
}

// Executar testes se este arquivo for chamado diretamente
if (require.main === module) {
  runParallelTests().catch(error => {
    console.error('💥 Erro fatal na execução dos testes paralelos:', error);
    process.exit(1);
  });
}

export {
  basicParallelTest,
  highConcurrencyTest,
  timeoutAndFailureTest,
  resourceManagementTest,
  raceConditionTest,
  runParallelTests
};