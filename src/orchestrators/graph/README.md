# Graph Engine

O Graph Engine é um orquestrador de fluxos de trabalho baseado em grafos que permite criar fluxos complexos com nós e arestas condicionais.

## Funcionalidades

- **Nós personalizáveis**: Criação de nós para diferentes tipos de tarefas
- **Arestas condicionais**: Roteamento baseado em condições dinâmicas
- **Execução paralela**: Processamento eficiente de tarefas independentes
- **Detecção de ciclos**: Garantia de grafos acíclicos direcionados (DAGs)
- **Integração LLM**: Suporte nativo para modelos de linguagem

## Configuração do LLM

A partir da versão 1.2.0, o Graph Engine suporta duas formas de configurar o LLM:

### 1. Usando LLMConfig (Recomendado)

```typescript
import { GraphBuilder, createAgentNode } from './orchestrators/graph';
import type { LLMConfig } from './orchestrators/graph/interfaces/llmConfig.interface';

// Configuração do LLM
const llmConfig: LLMConfig = {
  model: 'openai-gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY,
  baseUrl: process.env.OPENAI_BASE_URL,
  defaults: {
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 150
  }
};

// O Graph Engine cria a instância LLM internamente
const agentNode = createAgentNode({
  llm: llmConfig,
  mode: 'react',
  agentInfo: {
    name: 'MyAgent',
    goal: 'Resolver tarefas do usuário',
    backstory: 'Agente especializado em resolver problemas'
  }
});
```

### 2. Usando instância LLM existente (Compatibilidade retroativa)

```typescript
import { LLM } from './llm';
import { createAgentNode } from './orchestrators/graph';

// Criar instância LLM manualmente
const llm = new LLM({
  model: 'openai-gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY
});

// O Graph Engine aceita instâncias LLM existentes
const agentNode = createAgentNode({
  llm: llm,
  mode: 'react',
  agentInfo: {
    name: 'MyAgent',
    goal: 'Resolver tarefas do usuário',
    backstory: 'Agente especializado em resolver problemas'
  }
});
```

## Vantagens da nova abordagem

1. **Separação de responsabilidades**: O Graph Engine gerencia a criação do LLM
2. **Configuração centralizada**: Todas as configurações em um único objeto
3. **Compatibilidade retroativa**: Código existente continua funcionando
4. **Manutenibilidade**: Mudanças na criação do LLM afetam apenas o módulo graph

## Exemplos

### Exemplo 1: Usando LLMConfig (Recomendado)

```bash
npx ts-node examples/graphWithLlmConfig.ts
```

**Saída esperada:**
```
🚀 Graph Engine com LLMConfig - Exemplo de Execução Real

✅ Configuração LLM criada: { model: 'openai-gpt-4o-mini' }
✅ Graph Engine construído com sucesso

=== Executando Graph Engine ===
Pergunta: Qual é a capital da França?

=== Resultado da Execução ===
Graph status: FINISHED
Messages: [
  { role: 'user', content: 'Qual é a capital da França?' },
  { role: 'assistant', content: 'A capital da França é Paris.' }
]
Data: {}
```

**Características:**
- ✅ Usa `LLMConfig` (nova funcionalidade)
- ✅ Execução real do Graph Engine
- ✅ Mostra evolução do estado (`IGraphState`)
- ✅ Usa variáveis de ambiente para configuração
- ✅ Sem simulações - resultado real da API

### Exemplo 2: ReAct Pattern (Original)

```bash
npx ts-node examples/reactGraph.ts
```

Veja `examples/reactGraph.ts` para exemplo completo com ReAct pattern.

## Diferenças entre os Exemplos

| Característica | `graphWithLlmConfig.ts` | `reactGraph.ts` |
|----------------|------------------------|-----------------|
| **Uso de LLM** | `LLMConfig` (nova API) | Instância `LLM` (antiga) |
| **Execução** | Simples e direta | Complexa com tools |
| **Estado** | `IGraphState` real | `IGraphState` real |
| **Foco** | Demonstrar LLMConfig | Demonstrar ReAct pattern |
| **Simulações** | ❌ Nenhuma | ❌ Nenhuma |

## API

### GraphBuilder
Classe para construir grafos de forma programática.

### createAgentNode
Função para criar nós de agente com suporte a LLM.

### createToolExecutorNode
Função para criar nós de execução de ferramentas.

### createHumanInLoopNode
Função para criar nós de interação humana.

### createToolRouter
Função para criar roteadores condicionais baseados em ferramentas.