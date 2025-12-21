# Interface: ProviderConfig

[providers/adapter/providerAdapter.interface](../modules/providers_adapter_providerAdapter_interface.md).ProviderConfig

Parâmetros de configuração unificados para todos os provedores via ProviderAdapter.

Esta interface padroniza a configuração entre diferentes provedores de LLM,
permitindo que o ProviderAdapter forneça uma interface consistente independente
do provedor específico sendo usado.

**`Example`**

```typescript
// Configuração básica para OpenAI
const config: ProviderConfig = {
  model: 'gpt-4',
  messages: [
    { role: 'user', content: 'Olá!' }
  ],
  apiKey: 'sk-...',
  temperature: 0.7
};

// Configuração para provedor compatível com OpenAI
const compatibleConfig: ProviderConfig = {
  model: 'claude-3-sonnet',
  messages: [...],
  apiKey: 'sua-api-key',
  baseUrl: 'https://api.anthropic.com', // Obrigatório para compatíveis
  temperature: 0.5
};
```

**`Remarks`**

- Para `openaiCompatible`, `baseUrl` é obrigatória
- `temperature` tem default de 0.7 se não especificado
- `stream` controla resposta em tempo real
- `tools` são passadas via prompt (não function calling)

## Table of contents

### Properties

- [apiKey](providers_adapter_providerAdapter_interface.ProviderConfig.md#apikey)
- [baseUrl](providers_adapter_providerAdapter_interface.ProviderConfig.md#baseurl)
- [maxTokens](providers_adapter_providerAdapter_interface.ProviderConfig.md#maxtokens)
- [messages](providers_adapter_providerAdapter_interface.ProviderConfig.md#messages)
- [model](providers_adapter_providerAdapter_interface.ProviderConfig.md#model)
- [provider](providers_adapter_providerAdapter_interface.ProviderConfig.md#provider)
- [stream](providers_adapter_providerAdapter_interface.ProviderConfig.md#stream)
- [systemPrompt](providers_adapter_providerAdapter_interface.ProviderConfig.md#systemprompt)
- [temperature](providers_adapter_providerAdapter_interface.ProviderConfig.md#temperature)
- [tools](providers_adapter_providerAdapter_interface.ProviderConfig.md#tools)
- [topP](providers_adapter_providerAdapter_interface.ProviderConfig.md#topp)

## Properties

### apiKey

• **apiKey**: `string`

Chave de API do provedor.
Deve ser mantida segura e nunca hardcoded no código.

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:74](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/adapter/providerAdapter.interface.ts#L74)

___

### baseUrl

• `Optional` **baseUrl**: `string`

URL base da API do provedor.
**Obrigatória** para provedores compatíveis com OpenAI.

**`Example`**

```ts
- OpenAI: 'https://api.openai.com/v1'
- OpenRouter: 'https://openrouter.ai/api/v1'
- Azure OpenAI: 'https://seu-endpoint.openai.azure.com/'
- Anthropic: 'https://api.anthropic.com'
```

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:110](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/adapter/providerAdapter.interface.ts#L110)

___

### maxTokens

• `Optional` **maxTokens**: `number`

Limite máximo de tokens na resposta.
Controla o tamanho máximo da resposta gerada.

**`Default`**

```ts
2048
```

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:118](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/adapter/providerAdapter.interface.ts#L118)

___

### messages

• **messages**: \{ `content`: `string` ; `role`: `string`  }[]

Array de mensagens da conversa.
Cada mensagem deve ter role ('system', 'user', 'assistant') e content.

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:65](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/adapter/providerAdapter.interface.ts#L65)

___

### model

• **model**: `string`

Nome do modelo a ser usado.
Formato varia por provedor:
- OpenAI: 'gpt-4', 'gpt-3.5-turbo'
- OpenRouter: 'meta-llama/llama-3.1-70b-instruct'
- Claude: 'claude-3-sonnet-20240229'

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:52](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/adapter/providerAdapter.interface.ts#L52)

___

### provider

• `Optional` **provider**: `string`

Nome do provedor explícito (opcional).
Se fornecido, ignora a inferência baseada no nome do modelo.
Ex: 'openai', 'anthropic', 'openaiCompatible'

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:59](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/adapter/providerAdapter.interface.ts#L59)

___

### stream

• `Optional` **stream**: `boolean`

Habilita resposta em streaming (tempo real).
Quando true, a resposta é retornada como um iterador assíncrono.

**`Default`**

```ts
false
```

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:92](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/adapter/providerAdapter.interface.ts#L92)

___

### systemPrompt

• `Optional` **systemPrompt**: `string`

Prompt do sistema que define o comportamento do assistente.
É enviado como primeira mensagem com role 'system'.

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:98](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/adapter/providerAdapter.interface.ts#L98)

___

### temperature

• `Optional` **temperature**: `number`

Controla a criatividade das respostas (0.0 - 2.0).
- 0.0: Respostas mais determinísticas e focadas
- 0.7: Balance entre criatividade e consistência (default)
- 1.0+: Respostas mais criativas e diversas

**`Default`**

```ts
0.7
```

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:84](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/adapter/providerAdapter.interface.ts#L84)

___

### tools

• `Optional` **tools**: \{ `description`: `string` ; `name`: `string` ; `parameters`: `any`  }[]

Array de ferramentas disponíveis para o modelo.
As tools são passadas via prompt (não function calling nativo).

**`Example`**

```typescript
tools: [
  {
    name: 'search',
    description: 'Busca informações na web',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' }
      }
    }
  }
]
```

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:148](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/adapter/providerAdapter.interface.ts#L148)

___

### topP

• `Optional` **topP**: `number`

Nucleus sampling parameter (0.0 - 1.0).
Alternativa ao temperature para controle de diversidade.

**`Default`**

```ts
1.0
```

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:126](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/adapter/providerAdapter.interface.ts#L126)
