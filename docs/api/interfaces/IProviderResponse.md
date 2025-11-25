# Interface: IProviderResponse

Resposta normalizada de qualquer provedor de LLM.

Esta interface padroniza o formato de resposta entre diferentes provedores,
garantindo que o código que consome as respostas possa trabalhar com
qualquer provedor de forma consistente.

**`Example`**

```typescript
const response: IProviderResponse = {
  role: 'assistant',
  content: 'Olá! Como posso ajudá-lo hoje?',
  metadata: {
    tokensUsed: 150,
    finishReason: 'stop',
    model: 'gpt-4'
  }
};
```

**`Remarks`**

- `role` é sempre 'assistant' para respostas do modelo
- `content` pode ser null em caso de erro ou resposta vazia
- `metadata` é opcional e varia por provedor

## Table of contents

### Properties

- [content](IProviderResponse.md#content)
- [metadata](IProviderResponse.md#metadata)
- [role](IProviderResponse.md#role)

## Properties

### content

• **content**: `string`

O conteúdo de texto gerado pelo modelo.
Pode ser null em caso de erro ou quando a resposta está sendo processada.

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:184](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L184)

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `unknown`\>

Metadados adicionais específicos do provedor.

Pode incluir informações como:
- `tokensUsed`: Número de tokens utilizados
- `finishReason`: Razão da finalização ('stop', 'length', 'content_filter')
- `model`: Nome do modelo usado
- `processingTime`: Tempo de processamento
- `cost`: Custo da requisição

**`Example`**

```typescript
metadata: {
  tokensUsed: 150,
  finishReason: 'stop',
  model: 'gpt-4',
  processingTime: 1250,
  cost: 0.003
}
```

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:207](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L207)

___

### role

• **role**: ``"assistant"``

A role do autor da mensagem.
Sempre será 'assistant' para respostas do modelo de linguagem.

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:178](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L178)
