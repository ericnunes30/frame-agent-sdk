# Class: GraphBuilder

## Implements

- [`IGraphBuilder`](../interfaces/IGraphBuilder.md)

## Table of contents

### Constructors

- [constructor](GraphBuilder.md#constructor)

### Properties

- [edges](GraphBuilder.md#edges)
- [endNodeName](GraphBuilder.md#endnodename)
- [entryPoint](GraphBuilder.md#entrypoint)
- [maxSteps](GraphBuilder.md#maxsteps)
- [nodes](GraphBuilder.md#nodes)

### Methods

- [addConditionalEdge](GraphBuilder.md#addconditionaledge)
- [addEdge](GraphBuilder.md#addedge)
- [addNode](GraphBuilder.md#addnode)
- [assertName](GraphBuilder.md#assertname)
- [build](GraphBuilder.md#build)
- [ensureNodeRegistered](GraphBuilder.md#ensurenoderegistered)
- [getMaxSteps](GraphBuilder.md#getmaxsteps)
- [guardSelfLoop](GraphBuilder.md#guardselfloop)
- [setEndNode](GraphBuilder.md#setendnode)
- [setEntryPoint](GraphBuilder.md#setentrypoint)
- [validateEdges](GraphBuilder.md#validateedges)

## Constructors

### constructor

• **new GraphBuilder**(`options?`): [`GraphBuilder`](GraphBuilder.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`GraphBuilderOptions`](../interfaces/GraphBuilderOptions.md) |

#### Returns

[`GraphBuilder`](GraphBuilder.md)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L11)

## Properties

### edges

• `Private` `Readonly` **edges**: `Record`\<`string`, `string` \| [`ConditionalEdge`](../interfaces/ConditionalEdge.md)\>

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L6)

___

### endNodeName

• `Private` **endNodeName**: `string`

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L8)

___

### entryPoint

• `Private` `Optional` **entryPoint**: `string`

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L7)

___

### maxSteps

• `Private` `Optional` `Readonly` **maxSteps**: `number`

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L9)

___

### nodes

• `Private` `Readonly` **nodes**: `Record`\<`string`, [`GraphNode`](../interfaces/GraphNode.md)\>

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:5](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L5)

## Methods

### addConditionalEdge

▸ **addConditionalEdge**(`from`, `edge`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `string` |
| `edge` | [`ConditionalEdge`](../interfaces/ConditionalEdge.md) |

#### Returns

`this`

#### Implementation of

[IGraphBuilder](../interfaces/IGraphBuilder.md).[addConditionalEdge](../interfaces/IGraphBuilder.md#addconditionaledge)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:36](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L36)

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

[IGraphBuilder](../interfaces/IGraphBuilder.md).[addEdge](../interfaces/IGraphBuilder.md#addedge)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:25](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L25)

___

### addNode

▸ **addNode**(`name`, `node`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `node` | [`GraphNode`](../interfaces/GraphNode.md) |

#### Returns

`this`

#### Implementation of

[IGraphBuilder](../interfaces/IGraphBuilder.md).[addNode](../interfaces/IGraphBuilder.md#addnode)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:18](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L18)

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

[src/orchestrators/graph/builder/GraphBuilder.ts:73](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L73)

___

### build

▸ **build**(): [`GraphDefinition`](../interfaces/GraphDefinition.md)

#### Returns

[`GraphDefinition`](../interfaces/GraphDefinition.md)

#### Implementation of

[IGraphBuilder](../interfaces/IGraphBuilder.md).[build](../interfaces/IGraphBuilder.md#build)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:57](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L57)

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

[src/orchestrators/graph/builder/GraphBuilder.ts:78](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L78)

___

### getMaxSteps

▸ **getMaxSteps**(): `number`

#### Returns

`number`

#### Implementation of

[IGraphBuilder](../interfaces/IGraphBuilder.md).[getMaxSteps](../interfaces/IGraphBuilder.md#getmaxsteps)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:69](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L69)

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

[src/orchestrators/graph/builder/GraphBuilder.ts:83](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L83)

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

[IGraphBuilder](../interfaces/IGraphBuilder.md).[setEndNode](../interfaces/IGraphBuilder.md#setendnode)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:51](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L51)

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

[IGraphBuilder](../interfaces/IGraphBuilder.md).[setEntryPoint](../interfaces/IGraphBuilder.md#setentrypoint)

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:44](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L44)

___

### validateEdges

▸ **validateEdges**(): `void`

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/builder/GraphBuilder.ts:88](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/GraphBuilder.ts#L88)
