# Interface: AgentRegistrationOptions

[agent/interfaces/IAgentRegistry](../modules/agent_interfaces_IAgentRegistry.md).AgentRegistrationOptions

Opções para registro de agentes no sistema.

Define parâmetros opcionais que controlam o comportamento
durante o registro de agentes, incluindo validação,
sobrescrita e metadados.

**`Example`**

```typescript
// Registro com validação
const options1: AgentRegistrationOptions = {
  validate: true,
  metadata: { version: '1.0', category: 'research' }
};

// Registro com sobrescrita
const options2: AgentRegistrationOptions = {
  overwrite: true,
  validate: false
};
```

## Table of contents

### Properties

- [metadata](agent_interfaces_IAgentRegistry.AgentRegistrationOptions.md#metadata)
- [overwrite](agent_interfaces_IAgentRegistry.AgentRegistrationOptions.md#overwrite)
- [validate](agent_interfaces_IAgentRegistry.AgentRegistrationOptions.md#validate)

## Properties

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadados adicionais para o agente.

Objeto com informações extras sobre o agente que podem
ser usadas para categorização, versionamento, analytics, etc.

**`Example`**

```typescript
metadata: {
  version: '1.0',
  category: 'research',
  author: 'team-ai',
  tags: ['nlp', 'analysis'],
  deprecated: false
}
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:515](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L515)

___

### overwrite

• `Optional` **overwrite**: `boolean`

Se deve sobrescrever um agente existente com o mesmo ID.

Quando true, permite re-registrar um agente com ID existente,
substituindo a configuração anterior. Quando false (padrão),
o registro falha se o ID já existir.

**`Example`**

```typescript
overwrite: true   // Substitui agente existente
overwrite: false  // Falha se ID já existe (padrão)
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:481](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L481)

___

### validate

• `Optional` **validate**: `boolean`

Se deve validar a configuração antes de registrar.

Quando true, executa validação completa da configuração
usando validateAgentConfig(). Quando false, registra
sem validação (mais rápido mas pode causar erros later).

**`Example`**

```typescript
validate: true   // Valida configuração (padrão seguro)
validate: false  // Pula validação (mais rápido)
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:496](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L496)
