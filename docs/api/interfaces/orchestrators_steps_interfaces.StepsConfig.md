# Interface: StepsConfig

[orchestrators/steps/interfaces](../modules/orchestrators_steps_interfaces.md).StepsConfig

Configuração base para construção do system prompt do agente.

## Table of contents

### Properties

- [additionalInstructions](orchestrators_steps_interfaces.StepsConfig.md#additionalinstructions)
- [agentInfo](orchestrators_steps_interfaces.StepsConfig.md#agentinfo)
- [mode](orchestrators_steps_interfaces.StepsConfig.md#mode)
- [taskList](orchestrators_steps_interfaces.StepsConfig.md#tasklist)
- [tools](orchestrators_steps_interfaces.StepsConfig.md#tools)

## Properties

### additionalInstructions

• `Optional` **additionalInstructions**: `string`

#### Defined in

[src/orchestrators/steps/interfaces.ts:33](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/steps/interfaces.ts#L33)

___

### agentInfo

• **agentInfo**: [`AgentInfo`](promptBuilder_promptBuilder_interface.AgentInfo.md)

#### Defined in

[src/orchestrators/steps/interfaces.ts:32](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/steps/interfaces.ts#L32)

___

### mode

• **mode**: [`AgentMode`](../modules/llmModes_modes.md#agentmode)

#### Defined in

[src/orchestrators/steps/interfaces.ts:31](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/steps/interfaces.ts#L31)

___

### taskList

• `Optional` **taskList**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] |

#### Defined in

[src/orchestrators/steps/interfaces.ts:35](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/steps/interfaces.ts#L35)

___

### tools

• `Optional` **tools**: [`ToolSchema`](../modules/promptBuilder_promptBuilder_interface.md#toolschema)[]

#### Defined in

[src/orchestrators/steps/interfaces.ts:34](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/steps/interfaces.ts#L34)
