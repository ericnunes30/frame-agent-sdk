# Class: MCPClient

[tools/tools/mcp/MCPClient](../modules/tools_tools_mcp_MCPClient.md).MCPClient

## Table of contents

### Constructors

- [constructor](tools_tools_mcp_MCPClient.MCPClient.md#constructor)

### Properties

- [client](tools_tools_mcp_MCPClient.MCPClient.md#client)
- [config](tools_tools_mcp_MCPClient.MCPClient.md#config)
- [transport](tools_tools_mcp_MCPClient.MCPClient.md#transport)

### Methods

- [callTool](tools_tools_mcp_MCPClient.MCPClient.md#calltool)
- [connect](tools_tools_mcp_MCPClient.MCPClient.md#connect)
- [listTools](tools_tools_mcp_MCPClient.MCPClient.md#listtools)

## Constructors

### constructor

• **new MCPClient**(`config`): [`MCPClient`](tools_tools_mcp_MCPClient.MCPClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`MCPClientConfig`](../interfaces/tools_tools_mcp_MCPClient.MCPClientConfig.md) |

#### Returns

[`MCPClient`](tools_tools_mcp_MCPClient.MCPClient.md)

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:29](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/mcp/MCPClient.ts#L29)

## Properties

### client

• `Private` **client**: `Client`\<\{ `method`: `string` ; `params?`: \{ `_meta?`: \{ `progressToken?`: `string` \| `number`  }  }  }, \{ `method`: `string` ; `params?`: \{ `_meta?`: {}  }  }, \{ `_meta?`: {}  }\> = `null`

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:25](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/mcp/MCPClient.ts#L25)

___

### config

• `Private` `Readonly` **config**: [`MCPClientConfig`](../interfaces/tools_tools_mcp_MCPClient.MCPClientConfig.md)

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:27](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/mcp/MCPClient.ts#L27)

___

### transport

• `Private` **transport**: `StdioClientTransport` = `null`

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:26](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/mcp/MCPClient.ts#L26)

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

[src/tools/tools/mcp/MCPClient.ts:65](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/mcp/MCPClient.ts#L65)

___

### connect

▸ **connect**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:33](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/mcp/MCPClient.ts#L33)

___

### listTools

▸ **listTools**(): `Promise`\<[`MCPListedTool`](../interfaces/tools_tools_mcp_MCPClient.MCPListedTool.md)[]\>

#### Returns

`Promise`\<[`MCPListedTool`](../interfaces/tools_tools_mcp_MCPClient.MCPListedTool.md)[]\>

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:47](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/mcp/MCPClient.ts#L47)
