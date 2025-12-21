# Class: AgentLLM

[agent/llm/agentLLM](../modules/agent_llm_agentLLM.md).AgentLLM

Cliente LLM especializado para agentes de IA.

Esta classe fornece uma interface simplificada e especializada para
agentes de IA interagirem com modelos de linguagem, integrando
seamlessly com ProviderAdapter e PromptBuilder.

## Características Principais

- **Configuração Fixa**: Mantém modelo e API key fixos para consistência
- **Geração Automática de Prompts**: Integração com PromptBuilder para system prompts
- **Parâmetros Flexíveis**: Suporte a overrides por chamada
- **Integração Completa**: Funciona com todos os provedores suportados
- **Metadados Ricos**: Retorna informações detalhadas da execução

## Fluxo de Operação

1. **Configuração**: Define modelo, API key e parâmetros padrão
2. **Construção de Prompt**: Usa PromptBuilder para gerar system prompt
3. **Execução**: Chama ProviderAdapter com configuração completa
4. **Retorno**: Fornece conteúdo e metadados da resposta

## Integração com Módulos

- **ProviderAdapter**: Para comunicação com provedores LLM
- **PromptBuilder**: Para geração automática de system prompts
- **Memory**: Para gerenciamento de mensagens e contexto
- **Tools**: Para suporte a ferramentas quando configurado

**`Example`**

```typescript
// Configuração básica
const agentLLM = new AgentLLM({
  model: 'openai-gpt-4',
  apiKey: 'sk-...',
  defaults: { temperature: 0.7, maxTokens: 1000 }
});

// Execução com modo chat
const result1 = await agentLLM.invoke({
  messages: [{ role: 'user', content: 'Olá!' }],
  mode: 'chat',
  agentInfo: {
    name: 'Assistant',
    role: 'Helpful assistant',
    backstory: 'Friendly and knowledgeable'
  }
});

// Execução com ferramentas (modo react)
const result2 = await agentLLM.invoke({
  messages: [{ role: 'user', content: 'Calcule 2+2' }],
  mode: 'react',
  agentInfo: {
    name: 'Calculator Assistant',
    role: 'Math helper',
    backstory: 'Expert in calculations'
  },
  tools: [calculatorToolSchema]
});

console.log(result1.content);
console.log(result2.metadata);
```

**`See`**

 - [AgentLLMConfig](../interfaces/agent_interfaces_agentLLM_interface.AgentLLMConfig.md) Para configuração da classe
 - [ProviderDefaults](../interfaces/agent_interfaces_agentLLM_interface.ProviderDefaults.md) Para parâmetros padrão
 - [PromptBuilder](promptBuilder_promptBuilder.PromptBuilder.md) Para geração de prompts
 - [ProviderAdapter](providers_adapter_providerAdapter.ProviderAdapter.md) Para comunicação com provedores

## Table of contents

### Constructors

