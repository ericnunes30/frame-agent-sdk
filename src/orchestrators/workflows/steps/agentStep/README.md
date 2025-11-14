# AgentStep - Nova Arquitetura

## Visão Geral

Esta pasta contém a nova implementação do sistema `AgentStep` com melhor separação de responsabilidades, mantendo compatibilidade total com a API existente.

## Estrutura

```
agentStep/
├── AgentLLMExecutor.ts       # Executa agentes LLM registrados
├── AgentLLMFactory.ts        # Cria/registra agentes LLM dinâmicos  
├── interfaces.ts             # Interfaces compartilhadas
├── index.ts                 # Exporta API pública
└── README.md                # Esta documentação
```

## Componentes

### AgentLLMExecutor
Responsável por executar agentes LLM registrados, seja eles pré-registrados ou criados dinamicamente.

### AgentLLMFactory
Responsável por criar e registrar agentes LLM dinâmicos no AgentRegistry.

### Interfaces
Define as interfaces e tipos compartilhados entre os componentes.

## Uso

### Com LLM Direto (Nova Abordagem)
```typescript
import { WorkflowBuilder } from '../../../src/orchestrators/workflows';

const workflow = WorkflowBuilder.create()
  .addAgentStep('llm-call', {
    name: 'DataAnalyzer',
    goal: 'Analyze provided data',
    backstory: 'Expert data analyst'
  }, {
    llmConfig: {
      model: 'openaiCompatible-gpt-4o-mini',
      apiKey: process.env.OPENAI_API_KEY!,
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
```

### Com Agente Registrado (Compatibilidade)
```typescript
import { WorkflowBuilder } from '../../../src/orchestrators/workflows';

const workflow = WorkflowBuilder.create()
  .addAgentStep('registered-agent', 'data-analyst-agent', {
    additionalInstructions: 'Focus on financial metrics'
  });
```

### Factory Function
```typescript
import { createAgentStep } from '../../../src/orchestrators/workflows/steps/agentStep';

const step = createAgentStep('step-id', agentConfig, options);
```

## Benefícios

1. **Separação de Responsabilidades**: Cada classe tem um propósito único
2. **Compatibilidade**: Mantém API existente inalterada
3. **Extensibilidade**: Base sólida para features futuras
4. **Consistência**: Todos os agentes passam pelo mesmo sistema de registro