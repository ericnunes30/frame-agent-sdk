# Class: OpenAICompatibleProvider

[providers/providers/openaiCompatibleProvider](../modules/providers_providers_openaiCompatibleProvider.md).OpenAICompatibleProvider

Provedor compatível com OpenAI que aceita `ProviderConfig` diretamente.

Observações:
- `baseUrl` é obrigatório (ex.: `https://api.openai.com/v1` ou proxy compatível)
- Usa `reasoning_content` como fallback quando `content` vier nulo

## Table of contents

### Constructors

- [constructor](providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md#constructor)

### Properties

- [client](providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md#client)
- [name](providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md#name)

### Methods

- [buildMessages](providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md#buildmessages)
- [chatCompletion](providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md#chatcompletion)

## Constructors

### constructor

• **new OpenAICompatibleProvider**(`apiKey`): [`OpenAICompatibleProvider`](providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiKey` | `string` |

#### Returns

[`OpenAICompatibleProvider`](providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md)

#### Defined in

providers/providers/openaiCompatibleProvider.ts:17

## Properties

### client

• `Private` **client**: `OpenAI`

#### Defined in

providers/providers/openaiCompatibleProvider.ts:15

___

### name

• **name**: `string` = `'openaiCompatible'`

#### Defined in

providers/providers/openaiCompatibleProvider.ts:14

## Methods

### buildMessages

▸ **buildMessages**(`config`): `ChatCompletionMessageParam`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ProviderConfig`](../interfaces/providers_adapter_provider_interface.ProviderConfig.md) |

#### Returns

`ChatCompletionMessageParam`[]

#### Defined in

providers/providers/openaiCompatibleProvider.ts:21

___

### chatCompletion

▸ **chatCompletion**(`config`): `Promise`\<[`IProviderResponse`](../interfaces/providers_adapter_provider_interface.IProviderResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ProviderConfig`](../interfaces/providers_adapter_provider_interface.ProviderConfig.md) |

#### Returns

`Promise`\<[`IProviderResponse`](../interfaces/providers_adapter_provider_interface.IProviderResponse.md)\>

#### Defined in

providers/providers/openaiCompatibleProvider.ts:31
