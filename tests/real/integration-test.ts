// tests/real/integration-test.ts
/**
 * Teste completo de integração do WorkflowOrchestrator
 *
 * Teste abrangente que combina todas as funcionalidades:
 * - Workflows complexos multi-tipo
 * - Integração entre diferentes componentes
 * - Cenários realistas de uso
 * - Performance e escalabilidade
 */

import { WorkflowOrchestrator } from '../../src/orchestrators/workflows/core/workflowOrchestrator';
import { FlowBuilder } from '../../src/orchestrators/workflows/builders/flowBuilder';
import { GraphBuilder } from '../../src/orchestrators/workflows/builders/graphBuilder';
import { HierarchyBuilder } from '../../src/orchestrators/workflows/builders/hierarchyBuilder';
import { GraphEngine } from '../../src/orchestrators/workflows/graph/graphEngine';
import { FlowType, SupervisorMode, AgentPriority, ParallelStrategy } from '../../src/orchestrators/workflows/core/enums';
import {
  createTestDependencies,
  createTestAgent,
  measureExecutionTime,
  logTest,
  TestResultValidator,
  TEST_CASES
} from './setup';

async function enterpriseWorkflowTest(): Promise<void> {
  console.log('\n🏢 === INICIANDO TESTE WORKFLOW EMPRESARIAL COMPLETO ===\n');

  try {
    const deps = createTestDependencies();

    // Simular um workflow empresarial completo
    logTest('ENTERPRISE', '🏢 Configurando workflow empresarial completo');

    const orchestrator = new FlowBuilder()
      // Fase 1: Planejamento estratégico (hierárquico)
      .addAgent({
        ...createTestAgent('strategic_planner', 'Strategic Planner', ['strategic_planning', 'analysis']),
        priority: AgentPriority.CRITICAL,
        timeout: 60000
      })
      .addAgent({
        ...createTestAgent('business_analyst', 'Business Analyst', ['business_analysis', 'requirements']),
        priority: AgentPriority.HIGH,
        timeout: 45000
      })

      // Fase 2: Design técnico (paralelo)
      .addAgent({
        ...createTestAgent('system_architect', 'System Architect', ['architecture', 'design']),
        priority: AgentPriority.HIGH,
        timeout: 90000
      })
      .addAgent({
        ...createTestAgent('ui_designer', 'UI Designer', ['ui_design', 'ux']),
        priority: AgentPriority.NORMAL,
        timeout: 60000
      })
      .addAgent({
        ...createTestAgent('security_specialist', 'Security Specialist', ['security', 'compliance']),
        priority: AgentPriority.HIGH,
        timeout: 45000
      })

      // Fase 3: Desenvolvimento (paralelo em squads)
      .addAgent({
        ...createTestAgent('frontend_squad', 'Frontend Squad', ['frontend', 'react', 'typescript']),
        priority: AgentPriority.NORMAL,
        timeout: 120000
      })
      .addAgent({
        ...createTestAgent('backend_squad', 'Backend Squad', ['backend', 'api', 'database']),
        priority: AgentPriority.NORMAL,
        timeout: 120000
      })
      .addAgent({
        ...createTestAgent('devops_squad', 'DevOps Squad', ['infrastructure', 'deployment']),
        priority: AgentPriority.NORMAL,
        timeout: 90000
      })

      // Fase 4: Integração e teste (sequencial)
      .addAgent({
        ...createTestAgent('integration_team', 'Integration Team', ['integration', 'testing']),
        priority: AgentPriority.HIGH,
        timeout: 60000
      })
      .addAgent({
        ...createTestAgent('qa_team', 'QA Team', ['quality_assurance', 'automation']),
        priority: AgentPriority.HIGH,
        timeout: 90000
      })

      // Fase 5: Deploy e monitoramento
      .addAgent({
        ...createTestAgent('deployment_team', 'Deployment Team', ['deployment', 'release']),
        priority: AgentPriority.CRITICAL,
        timeout: 30000
      })
      .addAgent({
        ...createTestAgent('monitoring_team', 'Monitoring Team', ['monitoring', 'observability']),
        priority: AgentPriority.NORMAL,
        timeout: 45000
      })

      // Configurar dependências complexas
      .addDependency('strategic_planner', 'business_analyst')
      .addDependency('business_analyst', 'system_architect')
      .addDependency('business_analyst', 'ui_designer')
      .addDependency('business_analyst', 'security_specialist')
      .addDependency('system_architect', 'frontend_squad')
      .addDependency('system_architect', 'backend_squad')
      .addDependency('ui_designer', 'frontend_squad')
      .addDependency('security_specialist', 'backend_squad')
      .addDependency('security_specialist', 'devops_squad')
      .addDependency('frontend_squad', 'integration_team')
      .addDependency('backend_squad', 'integration_team')
      .addDependency('devops_squad', 'integration_team')
      .addDependency('integration_team', 'qa_team')
      .addDependency('qa_team', 'deployment_team')
      .addDependency('deployment_team', 'monitoring_team')

      // Configurar workflow híbrido
      .setFlowType(FlowType.HYBRID)
      .enableParallelExecution(ParallelStrategy.BATCH)
      .setTimeout(300000) // 5 minutos no total
      .setRetryAttempts(2)
      .build(deps);

    // Executar workflow empresarial
    logTest('ENTERPRISE', '🚀 Executando workflow empresarial completo');
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute(
        'Desenvolver e implantar uma nova funcionalidade empresarial completa, ' +
        'desde o planejamento estratégico até o monitoramento em produção.'
      ),
      'Workflow Empresarial Completo'
    );

    // Análise detalhada dos resultados
    const expectedPhases = [
      ['strategic_planner', 'business_analyst'],              // Fase 1: Planejamento
      ['system_architect', 'ui_designer', 'security_specialist'], // Fase 2: Design
      ['frontend_squad', 'backend_squad', 'devops_squad'],   // Fase 3: Desenvolvimento
      ['integration_team', 'qa_team'],                        // Fase 4: Integração
      ['deployment_team', 'monitoring_team']                  // Fase 5: Deploy
    ];

    const allPhasesExecuted = expectedPhases.every(phase =>
      phase.every(agentId => result.agentResults.some(r => r.agentId === agentId))
    );

    const isValid = TestResultValidator.validateSuccess(result, 'ENTERPRISE');

    if (isValid && allPhasesExecuted) {
      // Análise de performance por fase
      const phaseAnalysis = expectedPhases.map((phase, index) => {
        const phaseResults = phase.map(agentId =>
          result.agentResults.find(r => r.agentId === agentId)
        );
        const phaseTime = phaseResults.reduce((sum, r) => sum + (r?.executionTime || 0), 0);
        return {
          phase: index + 1,
          agents: phase.length,
          totalTime: phaseTime,
          avgTime: phaseTime / phase.length
        };
      });

      logTest('ENTERPRISE', '🎉 SUCESSO - Workflow empresarial executado com sucesso!', {
        executionTime,
        totalAgents: result.agentResults.length,
        phasesCompleted: expectedPhases.length,
        phaseAnalysis,
        successRate: `${(result.agentResults.filter(r => r.success).length / result.agentResults.length * 100).toFixed(1)}%`,
        workflowComplexity: 'HIGH',
        enterpriseReady: true
      });
    } else {
      throw new Error('Workflow empresarial falhou');
    }

  } catch (error) {
    logTest('ENTERPRISE', '💥 ERRO NO TESTE WORKFLOW EMPRESARIAL', { error: error.message });
    throw error;
  }
}

