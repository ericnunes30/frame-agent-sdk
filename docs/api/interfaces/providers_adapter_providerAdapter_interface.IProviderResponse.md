# Interface: IProviderResponse

[providers/adapter/providerAdapter.interface](../modules/providers_adapter_providerAdapter_interface.md).IProviderResponse

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

- [content](providers_adapter_providerAdapter_interface.IProviderResponse.md#content)
- [metadata](providers_adapter_providerAdapter_interface.IProviderResponse.md#metadata)
- [role](providers_adapter_providerAdapter_interface.IProviderResponse.md#role)

## Properties

### content

• **content**: `string`

O conteúdo de texto gerado pelo modelo.
Pode ser null em caso de erro ou quando a resposta está sendo processada.

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:220](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/providers/adapter/providerAdapter.interface.ts#L220)

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

[src/providers/adapter/providerAdapter.interface.ts:243](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/providers/adapter/providerAdapter.interface.ts#L243)

___

### role

• **role**: ``"assistant"``

A role do autor da mensagem.
Sempre será 'assistant' para respostas do modelo de linguagem.

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:214](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/providers/adapter/providerAdapter.interface.ts#L214)
