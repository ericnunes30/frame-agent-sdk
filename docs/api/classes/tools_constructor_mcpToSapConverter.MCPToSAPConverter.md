# Class: MCPToSAPConverter

[tools/constructor/mcpToSapConverter](../modules/tools_constructor_mcpToSapConverter.md).MCPToSAPConverter

Conversor de formato MCP (JSON Schema) para formato SAP (Schema Aligned Parsing)

Responsabilidade: Converter JSON Schema do MCP para formato SAP simplificado

Regras de Conversão Simplificadas:
- Envolve todo o JSON Schema original dentro de uma classe
- Formato: class NomeClasse = ({ JSON Schema completo })
- Preserva toda a estrutura original do MCP sem transformações complexas

## Table of contents

### Constructors

- [constructor](tools_constructor_mcpToSapConverter.MCPToSAPConverter.md#constructor)

### Methods

- [convertJsonSchemaToSAP](tools_constructor_mcpToSapConverter.MCPToSAPConverter.md#convertjsonschematosap)

## Constructors

### constructor

• **new MCPToSAPConverter**(): [`MCPToSAPConverter`](tools_constructor_mcpToSapConverter.MCPToSAPConverter.md)

#### Returns

[`MCPToSAPConverter`](tools_constructor_mcpToSapConverter.MCPToSAPConverter.md)

## Methods

### convertJsonSchemaToSAP

▸ **convertJsonSchemaToSAP**(`jsonSchema`, `toolName`): `string`

Converte JSON Schema do MCP para formato SAP simplificado

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jsonSchema` | `any` | Schema JSON do MCP |
| `toolName` | `string` | Nome da ferramenta para gerar nome da classe |

#### Returns

`string`

String no formato SAP simplificado

#### Defined in

[src/tools/constructor/mcpToSapConverter.ts:21](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/constructor/mcpToSapConverter.ts#L21)
