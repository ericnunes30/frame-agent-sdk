# Interface: AgentLLMConfig

Configuração para integração com modelos de linguagem.

Define todos os parâmetros necessários para conectar e configurar
um modelo de linguagem específico, incluindo credenciais, endpoint
e parâmetros padrão de geração.

## Campos Obrigatórios

- **model**: Nome do modelo a ser usado
- **apiKey**: Chave de autenticação do provedor

## Campos Opcionais

- **baseUrl**: URL customizada para APIs compatíveis
- **defaults**: Parâmetros padrão de geração

**`Example`**

```typescript
// Configuração OpenAI
const openaiConfig: AgentLLMConfig = {
  model: 'gpt-4',
  apiKey: 'sk-...',
  defaults: {
    temperature: 0.7,
    maxTokens: 1000
  }
};

// Configuração com endpoint customizado
const customConfig: AgentLLMConfig = {
  model: 'claude-3-sonnet',
  apiKey: 'sk-ant-...',
  baseUrl: 'https://api.anthropic.com',
  defaults: {
    temperature: 0.5,
    topP: 0.9,
    maxTokens: 2000
  }
};
```

## Table of contents

### Properties

- [apiKey](AgentLLMConfig.md#apikey)
- [baseUrl](AgentLLMConfig.md#baseurl)
- [defaults](AgentLLMConfig.md#defaults)
- [model](AgentLLMConfig.md#model)

## Properties

### apiKey

• **apiKey**: `string`

Chave de API para autenticação no provedor.

Token de acesso necessário para fazer requisições ao
modelo de linguagem. Deve ser mantido seguro e nunca
exposto em código cliente.

**`Example`**

```typescript
apiKey: 'sk-1234567890abcdef...'  // OpenAI
apiKey: 'sk-ant-1234567890...'    // Anthropic
```

#### Defined in

[src/agent/interfaces/agentLLM.interface.ts:163](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/agentLLM.interface.ts#L163)

___

### baseUrl

• `Optional` **baseUrl**: `string`

URL base para o endpoint da API.

Permite usar APIs customizadas ou provedores compatíveis.
Se não fornecida, usa a URL padrão do provedor.

**`Example`**

```typescript
baseUrl: 'https://api.openai.com/v1'           // OpenAI oficial
baseUrl: 'https://api.anthropic.com'           // Anthropic
baseUrl: 'http://localhost:8000/v1'            // Local/self-hosted
baseUrl: 'https://api.cohere.ai'               // Cohere
```

#### Defined in

[src/agent/interfaces/agentLLM.interface.ts:179](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/agentLLM.interface.ts#L179)

___

### defaults

• `Optional` **defaults**: `ProviderDefaults`

Parâmetros padrão de geração do modelo.

Configurações que serão aplicadas por padrão em todas
as chamadas ao modelo, a menos que explicitamente
sobrescritas na requisição.

**`Example`**

```typescript
defaults: {
  temperature: 0.7,    // Criatividade padrão
  topP: 0.9,          // Diversidade padrão
  maxTokens: 1000     // Limite padrão
}
```

**`See`**

ProviderDefaults Para estrutura dos parâmetros padrão

#### Defined in

[src/agent/interfaces/agentLLM.interface.ts:199](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/agentLLM.interface.ts#L199)

___

### model

• **model**: `string`

Nome do modelo de linguagem a ser utilizado.

Identificador específico do modelo conforme suportado
pelo provedor (ex: 'gpt-4', 'claude-3-sonnet', 'llama-2').

**`Example`**

```typescript
model: 'gpt-4'              // OpenAI GPT-4
model: 'gpt-3.5-turbo'      // OpenAI GPT-3.5
model: 'claude-3-opus'      // Anthropic Claude 3 Opus
model: 'claude-3-sonnet'    // Anthropic Claude 3 Sonnet
```

#### Defined in

[src/agent/interfaces/agentLLM.interface.ts:148](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/agentLLM.interface.ts#L148)
