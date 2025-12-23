# Interface: ContextHooks

[memory/contextHooks.interface](../modules/memory_contextHooks_interface.md).ContextHooks

## Table of contents

### Properties

- [beforeRequest](memory_contextHooks_interface.ContextHooks.md#beforerequest)
- [isRetryableError](memory_contextHooks_interface.ContextHooks.md#isretryableerror)
- [maxRetries](memory_contextHooks_interface.ContextHooks.md#maxretries)
- [onError](memory_contextHooks_interface.ContextHooks.md#onerror)

## Properties

### beforeRequest

• `Optional` **beforeRequest**: (`args`: \{ `attempt`: `number` ; `messages`: [`Message`](memory_memory_interface.Message.md)[] ; `model`: `string` ; `systemPrompt`: `string`  }) => [`ContextBeforeRequestResult`](memory_contextHooks_interface.ContextBeforeRequestResult.md) \| `Promise`\<[`ContextBeforeRequestResult`](memory_contextHooks_interface.ContextBeforeRequestResult.md)\>

Chamado antes de cada request ao provider.
Ãštil para trimming/rewrite/normalizaÃ§Ã£o sem acoplar no orchestrator.

#### Type declaration

▸ (`args`): [`ContextBeforeRequestResult`](memory_contextHooks_interface.ContextBeforeRequestResult.md) \| `Promise`\<[`ContextBeforeRequestResult`](memory_contextHooks_interface.ContextBeforeRequestResult.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.attempt` | `number` |
| `args.messages` | [`Message`](memory_memory_interface.Message.md)[] |
| `args.model` | `string` |
| `args.systemPrompt` | `string` |

##### Returns

[`ContextBeforeRequestResult`](memory_contextHooks_interface.ContextBeforeRequestResult.md) \| `Promise`\<[`ContextBeforeRequestResult`](memory_contextHooks_interface.ContextBeforeRequestResult.md)\>

#### Defined in

[src/memory/contextHooks.interface.ts:30](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/contextHooks.interface.ts#L30)

___

### isRetryableError

• `Optional` **isRetryableError**: (`error`: `Error`) => `boolean`

Determina se o erro Ã© elegÃ­vel para retry (ex.: context overflow).
Se omitido, o SDK aplica um detector default por keywords.

#### Type declaration

▸ (`error`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |

##### Returns

`boolean`

#### Defined in

[src/memory/contextHooks.interface.ts:53](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/contextHooks.interface.ts#L53)

___

### maxRetries

• `Optional` **maxRetries**: `number`

NÃºmero mÃ¡ximo de retentativas adicionais (alÃ©m da primeira).
Default: 0 (sem retry).

#### Defined in

[src/memory/contextHooks.interface.ts:59](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/contextHooks.interface.ts#L59)

___

### onError

• `Optional` **onError**: (`args`: \{ `attempt`: `number` ; `error`: `Error` ; `messages`: [`Message`](memory_memory_interface.Message.md)[] ; `model`: `string` ; `systemPrompt`: `string`  }) => [`ContextOnErrorResult`](memory_contextHooks_interface.ContextOnErrorResult.md) \| `Promise`\<[`ContextOnErrorResult`](memory_contextHooks_interface.ContextOnErrorResult.md)\>

Chamado quando o provider falha. Pode decidir retry e retornar mensagens/systemPrompt ajustados.
ObservaÃ§Ã£o: o SDK nÃ£o implementa compressÃ£o aqui; apenas fornece o hook.

#### Type declaration

▸ (`args`): [`ContextOnErrorResult`](memory_contextHooks_interface.ContextOnErrorResult.md) \| `Promise`\<[`ContextOnErrorResult`](memory_contextHooks_interface.ContextOnErrorResult.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.attempt` | `number` |
| `args.error` | `Error` |
| `args.messages` | [`Message`](memory_memory_interface.Message.md)[] |
| `args.model` | `string` |
| `args.systemPrompt` | `string` |

##### Returns

[`ContextOnErrorResult`](memory_contextHooks_interface.ContextOnErrorResult.md) \| `Promise`\<[`ContextOnErrorResult`](memory_contextHooks_interface.ContextOnErrorResult.md)\>

#### Defined in

[src/memory/contextHooks.interface.ts:41](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/contextHooks.interface.ts#L41)
