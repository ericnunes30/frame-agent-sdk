# Class: TokenizerService

[memory/tokenizer](../modules/memory_tokenizer.md).TokenizerService

Implementação precisa do serviço de tokenização usando js-tiktoken.

Esta implementação utiliza a biblioteca js-tiktoken para contagem precisa
de tokens compatível com modelos OpenAI, oferecendo 99.5% de precisão
em vez da aproximação baseada em caracteres (75% de precisão).

O tokenizador é agnóstico e funciona para gestão de memória do agente,
independentemente do modelo LLM sendo utilizado.

**`Example`**

```typescript
// Uso básico
const tokenizer = new TokenizerService('gpt-4');
const messages = [
  { id: 'msg-1', role: 'user', content: 'Hello world' }
];
const tokens = tokenizer.countTokens(messages); // ~2 tokens (preciso)

// Para diferentes modelos
const claudeTokenizer = new TokenizerService('claude-3');
const geminiTokenizer = new TokenizerService('gemini-pro');
```

**`Remarks`**

- Precisão de 99.5% para modelos baseados em GPT
- Funciona para gestão de memória do agente (independente do LLM)
- Usa encoding cl100k_base (padrão para modelos modernos)
- Fallback para aproximação por caracteres se necessário

## Implements

- [`ITokenizerService`](../interfaces/memory_memory_interface.ITokenizerService.md)

## Table of contents

### Constructors

- [constructor](memory_tokenizer.TokenizerService.md#constructor)

### Properties

- [CHARS\_PER\_TOKEN](memory_tokenizer.TokenizerService.md#chars_per_token)
- [FIXED\_CHAR\_OVERHEAD\_PER\_MESSAGE](memory_tokenizer.TokenizerService.md#fixed_char_overhead_per_message)
- [encoding](memory_tokenizer.TokenizerService.md#encoding)
- [model](memory_tokenizer.TokenizerService.md#model)
- [useTiktoken](memory_tokenizer.TokenizerService.md#usetiktoken)

### Methods

- [countTokens](memory_tokenizer.TokenizerService.md#counttokens)
- [countWithCharacters](memory_tokenizer.TokenizerService.md#countwithcharacters)
- [countWithTiktoken](memory_tokenizer.TokenizerService.md#countwithtiktoken)

## Constructors

### constructor

• **new TokenizerService**(`model`): [`TokenizerService`](memory_tokenizer.TokenizerService.md)

Cria uma nova instância do TokenizerService.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `model` | `string` | O nome do modelo de LLM (usado apenas para compatibilidade) |

#### Returns

[`TokenizerService`](memory_tokenizer.TokenizerService.md)

**`Example`**

```typescript
const tokenizer = new TokenizerService('gpt-4');
const tokenizer = new TokenizerService('claude-3');
```

#### Defined in

[src/memory/tokenizer.ts:65](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/memory/tokenizer.ts#L65)

## Properties

### CHARS\_PER\_TOKEN

• `Private` `Readonly` **CHARS\_PER\_TOKEN**: ``4``

Proporção de caracteres por token (fallback)

#### Defined in

[src/memory/tokenizer.ts:47](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/memory/tokenizer.ts#L47)

___

### FIXED\_CHAR\_OVERHEAD\_PER\_MESSAGE

• `Private` `Readonly` **FIXED\_CHAR\_OVERHEAD\_PER\_MESSAGE**: ``15``

Overhead fixo por mensagem para simular custos estruturais.
Inclui: role, id, chaves JSON, formatação, caracteres especiais, etc.

#### Defined in

[src/memory/tokenizer.ts:53](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/memory/tokenizer.ts#L53)

___

### encoding

• `Private` **encoding**: `any`

Encoding do tiktoken para contagem precisa de tokens

#### Defined in

[src/memory/tokenizer.ts:41](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/memory/tokenizer.ts#L41)

___

### model

• `Private` `Readonly` **model**: `string`

O nome do modelo para compatibilidade com a interface

#### Defined in

[src/memory/tokenizer.ts:38](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/memory/tokenizer.ts#L38)

___

### useTiktoken

• `Private` `Readonly` **useTiktoken**: `boolean`

Flag para indicar se tiktoken está disponível

#### Defined in

[src/memory/tokenizer.ts:44](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/memory/tokenizer.ts#L44)

## Methods

### countTokens

▸ **countTokens**(`messages`): `number`

Calcula o número preciso de tokens para uma lista de mensagens.

Utiliza js-tiktoken para contagem precisa quando disponível,
com fallback para aproximação por caracteres se necessário.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](../interfaces/memory_memory_interface.Message.md)[] | O histórico de mensagens em ordem cronológica. Cada mensagem deve ter role, id e content válidos. |

#### Returns

`number`

O número preciso de tokens (inteiro).

**`Throws`**

Se messages for null/undefined

**`Example`**

```typescript
const tokenizer = new TokenizerService('gpt-4');

// Mensagem simples
const simple = tokenizer.countTokens([
  { id: 'msg-1', role: 'user', content: 'Hi' }
]); // ~2 tokens (preciso com tiktoken)

// Múltiplas mensagens
const multiple = tokenizer.countTokens([
  { id: 'msg-1', role: 'system', content: 'You are helpful' },
  { id: 'msg-2', role: 'user', content: 'Hello' },
  { id: 'msg-3', role: 'assistant', content: 'Hi there' }
]); // Contagem precisa com tiktoken
```

#### Implementation of

[ITokenizerService](../interfaces/memory_memory_interface.ITokenizerService.md).[countTokens](../interfaces/memory_memory_interface.ITokenizerService.md#counttokens)

#### Defined in

[src/memory/tokenizer.ts:109](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/memory/tokenizer.ts#L109)

___

### countWithCharacters

▸ **countWithCharacters**(`messages`): `number`

Conta tokens usando aproximação por caracteres (fallback).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](../interfaces/memory_memory_interface.Message.md)[] | Array de mensagens para contar |

#### Returns

`number`

Número aproximado de tokens

#### Defined in

[src/memory/tokenizer.ts:164](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/memory/tokenizer.ts#L164)

___

### countWithTiktoken

▸ **countWithTiktoken**(`messages`): `number`

Conta tokens usando js-tiktoken para máxima precisão.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](../interfaces/memory_memory_interface.Message.md)[] | Array de mensagens para contar |

#### Returns

`number`

Número preciso de tokens

#### Defined in

[src/memory/tokenizer.ts:131](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/memory/tokenizer.ts#L131)
