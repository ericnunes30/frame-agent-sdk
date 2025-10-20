# Class: default

[providers/providers/providerRegistry](../modules/providers_providers_providerRegistry.md).default

Registro estático de provedores de LLM.
- `getProvider(name)`: retorna o construtor do provedor
- `listProviders()`: lista os nomes disponíveis

## Table of contents

### Constructors

- [constructor](providers_providers_providerRegistry.default.md#constructor)

### Properties

- [providerMap](providers_providers_providerRegistry.default.md#providermap)

### Methods

- [getProvider](providers_providers_providerRegistry.default.md#getprovider)
- [listProviders](providers_providers_providerRegistry.default.md#listproviders)

## Constructors

### constructor

• **new default**(): [`default`](providers_providers_providerRegistry.default.md)

#### Returns

[`default`](providers_providers_providerRegistry.default.md)

## Properties

### providerMap

▪ `Static` `Private` **providerMap**: `Map`\<`string`, typeof [`OpenAIProvider`](providers_providers_openAiProvider.OpenAIProvider.md) \| typeof [`OpenAICompatibleProvider`](providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md)\>

#### Defined in

providers/providers/providerRegistry.ts:24

## Methods

### getProvider

▸ **getProvider**(`name`): typeof [`OpenAIProvider`](providers_providers_openAiProvider.OpenAIProvider.md) \| typeof [`OpenAICompatibleProvider`](providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md)

Obtém o construtor do provedor pelo nome registrado.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

typeof [`OpenAIProvider`](providers_providers_openAiProvider.OpenAIProvider.md) \| typeof [`OpenAICompatibleProvider`](providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md)

**`Throws`**

Error se o provedor não estiver registrado

#### Defined in

providers/providers/providerRegistry.ts:40

___

### listProviders

▸ **listProviders**(): `string`[]

Lista os nomes dos provedores registrados.

#### Returns

`string`[]

#### Defined in

providers/providers/providerRegistry.ts:49
