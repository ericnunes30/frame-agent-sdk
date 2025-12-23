# Interface: ContextBeforeRequestResult

[memory/contextHooks.interface](../modules/memory_contextHooks_interface.md).ContextBeforeRequestResult

## Hierarchy

- **`ContextBeforeRequestResult`**

  ↳ [`ContextOnErrorResult`](memory_contextHooks_interface.ContextOnErrorResult.md)

## Table of contents

### Properties

- [messages](memory_contextHooks_interface.ContextBeforeRequestResult.md#messages)
- [systemPrompt](memory_contextHooks_interface.ContextBeforeRequestResult.md#systemprompt)

## Properties

### messages

• `Optional` **messages**: [`Message`](memory_memory_interface.Message.md)[]

Mensagens a serem usadas na chamada ao provider.
Se omitido, mantÃ©m as mensagens atuais.

#### Defined in

[src/memory/contextHooks.interface.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/contextHooks.interface.ts#L8)

___

### systemPrompt

• `Optional` **systemPrompt**: `string`

System prompt a ser usado na chamada ao provider.
Se omitido, mantÃ©m o system prompt atual.

#### Defined in

[src/memory/contextHooks.interface.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/contextHooks.interface.ts#L14)
