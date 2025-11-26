# Interface: ITokenizerService

Contrato para qualquer serviço que possa calcular o custo (em tokens)
de uma lista de mensagens. Isso permite desacoplar a lógica de contagem
de tokens (ex: tiktoken, Claude API) da lógica de gerenciamento de memória.

Esta interface permite que diferentes implementações de tokenização sejam
injetadas no sistema, desde tokenizadores aproximados até implementações
precisas específicas por modelo.

**`Example`**

```typescript
// Implementação com tiktoken (OpenAI)
class TiktokenService implements ITokenizerService {
  countTokens(messages: Message[]): number {
    // Implementação real com tiktoken
  }
}

// Implementação aproximada (atual)
class ApproximateTokenizer implements ITokenizerService {
  countTokens(messages: Message[]): number {
    // Implementação aproximada por caracteres
  }
}
```

## Implemented by

- [`TokenizerService`](../classes/TokenizerService.md)

## Table of contents

### Methods

- [countTokens](ITokenizerService.md#counttokens)

## Methods

### countTokens

▸ **countTokens**(`messages`): `number`

Calcula o número total de tokens para uma lista de mensagens.

Esta função deve considerar não apenas o conteúdo das mensagens,
mas também o overhead estrutural (roles, formatação JSON, etc.).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](Message.md)[] | O histórico de mensagens a ser analisado. As mensagens devem estar na ordem cronológica da conversa. |

#### Returns

`number`

O número total de tokens estimado para todas as mensagens.
O valor deve ser um número inteiro arredondado para cima.

**`Throws`**

Se as mensagens forem inválidas ou null/undefined

**`Example`**

```typescript
const tokenizer = new TokenizerService('gpt-4');
const messages = [
  { role: 'system', content: 'You are helpful' },
  { role: 'user', content: 'Hello' }
];

const totalTokens = tokenizer.countTokens(messages);
console.log(`Total de tokens: ${totalTokens}`);
```

#### Defined in

[src/memory/memory.interface.ts:95](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/memory.interface.ts#L95)
