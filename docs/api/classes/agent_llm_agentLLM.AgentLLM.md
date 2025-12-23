# Class: AgentLLM

[agent/llm/agentLLM](../modules/agent_llm_agentLLM.md).AgentLLM

Cliente LLM especializado para agentes de IA.

Esta classe fornece uma interface simplificada e especializada para
agentes de IA interagirem com modelos de linguagem, integrando
seamlessly com ProviderAdapter e PromptBuilder.

## CaracterÃ­sticas Principais

- **ConfiguraÃ§Ã£o Fixa**: MantÃ©m modelo e API key fixos para consistÃªncia
- **GeraÃ§Ã£o AutomÃ¡tica de Prompts**: IntegraÃ§Ã£o com PromptBuilder para system prompts
- **ParÃ¢metros FlexÃ­veis**: Suporte a overrides por chamada
- **IntegraÃ§Ã£o Completa**: Funciona com todos os provedores suportados
- **Metadados Ricos**: Retorna informaÃ§Ãµes detalhadas da execuÃ§Ã£o

## Fluxo de OperaÃ§Ã£o

1. **ConfiguraÃ§Ã£o**: Define modelo, API key e parÃ¢metros padrÃ£o
2. **ConstruÃ§Ã£o de Prompt**: Usa PromptBuilder para gerar system prompt
3. **ExecuÃ§Ã£o**: Chama ProviderAdapter com configuraÃ§Ã£o completa
4. **Retorno**: Fornece conteÃºdo e metadados da resposta

## IntegraÃ§Ã£o com MÃ³dulos

- **ProviderAdapter**: Para comunicaÃ§Ã£o com provedores LLM
- **PromptBuilder**: Para geraÃ§Ã£o automÃ¡tica de system prompts
- **Memory**: Para gerenciamento de mensagens e contexto
- **Tools**: Para suporte a ferramentas quando configurado

**`Example`**

```typescript
// ConfiguraÃ§Ã£o bÃ¡sica
const agentLLM = new AgentLLM({
  model: 'openai-gpt-4',
  apiKey: 'sk-...',
  defaults: { temperature: 0.7, maxTokens: 1000 }
});

// ExecuÃ§Ã£o com modo chat
const result1 = await agentLLM.invoke({
  messages: [{ role: 'user', content: 'OlÃ¡!' }],
  mode: 'chat',
  agentInfo: {
    name: 'Assistant',
    role: 'Helpful assistant',
    backstory: 'Friendly and knowledgeable'
  }
});

// ExecuÃ§Ã£o com ferramentas (modo react)
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

 - [AgentLLMConfig](../interfaces/agent_interfaces_agentLLM_interface.AgentLLMConfig.md) Para configuraÃ§Ã£o da classe
 - [ProviderDefaults](../interfaces/agent_interfaces_agentLLM_interface.ProviderDefaults.md) Para parÃ¢metros padrÃ£o
 - [PromptBuilder](promptBuilder_promptBuilder.PromptBuilder.md) Para geraÃ§Ã£o de prompts
 - [ProviderAdapter](providers_adapter_providerAdapter.ProviderAdapter.md) Para comunicaÃ§Ã£o com provedores

## Table of contents

### Constructors

- [constructor](agent_llm_agentLLM.AgentLLM.md#constructor)

### Properties

- [apiKey](agent_llm_agentLLM.AgentLLM.md#apikey)
- [baseUrl](agent_llm_agentLLM.AgentLLM.md#baseurl)
- [capabilities](agent_llm_agentLLM.AgentLLM.md#capabilities)
- [defaults](agent_llm_agentLLM.AgentLLM.md#defaults)
- [model](agent_llm_agentLLM.AgentLLM.md#model)
- [provider](agent_llm_agentLLM.AgentLLM.md#provider)

### Methods

- [invoke](agent_llm_agentLLM.AgentLLM.md#invoke)
- [fromConfig](agent_llm_agentLLM.AgentLLM.md#fromconfig)

## Constructors

### constructor

• **new AgentLLM**(`params`): [`AgentLLM`](agent_llm_agentLLM.AgentLLM.md)

Cria uma instÃ¢ncia de AgentLLM com parÃ¢metros individuais.

Construtor que permite especificar cada parÃ¢metro separadamente,
oferecendo mÃ¡xima flexibilidade na configuraÃ§Ã£o.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | ParÃ¢metros de configuraÃ§Ã£o. |
| `params.apiKey` | `string` | - |
| `params.baseUrl?` | `string` | - |
| `params.capabilities?` | `Object` | - |
| `params.capabilities.supportsVision?` | `boolean` | Indica se o modelo suporta conteudo multimodal (imagens) via messages. Default: false (se nao informado). |
| `params.defaults?` | [`ProviderDefaults`](../interfaces/agent_interfaces_agentLLM_interface.ProviderDefaults.md) | - |
| `params.model` | `string` | - |
| `params.provider?` | `string` | - |

#### Returns

[`AgentLLM`](agent_llm_agentLLM.AgentLLM.md)

**`Example`**

```typescript
// ConfiguraÃ§Ã£o simples
const agentLLM1 = new AgentLLM({
  model: 'openai-gpt-3.5-turbo',
  apiKey: 'sk-...'
});

