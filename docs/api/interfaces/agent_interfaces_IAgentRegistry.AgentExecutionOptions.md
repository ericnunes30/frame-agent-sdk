# Interface: AgentExecutionOptions

[agent/interfaces/IAgentRegistry](../modules/agent_interfaces_IAgentRegistry.md).AgentExecutionOptions

Opções para execução de agentes via registry.

Define parâmetros que podem ser fornecidos para personalizar
a execução de agentes, incluindo configurações do modelo,
ferramentas e contexto adicional.

## Parâmetros de Execução

- **LLM**: temperature, topP, maxTokens para controle do modelo
- **Ferramentas**: tools para capacidades estendidas
- **Comportamento**: additionalInstructions para personalização
- **Interface**: stream para respostas em tempo real
- **Contexto**: context para dados adicionais

**`Example`**

```typescript
// Execução técnica
const techOptions: AgentExecutionOptions = {
  temperature: 0.2,
  maxTokens: 2000,
  tools: [calculatorTool, codeAnalyzerTool],
  additionalInstructions: 'Be precise and technical'
};

// Execução criativa
const creativeOptions: AgentExecutionOptions = {
  temperature: 0.9,
  topP: 0.95,
  stream: true,
  context: { domain: 'creative', style: 'artistic' }
};
```

**`See`**

 - [()](agent_interfaces_IAgentRegistry.IAgentRegistry.md#execute) Para execução via registry
 - [()](agent_interfaces_IAgent.IAgent.md#execute) Para execução direta

## Table of contents

### Properties

- [additionalInstructions](agent_interfaces_IAgentRegistry.AgentExecutionOptions.md#additionalinstructions)
- [context](agent_interfaces_IAgentRegistry.AgentExecutionOptions.md#context)
- [maxTokens](agent_interfaces_IAgentRegistry.AgentExecutionOptions.md#maxtokens)
- [stream](agent_interfaces_IAgentRegistry.AgentExecutionOptions.md#stream)
- [temperature](agent_interfaces_IAgentRegistry.AgentExecutionOptions.md#temperature)
- [tools](agent_interfaces_IAgentRegistry.AgentExecutionOptions.md#tools)
- [topP](agent_interfaces_IAgentRegistry.AgentExecutionOptions.md#topp)

## Properties

### additionalInstructions

• `Optional` **additionalInstructions**: `string`

Instruções adicionais para o agente.

Texto livre que será adicionado ao prompt do sistema
para personalizar o comportamento do agente durante
esta execução específica.

**`Example`**

```typescript
additionalInstructions: 'Always respond in Portuguese'
additionalInstructions: 'Focus on practical solutions'
additionalInstructions: 'Use simple language and examples'
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:993](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L993)

___

### context

• `Optional` **context**: `Record`\<`string`, `any`\>

Contexto adicional para esta execução.

Objeto com dados extras que podem ser usados pelo agente
para enriquecer sua resposta ou tomar decisões. Útil para
passar informações específicas desta execução.

**`Example`**

```typescript
context: {
  userId: 'user123',
  sessionId: 'session456',
  domain: 'healthcare',
  preferences: { language: 'pt-BR', tone: 'formal' },
  previousTopics: ['diabetes', 'exercise']
}
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:1089](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L1089)

___

### maxTokens

• `Optional` **maxTokens**: `number`

Máximo de tokens para esta execução.

Sobrescreve o maxTokens configurado no agente.
Limita o tamanho da resposta gerada.

**`Example`**

```typescript
maxTokens: 100   // Resposta curta
maxTokens: 1000  // Resposta padrão
maxTokens: 4000  // Resposta longa
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:1054](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L1054)

___

### stream

• `Optional` **stream**: `boolean`

Habilita streaming de resposta.

Quando true, a resposta é retornada em chunks conforme
gerada, permitindo interfaces mais responsivas.
Sobrescreve a configuração de streaming do agente.

**`Example`**

```typescript
stream: true   // Resposta em tempo real
stream: false  // Resposta completa (padrão)
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:1069](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L1069)

___

### temperature

• `Optional` **temperature**: `number`

Temperatura do modelo para esta execução.

Sobrescreve a temperatura configurada no agente.
Controla criatividade e aleatoriedade da resposta.

**`Example`**

```typescript
temperature: 0.1  // Mais determinístico
temperature: 0.7  // Equilíbrio (padrão)
temperature: 1.0  // Mais criativo
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:1024](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L1024)

___

### tools

• `Optional` **tools**: `any`[]

Ferramentas disponíveis para o agente.

Lista de ferramentas que o agente pode usar durante
esta execução. Sobrescreve as ferramentas padrão
configuradas no agente.

**`Example`**

```typescript
tools: [calculatorTool, searchTool, webScraperTool]
```

**`See`**

ToolSchema Para formato das ferramentas

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:1009](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L1009)

___

### topP

• `Optional` **topP**: `number`

TopP do modelo para esta execução.

Sobrescreve o topP configurado no agente.
Controla diversidade do vocabulário considerado.

**`Example`**

```typescript
topP: 0.1   // Vocabulário restrito
topP: 0.9   // Boa diversidade
topP: 1.0   // Sem limitação
```

#### Defined in

[src/agent/interfaces/IAgentRegistry.ts:1039](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/interfaces/IAgentRegistry.ts#L1039)
