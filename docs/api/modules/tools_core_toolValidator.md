# Module: tools/core/toolValidator

## Table of contents

### Classes

- [ReActValidator](../classes/tools_core_toolValidator.ReActValidator.md)

### Functions

- [formatIssuesForLLM](tools_core_toolValidator.md#formatissuesforllm)
- [validateToolParams](tools_core_toolValidator.md#validatetoolparams)

## Functions

### formatIssuesForLLM

▸ **formatIssuesForLLM**(`issues`): `string`

Formata problemas de validação para feedback ao LLM.

Esta função converte uma lista de ToolValidationIssue em uma string
formatada especificamente para ser usada como feedback ao modelo de
linguagem, seguindo o padrão esperado pelos agentes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issues` | [`ToolValidationIssue`](../interfaces/tools_core_interfaces.ToolValidationIssue.md)[] | Lista de problemas de validação encontrados. |

#### Returns

`string`

String formatada com feedback para o LLM.

**`Example`**

```typescript
const issues = [
  { path: 'query', code: 'missing_required', message: "Property 'query' is required" },
  { path: 'limit', code: 'out_of_range', message: "Property 'limit' must be <= 100" }
];

const feedback = formatIssuesForLLM(issues);
console.log(feedback);
// Output:
// Your tool output does not match the required schema. Fix these issues and try again using the exact JSON format.
// - query: Property 'query' is required
// - limit: Property 'limit' must be <= 100
```

#### Defined in

[src/tools/core/toolValidator.ts:315](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/core/toolValidator.ts#L315)

___

### validateToolParams

▸ **validateToolParams**(`tool`, `params`): [`ToolValidationResult`](../interfaces/tools_core_interfaces.ToolValidationResult.md)

Valida parâmetros de uma ferramenta contra seu schema.

Esta função é o ponto de entrada principal para validação de parâmetros.
Ela verifica todos os aspectos do schema da ferramenta e retorna um
resultado detalhado com todos os problemas encontrados.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tool` | [`ITool`](../interfaces/tools_core_interfaces.ITool.md)\<[`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md), `unknown`\> | Ferramenta cujo schema será usado para validação. |
| `params` | `unknown` | Parâmetros a serem validados. |

#### Returns

[`ToolValidationResult`](../interfaces/tools_core_interfaces.ToolValidationResult.md)

ToolValidationResult com resultado da validação.

**`Example`**

```typescript
// Definir ferramenta com schema
class SearchTool {
  static schemaProperties = {
    query: { type: 'string', required: true, minLength: 3 },
    limit?: { type: 'number', min: 1, max: 100 }
  };
}

// Validar parâmetros
const tool = new SearchTool();
const result = validateToolParams(tool, { query: 'ab', limit: 150 });

console.log(result.valid); // false
console.log(result.issues); // [
  // { path: 'query', code: 'length_out_of_range', message: '...' },
  // { path: 'limit', code: 'out_of_range', message: '...' }
// ]
```

#### Defined in

[src/tools/core/toolValidator.ts:236](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/core/toolValidator.ts#L236)
