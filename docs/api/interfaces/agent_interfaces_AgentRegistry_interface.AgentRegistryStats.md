# Interface: AgentRegistryStats

[agent/interfaces/AgentRegistry.interface](../modules/agent_interfaces_AgentRegistry_interface.md).AgentRegistryStats

Estatísticas do registro de agentes

## Table of contents

### Properties

- [agentsByType](agent_interfaces_AgentRegistry_interface.AgentRegistryStats.md#agentsbytype)
- [createdAt](agent_interfaces_AgentRegistry_interface.AgentRegistryStats.md#createdat)
- [mostUsed](agent_interfaces_AgentRegistry_interface.AgentRegistryStats.md#mostused)
- [totalAgents](agent_interfaces_AgentRegistry_interface.AgentRegistryStats.md#totalagents)

## Properties

### agentsByType

• **agentsByType**: `Record`\<`string`, `number`\>

Agentes por tipo

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:380](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/AgentRegistry.interface.ts#L380)

___

### createdAt

• **createdAt**: `Date`

Data da criação do registro

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:390](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/AgentRegistry.interface.ts#L390)

___

### mostUsed

• **mostUsed**: \{ `name`: `string` ; `usageCount`: `number`  }[]

Agentes mais usados

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:385](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/AgentRegistry.interface.ts#L385)

___

### totalAgents

• **totalAgents**: `number`

Total de agentes registrados

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:375](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/AgentRegistry.interface.ts#L375)
