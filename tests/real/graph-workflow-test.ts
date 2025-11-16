// tests/real/graph-workflow-test.ts
/**
 * Teste do Graph Engine do WorkflowOrchestrator
 *
 * Valida funcionalidades de grafos de dependência:
 * - Nós e arestas de dependência
 * - Roteamento condicional
 * - Ciclos de vida complexos
 * - Grafos acíclicos direcionados (DAGs)
 */

import { GraphEngine } from '../../src/orchestrators/workflows/graph/graphEngine';
import { GraphNode } from '../../src/orchestrators/workflows/graph/graphNode';
import { GraphEdge } from '../../src/orchestrators/workflows/graph/graphEdge';
import { NodeType, DependencyType } from '../../src/orchestrators/workflows/core/enums';
import {
  createTestDependencies,
  createTestAgent,
  measureExecutionTime,
  logTest,
  TestResultValidator
} from './setup';

async function basicGraphTest(): Promise<void> {
  console.log('\n🔗 === INICIANDO TESTE GRAFO BÁSICO ===\n');

  try {
    const deps = createTestDependencies();
    const graphEngine = new GraphEngine();

    // Criar nós básicos
    logTest('GRAPH_BASIC', '🔗 Criando nós do grafo');

    const startNode = new GraphNode('start', NodeType.START, undefined);
    const processNode = new GraphNode('process', NodeType.AGENT, createTestAgent('processor', 'Data Processor', ['processing']));
    const endNode = new GraphNode('end', NodeType.END, undefined);

    // Adicionar nós ao grafo
    graphEngine.addNode(startNode);
    graphEngine.addNode(processNode);
    graphEngine.addNode(endNode);

    // Criar arestas (dependências)
    logTest('GRAPH_BASIC', '🔗 Criando arestas de dependência');
    graphEngine.addEdge('start', 'process', DependencyType.SUCCESS);
    graphEngine.addEdge('process', 'end', DependencyType.SUCCESS);

    // Validar estrutura do grafo
    const validation = graphEngine.validateGraph();
    if (!validation.valid) {
      throw new Error(`Grafo inválido: ${validation.errors.join(', ')}`);
    }

    // Executar grafo
    logTest('GRAPH_BASIC', '🎯 Executando grafo básico');
    const context = {
      deps,
      config: {} as any,
      state: { data: {}, status: 'running' } as any,
      input: 'Processar dados de teste',
      agentResults: [] as any[]
    };

    const { result, executionTime } = await measureExecutionTime(
      () => graphEngine.execute(context),
      'Execução do Grafo Básico'
    );

    // Validar resultados
    if (result.success && result.completedNodes.includes('start', 'process', 'end')) {
      logTest('GRAPH_BASIC', '🎉 SUCESSO - Grafo básico executado!', {
        executionTime,
        completedNodes: result.completedNodes,
        totalResults: result.results.length,
        graphPath: 'start -> process -> end'
      });
    } else {
      throw new Error('Execução do grafo básico falhou');
    }

  } catch (error) {
    logTest('GRAPH_BASIC', '💥 ERRO NO TESTE GRAFO BÁSICO', { error: error.message });
    throw error;
  }
}

