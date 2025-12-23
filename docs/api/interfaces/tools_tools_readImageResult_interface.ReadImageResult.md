# Interface: ReadImageResult

[tools/tools/readImageResult.interface](../modules/tools_tools_readImageResult_interface.md).ReadImageResult

## Table of contents

### Properties

- [contentParts](tools_tools_readImageResult_interface.ReadImageResult.md#contentparts)
- [imageRef](tools_tools_readImageResult_interface.ReadImageResult.md#imageref)
- [meta](tools_tools_readImageResult_interface.ReadImageResult.md#meta)

## Properties

### contentParts

• **contentParts**: [`ContentPart`](../modules/memory_memory_interface.md#contentpart)[]

Conteudo pronto para ser anexado em uma mensagem multimodal
(o host ja deve ter convertido para `data:` quando aplicavel).

#### Defined in

src/tools/tools/readImageResult.interface.ts:16

___

### imageRef

• `Optional` **imageRef**: `string`

#### Defined in

src/tools/tools/readImageResult.interface.ts:18

___

### meta

• **meta**: [`ReadImageMeta`](tools_tools_readImageResult_interface.ReadImageMeta.md)

#### Defined in

src/tools/tools/readImageResult.interface.ts:17
