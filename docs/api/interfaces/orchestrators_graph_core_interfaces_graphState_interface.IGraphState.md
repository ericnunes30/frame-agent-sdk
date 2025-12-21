# Interface: IGraphState

[orchestrators/graph/core/interfaces/graphState.interface](../modules/orchestrators_graph_core_interfaces_graphState_interface.md).IGraphState

## Table of contents

### Properties

- [currentNode](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#currentnode)
- [data](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#data)
- [lastModelOutput](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#lastmodeloutput)
- [lastToolCall](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#lasttoolcall)
- [logs](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#logs)
- [messages](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#messages)
- [metadata](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#metadata)
- [nextNode](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#nextnode)
- [pendingAskUser](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#pendingaskuser)
- [sessionId](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#sessionid)
- [shouldPause](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#shouldpause)
- [status](orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md#status)

## Properties

### currentNode

• `Optional` `Readonly` **currentNode**: `string`

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L9)

___

### data

• `Readonly` **data**: `Record`\<`string`, `unknown`\>

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L7)

___

### lastModelOutput

• `Optional` `Readonly` **lastModelOutput**: `string`

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L12)

___

### lastToolCall

• `Optional` `Readonly` **lastToolCall**: [`IToolCall`](tools_core_interfaces.IToolCall.md)

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L11)

___

### logs

• `Optional` `Readonly` **logs**: `string`[]

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:17](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L17)

___

### messages

• `Readonly` **messages**: [`Message`](memory_memory_interface.Message.md)[]

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L6)

___

### metadata

• `Optional` `Readonly` **metadata**: `Record`\<`string`, `unknown`\>

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L14)

___

### nextNode

• `Optional` `Readonly` **nextNode**: `string`

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L10)

___

### pendingAskUser

• `Optional` `Readonly` **pendingAskUser**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `details?` | `string` |
| `question` | `string` |

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L13)

___

### sessionId

• `Optional` `Readonly` **sessionId**: `string`

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L15)

___

### shouldPause

• `Optional` `Readonly` **shouldPause**: `boolean`

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L16)

___

### status

• `Readonly` **status**: [`GraphStatus`](../enums/orchestrators_graph_core_enums_graphEngine_enum.GraphStatus.md)

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L8)
