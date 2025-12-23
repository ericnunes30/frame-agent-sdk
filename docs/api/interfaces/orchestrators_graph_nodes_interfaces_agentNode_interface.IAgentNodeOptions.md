# Interface: IAgentNodeOptions

[orchestrators/graph/nodes/interfaces/agentNode.interface](../modules/orchestrators_graph_nodes_interfaces_agentNode_interface.md).IAgentNodeOptions

## Table of contents

### Properties

- [additionalInstructions](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#additionalinstructions)
- [agentInfo](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#agentinfo)
- [autoExecuteTools](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#autoexecutetools)
- [contextHooks](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md#contexthooks)
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

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L11)

___

### agentInfo

• `Optional` **agentInfo**: [`AgentInfo`](promptBuilder_promptBuilder_interface.AgentInfo.md)

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L10)

___

### autoExecuteTools

• `Optional` **autoExecuteTools**: `boolean`

Se true, automaticamente detecta e executa tools na saída do LLM.
Isso integra createToolDetectionNode e createToolExecutorNode no agentNode.
Padrão: false (apenas invoca LLM sem executar tools)

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:27](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L27)

___

### contextHooks

• `Optional` **contextHooks**: [`ContextHooks`](memory_contextHooks_interface.ContextHooks.md)

Hooks de contexto para trimming/rewrite e retry (ex.: overflow handling).
Permite que apps (ex.: code-cli) pluguem estratégias avançadas sem wrappers de Graph.

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:44](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L44)

___

### customMessages

• `Optional` **customMessages**: [`Message`](memory_memory_interface.Message.md)[]

Mensagens customizadas para usar ao invés do histórico do engine.
Útil para contextos isolados ou casos especiais.
Se fornecido, sobrescreve o resultado de engine.getMessagesForLLM()

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:21](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L21)

___

### llm

• **llm**: [`AgentLLMConfig`](agent_interfaces_agentLLM_interface.AgentLLMConfig.md) \| [`AgentLLM`](../classes/agent_llm_agentLLM.AgentLLM.md)

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L7)

___

### maxTokens

• `Optional` **maxTokens**: `number`

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L15)

___

### mode

• `Optional` **mode**: `string`

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L9)

___

### promptConfig

• `Optional` **promptConfig**: [`PromptBuilderConfig`](promptBuilder_promptBuilder_interface.PromptBuilderConfig.md)

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L8)

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

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:38](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L38)

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

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:32](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L32)

___

### temperature

• `Optional` **temperature**: `number`

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L13)

___

### tools

• `Optional` **tools**: [`ToolSchema`](../modules/promptBuilder_promptBuilder_interface.md#toolschema)[]

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L12)

___

### topP

• `Optional` **topP**: `number`

#### Defined in

[src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/nodes/interfaces/agentNode.interface.ts#L14)
