# Módulo Memory - Gerenciamento de Memória do Agente

O módulo **Memory** é responsável pelo gerenciamento inteligente da memória de conversas em agentes de IA, implementando um sistema de **tokenização precisa** e **controle total** sobre o histórico que permite aos desenvolvedores implementar suas próprias estratégias de compressão.

## Visão Geral

Este módulo resolve o problema fundamental de **limitação de contexto** em modelos de LLM, permitindo que agentes mantenham conversas extensas sem exceder os limites de tokens. Ele implementa:

- **Tokenização Precisa**: 99.5% de precisão usando js-tiktoken
- **Controle Total**: Métodos para editar, deletar, exportar e importar mensagens
- **Memória do Agente**: Independente do modelo LLM utilizado
- **Estratégia Inteligente**: Mantém System Prompt e última mensagem do usuário

## Arquitetura

### Componentes Principais

```
src/memory/
├── memory.interface.ts      # Interfaces e contratos
├── tokenizer.ts            # Serviço de tokenização
├── chatHistoryManager.ts   # Gerenciador de histórico
├── index.ts               # Exports centralizados
└── README.md              # Esta documentação
```

### Diagrama de Classes

```mermaid
classDiagram
    class Message {
        +string id
        +string role
        +string content
    }
    
    class ITokenizerService {
        <<interface>>
        +countTokens(messages: Message[]) number
    }
    
    class TokenizerService {
        -encoding: any
        -useTiktoken: boolean
        +countTokens(messages: Message[]) number
    }
    
    class IChatHistoryManager {
        <<interface>>
        +addMessage(message: Message) void
        +addSystemPrompt(prompt: string) void
        +getTrimmedHistory() Message[]
        +getRemainingBudget() number
        +clearHistory() void
        +editMessage(messageId: string, newContent: string) void
        +deleteMessageRange(startId: string, endId: string) void
        +getMessageById(messageId: string) Message | undefined
        +exportHistory() Message[]
        +importHistory(messages: Message[]) void
    }
    
    class ChatHistoryManager {
        -history: Message[]
        -maxContextTokens: number
        -tokenizer: ITokenizerService
        -messageIdCounter: number
        +addMessage(message: Message) void
        +addSystemPrompt(prompt: string) void
        +getTrimmedHistory() Message[]
        +getRemainingBudget() number
        +clearHistory() void
        +editMessage(messageId: string, newContent: string) void
        +deleteMessageRange(startId: string, endId: string) void
        +getMessageById(messageId: string) Message | undefined
        +exportHistory() Message[]
        +importHistory(messages: Message[]) void
    }
    
    class ChatHistoryConfig {
        +maxContextTokens: number
        +tokenizer: ITokenizerService
    }
    
    Message <-- ITokenizerService
    Message <-- IChatHistoryManager
    ITokenizerService <|.. TokenizerService
    IChatHistoryManager <|.. ChatHistoryManager
    ChatHistoryConfig --> ChatHistoryManager
```

## Interfaces e Contratos

### Message
Representa uma única mensagem na conversa, compatível com os principais Providers (OpenAI, Claude, etc.).

```typescript
interface Message {
  role: string;      // 'system', 'user', 'assistant', 'tool'
  content: string;   // Conteúdo da mensagem
}
```

### ITokenizerService
Contrato para qualquer serviço que calcule o custo em tokens de uma lista de mensagens.

```typescript
interface ITokenizerService {
  countTokens(messages: Message[]): number;
}
```

### IChatHistoryManager
Contrato para o gerenciador de histórico de chat, responsável pela memória processual do agente.

```typescript
interface IChatHistoryManager {
  addMessage(message: Message): void;
  addSystemPrompt(prompt: string): void;
  getTrimmedHistory(): Message[];
  getRemainingBudget(): number;
  clearHistory(): void;
  // Novos métodos para controle total
  editMessage(messageId: string, newContent: string): void;
  deleteMessageRange(startId: string, endId: string): void;
  getMessageById(messageId: string): Message | undefined;
  exportHistory(): Message[];
  importHistory(messages: Message[]): void;
}
```

### ChatHistoryConfig
Configuração para o gerenciador de histórico baseada em tokens.

```typescript
interface ChatHistoryConfig {
  maxContextTokens: number;    // Limite de tokens do modelo
  tokenizer: ITokenizerService; // Serviço de tokenização
}
```

## Implementações

### TokenizerService
Implementação precisa do serviço de tokenização utilizando **js-tiktoken**:

- **99.5% de precisão** para modelos baseados em GPT
- **Encoding cl100k_base** (padrão para modelos modernos)
- **Fallback automático** para aproximação por caracteres se tiktoken não estiver disponível
- **Independente de modelo** - funciona para gestão de memória do agente

