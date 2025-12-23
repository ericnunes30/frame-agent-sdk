# Interface: ToolPolicy

[tools/policy/toolPolicy.interface](../modules/tools_policy_toolPolicy_interface.md).ToolPolicy

## Table of contents

### Properties

- [allow](tools_policy_toolPolicy_interface.ToolPolicy.md#allow)
- [allowAskUser](tools_policy_toolPolicy_interface.ToolPolicy.md#allowaskuser)
- [allowMcpTools](tools_policy_toolPolicy_interface.ToolPolicy.md#allowmcptools)
- [deny](tools_policy_toolPolicy_interface.ToolPolicy.md#deny)

## Properties

### allow

• `Optional` **allow**: `string`[]

Lista de nomes permitidos. Quando definida e não vazia, tem prioridade sobre `deny`.
Importante: o nome deve corresponder exatamente ao `tool.name` (ex.: `file_read`, `call_flow`).

#### Defined in

[src/tools/policy/toolPolicy.interface.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/policy/toolPolicy.interface.ts#L6)

___

### allowAskUser

• `Optional` **allowAskUser**: `boolean`

Permite `ask_user` mesmo que não esteja na allowlist (ou esteja em deny).
Default: false.

#### Defined in

[src/tools/policy/toolPolicy.interface.ts:15](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/policy/toolPolicy.interface.ts#L15)

___

### allowMcpTools

• `Optional` **allowMcpTools**: `boolean`

Permite tools MCP (ex.: `mcp:context7/resolve-library-id` ou `mcp_*`).
Default: true.

#### Defined in

[src/tools/policy/toolPolicy.interface.ts:21](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/policy/toolPolicy.interface.ts#L21)

___

### deny

• `Optional` **deny**: `string`[]

Lista de nomes proibidos (aplicada quando `allow` não está definida).

#### Defined in

[src/tools/policy/toolPolicy.interface.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/policy/toolPolicy.interface.ts#L9)
