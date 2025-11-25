# Interface: Message

Representa uma única mensagem na conversa, compatível com os principais Providers de LLM.

Esta interface segue o padrão de mensagens do OpenAI e é compatível com a maioria
dos provedores de modelos de linguagem, incluindo OpenAI, Anthropic Claude, e outros.

**`Example`**

```typescript
const userMessage: Message = {
  role: 'user',
  content: 'Como funciona o aprendizado de máquina?'
};

const systemMessage: Message = {
  role: 'system',
  content: 'Você é um assistente especializado em IA.'
};
```

**`Remarks`**

- 'system': Instruções de comportamento do assistente (sempre primeira, nunca truncada)
- 'user': Mensagens do usuário/contexto da conversa
- 'assistant': Respostas do modelo de linguagem
- 'tool': Resultados de chamadas de ferramentas (quando suportado)

## Table of contents

### Properties

- [content](Message.md#content)
- [role](Message.md#role)

## Properties

### content

• **content**: `string`

O conteúdo textual da mensagem.
Pode ser uma string simples ou conteúdo estruturado (JSON, markdown, etc.)

#### Defined in

[src/memory/memory.interface.ts:39](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/memory.interface.ts#L39)

___

### role

• **role**: `string`

O papel/função da mensagem na conversa.
Valores aceitos: 'system', 'user', 'assistant', 'tool'

#### Defined in

[src/memory/memory.interface.ts:33](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/memory.interface.ts#L33)
