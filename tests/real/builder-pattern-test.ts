// tests/real/builder-pattern-test.ts
/**
 * Teste do Builder Pattern do WorkflowOrchestrator
 *
 * Valida funcionalidades dos builders:
 * - FlowBuilder para workflows
 * - GraphBuilder para grafos
 * - HierarchyBuilder para hierarquias
 * - Interfaces fluentes e encadeamento
 */

import { FlowBuilder } from '../../src/orchestrators/workflows/builders/flowBuilder';
import { GraphBuilder } from '../../src/orchestrators/workflows/builders/graphBuilder';
import { HierarchyBuilder } from '../../src/orchestrators/workflows/builders/hierarchyBuilder';
import { BuildValidator } from '../../src/orchestrators/workflows/builders/buildValidator';
import { FlowType, ParallelStrategy, SupervisorMode, AgentPriority } from '../../src/orchestrators/workflows/core/enums';
import {
  createTestDependencies,
  createTestAgent,
  measureExecutionTime,
  logTest,
  TestResultValidator
} from './setup';

async function flowBuilderTest(): Promise<void> {
  console.log('\n🔨 === INICIANDO TESTE FLOW BUILDER ===\n');

  try {
    const deps = createTestDependencies();

    // Testar interface fluente do FlowBuilder
    logTest('FLOW_BUILDER', '🔨 Testando interface fluente do FlowBuilder');

    const orchestrator = new FlowBuilder()
      .addAgent(createTestAgent('starter', 'Workflow Starter', ['initiation']))
      .addAgent(createTestAgent('processor', 'Data Processor', ['processing']))
      .addAgent(createTestAgent('finisher', 'Workflow Finisher', ['finalization']))
      .addDependency('starter', 'processor')
      .addDependency('processor', 'finisher')
      .setFlowType(FlowType.SEQUENTIAL)
      .enableParallelExecution(ParallelStrategy.ALL)
      .setTimeout(60000)
      .setRetryAttempts(2)
      .build(deps);

    // Validar construção
    logTest('FLOW_BUILDER', '✅ Validando construção do workflow');
    if (!orchestrator) {
      throw new Error('FlowBuilder falhou em criar o orquestrador');
    }

    // Executar workflow construído
    logTest('FLOW_BUILDER', '🎯 Executando workflow construído com FlowBuilder');
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute('Executar workflow construído via builder pattern.'),
      'Workflow FlowBuilder'
    );

    const isValid = TestResultValidator.validateSuccess(result, 'FLOW_BUILDER');
    const expectedAgents = ['starter', 'processor', 'finisher'];

    if (isValid && TestResultValidator.validateAgents(result, expectedAgents, 'FLOW_BUILDER')) {
      logTest('FLOW_BUILDER', '🎉 SUCESSO - FlowBuilder funcionando perfeitamente!', {
        executionTime,
        agentCount: result.agentResults.length,
        flowType: 'SEQUENTIAL',
        parallelExecution: false,
        timeout: 60000,
        retryAttempts: 2
      });
    } else {
      throw new Error('Teste FlowBuilder falhou');
    }

  } catch (error) {
    logTest('FLOW_BUILDER', '💥 ERRO NO TESTE FLOW BUILDER', { error: error.message });
    throw error;
  }
}

