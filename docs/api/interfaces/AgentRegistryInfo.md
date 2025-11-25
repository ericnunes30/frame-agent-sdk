# Interface: AgentRegistryInfo

Informações detalhadas sobre um agente registrado no sistema.

Estrutura que contém todos os metadados e informações relevantes
sobre um agente no registry, incluindo configuração, estatísticas
de uso e informações temporais.

## Uso das Informações

- **Listagem**: Usada pelo método list() para mostrar agentes disponíveis
- **Descoberta**: Facilita encontrar agentes por tipo ou características
- **Analytics**: Fornece dados para análise de uso e performance
- **Documentação**: Ajuda na geração de documentação automática

**`Example`**

```typescript
const info: AgentRegistryInfo = {
  name: 'researcher',
  type: 'react',
  description: 'Agente especializado em pesquisa',
  config: { /* configuração padrão */ },
  registeredAt: new Date('2024-01-01'),
  usageCount: 42
};

console.log(`${info.name} (${info.type}) - Usado ${info.usageCount} vezes`);
```

**`See`**

 - [IAgentRegistry](IAgentRegistry.md) Para operações do registry
 - [IAgentConfig](IAgentConfig.md) Para configuração do agente

## Table of contents

### Properties

- [config](AgentRegistryInfo.md#config)
- [description](AgentRegistryInfo.md#description)
- [name](AgentRegistryInfo.md#name)
- [registeredAt](AgentRegistryInfo.md#registeredat)
- [type](AgentRegistryInfo.md#type)
- [usageCount](AgentRegistryInfo.md#usagecount)

## Properties

### config

• **config**: [`IAgentConfig`](IAgentConfig.md)

Configuração padrão do agente.

Objeto IAgentConfig que define as configurações padrão
usadas quando o agente é instanciado. Pode ser sobrescrito
no momento da instanciação.

**`Example`**

```typescript
config: {
  type: 'react',
  provider: 'openai',
  model: 'gpt-4',
  agentInfo: { /* informações do agente */ },
  llmConfig: { temperature: 0.7 },
  tools: [/* ferramentas padrão */]
}
```

**`See`**

[IAgentConfig](IAgentConfig.md) Para estrutura completa da configuração

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:336](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L336)

___

### description

• `Optional` **description**: `string`

Descrição opcional do agente.

Texto explicativo sobre a finalidade e capacidades
do agente. Útil para documentação e interface de usuário.

**`Example`**

```typescript
description: 'Agente conversacional para atendimento ao cliente'
description: 'Especialista em análise de código e debugging'
description: 'Assistente para criação de conteúdo técnico'
```

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:313](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L313)

___

### name

• **name**: `string`

Nome único do agente no registry.

Identificador usado para registrar, buscar e referenciar
o agente no sistema. Deve ser único entre todos os agentes.

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:289](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L289)

___

### registeredAt

• **registeredAt**: `Date`

Data e hora do registro do agente.

Timestamp indicando quando o agente foi adicionado ao registry.
Útil para auditoria, versionamento e análise temporal.

**`Example`**

```typescript
registeredAt: new Date('2024-01-15T10:30:00Z')
```

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:349](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L349)

___

### type

• **type**: `string`

Tipo/categoria do agente.

Define o comportamento e capacidades do agente
(ex: 'chat', 'react', 'custom'). Usado para agrupamento
e descoberta por tipo.

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:298](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L298)

___

### usageCount

• **usageCount**: `number`

Número total de vezes que o agente foi usado.

Contador que incrementa a cada vez que o agente é
instanciado via get(). Útil para analytics e
identificação de agentes populares.

**`Example`**

```typescript
usageCount: 0    // Nunca usado
usageCount: 15   // Uso moderado
usageCount: 150  // Muito usado
```

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:365](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L365)
