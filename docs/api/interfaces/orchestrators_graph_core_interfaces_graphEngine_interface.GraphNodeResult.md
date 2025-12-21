# Interface: GraphNodeResult

[orchestrators/graph/core/interfaces/graphEngine.interface](../modules/orchestrators_graph_core_interfaces_graphEngine_interface.md).GraphNodeResult

## Hierarchy

- `Partial`\<[`IGraphState`](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)\>

- [`GraphNodeControl`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeControl.md)

  ↳ **`GraphNodeResult`**

## Table of contents

### Properties

- [currentNode](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#currentnode)
- [data](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#data)
- [lastModelOutput](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#lastmodeloutput)
- [lastToolCall](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#lasttoolcall)
- [logs](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#logs)
- [messages](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#messages)
- [metadata](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#metadata)
- [nextNode](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#nextnode)
- [nextNodeOverride](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#nextnodeoverride)
- [pendingAskUser](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#pendingaskuser)
- [sessionId](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#sessionid)
- [shouldEnd](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#shouldend)
- [shouldPause](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#shouldpause)
- [status](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md#status)

## Properties

### currentNode

• `Optional` `Readonly` **currentNode**: `string`

#### Inherited from

Partial.currentNode

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L9)

___

### data

• `Optional` `Readonly` **data**: `Record`\<`string`, `unknown`\>

#### Inherited from

Partial.data

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L7)

___

### lastModelOutput

• `Optional` `Readonly` **lastModelOutput**: `string`

#### Inherited from

Partial.lastModelOutput

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L12)

___

### lastToolCall

• `Optional` `Readonly` **lastToolCall**: [`IToolCall`](tools_core_interfaces.IToolCall.md)

#### Inherited from

Partial.lastToolCall

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L11)

___

### logs

• `Optional` `Readonly` **logs**: `string`[]

#### Inherited from

Partial.logs

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:17](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L17)

___

### messages

• `Optional` `Readonly` **messages**: [`Message`](memory_memory_interface.Message.md)[]

#### Inherited from

Partial.messages

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L6)

___

### metadata

• `Optional` `Readonly` **metadata**: `Record`\<`string`, `unknown`\>

#### Inherited from

Partial.metadata

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L14)

___

### nextNode

• `Optional` `Readonly` **nextNode**: `string`

#### Inherited from

Partial.nextNode

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L10)

___

### nextNodeOverride

• `Optional` **nextNodeOverride**: `string`

#### Inherited from

[GraphNodeControl](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeControl.md).[nextNodeOverride](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeControl.md#nextnodeoverride)

#### Defined in

[src/orchestrators/graph/core/interfaces/graphEngine.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphEngine.interface.ts#L6)

___

### pendingAskUser

• `Optional` `Readonly` **pendingAskUser**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `details?` | `string` |
| `question` | `string` |

#### Inherited from

Partial.pendingAskUser

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L13)

___

### sessionId

• `Optional` `Readonly` **sessionId**: `string`

#### Inherited from

Partial.sessionId

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L15)

___

### shouldEnd

• `Optional` **shouldEnd**: `boolean`

#### Inherited from

[GraphNodeControl](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeControl.md).[shouldEnd](orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeControl.md#shouldend)

#### Defined in

[src/orchestrators/graph/core/interfaces/graphEngine.interface.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphEngine.interface.ts#L7)

___

### shouldPause

• `Optional` `Readonly` **shouldPause**: `boolean`

#### Inherited from

Partial.shouldPause

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L16)

___

### status

• `Optional` `Readonly` **status**: [`GraphStatus`](../enums/orchestrators_graph_core_enums_graphEngine_enum.GraphStatus.md)

#### Inherited from

Partial.status

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L8)
