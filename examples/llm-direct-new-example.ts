// examples/llm-direct-new-example.ts
import { WorkflowBuilder } from '../src/orchestrators/workflows';

/**
 * Exemplo de uso do novo AgentLLMExecutor com LLM direto
 * 
 * Este exemplo demonstra como criar um workflow que faz chamadas diretas
 * a modelos de linguagem usando a nova arquitetura.
 */

async function llmDirectNewExample() {
  console.log('=== Exemplo de LLM Direto com Nova Arquitetura ===\n');

  try {
    // Criar um workflow com AgentStep usando LLM direto (nova abordagem)
    WorkflowBuilder.create()
      .addAgentStep('llm-call', {
        name: 'DataAnalyzer',
        goal: 'Analyze provided data and extract insights',
        backstory: 'Expert data analyst with statistical knowledge'
      }, {
        llmConfig: {
          model: 'openaiCompatible-gpt-4o-mini',
          apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
          defaults: {
            temperature: 0.3,
            maxTokens: 1000
          }
        },
        providerOptions: {
          temperature: 0.3,
          maxTokens: 1000
        }
      });

    console.log('✅ Workflow criado com sucesso usando nova arquitetura LLM direto!');
    console.log('📊 Configuração:');
    console.log('   - Modelo: openaiCompatible-gpt-4o-mini');
    console.log('   - Temperatura: 0.3');
    console.log('   - Max Tokens: 1000');
    console.log('   - Agente: DataAnalyzer');
    
    // Nota: Não podemos executar o workflow aqui porque precisaríamos de uma chave de API real
    // e de mocks para os serviços dependentes, mas a criação do step funciona corretamente.
    
  } catch (error) {
    console.error('❌ Erro ao criar workflow:', error);
  }

  console.log('\n=== Exemplo de uso com agente registrado (compatibilidade) ===\n');

  try {
    // Criar um workflow com AgentStep usando agente registrado (para compatibilidade)
    WorkflowBuilder.create()
      .addAgentStep('registered-agent', 'data-analyst-agent', {
        additionalInstructions: 'Focus on financial metrics'
      });

    console.log('✅ Workflow criado com sucesso usando agente registrado!');
    console.log('📊 Configuração:');
    console.log('   - ID do Agente: data-analyst-agent');
    console.log('   - Instruções Adicionais: Focus on financial metrics');
    
  } catch (error) {
    console.error('❌ Erro ao criar workflow:', error);
  }

  console.log('\n=== Demonstração concluída ===');
}

// Executar exemplo se este arquivo for chamado diretamente
if (require.main === module) {
  llmDirectNewExample().catch(console.error);

  // Exemplo de uso da factory function
  console.log('\n=== Exemplo de uso da factory function ===\n');
  
  try {
    const { createAgentStep } = require('../src/orchestrators/workflows/steps/agentStep');
    
    const step = createAgentStep('factory-step', {
      name: 'FactoryAgent',
      goal: 'Test factory function',
      backstory: 'Agent created with factory function'
    }, {
      llmConfig: {
        model: 'openaiCompatible-gpt-4o-mini',
        apiKey: 'test-api-key',
        defaults: {
          temperature: 0.5
        }
      }
    });
    
    console.log('✅ Step criado com factory function:', step.id);
  } catch (error) {
    console.error('❌ Erro ao usar factory function:', error);
  }
}

export { llmDirectNewExample };