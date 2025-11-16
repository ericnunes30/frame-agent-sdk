# Frame Agent SDK - Core Modules

## Visão Geral

O Frame Agent SDK é uma biblioteca TypeScript para criar, gerenciar e executar agentes de IA com workflows complexos. O SDK fornece uma arquitetura modular que permite integração flexível com diferentes LLMs, ferramentas e padrões de execução.

## Arquitetura

```
src/
├── agents/           # Sistema de agentes e registro
├── llm/             # Abstração unificada para LLMs
├── memory/          # Gerenciamento de histórico e tokenização
├── orchestrators/   # Orquestração de workflows e steps
├── promptBuilder/   # Construção de prompts estruturados
├── providers/       # Integração com provedores de LLM
└── tools/           # Sistema de ferramentas para agentes
```

## Módulos Principais

### 🤖 [Agents](./agents/)
Sistema de registro e gerenciamento de agentes com suporte a modos chat e react.

**Principais recursos:**
- [`AgentRegistry`](./agents/registry/AgentRegistry.ts) - Registro centralizado de agentes
- [`IAgent`](./agents/interfaces/IAgent.ts) - Interface base para agentes customizados
- Integração com workflows via [`AgentStep`](./orchestrators/workflows/steps/AgentStep.ts)

**Exemplo rápido:**
```typescript
import { AgentRegistry } from './agents';

// Registrar agente customizado
AgentRegistry.getInstance().register('meu-agente', {
  type: 'react',
  provider: 'openai',
  model: 'gpt-4o-mini',
  agentInfo: {
    name: 'Meu Agente',
    goal: 'Analisar dados',
    backstory: 'Especialista em análise'
  }
});
```

### 🧠 [LLM](./llm/)
Abstração unificada para Large Language Models com suporte a múltiplos provedores.

**Principais recursos:**
- [`LLM`](./llm/llm.ts) - Classe principal para interação com LLMs
- Suporte a streaming e chamadas síncronas
- Retry automático e tratamento de erros
- Integração com ferramentas

**Exemplo rápido:**
```typescript
import { LLM } from './llm';

const llm = new LLM({
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY
});

const response = await llm.invoke({
  messages: [{ role: 'user', content: 'Olá!' }]
});
```

### 💾 [Memory](./memory/)
Sistema de gerenciamento de memória e histórico de conversas.

**Principais recursos:**
- [`ChatHistoryManager`](./memory/chatHistoryManager.ts) - Gerenciamento de histórico
- [`TokenizerService`](./memory/tokenizer.ts) - Controle de tokens
- Persistência e diferentes estratégias de armazenamento

**Exemplo rápido:**
```typescript
import { ChatHistoryManager } from './memory';

const history = new ChatHistoryManager({
  maxMessages: 100,
  maxTokens: 4000
});

await history.addMessage({
  role: 'user',
  content: 'Qual é a capital do Brasil?'
});
```

### 🔄 [Orchestrators](./orchestrators/)
Sistema de orquestração de workflows com steps sequenciais, paralelos e condicionais.

**Principais recursos:**
- [`WorkflowBuilder`](./orchestrators/workflows/builder/WorkflowBuilder.ts) - Builder pattern para workflows
- [`WorkflowEngine`](./orchestrators/workflows/core/WorkflowEngine.ts) - Motor de execução
- [`AgentStep`](./orchestrators/workflows/steps/AgentStep.ts) - Integração com agentes

**Exemplo rápido:**
```typescript
import { WorkflowBuilder } from './orchestrators/workflows';

const workflow = WorkflowBuilder.create()
  .addStep('validate', (context) => {
    return { valid: true };
  })
  .addAgentStep('process', 'meu-agente', {
    instructions: 'Processar os dados'
  })
  .build();

const result = await workflow.execute({ data: 'input' });
```

### 📝 [PromptBuilder](./promptBuilder/)
Sistema de construção de prompts com modos estruturados (chat, react).

**Principais recursos:**
- [`PromptBuilder`](./promptBuilder/promptBuilder.ts) - Construtor de prompts
- Modos chat e react para diferentes tipos de agentes
- Templates customizáveis e validação

