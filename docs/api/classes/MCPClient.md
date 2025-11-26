# Class: MCPClient

## Table of contents

### Constructors

- [constructor](MCPClient.md#constructor)

### Properties

- [client](MCPClient.md#client)
- [config](MCPClient.md#config)
- [transport](MCPClient.md#transport)

### Methods

- [callTool](MCPClient.md#calltool)
- [connect](MCPClient.md#connect)
- [listTools](MCPClient.md#listtools)

## Constructors

### constructor

• **new MCPClient**(`config`): [`MCPClient`](MCPClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `MCPClientConfig` |

#### Returns

[`MCPClient`](MCPClient.md)

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:29](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPClient.ts#L29)

## Properties

### client

• `Private` **client**: `Client`\<\{ `method`: `string` ; `params?`: \{ `_meta?`: \{ `progressToken?`: `string` \| `number`  }  }  }, \{ `method`: `string` ; `params?`: \{ `_meta?`: {}  }  }, \{ `_meta?`: {}  }\> = `null`

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:25](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPClient.ts#L25)

___

### config

• `Private` `Readonly` **config**: `MCPClientConfig`

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:27](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPClient.ts#L27)

___

### transport

• `Private` **transport**: `StdioClientTransport` = `null`

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:26](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPClient.ts#L26)

## Methods

### callTool

▸ **callTool**(`name`, `args`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `Record`\<`string`, `unknown`\> |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:65](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPClient.ts#L65)

___

### connect

▸ **connect**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:33](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPClient.ts#L33)

___

### listTools

▸ **listTools**(): `Promise`\<`MCPListedTool`[]\>

#### Returns

`Promise`\<`MCPListedTool`[]\>

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:47](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPClient.ts#L47)
