# Interface: IChatHistoryManager

[memory/memory.interface](../modules/memory_memory_interface.md).IChatHistoryManager

Contrato para o Gerenciador de Histórico de Chat, responsável pela memória processual.

Esta interface define as operações fundamentais para gerenciar o histórico de conversas
em agentes de IA, implementando estratégias inteligentes de truncamento que preservam
sempre o System Prompt e a última mensagem do usuário.

**`Example`**

```typescript
const history = new ChatHistoryManager(config);

// Adicionar System Prompt (sempre primeiro)
history.addSystemPrompt('Você é um assistente especializado em programação.');

// Adicionar mensagens da conversa
history.addMessage({ role: 'user', content: 'Como fazer um loop?' });
history.addMessage({ role: 'assistant', content: 'Use for ou while...' });

// Obter histórico truncado para enviar ao LLM
const messages = history.getTrimmedHistory();

// Verificar tokens restantes
const remaining = history.getRemainingBudget();
```

## Implemented by

- [`ChatHistoryManager`](../classes/memory_chatHistoryManager.ChatHistoryManager.md)

## Table of contents

### Methods

- [addMessage](memory_memory_interface.IChatHistoryManager.md#addmessage)
- [addSystemPrompt](memory_memory_interface.IChatHistoryManager.md#addsystemprompt)
- [clearHistory](memory_memory_interface.IChatHistoryManager.md#clearhistory)
- [deleteMessageRange](memory_memory_interface.IChatHistoryManager.md#deletemessagerange)
- [editMessage](memory_memory_interface.IChatHistoryManager.md#editmessage)
- [exportHistory](memory_memory_interface.IChatHistoryManager.md#exporthistory)
- [getMessageById](memory_memory_interface.IChatHistoryManager.md#getmessagebyid)
- [getRemainingBudget](memory_memory_interface.IChatHistoryManager.md#getremainingbudget)
- [getTrimmedHistory](memory_memory_interface.IChatHistoryManager.md#gettrimmedhistory)
- [importHistory](memory_memory_interface.IChatHistoryManager.md#importhistory)

## Methods

### addMessage

▸ **addMessage**(`message`): `void`

Adiciona uma mensagem ao histórico de chat.

As mensagens são adicionadas ao final do histórico (ordem cronológica).
Esta mensagem pode ser removida durante o truncamento, exceto se for
a última mensagem do usuário.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](memory_memory_interface.Message.md) | A mensagem a ser adicionada ao histórico. Deve ter role válida ('user', 'assistant', 'tool') e content não vazio. |

#### Returns

`void`

**`Throws`**

Se a mensagem for inválida (role ou content ausente)

**`Example`**

```typescript
history.addMessage({
  role: 'user',
  content: 'Explique machine learning'
});
```

#### Defined in

[src/memory/memory.interface.ts:178](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L178)

___

### addSystemPrompt

▸ **addSystemPrompt**(`prompt`): `void`

Adiciona uma mensagem de prompt do sistema (System Prompt), que é imunizada contra truncamento.

O System Prompt é sempre inserido na primeira posição do histórico e nunca
é removido durante o truncamento. Se já existir um System Prompt, ele será
substituído pelo novo.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | `string` | O texto do System Prompt. Deve ser uma string não vazia com as instruções de comportamento do assistente. |

#### Returns

`void`

**`Remarks`**

- Deve ser chamado antes de addMessage() para garantir posição correta
- Pode ser chamado a qualquer momento para atualizar o prompt
- É sempre preservado durante o truncamento

**`Example`**

```typescript
history.addSystemPrompt(`
  Você é um assistente especializado em TypeScript.
  Sempre forneça exemplos práticos e código limpo.
`);
```

#### Defined in

[src/memory/memory.interface.ts:203](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L203)

___

### clearHistory

▸ **clearHistory**(): `void`

Limpa todo o histórico de mensagens, preservando o System Prompt.

Remove todas as mensagens do histórico exceto o System Prompt (se existir).
Útil para iniciar uma nova conversa mantendo as instruções do assistente.

#### Returns

`void`

**`Remarks`**

- O System Prompt é sempre preservado
- Para limpeza completa (incluindo System Prompt), chame addSystemPrompt('') depois
- Esta operação não pode ser desfeita

**`Example`**

```typescript
// Limpar conversa mantendo instruções
history.clearHistory();

// Limpeza completa
history.clearHistory();
history.addSystemPrompt(''); // Remove prompt também
```

#### Defined in

[src/memory/memory.interface.ts:275](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L275)

___

### deleteMessageRange

▸ **deleteMessageRange**(`startId`, `endId`): `void`

Remove um range de mensagens do histórico.

Remove todas as mensagens entre startId e endId (inclusive),
permitindo limpeza seletiva do histórico para compressão
ou remoção de conversas irrelevantes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startId` | `string` | ID da primeira mensagem a ser removida. |
| `endId` | `string` | ID da última mensagem a ser removida. |

#### Returns

`void`

**`Throws`**

Se os IDs não forem encontrados ou forem inválidos

**`Example`**

```typescript
// Remover conversa antiga
history.deleteMessageRange('msg-old-1', 'msg-old-10');

// Remover seção específica
history.deleteMessageRange('msg-start', 'msg-end');
```

#### Defined in

[src/memory/memory.interface.ts:321](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L321)

___

### editMessage

▸ **editMessage**(`messageId`, `newContent`): `void`

Edita o conteúdo de uma mensagem específica no histórico.

Permite modificar o conteúdo de uma mensagem existente mantendo
sua posição e outras propriedades. Útil para correções ou
otimizações de conteúdo.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageId` | `string` | Identificador único da mensagem a ser editada. |
| `newContent` | [`MessageContent`](../modules/memory_memory_interface.md#messagecontent) | Novo conteúdo para a mensagem. |

#### Returns

`void`

**`Throws`**

Se a mensagem não for encontrada ou content for inválido

**`Example`**

```typescript
// Corrigir uma mensagem
history.editMessage('msg-123', 'Conteúdo corrigido');

// Otimizar para reduzir tokens
history.editMessage('msg-456', 'Versão compactada da mensagem original');
```

#### Defined in

[src/memory/memory.interface.ts:298](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L298)

___

### exportHistory

▸ **exportHistory**(): [`Message`](memory_memory_interface.Message.md)[]

Exporta todo o histórico de mensagens.

Retorna uma cópia completa do histórico atual, incluindo
System Prompt e todas as mensagens, sem aplicação de truncamento.
Útil para persistência ou análise.

#### Returns

[`Message`](memory_memory_interface.Message.md)[]

Array com todas as mensagens do histórico.

**`Example`**

```typescript
// Salvar histórico
const fullHistory = history.exportHistory();
localStorage.setItem('chat-history', JSON.stringify(fullHistory));

// Analisar histórico
const totalMessages = fullHistory.length;
```

#### Defined in

[src/memory/memory.interface.ts:362](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L362)

___

### getMessageById

▸ **getMessageById**(`messageId`): [`Message`](memory_memory_interface.Message.md)

Busca uma mensagem específica por seu ID.

Retorna a mensagem correspondente ao ID fornecido ou undefined
se não encontrada. Útil para operações de edição ou verificação.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageId` | `string` | ID da mensagem a ser buscada. |

#### Returns

[`Message`](memory_memory_interface.Message.md)

A mensagem encontrada ou undefined.

**`Example`**

```typescript
const message = history.getMessageById('msg-123');
if (message) {
  console.log('Conteúdo:', message.content);
}
```

#### Defined in

[src/memory/memory.interface.ts:341](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L341)

___

### getRemainingBudget

▸ **getRemainingBudget**(): `number`

Retorna o orçamento de tokens restante com base no histórico atual.

Útil para monitoramento e logging, permitindo acompanhar o uso de tokens
e tomar decisões sobre otimização do contexto.

#### Returns

`number`

O número de tokens restantes disponíveis.
Retorna 0 se o limite já foi excedido.

**`Example`**

```typescript
const remaining = history.getRemainingBudget();
console.log(`Tokens restantes: ${remaining}`);

if (remaining < 100) {
  console.warn('Poucos tokens restantes!');
}
```

#### Defined in

[src/memory/memory.interface.ts:252](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L252)

___

### getTrimmedHistory

▸ **getTrimmedHistory**(): [`Message`](memory_memory_interface.Message.md)[]

Retorna o histórico de mensagens, aplicando truncamento baseado em tokens.

Esta é a operação principal do gerenciador. Ela aplica o algoritmo de
truncamento inteligente que:
1. Preserva sempre o System Prompt (primeira mensagem)
2. Preserva sempre a última mensagem do usuário
3. Remove mensagens intermediárias do mais antigo para o mais novo
4. Garante que o total de tokens não exceda maxContextTokens

#### Returns

[`Message`](memory_memory_interface.Message.md)[]

O array de mensagens pronto para ser enviado ao LLM.
As mensagens estão em ordem cronológica e respeitam o limite de tokens.

**`Remarks`**

- Retorna uma cópia do histórico (não a referência interna)
- O truncamento é aplicado a cada chamada
- Se o System Prompt + última mensagem excederem o limite, emite warning

**`Example`**

```typescript
const messages = history.getTrimmedHistory();

// Enviar para o provider
const response = await provider.chat(messages);
```

#### Defined in

[src/memory/memory.interface.ts:231](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L231)

___

### importHistory

▸ **importHistory**(`messages`): `void`

Importa mensagens para o histórico.

Substitui o histórico atual pelas mensagens fornecidas.
Útil para restaurar conversas anteriores ou mesclar
históricos de diferentes fontes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](memory_memory_interface.Message.md)[] | Array de mensagens a serem importadas. As mensagens devem estar em ordem cronológica. |

#### Returns

`void`

**`Throws`**

Se as mensagens forem inválidas ou null/undefined

**`Example`**

```typescript
// Restaurar histórico salvo
const savedHistory = JSON.parse(localStorage.getItem('chat-history'));
history.importHistory(savedHistory);

// Importar de outra fonte
history.importHistory([
  { role: 'system', content: 'Você é útil' },
  { role: 'user', content: 'Olá' }
]);
```

#### Defined in

[src/memory/memory.interface.ts:389](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/memory/memory.interface.ts#L389)
