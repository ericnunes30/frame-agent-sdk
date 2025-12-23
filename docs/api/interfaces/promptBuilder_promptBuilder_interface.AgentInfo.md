# Interface: AgentInfo

[promptBuilder/promptBuilder.interface](../modules/promptBuilder_promptBuilder_interface.md).AgentInfo

Informações essenciais do agente para compor o System Prompt.

Esta interface define os dados fundamentais que descrevem um agente de IA,
permitindo que o PromptBuilder construa prompts personalizados e contextualmente
relevantes para diferentes tipos de agentes.

**`Example`**

```typescript
const agentInfo: AgentInfo = {
  name: 'Assistente de Programação',
  goal: 'Ajudar desenvolvedores com código limpo e boas práticas',
  backstory: 'Especialista em TypeScript e Node.js com 10 anos de experiência'
};
```

**`Remarks`**

- O `name` é usado para identificação do agente no prompt
- O `goal` define o propósito principal e comportamento esperado
- O `backstory` fornece contexto histórico e especialização

## Table of contents

### Properties

- [backstory](promptBuilder_promptBuilder_interface.AgentInfo.md#backstory)
- [goal](promptBuilder_promptBuilder_interface.AgentInfo.md#goal)
- [name](promptBuilder_promptBuilder_interface.AgentInfo.md#name)

## Properties

### backstory

• **backstory**: `string`

Contexto histórico e background do agente.
Inclui especializações, experiência e características relevantes.

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:39](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/promptBuilder/promptBuilder.interface.ts#L39)

___

### goal

• **goal**: `string`

Objetivo principal do agente.
Define o que o agente deve fazer e como deve se comportar.

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:33](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/promptBuilder/promptBuilder.interface.ts#L33)

___

### name

• **name**: `string`

Nome do agente para identificação no System Prompt.
Deve ser descritivo e único para o tipo de agente.

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:27](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/promptBuilder/promptBuilder.interface.ts#L27)
