# Interface: AgentCreationOptions

[agent/interfaces/IAgentRegistry](../modules/agent_interfaces_IAgentRegistry.md).AgentCreationOptions

Opções para criação de instâncias de agentes.

Define parâmetros para controlar como instâncias de agentes
são criadas, incluindo customizações de configuração e
controle de estado.

**`Example`**

```typescript
// Instância com customizações
const options1: AgentCreationOptions = {
  customConfig: { temperature: 0.3, maxTokens: 2000 },
  fresh: true
};

// Instância padrão
const options2: AgentCreationOptions = {
  fresh: false
};
```

## Table of contents

### Properties

- [customConfig](agent_interfaces_IAgentRegistry.AgentCreationOptions.md#customconfig)
- [fresh](agent_interfaces_IAgentRegistry.AgentCreationOptions.md#fresh)

## Properties

### customConfig

• `Optional` **customConfig**: `Partial`\<[`IAgentConfig`](agent_interfaces_IAgentConfig.IAgentConfig.md)\>

Configurações customizadas para a instância.

Configuração parcial que será mesclada com a configuração
registrada do agente, permitindo customizações específicas
para esta instância sem afetar o agente registrado.

**`Example`**

```typescript
customConfig: {
  llmConfig: { temperature: 0.2 },
  additionalInstructions: 'Be more technical',
  tools: [additionalTool]
}
```

**`See`**

[IAgentConfig](agent_interfaces_IAgentConfig.IAgentConfig.md) Para estrutura de configuração

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:558](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L558)

___

### fresh

• `Optional` **fresh**: `boolean`

Se deve criar uma instância limpa (sem estado anterior).

Quando true, a instância é criada com estado completamente
limpo, sem histórico ou caches. Quando false (padrão),
pode herdar estado de instâncias anteriores.

**`Example`**

```typescript
fresh: true   // Estado completamente limpo
fresh: false  // Pode herdar estado (padrão)
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:573](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L573)
