# Module: agent/core/validateReAct

## Table of contents

### Interfaces

- [ValidationError](../interfaces/agent_core_validateReAct.ValidationError.md)
- [ValidationResponse](../interfaces/agent_core_validateReAct.ValidationResponse.md)

### Functions

- [validateReActFormat](agent_core_validateReAct.md#validatereactformat)

## Functions

### validateReActFormat

▸ **validateReActFormat**(`output`): [`ValidationResponse`](../interfaces/agent_core_validateReAct.ValidationResponse.md)

Valida se o output do LLM segue o formato ReAct correto do SAP (Schema Aligned Parsing)

Formato esperado:
Thought: [pensamento do modelo]
Action: [nome_da_ferramenta] = { [JSON com parâmetros] }

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `output` | `string` | Texto gerado pelo LLM para validação |

#### Returns

[`ValidationResponse`](../interfaces/agent_core_validateReAct.ValidationResponse.md)

Objeto com resultado da validação

#### Defined in

[src/agent/core/validateReAct.ts:22](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/agent/core/validateReAct.ts#L22)
