# Interface: ChatHistoryConfig

[memory/memory.interface](../modules/memory_memory_interface.md).ChatHistoryConfig

Configuração para o gerenciador de histórico baseada em tokens.
O desenvolvedor deve fornecer explicitamente o limite de tokens do contexto
e o serviço de tokenização compatível com o modelo.

## Table of contents

### Properties

- [maxContextTokens](memory_memory_interface.ChatHistoryConfig.md#maxcontexttokens)
- [tokenizer](memory_memory_interface.ChatHistoryConfig.md#tokenizer)

## Properties

### maxContextTokens

• **maxContextTokens**: `number`

#### Defined in

memory/memory.interface.ts:67

___

### tokenizer

• **tokenizer**: [`ITokenizerService`](memory_memory_interface.ITokenizerService.md)

#### Defined in

memory/memory.interface.ts:68