**Exemplo rápido:**
```typescript
import { PromptBuilder } from './promptBuilder';

const prompt = PromptBuilder.build({
  mode: 'react',
  messages: [{ role: 'user', content: 'Resolva este problema' }],
  tools: [searchTool, calculatorTool],
  agentInfo: {
    name: 'Assistente',
    goal: 'Resolver problemas complexos'
  }
});
```

### 🔌 [Providers](./providers/)
Sistema de provedores para integração com diferentes LLMs.

**Principais recursos:**
- [`ProviderAdapter`](./providers/adapter/providerAdapter.ts) - Interface unificada
- [`OpenAIProvider`](./providers/providers/openAiProvider.ts) - Provedor OpenAI
- [`OpenAICompatibleProvider`](./providers/providers/openaiCompatibleProvider.ts) - Provedores compatíveis
- Suporte a streaming, retry e tratamento de erros

**Exemplo rápido:**
```typescript
import { ProviderAdapter } from './providers';

const provider = new ProviderAdapter({
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY
});

const response = await provider.invoke({
  messages: [{ role: 'user', content: 'Olá!' }]
});
```

### 🔧 [Tools](./tools/)
Sistema completo de ferramentas para LLMs e agentes.

**Principais recursos:**
- [`ToolBase`](./tools/constructor/toolBase.ts) - Classe base para ferramentas
- [`ToolExecutor`](./tools/core/toolExecutor.ts) - Executor de ferramentas
- [`ToolRegistry`](./tools/core/toolRegistry.ts) - Registro de ferramentas
- Ferramentas prontas: [`SearchTool`](./tools/tools/searchTool.ts), [`AskUserTool`](./tools/tools/askUserTool.ts), etc.

**Exemplo rápido:**
```typescript
import { ToolExecutor } from './tools/core';
import { SearchTool, CalculatorTool } from './tools';

const tools = [new SearchTool(), new CalculatorTool()];
const executor = new ToolExecutor(tools);

const result = await executor.execute('search', {
  query: 'população de Tóquio'
});
```

## Fluxo de Trabalho Típico

### 1. Configurar Provedor
```typescript
import { ProviderAdapter } from './providers';

const provider = new ProviderAdapter({
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY
});
```

### 2. Criar LLM
```typescript
import { LLM } from './llm';

const llm = new LLM({
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY
});
```

### 3. Registrar Agente
```typescript
import { AgentRegistry } from './agents';

AgentRegistry.getInstance().register('meu-assistente', {
  type: 'chat',
  provider: 'openai',
  model: 'gpt-4o-mini',
  agentInfo: {
    name: 'Assistente',
    goal: 'Ajudar usuários',
    backstory: 'Assistente prestativo'
  }
});
```

### 4. Criar Workflow
```typescript
import { WorkflowBuilder } from './orchestrators/workflows';

const workflow = WorkflowBuilder.create()
  .addAgentStep('process', 'meu-assistente', {
    instructions: 'Processar a solicitação do usuário'
  })
  .build();
```

### 5. Executar
```typescript
const result = await workflow.execute({ 
  userInput: 'Como posso ajudar você hoje?' 
});
```

## Integração entre Módulos

### Agente → LLM → Provider
```typescript
// Agente usa LLM que usa Provider
class MeuAgente {
  async execute(messages) {
    const prompt = PromptBuilder.build({
      mode: 'chat',
      messages,
      agentInfo: this.config.agentInfo
    });
    
    return await this.llm.invoke({ messages: prompt });
  }
}
```

### Workflow → Agente → Tools
```typescript
// Workflow usa Agente que pode usar Tools
const workflow = WorkflowBuilder.create()
  .addAgentStep('analyze', 'meu-agente', {
    instructions: 'Analisar usando ferramentas',
    tools: ['search', 'calculator']
  })
  .build();
```

### Memory → LLM → Memory
```typescript
// Histórico é usado pelo LLM e atualizado com respostas
const history = new ChatHistoryManager();
const messages = await history.getMessages();

const response = await llm.invoke({ messages });

await history.addMessage({
  role: 'assistant',
  content: response.content
});
```

