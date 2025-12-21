# Class: GraphBuilder

[orchestrators/graph/builder/GraphBuilder](../modules/orchestrators_graph_builder_GraphBuilder.md).GraphBuilder

## Implements

- [`IGraphBuilder`](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md)

## Table of contents

### Constructors

- [constructor](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#constructor)

### Properties

- [edges](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#edges)
- [endNodeName](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#endnodename)
- [entryPoint](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#entrypoint)
- [maxSteps](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#maxsteps)
- [nodes](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#nodes)

### Methods

- [addConditionalEdge](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#addconditionaledge)
- [addEdge](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#addedge)
- [addNode](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#addnode)
- [assertName](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#assertname)
- [build](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#build)
- [ensureNodeRegistered](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#ensurenoderegistered)
- [getMaxSteps](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#getmaxsteps)
- [guardSelfLoop](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#guardselfloop)
- [setEndNode](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#setendnode)
- [setEntryPoint](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#setentrypoint)
- [validateEdges](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md#validateedges)

## Constructors

### constructor

• **new GraphBuilder**(`options?`): [`GraphBuilder`](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`GraphBuilderOptions`](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.GraphBuilderOptions.md) |

#### Returns

[`GraphBuilder`](orchestrators_graph_builder_GraphBuilder.GraphBuilder.md)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L11)

## Properties

### edges

• `Private` `Readonly` **edges**: `Record`\<`string`, `string` \| [`ConditionalEdge`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.ConditionalEdge.md)\>

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L6)

___

### endNodeName

• `Private` **endNodeName**: `string`

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L8)

___

### entryPoint

• `Private` `Optional` **entryPoint**: `string`

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L7)

___

### maxSteps

• `Private` `Optional` `Readonly` **maxSteps**: `number`

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L9)

___

### nodes

• `Private` `Readonly` **nodes**: `Record`\<`string`, [`GraphNode`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md)\>

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:5](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L5)

## Methods

### addConditionalEdge

▸ **addConditionalEdge**(`from`, `edge`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `string` |
| `edge` | [`ConditionalEdge`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.ConditionalEdge.md) |

#### Returns

`this`

#### Implementation of

[IGraphBuilder](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md).[addConditionalEdge](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#addconditionaledge)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:36](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L36)

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

#### Implementation of

[IGraphBuilder](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md).[addEdge](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#addedge)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:25](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L25)

___

### addNode

▸ **addNode**(`name`, `node`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `node` | [`GraphNode`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md) |

#### Returns

`this`

#### Implementation of

[IGraphBuilder](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md).[addNode](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#addnode)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:18](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L18)

___

### assertName

▸ **assertName**(`value`, `label`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `label` | `string` |

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:73](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L73)

___

### build

▸ **build**(): [`GraphDefinition`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

#### Returns

[`GraphDefinition`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

#### Implementation of

[IGraphBuilder](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md).[build](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#build)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:57](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L57)

___

### ensureNodeRegistered

▸ **ensureNodeRegistered**(`name`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:78](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L78)

___

### getMaxSteps

▸ **getMaxSteps**(): `number`

#### Returns

`number`

#### Implementation of

[IGraphBuilder](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md).[getMaxSteps](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#getmaxsteps)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:69](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L69)

___

### guardSelfLoop

▸ **guardSelfLoop**(`from`, `to`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `string` |
| `to` | `string` |

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:83](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L83)

___

### setEndNode

▸ **setEndNode**(`name`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`this`

#### Implementation of

[IGraphBuilder](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md).[setEndNode](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#setendnode)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:51](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L51)

___

### setEntryPoint

▸ **setEntryPoint**(`name`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`this`

#### Implementation of

[IGraphBuilder](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md).[setEntryPoint](../interfaces/orchestrators_graph_builder_interfaces_graphBuilder_interface.IGraphBuilder.md#setentrypoint)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:44](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L44)

___

### validateEdges

▸ **validateEdges**(): `void`

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:88](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/orchestrators/graph/builder/GraphBuilder.ts#L88)
