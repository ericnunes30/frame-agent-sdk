# Agent Module

O módulo **Agent** é o núcleo do framework de construção de agentes de IA, fornecendo as interfaces e implementações fundamentais para criação e gerenciamento de agentes inteligentes.

## Visão Geral

Este módulo oferece:

- **Interfaces base** para definição de agentes
- **Implementação concreta** do agente com LLM
- **Sistema de registro** para gerenciamento de múltiplos agentes
- **Configuração flexível** para diferentes tipos de agentes

## Estrutura do Módulo

```
agent/
├── interfaces/           # Interfaces base do agente
│   ├── IAgent.ts         # Interface principal do agente
│   ├── IAgentConfig.ts   # Interface de configuração
│   ├── IAgentRegistry.ts # Interface do registro de agentes
│   └── agentLLM.interface.ts # Interface para integração com LLM
├── llm/
│   ├── agentLLM.ts       # Implementação do agente com LLM
│   └── index.ts
├── registry/
│   ├── AgentRegistry.ts  # Implementação do registro de agentes
│   └── index.ts
├── index.ts              # Exportação principal do módulo
└── README.md            # Documentação do módulo
```

## Componentes Principais

### 1. IAgent Interface

Interface base que define o contrato para todos os agentes:

```typescript
interface IAgent {
  id: string;
  name: string;
  config: IAgentConfig;
  execute(input: string): Promise<AgentResponse>;
  setState(state: Record<string, any>): void;
  getState(): Record<string, any>;
}
```

### 2. IAgentConfig Interface

Configuração do agente:

```typescript
interface IAgentConfig {
  name: string;
  role: string;
  backstory?: string;
  goal?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: Tool[];
  systemPrompt?: string;
}
```

### 3. AgentLLM

Implementação concreta do agente com integração LLM:

```typescript
class AgentLLM implements IAgent {
  constructor(config: IAgentConfig);
  async execute(input: string): Promise<AgentResponse>;
  // ... outros métodos
}
```

### 4. AgentRegistry

Sistema de registro para gerenciamento de múltiplos agentes:

```typescript
class AgentRegistry implements IAgentRegistry {
  register(agent: IAgent): void;
  getAgent(id: string): IAgent | undefined;
  listAgents(): IAgent[];
  // ... outros métodos
}
```

## Uso Básico

### Criando um Agente

```typescript
import { AgentLLM } from '@/agent/llm/agentLLM';
import { IAgentConfig } from '@/agent/interfaces/IAgentConfig';

const config: IAgentConfig = {
  name: 'Researcher',
  role: 'Research Assistant',
  backstory: 'Expert in finding and summarizing information',
  goal: 'Help users find accurate information',
  model: 'gpt-4',
  temperature: 0.7
};

const agent = new AgentLLM(config);
```

### Executando um Agente

```typescript
const response = await agent.execute('What is the capital of France?');
console.log(response.content); // "The capital of France is Paris."
```

### Usando o Registro de Agentes

```typescript
import { AgentRegistry } from '@/agent/registry/AgentRegistry';

const registry = new AgentRegistry();
registry.register(agent);

const retrievedAgent = registry.getAgent('Researcher');
```

## Integração com Outros Módulos

### LLM Modes
O agente trabalha em conjunto com os modos definidos em `llmModes`:

```typescript
import { AGENT_MODES } from '@/llmModes';

const config: IAgentConfig = {
  // ... outras configurações
  mode: AGENT_MODES.CHAT // ou AGENT_MODES.REACT
};
```

### Memory
Integração com o sistema de memória:

```typescript
import { createChatMemory } from '@/memory';

const memory = createChatMemory({ maxContextTokens: 4000 });
// O AgentLLM gerencia a memória internamente
```

### Tools
Integração com ferramentas:

```typescript
const config: IAgentConfig = {
  // ... outras configurações
  tools: [
    // Suas ferramentas personalizadas
  ]
};
```

## Melhores Práticas

### 1. Configuração de Agentes
- Defina nomes e papéis claros para cada agente
- Use `backstory` para contextualizar o comportamento do agente
- Configure `temperature` apropriadamente para o tipo de tarefa

### 2. Gerenciamento de Estado
- Use `setState`/`getState` para manter contexto entre execuções
- Limpe o estado quando necessário para evitar vazamento de contexto

### 3. Registro de Agentes
- Use o `AgentRegistry` para aplicações com múltiplos agentes
- Registre agentes no início da aplicação

### 4. Tratamento de Erros
- Sempre trate exceções nas chamadas `execute()`
- Implemente retry logic quando apropriado

## Exemplos Avançados

### Agente com Memória Personalizada

```typescript
import { AgentLLM } from '@/agent/llm/agentLLM';
import { createChatMemory } from '@/memory';

const agent = new AgentLLM({
  name: 'MemoryAgent',
  role: 'Assistant with long-term memory',
  // O AgentLLM gerencia a memória automaticamente
});

// Executar múltiplas interações
await agent.execute('My name is John');
const response = await agent.execute('What is my name?');
// O agente lembrará do nome por causa da memória integrada
```

### Agente com Ferramentas

```typescript
import { AgentLLM } from '@/agent/llm/agentLLM';

const agent = new AgentLLM({
  name: 'ToolAgent',
  role: 'Assistant with tool access',
  tools: [
    // Suas ferramentas personalizadas aqui
  ]
});

const response = await agent.execute('Calculate 15% of 200');
// O agente pode usar ferramentas para executar a tarefa
```

### Registro de Múltiplos Agentes

```typescript
import { AgentRegistry } from '@/agent/registry/AgentRegistry';
import { AgentLLM } from '@/agent/llm/agentLLM';

const registry = new AgentRegistry();

// Criar diferentes tipos de agentes
const researcher = new AgentLLM({
  name: 'Researcher',
  role: 'Research Assistant'
});

const writer = new AgentLLM({
  name: 'Writer',
  role: 'Content Writer'
});

// Registrar agentes
registry.register(researcher);
registry.register(writer);

// Usar agentes registrados
const agent = registry.getAgent('Researcher');
if (agent) {
  const response = await agent.execute('Research about AI');
}
```

## Extensibilidade

### Criando Agentes Personalizados

```typescript
import { IAgent, IAgentConfig } from '@/agent/interfaces';

class CustomAgent implements IAgent {
  id: string;
  name: string;
  config: IAgentConfig;

  constructor(config: IAgentConfig) {
    this.id = config.name.toLowerCase().replace(/\s+/g, '-');
    this.name = config.name;
    this.config = config;
  }

  async execute(input: string): Promise<AgentResponse> {
    // Implementação personalizada
    return {
      content: `Custom response to: ${input}`,
      metadata: {}
    };
  }

  setState(state: Record<string, any>): void {
    // Implementação personalizada
  }

  getState(): Record<string, any> {
    // Implementação personalizada
    return {};
  }
}
```

## Conclusão

O módulo Agent fornece uma base sólida para construção de agentes de IA com:

- **Flexibilidade**: Interfaces bem definidas para extensão
- **Integração**: Funciona perfeitamente com outros módulos do framework
- **Gerenciamento**: Sistema de registro para aplicações complexas
- **Configuração**: Opções detalhadas para personalização

Esta documentação serve como guia completo para utilizar e estender o módulo Agent em suas aplicações.