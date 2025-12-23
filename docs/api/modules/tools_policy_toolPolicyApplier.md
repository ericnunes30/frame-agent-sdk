# Module: tools/policy/toolPolicyApplier

## Table of contents

### Functions

- [applyToolPolicyToToolNames](tools_policy_toolPolicyApplier.md#applytoolpolicytotoolnames)
- [applyToolPolicyToToolSchemas](tools_policy_toolPolicyApplier.md#applytoolpolicytotoolschemas)
- [isToolAllowedByPolicy](tools_policy_toolPolicyApplier.md#istoolallowedbypolicy)

## Functions

### applyToolPolicyToToolNames

▸ **applyToolPolicyToToolNames**(`toolNames`, `policy?`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `toolNames` | `string`[] |
| `policy?` | [`ToolPolicy`](../interfaces/tools_policy_toolPolicy_interface.ToolPolicy.md) |

#### Returns

`string`[]

#### Defined in

[src/tools/policy/toolPolicyApplier.ts:38](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/policy/toolPolicyApplier.ts#L38)

___

### applyToolPolicyToToolSchemas

▸ **applyToolPolicyToToolSchemas**(`tools`, `policy?`): [`ToolSchema`](promptBuilder_promptBuilder_interface.md#toolschema)[] \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tools` | [`ToolSchema`](promptBuilder_promptBuilder_interface.md#toolschema)[] |
| `policy?` | [`ToolPolicy`](../interfaces/tools_policy_toolPolicy_interface.ToolPolicy.md) |

#### Returns

[`ToolSchema`](promptBuilder_promptBuilder_interface.md#toolschema)[] \| `undefined`

#### Defined in

[src/tools/policy/toolPolicyApplier.ts:43](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/policy/toolPolicyApplier.ts#L43)

___

### isToolAllowedByPolicy

▸ **isToolAllowedByPolicy**(`toolName`, `policy?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `toolName` | `string` |
| `policy?` | [`ToolPolicy`](../interfaces/tools_policy_toolPolicy_interface.ToolPolicy.md) |

#### Returns

`boolean`

#### Defined in

[src/tools/policy/toolPolicyApplier.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/policy/toolPolicyApplier.ts#L16)