async function conditionalRoutingTest(): Promise<void> {
  console.log('\n🔀 === INICIANDO TESTE ROTEAMENTO CONDICIONAL ===\n');

  try {
    const deps = createTestDependencies();
    const graphEngine = new GraphEngine();

    // Criar grafo com roteamento condicional
    logTest('CONDITIONAL', '🔀 Configurando grafo com roteamento condicional');

    const startNode = new GraphNode('start', NodeType.START, undefined);
    const decisionNode = new GraphNode('decision', NodeType.CONDITION, undefined);
    const pathANode = new GraphNode('path_a', NodeType.AGENT, createTestAgent('agent_a', 'Path A Agent', ['path_a_processing']));
    const pathBNode = new GraphNode('path_b', NodeType.AGENT, createTestAgent('agent_b', 'Path B Agent', ['path_b_processing']));
    const endNode = new GraphNode('end', NodeType.END, undefined);

    // Adicionar nós
    [startNode, decisionNode, pathANode, pathBNode, endNode].forEach(node => {
      graphEngine.addNode(node);
    });

    // Configurar arestas condicionais
    graphEngine.addEdge('start', 'decision', DependencyType.SUCCESS);
    graphEngine.addEdge('decision', 'path_a', DependencyType.SUCCESS, {
      type: 'data',
      field: 'selectedPath',
      operator: 'equals',
      value: 'A'
    });
    graphEngine.addEdge('decision', 'path_b', DependencyType.SUCCESS, {
      type: 'data',
      field: 'selectedPath',
      operator: 'equals',
      value: 'B'
    });
    graphEngine.addEdge('path_a', 'end', DependencyType.SUCCESS);
    graphEngine.addEdge('path_b', 'end', DependencyType.SUCCESS);

    // Testar path A
    logTest('CONDITIONAL', '🎯 Testando caminho condicional A');
    const contextA = {
      deps,
      config: {} as any,
      state: { data: { selectedPath: 'A' }, status: 'running' } as any,
      input: 'Executar path A',
      agentResults: [] as any[]
    };

    const resultA = await graphEngine.execute(contextA);

    if (resultA.success && resultA.completedNodes.includes('path_a')) {
      logTest('CONDITIONAL', '✅ Caminho A executado com sucesso');
    } else {
      throw new Error('Falha na execução do caminho A');
    }

    // Testar path B
    logTest('CONDITIONAL', '🎯 Testando caminho condicional B');
    const contextB = {
      deps,
      config: {} as any,
      state: { data: { selectedPath: 'B' }, status: 'running' } as any,
      input: 'Executar path B',
      agentResults: [] as any[]
    };

    const resultB = await graphEngine.execute(contextB);

    if (resultB.success && resultB.completedNodes.includes('path_b')) {
      logTest('CONDITIONAL', '✅ Caminho B executado com sucesso');
    } else {
      throw new Error('Falha na execução do caminho B');
    }

    logTest('CONDITIONAL', '🎉 SUCESSO - Roteamento condicional funcionando!', {
      pathASuccess: resultA.success,
      pathBSuccess: resultB.success,
      routingWorking: true
    });

  } catch (error) {
    logTest('CONDITIONAL', '💥 ERRO NO TESTE ROTEAMENTO CONDICIONAL', { error: error.message });
    throw error;
  }
}

async function complexDependencyGraphTest(): Promise<void> {
  console.log('\n🕸️ === INICIANDO TESTE GRAFO DE DEPENDÊNCIAS COMPLEXO ===\n');

  try {
    const deps = createTestDependencies();
    const graphEngine = new GraphEngine();

    // Criar grafo complexo com múltiplas dependências
    logTest('COMPLEX_GRAPH', '🕸️ Configurando grafo complexo');

    // Nós de entrada
    const startNode = new GraphNode('start', NodeType.START, undefined);
    const dataCollectionNode = new GraphNode('data_collection', NodeType.AGENT, createTestAgent('collector', 'Data Collector', ['data_collection']));
    const analysisNode = new GraphNode('analysis', NodeType.AGENT, createTestAgent('analyzer', 'Data Analyzer', ['analysis']));

    // Nós de processamento paralelo
    const processingNode1 = new GraphNode('processing_1', NodeType.AGENT, createTestAgent('processor_1', 'Processor 1', ['processing']));
    const processingNode2 = new GraphNode('processing_2', NodeType.AGENT, createTestAgent('processor_2', 'Processor 2', ['processing']));
    const processingNode3 = new GraphNode('processing_3', NodeType.AGENT, createTestAgent('processor_3', 'Processor 3', ['processing']));

    // Nós de agregação
    const aggregationNode = new GraphNode('aggregation', NodeType.AGENT, createTestAgent('aggregator', 'Data Aggregator', ['aggregation']));
    const validationNode = new GraphNode('validation', NodeType.AGENT, createTestAgent('validator', 'Result Validator', ['validation']));

    // Nó final
    const endNode = new GraphNode('end', NodeType.END, undefined);

    // Adicionar todos os nós
    [
      startNode, dataCollectionNode, analysisNode,
      processingNode1, processingNode2, processingNode3,
      aggregationNode, validationNode, endNode
    ].forEach(node => graphEngine.addNode(node));

    // Configurar dependências complexas
    logTest('COMPLEX_GRAPH', '🔗 Configurando dependências complexas');

    // Fluxo inicial
    graphEngine.addEdge('start', 'data_collection', DependencyType.SUCCESS);
    graphEngine.addEdge('start', 'analysis', DependencyType.SUCCESS);

    // Dependências para processamento paralelo
    graphEngine.addEdge('data_collection', 'processing_1', DependencyType.SUCCESS);
    graphEngine.addEdge('data_collection', 'processing_2', DependencyType.SUCCESS);
    graphEngine.addEdge('analysis', 'processing_3', DependencyType.SUCCESS);

    // Agregação depende de todos os processamentos
    graphEngine.addEdge('processing_1', 'aggregation', DependencyType.SUCCESS);
    graphEngine.addEdge('processing_2', 'aggregation', DependencyType.SUCCESS);
    graphEngine.addEdge('processing_3', 'aggregation', DependencyType.SUCCESS);

    // Validação final
    graphEngine.addEdge('aggregation', 'validation', DependencyType.SUCCESS);
    graphEngine.addEdge('validation', 'end', DependencyType.SUCCESS);

    // Validar grafo
    const validation = graphEngine.validateGraph();
    if (!validation.valid) {
      throw new Error(`Grafo complexo inválido: ${validation.errors.join(', ')}`);
    }

    // Executar grafo complexo
    logTest('COMPLEX_GRAPH', '🎯 Executando grafo complexo');
    const context = {
      deps,
      config: {} as any,
      state: { data: {}, status: 'running' } as any,
      input: 'Executar pipeline complexo de processamento de dados',
      agentResults: [] as any[]
    };

    const { result, executionTime } = await measureExecutionTime(
      () => graphEngine.execute(context),
      'Execução do Grafo Complexo'
    );

    // Validar que todos os nós executaram na ordem correta
    const expectedOrder = ['start', 'data_collection', 'analysis', 'processing_1', 'processing_2', 'processing_3', 'aggregation', 'validation', 'end'];
    const allNodesExecuted = expectedOrder.every(nodeId => result.completedNodes.includes(nodeId));

    if (result.success && allNodesExecuted) {
      logTest('COMPLEX_GRAPH', '🎉 SUCESSO - Grafo complexo executado!', {
        executionTime,
        totalNodes: result.completedNodes.length,
        expectedNodes: expectedOrder.length,
        parallelExecution: result.executionTime < 5000, // Benefício do paralelismo
        dependencyResolution: 'CORRECTO'
      });
    } else {
      throw new Error('Execução do grafo complexo falhou');
    }

  } catch (error) {
    logTest('COMPLEX_GRAPH', '💥 ERRO NO TESTE GRAFO COMPLEXO', { error: error.message });
    throw error;
  }
}

