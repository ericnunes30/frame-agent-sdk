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

src/flows/interfaces/flowRegistry.interface.ts:5

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

src/flows/interfaces/flowRegistry.interface.ts:6

___

### list

▸ **list**(): `string`[]

#### Returns

`string`[]

#### Defined in

src/flows/interfaces/flowRegistry.interface.ts:7

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

src/flows/interfaces/flowRegistry.interface.ts:4

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

src/flows/interfaces/flowRegistry.interface.ts:8
