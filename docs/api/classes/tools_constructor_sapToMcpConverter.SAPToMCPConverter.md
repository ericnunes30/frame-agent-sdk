# Class: SAPToMCPConverter

[tools/constructor/sapToMcpConverter](../modules/tools_constructor_sapToMcpConverter.md).SAPToMCPConverter

Conversor de formato SAP (Schema Aligned Parsing) para formato MCP (JSON Schema)

Responsabilidade: Converter formato SAP para JSON válido do MCP

Regras de Conversão:
- Propriedades com ? → required omitido
- Comentários length → minLength/maxLength
- Comentários range → minimum/maximum
- Tipos TypeScript → Tipos JSON Schema correspondentes

## Table of contents

### Constructors

- [constructor](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#constructor)

### Methods

- [convertParsedSAPToJSONSchema](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#convertparsedsaptojsonschema)
- [convertSAPToMCP](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#convertsaptomcp)
- [findHandlerForComment](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#findhandlerforcomment)
- [getCommentHandlers](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#getcommenthandlers)
- [handleDescriptionComment](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#handledescriptioncomment)
- [handleEnumComment](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#handleenumcomment)
- [handleLengthComment](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#handlelengthcomment)
- [handleRangeComment](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#handlerangecomment)
- [mapSingleTypeScriptTypeToJSON](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#mapsingletypescripttypetojson)
- [mapTypeScriptTypeToJSON](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#maptypescripttypetojson)
- [parseCommentsIntoSchema](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#parsecommentsintoschema)
- [parseSAPFormat](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#parsesapformat)
- [parseSAPProperty](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#parsesapproperty)
- [parseSimplifiedSAPFormat](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#parsesimplifiedsapformat)
- [parseTraditionalSAPFormat](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md#parsetraditionalsapformat)

## Constructors

### constructor

• **new SAPToMCPConverter**(): [`SAPToMCPConverter`](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md)

#### Returns

[`SAPToMCPConverter`](tools_constructor_sapToMcpConverter.SAPToMCPConverter.md)

## Methods

### convertParsedSAPToJSONSchema

▸ **convertParsedSAPToJSONSchema**(`parsedSAP`): `any`

Converte SAP parseado para JSON Schema final

#### Parameters

| Name | Type |
| :------ | :------ |
| `parsedSAP` | `any` |

#### Returns

`any`

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:440](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L440)

___

### convertSAPToMCP

▸ **convertSAPToMCP**(`sapFormat`, `toolName`): `any`

Converte formato SAP para JSON Schema do MCP

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sapFormat` | `string` | String no formato SAP |
| `toolName` | `string` | Nome da ferramenta |

#### Returns

`any`

JSON Schema válido do MCP

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:22](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L22)

___

### findHandlerForComment

▸ **findHandlerForComment**(`part`, `handlers`): (`part`: `string`, `schema`: `any`) => `void`

Encontra o handler apropriado para um comentário

#### Parameters

| Name | Type |
| :------ | :------ |
| `part` | `string` |
| `handlers` | \{ `handle`: (`part`: `string`, `schema`: `any`) => `void` ; `test`: (`part`: `string`) => `boolean`  }[] |

#### Returns

`fn`

▸ (`part`, `schema`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `part` | `string` |
| `schema` | `any` |

##### Returns

`void`

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:341](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L341)

___

### getCommentHandlers

▸ **getCommentHandlers**(): \{ `handle`: (`part`: `string`, `schema`: `any`) => `void` ; `test`: (`part`: `string`) => `boolean`  }[]

Retorna os handlers para cada tipo de comentário

#### Returns

\{ `handle`: (`part`: `string`, `schema`: `any`) => `void` ; `test`: (`part`: `string`) => `boolean`  }[]

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:317](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L317)

___

### handleDescriptionComment

▸ **handleDescriptionComment**(`part`, `schema`): `void`

Processa comentário de descrição

#### Parameters

| Name | Type |
| :------ | :------ |
| `part` | `string` |
| `schema` | `any` |

#### Returns

`void`

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:352](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L352)

___

### handleEnumComment

▸ **handleEnumComment**(`part`, `schema`): `void`

Processa comentário de enum

#### Parameters

| Name | Type |
| :------ | :------ |
| `part` | `string` |
| `schema` | `any` |

#### Returns

`void`

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:411](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L411)

___

### handleLengthComment

▸ **handleLengthComment**(`part`, `schema`): `void`

Processa comentário de length

#### Parameters

| Name | Type |
| :------ | :------ |
| `part` | `string` |
| `schema` | `any` |

#### Returns

`void`

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:365](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L365)

___

### handleRangeComment

▸ **handleRangeComment**(`part`, `schema`): `void`

Processa comentário de range

#### Parameters

| Name | Type |
| :------ | :------ |
| `part` | `string` |
| `schema` | `any` |

#### Returns

`void`

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:388](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L388)

___

### mapSingleTypeScriptTypeToJSON

▸ **mapSingleTypeScriptTypeToJSON**(`typeScriptType`): `string`

Mapeia um tipo TypeScript individual para JSON Schema

#### Parameters

| Name | Type |
| :------ | :------ |
| `typeScriptType` | `string` |

#### Returns

`string`

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:271](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L271)

___

### mapTypeScriptTypeToJSON

▸ **mapTypeScriptTypeToJSON**(`typeScriptType`): `string` \| `string`[]

Mapeia tipos TypeScript para tipos JSON Schema

#### Parameters

| Name | Type |
| :------ | :------ |
| `typeScriptType` | `string` |

#### Returns

`string` \| `string`[]

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:250](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L250)

___

### parseCommentsIntoSchema

▸ **parseCommentsIntoSchema**(`comments`, `schema`): `void`

Converte comentários SAP para propriedades do schema

#### Parameters

| Name | Type |
| :------ | :------ |
| `comments` | `string` |
| `schema` | `any` |

#### Returns

`void`

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:298](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L298)

___

### parseSAPFormat

▸ **parseSAPFormat**(`sapFormat`): `any`

Analisa o formato SAP e extrai as propriedades

#### Parameters

| Name | Type |
| :------ | :------ |
| `sapFormat` | `string` |

#### Returns

`any`

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:56](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L56)

___

### parseSAPProperty

▸ **parseSAPProperty**(`line`): `Object`

Analisa uma linha de propriedade SAP

#### Parameters

| Name | Type |
| :------ | :------ |
| `line` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `isOptional` | `boolean` |
| `name` | `string` |
| `schema` | `any` |

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:194](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L194)

___

### parseSimplifiedSAPFormat

▸ **parseSimplifiedSAPFormat**(`sapFormat`): `any`

Analisa o formato SAP simplificado (JSON encapsulado)

#### Parameters

| Name | Type |
| :------ | :------ |
| `sapFormat` | `string` |

#### Returns

`any`

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:75](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L75)

___

### parseTraditionalSAPFormat

▸ **parseTraditionalSAPFormat**(`lines`): `any`

Analisa o formato SAP tradicional (propriedades individuais)

#### Parameters

| Name | Type |
| :------ | :------ |
| `lines` | `string`[] |

#### Returns

`any`

#### Defined in

[src/tools/constructor/sapToMcpConverter.ts:136](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/constructor/sapToMcpConverter.ts#L136)
