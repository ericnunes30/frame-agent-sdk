// tests/integration/agents/agent-workflow.integration.test.ts
import { AgentRegistry } from '../../../src/agents';
import { WorkflowBuilder } from '../../../src/orchestrators/workflows';
import { AgentStep } from '../../../src/orchestrators/workflows/steps/AgentStep';

/**
 * Teste de integração para verificar a integração completa entre
 * AgentRegistry, AgentStep e WorkflowBuilder
 */

describe('Agent Workflow Integration', () => {
  let workflow: WorkflowBuilder;

  beforeEach(() => {
    // Limpar registro antes de cada teste
    AgentRegistry.getInstance().clear();
  });

  afterEach(() => {
    // Limpar após cada teste
    AgentRegistry.getInstance().clear();
  });

  describe('Integração Básica', () => {
    test('deve integrar agente registrado com workflow', async () => {
      // 1. Registrar agente
      AgentRegistry.getInstance().register('test-assistant', {
        type: 'chat',
        provider: 'openai',
        model: 'gpt-4o-mini',
        agentInfo: {
          name: 'Test Assistant',
          goal: 'Help with testing',
          backstory: 'A helpful testing assistant'
        }
      });

      // 2. Criar workflow com agente
      workflow = WorkflowBuilder.create()
        .addAgentStep('greeting', 'test-assistant', {
          additionalInstructions: 'Greet the user and offer help'
        });

      // 3. Executar workflow
      const result = await workflow.execute({
        state: {
          userMessage: 'Hello, I need help with testing'
        }
      });

      // 4. Verificar resultado
      expect(result.success).toBe(true);
      expect(result.state.greeting).toBeDefined();
      expect(result.state.greeting.content).toBeDefined();
    });

    test('deve integrar múltiplos agentes em sequência', async () => {
      // Registrar múltiplos agentes
      AgentRegistry.getInstance().register('analyzer', {
        type: 'chat',
        provider: 'openai',
        model: 'gpt-4o-mini',
        agentInfo: {
          name: 'Data Analyzer',
          goal: 'Analyze data and extract insights'
        }
      });

      AgentRegistry.getInstance().register('reporter', {
        type: 'chat',
        provider: 'openai',
        model: 'gpt-4o-mini',
        agentInfo: {
          name: 'Report Writer',
          goal: 'Create clear and concise reports'
        }
      });

      // Criar workflow com múltiplos agentes
      workflow = WorkflowBuilder.create()
        .addAgentStep('analyze', 'analyzer', {
          additionalInstructions: 'Analyze the provided data and identify key insights'
        })
        .addSyncStep('process', (context) => {
          const analysis = context.state.analyze;
          return {
            processed: {
              insights: analysis.content,
              timestamp: new Date().toISOString()
            }
          };
        }, ['analyze'])
        .addAgentStep('report', 'reporter', {
          additionalInstructions: 'Create a summary report based on the analysis',
          dependsOn: ['process']
        });

      // Executar workflow
      const result = await workflow.execute({
        state: {
          inputData: {
            sales: [100, 150, 200],
            customers: 50,
            period: 'Q1 2024'
          },
          userMessage: 'Analyze this sales data and create a report'
        }
      });

      // Verificar resultados
      expect(result.success).toBe(true);
      expect(result.state.analyze).toBeDefined();
      expect(result.state.process).toBeDefined();
      expect(result.state.report).toBeDefined();
      expect(result.state.report.content).toBeDefined();
    });
  });

  describe('Integração com AgentStep Inline', () => {
    test('deve criar e usar agente inline no workflow', async () => {
      // Criar workflow com agente inline
      workflow = WorkflowBuilder.create()
        .addAgentStep('inline-agent', {
          type: 'chat',
          provider: 'openai',
          model: 'gpt-4o-mini',
          agentInfo: {
            name: 'Inline Assistant',
            goal: 'Help with inline configuration'
          }
        }, {
          additionalInstructions: 'Respond as an inline configured agent'
        });

      // Executar workflow
      const result = await workflow.execute({
        state: {
          userMessage: 'Hello from inline agent'
        }
      });

      // Verificar resultado
      expect(result.success).toBe(true);
      expect(result.state['inline-agent']).toBeDefined();
      expect(result.state['inline-agent'].content).toBeDefined();
    });
  });

  describe('Integração com Extração de Dados', () => {
    test('deve extrair dados específicos do resultado do agente', async () => {
      // Registrar agente
      AgentRegistry.getInstance().register('data-extractor', {
        type: 'chat',
        provider: 'openai',
        model: 'gpt-4o-mini',
        agentInfo: {
          name: 'Data Extractor',
          goal: 'Extract structured data'
        }
      });

      // Criar workflow com extração de dados
      workflow = WorkflowBuilder.create()
        .addAgentStep('extract', 'data-extractor', {
          additionalInstructions: 'Extract key information and structure it',
          extractData: [
            'summary',
            { key: 'keyPoints', path: 'content.keyPoints' },
            { key: 'confidence', path: 'metadata.confidence', contextKey: 'result.confidence' }
          ]
        });

      // Executar workflow
      const result = await workflow.execute({
        state: {
          userMessage: 'Extract key information from this text'
        }
      });

      // Verificar extração de dados
      expect(result.state['extract.summary']).toBeDefined();
      expect(result.state['extract.keyPoints']).toBeDefined();
      expect(result.state['result.confidence']).toBeDefined();
    });
  });

  describe('Integração com Dependências', () => {
    test('deve usar resultados de steps anteriores com agentes', async () => {
      // Registrar agentes
      AgentRegistry.register('classifier', {
        type: 'chat',
        provider: 'openai',
        model: 'gpt-4o-mini',
        agentInfo: {
          name: 'Classifier',
          goal: 'Classify and categorize information'
        }
      });

      AgentRegistry.register('responder', {
        type: 'chat',
        provider: 'openai',
        model: 'gpt-4o-mini',
        agentInfo: {
          name: 'Responder',
          goal: 'Generate appropriate responses'
        }
      });

      // Criar workflow com dependências
      workflow = WorkflowBuilder.create()
        .addAgentStep('classify', 'classifier', {
          additionalInstructions: 'Classify the input by category and urgency'
        })
        .addAgentStep('respond', 'responder', {
          additionalInstructions: 'Generate a response based on the classification',
          dependsOn: ['classify'],
          usePreviousResults: true
        });

      // Executar workflow
      const result = await workflow.execute({
        state: {
          userMessage: 'I have a technical problem with my software'
        }
      });

      // Verificar que ambos os agentes foram executados
      expect(result.state.classify).toBeDefined();
      expect(result.state.respond).toBeDefined();
      expect(result.state.respond.content).toBeDefined();
    });
  });

  describe('Integração com Tratamento de Erros', () => {
    test('deve lidar com agente não registrado', async () => {
      // Criar workflow com agente não registrado
      workflow = WorkflowBuilder.create()
        .addAgentStep('unknown', 'non-existent-agent');

      // Executar workflow
      const result = await workflow.execute({
        state: {
          userMessage: 'Test message'
        }
      });

      // Verificar que o workflow falhou mas não crashou
      expect(result.success).toBe(false);
      expect(result.state['unknown']).toBeDefined();
      expect(result.state['unknown'].success).toBe(false);
    });

    test('deve lidar com timeout de agente', async () => {
      // Registrar agente
      AgentRegistry.register('slow-agent', {
        type: 'chat',
        provider: 'openai',
        model: 'gpt-4o-mini',
        agentInfo: {
          name: 'Slow Agent',
          goal: 'Process slowly'
        }
      });

      // Criar workflow com timeout curto
      workflow = WorkflowBuilder.create()
        .addAgentStep('slow', 'slow-agent', {
          additionalInstructions: 'Process this request',
          timeout: 100 // 100ms - muito curto para LLM real
        });

      // Executar workflow
      const result = await workflow.execute({
        state: {
          userMessage: 'Process this slowly'
        }
      });

      // Verificar que timeout foi tratado
      expect(result.state['slow']).toBeDefined();
      // O resultado pode variar dependendo do ambiente de teste
    });
  });

  describe('Integração com Workflow Complexo', () => {
    test('deve executar workflow complexo com múltiplos agentes e steps', async () => {
      // Registrar vários agentes especializados
      AgentRegistry.register('researcher', {
        type: 'react',
        provider: 'openai',
        model: 'gpt-4o-mini',
        agentInfo: {
          name: 'Researcher',
          goal: 'Research and gather information'
        },
        tools: ['search']
      });

      AgentRegistry.register('analyst', {
        type: 'chat',
        provider: 'openai',
        model: 'gpt-4o-mini',
        agentInfo: {
          name: 'Analyst',
          goal: 'Analyze data and extract insights'
        }
      });

      AgentRegistry.register('writer', {
        type: 'chat',
        provider: 'openai',
        model: 'gpt-4o-mini',
        agentInfo: {
          name: 'Writer',
          goal: 'Create well-written content'
        }
      });

      // Criar workflow complexo
      workflow = WorkflowBuilder.create()
        // Fase 1: Pesquisa
        .addAgentStep('research', 'researcher', {
          additionalInstructions: 'Research the topic thoroughly',
          tools: ['search'],
          extractData: ['findings', 'sources']
        })
        
        // Fase 2: Análise
        .addSyncStep('prepare_analysis', (context) => {
          const research = context.state.research;
          return {
            dataForAnalysis: {
              findings: research.findings || research.content,
              sources: research.sources || [],
              timestamp: new Date().toISOString()
            }
          };
        }, ['research'])
        
        .addAgentStep('analyze', 'analyst', {
          additionalInstructions: 'Analyze the research findings and identify key insights',
          dependsOn: ['prepare_analysis'],
          usePreviousResults: true,
          extractData: ['insights', 'conclusions']
        })
        
        // Fase 3: Escrita
        .addSyncStep('prepare_writing', (context) => {
          const analysis = context.state.analyze;
          return {
            writingContext: {
              insights: analysis.insights || analysis.content,
              conclusions: analysis.conclusions || [],
              targetAudience: 'technical audience',
              tone: 'professional'
            }
          };
        }, ['analyze'])
        
        .addAgentStep('write', 'writer', {
          additionalInstructions: 'Create a comprehensive report based on the analysis',
          dependsOn: ['prepare_writing'],
          usePreviousResults: true,
          temperature: 0.7
        })
        
        // Fase 4: Finalização
        .addSyncStep('finalize', (context) => {
          const research = context.state.research;
          const analysis = context.state.analyze;
          const writing = context.state.write;
          
          return {
            finalReport: {
              research: research.content,
              analysis: analysis.content,
              report: writing.content,
              completedAt: new Date().toISOString(),
              wordCount: writing.content?.split(' ').length || 0
            }
          };
        }, ['write']);

      // Executar workflow complexo
      const result = await workflow.execute({
        state: {
          topic: 'The impact of artificial intelligence on software development',
          userMessage: 'Create a comprehensive research report on AI in software development'
        }
      });

      // Verificar resultado completo
      expect(result.success).toBe(true);
      expect(result.state.research).toBeDefined();
      expect(result.state.analyze).toBeDefined();
      expect(result.state.write).toBeDefined();
      expect(result.state.finalize).toBeDefined();
      expect(result.state.finalize.finalReport).toBeDefined();
      expect(result.state.finalize.finalReport.report).toBeDefined();
    });
  });
});