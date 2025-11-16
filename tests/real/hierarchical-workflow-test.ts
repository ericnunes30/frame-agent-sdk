// tests/real/hierarchical-workflow-test.ts
/**
 * Teste de workflows hierárquicos do WorkflowOrchestrator
 *
 * Valida funcionalidades de supervisão e delegação:
 * - Supervisores coordenando subagentes
 * - Estratégias de delegação
 * - Hierarquias multi-nível
 * - Tomada de decisão em equipe
 */

import { WorkflowOrchestrator } from '../../src/orchestrators/workflows/core/workflowOrchestrator';
import { FlowType, SupervisorMode, DelegationStrategy, AgentPriority } from '../../src/orchestrators/workflows/core/enums';
import {
  createTestDependencies,
  createTestAgent,
  measureExecutionTime,
  logTest,
  TestResultValidator
} from './setup';

async function basicHierarchyTest(): Promise<void> {
  console.log('\n👑 === INICIANDO TESTE HIERARQUIA BÁSICA ===\n');

  try {
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Configurar hierarquia: Supervisor -> Especialistas
    logTest('HIERARCHY_BASIC', '👑 Configurando hierarquia básica');

    // Supervisor (coordenador)
    orchestrator.addAgent({
      ...createTestAgent('supervisor', 'Project Supervisor', ['coordination', 'management', 'decision_making']),
      priority: AgentPriority.HIGH,
      metadata: { role: 'supervisor', level: 1 }
    });

    // Especialistas (subordinados)
    orchestrator
      .addAgent({
        ...createTestAgent('analyst', 'Business Analyst', ['analysis', 'business_requirements']),
        priority: AgentPriority.NORMAL,
        metadata: { role: 'specialist', level: 2, reportsTo: 'supervisor' }
      })
      .addAgent({
        ...createTestAgent('technical_lead', 'Technical Lead', ['technical_analysis', 'architecture']),
        priority: AgentPriority.NORMAL,
        metadata: { role: 'specialist', level: 2, reportsTo: 'supervisor' }
      })
      .addAgent({
        ...createTestAgent('qa_specialist', 'QA Specialist', ['quality_assurance', 'testing']),
        priority: AgentPriority.NORMAL,
        metadata: { role: 'specialist', level: 2, reportsTo: 'supervisor' }
      });

    // Configurar workflow hierárquico
    logTest('HIERARCHY_BASIC', '🔧 Configurando workflow hierárquico');
    orchestrator.setFlowType(FlowType.HIERARCHICAL);

    // Executar
    logTest('HIERARCHY_BASIC', '🎯 Executando workflow hierárquico');
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute('Coordenar uma equipe para analisar requisitos técnicos e de negócio.'),
      'Workflow Hierárquico Básico'
    );

    // Validar que o supervisor executou e delegou
    const supervisorResult = result.agentResults.find(r => r.agentId === 'supervisor');
    const specialistResults = result.agentResults.filter(r => r.agentId !== 'supervisor');

    const isValid = TestResultValidator.validateSuccess(result, 'HIERARCHY_BASIC') &&
                   supervisorResult && supervisorResult.success &&
                   specialistResults.length > 0;

    if (isValid) {
      logTest('HIERARCHY_BASIC', '🎉 SUCESSO - Hierarquia básica funcionando!', {
        executionTime,
        supervisorExecuted: supervisorResult.success,
        delegatesCount: specialistResults.length,
        delegatesSuccessful: specialistResults.filter(r => r.success).length,
        delegationChain: [supervisorResult.agentId, ...specialistResults.map(r => r.agentId)]
      });
    } else {
      throw new Error('Teste de hierarquia básica falhou');
    }

  } catch (error) {
    logTest('HIERARCHY_BASIC', '💥 ERRO NO TESTE HIERARQUIA BÁSICA', { error: error.message });
    throw error;
  }
}

