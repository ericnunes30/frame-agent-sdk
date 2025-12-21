# Class: ChatHistoryManager

[memory/chatHistoryManager](../modules/memory_chatHistoryManager.md).ChatHistoryManager

Gerenciador de Histórico de Chat (Memória Processual).

Esta classe é responsável por armazenar e gerenciar o histórico de mensagens
de conversas em agentes de IA, implementando um sistema inteligente de
truncamento baseado em tokens que garante que o contexto caiba dentro das
limitações dos modelos de linguagem.

## Estratégia de Preservação

O gerenciador implementa uma estratégia de preservação que garante que:
1. **System Prompt** (primeira mensagem) - sempre preservado
2. **Última mensagem do usuário** - sempre preservada (contexto atual)
3. **Histórico intermediário** - truncado do mais antigo para o mais novo

## Algoritmo de Truncamento

Quando o limite de tokens é excedido, o algoritmo:
1. Remove mensagens do meio da conversa (mais antigas primeiro)
2. Preserva sempre o System Prompt e a última mensagem
3. Para quando não há mais mensagens para remover ou quando atingir o limite

**`Example`**

```typescript
import { ChatHistoryManager, TokenizerService } from '@/memory';

// Configuração
const tokenizer = new TokenizerService('gpt-4');
const config = {
  maxContextTokens: 8192,
  tokenizer
};

const history = new ChatHistoryManager(config);

// Adicionar System Prompt
history.addSystemPrompt('Você é um assistente especializado em programação.');

// Gerenciar conversa
history.addMessage({ role: 'user', content: 'Como fazer um loop?' });
history.addMessage({ role: 'assistant', content: 'Use for ou while...' });

// Obter contexto truncado
const messages = history.getTrimmedHistory();

// Verificar orçamento
const remaining = history.getRemainingBudget();
```

**`See`**

 - [ChatHistoryConfig](../interfaces/memory_memory_interface.ChatHistoryConfig.md) Para configuração
 - [IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md) Para a interface implementada

## Implements

- [`IChatHistoryManager`](../interfaces/memory_memory_interface.IChatHistoryManager.md)

## Table of contents

### Constructors