- [constructor](agent_llm_agentLLM.AgentLLM.md#constructor)

### Properties

- [apiKey](agent_llm_agentLLM.AgentLLM.md#apikey)
- [baseUrl](agent_llm_agentLLM.AgentLLM.md#baseurl)
- [defaults](agent_llm_agentLLM.AgentLLM.md#defaults)
- [model](agent_llm_agentLLM.AgentLLM.md#model)
- [provider](agent_llm_agentLLM.AgentLLM.md#provider)

### Methods

- [invoke](agent_llm_agentLLM.AgentLLM.md#invoke)
- [fromConfig](agent_llm_agentLLM.AgentLLM.md#fromconfig)

## Constructors

### constructor

• **new AgentLLM**(`params`): [`AgentLLM`](agent_llm_agentLLM.AgentLLM.md)

Cria uma instância de AgentLLM com parâmetros individuais.

Construtor que permite especificar cada parâmetro separadamente,
oferecendo máxima flexibilidade na configuração.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parâmetros de configuração. |
| `params.apiKey` | `string` | - |
| `params.baseUrl?` | `string` | - |
| `params.defaults?` | [`ProviderDefaults`](../interfaces/agent_interfaces_agentLLM_interface.ProviderDefaults.md) | - |
| `params.model` | `string` | - |
| `params.provider?` | `string` | - |

#### Returns

[`AgentLLM`](agent_llm_agentLLM.AgentLLM.md)

**`Example`**

```typescript
// Configuração simples
const agentLLM1 = new AgentLLM({
  model: 'openai-gpt-3.5-turbo',
  apiKey: 'sk-...'
});

// Configuração com parâmetros padrão
const agentLLM2 = new AgentLLM({
  model: 'anthropic-claude-3-sonnet',
  apiKey: 'sk-ant-...',
  defaults: {
    temperature: 0.5,
    topP: 0.9,
    maxTokens: 2000
  },
  baseUrl: 'https://api.anthropic.com'
});
```

**`See`**

[ProviderDefaults](../interfaces/agent_interfaces_agentLLM_interface.ProviderDefaults.md) Para parâmetros padrão

#### Defined in

[src/agent/llm/agentLLM.ts:165](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/llm/agentLLM.ts#L165)

## Properties

### apiKey

• `Private` `Readonly` **apiKey**: `string`

Chave de API do provedor

#### Defined in

[src/agent/llm/agentLLM.ts:88](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/llm/agentLLM.ts#L88)

___

### baseUrl

• `Private` `Optional` `Readonly` **baseUrl**: `string`

URL base customizada (opcional)

#### Defined in

[src/agent/llm/agentLLM.ts:92](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/llm/agentLLM.ts#L92)

___

### defaults

• `Private` `Readonly` **defaults**: [`ProviderDefaults`](../interfaces/agent_interfaces_agentLLM_interface.ProviderDefaults.md)

Parâmetros padrão de geração

#### Defined in

[src/agent/llm/agentLLM.ts:90](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/llm/agentLLM.ts#L90)

___

### model

• `Private` `Readonly` **model**: `string`

Modelo de linguagem configurado

#### Defined in

[src/agent/llm/agentLLM.ts:86](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/llm/agentLLM.ts#L86)

___

### provider

• `Private` `Optional` `Readonly` **provider**: `string`

Provedor explícito (opcional)

#### Defined in

[src/agent/llm/agentLLM.ts:94](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/llm/agentLLM.ts#L94)

## Methods

### invoke

▸ **invoke**(`args`): `Promise`\<\{ `content`: `string` ; `metadata?`: `Record`\<`string`, `unknown`\>  }\>

Invoca o modelo de linguagem com parâmetros flexíveis.

Método principal que executa a interação com o LLM. Suporta
tanto system prompts customizados quanto geração automática
via PromptBuilder usando mode e agentInfo.

## Estratégias de Prompt

- **systemPrompt direto**: Use systemPrompt para controle total
- **Geração automática**: Use mode + agentInfo para prompts gerados
- **PromptBuilder**: Integração automática com PromptBuilder

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | Parâmetros de invocação flexíveis. |
| `args.additionalInstructions?` | `string` | Instruções adicionais para o agente |
| `args.agentInfo?` | [`AgentInfo`](../interfaces/promptBuilder_promptBuilder_interface.AgentInfo.md) | Informações do agente para geração automática de prompt |
| `args.maxTokens?` | `number` | MaxTokens específico para esta chamada |
| `args.messages` | [`Message`](../interfaces/memory_memory_interface.Message.md)[] | Mensagens da conversa |
| `args.mode?` | `string` | Modo de prompt (chat, react, etc.) |
| `args.promptConfig?` | [`PromptBuilderConfig`](../interfaces/promptBuilder_promptBuilder_interface.PromptBuilderConfig.md) | Configuração customizada do PromptBuilder |
| `args.stream?` | `boolean` | Habilitar streaming de resposta |
| `args.systemPrompt?` | `string` | System prompt customizado (sobrescreve geração automática) |
| `args.taskList?` | `Object` | Lista de tarefas para incluir no prompt |
| `args.taskList.items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] | - |
| `args.telemetry?` | [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md) | - |
| `args.temperature?` | `number` | Temperatura específica para esta chamada |
| `args.tools?` | [`ToolSchema`](../modules/promptBuilder_promptBuilder_interface.md#toolschema)[] | Ferramentas disponíveis para o agente |
| `args.topP?` | `number` | TopP específico para esta chamada |
| `args.trace?` | [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md) | - |
| `args.traceContext?` | [`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md) | - |

#### Returns

`Promise`\<\{ `content`: `string` ; `metadata?`: `Record`\<`string`, `unknown`\>  }\>

Promise com conteúdo e metadados da resposta.

**`Example`**

```typescript
// Com system prompt customizado
const result1 = await agentLLM.invoke({
  messages: [{ role: 'user', content: 'Hello' }],
  systemPrompt: 'You are a helpful assistant.',
  temperature: 0.7
});

// Com geração automática de prompt
const result2 = await agentLLM.invoke({
  messages: [{ role: 'user', content: 'Help me with math' }],
  mode: 'chat',
  agentInfo: {
    name: 'Math Tutor',
    role: 'Mathematics teacher',
    backstory: 'Expert in algebra and calculus'
  },
  tools: [calculatorTool]
});

// Com parâmetros específicos
const result3 = await agentLLM.invoke({
  messages: messages,
  mode: 'react',
  agentInfo: agentInfo,
  temperature: 0.3,  // Override do padrão
  maxTokens: 2000,   // Override do padrão
  stream: true       // Habilitar streaming
});
```

#### Defined in

[src/agent/llm/agentLLM.ts:222](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/llm/agentLLM.ts#L222)

___

### fromConfig

▸ **fromConfig**(`config`): [`AgentLLM`](agent_llm_agentLLM.AgentLLM.md)

Cria uma instância de AgentLLM a partir de uma configuração estruturada.

Método factory que facilita a criação de instâncias usando
a configuração completa AgentLLMConfig.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`AgentLLMConfig`](../interfaces/agent_interfaces_agentLLM_interface.AgentLLMConfig.md) | Configuração completa do AgentLLM. Deve incluir model e apiKey obrigatoriamente. |

#### Returns

[`AgentLLM`](agent_llm_agentLLM.AgentLLM.md)

Nova instância de AgentLLM configurada.

**`Example`**

```typescript
const config: AgentLLMConfig = {
  model: 'openai-gpt-4',
  apiKey: 'sk-1234567890',
  defaults: {
    temperature: 0.7,
    maxTokens: 1000
  },
  baseUrl: 'https://api.openai.com/v1'
};

const agentLLM = AgentLLM.fromConfig(config);
```

**`See`**

[AgentLLMConfig](../interfaces/agent_interfaces_agentLLM_interface.AgentLLMConfig.md) Para formato da configuração

#### Defined in

[src/agent/llm/agentLLM.ts:124](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/agent/llm/agentLLM.ts#L124)
