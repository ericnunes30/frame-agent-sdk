# Interface: ProviderConfig

[providers/adapter/provider.interface](../modules/providers_adapter_provider_interface.md).ProviderConfig

Parâmetros de configuração aceitos por quaisquer provedores via ProviderAdapter.
Observação: para `openaiCompatible`, `baseUrl` é obrigatório.

## Table of contents

### Properties

- [apiKey](providers_adapter_provider_interface.ProviderConfig.md#apikey)
- [baseUrl](providers_adapter_provider_interface.ProviderConfig.md#baseurl)
- [maxTokens](providers_adapter_provider_interface.ProviderConfig.md#maxtokens)
- [messages](providers_adapter_provider_interface.ProviderConfig.md#messages)
- [model](providers_adapter_provider_interface.ProviderConfig.md#model)
- [stream](providers_adapter_provider_interface.ProviderConfig.md#stream)
- [systemPrompt](providers_adapter_provider_interface.ProviderConfig.md#systemprompt)
- [temperature](providers_adapter_provider_interface.ProviderConfig.md#temperature)
- [tools](providers_adapter_provider_interface.ProviderConfig.md#tools)
- [topP](providers_adapter_provider_interface.ProviderConfig.md#topp)

## Properties

### apiKey

• **apiKey**: `string`

#### Defined in

providers/adapter/provider.interface.ts:12

___

### baseUrl

• `Optional` **baseUrl**: `string`

#### Defined in

providers/adapter/provider.interface.ts:17

___

### maxTokens

• `Optional` **maxTokens**: `number`

#### Defined in

providers/adapter/provider.interface.ts:20

___

### messages

• **messages**: \{ `content`: `string` ; `role`: `string`  }[]

#### Defined in

providers/adapter/provider.interface.ts:11

___

### model

• **model**: `string`

#### Defined in

providers/adapter/provider.interface.ts:10

___

### stream

• **stream**: `boolean`

#### Defined in

providers/adapter/provider.interface.ts:14

___

### systemPrompt

• **systemPrompt**: `string`

#### Defined in

providers/adapter/provider.interface.ts:15

___

### temperature

• **temperature**: `number`

#### Defined in

providers/adapter/provider.interface.ts:13

___

### tools

• `Optional` **tools**: \{ `description`: `string` ; `name`: `string` ; `parameters`: `any`  }[]

#### Defined in

providers/adapter/provider.interface.ts:24

___

### topP

• `Optional` **topP**: `number`

#### Defined in

providers/adapter/provider.interface.ts:21