// ConfiguraÃ§Ã£o com parÃ¢metros padrÃ£o
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

[ProviderDefaults](../interfaces/agent_interfaces_agentLLM_interface.ProviderDefaults.md) Para parÃ¢metros padrÃ£o

#### Defined in

[src/agent/llm/agentLLM.ts:168](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/llm/agentLLM.ts#L168)

## Properties

### apiKey

• `Private` `Readonly` **apiKey**: `string`

Chave de API do provedor

#### Defined in

[src/agent/llm/agentLLM.ts:89](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/llm/agentLLM.ts#L89)

___

### baseUrl

• `Private` `Optional` `Readonly` **baseUrl**: `string`

URL base customizada (opcional)

#### Defined in

[src/agent/llm/agentLLM.ts:93](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/llm/agentLLM.ts#L93)

___

### capabilities

• `Private` `Optional` `Readonly` **capabilities**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `supportsVision?` | `boolean` | Indica se o modelo suporta conteudo multimodal (imagens) via messages. Default: false (se nao informado). |

#### Defined in

[src/agent/llm/agentLLM.ts:96](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/llm/agentLLM.ts#L96)

___

### defaults

• `Private` `Readonly` **defaults**: [`ProviderDefaults`](../interfaces/agent_interfaces_agentLLM_interface.ProviderDefaults.md)

ParÃ¢metros padrÃ£o de geraÃ§Ã£o

#### Defined in

[src/agent/llm/agentLLM.ts:91](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/llm/agentLLM.ts#L91)

___

### model

• `Private` `Readonly` **model**: `string`

Modelo de linguagem configurado

#### Defined in

[src/agent/llm/agentLLM.ts:87](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/llm/agentLLM.ts#L87)

___

### provider

• `Private` `Optional` `Readonly` **provider**: `string`

Provedor explÃ­cito (opcional)

#### Defined in

[src/agent/llm/agentLLM.ts:95](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/llm/agentLLM.ts#L95)

## Methods

### invoke

▸ **invoke**(`args`): `Promise`\<\{ `content`: `string` ; `metadata?`: `Record`\<`string`, `unknown`\>  }\>

Invoca o modelo de linguagem com parÃ¢metros flexÃ­veis.

MÃ©todo principal que executa a interaÃ§Ã£o com o LLM. Suporta
tanto system prompts customizados quanto geraÃ§Ã£o automÃ¡tica
via PromptBuilder usando mode e agentInfo.

## EstratÃ©gias de Prompt

- **systemPrompt direto**: Use systemPrompt para controle total
- **GeraÃ§Ã£o automÃ¡tica**: Use mode + agentInfo para prompts gerados
- **PromptBuilder**: IntegraÃ§Ã£o automÃ¡tica com PromptBuilder

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | ParÃ¢metros de invocaÃ§Ã£o flexÃ­veis. |
| `args.additionalInstructions?` | `string` | InstruÃ§Ãµes adicionais para o agente |
| `args.agentInfo?` | [`AgentInfo`](../interfaces/promptBuilder_promptBuilder_interface.AgentInfo.md) | InformaÃ§Ãµes do agente para geraÃ§Ã£o automÃ¡tica de prompt |
| `args.contextHooks?` | [`ContextHooks`](../interfaces/memory_contextHooks_interface.ContextHooks.md) | Hooks de contexto (trim/rewrite/retry) |
| `args.maxTokens?` | `number` | MaxTokens especÃ­fico para esta chamada |
| `args.messages` | [`Message`](../interfaces/memory_memory_interface.Message.md)[] | Mensagens da conversa |
| `args.mode?` | `string` | Modo de prompt (chat, react, etc.) |
| `args.promptConfig?` | [`PromptBuilderConfig`](../interfaces/promptBuilder_promptBuilder_interface.PromptBuilderConfig.md) | ConfiguraÃ§Ã£o customizada do PromptBuilder |
| `args.stream?` | `boolean` | Habilitar streaming de resposta |
| `args.systemPrompt?` | `string` | System prompt customizado (sobrescreve geraÃ§Ã£o automÃ¡tica) |
| `args.taskList?` | `Object` | Lista de tarefas para incluir no prompt |
| `args.taskList.items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] | - |
| `args.telemetry?` | [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md) | - |
| `args.temperature?` | `number` | Temperatura especÃ­fica para esta chamada |
| `args.tools?` | [`ToolSchema`](../modules/promptBuilder_promptBuilder_interface.md#toolschema)[] | Ferramentas disponÃ­veis para o agente |
| `args.topP?` | `number` | TopP especÃ­fico para esta chamada |
| `args.trace?` | [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md) | - |
| `args.traceContext?` | [`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md) | - |

#### Returns

`Promise`\<\{ `content`: `string` ; `metadata?`: `Record`\<`string`, `unknown`\>  }\>

Promise com conteÃºdo e metadados da resposta.

**`Example`**

```typescript
// Com system prompt customizado
const result1 = await agentLLM.invoke({
  messages: [{ role: 'user', content: 'Hello' }],
  systemPrompt: 'You are a helpful assistant.',
  temperature: 0.7
});

// Com geraÃ§Ã£o automÃ¡tica de prompt
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

// Com parÃ¢metros especÃ­ficos
const result3 = await agentLLM.invoke({
  messages: messages,
  mode: 'react',
  agentInfo: agentInfo,
  temperature: 0.3,  // Override do padrÃ£o
  maxTokens: 2000,   // Override do padrÃ£o
  stream: true       // Habilitar streaming
});
```

#### Defined in

[src/agent/llm/agentLLM.ts:233](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/llm/agentLLM.ts#L233)

___

### fromConfig

▸ **fromConfig**(`config`): [`AgentLLM`](agent_llm_agentLLM.AgentLLM.md)

Cria uma instÃ¢ncia de AgentLLM a partir de uma configuraÃ§Ã£o estruturada.

MÃ©todo factory que facilita a criaÃ§Ã£o de instÃ¢ncias usando
a configuraÃ§Ã£o completa AgentLLMConfig.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`AgentLLMConfig`](../interfaces/agent_interfaces_agentLLM_interface.AgentLLMConfig.md) | ConfiguraÃ§Ã£o completa do AgentLLM. Deve incluir model e apiKey obrigatoriamente. |

#### Returns

[`AgentLLM`](agent_llm_agentLLM.AgentLLM.md)

Nova instÃ¢ncia de AgentLLM configurada.

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

[AgentLLMConfig](../interfaces/agent_interfaces_agentLLM_interface.AgentLLMConfig.md) Para formato da configuraÃ§Ã£o

#### Defined in

[src/agent/llm/agentLLM.ts:126](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/agent/llm/agentLLM.ts#L126)
