# Interface: IAgentRegistry

Interface para sistema de registro de agentes customizados.

Define o contrato para um registry centralizado que permite
registrar, descobrir, gerenciar e instanciar agentes de IA
de forma organizada e reutilizável.

## Funcionalidades Principais

- **Registro Centralizado**: Cadastro de agentes com configurações padrão
- **Descoberta Dinâmica**: Localização de agentes por nome ou tipo
- **Instanciação Controlada**: Criação de agentes com configurações customizadas
- **Gerenciamento de Estado**: Estatísticas de uso e informações de registro
- **Limpeza e Manutenção**: Remoção individual ou em lote de registros

## Casos de Uso

- **Bibliotecas de Agentes**: Organizar coleções de agentes reutilizáveis
- **Workflows Dinâmicos**: Selecionar agentes baseados em contexto
- **Configuração Centralizada**: Gerenciar configurações padrão
- **Analytics**: Rastrear uso e performance de agentes
- **Plugin Systems**: Suporte a sistemas de plugins de agentes

**`Example`**

```typescript
// Registrar agente customizado
registry.register('researcher', ResearchAgent, {
  type: 'react',
  provider: 'openai',
  model: 'gpt-4',
  agentInfo: {
    name: 'Researcher',
    role: 'Pesquisador especializado',
    backstory: 'Especializado em encontrar informações precisas'
  }
});

// Usar agente registrado
const agent = registry.get('researcher', {
  llmConfig: { temperature: 0.3 }
});

if (agent) {
  const result = await agent.execute(messages);
}

// Listar agentes disponíveis
const agents = registry.list();
console.log('Agentes disponíveis:', agents.map(a => a.name));

// Verificar estatísticas
const stats = registry.getStats();
console.log('Total de agentes:', stats.totalAgents);
console.log('Mais usado:', stats.mostUsed);
```

**`See`**

 - [IAgent](IAgent.md) Para interface dos agentes
 - [IAgentConfig](IAgentConfig.md) Para configuração de agentes
 - [AgentRegistryInfo](AgentRegistryInfo.md) Para informações de registro
 - [AgentRegistryStats](AgentRegistryStats.md) Para estatísticas

## Implemented by

- [`AgentRegistry`](../classes/AgentRegistry.md)

## Table of contents

### Methods

