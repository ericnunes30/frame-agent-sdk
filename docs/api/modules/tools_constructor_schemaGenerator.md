# Module: tools/constructor/schemaGenerator

## Table of contents

### Functions

- [generateTypedSchema](tools_constructor_schemaGenerator.md#generatetypedschema)

## Functions

### generateTypedSchema

▸ **generateTypedSchema**(`tool`): `string`

Gera schema tipado para uma ferramenta em formato legível por LLM.

Esta função é o ponto de entrada principal do gerador de schemas. Ela
converte o parameterSchema de uma ferramenta em uma string formatada
que pode ser injetada em system prompts para fornecer ao LLM informações
sobre como chamar a ferramenta corretamente.

## Processo de Conversão

1. **Detecção de Formato**: Identifica se é JSON Schema ou schemaProperties
2. **Conversão MCP**: Se for JSON Schema, delega para MCPToSAPConverter
3. **Processamento SAP**: Converte schemaProperties para formato legível
4. **Formatação**: Adiciona metadados como enums, ranges e validações
5. **Geração Final**: Produz string no formato class Nome = { ... }

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tool` | [`ITool`](../interfaces/tools_core_interfaces.ITool.md)\<[`IToolParams`](../interfaces/tools_core_interfaces.IToolParams.md), `unknown`\> | Instância da ferramenta com parameterSchema definido. |

#### Returns

`string`

String representando o Typed Schema para o LLM.

**`Example`**

```typescript
// Schema simples
class SimpleTool extends ToolBase<SimpleParams, string> {
  public readonly name = 'simple_tool';
  public readonly parameterSchema = SimpleParams;
}

const schema = generateTypedSchema(new SimpleTool());
console.log(schema);
// class simple_tool = {
//   message: string;
// }
```

**`Example`**

```typescript
// Schema com validações
class ValidatedTool extends ToolBase<ValidatedParams, number> {
  public readonly name = 'validated_tool';
  public readonly parameterSchema = ValidatedParams;
}

const schema = generateTypedSchema(new ValidatedTool());
console.log(schema);
// class validated_tool = {
//   operation: string; // enum: add, subtract, multiply, divide
//   value: number; // range: min=1, max=100
//   precision?: number; // range: min=0, max=10
// }
```

**`Example`**

```typescript
// Schema vazio
class EmptyTool extends ToolBase<EmptyParams, void> {
  public readonly name = 'empty_tool';
  public readonly parameterSchema = EmptyParams;
}

const schema = generateTypedSchema(new EmptyTool());
console.log(schema);
// class empty_tool = {}
```

**`See`**

 - [ITool](../interfaces/tools_core_interfaces.ITool.md) Para interface da ferramenta
 - [SchemaProperties](../interfaces/tools_core_interfaces.SchemaProperties.md) Para formato do schema
 - [MCPToSAPConverter](../classes/tools_constructor_mcpToSapConverter.MCPToSAPConverter.md) Para conversão de JSON Schema

#### Defined in

[src/tools/constructor/schemaGenerator.ts:189](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/constructor/schemaGenerator.ts#L189)
