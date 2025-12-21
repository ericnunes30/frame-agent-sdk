# Interface: IAgent

[agent/interfaces/IAgent](../modules/agent_interfaces_IAgent.md).IAgent

Interface base para todos os agentes do sistema de IA.

Define o contrato fundamental que todos os agentes devem implementar,
estabelecendo métodos para execução, configuração, validação e
gerenciamento de estado.

## Características Principais

- **Execução Assíncrona**: Todos os agentes executam operações assíncronas
- **Configuração Dinâmica**: Suporte a reconfiguração em tempo de execução
- **Validação de Estado**: Verificação de prontidão antes da execução
- **Gerenciamento de Estado**: Capacidade de reset e controle de estado
- **Metadados Ricos**: Informações detalhadas sobre execuções

## Integração com Módulos

- **Memory**: Utiliza Message para entrada/saída de dados
- **PromptBuilder**: Consome AgentInfo e ToolSchema para construção de prompts
- **Providers**: Integra com provedores LLM para geração de conteúdo
- **Tools**: Suporta execução de ferramentas quando configurado

**`Example`**

```typescript
// Implementação básica de agente
class MyAgent implements IAgent {
  public readonly id = 'my-agent';
  public readonly type = 'chat';
  public readonly config: IAgentConfig;

  async execute(messages: Message[], options?: AgentExecutionOptions): Promise<AgentExecutionResult> {
    const startTime = new Date();
    
    try {
      // Lógica de execução do agente
      const response = await this.processMessages(messages, options);
      
      return {
        content: response,
        messages: [...messages, { role: 'assistant', content: response }],
        success: true,
        metadata: {
          executionTime: Date.now() - startTime.getTime(),
          startTime,
          endTime: new Date()
        }
      };
    } catch (error) {
      return {
        content: null,
        messages,
        success: false,
        error: error.message,
        metadata: {
          executionTime: Date.now() - startTime.getTime(),
          startTime,
          endTime: new Date()
        }
      };
    }
  }

  configure(config: Partial<IAgentConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getInfo(): AgentInfo {
    return {
      name: 'My Agent',
      role: 'Assistente personalizado',
      backstory: 'Agente criado para tarefas específicas'
    };
  }

  validate(): boolean {
    return this.config.apiKey !== undefined && this.config.model !== undefined;
  }

  reset(): void {
    // Limpar estado interno
  }
}
```

