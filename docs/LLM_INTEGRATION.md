# Integração Direta de LLM no AgentStep

## Visão Geral

Esta documentação explica como utilizar a nova funcionalidade de integração direta de LLM no AgentStep, permitindo criar workflows que fazem chamadas diretas a modelos de linguagem sem a necessidade de agentes registrados.

## Motivação

Anteriormente, o AgentStep dependia exclusivamente de agentes registrados no AgentRegistry. Com esta nova integração, desenvolvedores podem criar workflows com chamadas LLM diretas, proporcionando:

1. **Simplicidade**: Criação de workflows com chamadas LLM diretas
2. **Flexibilidade**: Configuração de diferentes modelos por step
3. **Compatibilidade**: Manutenção do suporte a agentes registrados existentes

## Como Usar

### Configuração Direta com LLM

```typescript
import { WorkflowBuilder } from '../src/orchestrators/workflows';

const workflow = WorkflowBuilder.create()
  .addAgentStep('llm-call', {
    name: 'DataAnalyzer',
    goal: 'Analyze provided data and extract insights',
    backstory: 'Expert data analyst with statistical knowledge'
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

### Uso com Agente Registrado (Compatibilidade)

```typescript
import { WorkflowBuilder } from '../src/orchestrators/workflows';

const workflow = WorkflowBuilder.create()
  .addAgentStep('registered-agent', 'data-analyst-agent', {
    additionalInstructions: 'Focus on financial metrics'
  });
```

## Arquitetura

### Componentes Principais

1. **LLMConfig**: Interface para configuração direta do LLM
2. **LLMBasedAgentAdapter**: Classe que adapta chamadas LLM diretas para a interface IAgent
3. **AgentStep**: Step modificado para suportar ambas as abordagens

### Fluxo de Execução

```
WorkflowBuilder → AgentStep → (LLM | AgentRegistry) → (invoke() | execute())
```

## Configurações Disponíveis

### LLMConfig

```typescript
interface LLMConfig {
  model: string;           // Modelo completo (ex.: 'openaiCompatible-gpt-4o-mini')
  apiKey: string;          // Chave do provedor
  baseUrl?: string;        // URL base para provedores compatíveis
  defaults?: {             // Valores padrão
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
}
```

### ProviderOptions

```typescript
providerOptions?: {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stream?: boolean;
}
```

## Exemplos Práticos

### Exemplo 1: Análise de Dados Simples

```typescript
const workflow = WorkflowBuilder.create()
  .addAgentStep('data-analysis', {
    name: 'DataScientist',
    goal: 'Analyze the provided dataset and identify patterns',
    backstory: 'Experienced data scientist specializing in pattern recognition'
  }, {
    llmConfig: {
      model: 'openaiCompatible-gpt-4o-mini',
      apiKey: process.env.OPENAI_API_KEY!,
      defaults: {
        temperature: 0.1,  // Baixa temperatura para análise factual
        maxTokens: 2000
      }
    }
  });
```

### Exemplo 2: Workflow com Múltiplos Steps

```typescript
const workflow = WorkflowBuilder.create()
  .addAgentStep('research', {
    name: 'Researcher',
    goal: 'Research the topic and gather relevant information',
    backstory: 'Thorough researcher with access to vast knowledge'
  }, {
    llmConfig: {
      model: 'openaiCompatible-gpt-4o',
      apiKey: process.env.OPENAI_API_KEY!,
      defaults: {
        temperature: 0.7,
        maxTokens: 1500
      }
    }
  })
  .addAgentStep('writer', {
    name: 'TechnicalWriter',
    goal: 'Create a well-structured report based on the research',
    backstory: 'Professional technical writer with excellent communication skills'
  }, {
    llmConfig: {
      model: 'openaiCompatible-gpt-4o-mini',
      apiKey: process.env.OPENAI_API_KEY!,
      defaults: {
        temperature: 0.3,
        maxTokens: 3000
      }
    },
    dependsOn: ['research']
  });
```

## Considerações de Implementação

### Compatibilidade com Versões Anteriores

- **Zero breaking changes**: Todos os workflows existentes continuam funcionando
- **API mantida**: A interface pública do AgentStep permanece a mesma
- **Registro de agentes**: Continua funcionando exatamente como antes

### Tratamento de Erros

A implementação inclui tratamento adequado de erros para:

1. Configurações de LLM inválidas
2. Falhas na chamada ao LLM
3. Problemas de autenticação
4. Limites de rate e quota

### Performance

- Criação de instâncias de LLM apenas quando necessário
- Reutilização de conexões e recursos quando possível
- Latência mínima nas chamadas

## Testes

A funcionalidade foi testada para garantir:

1. **Criação correta de AgentStep com configuração LLM**
2. **Execução de chamadas LLM diretas**
3. **Tratamento adequado de erros**
4. **Compatibilidade com agentes registrados existentes**
5. **Integração completa com o WorkflowBuilder**

## Próximos Passos

1. Adicionar suporte a streaming para chamadas LLM diretas
2. Implementar cache de respostas para melhorar performance
3. Adicionar métricas e monitoramento detalhado
4. Expandir suporte a diferentes provedores de LLM