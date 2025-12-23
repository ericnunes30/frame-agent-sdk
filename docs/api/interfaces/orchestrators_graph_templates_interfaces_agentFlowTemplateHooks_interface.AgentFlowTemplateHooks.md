# Interface: AgentFlowTemplateHooks

[orchestrators/graph/templates/interfaces/agentFlowTemplateHooks.interface](../modules/orchestrators_graph_templates_interfaces_agentFlowTemplateHooks_interface.md).AgentFlowTemplateHooks

## Table of contents

### Properties

- [capture](orchestrators_graph_templates_interfaces_agentFlowTemplateHooks_interface.AgentFlowTemplateHooks.md#capture)
- [seed](orchestrators_graph_templates_interfaces_agentFlowTemplateHooks_interface.AgentFlowTemplateHooks.md#seed)

## Properties

### capture

• `Optional` **capture**: [`GraphNode`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)

Nó de captura final: transforma o state em saídas padronizadas (ex.: `data.finalAnswer`).
Deve ser puro: não imprimir, não persistir, apenas atualizar o state.

#### Defined in

[src/orchestrators/graph/templates/interfaces/agentFlowTemplateHooks.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/interfaces/agentFlowTemplateHooks.interface.ts#L14)

___

### seed

• `Optional` **seed**: [`GraphNode`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)

Nó inicial que injeta/normaliza o input no state (ex.: colocar mensagem `role=user`).
Deve ser puro: não imprimir, não persistir, apenas atualizar o state.

#### Defined in

[src/orchestrators/graph/templates/interfaces/agentFlowTemplateHooks.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/interfaces/agentFlowTemplateHooks.interface.ts#L8)
