# Class: MCPBase

[tools/tools/mcp/MCPBase](../modules/tools_tools_mcp_MCPBase.md).MCPBase

## Table of contents

### Constructors

- [constructor](tools_tools_mcp_MCPBase.MCPBase.md#constructor)

### Properties

- [client](tools_tools_mcp_MCPBase.MCPBase.md#client)
- [config](tools_tools_mcp_MCPBase.MCPBase.md#config)

### Methods

- [canonicalName](tools_tools_mcp_MCPBase.MCPBase.md#canonicalname)
- [connect](tools_tools_mcp_MCPBase.MCPBase.md#connect)
- [createTools](tools_tools_mcp_MCPBase.MCPBase.md#createtools)
- [discoverTools](tools_tools_mcp_MCPBase.MCPBase.md#discovertools)
- [toToolSchemas](tools_tools_mcp_MCPBase.MCPBase.md#totoolschemas)

## Constructors

### constructor

• **new MCPBase**(`config`): [`MCPBase`](tools_tools_mcp_MCPBase.MCPBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`MCPBaseConfig`](../interfaces/tools_tools_mcp_MCPBase.MCPBaseConfig.md) |

#### Returns

[`MCPBase`](tools_tools_mcp_MCPBase.MCPBase.md)

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:22](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/mcp/MCPBase.ts#L22)

## Properties

### client

• `Private` `Readonly` **client**: [`MCPClient`](tools_tools_mcp_MCPClient.MCPClient.md)

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:20](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/mcp/MCPBase.ts#L20)

___

### config

• `Private` `Readonly` **config**: [`MCPBaseConfig`](../interfaces/tools_tools_mcp_MCPBase.MCPBaseConfig.md)

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:19](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/mcp/MCPBase.ts#L19)

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

[src/tools/tools/mcp/MCPBase.ts:31](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/mcp/MCPBase.ts#L31)

___

### connect

▸ **connect**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:27](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/mcp/MCPBase.ts#L27)

___

### createTools

▸ **createTools**(`selection?`): `Promise`\<[`ITool`](../interfaces/tools_core_interfaces.ITool.md)\<[`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md), `unknown`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selection?` | [`MCPSelection`](../interfaces/tools_tools_mcp_MCPBase.MCPSelection.md) |

#### Returns

`Promise`\<[`ITool`](../interfaces/tools_core_interfaces.ITool.md)\<[`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md), `unknown`\>[]\>

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:41](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/mcp/MCPBase.ts#L41)

___

### discoverTools

▸ **discoverTools**(): `Promise`\<[`MCPListedTool`](../interfaces/tools_tools_mcp_MCPClient.MCPListedTool.md)[]\>

#### Returns

`Promise`\<[`MCPListedTool`](../interfaces/tools_tools_mcp_MCPClient.MCPListedTool.md)[]\>

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:36](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/mcp/MCPBase.ts#L36)

___

### toToolSchemas

▸ **toToolSchemas**(`tools`): [`ToolSchema`](../modules/promptBuilder_promptBuilder_interface.md#toolschema)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `tools` | [`ITool`](../interfaces/tools_core_interfaces.ITool.md)\<[`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md), `unknown`\>[] |

#### Returns

[`ToolSchema`](../modules/promptBuilder_promptBuilder_interface.md#toolschema)[]

#### Defined in

[src/tools/tools/mcp/MCPBase.ts:63](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/mcp/MCPBase.ts#L63)
