# Class: ToolExecutor

[tools/core/toolExecutor](../modules/tools_core_toolExecutor.md).ToolExecutor

ResponsÃ¡vel pelo fluxo de execuÃ§Ã£o da ferramenta. 
Recebe a aÃ§Ã£o tipada (IToolCall) e chama o mÃ©todo execute da ferramenta com seguranÃ§a.

## Table of contents

### Constructors

- [constructor](tools_core_toolExecutor.ToolExecutor.md#constructor)

### Methods

- [execute](tools_core_toolExecutor.ToolExecutor.md#execute)

## Constructors

### constructor

• **new ToolExecutor**(): [`ToolExecutor`](tools_core_toolExecutor.ToolExecutor.md)

#### Returns

[`ToolExecutor`](tools_core_toolExecutor.ToolExecutor.md)

## Methods

### execute

▸ **execute**(`toolCall`): `Promise`\<`unknown`\>

Executa a Tool especificada na chamada de aÃ§Ã£o.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `toolCall` | [`IToolCall`](../interfaces/tools_core_interfaces.IToolCall.md) | A chamada de ferramenta, jÃ¡ validada e tipada pelo SAP Parser. |

#### Returns

`Promise`\<`unknown`\>

O resultado da execuÃ§Ã£o (a ObservaÃ§Ã£o do Agente).

#### Defined in

tools/core/toolExecutor.ts:15
