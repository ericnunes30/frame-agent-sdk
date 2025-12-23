# Module: Memory

Módulo Memory - Gerenciamento de Memória de Conversas

Este módulo fornece componentes para gerenciamento inteligente de memória
em agentes de IA, implementando sistemas de truncamento baseado em tokens
que garantem que o contexto das conversas caiba dentro das limitações dos
modelos de linguagem.

## Componentes Principais

- **Message**: Interface para representar mensagens de conversa
- **ITokenizerService**: Contrato para serviços de tokenização
- **IChatHistoryManager**: Contrato para gerenciadores de histórico
- **ChatHistoryConfig**: Configuração para gerenciadores de histórico
- **TokenizerService**: Implementação aproximada de tokenização
- **ChatHistoryManager**: Gerenciador principal de histórico com truncamento inteligente

## Uso Básico

```typescript
import { ChatHistoryManager, TokenizerService } from '@/memory';

// Configurar tokenizador e gerenciador
const tokenizer = new TokenizerService('gpt-4');
const config = {
  maxContextTokens: 8192,
  tokenizer
};
const history = new ChatHistoryManager(config);

// Adicionar System Prompt e gerenciar conversa
history.addSystemPrompt('Você é um assistente especializado em programação.');
history.addMessage({ role: 'user', content: 'Como fazer um loop?' });

// Obter contexto truncado para enviar ao LLM
const messages = history.getTrimmedHistory();
```

## Table of contents

### References

- [ChatHistoryConfig](Memory.md#chathistoryconfig)
- [ChatHistoryManager](Memory.md#chathistorymanager)
- [ContentPart](Memory.md#contentpart)
- [ContextBeforeRequestResult](Memory.md#contextbeforerequestresult)
- [ContextHooks](Memory.md#contexthooks)
- [ContextOnErrorResult](Memory.md#contextonerrorresult)
- [IChatHistoryManager](Memory.md#ichathistorymanager)
- [ITokenizerService](Memory.md#itokenizerservice)
- [ImageUrlContentPart](Memory.md#imageurlcontentpart)
- [Message](Memory.md#message)
- [MessageContent](Memory.md#messagecontent)
- [TextContentPart](Memory.md#textcontentpart)
- [TokenizerService](Memory.md#tokenizerservice)
- [extractText](Memory.md#extracttext)
- [extractTextFromMessage](Memory.md#extracttextfrommessage)
- [hasImages](Memory.md#hasimages)
- [isContentParts](Memory.md#iscontentparts)
- [sanitizeForLogs](Memory.md#sanitizeforlogs)

## References

### ChatHistoryConfig

Re-exports [ChatHistoryConfig](../interfaces/memory_memory_interface.ChatHistoryConfig.md)

___

### ChatHistoryManager

Re-exports [ChatHistoryManager](../classes/memory_chatHistoryManager.ChatHistoryManager.md)

___

### ContentPart

Re-exports [ContentPart](memory_memory_interface.md#contentpart)

___

### ContextBeforeRequestResult

Re-exports [ContextBeforeRequestResult](../interfaces/memory_contextHooks_interface.ContextBeforeRequestResult.md)

___

### ContextHooks

Re-exports [ContextHooks](../interfaces/memory_contextHooks_interface.ContextHooks.md)

___

### ContextOnErrorResult

Re-exports [ContextOnErrorResult](../interfaces/memory_contextHooks_interface.ContextOnErrorResult.md)

___

### IChatHistoryManager

Re-exports [IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md)

___

### ITokenizerService

Re-exports [ITokenizerService](../interfaces/memory_memory_interface.ITokenizerService.md)

___

### ImageUrlContentPart

Re-exports [ImageUrlContentPart](../interfaces/memory_memory_interface.ImageUrlContentPart.md)

___

### Message

Re-exports [Message](../interfaces/memory_memory_interface.Message.md)

___

### MessageContent

Re-exports [MessageContent](memory_memory_interface.md#messagecontent)

___

### TextContentPart

Re-exports [TextContentPart](../interfaces/memory_memory_interface.TextContentPart.md)

___

### TokenizerService

Re-exports [TokenizerService](../classes/memory_tokenizer.TokenizerService.md)

___

### extractText

Re-exports [extractText](memory_utils_messageContentUtils.md#extracttext)

___

### extractTextFromMessage

Re-exports [extractTextFromMessage](memory_utils_messageContentUtils.md#extracttextfrommessage)

___

### hasImages

Re-exports [hasImages](memory_utils_messageContentUtils.md#hasimages)

___

### isContentParts

Re-exports [isContentParts](memory_utils_messageContentUtils.md#iscontentparts)

___

### sanitizeForLogs

Re-exports [sanitizeForLogs](memory_utils_messageContentUtils.md#sanitizeforlogs)
