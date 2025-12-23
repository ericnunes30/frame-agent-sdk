# Module: flows/interfaces/mapInOut.interface

## Table of contents

### Type Aliases

- [MapIn](flows_interfaces_mapInOut_interface.md#mapin)
- [MapOut](flows_interfaces_mapInOut_interface.md#mapout)

## Type Aliases

### MapIn

Ƭ **MapIn**: (`parent`: \{ `input`: `Record`\<`string`, `unknown`\> ; `shared`: [`SharedState`](../interfaces/flows_interfaces_sharedState_interface.SharedState.md)  }) => \{ `childInput`: `Record`\<`string`, `unknown`\> ; `childShared`: [`SharedState`](../interfaces/flows_interfaces_sharedState_interface.SharedState.md)  }

#### Type declaration

▸ (`parent`): `Object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `parent` | `Object` |
| `parent.input` | `Record`\<`string`, `unknown`\> |
| `parent.shared` | [`SharedState`](../interfaces/flows_interfaces_sharedState_interface.SharedState.md) |

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `childInput` | `Record`\<`string`, `unknown`\> |
| `childShared` | [`SharedState`](../interfaces/flows_interfaces_sharedState_interface.SharedState.md) |

#### Defined in

[src/flows/interfaces/mapInOut.interface.ts:4](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/mapInOut.interface.ts#L4)

___

### MapOut

Ƭ **MapOut**: (`result`: \{ `patch`: [`SharedPatch`](../interfaces/flows_interfaces_sharedPatch_interface.SharedPatch.md)[] ; `shared`: [`SharedState`](../interfaces/flows_interfaces_sharedState_interface.SharedState.md)  }) => \{ `nextShared`: [`SharedState`](../interfaces/flows_interfaces_sharedState_interface.SharedState.md) ; `patch`: [`SharedPatch`](../interfaces/flows_interfaces_sharedPatch_interface.SharedPatch.md)[]  }

#### Type declaration

▸ (`result`): `Object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `result` | `Object` |
| `result.patch` | [`SharedPatch`](../interfaces/flows_interfaces_sharedPatch_interface.SharedPatch.md)[] |
| `result.shared` | [`SharedState`](../interfaces/flows_interfaces_sharedState_interface.SharedState.md) |

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `nextShared` | [`SharedState`](../interfaces/flows_interfaces_sharedState_interface.SharedState.md) |
| `patch` | [`SharedPatch`](../interfaces/flows_interfaces_sharedPatch_interface.SharedPatch.md)[] |

#### Defined in

[src/flows/interfaces/mapInOut.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/mapInOut.interface.ts#L9)
