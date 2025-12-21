# Interface: IAgentNodeOptions

[orchestrators/graph/nodes/interfaces/agentNode.interface](../modules/orchestrators_graph_nodes_interfaces_agentNode_interface.md).IAgentNodeOptions

## Table of contents

### Properties

- [additionalInstructions](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#additionalinstructions)
- [agentInfo](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#agentinfo)
- [autoExecuteTools](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#autoexecutetools)
- [customMessages](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#custommessages)
- [llm](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#llm)
- [maxTokens](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#maxtokens)
- [mode](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#mode)
- [promptConfig](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#promptconfig)
- [skipMemoryCommit](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#skipmemorycommit)
- [taskList](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#tasklist)
- [temperature](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#temperature)
- [tools](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#tools)
- [topP](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#topp)

## Properties

### additionalInstructions

• `Optional` **additionalInstructions**: `string`

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L10)

___

### agentInfo

• `Optional` **agentInfo**: [`AgentInfo`](promptBuilder_promptBuilder_interface.AgentInfo.md)

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L9)

___

### autoExecuteTools

• `Optional` **autoExecuteTools**: `boolean`

Se true, automaticamente detecta e executa tools na saída do LLM.
Isso integra createToolDetectionNode e createToolExecutorNode no agentNode.
Padrão: false (apenas invoca LLM sem executar tools)

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:26](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L26)

___

### customMessages

• `Optional` **customMessages**: [`Message`](memory_memory_interface.Message.md)[]

Mensagens customizadas para usar ao invés do histórico do engine.
Útil para contextos isolados ou casos especiais.
Se fornecido, sobrescreve o resultado de engine.getMessagesForLLM()

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:20](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L20)

___

### llm

• **llm**: [`AgentLLMConfig`](agent_interfaces_agentLLM_interface.AgentLLMConfig.md) \| [`AgentLLM`](../classes/agent_llm_agentLLM.AgentLLM.md)

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L6)

___

### maxTokens

• `Optional` **maxTokens**: `number`

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L14)

___

### mode

• `Optional` **mode**: `string`

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L8)

___

### promptConfig

• `Optional` **promptConfig**: [`PromptBuilderConfig`](promptBuilder_promptBuilder_interface.PromptBuilderConfig.md)

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L7)

___

### skipMemoryCommit

• `Optional` **skipMemoryCommit**: `boolean`

Se true, não adiciona automaticamente a saída do LLM ao histórico do engine.
Útil para workflows onde o commit de memória é condicional (ex: Generator-Critic)

**`Default`**

```ts
false
```

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:37](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L37)

___

### taskList

• `Optional` **taskList**: `Object`

Lista de tarefas para injetar no system prompt.
Se não fornecido aqui, o agentNode tentará extrair de state.metadata.taskList

#### Type declaration

| Name | Type |
| :------ | :------ |
| `items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] |

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:31](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L31)

___

### temperature

• `Optional` **temperature**: `number`

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L12)

___

### tools

• `Optional` **tools**: [`ToolSchema`](../modules/promptBuilder_promptBuilder_interface.md#toolschema)[]

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L11)

___

### topP

• `Optional` **topP**: `number`

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L13)
