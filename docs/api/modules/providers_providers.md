# Module: providers/providers

## Table of contents

### References

- [ProviderInstance](providers_providers.md#providerinstance)

### Functions

- [getProvider](providers_providers.md#getprovider)
- [listProviders](providers_providers.md#listproviders)

## References

### ProviderInstance

Re-exports [ProviderInstance](providers_providers_providerRegistry.md#providerinstance)

## Functions

### getProvider

▸ **getProvider**(`name`): typeof [`OpenAIProvider`](../classes/providers_providers_openAiProvider.OpenAIProvider.md) \| typeof [`OpenAICompatibleProvider`](../classes/providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md)

Obtém o construtor do provedor pelo nome registrado.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

typeof [`OpenAIProvider`](../classes/providers_providers_openAiProvider.OpenAIProvider.md) \| typeof [`OpenAICompatibleProvider`](../classes/providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md)

**`Throws`**

Error se o provedor não estiver registrado

#### Defined in

providers/providers/index.ts:4

___

### listProviders

▸ **listProviders**(): `string`[]

Lista os nomes dos provedores registrados.

#### Returns

`string`[]

#### Defined in

providers/providers/index.ts:5
