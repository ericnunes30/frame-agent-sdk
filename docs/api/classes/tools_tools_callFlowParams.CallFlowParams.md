# Class: CallFlowParams

[tools/tools/callFlowParams](../modules/tools_tools_callFlowParams.md).CallFlowParams

Interface vazia que serve como base para todas as classes de parâmetros de ferramentas.

Esta interface atua como um marcador de tipo para garantir que todas as classes
de parâmetros implementem uma estrutura comum. Classes de parâmetros devem
extender esta interface para serem compatíveis com o sistema de ferramentas.

**`Example`**

```typescript
// Classe de parâmetros válida
export class CalculatorParams implements IToolParams {
  operation!: 'add' | 'subtract' | 'multiply' | 'divide';
  a!: number;
  b!: number;
}

// Uso em ferramenta
export class CalculatorTool extends ToolBase<CalculatorParams> {
  public readonly name = 'calculator';
  public readonly parameterSchema = CalculatorParams;
}
```

**`Remarks`**

- Interface vazia serve apenas para tipagem
- Classes de parâmetros devem implementar propriedades específicas
- Usada como constraint genérico em ITool

**`See`**

 - ITool Para interface principal de ferramentas
 - ToolBase Para classe base de ferramentas

## Implements

- [`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md)

## Table of contents

### Constructors

- [constructor](tools_tools_callFlowParams.CallFlowParams.md#constructor)

### Properties

- [flowId](tools_tools_callFlowParams.CallFlowParams.md#flowid)
- [input](tools_tools_callFlowParams.CallFlowParams.md#input)
- [shared](tools_tools_callFlowParams.CallFlowParams.md#shared)
- [schemaProperties](tools_tools_callFlowParams.CallFlowParams.md#schemaproperties)

## Constructors

### constructor

• **new CallFlowParams**(): [`CallFlowParams`](tools_tools_callFlowParams.CallFlowParams.md)

#### Returns

[`CallFlowParams`](tools_tools_callFlowParams.CallFlowParams.md)

## Properties

### flowId

• **flowId**: `string`

#### Defined in

[src/tools/tools/callFlowParams.ts:5](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/callFlowParams.ts#L5)

___

### input

• `Optional` **input**: `Record`\<`string`, `unknown`\>

#### Defined in

[src/tools/tools/callFlowParams.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/callFlowParams.ts#L6)

___

### shared

• `Optional` **shared**: [`SharedState`](../interfaces/flows_interfaces_sharedState_interface.SharedState.md)

#### Defined in

[src/tools/tools/callFlowParams.ts:7](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/callFlowParams.ts#L7)

___

### schemaProperties

▪ `Static` **schemaProperties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `flowId` | \{ `minLength`: `number` = 1; `required`: `boolean` = true; `type`: `string` = 'string' } |
| `flowId.minLength` | `number` |
| `flowId.required` | `boolean` |
| `flowId.type` | `string` |
| `input` | \{ `required`: `boolean` = false; `type`: `string` = 'object' } |
| `input.required` | `boolean` |
| `input.type` | `string` |
| `shared` | \{ `required`: `boolean` = false; `type`: `string` = 'object' } |
| `shared.required` | `boolean` |
| `shared.type` | `string` |

#### Defined in

[src/tools/tools/callFlowParams.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/callFlowParams.ts#L9)
