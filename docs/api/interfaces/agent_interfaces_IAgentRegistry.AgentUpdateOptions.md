# Interface: AgentUpdateOptions

[agent/interfaces/IAgentRegistry](../modules/agent_interfaces_IAgentRegistry.md).AgentUpdateOptions

Opções para atualização de agentes registrados.

Define parâmetros que controlam como atualizações de configuração
são aplicadas, incluindo validação e escopo das mudanças.

**`Example`**

```typescript
// Atualização com validação
const options1: AgentUpdateOptions = {
  validate: true,
  applyOnlyToNewInstances: false
};

// Atualização silenciosa
const options2: AgentUpdateOptions = {
  validate: false,
  metadata: { updatedBy: 'admin', timestamp: Date.now() }
};
```

## Table of contents

### Properties

- [applyOnlyToNewInstances](agent_interfaces_IAgentRegistry.AgentUpdateOptions.md#applyonlytonewinstances)
- [metadata](agent_interfaces_IAgentRegistry.AgentUpdateOptions.md#metadata)
- [validate](agent_interfaces_IAgentRegistry.AgentUpdateOptions.md#validate)

## Properties

### applyOnlyToNewInstances

• `Optional` **applyOnlyToNewInstances**: `boolean`

Se deve aplicar as alterações apenas em novas instâncias.

Quando true, as mudanças afetam apenas instâncias criadas
após a atualização. Instâncias existentes mantêm a
configuração antiga. Quando false, todas as instâncias
(incluindo existentes) usam a nova configuração.

**`Example`**

```typescript
applyOnlyToNewInstances: true   // Só novas instâncias
applyOnlyToNewInstances: false  // Todas as instâncias (padrão)
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:627](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L627)

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadados adicionais para a atualização.

Informações extras sobre a atualização, úteis para
auditoria, versionamento e tracking de mudanças.

**`Example`**

```typescript
metadata: {
  updatedBy: 'admin',
  timestamp: Date.now(),
  reason: 'Performance optimization',
  version: '2.0'
}
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:645](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L645)

___

### validate

• `Optional` **validate**: `boolean`

Se deve validar a nova configuração.

Quando true, valida a configuração atualizada antes de
aplicar as mudanças. Quando false, aplica diretamente
sem validação (mais rápido mas pode causar inconsistências).

**`Example`**

```typescript
validate: true   // Valida antes de aplicar (padrão seguro)
validate: false  // Aplica diretamente (mais rápido)
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:611](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L611)
