# Class: AgentRegistry

[agent/registry/AgentRegistry](../modules/agent_registry_AgentRegistry.md).AgentRegistry

Implementação do sistema de registro centralizado de agentes de IA.

Esta classe implementa a interface IAgentRegistry fornecendo um sistema
completo para registrar, gerenciar, descobrir e executar agentes de IA
de forma centralizada e organizada.

## Características Principais

- **Padrão Singleton**: Uma única instância global para todo o sistema
- **Registro Flexível**: Suporte a agentes customizados com configurações variadas
- **Descoberta Dinâmica**: Métodos para listar, filtrar e encontrar agentes
- **Instanciação Controlada**: Criação de instâncias com configurações customizadas
- **Estatísticas Integradas**: Rastreamento automático de uso e performance
- **Validação Automática**: Verificação de configurações durante registro

## Casos de Uso

- **Bibliotecas de Agentes**: Organizar coleções de agentes reutilizáveis
- **Sistemas Multi-Agente**: Coordenar múltiplos agentes especializados
- **Workflows Dinâmicos**: Selecionar agentes baseados em contexto
- **Plugin Systems**: Suporte a sistemas de plugins de agentes
- **Load Balancing**: Distribuir carga entre instâncias de agentes

**`Example`**

```typescript
// 1. Criar agente customizado
class DataAnalysisAgent implements IAgent {
  public readonly id = 'data-analyzer';
  public readonly type = 'analysis';
  public readonly config: IAgentConfig;

  constructor(config: IAgentConfig) {
    this.config = config;
  }

  async execute(messages: Message[], options?: AgentExecutionOptions): Promise<AgentExecutionResult> {
    // Lógica específica de análise de dados
    const result = await this.analyzeData(messages);
    return {
      content: result.summary,
      messages: [...messages, { role: 'assistant', content: result.summary }],
      success: true,
      metadata: { analysisType: 'statistical', confidence: result.confidence }
    };
  }

  // ... outros métodos da interface IAgent
}

// 2. Registrar no sistema
AgentRegistry.getInstance().register('data-analyzer', DataAnalysisAgent, {
  type: 'analysis',
  provider: 'openai',
  model: 'gpt-4',
  agentInfo: {
    name: 'Data Analyzer',
    role: 'Statistical analysis expert',
    backstory: 'Specialized in data analysis and statistical modeling'
  },
  llmConfig: { temperature: 0.3 },
  tools: [statisticsTool, visualizationTool]
}, {
  description: 'Agente especializado em análise estatística de dados',
  validate: true
});

// 3. Usar em workflows
const registry = AgentRegistry.getInstance();

// Listar agentes disponíveis
const agents = registry.list();
console.log('Agentes disponíveis:', agents);

// Filtrar por tipo
const analysisAgents = registry.filterByType('analysis');

// Executar diretamente
const result = await registry.execute('data-analyzer', [
  { role: 'user', content: 'Analyze this dataset: [1,2,3,4,5]' }
], { temperature: 0.2 });

console.log('Resultado:', result.content);
```

**`See`**

 - [IAgentRegistry](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md) Para interface completa do registry
 - [IAgent](../interfaces/agent_interfaces_IAgent.IAgent.md) Para interface dos agentes
 - [IAgentConfig](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md) Para configuração de agentes

## Implements

- [`IAgentRegistry`](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md)

## Table of contents

### Constructors

