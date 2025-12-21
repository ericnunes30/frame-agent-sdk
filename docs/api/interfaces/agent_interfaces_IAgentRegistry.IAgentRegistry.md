# Interface: IAgentRegistry

[agent/interfaces/IAgentRegistry](../modules/agent_interfaces_IAgentRegistry.md).IAgentRegistry

Interface para sistema de registro centralizado de agentes de IA.

Define um registry robusto e completo para gerenciar agentes de IA
de forma centralizada, permitindo registro, descoberta, instanciação,
execução direta e monitoramento de agentes.

## Funcionalidades Principais

- **Registro Centralizado**: Cadastro de agentes com configurações completas
- **Instanciação Controlada**: Criação de instâncias com configurações customizadas
- **Execução Direta**: Execução de agentes sem instanciação manual
- **Filtragem e Descoberta**: Busca por tipo, provedor ou características
- **Monitoramento**: Estatísticas de uso, performance e erros
- **Validação**: Verificação automática de configurações
- **Atualização Dinâmica**: Modificação de configurações em tempo real

## Casos de Uso Avançados

- **Sistemas Multi-Agente**: Coordenar múltiplos agentes especializados
- **Load Balancing**: Distribuir carga entre instâncias de agentes
- **A/B Testing**: Testar diferentes configurações de agentes
- **Monitoring**: Rastrear performance e uso de agentes
- **Dynamic Routing**: Direcionar requisições baseado em tipo/capacidades

**`Example`**

```typescript
// Registrar agentes especializados
registry.register('researcher', {
  type: 'react',
  provider: 'openai',
  model: 'gpt-4',
  agentInfo: { name: 'Researcher', goal: 'Find information', backstory: 'Expert researcher' },
  tools: [searchTool, webScraperTool]
});

registry.register('coder', {
  type: 'react',
  provider: 'openai',
  model: 'gpt-4',
  agentInfo: { name: 'Coder', goal: 'Write code', backstory: 'Expert programmer' },
  tools: [codeAnalyzerTool, fileTool]
});

// Executar diretamente do registry
const result = await registry.execute('researcher', [
  { role: 'user', content: 'Research the latest AI trends' }
], { temperature: 0.3 });

// Filtrar por tipo
const reactAgents = registry.filterByType('react');
console.log('Agentes ReAct disponíveis:', reactAgents);

// Monitorar estatísticas
const stats = registry.getStats();
console.log('Taxa de sucesso:', stats.successRate);
console.log('Agentes mais usados:', stats.mostUsedAgents);
```

**`See`**

 - [IAgent](agent_interfaces_IAgent.IAgent.md) Para interface dos agentes
 - [IAgentConfig](agent_interfaces_IAgentConfig.IAgentConfig.md) Para configuração de agentes
 - [AgentRegistryInfo](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md) Para informações detalhadas
 - [AgentRegistryStats](agent_interfaces_IAgentRegistry.AgentRegistryStats.md) Para estatísticas

## Table of contents

### Methods