## Exemplos Completos

### Assistente Simples
```typescript
import { LLM, ChatHistoryManager } from './';

const llm = new LLM({
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY
});

const history = new ChatHistoryManager();

async function chat(message: string) {
  await history.addMessage({ role: 'user', content: message });
  
  const messages = await history.getMessages();
  const response = await llm.invoke({ messages });
  
  await history.addMessage({ role: 'assistant', content: response.content });
  
  return response.content;
}
```

### Agente com Ferramentas
```typescript
import { AgentRegistry, ToolExecutor } from './';

class AgenteComFerramentas {
  constructor() {
    this.toolExecutor = new ToolExecutor([
      new SearchTool(),
      new CalculatorTool()
    ]);
  }
  
  async execute(messages) {
    const tools = this.toolExecutor.getAvailableTools();
    
    const prompt = PromptBuilder.build({
      mode: 'react',
      messages,
      tools: tools.map(t => t.getSchema())
    });
    
    const response = await this.llm.invoke({ messages: prompt });
    
    // Executar ferramentas se necessário
    if (response.tool_calls) {
      for (const toolCall of response.tool_calls) {
        const result = await this.toolExecutor.execute(
          toolCall.name,
          toolCall.arguments
        );
        // Processar resultado...
      }
    }
    
    return response;
  }
}
```

### Workflow Complexo
```typescript
import { WorkflowBuilder } from './';

const workflow = WorkflowBuilder.create()
  .addStep('validate', (context) => {
    // Validar entrada
    return { valid: true };
  })
  .addParallelSteps('analysis', [
    { id: 'sentiment', execute: async (ctx) => analyzeSentiment(ctx.data.text) },
    { id: 'keywords', execute: async (ctx) => extractKeywords(ctx.data.text) },
    { id: 'topics', execute: async (ctx) => identifyTopics(ctx.data.text) }
  ])
  .addAgentStep('synthesis', 'analyzer', {
    instructions: 'Sintetizar análises anteriores'
  })
  .addStep('report', (context) => {
    const synthesis = context.getStepResult('synthesis');
    return { finalReport: synthesis };
  })
  .build();
```

## Documentação por Módulo

- **[Agents](./agents/README.md)** - Sistema de agentes e registro
- **[LLM](./llm/README.md)** - Abstração para LLMs
- **[Memory](./memory/README.md)** - Gerenciamento de histórico
- **[Orchestrators](./orchestrators/README.md)** - Workflows e steps
- **[PromptBuilder](./promptBuilder/README.md)** - Construção de prompts
- **[Providers](./providers/README.md)** - Integração com provedores
- **[Tools](./tools/README.md)** - Sistema de ferramentas

## API Reference

Para documentação detalhada da API, consulte:
- [Documentação da API](../../docs/api/)
- [Exemplos de Uso](../../examples/)
- [Guia de Migração](../../docs/workflows/migration-guide.md)

## Notas Importantes

1. **Modularidade**: Cada módulo pode ser usado independentemente
2. **Extensibilidade**: Crie seus próprios agentes, ferramentas e provedores
3. **Type Safety**: Todo o SDK é fortemente tipado com TypeScript
4. **Performance**: Use cache e reutilização de instâncias quando possível
5. **Segurança**: Sempre valide entradas e use variáveis de ambiente para chaves
6. **Erros**: Implemente tratamento robusto de erros
7. **Documentação**: Documente seus agentes e ferramentas customizadas
8. **Testes**: Escreva testes para seus agentes e workflows

## Suporte e Comunidade

- [Documentação Completa](../../docs/)
- [Exemplos](../../examples/)
- [Issues e Suporte](https://github.com/seu-repo/frame-agent-sdk/issues)
- [Discussões](https://github.com/seu-repo/frame-agent-sdk/discussions)

## Licença

Este SDK está licenciado sob a licença MIT. Veja o arquivo [LICENSE](../../LICENSE) para mais detalhes.