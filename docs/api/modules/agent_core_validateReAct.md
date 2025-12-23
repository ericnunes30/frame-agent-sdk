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

Formatos aceitos:
Thought: [pensamento do modelo]
Action: [nome_da_ferramenta] = { [JSON com parÃ¢metros] }

ou:
Thought: [pensamento do modelo]
Action: [nome_da_ferramenta]
Action Input: { [JSON com parÃ¢metros] }

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `output` | `string` | Texto gerado pelo LLM para validaÃ§Ã£o |

#### Returns

[`ValidationResponse`](../interfaces/agent_core_validateReAct.ValidationResponse.md)

Objeto com resultado da validaÃ§Ã£o

#### Defined in

[src/agent/core/validateReAct.ts:27](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/core/validateReAct.ts#L27)
