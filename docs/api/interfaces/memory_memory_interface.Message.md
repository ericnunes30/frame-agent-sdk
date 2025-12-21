# Interface: Message

[memory/memory.interface](../modules/memory_memory_interface.md).Message

Representa uma única mensagem na conversa, compatível com os principais Providers de LLM.

Esta interface segue o padrão de mensagens do OpenAI e é compatível com a maioria
dos provedores de modelos de linguagem, incluindo OpenAI, Anthropic Claude, e outros.

**`Example`**

```typescript
const userMessage: Message = {
  id: 'msg-123',
  role: 'user',
  content: 'Como funciona o aprendizado de máquina?'
};

const systemMessage: Message = {
  id: 'msg-456',
  role: 'system',
  content: 'Você é um assistente especializado em IA.'
};
```

**`Remarks`**

- 'system': Instruções de comportamento do assistente (sempre primeira, nunca truncada)
- 'user': Mensagens do usuário/contexto da conversa
- 'assistant': Respostas do modelo de linguagem
- 'tool': Resultados de chamadas de ferramentas (quando suportado)
- 'id': Identificador único para operações de edição e remoção (gerado automaticamente)

## Table of contents

### Properties

- [content](memory_memory_interface.Message.md#content)
- [id](memory_memory_interface.Message.md#id)
- [role](memory_memory_interface.Message.md#role)

## Properties

### content

• **content**: `string`

O conteúdo textual da mensagem.
Pode ser uma string simples ou conteúdo estruturado (JSON, markdown, etc.)

#### Defined in

[src/memory/memory.interface.ts:49](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/memory.interface.ts#L49)

___

### id

• `Optional` **id**: `string`

Identificador único da mensagem.
Usado para operações de edição, remoção e busca.
Gerado automaticamente pelo ChatHistoryManager se não fornecido.

#### Defined in

[src/memory/memory.interface.ts:37](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/memory.interface.ts#L37)

___

### role

• **role**: `string`

O papel/função da mensagem na conversa.
Valores aceitos: 'system', 'user', 'assistant', 'tool'

#### Defined in

[src/memory/memory.interface.ts:43](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/memory/memory.interface.ts#L43)
