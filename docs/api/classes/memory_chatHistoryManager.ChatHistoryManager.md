# Class: ChatHistoryManager

[memory/chatHistoryManager](../modules/memory_chatHistoryManager.md).ChatHistoryManager

Gerenciador de Histórico de Chat (Memória Processual).
Responsável por armazenar o histórico de mensagens e aplicar o truncamento
baseado em tokens antes de enviar ao LLM, garantindo que o contexto caiba na janela.

## Implements

- [`IChatHistoryManager`](../interfaces/memory_memory_interface.IChatHistoryManager.md)

## Table of contents

### Constructors

- [constructor](memory_chatHistoryManager.ChatHistoryManager.md#constructor)

### Properties

- [history](memory_chatHistoryManager.ChatHistoryManager.md#history)
- [maxContextTokens](memory_chatHistoryManager.ChatHistoryManager.md#maxcontexttokens)
- [tokenizer](memory_chatHistoryManager.ChatHistoryManager.md#tokenizer)

### Methods

- [addMessage](memory_chatHistoryManager.ChatHistoryManager.md#addmessage)
- [addSystemPrompt](memory_chatHistoryManager.ChatHistoryManager.md#addsystemprompt)
- [clearHistory](memory_chatHistoryManager.ChatHistoryManager.md#clearhistory)
- [getRemainingBudget](memory_chatHistoryManager.ChatHistoryManager.md#getremainingbudget)
- [getTrimmedHistory](memory_chatHistoryManager.ChatHistoryManager.md#gettrimmedhistory)

## Constructors

### constructor

• **new ChatHistoryManager**(`config`): [`ChatHistoryManager`](memory_chatHistoryManager.ChatHistoryManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ChatHistoryConfig`](../interfaces/memory_memory_interface.ChatHistoryConfig.md) |

#### Returns

[`ChatHistoryManager`](memory_chatHistoryManager.ChatHistoryManager.md)

#### Defined in

memory/chatHistoryManager.ts:24

## Properties

### history

• `Private` **history**: [`Message`](../interfaces/memory_memory_interface.Message.md)[] = `[]`

#### Defined in

memory/chatHistoryManager.ts:12

___

### maxContextTokens

• `Private` **maxContextTokens**: `number`

#### Defined in

memory/chatHistoryManager.ts:15

___

### tokenizer

• `Private` **tokenizer**: [`ITokenizerService`](../interfaces/memory_memory_interface.ITokenizerService.md)

#### Defined in

memory/chatHistoryManager.ts:18

## Methods

### addMessage

▸ **addMessage**(`message`): `void`

Adiciona uma mensagem ao histórico.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](../interfaces/memory_memory_interface.Message.md) | A mensagem a ser adicionada. |

#### Returns

`void`

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[addMessage](../interfaces/memory_memory_interface.IChatHistoryManager.md#addmessage)

#### Defined in

memory/chatHistoryManager.ts:54

___

### addSystemPrompt

▸ **addSystemPrompt**(`prompt`): `void`

Adiciona o System Prompt. Deve ser a primeira mensagem.
Usa um Guard Clause/Early Return para remover o 'else'.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | `string` | O texto do System Prompt. |

#### Returns

`void`

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[addSystemPrompt](../interfaces/memory_memory_interface.IChatHistoryManager.md#addsystemprompt)

#### Defined in

memory/chatHistoryManager.ts:34

___

### clearHistory

▸ **clearHistory**(): `void`

Limpa todo o histórico de mensagens, preservando apenas o System Prompt, se existir.

#### Returns

`void`

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[clearHistory](../interfaces/memory_memory_interface.IChatHistoryManager.md#clearhistory)

#### Defined in

memory/chatHistoryManager.ts:61

___

### getRemainingBudget

▸ **getRemainingBudget**(): `number`

Calcula o orçamento de tokens restante considerando o histórico atual.

#### Returns

`number`

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[getRemainingBudget](../interfaces/memory_memory_interface.IChatHistoryManager.md#getremainingbudget)

#### Defined in

memory/chatHistoryManager.ts:117

___

### getTrimmedHistory

▸ **getTrimmedHistory**(): [`Message`](../interfaces/memory_memory_interface.Message.md)[]

Retorna o histórico de mensagens, aplicando a lógica de truncamento baseada em tokens.
Regra de Preservação: System Prompt (primeira) e a última mensagem (user input atual) são protegidos.

#### Returns

[`Message`](../interfaces/memory_memory_interface.Message.md)[]

O array de mensagens truncado.

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[getTrimmedHistory](../interfaces/memory_memory_interface.IChatHistoryManager.md#gettrimmedhistory)

#### Defined in

memory/chatHistoryManager.ts:81
