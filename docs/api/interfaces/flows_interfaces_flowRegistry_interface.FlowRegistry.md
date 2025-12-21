# Interface: FlowRegistry

[flows/interfaces/flowRegistry.interface](../modules/flows_interfaces_flowRegistry_interface.md).FlowRegistry

## Implemented by

- [`FlowRegistryImpl`](../classes/flows_registry_flowRegistryImpl.FlowRegistryImpl.md)

## Table of contents

### Methods

- [get](flows_interfaces_flowRegistry_interface.FlowRegistry.md#get)
- [has](flows_interfaces_flowRegistry_interface.FlowRegistry.md#has)
- [list](flows_interfaces_flowRegistry_interface.FlowRegistry.md#list)
- [register](flows_interfaces_flowRegistry_interface.FlowRegistry.md#register)
- [unregister](flows_interfaces_flowRegistry_interface.FlowRegistry.md#unregister)

## Methods

### get

▸ **get**(`flowId`): [`FlowDefinition`](flows_interfaces_flowDefinition_interface.FlowDefinition.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `flowId` | `string` |

#### Returns

[`FlowDefinition`](flows_interfaces_flowDefinition_interface.FlowDefinition.md)

#### Defined in

[src/flows/interfaces/flowRegistry.interface.ts:5](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/flows/interfaces/flowRegistry.interface.ts#L5)

___

### has

▸ **has**(`flowId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `flowId` | `string` |

#### Returns

`boolean`

#### Defined in

[src/flows/interfaces/flowRegistry.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/flows/interfaces/flowRegistry.interface.ts#L6)

___

### list

▸ **list**(): `string`[]

#### Returns

`string`[]

#### Defined in

[src/flows/interfaces/flowRegistry.interface.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/flows/interfaces/flowRegistry.interface.ts#L7)

___

### register

▸ **register**(`flowId`, `flow`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `flowId` | `string` |
| `flow` | [`FlowDefinition`](flows_interfaces_flowDefinition_interface.FlowDefinition.md) |

#### Returns

`void`

#### Defined in

[src/flows/interfaces/flowRegistry.interface.ts:4](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/flows/interfaces/flowRegistry.interface.ts#L4)

___

### unregister

▸ **unregister**(`flowId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `flowId` | `string` |

#### Returns

`void`

#### Defined in

[src/flows/interfaces/flowRegistry.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/flows/interfaces/flowRegistry.interface.ts#L8)
