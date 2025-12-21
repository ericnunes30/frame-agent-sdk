# Class: ReActValidator

[tools/core/toolValidator](../modules/tools_core_toolValidator.md).ReActValidator

Validador de formato ReAct para integração com agentFlow.ts

Esta classe fornece uma interface simplificada para validar saídas do LLM
no formato ReAct e determinar se o fluxo deve continuar ou retornar ao agente
para correção.

## Funcionalidades

- Validação completa do formato ReAct usando ToolDetector
- Classificação de tipos de erro (parsing, validation, format, unknown)
- Retorno estruturado booleano para controle de fluxo
- Integração direta com o sistema de metadados do GraphEngine

## Uso no agentFlow.ts

```typescript
// No router do agentFlow.ts
const validation = state.metadata?.validation;
if (validation?.isValid === false) {
  return 'agent'; // Volta ao agente para correção
}
if (validation?.isValid === true) {
  return 'execute'; // Continua para execução
}
```

## Table of contents

### Constructors

- [constructor](tools_core_toolValidator.ReActValidator.md#constructor)

### Methods

- [getErrorType](tools_core_toolValidator.ReActValidator.md#geterrortype)
- [validateReActFormat](tools_core_toolValidator.ReActValidator.md#validatereactformat)

## Constructors

### constructor

• **new ReActValidator**(): [`ReActValidator`](tools_core_toolValidator.ReActValidator.md)

#### Returns

[`ReActValidator`](tools_core_toolValidator.ReActValidator.md)

## Methods

### getErrorType

▸ **getErrorType**(`errorMessage`): ``"parsing"`` \| ``"validation"`` \| ``"format"`` \| ``"unknown"``

Classifica o tipo de erro com base na mensagem

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `errorMessage` | `string` | Mensagem de erro do ToolDetector |

#### Returns

``"parsing"`` \| ``"validation"`` \| ``"format"`` \| ``"unknown"``

Tipo de erro classificado

#### Defined in

[src/tools/core/toolValidator.ts:411](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/core/toolValidator.ts#L411)

___

### validateReActFormat

▸ **validateReActFormat**(`llmOutput`): `Object`

Valida uma saída do LLM no formato ReAct

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `llmOutput` | `string` | Saída do LLM a ser validada |

#### Returns

`Object`

Objeto com isValid boolean e detalhes do erro ou toolCall

| Name | Type |
| :------ | :------ |
| `error?` | \{ `details?`: `any` ; `message`: `string` ; `type`: ``"parsing"`` \| ``"validation"`` \| ``"format"`` \| ``"unknown"``  } |
| `error.details?` | `any` |
| `error.message` | `string` |
| `error.type` | ``"parsing"`` \| ``"validation"`` \| ``"format"`` \| ``"unknown"`` |
| `isValid` | `boolean` |
| `toolCall?` | `any` |

#### Defined in

[src/tools/core/toolValidator.ts:356](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/core/toolValidator.ts#L356)
