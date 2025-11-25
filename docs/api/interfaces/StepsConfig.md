# Interface: StepsConfig

Configuração base para construção do system prompt do agente.

## Table of contents

### Properties

- [additionalInstructions](StepsConfig.md#additionalinstructions)
- [agentInfo](StepsConfig.md#agentinfo)
- [mode](StepsConfig.md#mode)
- [taskList](StepsConfig.md#tasklist)
- [tools](StepsConfig.md#tools)

## Properties

### additionalInstructions

• `Optional` **additionalInstructions**: `string`

#### Defined in

[src/orchestrators/steps/interfaces.ts:17](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/steps/interfaces.ts#L17)

___

### agentInfo

• **agentInfo**: [`AgentInfo`](AgentInfo.md)

#### Defined in

[src/orchestrators/steps/interfaces.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/steps/interfaces.ts#L16)

___

### mode

• **mode**: [`AgentMode`](../README.md#agentmode)

#### Defined in

[src/orchestrators/steps/interfaces.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/steps/interfaces.ts#L15)

___

### taskList

• `Optional` **taskList**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] |

#### Defined in

[src/orchestrators/steps/interfaces.ts:19](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/steps/interfaces.ts#L19)

___

### tools

• `Optional` **tools**: [`ToolSchema`](../README.md#toolschema)[]

#### Defined in

[src/orchestrators/steps/interfaces.ts:18](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/steps/interfaces.ts#L18)