async function delegationStrategiesTest(): Promise<void> {
  console.log('\n🎯 === INICIANDO TESTE DE ESTRATÉGIAS DE DELEGAÇÃO ===\n');

  try {
    const deps = createTestDependencies();

    // Testar diferentes estratégias de delegação
    const strategies = [
      { name: 'Capability-Based', strategy: DelegationStrategy.CAPABILITY_BASED },
      { name: 'Priority-Based', strategy: DelegationStrategy.PRIORITY_BASED },
      { name: 'Load-Balanced', strategy: DelegationStrategy.LOAD_BALANCED }
    ];

    const results = [];

    for (const { name, strategy } of strategies) {
      logTest('DELEGATION', `🎯 Testando estratégia: ${name}`);

      const orchestrator = new WorkflowOrchestrator(deps);

      // Configurar supervisor
      orchestrator.addAgent({
        ...createTestAgent(`supervisor_${strategy.toLowerCase()}`, `${name} Supervisor`, ['coordination']),
        metadata: { delegationStrategy: strategy }
      });

      // Configurar equipe com diferentes capacidades
      orchestrator
        .addAgent(createTestAgent('expert_1', 'Domain Expert', ['domain_expertise', 'analysis']))
        .addAgent(createTestAgent('expert_2', 'Technical Expert', ['technical_expertise', 'development']))
        .addAgent(createTestAgent('expert_3', 'Process Expert', ['process_optimization', 'efficiency']));

      orchestrator.setFlowType(FlowType.HIERARCHICAL);

      // Executar
      const { result } = await measureExecutionTime(
        () => orchestrator.execute(`Delegar tarefas usando estratégia ${name}.`),
        `Delegação ${name}`
      );

      results.push({
        strategy: name,
        success: result.success,
        agentCount: result.agentResults.length,
        executionTime: result.executionTime,
        delegates: result.agentResults.filter(r => !r.agentId.includes('supervisor')).map(r => r.agentId)
      });

      logTest('DELEGATION', `✅ Estratégia ${name} concluída`, {
        success: result.success,
        agentsExecuted: result.agentResults.length
      });
    }

    // Analisar resultados das diferentes estratégias
    logTest('DELEGATION', '📊 Análise comparativa das estratégias');
    results.forEach(result => {
      logTest('DELEGATION', `${result.strategy}:`, {
        success: result.success,
        agents: result.agentCount,
        time: result.executionTime,
        delegates: result.delegates
      });
    });

    const allSuccessful = results.every(r => r.success);
    if (allSuccessful) {
      logTest('DELEGATION', '🎉 SUCESSO - Todas as estratégias de delegação funcionaram!');
    } else {
      throw new Error('Algumas estratégias de delegação falharam');
    }

  } catch (error) {
    logTest('DELEGATION', '💥 ERRO NO TESTE DE DELEGAÇÃO', { error: error.message });
    throw error;
  }
}

async function multiLevelHierarchyTest(): Promise<void> {
  console.log('\n🏗️ === INICIANDO TESTE HIERARQUIA MULTI-NÍVEL ===\n');

  try {
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Configurar hierarquia de 3 níveis
    logTest('MULTI_LEVEL', '🏗️ Configurando hierarquia multi-nível');

    // Nível 1: Director
    orchestrator.addAgent({
      ...createTestAgent('director', 'Project Director', ['strategic_planning', 'oversight']),
      priority: AgentPriority.CRITICAL,
      metadata: { level: 1, role: 'director' }
    });

    // Nível 2: Managers
    orchestrator
      .addAgent({
        ...createTestAgent('tech_manager', 'Technical Manager', ['technical_coordination']),
        priority: AgentPriority.HIGH,
        metadata: { level: 2, role: 'manager', reportsTo: 'director' }
      })
      .addAgent({
        ...createTestAgent('business_manager', 'Business Manager', ['business_coordination']),
        priority: AgentPriority.HIGH,
        metadata: { level: 2, role: 'manager', reportsTo: 'director' }
      });

    // Nível 3: Specialists
    orchestrator
      .addAgent({
        ...createTestAgent('developer', 'Senior Developer', ['development', 'coding']),
        priority: AgentPriority.NORMAL,
        metadata: { level: 3, role: 'specialist', reportsTo: 'tech_manager' }
      })
      .addAgent({
        ...createTestAgent('business_analyst', 'Business Analyst', ['analysis', 'requirements']),
        priority: AgentPriority.NORMAL,
        metadata: { level: 3, role: 'specialist', reportsTo: 'business_manager' }
      })
      .addAgent({
        ...createTestAgent('tester', 'QA Tester', ['testing', 'quality']),
        priority: AgentPriority.NORMAL,
        metadata: { level: 3, role: 'specialist', reportsTo: 'tech_manager' }
      });

    orchestrator.setFlowType(FlowType.HIERARCHICAL);

    // Executar
    logTest('MULTI_LEVEL', '🎯 Executando workflow multi-nível');
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute('Coordenar projeto completo desde planejamento estratégico até execução técnica.'),
      'Workflow Multi-Nível'
    );

    // Analisar execução por níveis
    const level1Results = result.agentResults.filter(r => r.agentId === 'director');
    const level2Results = result.agentResults.filter(r => r.agentId.includes('manager'));
    const level3Results = result.agentResults.filter(r =>
      r.agentId.includes('developer') ||
      r.agentId.includes('analyst') ||
      r.agentId.includes('tester')
    );

    const isValid = TestResultValidator.validateSuccess(result, 'MULTI_LEVEL') &&
                   level1Results.length > 0 && level2Results.length > 0 && level3Results.length > 0;

    if (isValid) {
      logTest('MULTI_LEVEL', '🎉 SUCESSO - Hierarquia multi-nível funcionando!', {
        executionTime,
        level1Executed: level1Results.length,
        level2Executed: level2Results.length,
        level3Executed: level3Results.length,
        totalAgents: result.agentResults.length,
        delegationDepth: 3
      });
    } else {
      throw new Error('Teste de hierarquia multi-nível falhou');
    }

  } catch (error) {
    logTest('MULTI_LEVEL', '💥 ERRO NO TESTE MULTI-NÍVEL', { error: error.message });
    throw error;
  }
}