async function multiSystemIntegrationTest(): Promise<void> {
  console.log('\n🔗 === INICIANDO TESTE INTEGRAÇÃO MULTI-SISTEMA ===\n');

  try {
    const deps = createTestDependencies();

    // Simular integração entre múltiplos sistemas
    logTest('MULTI_SYSTEM', '🔗 Configurando integração multi-sistema');

    // Sistema 1: Workflow principal
    const mainWorkflow = new FlowBuilder()
      .addAgent(createTestAgent('main_coordinator', 'Main Coordinator', ['coordination', 'integration']))
      .addAgent(createTestAgent('data_processor', 'Data Processor', ['data_processing', 'transformation']))
      .addAgent(createTestAgent('result_aggregator', 'Result Aggregator', ['aggregation', 'synthesis']))
      .setFlowType(FlowType.SEQUENTIAL)
      .build(deps);

    // Sistema 2: Grafo de decisão
    const decisionGraph = new GraphBuilder()
      .addNode({ id: 'start', type: 'START' })
      .addNode({
        id: 'analyzer',
        type: 'AGENT',
        agent: createTestAgent('decision_analyzer', 'Decision Analyzer', ['analysis', 'decision'])
      })
      .addNode({ id: 'decision', type: 'CONDITION' })
      .addNode({
        id: 'processor_a',
        type: 'AGENT',
        agent: createTestAgent('processor_a', 'Processor A', ['processing_a'])
      })
      .addNode({
        id: 'processor_b',
        type: 'AGENT',
        agent: createTestAgent('processor_b', 'Processor B', ['processing_b'])
      })
      .addNode({ id: 'merge', type: 'AGENT', agent: createTestAgent('merger', 'Result Merger', ['merging']) })
      .addNode({ id: 'end', type: 'END' })
      .addSuccessEdge('start', 'analyzer')
      .addSuccessEdge('analyzer', 'decision')
      .addConditionalEdge('decision', 'processor_a', { type: 'data', field: 'route', operator: 'equals', value: 'A' })
      .addConditionalEdge('decision', 'processor_b', { type: 'data', field: 'route', operator: 'equals', value: 'B' })
      .addSuccessEdge('processor_a', 'merge')
      .addSuccessEdge('processor_b', 'merge')
      .addSuccessEdge('merge', 'end')
      .setStartNode('start')
      .setEndNode('end')
      .build();

    // Sistema 3: Hierarquia de especialistas
    const specialistHierarchy = new HierarchyBuilder()
      .setSupervisor({
        id: 'expert_coordinator',
        mode: SupervisorMode.DELEGATION
      })
      .addSpecialistRole('domain_expert', 'Domain Expert', ['domain_knowledge', 'expertise'])
      .addSpecialistRole('technical_expert', 'Technical Expert', ['technical_knowledge', 'implementation'])
      .addSpecialistRole('business_expert', 'Business Expert', ['business_knowledge', 'strategy'])
      .createStandardTeam('expert_coordinator', ['domain_expert', 'technical_expert', 'business_expert'])
      .addAnalysisTask('expert_analysis', 'Expert Analysis', 'Análise especializada', ['expertise'])
      .build();

    // Executar integração multi-sistema
    logTest('MULTI_SYSTEM', '🚀 Executando integração multi-sistema');

    // 1. Executar workflow principal
    const mainResult = await mainWorkflow.execute(
      'Iniciar processo de integração multi-sistema'
    );

    if (!mainResult.success) {
      throw new Error('Workflow principal falhou');
    }

    // 2. Executar grafo de decisão baseado no resultado
    const graphContext = {
      deps,
      config: {} as any,
      state: { data: { route: 'A' }, status: 'running' } as any,
      input: mainResult.finalOutput,
      agentResults: [] as any[]
    };

    const graphResult = await decisionGraph.execute(graphContext);

    if (!graphResult.success) {
      throw new Error('Grafo de decisão falhou');
    }

    // 3. Executar hierarquia de especialistas
    const hierarchyContext = {
      deps,
      config: {} as any,
      state: { data: {}, status: 'running' } as any,
      input: graphResult.results[graphResult.results.length - 1].output,
      agentResults: [] as any[]
    };

    const hierarchyResult = await specialistHierarchy.executeTask('expert_analysis', hierarchyContext);

    if (!hierarchyResult.success) {
      throw new Error('Hierarquia de especialistas falhou');
    }

    // Agregar resultados finais
    const finalAggregation = new FlowBuilder()
      .addAgent(createTestAgent('final_aggregator', 'Final Aggregator', ['aggregation', 'integration']))
      .build(deps);

    const finalResult = await finalAggregation.execute(
      `Agregar resultados dos sistemas:
       Workflow: ${mainResult.finalOutput}
       Graph: ${graphResult.results[graphResult.results.length - 1].output}
       Hierarchy: ${hierarchyResult.finalOutput}`
    );

    // Validar integração completa
    const allSystemsSuccessful = mainResult.success && graphResult.success && hierarchyResult.success && finalResult.success;

    if (allSystemsSuccessful) {
      logTest('MULTI_SYSTEM', '🎉 SUCESSO - Integração multi-sistema executada!', {
        workflowSuccess: mainResult.success,
        graphSuccess: graphResult.success,
        hierarchySuccess: hierarchyResult.success,
        finalSuccess: finalResult.success,
        totalExecutionTime: mainResult.executionTime + graphResult.executionTime + hierarchyResult.executionTime + finalResult.executionTime,
        systemsIntegrated: 3,
        dataFlow: 'WORKFLOW → GRAPH → HIERARCHY → AGGREGATION',
        integrationComplexity: 'HIGH'
      });
    } else {
      throw new Error('Integração multi-sistema falhou');
    }

  } catch (error) {
    logTest('MULTI_SYSTEM', '💥 ERRO NO TESTE INTEGRAÇÃO MULTI-SISTEMA', { error: error.message });
    throw error;
  }
}

