# Class: ProviderAdapter

[providers/adapter/providerAdapter](../modules/providers_adapter_providerAdapter.md).ProviderAdapter

Adaptador genérico para provedores de LLM.
Expõe uma API unificada baseada em `ProviderConfig` e resolve o provider via `ProviderRegistry`.

## Table of contents

### Constructors

- [constructor](providers_adapter_providerAdapter.ProviderAdapter.md#constructor)

### Methods

- [chatCompletion](providers_adapter_providerAdapter.ProviderAdapter.md#chatcompletion)
- [hasProvider](providers_adapter_providerAdapter.ProviderAdapter.md#hasprovider)

## Constructors

### constructor

• **new ProviderAdapter**(): [`ProviderAdapter`](providers_adapter_providerAdapter.ProviderAdapter.md)

#### Returns

[`ProviderAdapter`](providers_adapter_providerAdapter.ProviderAdapter.md)

## Methods

### chatCompletion

▸ **chatCompletion**(`config`): `Promise`\<`any`\>

Chama um provedor registrado passando `ProviderConfig` completo.
- O nome do provider é inferido do prefixo de `config.model` (antes do primeiro '-')
- O provider recebe `ProviderConfig` com o `model` já sem o prefixo do provider

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ProviderConfig`](../interfaces/providers_adapter_provider_interface.ProviderConfig.md) |

#### Returns

`Promise`\<`any`\>

Resposta normalizada do provedor

#### Defined in

providers/adapter/providerAdapter.ts:15

___

### hasProvider

▸ **hasProvider**(`providerName`): `boolean`

Verifica se um provedor está disponível por nome.

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerName` | `string` |

#### Returns

`boolean`

#### Defined in

providers/adapter/providerAdapter.ts:34