- [clear](agent_interfaces_IAgentRegistry.IAgentRegistry.md#clear)
- [create](agent_interfaces_IAgentRegistry.IAgentRegistry.md#create)
- [execute](agent_interfaces_IAgentRegistry.IAgentRegistry.md#execute)
- [filterByType](agent_interfaces_IAgentRegistry.IAgentRegistry.md#filterbytype)
- [get](agent_interfaces_IAgentRegistry.IAgentRegistry.md#get)
- [getInfo](agent_interfaces_IAgentRegistry.IAgentRegistry.md#getinfo)
- [getStats](agent_interfaces_IAgentRegistry.IAgentRegistry.md#getstats)
- [has](agent_interfaces_IAgentRegistry.IAgentRegistry.md#has)
- [list](agent_interfaces_IAgentRegistry.IAgentRegistry.md#list)
- [listTypes](agent_interfaces_IAgentRegistry.IAgentRegistry.md#listtypes)
- [register](agent_interfaces_IAgentRegistry.IAgentRegistry.md#register)
- [unregister](agent_interfaces_IAgentRegistry.IAgentRegistry.md#unregister)
- [update](agent_interfaces_IAgentRegistry.IAgentRegistry.md#update)
- [validateAll](agent_interfaces_IAgentRegistry.IAgentRegistry.md#validateall)

## Methods

### clear

▸ **clear**(): `void`

Limpa todos os agentes do registry.

Remove permanentemente todos os agentes registrados,
resetando o registry ao estado inicial vazio.

#### Returns

`void`

**`Example`**

```typescript
// Limpar todos os registros
registry.clear();

// Verificar se foi limpo
console.log('Agentes restantes:', registry.list().length); // 0
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:419](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L419)

___

### create

▸ **create**(`id`, `options?`): [`IAgent`](agent_interfaces_IAgent.IAgent.md)

Cria uma nova instância isolada do agente.

Cria uma nova instância do agente com a configuração registrada
como base, permitindo customizações específicas sem afetar
outras instâncias ou o agente registrado.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Identificador do agente no registry. |
| `options?` | [`AgentCreationOptions`](agent_interfaces_IAgentRegistry.AgentCreationOptions.md) | Opções de criação da instância. Permite customizações e controle de estado da instância. |

#### Returns

[`IAgent`](agent_interfaces_IAgent.IAgent.md)

Nova instância isolada do agente.

**`Throws`**

Error se o agente não for encontrado.

**`Example`**

```typescript
// Instância com configuração padrão
const agent1 = registry.create('researcher');

// Instância com customizações
const agent2 = registry.create('researcher', {
  customConfig: { temperature: 0.2, maxTokens: 2000 },
  fresh: true
});

// Instâncias são independentes
agent2.configure({ temperature: 0.9 }); // Não afeta agent1
```

**`See`**

 - [()](agent_interfaces_IAgentRegistry.IAgentRegistry.md#get) Para instância compartilhada
 - [AgentCreationOptions](agent_interfaces_IAgentRegistry.AgentCreationOptions.md) Para opções de criação

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:169](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L169)

___

### execute

▸ **execute**(`id`, `messages`, `options?`): `Promise`\<[`AgentExecutionResult`](agent_interfaces_IAgent.AgentExecutionResult.md)\>

Executa um agente diretamente do registry.

Convenience method que cria uma instância temporária do agente,
executa com as mensagens fornecidas e retorna o resultado,
tudo em uma única operação.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Identificador do agente no registry. |
| `messages` | [`Message`](memory_memory_interface.Message.md)[] | Mensagens de entrada para o agente. |
| `options?` | [`AgentExecutionOptions`](agent_interfaces_IAgentRegistry.AgentExecutionOptions.md) | Opções de execução do agente. Parâmetros como temperatura, tools, instruções extras, etc. |

#### Returns

`Promise`\<[`AgentExecutionResult`](agent_interfaces_IAgent.AgentExecutionResult.md)\>

Resultado da execução do agente.

**`Throws`**

Error se o agente não for encontrado ou execução falhar.

**`Example`**

```typescript
// Execução simples
const result = await registry.execute('assistant', [
  { role: 'user', content: 'Hello!' }
]);

// Execução com opções
const result2 = await registry.execute('researcher', messages, {
  temperature: 0.2,
  tools: [searchTool],
  additionalInstructions: 'Focus on recent developments'
});

if (result2.success) {
  console.log('Resposta:', result2.content);
} else {
  console.error('Erro:', result2.error);
}
```

**`See`**

 - [AgentExecutionOptions](agent_interfaces_IAgentRegistry.AgentExecutionOptions.md) Para opções de execução
 - [AgentExecutionResult](agent_interfaces_IAgent.AgentExecutionResult.md) Para formato do resultado

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:378](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L378)

___

### filterByType

▸ **filterByType**(`type`): `string`[]

Filtra agentes por tipo específico.

Retorna lista de IDs de agentes que correspondem
ao tipo especificado.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | Tipo do agente para filtrar. |

#### Returns

`string`[]

Lista de IDs dos agentes do tipo especificado.

**`Example`**

```typescript
const reactAgents = registry.filterByType('react');
console.log('Agentes ReAct:', reactAgents);
// ['researcher', 'coder', 'analyst']

const chatAgents = registry.filterByType('chat');
console.log('Agentes de Chat:', chatAgents);
// ['assistant', 'support-bot']
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:297](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L297)

___

### get

▸ **get**(`id`): [`IAgent`](agent_interfaces_IAgent.IAgent.md)

Obtém um agente registrado (instância compartilhada).

Retorna a instância registrada do agente. Note que esta é
uma instância compartilhada, então modificações afetarão
todos os usuários. Para instâncias isoladas, use create().

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Identificador do agente no registry. |

#### Returns

[`IAgent`](agent_interfaces_IAgent.IAgent.md)

A instância do agente registrado.

**`Throws`**

Error se o agente não for encontrado.

**`Example`**

```typescript
const agent = registry.get('researcher');

// ATENÇÃO: Instância compartilhada!
agent.configure({ temperature: 0.1 }); // Afeta todos os usuários
```

**`See`**

[()](agent_interfaces_IAgentRegistry.IAgentRegistry.md#create) Para instâncias isoladas

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:133](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L133)

___

### getInfo

▸ **getInfo**(`id`): [`AgentRegistryInfo`](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md)

Obtém informações detalhadas sobre um agente registrado.

Retorna metadados completos sobre o agente, incluindo
configuração, estatísticas de uso e informações temporais.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Identificador do agente no registry. |

#### Returns

[`AgentRegistryInfo`](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md)

Informações detalhadas do agente.

**`Throws`**

Error se o agente não for encontrado.

**`Example`**

```typescript
const info = registry.getInfo('researcher');
console.log('Nome:', info.agentInfo.name);
console.log('Tipo:', info.type);
console.log('Execuções:', info.executionCount);
console.log('Último erro:', info.lastError);
console.log('Registrado em:', info.registeredAt);
```

**`See`**

[AgentRegistryInfo](agent_interfaces_IAgentRegistry.AgentRegistryInfo.md) Para formato das informações

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:257](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L257)

___

### getStats

▸ **getStats**(): [`AgentRegistryStats`](agent_interfaces_IAgentRegistry.AgentRegistryStats.md)

Obtém estatísticas completas do registry.

Retorna dados agregados sobre todos os agentes registrados,
incluindo contadores, distribuições, performance e rankings.

#### Returns

[`AgentRegistryStats`](agent_interfaces_IAgentRegistry.AgentRegistryStats.md)

Estatísticas completas do registry.

**`Example`**

```typescript
const stats = registry.getStats();

console.log('Total de agentes:', stats.totalAgents);
console.log('Total de execuções:', stats.totalExecutions);
console.log('Taxa de sucesso:', (stats.successRate * 100).toFixed(1) + '%');
console.log('Tempo médio:', stats.averageExecutionTime + 'ms');
console.log('Distribuição por tipo:', stats.distributionByType);
console.log('Mais usados:', stats.mostUsedAgents);
```

**`See`**

[AgentRegistryStats](agent_interfaces_IAgentRegistry.AgentRegistryStats.md) Para formato das estatísticas

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:402](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L402)

___

### has

▸ **has**(`id`): `boolean`

Verifica se um agente está registrado no sistema.

Consulta rápida para verificar existência sem overhead
de instanciação.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Identificador do agente a ser verificado. |

#### Returns

`boolean`

true se o agente estiver registrado, false caso contrário.

**`Example`**

```typescript
if (registry.has('researcher')) {
  const agent = registry.create('researcher');
  // Usar o agente...
} else {
  console.log('Agente researcher não encontrado');
}
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:208](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L208)

___

### list

▸ **list**(): `string`[]

Lista todos os agentes registrados no sistema.

Retorna array com IDs de todos os agentes atualmente
registrados no registry.

#### Returns

`string`[]

Lista de IDs dos agentes registrados.

**`Example`**

```typescript
const allAgents = registry.list();
console.log('Agentes registrados:', allAgents);
// ['chat-assistant', 'researcher', 'coder', 'analyst']
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:186](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L186)

___

### listTypes

▸ **listTypes**(): `string`[]

Lista todos os tipos únicos de agentes disponíveis.

Retorna array com todos os tipos diferentes de agentes
registrados no sistema (ex: 'chat', 'react', 'custom').

#### Returns

`string`[]

Lista de tipos únicos de agentes.

**`Example`**

```typescript
const types = registry.listTypes();
console.log('Tipos disponíveis:', types);
// ['chat', 'react', 'research', 'coding']
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:274](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L274)

___

### register

▸ **register**(`id`, `config`, `options?`): `void`

Registra um agente no sistema centralizado.

Adiciona um novo agente ao registry com sua configuração completa,
permitindo que seja descoberto, instanciado e executado posteriormente.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Identificador único do agente no registry. Deve ser único para evitar conflitos. Usado para todas as operações. |
| `config` | [`IAgentConfig`](agent_interfaces_IAgentConfig.IAgentConfig.md) | Configuração completa do agente. Deve incluir type, provider, model, agentInfo e outras configurações. |
| `options?` | [`AgentRegistrationOptions`](agent_interfaces_IAgentRegistry.AgentRegistrationOptions.md) | Opções adicionais de registro. Controla comportamento como sobrescrita, validação e metadados. |

#### Returns

`void`

**`Throws`**

Error se o ID já existir (sem overwrite=true) ou configuração inválida.

**`Example`**

```typescript
// Registro básico
registry.register('chat-assistant', {
  type: 'chat',
  provider: 'openai',
  model: 'gpt-3.5-turbo',
  agentInfo: { name: 'Assistant', goal: 'Help users', backstory: 'Helpful AI' }
});

// Registro com opções
registry.register('researcher', researchConfig, {
  overwrite: true,
  validate: true,
  metadata: { category: 'research', version: '1.0' }
});
```

**`See`**

[AgentRegistrationOptions](agent_interfaces_IAgentRegistry.AgentRegistrationOptions.md) Para opções de registro

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:108](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L108)

___

### unregister

▸ **unregister**(`id`): `boolean`

Remove um agente do registry.

Remove permanentemente um agente do sistema, liberando
o ID para possível reuso e清理 recursos associados.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Identificador do agente a ser removido. |

#### Returns

`boolean`

true se o agente foi removido, false caso contrário.

**`Example`**

```typescript
const removed = registry.unregister('old-agent');
if (removed) {
  console.log('Agente removido com sucesso');
}

// Verificar remoção
console.log('Ainda existe?', registry.has('old-agent')); // false
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:231](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L231)

___

### update

▸ **update**(`id`, `config`, `options?`): `void`

Atualiza a configuração de um agente registrado.

Modifica a configuração de um agente existente, permitindo
ajustes dinâmicos sem necessidade de re-registro.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Identificador do agente no registry. |
| `config` | `Partial`\<[`IAgentConfig`](agent_interfaces_IAgentConfig.IAgentConfig.md)\> | Nova configuração parcial do agente. Propriedades fornecidas substituem as existentes. |
| `options?` | [`AgentUpdateOptions`](agent_interfaces_IAgentRegistry.AgentUpdateOptions.md) | Opções de atualização. Controla validação e aplicação das mudanças. |

#### Returns

`void`

**`Throws`**

Error se o agente não for encontrado ou configuração inválida.

**`Example`**

```typescript
// Atualizar temperatura
registry.update('researcher', {
  llmConfig: { temperature: 0.3 }
});

// Atualizar com opções
registry.update('coder', {
  model: 'gpt-4',
  tools: [newTool]
}, {
  validate: true,
  applyOnlyToNewInstances: true
});
```

**`See`**

[AgentUpdateOptions](agent_interfaces_IAgentRegistry.AgentUpdateOptions.md) Para opções de atualização

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:334](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L334)

___

### validateAll

▸ **validateAll**(): `string`[]

Valida todos os agentes registrados no sistema.

Executa validação completa em todos os agentes registrados,
retornando lista com erros encontrados para correção.

#### Returns

`string`[]

Lista com mensagens de erro de validação.
Array vazio indica que todos os agentes são válidos.

**`Example`**

```typescript
const errors = registry.validateAll();

if (errors.length === 0) {
  console.log('Todos os agentes são válidos');
} else {
  console.log('Erros encontrados:');
  errors.forEach(error => console.log('- ' + error));
}
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:442](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L442)