async function graphBuilderTest(): Promise<void> {
  console.log('\n🕸️ === INICIANDO TESTE GRAPH BUILDER ===\n');

  try {
    // Testar interface fluente do GraphBuilder
    logTest('GRAPH_BUILDER', '🕸️ Testando interface fluente do GraphBuilder');

    const graphEngine = new GraphBuilder()
      .addNode({
        id: 'start',
        type: 'START',
        metadata: { description: 'Ponto de início do workflow' }
      })
      .addNode({
        id: 'data_input',
        type: 'AGENT',
        agent: createTestAgent('input_agent', 'Data Input Agent', ['data_input']),
        metadata: { description: 'Coleta de dados' }
      })
      .addNode({
        id: 'decision',
        type: 'CONDITION',
        metadata: { description: 'Decisão de roteamento' }
      })
      .addNode({
        id: 'process_a',
        type: 'AGENT',
        agent: createTestAgent('processor_a', 'Processor A', ['processing_a']),
        metadata: { description: 'Processamento via caminho A' }
      })
      .addNode({
        id: 'process_b',
        type: 'AGENT',
        agent: createTestAgent('processor_b', 'Processor B', ['processing_b']),
        metadata: { description: 'Processamento via caminho B' }
      })
      .addNode({
        id: 'merge',
        type: 'AGENT',
        agent: createTestAgent('merger', 'Result Merger', ['merging']),
        metadata: { description: 'Mescla dos resultados' }
      })
      .addNode({
        id: 'end',
        type: 'END',
        metadata: { description: 'Ponto final do workflow' }
      })
      .addEdge({
        id: 'start_to_input',
        fromNodeId: 'start',
        toNodeId: 'data_input'
      })
      .addEdge({
        id: 'input_to_decision',
        fromNodeId: 'data_input',
        toNodeId: 'decision'
      })
      .addConditionalEdge(
        'decision',
        'process_a',
        {
          type: 'data',
          field: 'route',
          operator: 'equals',
          value: 'A'
        }
      )
      .addConditionalEdge(
        'decision',
        'process_b',
        {
          type: 'data',
          field: 'route',
          operator: 'equals',
          value: 'B'
        }
      )
      .addEdge({
        id: 'a_to_merge',
        fromNodeId: 'process_a',
        toNodeId: 'merge'
      })
      .addEdge({
        id: 'b_to_merge',
        fromNodeId: 'process_b',
        toNodeId: 'merge'
      })
      .addEdge({
        id: 'merge_to_end',
        fromNodeId: 'merge',
        toNodeId: 'end'
      })
      .setStartNode('start')
      .setEndNode('end')
      .setCycleHandling('warning')
      .build();

    // Validar grafo construído
    logTest('GRAPH_BUILDER', '✅ Validando estrutura do grafo');
    const validation = graphEngine.validateGraph();
    if (!validation.valid) {
      throw new Error(`Grafo inválido: ${validation.errors.join(', ')}`);
    }

    // Executar grafo
    logTest('GRAPH_BUILDER', '🎯 Executando grafo construído com GraphBuilder');
    const context = {
      deps: createTestDependencies(),
      config: {} as any,
      state: { data: { route: 'A' }, status: 'running' } as any,
      input: 'Executar grafo construído via GraphBuilder',
      agentResults: [] as any[]
    };

    const { result, executionTime } = await measureExecutionTime(
      () => graphEngine.execute(context),
      'Execução do Grafo GraphBuilder'
    );

    if (result.success) {
      logTest('GRAPH_BUILDER', '🎉 SUCESSO - GraphBuilder funcionando perfeitamente!', {
        executionTime,
        nodeCount: 7,
        edgeCount: 7,
        conditionalRouting: true,
        selectedPath: 'A',
        completedNodes: result.completedNodes
      });
    } else {
      throw new Error('Teste GraphBuilder falhou');
    }

  } catch (error) {
    logTest('GRAPH_BUILDER', '💥 ERRO NO TESTE GRAPH BUILDER', { error: error.message });
    throw error;
  }
}