- [constructor](memory_chatHistoryManager.ChatHistoryManager.md#constructor)

### Properties

- [history](memory_chatHistoryManager.ChatHistoryManager.md#history)
- [maxContextTokens](memory_chatHistoryManager.ChatHistoryManager.md#maxcontexttokens)
- [messageIdCounter](memory_chatHistoryManager.ChatHistoryManager.md#messageidcounter)
- [tokenizer](memory_chatHistoryManager.ChatHistoryManager.md#tokenizer)

### Methods

- [addMessage](memory_chatHistoryManager.ChatHistoryManager.md#addmessage)
- [addSystemPrompt](memory_chatHistoryManager.ChatHistoryManager.md#addsystemprompt)
- [clearHistory](memory_chatHistoryManager.ChatHistoryManager.md#clearhistory)
- [deleteMessageRange](memory_chatHistoryManager.ChatHistoryManager.md#deletemessagerange)
- [editMessage](memory_chatHistoryManager.ChatHistoryManager.md#editmessage)
- [exportHistory](memory_chatHistoryManager.ChatHistoryManager.md#exporthistory)
- [generateMessageId](memory_chatHistoryManager.ChatHistoryManager.md#generatemessageid)
- [getMessageById](memory_chatHistoryManager.ChatHistoryManager.md#getmessagebyid)
- [getRemainingBudget](memory_chatHistoryManager.ChatHistoryManager.md#getremainingbudget)
- [getTrimmedHistory](memory_chatHistoryManager.ChatHistoryManager.md#gettrimmedhistory)
- [importHistory](memory_chatHistoryManager.ChatHistoryManager.md#importhistory)

## Constructors

### constructor

• **new ChatHistoryManager**(`config`): [`ChatHistoryManager`](memory_chatHistoryManager.ChatHistoryManager.md)

Cria uma nova instância do ChatHistoryManager.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`ChatHistoryConfig`](../interfaces/memory_memory_interface.ChatHistoryConfig.md) | Configuração do gerenciador contendo: - `maxContextTokens`: Limite de tokens do modelo (ex: 8192 para GPT-4) - `tokenizer`: Instância do serviço de tokenização |

#### Returns

[`ChatHistoryManager`](memory_chatHistoryManager.ChatHistoryManager.md)

**`Example`**

```typescript
// Configuração básica
const config = {
  maxContextTokens: 8192,
  tokenizer: new TokenizerService('gpt-4')
};
const history = new ChatHistoryManager(config);

// Configuração para Claude (maior limite)
const claudeConfig = {
  maxContextTokens: 100000,
  tokenizer: new ClaudeTokenizer()
};
const claudeHistory = new ChatHistoryManager(claudeConfig);
```

#### Defined in

[src/memory/chatHistoryManager.ts:95](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L95)

## Properties

### history

• `Private` **history**: [`Message`](../interfaces/memory_memory_interface.Message.md)[] = `[]`

O histórico de mensagens, mantido em ordem cronológica

#### Defined in

[src/memory/chatHistoryManager.ts:60](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L60)

___

### maxContextTokens

• `Private` **maxContextTokens**: `number`

O limite máximo de tokens para o contexto total

#### Defined in

[src/memory/chatHistoryManager.ts:63](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L63)

___

### messageIdCounter

• `Private` **messageIdCounter**: `number` = `0`

Contador para gerar IDs únicos de mensagens

#### Defined in

[src/memory/chatHistoryManager.ts:69](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L69)

___

### tokenizer

• `Private` **tokenizer**: [`ITokenizerService`](../interfaces/memory_memory_interface.ITokenizerService.md)

O serviço injetado para calcular o custo em tokens

#### Defined in

[src/memory/chatHistoryManager.ts:66](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L66)

## Methods

### addMessage

▸ **addMessage**(`message`): `void`

Adiciona uma mensagem ao histórico de chat.

As mensagens são adicionadas ao final do histórico, mantendo a ordem
cronológica da conversa. Esta mensagem pode ser removida durante o
truncamento, exceto se for a última mensagem do usuário.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](../interfaces/memory_memory_interface.Message.md) | A mensagem a ser adicionada ao histórico. Deve ter uma role válida ('user', 'assistant', 'tool') e content não vazio. |

#### Returns

`void`

**`Throws`**

Se a mensagem for inválida (role ou content ausente)

**`Remarks`**

- As mensagens são adicionadas no final (ordem cronológica)
- Pode ser removida durante truncamento (exceto última do usuário)
- Use addSystemPrompt() antes desta função para definir o comportamento

**`Example`**

```typescript
// Adicionar mensagem do usuário
history.addMessage({
  role: 'user',
  content: 'Como implementar um algoritmo de ordenação?'
});

// Adicionar resposta do assistente
history.addMessage({
  role: 'assistant',
  content: 'Existem vários algoritmos: bubble sort, quick sort, merge sort...'
});

// Adicionar resultado de ferramenta
history.addMessage({
  role: 'tool',
  content: JSON.stringify({ result: 'execution completed' })
});
```

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[addMessage](../interfaces/memory_memory_interface.IChatHistoryManager.md#addmessage)

#### Defined in

[src/memory/chatHistoryManager.ts:201](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L201)

___

### addSystemPrompt

▸ **addSystemPrompt**(`prompt`): `void`

Adiciona uma mensagem de prompt do sistema (System Prompt).

O System Prompt é sempre inserido na primeira posição do histórico e é
imunizado contra truncamento. Se já existir um System Prompt, ele será
substituído pelo novo.

**Importante**: Esta deve ser a primeira operação realizada no gerenciador
para garantir que o System Prompt fique na posição correta.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prompt` | `string` | O texto do System Prompt com as instruções de comportamento. Deve ser uma string não vazia com as diretrizes para o assistente. |

#### Returns

`void`

**`Remarks`**

- Utiliza Guard Clause para early return quando o prompt já existe
- Substitui prompts existentes mantendo a posição primeira
- É sempre preservado durante o truncamento

**`Example`**

```typescript
history.addSystemPrompt(`
  Você é um assistente especializado em TypeScript e Node.js.
  Sempre forneça exemplos práticos e código limpo.
  Explique conceitos complexos de forma simples.
`);
```

**`See`**

[getTrimmedHistory](memory_chatHistoryManager.ChatHistoryManager.md#gettrimmedhistory) Para entender como o prompt é preservado

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[addSystemPrompt](../interfaces/memory_memory_interface.IChatHistoryManager.md#addsystemprompt)

#### Defined in

[src/memory/chatHistoryManager.ts:139](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L139)

___

### clearHistory

▸ **clearHistory**(): `void`

Limpa todo o histórico de mensagens, preservando o System Prompt.

Remove todas as mensagens do histórico exceto o System Prompt (se existir).
Esta operação é útil para iniciar uma nova conversa mantendo as instruções
de comportamento do assistente.

#### Returns

`void`

**`Remarks`**

- O System Prompt é sempre preservado (se existir)
- Para limpeza completa (incluindo System Prompt), chame addSystemPrompt('') depois
- Esta operação não pode ser desfeita
- Útil para iniciar nova conversa com mesmo comportamento

**`Example`**

```typescript
// Limpar conversa mantendo instruções
history.clearHistory();
// System prompt permanece, histórico é limpo

// Limpeza completa (incluindo System Prompt)
history.clearHistory();
history.addSystemPrompt(''); // Remove prompt também

// Nova conversa com novo prompt
history.clearHistory();
history.addSystemPrompt('Novo comportamento do assistente');
```

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[clearHistory](../interfaces/memory_memory_interface.IChatHistoryManager.md#clearhistory)

#### Defined in

[src/memory/chatHistoryManager.ts:247](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L247)

___

### deleteMessageRange

▸ **deleteMessageRange**(`startId`, `endId`): `void`

Remove um range de mensagens do histórico.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startId` | `string` | ID da primeira mensagem a ser removida. |
| `endId` | `string` | ID da última mensagem a ser removida. |

#### Returns

`void`

**`Throws`**

Se os IDs não forem encontrados ou forem inválidos

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[deleteMessageRange](../interfaces/memory_memory_interface.IChatHistoryManager.md#deletemessagerange)

#### Defined in

[src/memory/chatHistoryManager.ts:434](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L434)

___

### editMessage

▸ **editMessage**(`messageId`, `newContent`): `void`

Edita o conteúdo de uma mensagem específica no histórico.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageId` | `string` | Identificador único da mensagem a ser editada. |
| `newContent` | `string` | Novo conteúdo para a mensagem. |

#### Returns

`void`

**`Throws`**

Se a mensagem não for encontrada ou content for inválido

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[editMessage](../interfaces/memory_memory_interface.IChatHistoryManager.md#editmessage)

#### Defined in

[src/memory/chatHistoryManager.ts:412](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L412)

___

### exportHistory

▸ **exportHistory**(): [`Message`](../interfaces/memory_memory_interface.Message.md)[]

Exporta todo o histórico de mensagens.

#### Returns

[`Message`](../interfaces/memory_memory_interface.Message.md)[]

Array com todas as mensagens do histórico.

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[exportHistory](../interfaces/memory_memory_interface.IChatHistoryManager.md#exporthistory)

#### Defined in

[src/memory/chatHistoryManager.ts:471](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L471)

___

### generateMessageId

▸ **generateMessageId**(): `string`

Gera um ID único para uma mensagem.

#### Returns

`string`

ID único no formato 'msg-<timestamp>-<counter>'

#### Defined in

[src/memory/chatHistoryManager.ts:106](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L106)

___

### getMessageById

▸ **getMessageById**(`messageId`): [`Message`](../interfaces/memory_memory_interface.Message.md)

Busca uma mensagem específica por seu ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageId` | `string` | ID da mensagem a ser buscada. |

#### Returns

[`Message`](../interfaces/memory_memory_interface.Message.md)

A mensagem encontrada ou undefined.

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[getMessageById](../interfaces/memory_memory_interface.IChatHistoryManager.md#getmessagebyid)

#### Defined in

[src/memory/chatHistoryManager.ts:462](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L462)

___

### getRemainingBudget

▸ **getRemainingBudget**(): `number`

Calcula o orçamento de tokens restante com base no histórico atual.

Esta função é útil para monitoramento e logging, permitindo acompanhar
o uso de tokens e tomar decisões sobre otimização do contexto antes de
enviar a requisição ao LLM.

#### Returns

`number`

O número de tokens restantes disponíveis.
Retorna 0 se o limite já foi excedido (nunca retorna valor negativo).

**`Remarks`**

- Útil para logging e monitoramento de uso de tokens
- Pode ser usado para tomar decisões sobre otimização
- Não considera o truncamento, apenas o estado atual
- Use antes de getTrimmedHistory() para entender o estado atual

**`Example`**

```typescript
// Adicionar mensagens
history.addMessage({ role: 'user', content: 'Pergunta longa...' });

// Verificar orçamento antes de enviar
const remaining = history.getRemainingBudget();
console.log(`Tokens restantes: ${remaining}`);

if (remaining < 100) {
  console.warn('Poucos tokens restantes! Considere otimizar o contexto.');
}

// Obter contexto truncado
const messages = history.getTrimmedHistory();

// Verificar novamente após truncamento
const remainingAfter = history.getRemainingBudget();
console.log(`Tokens restantes após truncamento: ${remainingAfter}`);
```

**`See`**

[getTrimmedHistory](memory_chatHistoryManager.ChatHistoryManager.md#gettrimmedhistory) Para obter o contexto otimizado

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[getRemainingBudget](../interfaces/memory_memory_interface.IChatHistoryManager.md#getremainingbudget)

#### Defined in

[src/memory/chatHistoryManager.ts:399](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L399)

___

### getTrimmedHistory

▸ **getTrimmedHistory**(): [`Message`](../interfaces/memory_memory_interface.Message.md)[]

Retorna o histórico de mensagens, aplicando truncamento inteligente baseado em tokens.

Esta é a operação principal do gerenciador. Ela aplica o algoritmo de truncamento
que garante que o contexto caiba dentro do limite de tokens do modelo, preservando
sempre as mensagens mais importantes da conversa.

## Estratégia de Preservação

1. **System Prompt** (primeira mensagem) - sempre preservado
2. **Última mensagem do usuário** - sempre preservada (contexto atual)
3. **Histórico intermediário** - removido do mais antigo para o mais novo

## Algoritmo de Truncamento

1. Se histórico ≤ 2 mensagens, retorna como está (não há o que truncar)
2. Clona o histórico para manipulação segura
3. Identifica primeira mensagem mutável (após System Prompt)
4. Loop de remoção:
   - Remove mensagem mais antiga (índice = firstMutableIndex)
   - Recalcula tokens totais
   - Para quando atingir limite ou não houver mais mensagens para remover
5. Retorna cópia do histórico truncado

#### Returns

[`Message`](../interfaces/memory_memory_interface.Message.md)[]

O array de mensagens pronto para ser enviado ao LLM.
As mensagens estão em ordem cronológica e respeitam o limite de tokens.

**`Remarks`**

- Retorna uma cópia (não a referência interna) para segurança
- O truncamento é aplicado a cada chamada
- Se System Prompt + última mensagem excederem limite, emite warning
- Utiliza Guard Clause para evitar loop infinito

**`Example`**

```typescript
// Configurar gerenciador
const history = new ChatHistoryManager(config);
history.addSystemPrompt('Você é um assistente útil.');
history.addMessage({ role: 'user', content: 'Pergunta 1' });
history.addMessage({ role: 'assistant', content: 'Resposta 1' });
history.addMessage({ role: 'user', content: 'Pergunta 2' });

// Obter contexto truncado
const messages = history.getTrimmedHistory();

// Enviar para o provider
const response = await provider.chat(messages);
```

**`See`**

 - [addSystemPrompt](memory_chatHistoryManager.ChatHistoryManager.md#addsystemprompt) Para entender como o prompt é preservado
 - [addMessage](memory_chatHistoryManager.ChatHistoryManager.md#addmessage) Para entender como as mensagens são adicionadas

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[getTrimmedHistory](../interfaces/memory_memory_interface.IChatHistoryManager.md#gettrimmedhistory)

#### Defined in

[src/memory/chatHistoryManager.ts:317](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L317)

___

### importHistory

▸ **importHistory**(`messages`): `void`

Importa mensagens para o histórico.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](../interfaces/memory_memory_interface.Message.md)[] | Array de mensagens a serem importadas. |

#### Returns

`void`

**`Throws`**

Se as mensagens forem inválidas ou null/undefined

#### Implementation of

[IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md).[importHistory](../interfaces/memory_memory_interface.IChatHistoryManager.md#importhistory)

#### Defined in

[src/memory/chatHistoryManager.ts:482](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/chatHistoryManager.ts#L482)
