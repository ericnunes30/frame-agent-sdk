# Class: AgentModeUtil

Classe utilitária para gerenciar modos de agentes

Esta classe fornece métodos para registrar e gerenciar diferentes modos
de comportamento de agentes no PromptBuilder.

## Table of contents

### Constructors

- [constructor](AgentModeUtil.md#constructor)

### Properties

- [registeredModes](AgentModeUtil.md#registeredmodes)

### Methods

- [registerMode](AgentModeUtil.md#registermode)

## Constructors

### constructor

• **new AgentModeUtil**(): [`AgentModeUtil`](AgentModeUtil.md)

#### Returns

[`AgentModeUtil`](AgentModeUtil.md)

## Properties

### registeredModes

▪ `Static` `Private` **registeredModes**: `Set`\<`string`\>

#### Defined in

[src/llmModes/modes/modeRegistry.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/llmModes/modes/modeRegistry.ts#L16)

## Methods

### registerMode

▸ **registerMode**(`modeName`, `modeFunction`): `void`

Registra um novo modo de agente no PromptBuilder

#### Parameters

| Name | Type |
| :------ | :------ |
| `modeName` | `string` |
| `modeFunction` | (`config`: [`PromptBuilderConfig`](../interfaces/PromptBuilderConfig.md)) => `string` |

#### Returns

`void`

#### Defined in

[src/llmModes/modes/modeRegistry.ts:21](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/llmModes/modes/modeRegistry.ts#L21)
