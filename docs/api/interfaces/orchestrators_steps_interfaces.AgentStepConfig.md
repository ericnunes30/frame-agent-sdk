# Interface: AgentStepConfig

[orchestrators/steps/interfaces](../modules/orchestrators_steps_interfaces.md).AgentStepConfig

Configuração de agente com suporte a LLMConfig ou instância LLM

## Table of contents

### Properties

- [additionalInstructions](orchestrators_steps_interfaces.AgentStepConfig.md#additionalinstructions)
- [agentInfo](orchestrators_steps_interfaces.AgentStepConfig.md#agentinfo)
- [llm](orchestrators_steps_interfaces.AgentStepConfig.md#llm)
- [mode](orchestrators_steps_interfaces.AgentStepConfig.md#mode)
- [taskList](orchestrators_steps_interfaces.AgentStepConfig.md#tasklist)
- [tools](orchestrators_steps_interfaces.AgentStepConfig.md#tools)

## Properties

### additionalInstructions

• `Optional` **additionalInstructions**: `string`

#### Defined in

[src/orchestrators/steps/interfaces.ts:17](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/interfaces.ts#L17)

___

### agentInfo

• **agentInfo**: [`AgentInfo`](promptBuilder_promptBuilder_interface.AgentInfo.md)

#### Defined in

[src/orchestrators/steps/interfaces.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/interfaces.ts#L16)

___

### llm

• `Optional` **llm**: [`AgentLLMConfig`](agent_interfaces_agentLLM_interface.AgentLLMConfig.md) \| [`AgentLLM`](../classes/agent_llm_agentLLM.AgentLLM.md)

#### Defined in

[src/orchestrators/steps/interfaces.ts:26](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/interfaces.ts#L26)

___

### mode

• **mode**: [`AgentMode`](../modules/llmModes_modes.md#agentmode)

#### Defined in

[src/orchestrators/steps/interfaces.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/interfaces.ts#L15)

___

### taskList

• `Optional` **taskList**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] |

#### Defined in

[src/orchestrators/steps/interfaces.ts:19](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/interfaces.ts#L19)

___

### tools

• `Optional` **tools**: [`ToolSchema`](../modules/promptBuilder_promptBuilder_interface.md#toolschema)[]

#### Defined in

[src/orchestrators/steps/interfaces.ts:18](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/interfaces.ts#L18)