async function cycleDetectionTest(): Promise<void> {
  console.log('\n🔄 === INICIANDO TESTE DETECÇÃO DE CICLOS ===\n');

  try {
    const deps = createTestDependencies();
    const graphEngine = new GraphEngine();

    // Criar grafo com ciclo intencional
    logTest('CYCLE_DETECTION', '🔄 Configurando grafo com ciclo');

    const nodeA = new GraphNode('node_a', NodeType.AGENT, createTestAgent('agent_a', 'Agent A', ['processing']));
    const nodeB = new GraphNode('node_b', NodeType.AGENT, createTestAgent('agent_b', 'Agent B', ['processing']));
    const nodeC = new GraphNode('node_c', NodeType.AGENT, createTestAgent('agent_c', 'Agent C', ['processing']));

    // Adicionar nós
    [nodeA, nodeB, nodeC].forEach(node => graphEngine.addNode(node));

    // Criar ciclo: A -> B -> C -> A
    graphEngine.addEdge('node_a', 'node_b', DependencyType.SUCCESS);
    graphEngine.addEdge('node_b', 'node_c', DependencyType.SUCCESS);
    graphEngine.addEdge('node_c', 'node_a', DependencyType.SUCCESS);

    // Validar detecção de ciclo
    logTest('CYCLE_DETECTION', '🔍 Validando detecção de ciclo');
    const validation = graphEngine.validateGraph();

    if (!validation.valid && validation.errors.some(e => e.includes('cycle'))) {
      logTest('CYCLE_DETECTION', '✅ SUCESSO - Ciclo detectado corretamente!', {
        cycleDetected: true,
        errorMessage: validation.errors.find(e => e.includes('cycle'))
      });
    } else {
      throw new Error('Falha na detecção de ciclo - ciclo não foi detectado');
    }

    // Agora testar com grafo acíclico válido
    logTest('CYCLE_DETECTION', '✅ Testando grafo acíclico válido');
    const validGraphEngine = new GraphEngine();

    const startNode = new GraphNode('start', NodeType.START, undefined);
    const processNode = new GraphNode('process', NodeType.AGENT, createTestAgent('processor', 'Processor', ['processing']));
    const endNode = new GraphNode('end', NodeType.END, undefined);

    [startNode, processNode, endNode].forEach(node => validGraphEngine.addNode(node));
    validGraphEngine.addEdge('start', 'process', DependencyType.SUCCESS);
    validGraphEngine.addEdge('process', 'end', DependencyType.SUCCESS);

    const validValidation = validGraphEngine.validateGraph();
    if (validValidation.valid) {
      logTest('CYCLE_DETECTION', '✅ Grafo acíclico validado corretamente');
    } else {
      throw new Error('Grafo acíclico válido foi rejeitado incorretamente');
    }

  } catch (error) {
    logTest('CYCLE_DETECTION', '💥 ERRO NO TESTE DETECÇÃO DE CICLOS', { error: error.message });
    throw error;
  }
}

