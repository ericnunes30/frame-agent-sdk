# Interface: AgentExecutionOptions

[agent/interfaces/IAgent](../modules/agent_interfaces_IAgent.md).AgentExecutionOptions

Opções de execução do agente.

Define parâmetros opcionais que podem ser fornecidos para personalizar
o comportamento do agente durante a execução, incluindo configurações
do modelo, ferramentas disponíveis e contexto adicional.

## Parâmetros de Modelo

- **temperature**: Controla criatividade das respostas (0.0 = determinístico, 1.0 = criativo)
- **topP**: Nucleus sampling para controle de diversidade
- **maxTokens**: Limite máximo de tokens na resposta
- **stream**: Habilita resposta em streaming para interações em tempo real

## Ferramentas e Contexto

- **tools**: Lista de ferramentas disponíveis para o agente usar
- **additionalInstructions**: Instruções extras para personalizar comportamento
- **context**: Dados adicionais para enriquecer a execução

**`Example`**

```typescript
// Configuração para agente criativo
const creativeOptions: AgentExecutionOptions = {
  temperature: 0.9,
  topP: 0.95,
  additionalInstructions: 'Seja criativo e use analogias interessantes'
};

// Configuração para agente técnico
const technicalOptions: AgentExecutionOptions = {
  temperature: 0.1,
  maxTokens: 2000,
  tools: [calculatorTool, codeAnalyzerTool],
  context: { domain: 'programming', language: 'TypeScript' }
};

// Configuração para streaming
const streamingOptions: AgentExecutionOptions = {
  stream: true,
  temperature: 0.7,
  tools: [realtimeSearchTool]
};
```

**`See`**

 - [ToolSchema](../modules/promptBuilder_promptBuilder_interface.md#toolschema) Para definição de ferramentas
 - [IAgentConfig](agent_interfaces_IAgentConfig.IAgentConfig.md) Para configuração base do agente

## Table of contents

### Properties

- [additionalInstructions](agent_interfaces_IAgent.AgentExecutionOptions.md#additionalinstructions)
- [context](agent_interfaces_IAgent.AgentExecutionOptions.md#context)
- [maxTokens](agent_interfaces_IAgent.AgentExecutionOptions.md#maxtokens)
- [stream](agent_interfaces_IAgent.AgentExecutionOptions.md#stream)
- [temperature](agent_interfaces_IAgent.AgentExecutionOptions.md#temperature)
- [tools](agent_interfaces_IAgent.AgentExecutionOptions.md#tools)
- [topP](agent_interfaces_IAgent.AgentExecutionOptions.md#topp)

## Properties

### additionalInstructions

• `Optional` **additionalInstructions**: `string`

Instruções adicionais para o agente.

Texto livre que será adicionado ao prompt do sistema para
personalizar o comportamento do agente. Útil para casos
específicos ou ajustes temporários.

**`Example`**

```typescript
additionalInstructions: 'Sempre responda em português e seja mais formal'
additionalInstructions: 'Use exemplos práticos e evite jargões técnicos'
additionalInstructions: 'Foque em soluções sustentáveis e econômicas'
```

#### Defined in

[src/agent/interfaces/IAgent.ts:316](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L316)

___

### context

• `Optional` **context**: `Record`\<`string`, `any`\>

Contexto adicional para execução.

Objeto com dados extras que podem ser usados pelo agente
para enriquecer suas respostas ou tomar decisões. Pode
incluir informações de domínio, preferências do usuário, etc.

**`Example`**

```typescript
context: {
  userPreferences: { language: 'pt-BR', tone: 'formal' },
  domain: 'healthcare',
  sessionId: 'abc123',
  previousTopics: ['diabetes', 'exercise']
}
```

#### Defined in

[src/agent/interfaces/IAgent.ts:420](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L420)

___

### maxTokens

• `Optional` **maxTokens**: `number`

Máximo de tokens para a resposta.

Limita o tamanho da resposta gerada pelo modelo. Útil para:
- Controlar custos de API
- Evitar respostas excessivamente longas
- Garantir respostas concisas

**`Example`**

```typescript
maxTokens: 100   // Resposta muito curta
maxTokens: 500   // Resposta média
maxTokens: 2000  // Resposta longa
```

#### Defined in

[src/agent/interfaces/IAgent.ts:387](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L387)

___

### stream

• `Optional` **stream**: `boolean`

Habilita streaming de resposta.

Quando true, a resposta é retornada em chunks conforme gerada,
permitindo interfaces mais responsivas e tempo real.

**`Example`**

```typescript
stream: true  // Para chat interfaces em tempo real
stream: false // Para processamento batch (padrão)
```

#### Defined in

[src/agent/interfaces/IAgent.ts:401](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L401)

___

### temperature

• `Optional` **temperature**: `number`

Temperatura do modelo (0.0 a 1.0).

Controla a criatividade e aleatoriedade das respostas:
- **0.0**: Respostas mais determinísticas e focadas
- **0.7**: Equilíbrio entre criatividade e consistência (padrão)
- **1.0**: Máxima criatividade e diversidade

**`Example`**

```typescript
temperature: 0.1  // Para tarefas técnicas e precisas
temperature: 0.7  // Para conversas gerais
temperature: 0.9  // Para tarefas criativas
```

#### Defined in

[src/agent/interfaces/IAgent.ts:352](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L352)

___

### tools

• `Optional` **tools**: [`ToolSchema`](../modules/promptBuilder_promptBuilder_interface.md#toolschema)[]

Ferramentas disponíveis para o agente.

Lista de schemas de ferramentas que o agente pode usar durante
a execução. As ferramentas devem estar registradas no sistema
e ser compatíveis com o tipo do agente.

**`Example`**

```typescript
tools: [
  { name: 'calculator', description: 'Realiza cálculos', schema: {...} },
  { name: 'search', description: 'Busca informações', schema: {...} }
];
```

**`See`**

[ToolSchema](../modules/promptBuilder_promptBuilder_interface.md#toolschema) Para formato dos schemas de ferramenta

#### Defined in

[src/agent/interfaces/IAgent.ts:335](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L335)

___

### topP

• `Optional` **topP**: `number`

TopP do modelo (0.0 a 1.0).

Nucleus sampling que controla a diversidade do vocabulário:
- **0.1**: Vocabulário restrito, respostas mais previsíveis
- **0.9**: Vocabulário amplo, mais diversidade
- **1.0**: Sem limitação de vocabulário

Geralmente usado em conjunto com temperature para controle fino.

**`Example`**

```typescript
topP: 0.1   // Respostas mais conservadoras
topP: 0.9   // Respostas mais diversificadas
```

#### Defined in

[src/agent/interfaces/IAgent.ts:370](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/interfaces/IAgent.ts#L370)
