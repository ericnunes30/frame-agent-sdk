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
- [IChatHistoryManager](Memory.md#ichathistorymanager)
- [ITokenizerService](Memory.md#itokenizerservice)
- [Message](Memory.md#message)
- [TokenizerService](Memory.md#tokenizerservice)

## References

### ChatHistoryConfig

Re-exports [ChatHistoryConfig](../interfaces/memory_memory_interface.ChatHistoryConfig.md)

___

### ChatHistoryManager

Re-exports [ChatHistoryManager](../classes/memory_chatHistoryManager.ChatHistoryManager.md)

___

### IChatHistoryManager

Re-exports [IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md)

___

### ITokenizerService

Re-exports [ITokenizerService](../interfaces/memory_memory_interface.ITokenizerService.md)

___

### Message

Re-exports [Message](../interfaces/memory_memory_interface.Message.md)

___

### TokenizerService

Re-exports [TokenizerService](../classes/memory_tokenizer.TokenizerService.md)
