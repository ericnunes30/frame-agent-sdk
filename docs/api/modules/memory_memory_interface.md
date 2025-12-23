# Module: memory/memory.interface

## Table of contents

### Interfaces

- [ChatHistoryConfig](../interfaces/memory_memory_interface.ChatHistoryConfig.md)
- [IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md)
- [ITokenizerService](../interfaces/memory_memory_interface.ITokenizerService.md)
- [ImageUrlContentPart](../interfaces/memory_memory_interface.ImageUrlContentPart.md)
- [Message](../interfaces/memory_memory_interface.Message.md)
- [TextContentPart](../interfaces/memory_memory_interface.TextContentPart.md)

### Type Aliases

- [ContentPart](memory_memory_interface.md#contentpart)
- [MessageContent](memory_memory_interface.md#messagecontent)

## Type Aliases

### ContentPart

Ƭ **ContentPart**: [`TextContentPart`](../interfaces/memory_memory_interface.TextContentPart.md) \| [`ImageUrlContentPart`](../interfaces/memory_memory_interface.ImageUrlContentPart.md)

Parte de conteudo multimodal (minimo viavel).

#### Defined in

[src/memory/memory.interface.ts:61](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L61)

___

### MessageContent

Ƭ **MessageContent**: `string` \| [`ContentPart`](memory_memory_interface.md#contentpart)[]

Conteudo de uma mensagem.

- `string`: texto puro (legado)
- `ContentPart[]`: conteudo multimodal (ex.: texto + imagens)

#### Defined in

[src/memory/memory.interface.ts:58](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L58)
