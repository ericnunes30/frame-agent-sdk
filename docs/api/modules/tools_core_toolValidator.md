# Module: tools/core/toolValidator

## Table of contents

### Functions

- [formatIssuesForLLM](tools_core_toolValidator.md#formatissuesforllm)
- [validateToolParams](tools_core_toolValidator.md#validatetoolparams)

## Functions

### formatIssuesForLLM

▸ **formatIssuesForLLM**(`issues`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `issues` | [`ToolValidationIssue`](../interfaces/tools_core_interfaces.ToolValidationIssue.md)[] |

#### Returns

`string`

#### Defined in

tools/core/toolValidator.ts:105

___

### validateToolParams

▸ **validateToolParams**(`tool`, `params`): [`ToolValidationResult`](../interfaces/tools_core_interfaces.ToolValidationResult.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tool` | [`ITool`](../interfaces/tools_core_interfaces.ITool.md)\<[`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md), `unknown`\> |
| `params` | `unknown` |

#### Returns

[`ToolValidationResult`](../interfaces/tools_core_interfaces.ToolValidationResult.md)

#### Defined in

tools/core/toolValidator.ts:74