async function hierarchyBuilderTest(): Promise<void> {
  console.log('\n👑 === INICIANDO TESTE HIERARCHY BUILDER ===\n');

  try {
    // Testar interface fluente do HierarchyBuilder
    logTest('HIERARCHY_BUILDER', '👑 Testando interface fluente do HierarchyBuilder');

    const supervisor = new HierarchyBuilder()
      .setSupervisor({
        id: 'main_supervisor',
        mode: SupervisorMode.DELEGATION,
        delegationStrategy: 'capability_based'
      })
      .addRole({
        id: 'team_lead',
        name: 'Team Lead',
        description: 'Líder da equipe técnica',
        agent: createTestAgent('lead', 'Team Lead', ['leadership', 'coordination']),
        priority: AgentPriority.HIGH,
        capabilities: ['coordination', 'management', 'technical_review']
      })
      .addSpecialistRole(
        'frontend_specialist',
        'Frontend Specialist',
        ['frontend', 'ui', 'ux'],
        createTestAgent('frontend', 'Frontend Developer', ['frontend'])
      )
      .addSpecialistRole(
        'backend_specialist',
        'Backend Specialist',
        ['backend', 'api', 'database'],
        createTestAgent('backend', 'Backend Developer', ['backend'])
      )
      .addSpecialistRole(
        'devops_specialist',
        'DevOps Specialist',
        ['devops', 'deployment', 'infrastructure'],
        createTestAgent('devops', 'DevOps Engineer', ['devops'])
      )
      .addValidatorRole(
        'qa_validator',
        'QA Validator',
        ['quality_assurance', 'testing', 'validation'],
        createTestAgent('qa', 'QA Engineer', ['testing'])
      )
      .createStandardTeam(
        'team_lead',
        ['frontend_specialist', 'backend_specialist', 'devops_specialist'],
        'qa_validator'
      )
      .setSupervisorMode(SupervisorMode.PARALLEL_DELEGATION)
      .setDelegationStrategy('capability_based')
      .addTask({
        id: 'feature_development',
        title: 'Feature Development Task',
        description: 'Desenvolver nova funcionalidade completa',
        requiredCapabilities: ['frontend', 'backend', 'coordination'],
        priority: AgentPriority.HIGH
      })
      .addAnalysisTask(
        'requirements_analysis',
        'Requirements Analysis',
        'Analisar requisitos da nova funcionalidade',
        ['analysis', 'requirements'],
        AgentPriority.HIGH
      )
      .addGenerationTask(
        'feature_implementation',
        'Feature Implementation',
        'Implementar código da funcionalidade',
        'development',
        AgentPriority.NORMAL
      })
      .addReviewTask(
        'code_review',
        'Code Review',
        'Revisar código implementado',
        'feature_implementation',
        AgentPriority.NORMAL
      )
      .setMaxConcurrency(4)
      .enableLoadBalancing(true)
      .build();

    // Validar hierarquia construída
    logTest('HIERARCHY_BUILDER', '✅ Validando estrutura da hierarquia');
    if (!supervisor) {
      throw new Error('HierarchyBuilder falhou em criar o supervisor');
    }

    // Executar tarefa na hierarquia
    logTest('HIERARCHY_BUILDER', '🎯 Executando tarefa na hierarquia construída');
    const context = {
      deps: createTestDependencies(),
      config: {} as any,
      state: { data: {}, status: 'running' } as any,
      input: 'Executar desenvolvimento de feature completa',
      agentResults: [] as any[]
    };

    const { result, executionTime } = await measureExecutionTime(
      () => supervisor.executeTask('feature_development', context),
      'Execução da Hierarquia HierarchyBuilder'
    );

    if (result.success) {
      logTest('HIERARCHY_BUILDER', '🎉 SUCESSO - HierarchyBuilder funcionando perfeitamente!', {
        executionTime,
        roleCount: 5,
        taskCount: 4,
        maxConcurrency: 4,
        loadBalancing: true,
        delegationStrategy: 'capability_based',
        teamStructure: 'STANDARD',
        taskCompleted: result.success
      });
    } else {
      throw new Error('Teste HierarchyBuilder falhou');
    }

  } catch (error) {
    logTest('HIERARCHY_BUILDER', '💥 ERRO NO TESTE HIERARCHY BUILDER', { error: error.message });
    throw error;
  }
}

