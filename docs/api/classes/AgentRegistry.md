# Class: AgentRegistry

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

 - [IAgentRegistry](../interfaces/IAgentRegistry.md) Para interface completa do registry
 - [IAgent](../interfaces/IAgent.md) Para interface dos agentes
 - [IAgentConfig](../interfaces/IAgentConfig.md) Para configuração de agentes

## Implements

- [`IAgentRegistry`](../interfaces/IAgentRegistry.md)

## Table of contents

### Constructors

- [constructor](AgentRegistry.md#constructor)

### Properties

- [agents](AgentRegistry.md#agents)
- [stats](AgentRegistry.md#stats)
- [instance](AgentRegistry.md#instance)

### Methods

- [clear](AgentRegistry.md#clear)
- [get](AgentRegistry.md#get)
- [getStats](AgentRegistry.md#getstats)
- [has](AgentRegistry.md#has)
- [list](AgentRegistry.md#list)
- [register](AgentRegistry.md#register)
- [unregister](AgentRegistry.md#unregister)
- [updateStats](AgentRegistry.md#updatestats)
- [getInstance](AgentRegistry.md#getinstance)

## Constructors

### constructor

• **new AgentRegistry**(): [`AgentRegistry`](AgentRegistry.md)

Construtor privado para implementar padrão Singleton.

Para obter a instância do registry, use AgentRegistry.getInstance().
O construtor pode ser usado diretamente apenas para testes unitários.

#### Returns

[`AgentRegistry`](AgentRegistry.md)

**`Example`**

```typescript
// Para uso normal (recomendado)
const registry = AgentRegistry.getInstance();

// Para testes (permite múltiplas instâncias)
const testRegistry = new AgentRegistry();
```

#### Defined in

[src/agent/registry/AgentRegistry.ts:135](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L135)

## Properties

### agents

• `Private` **agents**: `Map`\<`string`, \{ `agentClass`: (`config`: [`IAgentConfig`](../interfaces/IAgentConfig.md)) => [`IAgent`](../interfaces/IAgent.md) ; `config`: [`IAgentConfig`](../interfaces/IAgentConfig.md) ; `description?`: `string` ; `registeredAt`: `Date` ; `usageCount`: `number`  }\>

Mapa interno de agentes registrados

#### Defined in

[src/agent/registry/AgentRegistry.ts:104](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L104)

___

### stats

• `Private` **stats**: [`AgentRegistryStats`](../interfaces/AgentRegistryStats.md)

Estatísticas do registry

#### Defined in

[src/agent/registry/AgentRegistry.ts:118](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L118)

___

### instance

▪ `Static` `Private` **instance**: [`AgentRegistry`](AgentRegistry.md)

Instância singleton do registry

#### Defined in

[src/agent/registry/AgentRegistry.ts:101](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L101)

## Methods

### clear

▸ **clear**(): `void`

Limpa todos os registros

#### Returns

`void`

#### Implementation of

[IAgentRegistry](../interfaces/IAgentRegistry.md).[clear](../interfaces/IAgentRegistry.md#clear)

#### Defined in

[src/agent/registry/AgentRegistry.ts:336](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L336)

___

### get

▸ **get**(`name`, `config?`): [`IAgent`](../interfaces/IAgent.md)

Obtém um agente registrado

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `config?` | `Partial`\<[`IAgentConfig`](../interfaces/IAgentConfig.md)\> |

#### Returns

[`IAgent`](../interfaces/IAgent.md)

#### Implementation of

[IAgentRegistry](../interfaces/IAgentRegistry.md).[get](../interfaces/IAgentRegistry.md#get)

#### Defined in

[src/agent/registry/AgentRegistry.ts:268](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L268)

___

### getStats

▸ **getStats**(): [`AgentRegistryStats`](../interfaces/AgentRegistryStats.md)

Obtém estatísticas do registro

#### Returns

[`AgentRegistryStats`](../interfaces/AgentRegistryStats.md)

#### Implementation of

[IAgentRegistry](../interfaces/IAgentRegistry.md).[getStats](../interfaces/IAgentRegistry.md#getstats)

#### Defined in

[src/agent/registry/AgentRegistry.ts:349](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L349)

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

[IAgentRegistry](../interfaces/IAgentRegistry.md).[has](../interfaces/IAgentRegistry.md#has)

#### Defined in

[src/agent/registry/AgentRegistry.ts:329](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L329)

___

### list

▸ **list**(): [`AgentRegistryInfo`](../interfaces/AgentRegistryInfo.md)[]

Lista todos os agentes registrados

#### Returns

[`AgentRegistryInfo`](../interfaces/AgentRegistryInfo.md)[]

#### Implementation of

[IAgentRegistry](../interfaces/IAgentRegistry.md).[list](../interfaces/IAgentRegistry.md#list)

#### Defined in

[src/agent/registry/AgentRegistry.ts:300](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L300)

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
| `agentClass` | (`config`: [`IAgentConfig`](../interfaces/IAgentConfig.md)) => [`IAgent`](../interfaces/IAgent.md) | Classe construtora do agente (deve implementar IAgent). |
| `config` | [`IAgentConfig`](../interfaces/IAgentConfig.md) | Configuração completa do agente. |
| `options` | [`AgentRegistrationOptions`](../interfaces/AgentRegistrationOptions.md) | Opções adicionais de registro. |

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

[IAgentRegistry](../interfaces/IAgentRegistry.md).[register](../interfaces/IAgentRegistry.md#register)

#### Defined in

[src/agent/registry/AgentRegistry.ts:204](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L204)

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

[IAgentRegistry](../interfaces/IAgentRegistry.md).[unregister](../interfaces/IAgentRegistry.md#unregister)

#### Defined in

[src/agent/registry/AgentRegistry.ts:314](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L314)

___

### updateStats

▸ **updateStats**(): `void`

Atualiza as estatísticas do registro

#### Returns

`void`

#### Defined in

[src/agent/registry/AgentRegistry.ts:356](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L356)

___

### getInstance

▸ **getInstance**(): [`AgentRegistry`](AgentRegistry.md)

Obtém a instância singleton do AgentRegistry.

Método factory que garante que apenas uma instância do registry
exista durante toda a aplicação, proporcionando consistência
global no registro e descoberta de agentes.

#### Returns

[`AgentRegistry`](AgentRegistry.md)

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

[src/agent/registry/AgentRegistry.ts:164](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L164)
