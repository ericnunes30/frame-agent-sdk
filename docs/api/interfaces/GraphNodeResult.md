# Interface: GraphNodeResult

## Hierarchy

- `Partial`\<[`IGraphState`](IGraphState.md)\>

- [`GraphNodeControl`](GraphNodeControl.md)

  ↳ **`GraphNodeResult`**

## Table of contents

### Properties

- [currentNode](GraphNodeResult.md#currentnode)
- [data](GraphNodeResult.md#data)
- [lastModelOutput](GraphNodeResult.md#lastmodeloutput)
- [lastToolCall](GraphNodeResult.md#lasttoolcall)
- [logs](GraphNodeResult.md#logs)
- [messages](GraphNodeResult.md#messages)
- [metadata](GraphNodeResult.md#metadata)
- [nextNode](GraphNodeResult.md#nextnode)
- [nextNodeOverride](GraphNodeResult.md#nextnodeoverride)
- [pendingAskUser](GraphNodeResult.md#pendingaskuser)
- [sessionId](GraphNodeResult.md#sessionid)
- [shouldEnd](GraphNodeResult.md#shouldend)
- [shouldPause](GraphNodeResult.md#shouldpause)
- [status](GraphNodeResult.md#status)

## Properties

### currentNode

• `Optional` `Readonly` **currentNode**: `string`

#### Inherited from

Partial.currentNode

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L9)

___

### data

• `Optional` `Readonly` **data**: `Record`\<`string`, `unknown`\>

#### Inherited from

Partial.data

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L7)

___

### lastModelOutput

• `Optional` `Readonly` **lastModelOutput**: `string`

#### Inherited from

Partial.lastModelOutput

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L12)

___

### lastToolCall

• `Optional` `Readonly` **lastToolCall**: [`IToolCall`](IToolCall.md)

#### Inherited from

Partial.lastToolCall

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L11)

___

### logs

• `Optional` `Readonly` **logs**: `string`[]

#### Inherited from

Partial.logs

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:17](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L17)

___

### messages

• `Optional` `Readonly` **messages**: [`Message`](Message.md)[]

#### Inherited from

Partial.messages

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L6)

___

### metadata

• `Optional` `Readonly` **metadata**: `Record`\<`string`, `unknown`\>

#### Inherited from

Partial.metadata

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L14)

___

### nextNode

• `Optional` `Readonly` **nextNode**: `string`

#### Inherited from

Partial.nextNode

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L10)

___

### nextNodeOverride

• `Optional` **nextNodeOverride**: `string`

#### Inherited from

[GraphNodeControl](GraphNodeControl.md).[nextNodeOverride](GraphNodeControl.md#nextnodeoverride)

#### Defined in

[src/orchestrators/graph/core/interfaces/graphEngine.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphEngine.interface.ts#L6)

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

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L13)

___

### sessionId

• `Optional` `Readonly` **sessionId**: `string`

#### Inherited from

Partial.sessionId

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L15)

___

### shouldEnd

• `Optional` **shouldEnd**: `boolean`

#### Inherited from

[GraphNodeControl](GraphNodeControl.md).[shouldEnd](GraphNodeControl.md#shouldend)

#### Defined in

[src/orchestrators/graph/core/interfaces/graphEngine.interface.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphEngine.interface.ts#L7)

___

### shouldPause

• `Optional` `Readonly` **shouldPause**: `boolean`

#### Inherited from

Partial.shouldPause

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L16)

___

### status

• `Optional` `Readonly` **status**: [`GraphStatus`](../enums/GraphStatus.md)

#### Inherited from

Partial.status

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L8)
