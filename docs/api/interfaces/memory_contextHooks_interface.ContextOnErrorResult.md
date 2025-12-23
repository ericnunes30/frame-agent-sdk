# Interface: ContextOnErrorResult

[memory/contextHooks.interface](../modules/memory_contextHooks_interface.md).ContextOnErrorResult

## Hierarchy

- [`ContextBeforeRequestResult`](memory_contextHooks_interface.ContextBeforeRequestResult.md)

  ↳ **`ContextOnErrorResult`**

## Table of contents

### Properties

- [messages](memory_contextHooks_interface.ContextOnErrorResult.md#messages)
- [retry](memory_contextHooks_interface.ContextOnErrorResult.md#retry)
- [systemPrompt](memory_contextHooks_interface.ContextOnErrorResult.md#systemprompt)

## Properties

### messages

• `Optional` **messages**: [`Message`](memory_memory_interface.Message.md)[]

Mensagens a serem usadas na chamada ao provider.
Se omitido, mantÃ©m as mensagens atuais.

#### Inherited from

[ContextBeforeRequestResult](memory_contextHooks_interface.ContextBeforeRequestResult.md).[messages](memory_contextHooks_interface.ContextBeforeRequestResult.md#messages)

#### Defined in

[src/memory/contextHooks.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/contextHooks.interface.ts#L8)

___

### retry

• `Optional` **retry**: `boolean`

Se true, o AgentLLM deve tentar novamente a chamada ao provider.
Se false/undefined, o erro Ã© propagado.

#### Defined in

[src/memory/contextHooks.interface.ts:22](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/contextHooks.interface.ts#L22)

___

### systemPrompt

• `Optional` **systemPrompt**: `string`

System prompt a ser usado na chamada ao provider.
Se omitido, mantÃ©m o system prompt atual.

#### Inherited from

[ContextBeforeRequestResult](memory_contextHooks_interface.ContextBeforeRequestResult.md).[systemPrompt](memory_contextHooks_interface.ContextBeforeRequestResult.md#systemprompt)

#### Defined in

[src/memory/contextHooks.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/contextHooks.interface.ts#L14)
