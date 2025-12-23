# Module: agent/interfaces/IAgentConfig

## Table of contents

### References

- [ToolSchema](agent_interfaces_IAgentConfig.md#toolschema)

### Interfaces

- [IAgentConfig](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md)

### Type Aliases

- [AgentType](agent_interfaces_IAgentConfig.md#agenttype)

### Variables

- [DEFAULT\_AGENT\_CONFIG](agent_interfaces_IAgentConfig.md#default_agent_config)

### Functions

- [validateAgentConfig](agent_interfaces_IAgentConfig.md#validateagentconfig)

## References

### ToolSchema

Re-exports [ToolSchema](promptBuilder_promptBuilder_interface.md#toolschema)

## Type Aliases

### AgentType

Ƭ **AgentType**: ``"chat"`` \| ``"react"`` \| `string`

Tipos de agente suportados pelo sistema.

Define os modos de operação disponíveis para agentes de IA,
cada um com comportamentos e capacidades específicas.

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/interfaces/IAgentConfig.ts#L14)

## Variables

### DEFAULT\_AGENT\_CONFIG

• `Const` **DEFAULT\_AGENT\_CONFIG**: `Partial`\<[`IAgentConfig`](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md)\>

Configuração padrão para agentes do sistema.

Valores padrão sensatos que podem ser usados como base
para configurações de agentes, garantindo comportamento
consistente e configurações razoáveis.

## Valores Padrão

- **LLM**: temperature moderada (0.5), topP completo (1.0), maxTokens padrão (1000)
- **Memória**: contexto amplo (8192 tokens), preservar system prompt, histórico médio (100 mensagens)

**`Example`**

```typescript
// Usar como base para configuração customizada
const myConfig: Partial<IAgentConfig> = {
  ...DEFAULT_AGENT_CONFIG,
  type: 'react',
  provider: 'openai',
  model: 'gpt-4',
  agentInfo: {
    name: 'Meu Agente',
    role: 'Assistente personalizado',
    backstory: 'Agente criado para tarefas específicas'
  }
};

// Validar configuração baseada no padrão
const errors = validateAgentConfig(myConfig as IAgentConfig);
if (errors.length > 0) {
  console.error('Configuração inválida:', errors);
}
```

**`See`**

 - [IAgentConfig](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md) Para estrutura completa da configuração
 - [validateAgentConfig](agent_interfaces_IAgentConfig.md#validateagentconfig) Para validação de configurações

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:414](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/interfaces/IAgentConfig.ts#L414)

## Functions

### validateAgentConfig

▸ **validateAgentConfig**(`config`): `string`[]

Valida configuração de agente e retorna lista de erros.

Função utilitária que verifica se uma configuração de agente
está completa e válida, retornando array com mensagens de erro
descritivas para problemas encontrados.

## Validações Realizadas

- **Campos Obrigatórios**: type, provider, model, agentInfo
- **AgentInfo**: name, goal, backstory
- **LLM Config**: ranges válidos para temperature, topP, maxTokens
- **Tipos**: Verificação de tipos básicos

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`IAgentConfig`](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md) | Configuração do agente a ser validada. |

#### Returns

`string`[]

Array com mensagens de erro. Array vazio = configuração válida.

**`Example`**

```typescript
// Configuração válida
const validConfig: IAgentConfig = {
  type: 'chat',
  provider: 'openai',
  model: 'gpt-4',
  agentInfo: {
    name: 'Assistente',
    role: 'Ajuda usuários',
    backstory: 'Agente prestativo'
  }
};

const errors = validateAgentConfig(validConfig);
console.log(errors.length); // 0

// Configuração inválida
const invalidConfig = {
  type: '',
  provider: 'openai',
  model: 'gpt-4'
};

const errors2 = validateAgentConfig(invalidConfig as IAgentConfig);
console.log(errors2);
// ['Tipo do agente é obrigatório', 'Informações do agente são obrigatórias']
```

**`See`**

 - [IAgentConfig](../interfaces/agent_interfaces_IAgentConfig.IAgentConfig.md) Para estrutura da configuração
 - [DEFAULT_AGENT_CONFIG](agent_interfaces_IAgentConfig.md#default_agent_config) Para valores padrão

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:477](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/interfaces/IAgentConfig.ts#L477)
