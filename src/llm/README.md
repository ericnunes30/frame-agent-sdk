# Módulo LLM

## Propósito
Abstração unificada para interação com Large Language Models (LLMs), fornecendo uma interface consistente para diferentes provedores (OpenAI, OpenAI-compatible, etc.) com suporte a streaming, retry automático e gerenciamento de contexto.

## Estrutura
```
llm/
├── llm.ts           # Classe principal LLM com métodos invoke e stream
└── index.ts         # Exportações principais
```

## Principais Componentes

### Classe LLM
- **Localização**: [`llm.ts`](llm.ts)
- **Função**: Interface unificada para LLMs
- **Métodos principais**:
  - `invoke(options)`: Chamada síncrona única
  - `stream(options)`: Streaming de respostas
  - `batch(messages, options)`: Processamento em lote

### Configuração
```typescript
interface LLMOptions {
  provider: 'openai' | 'openai-compatible' | string;
  model: string;
  apiKey?: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}
```

## Exemplos de Uso

### Configuração Básica
```typescript
import { LLM } from './llm';

// Configurar LLM com OpenAI
const llm = new LLM({
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  maxTokens: 1000
});

// Configurar LLM com provedor compatível
const customLLM = new LLM({
  provider: 'openai-compatible',
  model: 'custom-model',
  baseURL: 'https://api.custom-provider.com',
  apiKey: process.env.CUSTOM_API_KEY
});
```

### Invocação Simples
```typescript
import { LLM } from './llm';
import type { Message } from '../memory';

const messages: Message[] = [
  { role: 'system', content: 'Você é um assistente útil.' },
  { role: 'user', content: 'Explique o conceito de machine learning.' }
];

// Invocação síncrona
const response = await llm.invoke({ messages });
console.log(response.content);

// Com opções adicionais
const response = await llm.invoke({
  messages,
  temperature: 0.8,
  maxTokens: 500,
  tools: [...], // Ferramentas disponíveis
  stream: false
});
```

### Streaming de Respostas
```typescript
import { LLM } from './llm';

// Streaming de resposta
const stream = await llm.stream({ messages });

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}

// Com callback
await llm.stream({ 
  messages,
  onChunk: (chunk) => {
    console.log('Chunk recebido:', chunk.content);
  }
});
```

### Processamento em Lote
```typescript
import { LLM } from './llm';

const conversations = [
  [
    { role: 'user', content: 'Qual é a capital do Brasil?' }
  ],
  [
    { role: 'user', content: 'Explique a teoria da relatividade.' }
  ],
  [
    { role: 'user', content: 'Como funciona a fotossíntese?' }
  ]
];

// Processar múltiplas conversas
const responses = await llm.batch(conversations, {
  temperature: 0.7,
  maxTokens: 200
});

responses.forEach((response, index) => {
  console.log(`Resposta ${index + 1}:`, response.content);
});
```

### Uso com Ferramentas
```typescript
import { LLM } from './llm';
import { SearchTool, CalculatorTool } from '../tools';

const tools = [
  new SearchTool(),
  new CalculatorTool()
];

const response = await llm.invoke({
  messages: [
    { role: 'user', content: 'Qual é a população de Tóquio e qual a raiz quadrada dela?' }
  ],
  tools: tools,
  tool_choice: 'auto' // Deixar o modelo escolher quando usar ferramentas
});

// Verificar se ferramentas foram usadas
if (response.tool_calls) {
  console.log('Ferramentas usadas:', response.tool_calls);
}
```

### Retry Automático e Tratamento de Erros
```typescript
import { LLM } from './llm';

const llm = new LLM({
  provider: 'openai',
  model: 'gpt-4o-mini',
  retries: 3,        // Tentar até 3 vezes
  retryDelay: 1000,  // Esperar 1 segundo entre tentativas
  timeout: 30000     // Timeout de 30 segundos
});

try {
  const response = await llm.invoke({ messages });
  console.log('Sucesso:', response.content);
} catch (error) {
  if (error.name === 'LLMTimeoutError') {
    console.error('Timeout - a operação demorou muito');
  } else if (error.name === 'LLMRateLimitError') {
    console.error('Limite de taxa excedido');
  } else {
    console.error('Erro no LLM:', error.message);
  }
}
```

## Integração com Outros Módulos