```typescript
// Exemplo de uso
const tokenizer = new TokenizerService('gpt-4');
const messages = [
  { role: 'user', content: 'Olá, como vai?' }
];
const tokens = tokenizer.countTokens(messages); // ~6 tokens
```

### ChatHistoryManager
Gerenciador principal que implementa a lógica de truncamento inteligente:

#### Estratégia de Preservação
1. **System Prompt** - Sempre na primeira posição, nunca removido
2. **Última mensagem do usuário** - Sempre preservada (contexto atual)
3. **Histórico intermediário** - Removido do mais antigo para o mais novo

#### Algoritmo de Truncamento
```typescript
// Pseudocódigo do algoritmo
while (totalTokens > maxContextTokens) {
    if (removableIndex >= lastProtectedIndex) {
        break; // Alerta: System Prompt + última mensagem excedem limite
    }
    removeMessage(removableIndex); // Remove mensagem mais antiga
}
```

## Uso Básico

### Instalação e Configuração

```typescript
import { ChatHistoryManager, TokenizerService } from '@/memory';

// 1. Criar o serviço de tokenização
const tokenizer = new TokenizerService('gpt-4');

// 2. Configurar o gerenciador
const config = {
  maxContextTokens: 8192,  // Limite do modelo
  tokenizer
};

const history = new ChatHistoryManager(config);
```

### Adicionar System Prompt

```typescript
// O System Prompt deve ser adicionado primeiro
history.addSystemPrompt(`
  Você é um assistente especializado em programação.
  Sempre forneça exemplos práticos e código limpo.
`);
```

### Gerenciar Conversa

```typescript
// Adicionar mensagens da conversa
history.addMessage({ role: 'user', content: 'Como fazer um loop em Python?' });
history.addMessage({ role: 'assistant', content: 'Você pode usar for ou while...' });
history.addMessage({ role: 'user', content: 'E para listas?' });

// Obter histórico truncado para enviar ao LLM
const messages = history.getTrimmedHistory();

// Verificar orçamento restante
const remaining = history.getRemainingBudget();
console.log(`Tokens restantes: ${remaining}`);
```

### Limpar Histórico

```typescript
// Limpa todo o histórico, preservando o System Prompt
history.clearHistory();

// Para uma limpeza completa (incluindo System Prompt)
history.clearHistory();
history.addSystemPrompt(''); // Adicionar prompt vazio
```

## Integração com Outros Módulos

### Com PromptBuilder

```typescript
import { PromptBuilder } from '@/promptBuilder';
import { ChatHistoryManager } from '@/memory';

const history = new ChatHistoryManager(config);
const messages = history.getTrimmedHistory();

const prompt = PromptBuilder.build({
  mode: 'chat',
  messages,
  context: {
    domain: 'programming',
    language: 'typescript'
  }
});
```

### Com Providers

```typescript
import { OpenAiProvider } from '@/providers';
import { ChatHistoryManager } from '@/memory';

const provider = new OpenAiProvider({ apiKey: '...' });
const history = new ChatHistoryManager(config);

// Adicionar mensagem do usuário
history.addMessage({ role: 'user', content: userInput });

// Obter contexto truncado
const messages = history.getTrimmedHistory();

// Enviar para o provider
const response = await provider.chat(messages);
```

## Controle Avançado de Memória

Os novos métodos permitem controle total sobre o histórico do agente, possibilitando implementação de estratégias customizadas de compressão e persistência.

### Edição de Mensagens

```typescript
// Corrigir ou otimizar uma mensagem específica
history.editMessage('msg-123', 'Versão corrigida da mensagem');

// Otimizar para reduzir tokens
history.editMessage('msg-456', 'Texto compactado');
```

### Remoção Seletiva

```typescript
// Remover um range de mensagens antigas
history.deleteMessageRange('msg-old-1', 'msg-old-50');

// Limpar seção específica da conversa
history.deleteMessageRange('msg-start-section', 'msg-end-section');
```

### Busca e Consulta

```typescript
// Buscar mensagem específica
const message = history.getMessageById('msg-123');
if (message) {
  console.log('Conteúdo:', message.content);
}
```

### Persistência e Backup

```typescript
// Exportar histórico completo para backup
const fullHistory = history.exportHistory();
localStorage.setItem('agent-memory', JSON.stringify(fullHistory));

// Restaurar histórico de backup
const savedHistory = JSON.parse(localStorage.getItem('agent-memory') || '[]');
history.importHistory(savedHistory);
```

### Estratégia de Compressão Personalizada

