# Class: FlowRegistryImpl

[flows/registry/flowRegistryImpl](../modules/flows_registry_flowRegistryImpl.md).FlowRegistryImpl

## Implements

- [`FlowRegistry`](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md)

## Table of contents

### Constructors

- [constructor](flows_registry_flowRegistryImpl.FlowRegistryImpl.md#constructor)

### Properties

- [flows](flows_registry_flowRegistryImpl.FlowRegistryImpl.md#flows)

### Methods

- [get](flows_registry_flowRegistryImpl.FlowRegistryImpl.md#get)
- [has](flows_registry_flowRegistryImpl.FlowRegistryImpl.md#has)
- [list](flows_registry_flowRegistryImpl.FlowRegistryImpl.md#list)
- [register](flows_registry_flowRegistryImpl.FlowRegistryImpl.md#register)
- [unregister](flows_registry_flowRegistryImpl.FlowRegistryImpl.md#unregister)

## Constructors

### constructor

• **new FlowRegistryImpl**(): [`FlowRegistryImpl`](flows_registry_flowRegistryImpl.FlowRegistryImpl.md)

#### Returns

[`FlowRegistryImpl`](flows_registry_flowRegistryImpl.FlowRegistryImpl.md)

## Properties

### flows

• `Private` `Readonly` **flows**: `Map`\<`string`, [`FlowDefinition`](../interfaces/flows_interfaces_flowDefinition_interface.FlowDefinition.md)\>

#### Defined in

[src/flows/registry/flowRegistryImpl.ts:5](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/registry/flowRegistryImpl.ts#L5)

## Methods

### get

▸ **get**(`flowId`): [`FlowDefinition`](../interfaces/flows_interfaces_flowDefinition_interface.FlowDefinition.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `flowId` | `string` |

#### Returns

[`FlowDefinition`](../interfaces/flows_interfaces_flowDefinition_interface.FlowDefinition.md)

#### Implementation of

[FlowRegistry](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md).[get](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md#get)

#### Defined in

[src/flows/registry/flowRegistryImpl.ts:27](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/registry/flowRegistryImpl.ts#L27)

___

### has

▸ **has**(`flowId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `flowId` | `string` |

#### Returns

`boolean`

#### Implementation of

[FlowRegistry](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md).[has](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md#has)

#### Defined in

[src/flows/registry/flowRegistryImpl.ts:36](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/registry/flowRegistryImpl.ts#L36)

___

### list

▸ **list**(): `string`[]

#### Returns

`string`[]

#### Implementation of

[FlowRegistry](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md).[list](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md#list)

#### Defined in

[src/flows/registry/flowRegistryImpl.ts:40](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/registry/flowRegistryImpl.ts#L40)

___

### register

▸ **register**(`flowId`, `flow`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `flowId` | `string` |
| `flow` | [`FlowDefinition`](../interfaces/flows_interfaces_flowDefinition_interface.FlowDefinition.md) |

#### Returns

`void`

#### Implementation of

[FlowRegistry](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md).[register](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md#register)

#### Defined in

[src/flows/registry/flowRegistryImpl.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/registry/flowRegistryImpl.ts#L7)

___

### unregister

▸ **unregister**(`flowId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `flowId` | `string` |

#### Returns

`void`

#### Implementation of

[FlowRegistry](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md).[unregister](../interfaces/flows_interfaces_flowRegistry_interface.FlowRegistry.md#unregister)

#### Defined in

[src/flows/registry/flowRegistryImpl.ts:44](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/registry/flowRegistryImpl.ts#L44)
