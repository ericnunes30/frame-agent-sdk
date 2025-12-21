# Class: ApprovalParams

[tools/tools/approvalTool](../modules/tools_tools_approvalTool.md).ApprovalParams

Parâmetros para ferramenta de aprovação.

Define os dados necessários para registrar uma decisão de aprovação
ou rejeição, incluindo feedback detalhado e sugestões de melhoria.

## Implements

- [`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md)

## Table of contents

### Constructors

- [constructor](tools_tools_approvalTool.ApprovalParams.md#constructor)

### Properties

- [approved](tools_tools_approvalTool.ApprovalParams.md#approved)
- [feedback](tools_tools_approvalTool.ApprovalParams.md#feedback)
- [suggestions](tools_tools_approvalTool.ApprovalParams.md#suggestions)
- [schemaProperties](tools_tools_approvalTool.ApprovalParams.md#schemaproperties)

## Constructors

### constructor

• **new ApprovalParams**(): [`ApprovalParams`](tools_tools_approvalTool.ApprovalParams.md)

#### Returns

[`ApprovalParams`](tools_tools_approvalTool.ApprovalParams.md)

## Properties

### approved

• **approved**: `boolean`

Indica se a solução foi aprovada (true) ou rejeitada (false)

#### Defined in

[src/tools/tools/approvalTool.ts:13](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/approvalTool.ts#L13)

___

### feedback

• **feedback**: `string`

Feedback detalhado sobre a decisão de aprovação/rejeição

#### Defined in

[src/tools/tools/approvalTool.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/approvalTool.ts#L15)

___

### suggestions

• `Optional` **suggestions**: `string`[]

Lista de sugestões para melhoria (opcional)

#### Defined in

[src/tools/tools/approvalTool.ts:17](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/approvalTool.ts#L17)

___

### schemaProperties

▪ `Static` **schemaProperties**: `Object`

Schema de validação para os parâmetros

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approved` | \{ `required`: `boolean` = true; `type`: `string` = 'boolean' } |
| `approved.required` | `boolean` |
| `approved.type` | `string` |
| `feedback` | \{ `minLength`: `number` = 1; `required`: `boolean` = true; `type`: `string` = 'string' } |
| `feedback.minLength` | `number` |
| `feedback.required` | `boolean` |
| `feedback.type` | `string` |
| `suggestions` | \{ `items`: \{ `type`: `string` = 'string' } ; `required`: `boolean` = false; `type`: `string` = 'array' } |
| `suggestions.items` | \{ `type`: `string` = 'string' } |
| `suggestions.items.type` | `string` |
| `suggestions.required` | `boolean` |
| `suggestions.type` | `string` |

#### Defined in

[src/tools/tools/approvalTool.ts:20](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/approvalTool.ts#L20)
