# Interface: IChatHistoryManager

[memory/memory.interface](../modules/memory_memory_interface.md).IChatHistoryManager

Contrato para o Gerenciador de Histórico de Chat, responsável pela memória processual.

## Implemented by

- [`ChatHistoryManager`](../classes/memory_chatHistoryManager.ChatHistoryManager.md)

## Table of contents

### Methods

- [addMessage](memory_memory_interface.IChatHistoryManager.md#addmessage)
- [addSystemPrompt](memory_memory_interface.IChatHistoryManager.md#addsystemprompt)
- [clearHistory](memory_memory_interface.IChatHistoryManager.md#clearhistory)
- [getRemainingBudget](memory_memory_interface.IChatHistoryManager.md#getremainingbudget)
- [getTrimmedHistory](memory_memory_interface.IChatHistoryManager.md#gettrimmedhistory)

## Methods

### addMessage

▸ **addMessage**(`message`): `void`

Adiciona uma mensagem ao histórico de chat.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](memory_memory_interface.Message.md) | A mensagem a ser adicionada. |

#### Returns

`void`

#### Defined in

memory/memory.interface.ts:35

___

### addSystemPrompt

▸ **addSystemPrompt**(`prompt`): `void`

Adiciona uma mensagem de prompt do sistema (System Prompt), que é imunizada contra truncamento.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | `string` | O texto do System Prompt. |

#### Returns

`void`

#### Defined in

memory/memory.interface.ts:41

___

### clearHistory

▸ **clearHistory**(): `void`

Limpa todo o histórico de mensagens.

#### Returns

`void`

#### Defined in

memory/memory.interface.ts:58

___

### getRemainingBudget

▸ **getRemainingBudget**(): `number`

Retorna o orçamento de tokens restante com base no histórico atual.

#### Returns

`number`

#### Defined in

memory/memory.interface.ts:53

___

### getTrimmedHistory

▸ **getTrimmedHistory**(): [`Message`](memory_memory_interface.Message.md)[]

Retorna o histórico de mensagens, aplicando truncamento baseado em tokens.
Garante que não exceda 'maxContextTokens' e preserva o System Prompt e a última mensagem do usuário.

#### Returns

[`Message`](memory_memory_interface.Message.md)[]

O array de mensagens pronto para ser enviado ao LLM.

#### Defined in

memory/memory.interface.ts:48