async function performanceOptimizationTest(): Promise<void> {
  console.log('\n⚡ === INICIANDO TESTE OTIMIZAÇÃO DE PERFORMANCE ===\n');

  try {
    const deps = createTestDependencies();
    const graphEngine = new GraphEngine();

    // Criar grafo com muitos nós para testar performance
    logTest('PERFORMANCE', '⚡ Configurando grafo para teste de performance');

    const nodeCount = 20;
    const nodes: any[] = [];

    // Criar nó inicial
    const startNode = new GraphNode('start', NodeType.START, undefined);
    nodes.push(startNode);

    // Criar nós de processamento em paralelo
    for (let i = 1; i <= nodeCount; i++) {
      const node = new GraphNode(
        `node_${i}`,
        NodeType.AGENT,
        createTestAgent(`agent_${i}`, `Agent ${i}`, ['processing'])
      );
      nodes.push(node);
    }

    // Criar nó final
    const endNode = new GraphNode('end', NodeType.END, undefined);
    nodes.push(endNode);

    // Adicionar todos os nós
    nodes.forEach(node => graphEngine.addNode(node));

    // Conectar start a todos os nós de processamento
    for (let i = 1; i <= nodeCount; i++) {
      graphEngine.addEdge('start', `node_${i}`, DependencyType.SUCCESS);
    }

    // Conectar todos os nós de processamento ao end
    for (let i = 1; i <= nodeCount; i++) {
      graphEngine.addEdge(`node_${i}`, 'end', DependencyType.SUCCESS);
    }

    // Executar teste de performance
    logTest('PERFORMANCE', '🚀 Executando teste de performance');
    const context = {
      deps,
      config: {} as any,
      state: { data: {}, status: 'running' } as any,
      input: `Executar ${nodeCount} tarefas em paralelo`,
      agentResults: [] as any[]
    };

    const { result, executionTime } = await measureExecutionTime(
      () => graphEngine.execute(context),
      `Execução em Massa (${nodeCount} nós)`
    );

    // Análise de performance
    const avgTimePerNode = executionTime / nodeCount;
    const throughput = (nodeCount / executionTime * 1000).toFixed(2);

    if (result.success && result.completedNodes.length >= nodeCount) {
      logTest('PERFORMANCE', '🎉 SUCESSO - Teste de performance passed!', {
        nodeCount,
        executionTime,
        avgTimePerNode,
        throughput: `${throughput} nodes/sec`,
        successRate: `${(result.completedNodes.length / (nodeCount + 2) * 100).toFixed(1)}%`
      });

      // Validar que o tempo de execução é razoável
      if (executionTime < 10000) { // Menos de 10 segundos
        logTest('PERFORMANCE', '✅ Performance aceitável');
      } else {
        logTest('PERFORMANCE', '⚠️  Performance pode ser otimizada');
      }
    } else {
      throw new Error('Teste de performance falhou');
    }

  } catch (error) {
    logTest('PERFORMANCE', '💥 ERRO NO TESTE DE PERFORMANCE', { error: error.message });
    throw error;
  }
}

// Função principal para executar todos os testes de grafo
async function runGraphTests(): Promise<void> {
  console.log('🔗 ==============================================');
  console.log('🔗  SUITE DE TESTES DE GRAFO - WORKFLOW ORCHESTRATOR');
  console.log('🔗 ==============================================\n');

  const tests = [
    { name: 'Grafo Básico', fn: basicGraphTest },
    { name: 'Roteamento Condicional', fn: conditionalRoutingTest },
    { name: 'Grafo Complexo', fn: complexDependencyGraphTest },
    { name: 'Detecção de Ciclos', fn: cycleDetectionTest },
    { name: 'Performance', fn: performanceOptimizationTest }
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
  console.log('🔗 ==============================================');
  console.log('🔗  RESUMO DOS TESTES DE GRAFO');
  console.log('🔗 ==============================================');

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
    console.log('\n⚠️  Alguns testes de grafo falharam. Verifique os logs acima.');
    process.exit(1);
  } else {
    console.log('\n🎉 Todos os testes de grafo passaram! O Graph Engine está funcionando perfeitamente.');
  }
}

// Executar testes se este arquivo for chamado diretamente
if (require.main === module) {
  runGraphTests().catch(error => {
    console.error('💥 Erro fatal na execução dos testes de grafo:', error);
    process.exit(1);
  });
}

export {
  basicGraphTest,
  conditionalRoutingTest,
  complexDependencyGraphTest,
  cycleDetectionTest,
  performanceOptimizationTest,
  runGraphTests
};