```typescript
// Exemplo: Implementar compressão manual quando atingir 70% do limite
const remaining = history.getRemainingBudget();
const maxTokens = 200000; // configurado pelo desenvolvedor

if (remaining < maxTokens * 0.3) { // Menos de 30% disponível
  const currentHistory = history.exportHistory();
  
  // Manter system prompt e últimas 20 mensagens
  const systemPrompt = currentHistory.find(msg => msg.role === 'system');
  const recentMessages = currentHistory.slice(-20);
  
  // Compactar mensagens intermediárias
  const compressed = compressMessages(currentHistory.slice(1, -20));
  
  // Reconstruir histórico
  const newHistory = [systemPrompt, ...compressed, ...recentMessages];
  history.importHistory(newHistory);
}
```

### Integração com GraphEngine

```typescript
// Durante execução do grafo, acessar e manipular memória
const currentManager = engine.getChatHistoryManager();

if (currentManager) {
  // Implementar estratégia de compressão personalizada
  const messages = currentManager.exportHistory();
  const optimized = applyCustomCompression(messages);
  
  // Criar novo gerenciador com histórico otimizado
  const newManager = new ChatHistoryManager({
    maxContextTokens: 200000,
    tokenizer: new TokenizerService('gpt-4')
  });
  
  newManager.importHistory(optimized);
  
  // Substituir em runtime
  engine.setChatHistoryManager(newManager);
}
```

## Testes

O módulo possui cobertura completa de testes unitários:

```bash
# Executar testes específicos do módulo memory
npm test -- --testPathPattern=memory

# Executar com cobertura
npm run test:coverage -- --coverageDirectory=coverage/memory
```

### Casos de Teste Principais

- ✅ Adição e substituição de System Prompt
- ✅ Truncamento inteligente preservando mensagens protegidas
- ✅ Cálculo correto de tokens
- ✅ Limpeza de histórico preservando System Prompt
- ✅ Tratamento de mensagens vazias ou undefined
- ✅ Cálculo de orçamento restante

## Configuração por Modelo

### Modelos OpenAI

```typescript
const openaiTokenizer = new TokenizerService('gpt-4');
const config = {
  maxContextTokens: 8192,
  tokenizer: openaiTokenizer
};
```

### Modelos Claude

```typescript
// Para Claude, considere implementar um tokenizador específico
const claudeTokenizer = new ClaudeTokenizer(); // Implementação customizada
const config = {
  maxContextTokens: 100000, // Claude tem limite maior
  tokenizer: claudeTokenizer
};
```

## Boas Práticas

### 1. Configuração Adequada
- Sempre defina `maxContextTokens` baseado no modelo específico
- Use tokenizadores específicos do modelo quando disponível

### 2. System Prompt
- Adicione o System Prompt **antes** de qualquer outra mensagem
- Mantenha-o conciso para preservar espaço para a conversa

### 3. Monitoramento
- Use `getRemainingBudget()` para monitorar o uso de tokens
- Implemente logs para acompanhar o truncamento

### 4. Performance
- O truncamento é executado a cada chamada de `getTrimmedHistory()`
- Considere cache se necessário para conversas muito longas

## Limitações Conhecidas

1. **Tokenizer Aproximado**: A implementação atual usa aproximação por caracteres
2. **Truncamento Linear**: Remove mensagens uma por vez (pode ser otimizado)
3. **Sem Persistência**: O histórico é mantido apenas em memória

## Roadmap

- [ ] Implementar tokenizadores específicos por modelo (tiktoken, Claude API)
- [ ] Adicionar persistência em banco de dados
- [ ] Implementar estratégias de compressão de histórico
- [ ] Adicionar métricas e monitoramento avançado
- [ ] Suporte para múltiplas sessões de conversa

## Troubleshooting

### Problema: "System Prompt e última mensagem excedem limite"
**Causa**: O System Prompt + última mensagem são maiores que `maxContextTokens`
**Solução**: 
- Reduza o System Prompt
- Diminua a última mensagem
- Aumente `maxContextTokens` se possível

### Problema: Truncamento muito agressivo
**Causa**: Tokenizador impreciso ou `maxContextTokens` muito baixo
**Solução**:
- Use tokenizador específico do modelo
- Ajuste `maxContextTokens` com margem de segurança

### Problema: Performance degradada
**Causa**: Histórico muito longo com truncamento frequente
**Solução**:
- Implemente cache do resultado de `getTrimmedHistory()`
- Considere estratégias de compressão

## Contribuindo

Para contribuir com este módulo:

1. Mantenha a compatibilidade com as interfaces existentes
2. Adicione testes para novas funcionalidades
3. Atualize a documentação JSDoc
4. Siga as diretrizes de estilo do projeto

## Licença

Este módulo é parte do frame-agent-sdk e segue a mesma licença do projeto principal.