# Interface: ProviderConfig

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

- [apiKey](ProviderConfig.md#apikey)
- [baseUrl](ProviderConfig.md#baseurl)
- [maxTokens](ProviderConfig.md#maxtokens)
- [messages](ProviderConfig.md#messages)
- [model](ProviderConfig.md#model)
- [stream](ProviderConfig.md#stream)
- [systemPrompt](ProviderConfig.md#systemprompt)
- [temperature](ProviderConfig.md#temperature)
- [tools](ProviderConfig.md#tools)
- [topP](ProviderConfig.md#topp)

## Properties

### apiKey

• **apiKey**: `string`

Chave de API do provedor.
Deve ser mantida segura e nunca hardcoded no código.

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:67](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L67)

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

[src/providers/adapter/providerAdapter.interface.ts:103](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L103)

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

[src/providers/adapter/providerAdapter.interface.ts:111](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L111)

___

### messages

• **messages**: \{ `content`: `string` ; `role`: `string`  }[]

Array de mensagens da conversa.
Cada mensagem deve ter role ('system', 'user', 'assistant') e content.

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:58](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L58)

___

### model

• **model**: `string`

Nome do modelo a ser usado.
Formato varia por provedor:
- OpenAI: 'gpt-4', 'gpt-3.5-turbo'
- OpenRouter: 'meta-llama/llama-3.1-70b-instruct'
- Claude: 'claude-3-sonnet-20240229'

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:52](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L52)

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

[src/providers/adapter/providerAdapter.interface.ts:85](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L85)

___

### systemPrompt

• `Optional` **systemPrompt**: `string`

Prompt do sistema que define o comportamento do assistente.
É enviado como primeira mensagem com role 'system'.

#### Defined in

[src/providers/adapter/providerAdapter.interface.ts:91](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L91)

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

[src/providers/adapter/providerAdapter.interface.ts:77](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L77)

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

[src/providers/adapter/providerAdapter.interface.ts:141](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L141)

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

[src/providers/adapter/providerAdapter.interface.ts:119](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.interface.ts#L119)
