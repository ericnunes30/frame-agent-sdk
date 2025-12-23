# Interface: AgentFlowTemplatePolicies

[orchestrators/graph/templates/interfaces/agentFlowTemplatePolicies.interface](../modules/orchestrators_graph_templates_interfaces_agentFlowTemplatePolicies_interface.md).AgentFlowTemplatePolicies

## Table of contents

### Properties

- [askUserBehavior](orchestrators_graph_templates_interfaces_agentFlowTemplatePolicies_interface.AgentFlowTemplatePolicies.md#askuserbehavior)
- [noToolCallBehavior](orchestrators_graph_templates_interfaces_agentFlowTemplatePolicies_interface.AgentFlowTemplatePolicies.md#notoolcallbehavior)

## Properties

### askUserBehavior

• `Optional` **askUserBehavior**: [`AgentFlowTemplateAskUserBehavior`](../modules/orchestrators_graph_templates_interfaces_agentFlowTemplateAskUserBehavior_type.md#agentflowtemplateaskuserbehavior)

Quando o LLM chamar `ask_user`.
- `finish`: encerra o fluxo após capturar a pergunta no state.
- `pause`: pausa o fluxo (GraphEngine retorna PAUSED) aguardando `resume()`.

#### Defined in

[src/orchestrators/graph/templates/interfaces/agentFlowTemplatePolicies.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/interfaces/agentFlowTemplatePolicies.interface.ts#L9)

___

### noToolCallBehavior

• `Optional` **noToolCallBehavior**: ``"finish"`` \| ``"loop"``

Quando não houver toolcall detectada no output do LLM.
- `finish`: encerra após captura (default).
- `loop`: volta ao agent (útil para modos não‑ReAct, ou quando a captura deve ser explícita via tool).

#### Defined in

[src/orchestrators/graph/templates/interfaces/agentFlowTemplatePolicies.interface.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/templates/interfaces/agentFlowTemplatePolicies.interface.ts#L16)