async function buildValidatorTest(): Promise<void> {
  console.log('\n✅ === INICIANDO TESTE BUILD VALIDATOR ===\n');

  try {
    const validator = new BuildValidator();

    // Testar validação de configuração válida
    logTest('BUILD_VALIDATOR', '✅ Testando validação de configuração válida');

    const validConfig = {
      agents: [
        createTestAgent('agent1', 'Agent 1', ['task1']),
        createTestAgent('agent2', 'Agent 2', ['task2'])
      ],
      flowType: FlowType.SEQUENTIAL,
      dependencies: [
        { fromAgentId: 'agent1', toAgentId: 'agent2' }
      ],
      timeout: 30000,
      retryAttempts: 2
    };

    const validResult = validator.validate(validConfig);
    if (!validResult.valid) {
      throw new Error('Configuração válida foi rejeitada');
    }

    logTest('BUILD_VALIDATOR', '✅ Configuração válida validada corretamente');

    // Testar validação de configuração inválida
    logTest('BUILD_VALIDATOR', '❌ Testando validação de configuração inválida');

    const invalidConfig = {
      agents: [], // Sem agentes
      flowType: 'INVALID_FLOW', // Flow type inválido
      dependencies: [
        { fromAgentId: 'nonexistent', toAgentId: 'also_nonexistent' }
      ],
      timeout: -1000, // Timeout inválido
      retryAttempts: -1 // Retry inválido
    };

    const invalidResult = validator.validate(invalidConfig);
    if (invalidResult.valid) {
      throw new Error('Configuração inválida foi aceita');
    }

    logTest('BUILD_VALIDATOR', '✅ Configuração inválida rejeitada corretamente', {
      errorsFound: invalidResult.errors.length,
      warningsFound: invalidResult.warnings.length
    });

    // Testar validação de dependências
    logTest('BUILD_VALIDATOR', '🔗 Testando validação de dependências');

    const validDependencies = [
      { fromAgentId: 'agent1', toAgentId: 'agent2' },
      { fromAgentId: 'agent2', toAgentId: 'agent3' }
    ];

    const depResult = validator.validateDependencies(validDependencies);
    if (!depResult.valid) {
      throw new Error('Dependências válidas foram rejeitadas');
    }

    // Testar validação de dependências circulares
    const circularDependencies = [
      { fromAgentId: 'agent1', toAgentId: 'agent2' },
      { fromAgentId: 'agent2', toAgentId: 'agent3' },
      { fromAgentId: 'agent3', toAgentId: 'agent1' } // Ciclo
    ];

    const circularResult = validator.validateDependencies(circularDependencies);
    if (circularResult.valid) {
      throw new Error('Dependências circulares foram aceitas');
    }

    logTest('BUILD_VALIDATOR', '✅ Validação de dependências funcionando corretamente', {
      validDependencies: depResult.valid,
      circularDetected: !circularResult.valid,
      circularErrors: circularResult.errors.filter(e => e.includes('cycle')).length
    });

    logTest('BUILD_VALIDATOR', '🎉 SUCESSO - BuildValidator funcionando perfeitamente!');

  } catch (error) {
    logTest('BUILD_VALIDATOR', '💥 ERRO NO TESTE BUILD VALIDATOR', { error: error.message });
    throw error;
  }
}

