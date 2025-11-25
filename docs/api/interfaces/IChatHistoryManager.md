# Interface: IChatHistoryManager

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

- [`ChatHistoryManager`](../classes/ChatHistoryManager.md)

## Table of contents

### Methods

- [addMessage](IChatHistoryManager.md#addmessage)
- [addSystemPrompt](IChatHistoryManager.md#addsystemprompt)
- [clearHistory](IChatHistoryManager.md#clearhistory)
- [getRemainingBudget](IChatHistoryManager.md#getremainingbudget)
- [getTrimmedHistory](IChatHistoryManager.md#gettrimmedhistory)

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
| `message` | [`Message`](Message.md) | A mensagem a ser adicionada ao histórico. Deve ter role válida ('user', 'assistant', 'tool') e content não vazio. |

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

[src/memory/memory.interface.ts:144](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/memory.interface.ts#L144)

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

[src/memory/memory.interface.ts:169](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/memory.interface.ts#L169)

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

[src/memory/memory.interface.ts:241](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/memory.interface.ts#L241)

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

[src/memory/memory.interface.ts:218](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/memory.interface.ts#L218)

___

### getTrimmedHistory

▸ **getTrimmedHistory**(): [`Message`](Message.md)[]

Retorna o histórico de mensagens, aplicando truncamento baseado em tokens.

Esta é a operação principal do gerenciador. Ela aplica o algoritmo de
truncamento inteligente que:
1. Preserva sempre o System Prompt (primeira mensagem)
2. Preserva sempre a última mensagem do usuário
3. Remove mensagens intermediárias do mais antigo para o mais novo
4. Garante que o total de tokens não exceda maxContextTokens

#### Returns

[`Message`](Message.md)[]

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

[src/memory/memory.interface.ts:197](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/memory.interface.ts#L197)
