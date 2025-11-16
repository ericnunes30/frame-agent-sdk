# Módulo Memory

## Propósito
Sistema de gerenciamento de memória e histórico de conversas para LLMs, incluindo tokenização, persistência e gerenciamento de contexto de conversas com diferentes estratégias de armazenamento.

## Estrutura
```
memory/
├── chatHistoryManager.ts    # Gerenciador principal de histórico de chat
├── memory.interface.ts      # Interfaces e tipos principais
├── tokenizer.ts            # Serviço de tokenização para controle de contexto
└── index.ts                # Exportações principais
```

## Principais Componentes

### ChatHistoryManager
- **Localização**: [`chatHistoryManager.ts`](chatHistoryManager.ts)
- **Função**: Gerenciamento completo de histórico de conversas
- **Características**:
  - Adicionar e recuperar mensagens
  - Limpar histórico
  - Gerenciamento de contexto
  - Suporte a diferentes estratégias de armazenamento
  - Integração com tokenização

### TokenizerService
- **Localização**: [`tokenizer.ts`](tokenizer.ts)
- **Função**: Controle de tokens para gerenciamento de contexto
- **Características**:
  - Contagem de tokens em mensagens
  - Truncamento baseado em tokens
  - Suporte a diferentes modelos de tokenização
  - Otimização de contexto

### Interfaces Principais
- **Message**: [`memory.interface.ts`](memory.interface.ts) - Estrutura de mensagens
- **IChatHistoryManager**: Interface para gerenciadores de histórico
- **ITokenizerService**: Interface para serviços de tokenização
- **ChatHistoryConfig**: Configuração do histórico

## Exemplos de Uso

### Configuração Básica
```typescript
import { ChatHistoryManager } from './memory';

// Configuração padrão
const history = new ChatHistoryManager({
  maxMessages: 100,           // Máximo de mensagens
  maxTokens: 4000,           // Máximo de tokens
  strategy: 'fifo',          // Estratégia: fifo, lifo, sliding-window
  persist: true,             // Persistir em disco
  storagePath: './chat-history.json' // Caminho de persistência
});

// Configuração com tokenizador customizado
const historyWithTokenizer = new ChatHistoryManager({
  maxTokens: 8000,
  tokenizer: {
    model: 'gpt-4',
    encoding: 'cl100k_base'
  }
});
```

### Adicionando Mensagens
```typescript
import { ChatHistoryManager } from './memory';

const history = new ChatHistoryManager();

// Adicionar mensagem simples
await history.addMessage({
  role: 'user',
  content: 'Qual é a capital do Brasil?'
});

// Adicionar mensagem com metadata
await history.addMessage({
  role: 'assistant',
  content: 'A capital do Brasil é Brasília.',
  metadata: {
    timestamp: new Date(),
    model: 'gpt-4o-mini',
    tokens: 15
  }
});

// Adicionar múltiplas mensagens
await history.addMessages([
  { role: 'user', content: 'Explique a fotossíntese.' },
  { role: 'assistant', content: 'A fotossíntese é o processo...' },
  { role: 'user', content: 'E quanto à quimiossíntese?' }
]);
```

### Recuperando Mensagens
```typescript
import { ChatHistoryManager } from './memory';

const history = new ChatHistoryManager();

// Obter todas as mensagens
const allMessages = await history.getMessages();

// Obter mensagens recentes (últimas 10)
const recentMessages = await history.getRecentMessages(10);

// Obter mensagens por role
const userMessages = await history.getMessagesByRole('user');
const assistantMessages = await history.getMessagesByRole('assistant');

// Obter mensagens em um intervalo de tempo
const startDate = new Date('2024-01-01');
const endDate = new Date('2024-01-31');
const januaryMessages = await history.getMessagesByDateRange(startDate, endDate);
```

