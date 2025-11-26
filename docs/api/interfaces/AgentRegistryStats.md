# Interface: AgentRegistryStats

Estatísticas do registro de agentes

## Table of contents

### Properties

- [agentsByType](AgentRegistryStats.md#agentsbytype)
- [createdAt](AgentRegistryStats.md#createdat)
- [mostUsed](AgentRegistryStats.md#mostused)
- [totalAgents](AgentRegistryStats.md#totalagents)

## Properties

### agentsByType

• **agentsByType**: `Record`\<`string`, `number`\>

Agentes por tipo

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:380](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L380)

___

### createdAt

• **createdAt**: `Date`

Data da criação do registro

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:390](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L390)

___

### mostUsed

• **mostUsed**: \{ `name`: `string` ; `usageCount`: `number`  }[]

Agentes mais usados

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:385](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L385)

___

### totalAgents

• **totalAgents**: `number`

Total de agentes registrados

#### Defined in

[src/agent/interfaces/AgentRegistry.interface.ts:375](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/AgentRegistry.interface.ts#L375)
