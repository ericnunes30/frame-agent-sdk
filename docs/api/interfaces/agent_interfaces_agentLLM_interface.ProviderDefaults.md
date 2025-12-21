# Interface: ProviderDefaults

[agent/interfaces/agentLLM.interface](../modules/agent_interfaces_agentLLM_interface.md).ProviderDefaults

Parâmetros padrão por provedor de LLM.

Define valores padrão que são aplicados quando parâmetros não são
explicitamente fornecidos nas chamadas ao modelo. Permite configurar
comportamento consistente por provedor.

## Parâmetros Suportados

- **temperature**: Controla criatividade das respostas (0.0 = determinístico, 1.0 = criativo)
- **topP**: Nucleus sampling para controle de diversidade vocabular
- **maxTokens**: Limite máximo de tokens na resposta gerada

## Valores Recomendados

- **temperature**: 0.5 (equilíbrio entre criatividade e consistência)
- **topP**: 1.0 (sem limitação de vocabulário)
- **maxTokens**: 1000 (resposta padrão)

**`Example`**

```typescript
// Configuração para agente técnico
const technicalDefaults: ProviderDefaults = {
  temperature: 0.2,    // Respostas mais precisas
  topP: 0.9,          // Boa diversidade
  maxTokens: 1500     // Respostas detalhadas
};

// Configuração para agente criativo
const creativeDefaults: ProviderDefaults = {
  temperature: 0.8,    // Mais criativo
  topP: 0.95,         // Alta diversidade
  maxTokens: 2000     // Respostas longas
};
```

## Table of contents

### Properties

- [maxContextTokens](agent_interfaces_agentLLM_interface.ProviderDefaults.md#maxcontexttokens)
- [maxTokens](agent_interfaces_agentLLM_interface.ProviderDefaults.md#maxtokens)
- [temperature](agent_interfaces_agentLLM_interface.ProviderDefaults.md#temperature)
- [topP](agent_interfaces_agentLLM_interface.ProviderDefaults.md#topp)

## Properties

### maxContextTokens

• `Optional` **maxContextTokens**: `number`

Máximo de tokens para o contexto (memória).

Define o limite máximo de tokens que podem ser usados
para o contexto da conversa (system prompt + histórico).

**`Example`**

```typescript
maxContextTokens: 128000  // Para modelos com grande contexto
maxContextTokens: 8000     // Para modelos padrão
```

#### Defined in

[src/agent/interfaces/agentLLM.interface.ts:66](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/agentLLM.interface.ts#L66)

___

### maxTokens

• `Optional` **maxTokens**: `number`

Máximo de tokens de saída.

Limita o tamanho da resposta gerada pelo modelo:
- **100-500**: Respostas curtas e diretas
- **500-2000**: Respostas médias e detalhadas
- **2000+**: Respostas longas e abrangentes

**`Example`**

```typescript
maxTokens: 100   // Resposta muito concisa
maxTokens: 1000  // Resposta padrão
maxTokens: 4000  // Resposta detalhada
```

#### Defined in

[src/agent/interfaces/agentLLM.interface.ts:101](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/agentLLM.interface.ts#L101)

___

### temperature

• `Optional` **temperature**: `number`

Temperatura do modelo (0.0 a 1.0).

Controla a criatividade e aleatoriedade das respostas:
- **0.0-0.3**: Respostas determinísticas (tarefas técnicas)
- **0.4-0.7**: Equilíbrio (conversas gerais)
- **0.8-1.0**: Mais criativas (brainstorming)

**`Example`**

```typescript
temperature: 0.2  // Para cálculos precisos
temperature: 0.7  // Para conversas naturais
temperature: 0.9  // Para tarefas criativas
```

#### Defined in

[src/agent/interfaces/agentLLM.interface.ts:53](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/agentLLM.interface.ts#L53)

___

### topP

• `Optional` **topP**: `number`

Núcleo de sampling (0.0 a 1.0).

Controla a diversidade do vocabulário considerado:
- **0.1**: Vocabulário restrito, respostas previsíveis
- **0.5**: Equilíbrio entre previsibilidade e diversidade
- **0.9-1.0**: Vocabulário amplo, máxima diversidade

Geralmente usado em conjunto com temperature.

**`Example`**

```typescript
topP: 0.1   // Respostas conservadoras
topP: 0.9   // Respostas diversificadas
```

#### Defined in

[src/agent/interfaces/agentLLM.interface.ts:84](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/agentLLM.interface.ts#L84)
