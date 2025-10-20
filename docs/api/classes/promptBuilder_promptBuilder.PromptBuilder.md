# Class: PromptBuilder

[promptBuilder/promptBuilder](../modules/promptBuilder_promptBuilder.md).PromptBuilder

Utilitário para registrar modos de prompt e construir o System Prompt final.

- Registre modos via `addPromptMode(mode, builder)`
- Construa prompts via `buildSystemPrompt(config)`

## Table of contents

### Constructors

- [constructor](promptBuilder_promptBuilder.PromptBuilder.md#constructor)

### Properties

- [promptModes](promptBuilder_promptBuilder.PromptBuilder.md#promptmodes)

### Methods

- [addPromptMode](promptBuilder_promptBuilder.PromptBuilder.md#addpromptmode)
- [buildSystemPrompt](promptBuilder_promptBuilder.PromptBuilder.md#buildsystemprompt)
- [buildToolsPrompt](promptBuilder_promptBuilder.PromptBuilder.md#buildtoolsprompt)

## Constructors

### constructor

• **new PromptBuilder**(): [`PromptBuilder`](promptBuilder_promptBuilder.PromptBuilder.md)

#### Returns

[`PromptBuilder`](promptBuilder_promptBuilder.PromptBuilder.md)

## Properties

### promptModes

▪ `Static` `Private` **promptModes**: `Map`\<[`PromptMode`](../modules/promptBuilder_promptBuilder_interface.md#promptmode), (`config`: [`PromptBuilderConfig`](../interfaces/promptBuilder_promptBuilder_interface.PromptBuilderConfig.md)) => `string`\>

#### Defined in

promptBuilder/promptBuilder.ts:18

## Methods

### addPromptMode

▸ **addPromptMode**(`mode`, `builder`): `void`

Registra um modo de prompt.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | [`PromptMode`](../modules/promptBuilder_promptBuilder_interface.md#promptmode) | Nome do modo (ex.: 'react') |
| `builder` | (`config`: [`PromptBuilderConfig`](../interfaces/promptBuilder_promptBuilder_interface.PromptBuilderConfig.md)) => `string` | Função que devolve o texto do prompt específico do modo |

#### Returns

`void`

#### Defined in

promptBuilder/promptBuilder.ts:25

___

### buildSystemPrompt

▸ **buildSystemPrompt**(`config`): `string`

Constrói o System Prompt a partir do modo e informações do agente.
Lança erro caso o modo não esteja registrado.

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`PromptBuilderConfig`](../interfaces/promptBuilder_promptBuilder_interface.PromptBuilderConfig.md) |

#### Returns

`string`

#### Defined in

promptBuilder/promptBuilder.ts:36

___

### buildToolsPrompt

▸ **buildToolsPrompt**(`tools?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tools?` | [`ToolSchema`](../interfaces/promptBuilder_promptBuilder_interface.ToolSchema.md)[] |

#### Returns

`string`

#### Defined in

promptBuilder/promptBuilder.ts:72