### Gerenciamento de Contexto com Tokens
```typescript
import { ChatHistoryManager, TokenizerService } from './memory';

const tokenizer = new TokenizerService('gpt-4o-mini');
const history = new ChatHistoryManager({
  maxTokens: 4000,
  tokenizer: tokenizer
});

// Adicionar mensagens e verificar tokens
await history.addMessage({
  role: 'user',
  content: 'Explique em detalhes como funciona a blockchain.'
});

// Verificar contagem de tokens atual
const tokenCount = await history.getTokenCount();
console.log(`Tokens usados: ${tokenCount}`);

// Verificar se está próximo do limite
if (await history.isNearTokenLimit()) {
  console.log('Aproximando-se do limite de tokens');
}

// Obter mensagens que cabem em um limite de tokens
const messagesWithinLimit = await history.getMessagesWithinTokenLimit(3500);
```

### Limpeza e Gerenciamento
```typescript
import { ChatHistoryManager } from './memory';

const history = new ChatHistoryManager();

// Limpar histórico completo
await history.clear();

// Limpar mensagens antigas (manter últimas 50)
await history.trim(50);

// Limpar por tokens (manter dentro do limite)
await history.trimToTokenLimit();

// Remover mensagens específicas
await history.removeMessage(messageId);

// Arquivar histórico antigo
await history.archive({
  olderThan: new Date('2024-01-01'),
  archivePath: './archives/'
});
```

### Persistência
```typescript
import { ChatHistoryManager } from './memory';

// Configurar persistência
const history = new ChatHistoryManager({
  persist: true,
  storagePath: './conversations/chat-123.json',
  autoSave: true,        // Salvar automaticamente após mudanças
  saveInterval: 5000     // Salvar a cada 5 segundos
});

// Salvar manualmente
await history.save();

// Carregar histórico existente
await history.load();

// Verificar se existe histórico salvo
const exists = await history.hasSavedHistory();
if (exists) {
  await history.load();
}

// Exportar/importar
const exported = await history.export();
await history.import(exportedData);
```

## Integração com Outros Módulos

### LLM
Integração com o módulo LLM para contexto de conversas:
```typescript
import { LLM } from '../llm';
import { ChatHistoryManager } from './memory';

const llm = new LLM({ provider: 'openai', model: 'gpt-4o-mini' });
const history = new ChatHistoryManager();

// Obter mensagens para enviar ao LLM
const messages = await history.getMessagesForLLM();

const response = await llm.invoke({ messages });

// Adicionar resposta ao histórico
await history.addMessage({
  role: 'assistant',
  content: response.content
});
```

### Agentes
Uso em agentes para manter contexto:
```typescript
import { ChatHistoryManager } from './memory';

class MeuAgente {
  private history: ChatHistoryManager;
  
  constructor() {
    this.history = new ChatHistoryManager({
      maxTokens: 8000,
      strategy: 'sliding-window'
    });
  }
  
  async execute(messages) {
    // Adicionar mensagens ao histórico
    await this.history.addMessages(messages);
    
    // Obter contexto completo
    const context = await this.history.getMessages();
    
    // Processar com LLM
    const response = await this.llm.invoke({ messages: context });
    
    // Adicionar resposta ao histórico
    await this.history.addMessage({
      role: 'assistant',
      content: response.content
    });
    
    return response;
  }
}
```

### Workflows
Uso em workflows para manter estado:
```typescript
import { ChatHistoryManager } from './memory';

// Em um workflow step
const step = {
  id: 'process-with-context',
  execute: async (context) => {
    const history = new ChatHistoryManager({
      sessionId: context.workflowId
    });
    
    // Adicionar entrada atual
    await history.addMessage({
      role: 'user',
      content: context.data.input
    });
    
    // Obter histórico completo
    const messages = await history.getMessages();
    
    // Processar com contexto
    const result = await processWithContext(messages);
    
    return result;
  }
};
```

## Configurações Avançadas