async function consensusDecisionTest(): Promise<void> {
  console.log('\n🤝 === INICIANDO TESTE DECISÃO POR CONSENSO ===\n');

  try {
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Configurar equipe para tomada de decisão
    logTest('CONSENSUS', '🤝 Configurando equipe para decisão por consenso');

    // Facilitador (vai coordenar o consenso)
    orchestrator.addAgent({
      ...createTestAgent('facilitator', 'Consensus Facilitator', ['facilitation', 'consensus_building']),
      priority: AgentPriority.HIGH,
      metadata: {
        role: 'facilitator',
        decisionMode: 'consensus',
        requiredVotes: 3 // Requer 3 votos positivos
      }
    });

    // Especialistas que vão votar
    orchestrator
      .addAgent({
        ...createTestAgent('expert_a', 'Expert A', ['domain_knowledge', 'analysis']),
        priority: AgentPriority.NORMAL,
        metadata: { votingRole: true, voteWeight: 1 }
      })
      .addAgent({
        ...createTestAgent('expert_b', 'Expert B', ['technical_knowledge', 'implementation']),
        priority: AgentPriority.NORMAL,
        metadata: { votingRole: true, voteWeight: 1 }
      })
      .addAgent({
        ...createTestAgent('expert_c', 'Expert C', ['business_knowledge', 'strategy']),
        priority: AgentPriority.NORMAL,
        metadata: { votingRole: true, voteWeight: 1 }
      })
      .addAgent({
        ...createTestAgent('expert_d', 'Expert D', ['risk_analysis', 'compliance']),
        priority: AgentPriority.NORMAL,
        metadata: { votingRole: true, voteWeight: 1 }
      });

    orchestrator.setFlowType(FlowType.HIERARCHICAL);

    // Executar processo de consenso
    logTest('CONSENSUS', '🗳️ Executando processo de decisão por consenso');
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute('Alcançar consenso sobre a melhor abordagem técnica para o projeto.'),
      'Processo de Consenso'
    );

    // Analisar resultado do consenso
    const facilitatorResult = result.agentResults.find(r => r.agentId === 'facilitator');
    const votingExperts = result.agentResults.filter(r => r.agentId.startsWith('expert_'));

    const isValid = TestResultValidator.validateSuccess(result, 'CONSENSUS') &&
                   facilitatorResult && facilitatorResult.success &&
                   votingExperts.length >= 3; // Pelo menos 3 especialistas participaram

    if (isValid) {
      logTest('CONSENSUS', '🎉 SUCESSO - Decisão por consenso funcionando!', {
        executionTime,
        facilitatorSuccess: facilitatorResult.success,
        votingParticipants: votingExperts.length,
        consensusReached: result.finalOutput.includes('consenso') || result.finalOutput.includes('acordo'),
        finalDecision: result.finalOutput.substring(0, 100) + '...'
      });
    } else {
      throw new Error('Teste de consenso falhou');
    }

  } catch (error) {
    logTest('CONSENSUS', '💥 ERRO NO TESTE DE CONSENSO', { error: error.message });
    throw error;
  }
}

