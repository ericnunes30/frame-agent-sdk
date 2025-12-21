# Class: OpenAICompatibleProvider

[providers/providers/openaiCompatibleProvider](../modules/providers_providers_openaiCompatibleProvider.md).OpenAICompatibleProvider

Provedor compatível com OpenAI que aceita `ProviderConfig` diretamente.

Esta classe implementa um provedor genérico que funciona com qualquer API
compatível com o formato da OpenAI, incluindo OpenRouter, Azure OpenAI,
Anthropic Claude (via API compatível), e outros provedores que seguem
o padrão de API da OpenAI.

## Características

- **Compatibilidade Universal**: Funciona com qualquer API OpenAI-compatible
- **ProviderConfig**: Aceita configuração unificada diretamente
- **BaseUrl Obrigatória**: Requer URL base do provedor específico
- **Fallback Inteligente**: Usa reasoning_content quando content estiver vazio
- **Streaming**: Suporte completo a respostas em tempo real

## Provedores Suportados

- **OpenRouter**: `https://openrouter.ai/api/v1`
- **Azure OpenAI**: `https://{seu-endpoint}.openai.azure.com/`
- **Anthropic Claude**: `https://api.anthropic.com` (compatível)
- **Groq**: `https://api.groq.com/openai/v1`
- **Outros**: Qualquer provedor que siga a API da OpenAI

**`Example`**

```typescript
import { OpenAICompatibleProvider } from '@/providers';

// OpenRouter
const openrouter = new OpenAICompatibleProvider('sua-api-key');
const response1 = await openrouter.chatCompletion({
  model: 'meta-llama/llama-3.1-70b-instruct',
  messages: [{ role: 'user', content: 'Olá!' }],
  apiKey: 'sk-or-...',
  baseUrl: 'https://openrouter.ai/api/v1',
  temperature: 0.7
});

// Azure OpenAI
const azure = new OpenAICompatibleProvider('sua-api-key');
const response2 = await azure.chatCompletion({
  model: 'gpt-4',
  messages: [...],
  apiKey: 'sua-azure-key',
  baseUrl: 'https://seu-endpoint.openai.azure.com/',
  temperature: 0.5
});
```

**`Remarks`**

- `baseUrl` é obrigatória para todos os provedores compatíveis
- Funciona com modelos de diferentes provedores via mesmo formato
- Fallback para `reasoning_content` em provedores que usam esse campo
- Ideal para aplicações que precisam suportar múltiplos provedores

**`See`**

 - [ProviderConfig](../interfaces/providers_adapter_providerAdapter_interface.ProviderConfig.md) Para formato de configuração
 - ProviderAdapter Para interface unificada

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

Cria uma nova instância do provedor compatível com OpenAI.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiKey` | `string` | Chave de API do provedor específico. O formato varia por provedor (alguns usam 'sk-', outros formatos diferentes). |

#### Returns

[`OpenAICompatibleProvider`](providers_providers_openaiCompatibleProvider.OpenAICompatibleProvider.md)

**`Example`**

```typescript
// OpenRouter
const provider = new OpenAICompatibleProvider('sk-or-...');

// Azure OpenAI
const azureProvider = new OpenAICompatibleProvider('sua-azure-key');
```

**`Throws`**

Se a API key não for fornecida

#### Defined in

[src/providers/providers/openaiCompatibleProvider.ts:89](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/providers/providers/openaiCompatibleProvider.ts#L89)

## Properties

### client

• `Private` **client**: `OpenAI`

Cliente OpenAI configurado com baseUrl customizada

#### Defined in

[src/providers/providers/openaiCompatibleProvider.ts:70](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/providers/providers/openaiCompatibleProvider.ts#L70)

___

### name

• **name**: `string` = `'openaiCompatible'`

Nome identificador do provedor

#### Defined in

[src/providers/providers/openaiCompatibleProvider.ts:67](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/providers/providers/openaiCompatibleProvider.ts#L67)

## Methods

### buildMessages

▸ **buildMessages**(`config`): `ChatCompletionMessageParam`[]

Constrói o array de mensagens no formato da API da OpenAI.

Método privado que converte a configuração do ProviderConfig para
o formato esperado pela API da OpenAI, incluindo o system prompt
como primeira mensagem.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`ProviderConfig`](../interfaces/providers_adapter_providerAdapter_interface.ProviderConfig.md) | Configuração do provedor contendo messages e systemPrompt. |

#### Returns

`ChatCompletionMessageParam`[]

Array de mensagens formatadas para a API da OpenAI.

**`Example`**

```typescript
const config = {
  systemPrompt: 'Você é um assistente útil.',
  messages: [
    { role: 'user', content: 'Olá!' }
  ]
};

const messages = this.buildMessages(config);
// [
//   { role: 'system', content: 'Você é um assistente útil.' },
//   { role: 'user', content: 'Olá!' }
// ]
```

#### Defined in

[src/providers/providers/openaiCompatibleProvider.ts:125](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/providers/providers/openaiCompatibleProvider.ts#L125)

___

### chatCompletion

▸ **chatCompletion**(`config`): `Promise`\<[`IProviderResponse`](../interfaces/providers_adapter_providerAdapter_interface.IProviderResponse.md)\>

Executa uma chamada de chat completion usando provedor compatível com OpenAI.

Este método implementa a interface IProviderResponse, fornecendo uma
camada de compatibilidade que funciona com qualquer API que siga
o padrão da OpenAI.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`ProviderConfig`](../interfaces/providers_adapter_providerAdapter_interface.ProviderConfig.md) | Configuração completa do provedor. Deve incluir model, messages, apiKey e **baseUrl** (obrigatória). |

#### Returns

`Promise`\<[`IProviderResponse`](../interfaces/providers_adapter_providerAdapter_interface.IProviderResponse.md)\>

Resposta no formato IProviderResponse unificado.

**`Throws`**

Se baseUrl não for fornecida

**`Throws`**

Se houver erro na comunicação com a API

**`Throws`**

Se parâmetros inválidos forem fornecidos

**`Example`**

```typescript
// OpenRouter
const response = await provider.chatCompletion({
  model: 'meta-llama/llama-3.1-70b-instruct',
  messages: [{ role: 'user', content: 'Explique IA' }],
  apiKey: 'sk-or-...',
  baseUrl: 'https://openrouter.ai/api/v1',
  temperature: 0.7,
  maxTokens: 1000
});

console.log(response.content);

// Com streaming
const streamResponse = await provider.chatCompletion({
  model: 'claude-3-sonnet',
  messages: [...],
  apiKey: 'sua-api-key',
  baseUrl: 'https://api.anthropic.com',
  stream: true
});

for await (const chunk of streamResponse) {
  process.stdout.write(chunk.content);
}
```

**`Remarks`**

- `baseUrl` é obrigatória e deve apontar para a API do provedor específico
- Suporta fallback para `reasoning_content` em provedores que usam esse campo
- Streaming retorna iterador assíncrono de chunks
- Metadados incluem informações do modelo, uso de tokens e resposta raw

**`See`**

 - [ProviderConfig](../interfaces/providers_adapter_providerAdapter_interface.ProviderConfig.md) Para formato da configuração
 - [IProviderResponse](../interfaces/providers_adapter_providerAdapter_interface.IProviderResponse.md) Para formato da resposta

#### Defined in

[src/providers/providers/openaiCompatibleProvider.ts:188](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/providers/providers/openaiCompatibleProvider.ts#L188)
