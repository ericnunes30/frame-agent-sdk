# Interface: AgentRegistryStats

[agent/interfaces/IAgentRegistry](../modules/agent_interfaces_IAgentRegistry.md).AgentRegistryStats

Estatísticas completas do sistema de registry de agentes.

Estrutura com dados agregados sobre todos os agentes registrados,
incluindo contadores, distribuições, performance e rankings.

## Métricas Principais

- **Volume**: Total de agentes, tipos e execuções
- **Distribuição**: Como os agentes estão categorizados
- **Performance**: Taxa de sucesso e tempo médio de execução
- **Popularidade**: Rankings dos agentes mais usados

## Casos de Uso

- **Monitoring**: Acompanhar saúde do sistema
- **Analytics**: Entender padrões de uso
- **Otimização**: Identificar gargalos e oportunidades
- **Relatórios**: Gerar dashboards e relatórios

**`Example`**

```typescript
const stats: AgentRegistryStats = {
  totalAgents: 15,
  totalTypes: 4,
  distributionByType: {
    'chat': 6,
    'react': 5,
    'research': 3,
    'coding': 1
  },
  totalExecutions: 2847,
  successRate: 0.94,
  averageExecutionTime: 1250,
  mostUsedAgents: [
    { id: 'assistant', executions: 892 },
    { id: 'researcher', executions: 634 },
    { id: 'coder', executions: 445 }
  ]
};
```

**`See`**

[()](agent_interfaces_IAgentRegistry.IAgentRegistry.md#getstats) Para obter estatísticas

## Table of contents

### Properties

- [averageExecutionTime](agent_interfaces_IAgentRegistry.AgentRegistryStats.md#averageexecutiontime)
- [distributionByType](agent_interfaces_IAgentRegistry.AgentRegistryStats.md#distributionbytype)
- [mostUsedAgents](agent_interfaces_IAgentRegistry.AgentRegistryStats.md#mostusedagents)
- [successRate](agent_interfaces_IAgentRegistry.AgentRegistryStats.md#successrate)
- [totalAgents](agent_interfaces_IAgentRegistry.AgentRegistryStats.md#totalagents)
- [totalExecutions](agent_interfaces_IAgentRegistry.AgentRegistryStats.md#totalexecutions)
- [totalTypes](agent_interfaces_IAgentRegistry.AgentRegistryStats.md#totaltypes)

## Properties

### averageExecutionTime

• **averageExecutionTime**: `number`

Tempo médio de execução em milissegundos.

Média do tempo de execução de todos os agentes,
calculada apenas sobre execuções bem-sucedidas.
Indicador de performance geral do sistema.

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:915](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L915)

___

### distributionByType

• **distributionByType**: `Record`\<`string`, `number`\>

Distribuição de agentes por tipo.

Objeto que mapeia cada tipo para o número de agentes desse tipo.
Útil para entender como os agentes estão categorizados.

**`Example`**

```typescript
distributionByType: {
  'chat': 6,        // 6 agentes de chat
  'react': 5,       // 5 agentes ReAct
  'research': 3,    // 3 agentes de pesquisa
  'coding': 1       // 1 agente de programação
}
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:882](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L882)

___

### mostUsedAgents

• **mostUsedAgents**: \{ `executions`: `number` ; `id`: `string`  }[]

Ranking dos agentes mais utilizados.

Array ordenado com os agentes que tiveram mais execuções,
útil para identificar quais agentes são mais populares
ou críticos para o sistema.

**`Example`**

```typescript
mostUsedAgents: [
  { id: 'assistant', executions: 892 },
  { id: 'researcher', executions: 634 },
  { id: 'coder', executions: 445 }
]
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:933](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L933)

___

### successRate

• **successRate**: `number`

Taxa de sucesso das execuções (0.0 a 1.0).

Proporção de execuções bem-sucedidas em relação ao total.
Indicador importante da qualidade e confiabilidade do sistema.

**`Example`**

```typescript
successRate: 0.94  // 94% de sucesso
successRate: 0.87  // 87% de sucesso
successRate: 1.0   // 100% de sucesso
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:906](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L906)

___

### totalAgents

• **totalAgents**: `number`

Total de agentes atualmente registrados no sistema.

Contagem de todos os agentes no registry, independentemente
do tipo ou status. Útil para entender o tamanho do sistema.

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:856](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L856)

___

### totalExecutions

• **totalExecutions**: `number`

Total de execuções realizadas por todos os agentes.

Soma de todas as execuções (bem-sucedidas e com falha)
de todos os agentes registrados. Indicador de atividade
geral do sistema.

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:891](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L891)

___

### totalTypes

• **totalTypes**: `number`

Total de tipos únicos de agentes disponíveis.

Número de categorias diferentes de agentes (ex: 'chat', 'react').
Indica a diversidade de capacidades do sistema.

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:864](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgentRegistry.ts#L864)