**`See`**

 - [IAgentConfig](agent_interfaces_IAgentConfig.IAgentConfig.md) Para configuração de agentes
 - [AgentInfo](promptBuilder_promptBuilder_interface.AgentInfo.md) Para informações do agente
 - [Message](memory_memory_interface.Message.md) Para formato de mensagens
 - [ToolSchema](../modules/promptBuilder_promptBuilder_interface.md#toolschema) Para definição de ferramentas

## Table of contents

### Properties

- [config](agent_interfaces_IAgent.IAgent.md#config)
- [id](agent_interfaces_IAgent.IAgent.md#id)
- [type](agent_interfaces_IAgent.IAgent.md#type)

### Methods

- [configure](agent_interfaces_IAgent.IAgent.md#configure)
- [execute](agent_interfaces_IAgent.IAgent.md#execute)
- [getInfo](agent_interfaces_IAgent.IAgent.md#getinfo)
- [reset](agent_interfaces_IAgent.IAgent.md#reset)
- [validate](agent_interfaces_IAgent.IAgent.md#validate)

## Properties

### config

• `Readonly` **config**: [`IAgentConfig`](agent_interfaces_IAgentConfig.IAgentConfig.md)

Configuração atual do agente.

Contém todas as configurações necessárias para o funcionamento
do agente, incluindo credenciais, modelos, parâmetros, etc.

#### Defined in

[src/agent/interfaces/IAgent.ts:118](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L118)

___

### id

• `Readonly` **id**: `string`

Identificador único do agente no sistema.

Este ID deve ser único em todo o sistema e é usado para
rastreamento, logging e identificação em registries.

#### Defined in

[src/agent/interfaces/IAgent.ts:102](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L102)

___

### type

• `Readonly` **type**: `string`

Tipo/categoria do agente.

Define o comportamento e capacidades do agente (ex: 'chat', 'react', 'custom').
Este tipo é usado pelo sistema para determinar como processar o agente.

#### Defined in

[src/agent/interfaces/IAgent.ts:110](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L110)

## Methods

### configure

▸ **configure**(`config`): `void`

Configura o agente com novas opções.

Permite modificar a configuração do agente em tempo de execução,
útil para ajustes dinâmicos, mudanças de modelo, etc.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Partial`\<[`IAgentConfig`](agent_interfaces_IAgentConfig.IAgentConfig.md)\> | Nova configuração parcial do agente. Propriedades existentes são mantidas, novas sobrescrevem as antigas. |

#### Returns

`void`

**`Example`**

```typescript
// Alterar temperatura
agent.configure({ temperature: 0.9 });

// Adicionar novas ferramentas
agent.configure({ tools: [...agent.config.tools, newTool] });

// Alterar modelo
agent.configure({ model: 'gpt-4' });
```

**`See`**

[IAgentConfig](agent_interfaces_IAgentConfig.IAgentConfig.md) Para estrutura de configuração

#### Defined in

[src/agent/interfaces/IAgent.ts:191](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L191)

___

### execute

▸ **execute**(`messages`, `options?`): `Promise`\<[`AgentExecutionResult`](agent_interfaces_IAgent.AgentExecutionResult.md)\>

Executa o agente com as mensagens fornecidas.

Este é o método principal de execução do agente. Recebe mensagens
de entrada, processa usando a lógica específica do agente e retorna
um resultado estruturado com conteúdo, mensagens atualizadas e metadados.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](memory_memory_interface.Message.md)[] | Array de mensagens de entrada para o agente. Deve incluir mensagens do usuário e histórico relevante. |
| `options?` | [`AgentExecutionOptions`](agent_interfaces_IAgent.AgentExecutionOptions.md) | Opções adicionais para execução. Parâmetros opcionais como temperatura, tools, instruções extras, etc. |

#### Returns

`Promise`\<[`AgentExecutionResult`](agent_interfaces_IAgent.AgentExecutionResult.md)\>

Promise que resolve para AgentExecutionResult.

**`Example`**

```typescript
const agent = new MyAgent(config);

const messages = [
  { role: 'user', content: 'Olá, como você pode me ajudar?' }
];

const options = {
  temperature: 0.7,
  tools: [calculatorTool, searchTool],
  additionalInstructions: 'Seja conciso e útil'
};

const result = await agent.execute(messages, options);

if (result.success) {
  console.log('Resposta:', result.content);
  console.log('Mensagens atualizadas:', result.messages);
  console.log('Tempo de execução:', result.metadata.executionTime);
} else {
  console.error('Erro:', result.error);
}
```

**`See`**

 - [AgentExecutionOptions](agent_interfaces_IAgent.AgentExecutionOptions.md) Para opções de execução
 - [AgentExecutionResult](agent_interfaces_IAgent.AgentExecutionResult.md) Para formato do resultado

#### Defined in

[src/agent/interfaces/IAgent.ts:163](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L163)

___

### getInfo

▸ **getInfo**(): [`AgentInfo`](promptBuilder_promptBuilder_interface.AgentInfo.md)

Obtém informações sobre o agente.

Retorna dados estruturados sobre o agente, incluindo nome, papel,
backstory e outras informações relevantes para construção de prompts.

#### Returns

[`AgentInfo`](promptBuilder_promptBuilder_interface.AgentInfo.md)

AgentInfo com informações do agente.

**`Example`**

```typescript
const info = agent.getInfo();
console.log('Nome:', info.name);
console.log('Papel:', info.role);
console.log('História:', info.backstory);
```

**`See`**

[AgentInfo](promptBuilder_promptBuilder_interface.AgentInfo.md) Para formato das informações

#### Defined in

[src/agent/interfaces/IAgent.ts:211](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L211)

___

### reset

▸ **reset**(): `void`

Reinicia o estado interno do agente.

Limpa caches, reseta contadores, remove dados temporários
e restaura o agente ao estado inicial. Útil para reutilização
ou limpeza de memória.

#### Returns

`void`

**`Example`**

```typescript
// Após execução longa
agent.reset();

// Pronto para nova sessão
const newResult = await agent.execute(newMessages);
```

#### Defined in

[src/agent/interfaces/IAgent.ts:250](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L250)

___

### validate

▸ **validate**(): `boolean`

Valida se o agente está pronto para execução.

Verifica se todas as dependências e configurações necessárias
estão presentes e válidas antes de permitir a execução.

#### Returns

`boolean`

true se o agente estiver pronto, false caso contrário.

**`Example`**

```typescript
if (!agent.validate()) {
  console.error('Agente não está configurado corretamente');
  return;
}

// Agente validado, pode executar
const result = await agent.execute(messages);
```

#### Defined in

[src/agent/interfaces/IAgent.ts:232](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L232)
