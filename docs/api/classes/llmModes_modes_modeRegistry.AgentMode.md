# Class: AgentMode

[llmModes/modes/modeRegistry](../modules/llmModes_modes_modeRegistry.md).AgentMode

Classe utilitária para gerenciar modos de agentes

Esta classe fornece métodos para registrar e gerenciar diferentes modos
de comportamento de agentes no PromptBuilder.

## Table of contents

### Constructors

- [constructor](llmModes_modes_modeRegistry.AgentMode.md#constructor)

### Properties

- [registeredModes](llmModes_modes_modeRegistry.AgentMode.md#registeredmodes)

### Methods

- [registerMode](llmModes_modes_modeRegistry.AgentMode.md#registermode)

## Constructors

### constructor

• **new AgentMode**(): [`AgentMode`](llmModes_modes_modeRegistry.AgentMode.md)

#### Returns

[`AgentMode`](llmModes_modes_modeRegistry.AgentMode.md)

## Properties

### registeredModes

▪ `Static` `Private` **registeredModes**: `Set`\<`string`\>

#### Defined in

[src/llmModes/modes/modeRegistry.ts:17](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/llmModes/modes/modeRegistry.ts#L17)

## Methods

### registerMode

▸ **registerMode**(`modeName`, `modeFunction`): `void`

Registra um novo modo de agente no PromptBuilder

#### Parameters

| Name | Type |
| :------ | :------ |
| `modeName` | `string` |
| `modeFunction` | (`config`: [`PromptBuilderConfig`](../interfaces/promptBuilder_promptBuilder_interface.PromptBuilderConfig.md)) => `string` |

#### Returns

`void`

#### Defined in

[src/llmModes/modes/modeRegistry.ts:22](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/llmModes/modes/modeRegistry.ts#L22)
