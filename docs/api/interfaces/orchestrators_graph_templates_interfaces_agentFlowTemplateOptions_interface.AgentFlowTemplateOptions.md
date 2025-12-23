# Interface: AgentFlowTemplateOptions

[orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface](../modules/orchestrators_graph_templates_interfaces_agentFlowTemplateOptions_interface.md).AgentFlowTemplateOptions

## Table of contents

### Properties

- [agent](orchestrators_graph_templates_interfaces_agentFlowTemplateOptions_interface.AgentFlowTemplateOptions.md#agent)
- [enableReactValidation](orchestrators_graph_templates_interfaces_agentFlowTemplateOptions_interface.AgentFlowTemplateOptions.md#enablereactvalidation)
- [hooks](orchestrators_graph_templates_interfaces_agentFlowTemplateOptions_interface.AgentFlowTemplateOptions.md#hooks)
- [nodeIds](orchestrators_graph_templates_interfaces_agentFlowTemplateOptions_interface.AgentFlowTemplateOptions.md#nodeids)
- [policies](orchestrators_graph_templates_interfaces_agentFlowTemplateOptions_interface.AgentFlowTemplateOptions.md#policies)
- [toolDetection](orchestrators_graph_templates_interfaces_agentFlowTemplateOptions_interface.AgentFlowTemplateOptions.md#tooldetection)
- [toolExecutor](orchestrators_graph_templates_interfaces_agentFlowTemplateOptions_interface.AgentFlowTemplateOptions.md#toolexecutor)

## Properties

### agent

• **agent**: [`IAgentNodeOptions`](orchestrators_graph_nodes_interfaces_agentNode_interface.IAgentNodeOptions.md)

Opções do nó de agente (LLM/prompt/tools/memória/telemetria etc).
Reaproveita o contrato já estabilizado do SDK.

#### Defined in

[src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts#L11)

___

### enableReactValidation

• `Optional` **enableReactValidation**: `boolean`

Habilita a validação ReAct antes da detecção de tools. Default: true.

#### Defined in

[src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts#L14)

___

### hooks

• `Optional` **hooks**: [`AgentFlowTemplateHooks`](orchestrators_graph_templates_interfaces_agentFlowTemplateHooks_interface.AgentFlowTemplateHooks.md)

Permite substituir os hooks padrão.
Se omitido, o template usa implementações default (seed/capture).

#### Defined in

[src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts:20](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts#L20)

___

### nodeIds

• `Optional` **nodeIds**: `Partial`\<\{ `agent`: `string` ; `askUser`: `string` ; `capture`: `string` ; `end`: `string` ; `reactValidation`: `string` ; `seed`: `string` ; `toolDetection`: `string` ; `toolExecutor`: `string`  }\>

Nomes de nós (avançado). Use apenas se o app precisa de IDs estáveis para telemetria.

#### Defined in

[src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts:43](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts#L43)

___

### policies

• `Optional` **policies**: [`AgentFlowTemplatePolicies`](orchestrators_graph_templates_interfaces_agentFlowTemplatePolicies_interface.AgentFlowTemplatePolicies.md)

Políticas de roteamento/finalização.
Se omitido, usa defaults compatíveis com o code-cli.

#### Defined in

[src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts:26](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts#L26)

___

### toolDetection

• `Optional` **toolDetection**: [`GraphNode`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)

Permite customizar o detector de tools.
Se omitido, usa `createToolDetectionNode()`.

#### Defined in

[src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts:38](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts#L38)

___

### toolExecutor

• `Optional` **toolExecutor**: [`GraphNode`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)

Permite customizar o executor de tools (ex.: wrapper com política de erro).
Se omitido, usa `createToolExecutorNode()` com proteção de erro.

#### Defined in

[src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts:32](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/interfaces/agentFlowTemplateOptions.interface.ts#L32)
