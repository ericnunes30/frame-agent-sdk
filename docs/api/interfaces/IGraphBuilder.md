# Interface: IGraphBuilder

## Implemented by

- [`GraphBuilder`](../classes/GraphBuilder.md)

## Table of contents

### Methods

- [addConditionalEdge](IGraphBuilder.md#addconditionaledge)
- [addEdge](IGraphBuilder.md#addedge)
- [addNode](IGraphBuilder.md#addnode)
- [build](IGraphBuilder.md#build)
- [getMaxSteps](IGraphBuilder.md#getmaxsteps)
- [setEndNode](IGraphBuilder.md#setendnode)
- [setEntryPoint](IGraphBuilder.md#setentrypoint)

## Methods

### addConditionalEdge

▸ **addConditionalEdge**(`from`, `edge`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `string` |
| `edge` | [`ConditionalEdge`](ConditionalEdge.md) |

#### Returns

`this`

#### Defined in

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L11)

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

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L10)

___

### addNode

▸ **addNode**(`name`, `node`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `node` | [`GraphNode`](GraphNode.md) |

#### Returns

`this`

#### Defined in

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L9)

___

### build

▸ **build**(): [`GraphDefinition`](GraphDefinition.md)

#### Returns

[`GraphDefinition`](GraphDefinition.md)

#### Defined in

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L14)

___

### getMaxSteps

▸ **getMaxSteps**(): `number`

#### Returns

`number`

#### Defined in

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L15)

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

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L13)

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

[src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/builder/interfaces/graphBuilder.interface.ts#L12)
