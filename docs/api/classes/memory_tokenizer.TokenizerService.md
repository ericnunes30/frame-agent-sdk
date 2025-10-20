# Class: TokenizerService

[memory/tokenizer](../modules/memory_tokenizer.md).TokenizerService

IMPLEMENTAÇÃO PLACEHOLDER: Esta classe simula o comportamento de um tokenizador
contando caracteres, onde 1 token é aproximadamente 4 caracteres.
* TODO: SUBSTITUIR ESTA CLASSE PELA IMPLEMENTAÇÃO REAL (ex: usando a biblioteca 'tiktoken').

## Implements

- [`ITokenizerService`](../interfaces/memory_memory_interface.ITokenizerService.md)

## Table of contents

### Constructors

- [constructor](memory_tokenizer.TokenizerService.md#constructor)

### Properties

- [CHARS\_PER\_TOKEN](memory_tokenizer.TokenizerService.md#chars_per_token)
- [FIXED\_CHAR\_OVERHEAD\_PER\_MESSAGE](memory_tokenizer.TokenizerService.md#fixed_char_overhead_per_message)

### Methods

- [countTokens](memory_tokenizer.TokenizerService.md#counttokens)

## Constructors

### constructor

• **new TokenizerService**(): [`TokenizerService`](memory_tokenizer.TokenizerService.md)

#### Returns

[`TokenizerService`](memory_tokenizer.TokenizerService.md)

## Properties

### CHARS\_PER\_TOKEN

• `Private` `Readonly` **CHARS\_PER\_TOKEN**: ``4``

#### Defined in

memory/tokenizer.ts:12

___

### FIXED\_CHAR\_OVERHEAD\_PER\_MESSAGE

• `Private` `Readonly` **FIXED\_CHAR\_OVERHEAD\_PER\_MESSAGE**: ``10``

#### Defined in

memory/tokenizer.ts:14

## Methods

### countTokens

▸ **countTokens**(`messages`): `number`

Retorna o número de tokens com base em uma proporção de caracteres, 
utilizando 'reduce' para evitar aninhamento de ganchos lógicos.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](../interfaces/memory_memory_interface.Message.md)[] | O histórico de mensagens. |

#### Returns

`number`

#### Implementation of

[ITokenizerService](../interfaces/memory_memory_interface.ITokenizerService.md).[countTokens](../interfaces/memory_memory_interface.ITokenizerService.md#counttokens)

#### Defined in

memory/tokenizer.ts:22