### Providers
O LLM usa o módulo de providers internamente:
```typescript
// Internamente, LLM usa ProviderAdapter
import { ProviderAdapter } from '../providers';

const provider = new ProviderAdapter({
  provider: options.provider,
  model: options.model,
  apiKey: options.apiKey
});

// O ProviderAdapter lida com as especificidades de cada provedor
```

### Memory
Integração com histórico de conversas:
```typescript
import { ChatHistoryManager } from '../memory';

const history = new ChatHistoryManager();
const messages = history.getMessages();

const response = await llm.invoke({ messages });

// Adicionar resposta ao histórico
history.addMessage({ role: 'assistant', content: response.content });
```

### PromptBuilder
Uso com PromptBuilder para prompts estruturados:
```typescript
import { PromptBuilder } from '../promptBuilder';

const prompt = PromptBuilder.build({
  mode: 'react',
  messages,
  tools,
  agentInfo: { name: 'Assistente', goal: 'Ajuda o usuário' }
});

const response = await llm.invoke({ messages: prompt });
```

## Configurações Avançadas

### Timeout e Retry Customizados
```typescript
const llm = new LLM({
  provider: 'openai',
  model: 'gpt-4o-mini',
  timeout: 60000,     // 1 minuto
  retries: 5,         // 5 tentativas
  retryDelay: 2000,   // 2 segundos entre tentativas
  exponentialBackoff: true // Backoff exponencial
});
```

### Parâmetros do Modelo
```typescript
const response = await llm.invoke({
  messages,
  temperature: 0.8,      // Criatividade (0-2)
  top_p: 0.9,           // Nucleus sampling
  frequency_penalty: 0.5, // Penalidade de frequência
  presence_penalty: 0.5,  // Penalidade de presença
  stop: ['\n', '.'],     // Sequências de parada
  maxTokens: 1000        // Máximo de tokens
});
```

### Streaming Avançado
```typescript
const stream = await llm.stream({
  messages,
  onChunk: (chunk) => {
    // Processar cada chunk
    console.log(chunk.content);
  },
  onComplete: (fullResponse) => {
    // Chamado quando o streaming termina
    console.log('Streaming completo:', fullResponse);
  },
  onError: (error) => {
    // Tratar erros durante o streaming
    console.error('Erro no streaming:', error);
  }
});
```

## Tratamento de Erros

### Tipos de Erros
```typescript
// Erros comuns e como tratá-los
try {
  const response = await llm.invoke({ messages });
} catch (error) {
  switch (error.name) {
    case 'LLMTimeoutError':
      // Timeout - considerar aumentar timeout ou simplificar prompt
      break;
    case 'LLMRateLimitError':
      // Rate limit - implementar backoff exponencial
      break;
    case 'LLMAuthenticationError':
      // Problema de autenticação - verificar API key
      break;
    case 'LLMValidationError':
      // Parâmetros inválidos - verificar configuração
      break;
    default:
      // Erro genérico
      console.error('Erro desconhecido:', error);
  }
}
```

## Performance e Otimização

### Reutilização de Instâncias
```typescript
// Criar uma vez, reutilizar múltiplas vezes
const llm = new LLM({ provider: 'openai', model: 'gpt-4o-mini' });

// Reutilizar em múltiplas chamadas
const response1 = await llm.invoke({ messages: messages1 });
const response2 = await llm.invoke({ messages: messages2 });
```

### Cache de Configuração
```typescript
// O LLM internamente cacheia configurações
const llm = new LLM({
  provider: 'openai',
  model: 'gpt-4o-mini',
  // Configurações que serão cacheadas
});

// Chamadas subsequentes usam cache
```

## Documentação Adicional

- [API Reference](../../docs/api/modules/llm.md)
- [Exemplos de Uso](../../examples/llm/)
- [Guia de Providers](../providers/README.md)
- [Integração com Agentes](../agents/README.md)

## Notas Importantes

1. **API Key Segura**: Sempre use variáveis de ambiente para API keys
2. **Timeout Apropriado**: Configure timeouts baseados no uso esperado
3. **Retry com Cuidado**: Muitas tentativas podem aumentar custos
4. **Streaming para UX**: Use streaming para melhor experiência do usuário
5. **Rate Limits**: Respeite os limites do provedor
6. **Custos**: Monitore uso e custos, especialmente com retries