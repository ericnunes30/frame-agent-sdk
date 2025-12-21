# Module: orchestrators/graph/nodes/subflowNode

## Table of contents

### Functions

- [createSubflowNode](orchestrators_graph_nodes_subflowNode.md#createsubflownode)

## Functions

### createSubflowNode

▸ **createSubflowNode**(`args`): [`GraphNode`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)

Cria um node que executa um subfluxo e aplica patches no shared.
Pausas do subfluxo sao propagadas sem pendingAskUser para o grafo pai.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.flowId` | `string` |
| `args.registry` | [`FlowRegistry`](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md) |
| `args.runner` | [`FlowRunner`](../interfaces/flows_interfaces_flowRunner_interface.FlowRunner.md) |

#### Returns

[`GraphNode`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)

#### Defined in

src/orchestrators/graph/nodes/subflowNode.ts:13
