# Interface: PromptBuilderConfig

[promptBuilder/promptBuilder.interface](../modules/promptBuilder_promptBuilder_interface.md).PromptBuilderConfig

Configuração para construir o System Prompt via PromptBuilder.

## Table of contents

### Properties

- [additionalInstructions](promptBuilder_promptBuilder_interface.PromptBuilderConfig.md#additionalinstructions)
- [agentInfo](promptBuilder_promptBuilder_interface.PromptBuilderConfig.md#agentinfo)
- [mode](promptBuilder_promptBuilder_interface.PromptBuilderConfig.md#mode)
- [tools](promptBuilder_promptBuilder_interface.PromptBuilderConfig.md#tools)

## Properties

### additionalInstructions

• `Optional` **additionalInstructions**: `string`

#### Defined in

promptBuilder/promptBuilder.interface.ts:23

___

### agentInfo

• **agentInfo**: [`AgentInfo`](promptBuilder_promptBuilder_interface.AgentInfo.md)

#### Defined in

promptBuilder/promptBuilder.interface.ts:22

___

### mode

• **mode**: [`PromptMode`](../modules/promptBuilder_promptBuilder_interface.md#promptmode)

O modo do agente a ser utilizado (ex.: 'react' ou 'chat').

#### Defined in

promptBuilder/promptBuilder.interface.ts:21

___

### tools

• `Optional` **tools**: [`ToolSchema`](promptBuilder_promptBuilder_interface.ToolSchema.md)[]

#### Defined in

promptBuilder/promptBuilder.interface.ts:24
