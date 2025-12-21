# Interface: AgentRegistryInfo

[agent/interfaces/IAgentRegistry](../modules/agent_interfaces_IAgentRegistry.md).AgentRegistryInfo

Informações detalhadas sobre um agente registrado no sistema.

Estrutura completa com metadados, configuração, estatísticas
de uso e informações temporais sobre um agente no registry.

## Uso das Informações

- **Monitoramento**: Rastrear uso, performance e erros
- **Analytics**: Analisar padrões de uso e popularidade
- **Manutenção**: Identificar agentes problemáticos ou obsoletos
- **Documentação**: Gerar catálogos e documentação automática

**`Example`**

```typescript
const info: AgentRegistryInfo = {
  id: 'researcher',
  type: 'react',
  provider: 'openai',
  model: 'gpt-4',
  agentInfo: {
    name: 'Researcher',
    goal: 'Find accurate information',
    backstory: 'Expert researcher with 10 years experience'
  },
  registeredAt: new Date('2024-01-01'),
  executionCount: 150,
  metadata: { category: 'research', version: '1.2' },
  lastError: null,
  lastExecutionAt: new Date('2024-01-15T14:30:00')
};
```

**`See`**

 - [IAgentRegistry](agent_interfaces_IAgentRegistry.IAgentRegistry.md) Para operações do registry
 - [IAgentConfig](agent_interfaces_IAgentConfig.IAgentConfig.md) Para configuração do agente

## Table of contents

### Properties

- [agentInfo](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md#agentinfo)
- [executionCount](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md#executioncount)
- [id](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md#id)
- [lastError](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md#lasterror)
- [lastExecutionAt](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md#lastexecutionat)
- [metadata](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md#metadata)
- [model](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md#model)
- [provider](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md#provider)
- [registeredAt](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md#registeredat)
- [type](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md#type)

## Properties

### agentInfo

• **agentInfo**: `Object`

Informações estruturadas do agente.

Dados que definem a identidade, papel e comportamento
do agente, usados para construção de prompts.

**`Example`**

```typescript
agentInfo: {
  name: 'Code Assistant',
  goal: 'Help developers write better code',
  backstory: 'Senior software engineer with expertise in multiple languages'
}
```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `backstory` | `string` | Histórico/contexto do agente |
| `goal` | `string` | Objetivo/função principal do agente |
| `name` | `string` | Nome do agente |

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:733](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L733)

___

### executionCount

• **executionCount**: `number`

Número total de execuções do agente.

Contador que incrementa a cada vez que o agente
é executado (via execute() ou create()+execute()).
Útil para identificar agentes populares.

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:757](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L757)

___

### id

• **id**: `string`

Identificador único do agente no registry.

ID usado para todas as operações do registry (get, create, execute, etc.).
Deve ser único entre todos os agentes registrados.

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:691](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L691)

___

### lastError

• `Optional` **lastError**: `string`

Mensagem do último erro de execução.

Descrição do erro mais recente que ocorreu durante
a execução do agente. Null se a última execução
foi bem-sucedida.

**`Example`**

```typescript
lastError: null                                    // Última execução OK
lastError: 'API key expired'                       // Erro de autenticação
lastError: 'Model gpt-5 not found'                 // Erro de modelo
lastError: 'Timeout after 30 seconds'              // Erro de timeout
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:793](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L793)

___

### lastExecutionAt

• `Optional` **lastExecutionAt**: `Date`

Timestamp da última execução do agente.

Momento exato da última vez que o agente foi executado,
independentemente do sucesso ou falha. Útil para
identificar agentes inativos.

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:802](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L802)

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadados adicionais do agente.

Informações extras fornecidas durante o registro,
como versão, categoria, tags, autor, etc.

**`Example`**

```typescript
metadata: {
  version: '1.0',
  category: 'research',
  author: 'team-ai',
  tags: ['nlp', 'analysis'],
  deprecated: false
}
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:776](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L776)

___

### model

• **model**: `string`

Modelo específico do LLM utilizado.

Nome do modelo conforme suportado pelo provedor
(ex: 'gpt-4', 'claude-3-sonnet', 'command-r').

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:716](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L716)

___

### provider

• **provider**: `string`

Provedor do modelo de linguagem.

Identifica qual provedor LLM é usado pelo agente
(ex: 'openai', 'anthropic', 'cohere').

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:708](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L708)

___

### registeredAt

• **registeredAt**: `Date`

Data e hora do registro do agente.

Timestamp indicando quando o agente foi adicionado
ao registry. Útil para auditoria e versionamento.

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:748](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L748)

___

### type

• **type**: `string`

Tipo/categoria do agente.

Define o comportamento e capacidades do agente
(ex: 'chat', 'react', 'research', 'coding').
Usado para agrupamento e filtragem.

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:700](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L700)
