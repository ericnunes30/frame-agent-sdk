# Class: MCPBase

## Table of contents

### Constructors

- [constructor](MCPBase.md#constructor)

### Properties

- [client](MCPBase.md#client)
- [config](MCPBase.md#config)

### Methods

- [canonicalName](MCPBase.md#canonicalname)
- [connect](MCPBase.md#connect)
- [createTools](MCPBase.md#createtools)
- [discoverTools](MCPBase.md#discovertools)
- [toToolSchemas](MCPBase.md#totoolschemas)

## Constructors

### constructor

• **new MCPBase**(`config`): [`MCPBase`](MCPBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`MCPBaseConfig`](../interfaces/MCPBaseConfig.md) |

#### Returns

[`MCPBase`](MCPBase.md)

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:22](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPBase.ts#L22)

## Properties

### client

• `Private` `Readonly` **client**: [`MCPClient`](MCPClient.md)

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:20](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPBase.ts#L20)

___

### config

• `Private` `Readonly` **config**: [`MCPBaseConfig`](../interfaces/MCPBaseConfig.md)

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:19](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPBase.ts#L19)

## Methods

### canonicalName

▸ **canonicalName**(`toolName`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `toolName` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:31](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPBase.ts#L31)

___

### connect

▸ **connect**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:27](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPBase.ts#L27)

___

### createTools

▸ **createTools**(`selection?`): `Promise`\<[`ITool`](../interfaces/ITool.md)\<[`IToolParams`](../interfaces/IToolParams.md), `unknown`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selection?` | [`MCPSelection`](../interfaces/MCPSelection.md) |

#### Returns

`Promise`\<[`ITool`](../interfaces/ITool.md)\<[`IToolParams`](../interfaces/IToolParams.md), `unknown`\>[]\>

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:41](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPBase.ts#L41)

___

### discoverTools

▸ **discoverTools**(): `Promise`\<`MCPListedTool`[]\>

#### Returns

`Promise`\<`MCPListedTool`[]\>

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:36](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPBase.ts#L36)

___

### toToolSchemas

▸ **toToolSchemas**(`tools`): [`ToolSchema`](../README.md#toolschema)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `tools` | [`ITool`](../interfaces/ITool.md)\<[`IToolParams`](../interfaces/IToolParams.md), `unknown`\>[] |

#### Returns

[`ToolSchema`](../README.md#toolschema)[]

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:63](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPBase.ts#L63)
