# Interface: IGraphBuilder

[orchestrators/graph/builder/interfaces/graphBuilder.interface](../modules/orchestrators_graph_builder_interfaces_graphBuilder_interface.md).IGraphBuilder

## Implemented by

- [`GraphBuilder`](../classes/orchestrators_graph_builder_GraphBuilder.GraphBuilder.md)

## Table of contents

### Methods

- [addConditionalEdge](orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#addconditionaledge)
- [addEdge](orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#addedge)
- [addNode](orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#addnode)
- [build](orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#build)
- [getMaxSteps](orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#getmaxsteps)
- [setEndNode](orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#setendnode)
- [setEntryPoint](orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#setentrypoint)

## Methods

### addConditionalEdge

▸ **addConditionalEdge**(`from`, `edge`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `string` |
| `edge` | [`ConditionalEdge`](orchestrators_graph_core_interfaces_graphEngine_interface.ConditionalEdge.md) |

#### Returns

`this`

#### Defined in

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L11)

___

### addEdge

▸ **addEdge**(`from`, `to`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `string` |
| `to` | `string` |

#### Returns

`this`

#### Defined in

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L10)

___

### addNode

▸ **addNode**(`name`, `node`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `node` | [`GraphNode`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md) |

#### Returns

`this`

#### Defined in

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L9)

___

### build

▸ **build**(): [`GraphDefinition`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

#### Returns

[`GraphDefinition`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

#### Defined in

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L14)

___

### getMaxSteps

▸ **getMaxSteps**(): `number`

#### Returns

`number`

#### Defined in

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L15)

___

### setEndNode

▸ **setEndNode**(`name`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`this`

#### Defined in

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L13)

___

### setEntryPoint

▸ **setEntryPoint**(`name`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`this`

#### Defined in

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L12)
