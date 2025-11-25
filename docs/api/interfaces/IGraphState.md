# Interface: IGraphState

## Table of contents

### Properties

- [currentNode](IGraphState.md#currentnode)
- [data](IGraphState.md#data)
- [lastModelOutput](IGraphState.md#lastmodeloutput)
- [lastToolCall](IGraphState.md#lasttoolcall)
- [logs](IGraphState.md#logs)
- [messages](IGraphState.md#messages)
- [metadata](IGraphState.md#metadata)
- [nextNode](IGraphState.md#nextnode)
- [pendingAskUser](IGraphState.md#pendingaskuser)
- [sessionId](IGraphState.md#sessionid)
- [shouldPause](IGraphState.md#shouldpause)
- [status](IGraphState.md#status)

## Properties

### currentNode

• `Optional` `Readonly` **currentNode**: `string`

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L9)

___

### data

• `Readonly` **data**: `Record`\<`string`, `unknown`\>

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L7)

___

### lastModelOutput

• `Optional` `Readonly` **lastModelOutput**: `string`

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L12)

___

### lastToolCall

• `Optional` `Readonly` **lastToolCall**: [`IToolCall`](IToolCall.md)

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L11)

___

### logs

• `Optional` `Readonly` **logs**: `string`[]

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:17](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L17)

___

### messages

• `Readonly` **messages**: [`Message`](Message.md)[]

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L6)

___

### metadata

• `Optional` `Readonly` **metadata**: `Record`\<`string`, `unknown`\>

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L14)

___

### nextNode

• `Optional` `Readonly` **nextNode**: `string`

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L10)

___

### pendingAskUser

• `Optional` `Readonly` **pendingAskUser**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `details?` | `string` |
| `question` | `string` |

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L13)

___

### sessionId

• `Optional` `Readonly` **sessionId**: `string`

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L15)

___

### shouldPause

• `Optional` `Readonly` **shouldPause**: `boolean`

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L16)

___

### status

• `Readonly` **status**: [`GraphStatus`](../enums/GraphStatus.md)

#### Defined in

[src/orchestrators/graph/core/interfaces/graphState.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/interfaces/graphState.interface.ts#L8)
