# Class: ProviderAdapter

Adaptador genérico unificado para provedores de LLM.

Esta classe fornece uma interface consistente para interagir com diferentes
provedores de modelos de linguagem, abstraindo as diferenças entre APIs
e permitindo troca fácil entre provedores.

## Funcionalidades Principais

- **Interface Unificada**: API consistente independente do provedor
- **Auto-detecção**: Detecta automaticamente o provedor baseado no modelo
- **Fallback Inteligente**: Usa openaiCompatible para modelos desconhecidos com baseUrl
- **Logging Detalhado**: Log completo do prompt para debugging
- **Configuração Flexível**: Suporte a todos os parâmetros via ProviderConfig

## Auto-detecção de Provedores

O ProviderAdapter infere o provedor baseado no prefixo do modelo:
- `gpt-4` → OpenAI
`claude-3-sonnet` → OpenAI Compatible (se baseUrl fornecida)
- `meta-llama/llama-3.1-70b` → OpenAI Compatible (se baseUrl fornecida)

**`Example`**

```typescript
// Uso básico
const config: ProviderConfig = {
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Olá!' }],
  apiKey: 'sua-api-key'
};

const response = await ProviderAdapter.chatCompletion(config);
console.log(response.content);

// Com provedor compatível
const compatibleConfig: ProviderConfig = {
  model: 'claude-3-sonnet',
  messages: [...],
  apiKey: 'sua-api-key',
  baseUrl: 'https://api.anthropic.com'
};

const response2 = await ProviderAdapter.chatCompletion(compatibleConfig);
```

**`See`**

 - [ProviderConfig](../interfaces/ProviderConfig.md) Para configuração completa
 - ProviderRegistry Para registro de provedores

## Table of contents

### Constructors

- [constructor](ProviderAdapter.md#constructor)

### Methods

- [\_logPromptDetails](ProviderAdapter.md#_logpromptdetails)
- [chatCompletion](ProviderAdapter.md#chatcompletion)
- [hasProvider](ProviderAdapter.md#hasprovider)

## Constructors

### constructor

• **new ProviderAdapter**(): [`ProviderAdapter`](ProviderAdapter.md)

#### Returns

[`ProviderAdapter`](ProviderAdapter.md)

## Methods

### \_logPromptDetails

▸ **_logPromptDetails**(`providerName`, `config`): `void`

Log detalhado das informações do prompt para debugging.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerName` | `string` | Nome do provedor sendo usado |
| `config` | [`ProviderConfig`](../interfaces/ProviderConfig.md) | Configuração completa |

#### Returns

`void`

#### Defined in

[src/providers/adapter/providerAdapter.ts:176](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.ts#L176)

___

### chatCompletion

▸ **chatCompletion**(`config`): `Promise`\<`any`\>

Executa uma chamada de chat completion usando o provedor apropriado.

Este método é o ponto de entrada principal do ProviderAdapter. Ele:
1. Infere o provedor baseado no modelo
2. Aplica defaults para parâmetros não especificados
3. Implementa fallback para provedores compatíveis
4. Loga informações detalhadas para debugging
5. Chama o provedor apropriado com configuração unificada

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`ProviderConfig`](../interfaces/ProviderConfig.md) | Configuração completa do provedor. Deve incluir model, messages, apiKey e pode incluir parâmetros opcionais. |

#### Returns

`Promise`\<`any`\>

Resposta do provedor no formato unificado.

**`Throws`**

Se o provedor não estiver registrado

**`Throws`**

Se o provedor não implementar chatCompletion

**`Throws`**

Se baseUrl for necessária mas não fornecida

**`Example`**

```typescript
// Configuração básica
const response = await ProviderAdapter.chatCompletion({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Explique IA' }],
  apiKey: 'sk-...',
  temperature: 0.7,
  maxTokens: 1000
});

// Com streaming
const streamingConfig = {
  model: 'gpt-4',
  messages: [...],
  apiKey: 'sk-...',
  stream: true
};

const streamResponse = await ProviderAdapter.chatCompletion(streamingConfig);
for await (const chunk of streamResponse) {
  process.stdout.write(chunk.content);
}
```

**`Remarks`**

- O nome do provedor é extraído do prefixo do modelo (antes do primeiro '-')
- Parâmetros não especificados usam defaults inteligentes
- Modelos desconhecidos com baseUrl são tratados como openaiCompatible
- Log detalhado é emitido para debugging (pode ser desabilitado em produção)

**`See`**

[ProviderConfig](../interfaces/ProviderConfig.md) Para formato da configuração

#### Defined in

[src/providers/adapter/providerAdapter.ts:105](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.ts#L105)

___

### hasProvider

▸ **hasProvider**(`providerName`): `boolean`

Verifica se um provedor está registrado e disponível.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerName` | `string` | Nome do provedor a ser verificado. |

#### Returns

`boolean`

true se o provedor estiver registrado, false caso contrário.

**`Example`**

```typescript
if (ProviderAdapter.hasProvider('openai')) {
  console.log('OpenAI está disponível');
}

if (ProviderAdapter.hasProvider('anthropic')) {
  console.log('Anthropic está disponível');
} else {
  console.log('Anthropic não está registrado');
}
```

#### Defined in

[src/providers/adapter/providerAdapter.ts:160](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/adapter/providerAdapter.ts#L160)
