# Interface: FlowDefinition

[flows/interfaces/flowDefinition.interface](../modules/flows_interfaces_flowDefinition_interface.md).FlowDefinition

## Table of contents

### Properties

- [capabilities](flows_interfaces_flowDefinition_interface.FlowDefinition.md#capabilities)
- [description](flows_interfaces_flowDefinition_interface.FlowDefinition.md#description)
- [factory](flows_interfaces_flowDefinition_interface.FlowDefinition.md#factory)
- [graph](flows_interfaces_flowDefinition_interface.FlowDefinition.md#graph)
- [id](flows_interfaces_flowDefinition_interface.FlowDefinition.md#id)
- [inputSchema](flows_interfaces_flowDefinition_interface.FlowDefinition.md#inputschema)
- [kind](flows_interfaces_flowDefinition_interface.FlowDefinition.md#kind)
- [outputSchema](flows_interfaces_flowDefinition_interface.FlowDefinition.md#outputschema)
- [version](flows_interfaces_flowDefinition_interface.FlowDefinition.md#version)

## Properties

### capabilities

• `Optional` **capabilities**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `requiresHuman?` | `boolean` |
| `usesTools?` | `boolean` |

#### Defined in

[src/flows/interfaces/flowDefinition.interface.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/flowDefinition.interface.ts#L12)

___

### description

• `Optional` **description**: `string`

#### Defined in

[src/flows/interfaces/flowDefinition.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/flowDefinition.interface.ts#L9)

___

### factory

• `Optional` **factory**: (`deps`: `Record`\<`string`, `unknown`\>) => [`GraphDefinition`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

#### Type declaration

▸ (`deps`): [`GraphDefinition`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `deps` | `Record`\<`string`, `unknown`\> |

##### Returns

[`GraphDefinition`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

#### Defined in

[src/flows/interfaces/flowDefinition.interface.ts:17](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/flowDefinition.interface.ts#L17)

___

### graph

• `Optional` **graph**: [`GraphDefinition`](orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

#### Defined in

[src/flows/interfaces/flowDefinition.interface.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/flowDefinition.interface.ts#L16)

___

### id

• **id**: `string`

#### Defined in

[src/flows/interfaces/flowDefinition.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/flowDefinition.interface.ts#L6)

___

### inputSchema

• `Optional` **inputSchema**: `Record`\<`string`, `unknown`\>

#### Defined in

[src/flows/interfaces/flowDefinition.interface.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/flowDefinition.interface.ts#L10)

___

### kind

• **kind**: [`FlowKind`](../modules/flows_interfaces_flowDefinition_interface.md#flowkind)

#### Defined in

[src/flows/interfaces/flowDefinition.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/flowDefinition.interface.ts#L8)

___

### outputSchema

• `Optional` **outputSchema**: `Record`\<`string`, `unknown`\>

#### Defined in

[src/flows/interfaces/flowDefinition.interface.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/flowDefinition.interface.ts#L11)

___

### version

• **version**: `string`

#### Defined in

[src/flows/interfaces/flowDefinition.interface.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/flows/interfaces/flowDefinition.interface.ts#L7)
