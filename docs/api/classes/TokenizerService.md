# Class: TokenizerService

Implementação aproximada do serviço de tokenização baseada em caracteres.

⚠️ **IMPORTANTE**: Esta é uma implementação placeholder que utiliza aproximações.
Para uso em produção, substitua por tokenizadores específicos do modelo:
- `tiktoken` para modelos OpenAI
- Claude API nativa para modelos Anthropic
- Outros tokenizadores específicos por provedor

Esta implementação utiliza a regra geral de que 1 token ≈ 4 caracteres em inglês,
que é uma aproximação razoável para muitos modelos, mas pode variar significativamente
depending do idioma e do tipo de conteúdo.

**`Example`**

```typescript
// Uso básico
const tokenizer = new TokenizerService('gpt-4');
const messages = [
  { role: 'user', content: 'Hello world' }
];
const tokens = tokenizer.countTokens(messages); // ~6 tokens

// Para produção, use tiktoken:
// import { encoding_for_model } from 'tiktoken';
// class TiktokenService implements ITokenizerService {
//   private enc = encoding_for_model('gpt-4');
//   countTokens(messages: Message[]): number {
//     return messages.reduce((acc, msg) => acc + this.enc.encode(msg.content).length, 0);
//   }
// }
```

**`Remarks`**

- A precisão varia por idioma (melhor para inglês, pior para idiomas com caracteres multibyte)
- Não considera особенности específicas do modelo
- Adequada apenas para prototipagem e desenvolvimento

## Implements

- [`ITokenizerService`](../interfaces/ITokenizerService.md)

## Table of contents

### Constructors

- [constructor](TokenizerService.md#constructor)

### Properties

- [CHARS\_PER\_TOKEN](TokenizerService.md#chars_per_token)
- [FIXED\_CHAR\_OVERHEAD\_PER\_MESSAGE](TokenizerService.md#fixed_char_overhead_per_message)
- [model](TokenizerService.md#model)

### Methods

- [countTokens](TokenizerService.md#counttokens)

## Constructors

### constructor

• **new TokenizerService**(`model`): [`TokenizerService`](TokenizerService.md)

Cria uma nova instância do TokenizerService.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `model` | `string` | O nome do modelo de LLM (usado apenas para compatibilidade) |

#### Returns

[`TokenizerService`](TokenizerService.md)

**`Example`**

```typescript
const tokenizer = new TokenizerService('gpt-4');
const tokenizer = new TokenizerService('claude-3');
```

#### Defined in

[src/memory/tokenizer.ts:65](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/tokenizer.ts#L65)

## Properties

### CHARS\_PER\_TOKEN

• `Private` `Readonly` **CHARS\_PER\_TOKEN**: ``4``

Proporção de caracteres por token (aproximação geral para modelos GPT)

#### Defined in

[src/memory/tokenizer.ts:47](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/tokenizer.ts#L47)

___

### FIXED\_CHAR\_OVERHEAD\_PER\_MESSAGE

• `Private` `Readonly` **FIXED\_CHAR\_OVERHEAD\_PER\_MESSAGE**: ``10``

Overhead fixo por mensagem para simular custos estruturais.
Inclui: role, chaves JSON, formatação, caracteres especiais, etc.

#### Defined in

[src/memory/tokenizer.ts:53](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/tokenizer.ts#L53)

___

### model

• `Private` `Readonly` **model**: `string`

O nome do modelo para compatibilidade com a interface

#### Defined in

[src/memory/tokenizer.ts:44](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/tokenizer.ts#L44)

## Methods

### countTokens

▸ **countTokens**(`messages`): `number`

Calcula o número aproximado de tokens para uma lista de mensagens.

Utiliza uma abordagem baseada em caracteres com as seguintes considerações:
1. **Conteúdo**: Conta caracteres do conteúdo da mensagem
2. **Overhead**: Adiciona overhead fixo por mensagem para estrutura
3. **Conversão**: Converte caracteres para tokens usando proporção fixa

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](../interfaces/Message.md)[] | O histórico de mensagens em ordem cronológica. Cada mensagem deve ter role e content válidos. |

#### Returns

`number`

O número aproximado de tokens (inteiro, arredondado para cima).

**`Throws`**

Se messages for null/undefined

**`Example`**

```typescript
const tokenizer = new TokenizerService('gpt-4');

// Mensagem simples
const simple = tokenizer.countTokens([
  { role: 'user', content: 'Hi' }
]); // ~3 tokens (2 chars + 10 overhead = 12 chars / 4 = 3)

// Múltiplas mensagens
const multiple = tokenizer.countTokens([
  { role: 'system', content: 'You are helpful' }, // 15 + 10 = 25 chars
  { role: 'user', content: 'Hello' },             // 5 + 10 = 15 chars
  { role: 'assistant', content: 'Hi there' }      // 8 + 10 = 18 chars
]); // Total: 58 chars / 4 = 14.5 → 15 tokens
```

#### Implementation of

[ITokenizerService](../interfaces/ITokenizerService.md).[countTokens](../interfaces/ITokenizerService.md#counttokens)

#### Defined in

[src/memory/tokenizer.ts:101](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/tokenizer.ts#L101)
