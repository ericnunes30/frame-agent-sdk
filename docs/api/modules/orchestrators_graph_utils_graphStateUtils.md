# Module: orchestrators/graph/utils/graphStateUtils

## Table of contents

### Interfaces

- [ExtractStateTextOptions](../interfaces/orchestrators_graph_utils_graphStateUtils.ExtractStateTextOptions.md)

### Functions

- [extractFinalAnswer](orchestrators_graph_utils_graphStateUtils.md#extractfinalanswer)
- [extractInput](orchestrators_graph_utils_graphStateUtils.md#extractinput)

## Functions

### extractFinalAnswer

▸ **extractFinalAnswer**(`state`, `options?`): `string` \| ``null``

Extrai a "final answer" do state de forma padronizada.

Ordem padrão:
1) Se `lastToolCall.toolName === 'final_answer'`, usa `params.answer`
2) `state.data.finalAnswer` (quando existir; ex.: capture do template)
3) `state.lastModelOutput`
4) última mensagem `role=assistant` em `state.messages` (se habilitado)

Retorna `null` se não encontrar.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) |
| `options?` | [`ExtractStateTextOptions`](../interfaces/orchestrators_graph_utils_graphStateUtils.ExtractStateTextOptions.md) |

#### Returns

`string` \| ``null``

#### Defined in

[src/orchestrators/graph/utils/graphStateUtils.ts:70](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/utils/graphStateUtils.ts#L70)

___

### extractInput

▸ **extractInput**(`state`, `options?`): `string` \| ``null``

Extrai o "input efetivo" do state de forma padronizada.

Ordem padrão:
1) `state.data.input` (ou chaves configuradas em `preferDataKeys`)
2) última mensagem `role=user` em `state.messages` (se habilitado)

Retorna `null` se não encontrar.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) |
| `options?` | [`ExtractStateTextOptions`](../interfaces/orchestrators_graph_utils_graphStateUtils.ExtractStateTextOptions.md) |

#### Returns

`string` \| ``null``

#### Defined in

[src/orchestrators/graph/utils/graphStateUtils.ts:44](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/utils/graphStateUtils.ts#L44)
