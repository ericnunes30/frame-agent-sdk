# Class: OpenAIProvider

[providers/providers/openAiProvider](../modules/providers_providers_openAiProvider.md).OpenAIProvider

Provedor oficial da OpenAI.

Observações:
- Espera parâmetros posicionais (compatibilidade legada com testes)
- Para uso moderno, prefira `openaiCompatible` com `ProviderConfig` unificado

## Table of contents

### Constructors

- [constructor](providers_providers_openAiProvider.OpenAIProvider.md#constructor)

### Properties

- [client](providers_providers_openAiProvider.OpenAIProvider.md#client)
- [name](providers_providers_openAiProvider.OpenAIProvider.md#name)

### Methods

- [\_processStream](providers_providers_openAiProvider.OpenAIProvider.md#_processstream)
- [chatCompletion](providers_providers_openAiProvider.OpenAIProvider.md#chatcompletion)

## Constructors

### constructor

• **new OpenAIProvider**(`apiKey`): [`OpenAIProvider`](providers_providers_openAiProvider.OpenAIProvider.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiKey` | `string` |

#### Returns

[`OpenAIProvider`](providers_providers_openAiProvider.OpenAIProvider.md)

#### Defined in

providers/providers/openAiProvider.ts:16

## Properties

### client

• `Private` **client**: `OpenAI`

#### Defined in

providers/providers/openAiProvider.ts:14

___

### name

• **name**: `string` = `'openai'`

#### Defined in

providers/providers/openAiProvider.ts:13

## Methods

### \_processStream

▸ **_processStream**(`streamResponse`): `Promise`\<\{ `content`: `string` ; `role`: `string`  }\>

Processa a resposta de streaming da API, acumulando os chunks de conteúdo.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `streamResponse` | `AsyncIterable`\<`ChatCompletionChunk`\> | O stream de dados retornado pela API da OpenAI. |

#### Returns

`Promise`\<\{ `content`: `string` ; `role`: `string`  }\>

Uma promessa que resolve para a mensagem completa do assistente.

#### Defined in

providers/providers/openAiProvider.ts:26

___

### chatCompletion

▸ **chatCompletion**(`chatHistory`, `model`, `apiKey`, `temperature`, `useStream`, `systemPrompt`, `maxTokens?`, `topP?`): `Promise`\<`any`\>

Método para interagir com o modelo de linguagem da OpenAI.

#### Parameters

| Name | Type |
| :------ | :------ |
| `chatHistory` | \{ `content`: `string` ; `role`: `string`  }[] |
| `model` | `string` |
| `apiKey` | `string` |
| `temperature` | `number` |
| `useStream` | `boolean` |
| `systemPrompt` | `string` |
| `maxTokens?` | `number` |
| `topP?` | `number` |

#### Returns

`Promise`\<`any`\>

#### Defined in

providers/providers/openAiProvider.ts:39