- [clear](IAgentRegistry.md#clear)
- [get](IAgentRegistry.md#get)
- [getStats](IAgentRegistry.md#getstats)
- [has](IAgentRegistry.md#has)
- [list](IAgentRegistry.md#list)
- [register](IAgentRegistry.md#register)
- [unregister](IAgentRegistry.md#unregister)

## Methods

### clear

▸ **clear**(): `void`

Limpa todos os registros do sistema.

Remove todos os agentes registrados, resetando o registry
ao estado inicial. Útil para limpeza completa ou reset.

#### Returns

`void`

**`Example`**

```typescript
// Limpar todos os registros
registry.clear();

// Verificar se foi limpo
console.log('Total de agentes:', registry.list().length); // 0
```

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:226](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L226)

___

### get

▸ **get**(`name`, `config?`): [`IAgent`](IAgent.md)

Obtém um agente registrado e retorna uma instância configurada.

Localiza o agente pelo nome e cria uma nova instância com
a configuração fornecida (ou a padrão se não especificada).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Nome do agente no registry. |
| `config?` | `Partial`\<[`IAgentConfig`](IAgentConfig.md)\> | Configuração opcional para sobrescrever a padrão. Propriedades fornecidas substituem as da configuração padrão. |

#### Returns

[`IAgent`](IAgent.md)

Instância do agente configurado ou null se não encontrado.

**`Example`**

```typescript
// Usar configuração padrão
const agent1 = registry.get('chat-assistant');

// Usar configuração customizada
const agent2 = registry.get('researcher', {
  llmConfig: { temperature: 0.2 },
  additionalInstructions: 'Seja mais técnico'
});

if (agent2) {
  const result = await agent2.execute(messages);
}
```

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:137](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L137)

___

### getStats

▸ **getStats**(): [`AgentRegistryStats`](AgentRegistryStats.md)

Obtém estatísticas detalhadas do registro.

Retorna informações agregadas sobre o estado do registry,
incluindo contadores, rankings de uso e informações temporais.

#### Returns

[`AgentRegistryStats`](AgentRegistryStats.md)

Estatísticas sobre os agentes registrados.

**`Example`**

```typescript
const stats = registry.getStats();

console.log('Total de agentes:', stats.totalAgents);
console.log('Por tipo:', stats.agentsByType);
console.log('Mais usados:', stats.mostUsed);
console.log('Criado em:', stats.createdAt);
```

**`See`**

[AgentRegistryStats](AgentRegistryStats.md) Para formato das estatísticas

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:248](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L248)

___

### has

▸ **has**(`name`): `boolean`

Verifica se um agente está registrado no sistema.

Consulta rápida para verificar existência sem instanciar o agente.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Nome do agente a ser verificado. |

#### Returns

`boolean`

true se o agente está registrado, false caso contrário.

**`Example`**

```typescript
if (registry.has('researcher')) {
  const agent = registry.get('researcher');
  // Usar o agente...
} else {
  console.log('Agente researcher não encontrado');
}
```

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:209](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L209)

___

### list

▸ **list**(): [`AgentRegistryInfo`](AgentRegistryInfo.md)[]

Lista todos os agentes registrados no sistema.

Retorna array com informações detalhadas sobre cada agente,
incluindo metadados como tipo, descrição, data de registro e uso.

#### Returns

[`AgentRegistryInfo`](AgentRegistryInfo.md)[]

Array com informações dos agentes registrados.

**`Example`**

```typescript
const agents = registry.list();

agents.forEach(agent => {
  console.log(`Nome: ${agent.name}`);
  console.log(`Tipo: ${agent.type}`);
  console.log(`Descrição: ${agent.description}`);
  console.log(`Usado ${agent.usageCount} vezes`);
  console.log(`Registrado em: ${agent.registeredAt}`);
});
```

**`See`**

[AgentRegistryInfo](AgentRegistryInfo.md) Para formato das informações

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:162](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L162)

___

### register

▸ **register**(`name`, `agentClass`, `config`): `boolean`

Registra um agente customizado no sistema.

Adiciona um novo agente ao registry com sua configuração padrão,
permitindo que seja descoberto e instanciado posteriormente.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Nome único do agente no registry. Deve ser único para evitar conflitos. Usado para identificação. |
| `agentClass` | (`config`: [`IAgentConfig`](IAgentConfig.md)) => [`IAgent`](IAgent.md) | Classe construtora do agente. Deve implementar IAgent e aceitar IAgentConfig no construtor. |
| `config` | [`IAgentConfig`](IAgentConfig.md) | Configuração padrão do agente. Usada como base quando o agente é instanciado sem configurações customizadas. |

#### Returns

`boolean`

true se o registro foi bem-sucedido, false caso contrário.

**`Example`**

```typescript
// Registrar agente simples
registry.register('chat-assistant', ChatAgent, {
  type: 'chat',
  provider: 'openai',
  model: 'gpt-3.5-turbo',
  agentInfo: {
    name: 'Chat Assistant',
    role: 'Assistente conversacional',
    backstory: 'Especialista em conversas naturais'
  }
});

// Registrar com opções
registry.register('researcher', ResearchAgent, researchConfig, {
  description: 'Agente especializado em pesquisa',
  overwrite: true
});
```

**`See`**

[AgentRegistrationOptions](AgentRegistrationOptions.md) Para opções de registro

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:106](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L106)

___

### unregister

▸ **unregister**(`name`): `boolean`

Remove um agente do registro.

Remove permanentemente um agente do registry, liberando
o nome para possível reuso.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Nome do agente a ser removido. |

#### Returns

`boolean`

true se a remoção foi bem-sucedida, false caso contrário.

**`Example`**

```typescript
// Remover agente específico
const removed = registry.unregister('old-agent');
if (removed) {
  console.log('Agente removido com sucesso');
}

// Verificar se ainda existe
if (!registry.has('old-agent')) {
  console.log('Agente não está mais registrado');
}
```

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:188](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L188)