- [constructor](agent_registry_AgentRegistry.AgentRegistry.md#constructor)

### Properties

- [agents](agent_registry_AgentRegistry.AgentRegistry.md#agents)
- [stats](agent_registry_AgentRegistry.AgentRegistry.md#stats)
- [instance](agent_registry_AgentRegistry.AgentRegistry.md#instance)

### Methods

- [clear](agent_registry_AgentRegistry.AgentRegistry.md#clear)
- [get](agent_registry_AgentRegistry.AgentRegistry.md#get)
- [getStats](agent_registry_AgentRegistry.AgentRegistry.md#getstats)
- [has](agent_registry_AgentRegistry.AgentRegistry.md#has)
- [list](agent_registry_AgentRegistry.AgentRegistry.md#list)
- [register](agent_registry_AgentRegistry.AgentRegistry.md#register)
- [unregister](agent_registry_AgentRegistry.AgentRegistry.md#unregister)
- [updateStats](agent_registry_AgentRegistry.AgentRegistry.md#updatestats)
- [getInstance](agent_registry_AgentRegistry.AgentRegistry.md#getinstance)

## Constructors

### constructor

• **new AgentRegistry**(): [`AgentRegistry`](agent_registry_AgentRegistry.AgentRegistry.md)

Construtor privado para implementar padrão Singleton.

Para obter a instância do registry, use AgentRegistry.getInstance().
O construtor pode ser usado diretamente apenas para testes unitários.

#### Returns

[`AgentRegistry`](agent_registry_AgentRegistry.AgentRegistry.md)

**`Example`**

```typescript
// Para uso normal (recomendado)
const registry = AgentRegistry.getInstance();

// Para testes (permite múltiplas instâncias)
const testRegistry = new AgentRegistry();
```

#### Defined in

[src/agent/registry/AgentRegistry.ts:136](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L136)

## Properties

### agents

• `Private` **agents**: `Map`\<`string`, \{ `agentClass`: (`config`: [`IAgentConfig`](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md)) => [`IAgent`](../interfaces/agent_interfaces_IAgent.IAgent.md) ; `config`: [`IAgentConfig`](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md) ; `description?`: `string` ; `registeredAt`: `Date` ; `usageCount`: `number`  }\>

Mapa interno de agentes registrados

#### Defined in

[src/agent/registry/AgentRegistry.ts:105](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L105)

___

### stats

• `Private` **stats**: [`AgentRegistryStats`](../interfaces/agent_interfaces_AgentRegistry_interface.AgentRegistryStats.md)

Estatísticas do registry

#### Defined in

[src/agent/registry/AgentRegistry.ts:119](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L119)

___

### instance

▪ `Static` `Private` **instance**: [`AgentRegistry`](agent_registry_AgentRegistry.AgentRegistry.md)

Instância singleton do registry

#### Defined in

[src/agent/registry/AgentRegistry.ts:102](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L102)

## Methods

### clear

▸ **clear**(): `void`

Limpa todos os registros

#### Returns

`void`

#### Implementation of

[IAgentRegistry](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md).[clear](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md#clear)

#### Defined in

[src/agent/registry/AgentRegistry.ts:337](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L337)

___

### get

▸ **get**(`name`, `config?`): [`IAgent`](../interfaces/agent_interfaces_IAgent.IAgent.md)

Obtém um agente registrado

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config?` | `Partial`\<[`IAgentConfig`](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md)\> |

#### Returns

[`IAgent`](../interfaces/agent_interfaces_IAgent.IAgent.md)

#### Implementation of

[IAgentRegistry](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md).[get](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md#get)

#### Defined in

[src/agent/registry/AgentRegistry.ts:269](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L269)

___

### getStats

▸ **getStats**(): [`AgentRegistryStats`](../interfaces/agent_interfaces_AgentRegistry_interface.AgentRegistryStats.md)

Obtém estatísticas do registro

#### Returns

[`AgentRegistryStats`](../interfaces/agent_interfaces_AgentRegistry_interface.AgentRegistryStats.md)

#### Implementation of

[IAgentRegistry](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md).[getStats](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md#getstats)

#### Defined in

[src/agent/registry/AgentRegistry.ts:350](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L350)

___

### has

▸ **has**(`name`): `boolean`

Verifica se um agente está registrado

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`boolean`

#### Implementation of

[IAgentRegistry](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md).[has](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md#has)

#### Defined in

[src/agent/registry/AgentRegistry.ts:330](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L330)

___

### list

▸ **list**(): [`AgentRegistryInfo`](../interfaces/agent_interfaces_AgentRegistry_interface.AgentRegistryInfo.md)[]

Lista todos os agentes registrados

#### Returns

[`AgentRegistryInfo`](../interfaces/agent_interfaces_AgentRegistry_interface.AgentRegistryInfo.md)[]

#### Implementation of

[IAgentRegistry](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md).[list](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md#list)

#### Defined in

[src/agent/registry/AgentRegistry.ts:301](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L301)

___

### register

▸ **register**(`name`, `agentClass`, `config`, `options?`): `boolean`

Registra um agente customizado no sistema.

Adiciona um novo agente ao registry com sua configuração e metadados,
permitindo que seja descoberto, instanciado e executado posteriormente.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Nome único do agente no registry. |
| `agentClass` | (`config`: [`IAgentConfig`](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md)) => [`IAgent`](../interfaces/agent_interfaces_IAgent.IAgent.md) | Classe construtora do agente (deve implementar IAgent). |
| `config` | [`IAgentConfig`](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md) | Configuração completa do agente. |
| `options` | [`AgentRegistrationOptions`](../interfaces/agent_interfaces_AgentRegistry_interface.AgentRegistrationOptions.md) | Opções adicionais de registro. |

#### Returns

`boolean`

true se o registro foi bem-sucedido, false caso contrário.

**`Example`**

```typescript
const registry = AgentRegistry.getInstance();

// Registro básico
registry.register('chat-assistant', ChatAgent, {
  type: 'chat',
  provider: 'openai',
  model: 'gpt-3.5-turbo',
  agentInfo: { name: 'Assistant', goal: 'Help users', backstory: 'Friendly AI' }
});

// Registro com opções
registry.register('researcher', ResearchAgent, researchConfig, {
  description: 'Specialized research agent',
  overwrite: true,
  validate: true
});
```

#### Implementation of

[IAgentRegistry](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md).[register](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md#register)

#### Defined in

[src/agent/registry/AgentRegistry.ts:205](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L205)

___

### unregister

▸ **unregister**(`name`): `boolean`

Remove um agente do registro

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`boolean`

#### Implementation of

[IAgentRegistry](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md).[unregister](../interfaces/agent_interfaces_AgentRegistry_interface.IAgentRegistry.md#unregister)

#### Defined in

[src/agent/registry/AgentRegistry.ts:315](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L315)

___

### updateStats

▸ **updateStats**(): `void`

Atualiza as estatísticas do registro

#### Returns

`void`

#### Defined in

[src/agent/registry/AgentRegistry.ts:357](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L357)

___

### getInstance

▸ **getInstance**(): [`AgentRegistry`](agent_registry_AgentRegistry.AgentRegistry.md)

Obtém a instância singleton do AgentRegistry.

Método factory que garante que apenas uma instância do registry
exista durante toda a aplicação, proporcionando consistência
global no registro e descoberta de agentes.

#### Returns

[`AgentRegistry`](agent_registry_AgentRegistry.AgentRegistry.md)

A instância singleton do AgentRegistry.

**`Example`**

```typescript
const registry = AgentRegistry.getInstance();

// Todas as chamadas retornam a mesma instância
const registry1 = AgentRegistry.getInstance();
const registry2 = AgentRegistry.getInstance();

console.log(registry1 === registry2); // true
```

#### Defined in

[src/agent/registry/AgentRegistry.ts:165](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/registry/AgentRegistry.ts#L165)
