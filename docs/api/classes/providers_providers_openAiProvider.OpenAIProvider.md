# Class: OpenAIProvider

[providers/providers/openAiProvider](../modules/providers_providers_openAiProvider.md).OpenAIProvider

Provedor oficial da OpenAI para integração com modelos GPT.

Esta classe implementa a integração direta com a API oficial da OpenAI,
oferecendo suporte completo a todos os recursos da plataforma, incluindo
streaming, diferentes modelos e parâmetros avançados.

## Características

- **API Oficial**: Integração direta com OpenAI
- **Streaming Nativo**: Suporte completo a respostas em tempo real
- **Todos os Modelos**: GPT-4, GPT-3.5-turbo e variantes
- **Parâmetros Avançados**: Temperature, topP, maxTokens, etc.
- **Compatibilidade Legada**: Suporte a parâmetros posicionais para testes

**`Example`**

```typescript
import { OpenAIProvider } from '@/providers';

const provider = new OpenAIProvider('sua-api-key-openai');

const response = await provider.chatCompletion(
  [
    { role: 'user', content: 'Olá!' }
  ],
  'gpt-4',
  'sua-api-key',
  0.7,
  false,
  'Você é um assistente útil.',
  1000
);

console.log(response.choices[0].message.content);
```

**`Remarks`**

- Para uso moderno, considere usar `ProviderAdapter` com `ProviderConfig`
- Este provedor espera parâmetros posicionais (compatibilidade com testes legados)
- Requer API key válida da OpenAI
- Suporta todos os modelos disponíveis na plataforma OpenAI

**`See`**

 - ProviderAdapter Para interface unificada
 - OpenAICompatibleProvider Para provedores compatíveis

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

Cria uma nova instância do provedor OpenAI.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiKey` | `string` | Chave de API da OpenAI. Deve ser uma string válida fornecida pelo usuário. |

#### Returns

[`OpenAIProvider`](providers_providers_openAiProvider.OpenAIProvider.md)

**`Example`**

```typescript
const provider = new OpenAIProvider(process.env.OPENAI_API_KEY!);
```

**`Throws`**

Se a API key não for fornecida

#### Defined in

[src/providers/providers/openAiProvider.ts:70](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/providers/providers/openAiProvider.ts#L70)

## Properties

### client

• `Private` **client**: `OpenAI`

Cliente oficial da OpenAI

#### Defined in

[src/providers/providers/openAiProvider.ts:55](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/providers/providers/openAiProvider.ts#L55)

___

### name

• **name**: `string` = `'openai'`

Nome identificador do provedor

#### Defined in

[src/providers/providers/openAiProvider.ts:52](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/providers/providers/openAiProvider.ts#L52)

## Methods

### \_processStream

▸ **_processStream**(`streamResponse`): `Promise`\<\{ `content`: `string` ; `role`: `string`  }\>

Processa respostas em streaming da API da OpenAI.

Método privado que acumula chunks de conteúdo de streaming em uma
resposta completa, fornecendo uma interface consistente independente
do modo de resposta (streaming ou não).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `streamResponse` | `AsyncIterable`\<`ChatCompletionChunk`\> | Stream de chunks retornado pela API da OpenAI. |

#### Returns

`Promise`\<\{ `content`: `string` ; `role`: `string`  }\>

Promise que resolve para a mensagem completa do assistente.

**`Example`**

```typescript
const stream = await this.client.chat.completions.create({...});
const fullResponse = await this._processStream(stream);
console.log(fullResponse.content); // Conteúdo completo acumulado
```

#### Defined in

[src/providers/providers/openAiProvider.ts:97](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/providers/providers/openAiProvider.ts#L97)

___

### chatCompletion

▸ **chatCompletion**(`chatHistory`, `model`, `apiKey`, `temperature`, `useStream`, `systemPrompt`, `maxTokens?`, `topP?`): `Promise`\<`any`\>

Executa uma chamada de chat completion usando a API da OpenAI.

Este método fornece uma interface direta para a API da OpenAI,
suportando tanto respostas síncronas quanto streaming.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chatHistory` | \{ `content`: `string` ; `role`: `string`  }[] | Array de mensagens da conversa. Cada mensagem deve ter role ('system', 'user', 'assistant') e content. |
| `model` | `string` | Nome do modelo a ser usado. Exemplos: 'gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo-preview' |
| `apiKey` | `string` | Chave de API da OpenAI. Se fornecida, sobrescreve a API key do construtor. |
| `temperature` | `number` | Controla a criatividade (0.0 - 2.0). |
| `useStream` | `boolean` | Habilita resposta em streaming. |
| `systemPrompt` | `string` | Prompt do sistema para definir comportamento. |
| `maxTokens?` | `number` | Limite máximo de tokens na resposta. |
| `topP?` | `number` | Nucleus sampling parameter (0.0 - 1.0). |

#### Returns

`Promise`\<`any`\>

Resposta da API da OpenAI no formato original.

**`Throws`**

Se parâmetros inválidos forem fornecidos

**`Throws`**

Se a API key for inválida

**`Throws`**

Se houver erro na comunicação com a API

**`Example`**

```typescript
// Resposta síncrona
const response = await provider.chatCompletion(
  [{ role: 'user', content: 'Olá!' }],
  'gpt-4',
  'sk-...',
  0.7,
  false,
  'Você é um assistente útil.',
  1000
);

console.log(response.choices[0].message.content);

// Resposta com streaming
const streamResponse = await provider.chatCompletion(
  [{ role: 'user', content: 'Conte uma história...' }],
  'gpt-4',
  'sk-...',
  0.8,
  true,
  'Você é um contador de histórias.',
  2000
);

for await (const chunk of streamResponse) {
  process.stdout.write(chunk.content);
}
```

**`Remarks`**

- Para uso moderno, considere ProviderAdapter com ProviderConfig
- Este método mantém compatibilidade com código legado
- System prompt é enviado como primeira mensagem com role 'system'
- Streaming retorna um iterador assíncrono de chunks

#### Defined in

[src/providers/providers/openAiProvider.ts:179](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/providers/providers/openAiProvider.ts#L179)