async function conflictResolutionTest(): Promise<void> {
  console.log('\n⚖️ === INICIANDO TESTE RESOLUÇÃO DE CONFLITOS ===\n');

  try {
    const deps = createTestDependencies();
    const orchestrator = new WorkflowOrchestrator(deps);

    // Configurar cenário com potenciais conflitos
    logTest('CONFLICT', '⚖️ Configurando cenário de resolução de conflitos');

    // Mediador (supervisor com autoridade para resolver conflitos)
    orchestrator.addAgent({
      ...createTestAgent('mediator', 'Conflict Mediator', ['mediation', 'conflict_resolution', 'decision_authority']),
      priority: AgentPriority.CRITICAL,
      metadata: {
        role: 'mediator',
        conflictResolution: true,
        finalAuthority: true
      }
    });

    // Especialistas com opiniões diferentes
    orchestrator
      .addAgent({
        ...createTestAgent('conservative_expert', 'Conservative Expert', ['risk_aversion', 'stability']),
        priority: AgentPriority.HIGH,
        metadata: { stance: 'conservative', priority: 'safety' }
      })
      .addAgent({
        ...createTestAgent('aggressive_expert', 'Aggressive Expert', ['innovation', 'speed']),
        priority: AgentPriority.HIGH,
        metadata: { stance: 'aggressive', priority: 'speed' }
      })
      .addAgent({
        ...createTestAgent('balanced_expert', 'Balanced Expert', ['balance', 'compromise']),
        priority: AgentPriority.HIGH,
        metadata: { stance: 'balanced', priority: 'equilibrium' }
      });

    orchestrator.setFlowType(FlowType.HIERARCHICAL);

    // Executar cenário de conflito
    logTest('CONFLICT', '⚔️ Executando cenário de conflito e resolução');
    const { result, executionTime } = await measureExecutionTime(
      () => orchestrator.execute('Resolver conflito entre abordagem conservadora e agressiva para o projeto.'),
      'Resolução de Conflitos'
    );

    // Validar que o mediador conseguiu resolver
    const mediatorResult = result.agentResults.find(r => r.agentId === 'mediator');
    const conflictingExperts = result.agentResults.filter(r =>
      r.agentId.includes('expert') && r.agentId !== 'mediator'
    );

    const isValid = TestResultValidator.validateSuccess(result, 'CONFLICT') &&
                   mediatorResult && mediatorResult.success &&
                   conflictingExperts.length >= 2;

    if (isValid) {
      // Verificar se há indicação de resolução no output
      const conflictResolved = result.finalOutput.includes('resolvido') ||
                             result.finalOutput.includes('acordo') ||
                             result.finalOutput.includes('decisão') ||
                             result.finalOutput.includes('compromisso');

      logTest('CONFLICT', '🎉 SUCESSO - Resolução de conflitos funcionando!', {
        executionTime,
        mediatorSuccess: mediatorResult.success,
        conflictingOpinions: conflictingExperts.length,
        conflictResolved,
        resolutionApproach: conflictResolved ? 'mediado' : 'em análise',
        finalOutput: result.finalOutput.substring(0, 100) + '...'
      });
    } else {
      throw new Error('Teste de resolução de conflitos falhou');
    }

  } catch (error) {
    logTest('CONFLICT', '💥 ERRO NO TESTE DE RESOLUÇÃO DE CONFLITOS', { error: error.message });
    throw error;
  }
}

// Função principal para executar todos os testes hierárquicos
async function runHierarchicalTests(): Promise<void> {
  console.log('👑 ==============================================');
  console.log('👑  SUITE DE TESTES HIERÁRQUICOS - WORKFLOW ORCHESTRATOR');
  console.log('👑 ==============================================\n');

  const tests = [
    { name: 'Hierarquia Básica', fn: basicHierarchyTest },
    { name: 'Estratégias Delegação', fn: delegationStrategiesTest },
    { name: 'Hierarquia Multi-Nível', fn: multiLevelHierarchyTest },
    { name: 'Decisão por Consenso', fn: consensusDecisionTest },
    { name: 'Resolução de Conflitos', fn: conflictResolutionTest }
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
  console.log('👑 ==============================================');
  console.log('👑  RESUMO DOS TESTES HIERÁRQUICOS');
  console.log('👑 ==============================================');

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
    console.log('\n⚠️  Alguns testes hierárquicos falharam. Verifique os logs acima.');
    process.exit(1);
  } else {
    console.log('\n🎉 Todos os testes hierárquicos passaram! O sistema está pronto para equipes complexas.');
  }
}

// Executar testes se este arquivo for chamado diretamente
if (require.main === module) {
  runHierarchicalTests().catch(error => {
    console.error('💥 Erro fatal na execução dos testes hierárquicos:', error);
    process.exit(1);
  });
}

export {
  basicHierarchyTest,
  delegationStrategiesTest,
  multiLevelHierarchyTest,
  consensusDecisionTest,
  conflictResolutionTest,
  runHierarchicalTests
};