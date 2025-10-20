# Interface: StepsConfig

[orchestrators/steps/interfaces](../modules/orchestrators_steps_interfaces.md).StepsConfig

Configuração base para construção do system prompt do agente.

## Table of contents

### Properties

- [additionalInstructions](orchestrators_steps_interfaces.StepsConfig.md#additionalinstructions)
- [agentInfo](orchestrators_steps_interfaces.StepsConfig.md#agentinfo)
- [mode](orchestrators_steps_interfaces.StepsConfig.md#mode)
- [tools](orchestrators_steps_interfaces.StepsConfig.md#tools)

## Properties

### additionalInstructions

• `Optional` **additionalInstructions**: `string`

#### Defined in

orchestrators/steps/interfaces.ts:16

___

### agentInfo

• **agentInfo**: [`AgentInfo`](promptBuilder_promptBuilder_interface.AgentInfo.md)

#### Defined in

orchestrators/steps/interfaces.ts:15

___

### mode

• **mode**: [`PromptMode`](../modules/promptBuilder_promptBuilder_interface.md#promptmode)

#### Defined in

orchestrators/steps/interfaces.ts:14

___

### tools

• `Optional` **tools**: [`ToolSchema`](promptBuilder_promptBuilder_interface.ToolSchema.md)[]

#### Defined in

orchestrators/steps/interfaces.ts:17
