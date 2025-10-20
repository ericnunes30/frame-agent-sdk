# Interface: IProviderResponse

[providers/adapter/provider.interface](../modules/providers_adapter_provider_interface.md).IProviderResponse

Resposta normalizada de um provedor de LLM.

## Table of contents

### Properties

- [content](providers_adapter_provider_interface.IProviderResponse.md#content)
- [metadata](providers_adapter_provider_interface.IProviderResponse.md#metadata)
- [role](providers_adapter_provider_interface.IProviderResponse.md#role)

## Properties

### content

• **content**: `string`

O conteúdo de texto gerado pelo modelo.

#### Defined in

providers/adapter/provider.interface.ts:35

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `unknown`\>

Um campo opcional para metadados adicionais que um provedor
específico possa retornar, como uso de tokens ou razão de finalização.

#### Defined in

providers/adapter/provider.interface.ts:41

___

### role

• **role**: ``"assistant"``

A role do autor da mensagem, que será sempre 'assistant'.

#### Defined in

providers/adapter/provider.interface.ts:32
