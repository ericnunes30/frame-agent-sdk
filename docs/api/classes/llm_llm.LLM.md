# Class: LLM

[llm/llm](../modules/llm_llm.md).LLM

Cliente LLM baseado no ProviderAdapter.
Mantém `model` e `apiKey` fixos e aplica opções a cada chamada.

Use `invoke` quando já tiver o systemPrompt pronto, ou `invokeWithMode`
para gerar o systemPrompt via PromptBuilder (ex.: modo 'react').

## Table of contents

### Constructors

- [constructor](llm_llm.LLM.md#constructor)

### Properties

- [apiKey](llm_llm.LLM.md#apikey)
- [defaults](llm_llm.LLM.md#defaults)
- [model](llm_llm.LLM.md#model)

### Methods

- [assertModeRegistered](llm_llm.LLM.md#assertmoderegistered)
- [invoke](llm_llm.LLM.md#invoke)
- [invokeWithMode](llm_llm.LLM.md#invokewithmode)

## Constructors

### constructor

• **new LLM**(`params`): [`LLM`](llm_llm.LLM.md)

Cria uma instância de LLM com modelo/chave fixos.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.apiKey` | `string` | Chave do provedor escolhido |
| `params.defaults?` | `ProviderDefaults` | Valores padrão (temperature/topP/maxTokens) |
| `params.model` | `string` | Modelo completo (ex.: 'openaiCompatible-gpt-4o-mini' ou 'openai-gpt-4o') |

#### Returns

[`LLM`](llm_llm.LLM.md)

#### Defined in

llm/llm.ts:40

## Properties

### apiKey

• `Private` `Readonly` **apiKey**: `string`

#### Defined in

llm/llm.ts:31

___

### defaults

• `Private` `Readonly` **defaults**: `ProviderDefaults`

#### Defined in

llm/llm.ts:32

___

### model

• `Private` `Readonly` **model**: `string`

#### Defined in

llm/llm.ts:30

## Methods

### assertModeRegistered

▸ **assertModeRegistered**(`mode`): `void`

Garante que o modo esteja registrado no PromptBuilder, senão lança erro amigável.

#### Parameters

| Name | Type |
| :------ | :------ |
| `mode` | [`PromptMode`](../modules/promptBuilder_promptBuilder_interface.md#promptmode) |

#### Returns

`void`

#### Defined in

llm/llm.ts:90

___

### invoke

▸ **invoke**(`args`): `Promise`\<\{ `content`: `string` ; `metadata?`: `Record`\<`string`, `unknown`\>  }\>

Invoca o provedor configurado com um conjunto de mensagens.
Se `promptConfig` for fornecido, o systemPrompt é gerado via PromptBuilder;
caso contrário, usa `systemPrompt` passado.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | - |
| `args.maxTokens?` | `number` | - |
| `args.messages` | [`Message`](../interfaces/memory_memory_interface.Message.md)[] | - |
| `args.promptConfig?` | [`PromptBuilderConfig`](../interfaces/promptBuilder_promptBuilder_interface.PromptBuilderConfig.md) | Se fornecido, sobrescreve `systemPrompt` gerando-o via PromptBuilder. |
| `args.stream?` | `boolean` | - |
| `args.systemPrompt?` | `string` | - |
| `args.temperature?` | `number` | - |
| `args.topP?` | `number` | - |

#### Returns

`Promise`\<\{ `content`: `string` ; `metadata?`: `Record`\<`string`, `unknown`\>  }\>

Conteúdo textual e metadados do provedor (quando disponíveis)

#### Defined in

llm/llm.ts:52

___

### invokeWithMode

▸ **invokeWithMode**(`args`, `modeAgent`): `Promise`\<\{ `content`: `string` ; `metadata?`: `Record`\<`string`, `unknown`\>  }\>

Invoca o provedor gerando o systemPrompt internamente a partir do modo do agente.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | Parâmetros de entrada (mensagens, agentInfo, tools, etc.) |
| `args.additionalInstructions?` | `string` | - |
| `args.agentInfo` | [`AgentInfo`](../interfaces/promptBuilder_promptBuilder_interface.AgentInfo.md) | - |
| `args.maxTokens?` | `number` | - |
| `args.messages` | [`Message`](../interfaces/memory_memory_interface.Message.md)[] | - |
| `args.stream?` | `boolean` | - |
| `args.temperature?` | `number` | - |
| `args.tools?` | [`ToolSchema`](../interfaces/promptBuilder_promptBuilder_interface.ToolSchema.md)[] | - |
| `args.topP?` | `number` | - |
| `modeAgent` | [`PromptMode`](../modules/promptBuilder_promptBuilder_interface.md#promptmode) | Modo do agente (ex.: 'react') |

#### Returns

`Promise`\<\{ `content`: `string` ; `metadata?`: `Record`\<`string`, `unknown`\>  }\>

#### Defined in

llm/llm.ts:109
