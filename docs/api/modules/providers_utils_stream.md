# Module: providers/utils/stream

## Table of contents

### Functions

- [stream](providers_utils_stream.md#stream)

## Functions

### stream

▸ **stream**\<`T`\>(`stream`): `AsyncIterable`\<`T`\>

Transforma um stream de chunks da API em um iterador assíncrono.

Esta função é um wrapper que facilita o processamento de streams
retornados por APIs de LLM, permitindo consumo fácil dos chunks
de dados em tempo real.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream` | `AsyncIterable`\<`T`\> | Stream de chunks retornado pela API. Pode ser um AsyncIterable de qualquer tipo de dados. |

#### Returns

`AsyncIterable`\<`T`\>

Um iterador assíncrono que emite cada chunk do stream.

**`Example`**

```typescript
import { stream } from '@/providers/utils';

// Processar stream da OpenAI
const openaiStream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Conte uma história' }],
  stream: true
});

for await (const chunk of stream(openaiStream)) {
  const content = chunk.choices[0]?.delta?.content ?? '';
  process.stdout.write(content);
}

// Processar stream de provedor compatível
const compatibleStream = await compatibleProvider.chatCompletion({
  // ... config
  stream: true
});

for await (const chunk of stream(compatibleStream)) {
  console.log('Chunk received:', chunk);
}
```

**`Remarks`**

- Útil para respostas em tempo real de LLMs
- Funciona com qualquer AsyncIterable
- Preserva o tipo original dos chunks
- Facilita debugging e logging de streams

**`See`**

 - OpenAIProvider Para uso com OpenAI
 - OpenAICompatibleProvider Para uso com provedores compatíveis

#### Defined in

[src/providers/utils/stream.ts:57](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/providers/utils/stream.ts#L57)