### Estratégias de Armazenamento
```typescript
import { ChatHistoryManager } from './memory';

// FIFO (First In, First Out) - padrão
const fifo = new ChatHistoryManager({ strategy: 'fifo' });

// LIFO (Last In, First Out)
const lifo = new ChatHistoryManager({ strategy: 'lifo' });

// Sliding Window - mantém janela deslizante
const sliding = new ChatHistoryManager({ 
  strategy: 'sliding-window',
  windowSize: 10 // Últimas 10 mensagens
});

// Smart Truncation - remove mensagens menos importantes
const smart = new ChatHistoryManager({ 
  strategy: 'smart-truncation',
  importanceThreshold: 0.7
});
```

### Tokenizadores Customizados
```typescript
import { ChatHistoryManager, TokenizerService } from './memory';

// Tokenizador para GPT-4
const gpt4Tokenizer = new TokenizerService('gpt-4', 'cl100k_base');

// Tokenizador para Claude
const claudeTokenizer = new TokenizerService('claude-3', 'claude');

// Tokenizador customizado
class MeuTokenizer implements ITokenizerService {
  countTokens(text: string): number {
    // Implementação customizada
    return text.split(' ').length * 1.3; // Estimativa simples
  }
  
  truncate(text: string, maxTokens: number): string {
    // Implementação customizada
    const words = text.split(' ');
    return words.slice(0, Math.floor(maxTokens / 1.3)).join(' ');
  }
}

const history = new ChatHistoryManager({
  tokenizer: new MeuTokenizer()
});
```

### Filtros e Busca
```typescript
import { ChatHistoryManager } from './memory';

const history = new ChatHistoryManager();

// Buscar mensagens por conteúdo
const results = await history.searchMessages('blockchain');

// Buscar com regex
const regexResults = await history.searchMessages(/machine.learning/i);

// Filtrar por múltiplos critérios
const filtered = await history.filterMessages({
  role: 'assistant',
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31')
  },
  contentIncludes: 'AI'
});

// Obter mensagens com metadata específica
const withMetadata = await history.getMessagesWithMetadata({
  model: 'gpt-4',
  confidence: { $gt: 0.8 }
});
```

## Tratamento de Erros

### Erros Comuns
```typescript
import { ChatHistoryManager } from './memory';

try {
  await history.addMessage({ role: 'user', content: 'Hello' });
} catch (error) {
  switch (error.name) {
    case 'StorageError':
      // Erro ao salvar/carregar
      console.error('Problema com armazenamento:', error);
      break;
    case 'TokenLimitError':
      // Limite de tokens excedido
      console.error('Limite de tokens excedido:', error);
      // Considerar limpar histórico
      await history.trimToTokenLimit();
      break;
    case 'ValidationError':
      // Mensagem inválida
      console.error('Mensagem inválida:', error);
      break;
    default:
      console.error('Erro desconhecido:', error);
  }
}
```

## Performance e Otimização

### Cache e Memoização
```typescript
import { ChatHistoryManager } from './memory';

const history = new ChatHistoryManager({
  cache: {
    enabled: true,
    maxSize: 1000,     // Cache até 1000 mensagens
    ttl: 3600000       // TTL de 1 hora
  }
});

// As operações serão cacheadas automaticamente
```

### Batch Operations
```typescript
// Adicionar múltiplas mensagens eficientemente
await history.addMessages([
  { role: 'user', content: 'Msg 1' },
  { role: 'assistant', content: 'Resposta 1' },
  { role: 'user', content: 'Msg 2' },
  { role: 'assistant', content: 'Resposta 2' }
], { batch: true });
```

## Documentação Adicional

- [API Reference](../../docs/api/modules/memory.md)
- [Exemplos de Uso](../../examples/memory/)
- [Guia de Tokenização](./tokenizer.md)
- [Integração com LLMs](../llm/README.md)

## Notas Importantes

1. **Persistência Opcional**: O histórico pode ser mantido em memória ou persistido em disco
2. **Token Limits**: Sempre configure limites apropriados de tokens para seu modelo
3. **Estratégia de Armazenamento**: Escolha a estratégia baseada em seu caso de uso
4. **Performance**: Para aplicações em tempo real, considere usar cache
5. **Privacidade**: Tenha cuidado com dados sensíveis no histórico
6. **Backup**: Implemente backup regular se usar persistência