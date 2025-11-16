# Módulo Agents

## Propósito
Sistema de registro e gerenciamento de agentes que permite criar, configurar e executar agentes de IA usando os modos chat e react através do PromptBuilder.

## Estrutura
```
agents/
├── interfaces/          # Interfaces base (IAgent, IAgentConfig, IAgentRegistry)
├── modesAgents/         # Modos de prompt (chat, react)
└── registry/           # AgentRegistry para agentes customizados
```

## Principais Componentes

### AgentRegistry (Singleton)
- **Localização**: [`registry/AgentRegistry.ts`](registry/AgentRegistry.ts)
- **Função**: Registro centralizado de agentes customizados
- **Padrão**: Singleton para garantir única instância
- **Métodos principais**:
  - `register(id, config, options)`: Registra novo agente
  - `get(id)`: Obtém agente pelo ID
  - `create(id, options)`: Cria nova instância do agente
  - `list()`: Lista todos os agentes registrados
  - `getStats()`: Retorna estatísticas do registry

### Interfaces Base
- **IAgent**: [`interfaces/IAgent.ts`](interfaces/IAgent.ts) - Interface que todos os agentes devem implementar
- **IAgentConfig**: [`interfaces/IAgentConfig.ts`](interfaces/IAgentConfig.ts) - Configuração do agente
- **IAgentRegistry**: [`interfaces/IAgentRegistry.ts`](interfaces/IAgentRegistry.ts) - Interface do registry

### Modos de Agentes
- **AgentMode**: [`modesAgents/AgentMode.ts`](modesAgents/AgentMode.ts) - Enum dos modos disponíveis
- **Chat Mode**: [`modesAgents/chatAgentMode.ts`](modesAgents/chatAgentMode.ts) - Modo de chat via PromptBuilder
- **React Mode**: [`modesAgents/reactAgentMode.ts`](modesAgents/reactAgentMode.ts) - Modo react via PromptBuilder

## Exemplo de Uso

### Registrando um Agente Customizado
```typescript
import { AgentRegistry } from './agents';
import type { IAgent, IAgentConfig } from './agents';

// Criar classe do agente
class MeuAnalisador implements IAgent {
  constructor(private config: IAgentConfig) {}
  
  async execute(messages, options) {
    // Usa o PromptBuilder com modo react
    return await this.llm.invoke({ 
      messages, 
      mode: 'react',
      tools: this.config.tools 
    });
  }
  
  validate() { return true; }
  getInfo() { return this.config.agentInfo; }
}

// Registrar no AgentRegistry
AgentRegistry.getInstance().register('meu-analisador', {
  type: 'custom',
  provider: 'openai',
  model: 'gpt-4o-mini',
  agentInfo: {
    name: 'Meu Analisador',
    goal: 'Analisar dados complexos',
    backstory: 'Especialista em análise de dados'
  }
});
```

### Usando em Workflows
```typescript
import { WorkflowBuilder } from '../orchestrators/workflows';

const workflow = WorkflowBuilder.create()
  .addAgentStep('analyze', 'meu-analisador', { 
    instructions: 'Analise os dados fornecidos' 
  })
  .build();

const result = await workflow.execute();
```

### Executando Diretamente
```typescript
import { AgentRegistry } from './agents';
import type { Message } from '../memory';

const messages: Message[] = [
  { role: 'user', content: 'Analise estes dados: ...' }
];

const result = await AgentRegistry.getInstance()
  .execute('meu-analisador', messages, {
    additionalInstructions: 'Foque em padrões sazonais'
  });
```

## Integração com Outros Módulos

### PromptBuilder
Os agentes usam o PromptBuilder para gerenciar modos de prompt:
```typescript
import { PromptBuilder } from '../promptBuilder';

// No agente
const prompt = PromptBuilder.build({
  mode: 'react',
  messages,
  tools,
  agentInfo: this.config.agentInfo
});
```

### Workflows
Integração com o módulo de workflows via [`AgentStep`](../orchestrators/workflows/steps/AgentStep.ts):
```typescript
// O AgentStep usa o AgentRegistry internamente
const agent = AgentRegistry.getInstance().get(agentId);
const result = await agent.execute(messages, options);
```

## Documentação Adicional

- [API Reference](../../docs/api/modules/agents.md)
- [Exemplos de Agentes Customizados](../../examples/agents/)
- [Guia de Modos de Prompt](../promptBuilder/README.md)

## Notas Importantes

1. **SDK Fornece Apenas Infraestrutura**: O SDK não fornece agentes prontos, apenas a infraestrutura para criar e registrar agentes customizados.

2. **Desenvolvedores Criam Seus Agentes**: Cada desenvolvedor implementa seus próprios agentes implementando a interface `IAgent`.

3. **Modos via PromptBuilder**: Os modos de execução (chat, react) são gerenciados pelo PromptBuilder, não pelos agentes diretamente.

4. **Registry é Global**: O AgentRegistry é um singleton global - todos os agentes registrados estão disponíveis em todo o projeto.

5. **Validação Automática**: O registry valida automaticamente que o agente implementa os métodos necessários antes de registrar.

## Boas Práticas

1. **Nomes Únicos**: Use nomes descritivos e únicos para seus agentes
2. **Configuração Clara**: Sempre forneça `agentInfo` completo (name, goal, backstory)
3. **Validação Robusta**: Implemente o método `validate()` para verificar configurações
4. **Tratamento de Erros**: Sempre trate erros no método `execute()`
5. **Documentação**: Documente o propósito e uso do agente no registro