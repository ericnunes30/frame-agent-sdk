# Module: orchestrators/graph/templates/agentFlowTemplate

## Table of contents

### Functions

- [createAgentFlowTemplate](orchestrators_graph_templates_agentFlowTemplate.md#createagentflowtemplate)

## Functions

### createAgentFlowTemplate

▸ **createAgentFlowTemplate**(`options`): [`GraphDefinition`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

Template opinativo compatível com o pipeline de agente usado no code-cli:
`seed → agent → reactValidation → toolDetection → toolExecutor → capture → end`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`AgentFlowTemplateOptions`](../interfaces/orchestrators_graph_templates_interfaces_agentFlowTemplateOptions_interface.AgentFlowTemplateOptions.md) |

#### Returns

[`GraphDefinition`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

#### Defined in

[src/orchestrators/graph/templates/agentFlowTemplate.ts:99](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/agentFlowTemplate.ts#L99)
