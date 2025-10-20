# Interface: ITokenizerService

[memory/memory.interface](../modules/memory_memory_interface.md).ITokenizerService

Contrato para qualquer serviço que possa calcular o custo (em tokens)
de uma lista de mensagens. Isso permite desacoplar a lógica de contagem
de tokens (ex: tiktoken, Claude API) da lógica de gerenciamento de memória.

## Implemented by

- [`TokenizerService`](../classes/memory_tokenizer.TokenizerService.md)

## Table of contents

### Methods

- [countTokens](memory_memory_interface.ITokenizerService.md#counttokens)

## Methods

### countTokens

▸ **countTokens**(`messages`): `number`

Calcula o número total de tokens para uma lista de mensagens.
Observação: o modelo é configurado fora do módulo de memória (no serviço de tokenização).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](memory_memory_interface.Message.md)[] | O histórico de mensagens a ser analisado. |

#### Returns

`number`

O número total de tokens.

#### Defined in

memory/memory.interface.ts:24