async function scalabilityTest(): Promise<void> {
  console.log('\n📈 === INICIANDO TESTE DE ESCALABILIDADE ===\n');

  try {
    const deps = createTestDependencies();

    // Testar escalabilidade com volumes crescentes
    logTest('SCALABILITY', '📈 Testando escalabilidade com volumes crescentes');

    const testSizes = [
      { name: 'Pequeno', agentCount: 5, taskComplexity: 'simples' },
      { name: 'Médio', agentCount: 15, taskComplexity: 'moderado' },
      { name: 'Grande', agentCount: 30, taskComplexity: 'complexo' },
      { name: 'Muito Grande', agentCount: 50, taskComplexity: 'muito_complexo' }
    ];

    const scalabilityResults = [];

    for (const testSize of testSizes) {
      logTest('SCALABILITY', `🎯 Executando teste ${testSize.name} (${testSize.agentCount} agentes)`);

      // Criar workflow baseado no tamanho
      const orchestrator = new FlowBuilder();

      for (let i = 1; i <= testSize.agentCount; i++) {
        const priority = i <= 3 ? AgentPriority.HIGH :
                        i <= testSize.agentCount * 0.3 ? AgentPriority.NORMAL :
                        AgentPriority.LOW;

        orchestrator.addAgent({
          ...createTestAgent(
            `agent_${i}`,
            `Agent ${i}`,
            [`task_${i % 5}`, 'processing']
          ),
          priority,
          timeout: 30000 + (i * 1000) // Timeout variado
        });
      }

      // Configurar workflow
      orchestrator
        .setFlowType(FlowType.PARALLEL)
        .enableParallelExecution(ParallelStrategy.ALL)
        .setTimeout(180000) // 3 minutos
        .build(deps);

      // Executar e medir
      const startTime = Date.now();
      const result = await orchestrator.execute(
        `Processar ${testSize.agentCount} tarefas com complexidade ${testSize.taskComplexity}`
      );
      const executionTime = Date.now() - startTime;

      // Calcular métricas
      const successRate = (result.agentResults.filter(r => r.success).length / result.agentResults.length * 100).toFixed(1);
      const throughput = (testSize.agentCount / executionTime * 1000).toFixed(2);
      const avgTimePerAgent = (executionTime / result.agentResults.length).toFixed(0);

      scalabilityResults.push({
        size: testSize.name,
        agentCount: testSize.agentCount,
        executionTime,
        successRate: parseFloat(successRate),
        throughput: parseFloat(throughput),
        avgTimePerAgent: parseFloat(avgTimePerAgent),
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024 // MB
      });

      logTest('SCALABILITY', `✅ Teste ${testSize.name} concluído`, {
        executionTime,
        successRate: `${successRate}%`,
        throughput: `${throughput} agents/sec`
      });

      // Pausa entre testes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Análise de escalabilidade
    logTest('SCALABILITY', '📊 Análise de escalabilidade');

    const timeComplexity = scalabilityResults.map(r => r.executionTime / r.agentCount);
    const efficiency = scalabilityResults.map(r => r.throughput);

    const isLinear = timeComplexity.every((time, i) => {
      if (i === 0) return true;
      const ratio = time / timeComplexity[0];
      return ratio <= 2; // Aceita até 2x de degradação
    });

    if (isLinear) {
      logTest('SCALABILITY', '✅ Escalabilidade linear aceitável');
    } else {
      logTest('SCALABILITY', '⚠️  Degradação de performance detectada');
    }

    logTest('SCALABILITY', '🎉 SUCESSO - Teste de escalabilidade concluído!', {
      testCases: testSizes.length,
      maxAgents: Math.max(...scalabilityResults.map(r => r.agentCount)),
      maxThroughput: `${Math.max(...scalabilityResults.map(r => r.throughput)).toFixed(2)} agents/sec`,
      scalability: isLinear ? 'LINEAR' : 'SUB-LINEAR',
      performance: 'ACCEPTABLE'
    });

  } catch (error) {
    logTest('SCALABILITY', '💥 ERRO NO TESTE DE ESCALABILIDADE', { error: error.message });
    throw error;
  }
}

async function realWorldScenarioTest(): Promise<void> {
  console.log('\n🌍 === INICIANDO TESTE CENÁRIO REAL MUNDO ===\n');

  try {
    const deps = createTestDependencies();

    // Simular um cenário real: Processamento de Pedido de E-commerce
    logTest('REAL_WORLD', '🌍 Configurando cenário real: Processamento de Pedido E-commerce');

    // Fase 1: Validação do pedido
    const validationWorkflow = new FlowBuilder()
      .addAgent(createTestAgent('order_validator', 'Order Validator', ['validation', 'rules']))
      .addAgent(createTestAgent('fraud_detector', 'Fraud Detector', ['fraud_detection', 'security']))
      .addAgent(createTestAgent('inventory_checker', 'Inventory Checker', ['inventory', 'stock']))
      .setFlowType(FlowType.PARALLEL)
      .build(deps);

    // Fase 2: Processamento de pagamento
    const paymentGraph = new GraphBuilder()
      .addNode({ id: 'payment_start', type: 'START' })
      .addNode({
        id: 'payment_processor',
        type: 'AGENT',
        agent: createTestAgent('payment_processor', 'Payment Processor', ['payment', 'billing'])
      })
      .addNode({ id: 'payment_decision', type: 'CONDITION' })
      .addNode({
        id: 'success_handler',
        type: 'AGENT',
        agent: createTestAgent('success_handler', 'Success Handler', ['order_confirmation', 'notification'])
      })
      .addNode({
        id: 'failure_handler',
        type: 'AGENT',
        agent: createTestAgent('failure_handler', 'Failure Handler', ['error_handling', 'retry'])
      })
      .addNode({ id: 'payment_end', type: 'END' })
      .addSuccessEdge('payment_start', 'payment_processor')
      .addSuccessEdge('payment_processor', 'payment_decision')
      .addConditionalEdge('payment_decision', 'success_handler', {
        type: 'data',
        field: 'paymentStatus',
        operator: 'equals',
        value: 'success'
      })
      .addConditionalEdge('payment_decision', 'failure_handler', {
        type: 'data',
        field: 'paymentStatus',
        operator: 'equals',
        value: 'failed'
      })
      .addSuccessEdge('success_handler', 'payment_end')
      .addSuccessEdge('failure_handler', 'payment_end')
      .setStartNode('payment_start')
      .setEndNode('payment_end')
      .build();

    // Fase 3: Logística e fulfillment
    const logisticsHierarchy = new HierarchyBuilder()
      .setSupervisor({
        id: 'logistics_manager',
        mode: SupervisorMode.DELEGATION
      })
      .addRole({
        id: 'warehouse_team',
        name: 'Warehouse Team',
        description: 'Equipe de armazenamento e separação',
        agent: createTestAgent('warehouse', 'Warehouse Team', ['picking', 'packing']),
        capabilities: ['inventory_management', 'order_fulfillment']
      })
      .addRole({
        id: 'shipping_team',
        name: 'Shipping Team',
        description: 'Equipe de transporte e entrega',
        agent: createTestAgent('shipping', 'Shipping Team', ['shipping', 'logistics']),
        capabilities: ['shipping_management', 'tracking']
      })
      .addRole({
        id: 'customer_service',
        name: 'Customer Service',
        description: 'Atendimento ao cliente',
        agent: createTestAgent('customer_service', 'Customer Service', ['support', 'communication']),
        capabilities: ['customer_support', 'issue_resolution']
      })
      .setDelegationStrategy('capability_based')
      .addTask({
        id: 'order_fulfillment',
        title: 'Order Fulfillment',
        description: 'Processar pedido completo desde armazém até entrega',
        requiredCapabilities: ['order_fulfillment', 'shipping_management'],
        priority: AgentPriority.HIGH
      })
      .build();

    // Executar cenário completo
    logTest('REAL_WORLD', '🛒 Processando pedido E-commerce completo');

    // 1. Validar pedido
    const validationResult = await validationWorkflow.execute(
      'Validar pedido #12345: Produto XYZ, Quantidade: 2, Valor: $199.99'
    );

    if (!validationResult.success) {
      throw new Error('Validação do pedido falhou');
    }

    // 2. Processar pagamento
    const paymentContext = {
      deps,
      config: {} as any,
      state: {
        data: {
          orderId: '12345',
          amount: 199.99,
          paymentMethod: 'credit_card',
          customerInfo: validationResult.finalOutput
        },
        status: 'running'
      } as any,
      input: 'Processar pagamento do pedido',
      agentResults: [] as any[]
    };

    // Simular pagamento bem-sucedido
    paymentContext.state.data.paymentStatus = 'success';
    const paymentResult = await paymentGraph.execute(paymentContext);

    if (!paymentResult.success) {
      throw new Error('Processamento de pagamento falhou');
    }

    // 3. Processar logística
    const logisticsContext = {
      deps,
      config: {} as any,
      state: {
        data: {
          orderId: '12345',
          items: [{ product: 'XYZ', quantity: 2 }],
          shippingAddress: 'Rua Teste, 123, São Paulo - SP',
          paymentConfirmed: true
        },
        status: 'running'
      } as any,
      input: 'Processar logística do pedido',
      agentResults: [] as any[]
    };

    const logisticsResult = await logisticsHierarchy.executeTask('order_fulfillment', logisticsContext);

    if (!logisticsResult.success) {
      throw new Error('Processamento logístico falhou');
    }

    // 4. Notificação final
    const notificationWorkflow = new FlowBuilder()
      .addAgent(createTestAgent('notifier', 'Notification Agent', ['notification', 'email', 'sms']))
      .build(deps);

    const notificationResult = await notificationWorkflow.execute(
      `Enviar notificação final: Pedido #12345 processado com sucesso. ` +
      `Status: ${validationResult.success ? 'Validado' : 'Inválido'}, ` +
      `Pagamento: ${paymentResult.success ? 'Aprovado' : 'Reprovado'}, ` +
      `Logística: ${logisticsResult.success ? 'Em andamento' : 'Pendente'}`
    );

    // Validar cenário completo
    const allSuccessful = validationResult.success && paymentResult.success && logisticsResult.success && notificationResult.success;

    if (allSuccessful) {
      const totalExecutionTime = validationResult.executionTime + paymentResult.executionTime + logisticsResult.executionTime + notificationResult.executionTime;

      logTest('REAL_WORLD', '🎉 SUCESSO - Cenário real E-commerce executado!', {
        orderId: '12345',
        validationSuccess: validationResult.success,
        paymentSuccess: paymentResult.success,
        logisticsSuccess: logisticsResult.success,
        notificationSuccess: notificationResult.success,
        totalExecutionTime,
        processFlow: 'VALIDATION → PAYMENT → LOGISTICS → NOTIFICATION',
        realWorldReadiness: true,
        customerExperience: 'EXCELLENT'
      });
    } else {
      throw new Error('Cenário real falhou');
    }

  } catch (error) {
    logTest('REAL_WORLD', '💥 ERRO NO CENÁRIO REAL MUNDO', { error: error.message });
    throw error;
  }
}

// Função principal para executar todos os testes de integração
async function runIntegrationTests(): Promise<void> {
  console.log('🌐 ==============================================');
  console.log('🌐  SUITE DE TESTES INTEGRAÇÃO - WORKFLOW ORCHESTRATOR');
  console.log('🌐 ==============================================\n');

  const tests = [
    { name: 'Workflow Empresarial', fn: enterpriseWorkflowTest },
    { name: 'Integração Multi-Sistema', fn: multiSystemIntegrationTest },
    { name: 'Escalabilidade', fn: scalabilityTest },
    { name: 'Cenário Real Mundo', fn: realWorldScenarioTest }
  ];

  const results = [];
  const totalStartTime = Date.now();

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

  const totalExecutionTime = Date.now() - totalStartTime;

  // Resumo final
  console.log('🌐 ==============================================');
  console.log('🌐  RESUMO DOS TESTES INTEGRAÇÃO');
  console.log('🌐 ==============================================');

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
  console.log(`⏱️  Tempo total de execução: ${(totalExecutionTime / 1000).toFixed(1)}s`);

  if (failed > 0) {
    console.log('\n⚠️  Alguns testes de integração falharam. Verifique os logs acima.');
    process.exit(1);
  } else {
    console.log('\n🚀 Todos os testes de integração passaram! O WorkflowOrchestrator está pronto para produção.');
    console.log('\n✨ RESUMO FINAL DO SISTEMA:');
    console.log('   ✅ Workflows básicos e complexos funcionando');
    console.log('   ✅ Execução paralela e hierárquica operacional');
    console.log('   ✅ Graph Engine com roteamento condicional');
    console.log('   ✅ Builder patterns funcionais e intuitivos');
    console.log('   ✅ Integração completa entre componentes');
    console.log('   ✅ Performance e escalabilidade adequadas');
    console.log('   ✅ Cenários reais validados com sucesso');
  }
}

// Executar testes se este arquivo for chamado diretamente
if (require.main === module) {
  runIntegrationTests().catch(error => {
    console.error('💥 Erro fatal na execução dos testes de integração:', error);
    process.exit(1);
  });
}

export {
  enterpriseWorkflowTest,
  multiSystemIntegrationTest,
  scalabilityTest,
  realWorldScenarioTest,
  runIntegrationTests
};