async function compositeBuilderTest(): Promise<void> {
  console.log('\n🏗️ === INICIANDO TESTE BUILDER COMPOSTO ===\n');

  try {
    const deps = createTestDependencies();

    // Testar composição de múltiplos builders
    logTest('COMPOSITE_BUILDER', '🏗️ Testando composição de builders');

    // 1. Construir hierarquia complexa
    const supervisor = new HierarchyBuilder()
      .setSupervisor({
        id: 'project_manager',
        mode: SupervisorMode.DELEGATION
      })
      .createStandardTeam(
        'tech_lead',
        ['frontend_dev', 'backend_dev', 'qa_engineer'],
        'code_reviewer'
      )
      .addAnalysisTask('project_analysis', 'Project Analysis', 'Analisar requisitos do projeto', ['analysis'])
      .build();

    // 2. Construir workflow principal
    const orchestrator = new FlowBuilder()
      .addAgent(createTestAgent('planner', 'Project Planner', ['planning']))
      .addAgent(createTestAgent('executor', 'Project Executor', ['execution']))
      .addAgent(createTestAgent('reviewer', 'Project Reviewer', ['review']))
      .setFlowType(FlowType.HYBRID)
      .enableParallelExecution(ParallelStrategy.BATCH)
      .setTimeout(120000)
      .build(deps);

    // 3. Construir grafo de dependências
    const graphEngine = new GraphBuilder()
      .addNode({ id: 'start', type: 'START' })
      .addNode({
        id: 'planning_node',
        type: 'AGENT',
        agent: createTestAgent('planner', 'Planning Agent', ['planning'])
      })
      .addNode({
        id: 'execution_node',
        type: 'AGENT',
        agent: createTestAgent('executor', 'Execution Agent', ['execution'])
      })
      .addNode({ id: 'end', type: 'END' })
      .addSuccessEdge('start', 'planning_node')
      .addSuccessEdge('planning_node', 'execution_node')
      .addSuccessEdge('execution_node', 'end')
      .setStartNode('start')
      .setEndNode('end')
      .build();

    // Executar teste composto
    logTest('COMPOSITE_BUILDER', '🎯 Executando sistema composto');

    // Executar workflow
    const { result: workflowResult } = await measureExecutionTime(
      () => orchestrator.execute('Executar projeto usando sistema composto de builders.'),
      'Workflow Composto'
    );

    // Executar grafo
    const graphContext = {
      deps,
      config: {} as any,
      state: { data: {}, status: 'running' } as any,
      input: 'Executar grafo composto',
      agentResults: [] as any[]
    };

    const { result: graphResult } = await measureExecutionTime(
      () => graphEngine.execute(graphContext),
      'Grafo Composto'
    );

    // Executar tarefa hierárquica
    const hierarchyContext = {
      deps,
      config: {} as any,
      state: { data: {}, status: 'running' } as any,
      input: 'Executar tarefa hierárquica',
      agentResults: [] as any[]
    };

    const { result: hierarchyResult } = await measureExecutionTime(
      () => supervisor.executeTask('project_analysis', hierarchyContext),
      'Hierarquia Composta'
    );

    // Validar que todos funcionaram
    const allSuccessful = workflowResult.success && graphResult.success && hierarchyResult.success;

    if (allSuccessful) {
      logTest('COMPOSITE_BUILDER', '🎉 SUCESSO - Sistema composto de builders funcionando!', {
        workflowSuccess: workflowResult.success,
        graphSuccess: graphResult.success,
        hierarchySuccess: hierarchyResult.success,
        totalComponents: 3,
        builderTypes: ['FlowBuilder', 'GraphBuilder', 'HierarchyBuilder'],
        integrationLevel: 'FULL'
      });
    } else {
      throw new Error('Sistema composto falhou');
    }

  } catch (error) {
    logTest('COMPOSITE_BUILDER', '💥 ERRO NO TESTE BUILDER COMPOSTO', { error: error.message });
    throw error;
  }
}

// Função principal para executar todos os testes de builder
async function runBuilderTests(): Promise<void> {
  console.log('🔨 ==============================================');
  console.log('🔨  SUITE DE TESTES BUILDER PATTERN - WORKFLOW ORCHESTRATOR');
  console.log('🔨 ==============================================\n');

  const tests = [
    { name: 'Flow Builder', fn: flowBuilderTest },
    { name: 'Graph Builder', fn: graphBuilderTest },
    { name: 'Hierarchy Builder', fn: hierarchyBuilderTest },
    { name: 'Build Validator', fn: buildValidatorTest },
    { name: 'Builder Composto', fn: compositeBuilderTest }
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
  console.log('🔨 ==============================================');
  console.log('🔨  RESUMO DOS TESTES BUILDER PATTERN');
  console.log('🔨 ==============================================');

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
    console.log('\n⚠️  Alguns testes de builder falharam. Verifique os logs acima.');
    process.exit(1);
  } else {
    console.log('\n🎉 Todos os testes de builder pattern passaram! A API de construção está excelente.');
  }
}

// Executar testes se este arquivo for chamado diretamente
if (require.main === module) {
  runBuilderTests().catch(error => {
    console.error('💥 Erro fatal na execução dos testes de builder:', error);
    process.exit(1);
  });
}

export {
  flowBuilderTest,
  graphBuilderTest,
  hierarchyBuilderTest,
  buildValidatorTest,
  compositeBuilderTest,
  runBuilderTests
};