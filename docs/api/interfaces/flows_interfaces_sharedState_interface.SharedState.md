# Interface: SharedState

[flows/interfaces/sharedState.interface](../modules/flows_interfaces_sharedState_interface.md).SharedState

## Table of contents

### Properties

- [artifacts](flows_interfaces_sharedState_interface.SharedState.md#artifacts)
- [decisions](flows_interfaces_sharedState_interface.SharedState.md#decisions)
- [facts](flows_interfaces_sharedState_interface.SharedState.md#facts)
- [plan](flows_interfaces_sharedState_interface.SharedState.md#plan)
- [timeline](flows_interfaces_sharedState_interface.SharedState.md#timeline)

## Properties

### artifacts

• `Optional` **artifacts**: \{ `metadata?`: `Record`\<`string`, `unknown`\> ; `name`: `string` ; `type`: `string` ; `value`: `string`  }[]

#### Defined in

[src/flows/interfaces/sharedState.interface.ts:4](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/sharedState.interface.ts#L4)

___

### decisions

• `Optional` **decisions**: \{ `data?`: `Record`\<`string`, `unknown`\> ; `description`: `string` ; `id`: `string` ; `result`: `string`  }[]

#### Defined in

[src/flows/interfaces/sharedState.interface.ts:5](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/sharedState.interface.ts#L5)

___

### facts

• `Optional` **facts**: `Record`\<`string`, `unknown`\>

#### Defined in

[src/flows/interfaces/sharedState.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/sharedState.interface.ts#L6)

___

### plan

• `Optional` **plan**: \{ `description`: `string` ; `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` \| ``"failed"``  }[]

#### Defined in

[src/flows/interfaces/sharedState.interface.ts:2](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/sharedState.interface.ts#L2)

___

### timeline

• `Optional` **timeline**: \{ `data?`: `Record`\<`string`, `unknown`\> ; `timestamp`: `string` ; `type`: `string`  }[]

#### Defined in

[src/flows/interfaces/sharedState.interface.ts:3](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/sharedState.interface.ts#L3)
