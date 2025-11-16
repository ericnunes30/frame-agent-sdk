# Módulo Providers

## Propósito
Sistema de provedores unificado para integração com diferentes LLMs (OpenAI, OpenAI-compatible, etc.), oferecendo uma interface consistente com suporte a streaming, retry automático, gerenciamento de contexto e adaptação entre diferentes formatos de API.

## Estrutura
```
providers/
├── adapter/                    # Adaptador unificado para provedores
│   ├── providerAdapter.ts     # Classe principal ProviderAdapter
│   ├── providerAdapter.interface.ts # Interfaces e tipos
│   └── index.ts               # Exportações
├── providers/                 # Implementações específicas de provedores
│   ├── openAiProvider.ts      # Provedor OpenAI oficial
│   ├── openaiCompatibleProvider.ts # Provedores compatíveis com OpenAI
│   ├── providerRegistry.ts    # Registro de provedores
│   └── index.ts              # Exportações
├── utils/                     # Utilitários para provedores
│   ├── stream.ts             # Utilitários de streaming
│   └── index.ts              # Exportações
└── index.ts                  # Exportações principais
```

## Principais Componentes

### ProviderAdapter
- **Localização**: [`adapter/providerAdapter.ts`](adapter/providerAdapter.ts)
- **Interface**: [`adapter/providerAdapter.interface.ts`](adapter/providerAdapter.interface.ts)
- **Função**: Interface unificada para todos os provedores
- **Características**:
  - Interface consistente independente do provedor
  - Suporte a streaming e chamadas síncronas
  - Retry automático com backoff exponencial
  - Tratamento de erros unificado
  - Configuração flexível

### OpenAIProvider
- **Localização**: [`providers/openAiProvider.ts`](providers/openAiProvider.ts)
- **Função**: Implementação específica para OpenAI oficial
- **Características**:
  - Suporte a todos os modelos OpenAI
  - Streaming nativo
  - Function calling
  - Rate limiting automático

### OpenAICompatibleProvider
- **Localização**: [`providers/openaiCompatibleProvider.ts`](providers/openaiCompatibleProvider.ts)
- **Função**: Para provedores que seguem a API da OpenAI
- **Características**:
  - Compatibilidade com múltiplos provedores
  - Configuração de baseURL customizada
  - Suporte a diferentes formatos de resposta

### ProviderRegistry
- **Localização**: [`providers/providerRegistry.ts`](providers/providerRegistry.ts)
- **Função**: Registro centralizado de provedores
- **Características**:
  - Registro dinâmico de provedores
  - Descoberta automática de provedores
  - Gerenciamento de instâncias

## Exemplos de Uso

### Configuração Básica
```typescript
import { ProviderAdapter } from './providers';

// Configurar OpenAI
const openaiProvider = new ProviderAdapter({
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  maxTokens: 1000
});

// Configurar provedor compatível
const compatibleProvider = new ProviderAdapter({
  provider: 'openai-compatible',
  model: 'custom-model',
  baseURL: 'https://api.custom-provider.com/v1',
  apiKey: process.env.CUSTOM_API_KEY,
  temperature: 0.8
});
```

### Invocação Simples
```typescript
import { ProviderAdapter } from './providers';
import type { Message } from '../memory';

const messages: Message[] = [
  { role: 'system', content: 'Você é um assistente prestativo.' },
  { role: 'user', content: 'Explique a teoria da relatividade.' }
];

// Invocar provedor
const response = await openaiProvider.invoke({ messages });
console.log(response.content);

// Com opções adicionais
const response = await openaiProvider.invoke({
  messages,
  temperature: 0.8,
  maxTokens: 500,
  tools: [...], // Ferramentas disponíveis
  stream: false
});
```

### Streaming de Respostas
```typescript
import { ProviderAdapter } from './providers';

// Streaming com OpenAI
const stream = await openaiProvider.stream({ messages });

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}

// Streaming com callbacks
await openaiProvider.stream({ 
  messages,
  onChunk: (chunk) => {
    console.log('Chunk recebido:', chunk.content);
  },
  onComplete: (fullResponse) => {
    console.log('Streaming completo:', fullResponse);
  }
});
```

### Uso com Ferramentas
```typescript
import { ProviderAdapter } from './providers';
import { SearchTool, CalculatorTool } from '../tools';

const tools = [
  new SearchTool(),
  new CalculatorTool()
];

const response = await openaiProvider.invoke({
  messages: [
    { role: 'user', content: 'Qual é a população de Tóquio e qual a raiz quadrada dela?' }
  ],
  tools: tools,
  tool_choice: 'auto' // Deixar o modelo escolher quando usar ferramentas
});

// Verificar se ferramentas foram usadas
if (response.tool_calls) {
  console.log('Ferramentas usadas:', response.tool_calls);
  
  // Executar ferramentas
  for (const toolCall of response.tool_calls) {
    const tool = tools.find(t => t.name === toolCall.name);
    if (tool) {
      const toolResult = await tool.execute(toolCall.arguments);
      console.log(`Resultado de ${toolCall.name}:`, toolResult);
    }
  }
}
```

### Retry Automático e Tratamento de Erros
```typescript
import { ProviderAdapter } from './providers';

const provider = new ProviderAdapter({
  provider: 'openai',
  model: 'gpt-4o-mini',
  retries: 3,        // Tentar até 3 vezes
  retryDelay: 1000,  // Esperar 1 segundo entre tentativas
  exponentialBackoff: true, // Backoff exponencial
  timeout: 30000     // Timeout de 30 segundos
});

try {
  const response = await provider.invoke({ messages });
  console.log('Sucesso:', response.content);
} catch (error) {
  if (error.name === 'ProviderTimeoutError') {
    console.error('Timeout - a operação demorou muito');
  } else if (error.name === 'ProviderRateLimitError') {
    console.error('Limite de taxa excedido');
  } else if (error.name === 'ProviderAuthenticationError') {
    console.error('Problema de autenticação - verificar API key');
  } else {
    console.error('Erro no provedor:', error.message);
  }
}
```

### Registro de Provedores Customizados
```typescript
import { ProviderRegistry } from './providers';

// Registrar provedor customizado
ProviderRegistry.register('meu-provedor', {
  name: 'Meu Provedor',
  baseURL: 'https://api.meu-provedor.com/v1',
  models: ['modelo-1', 'modelo-2', 'modelo-3'],
  features: ['streaming', 'tools', 'batch'],
  headers: {
    'X-Custom-Header': 'valor'
  }
});

// Usar provedor registrado
const customProvider = new ProviderAdapter({
  provider: 'meu-provedor',
  model: 'modelo-1',
  apiKey: process.env.MEU_PROVEDOR_API_KEY
});
```

### Provedores Múltiplos com Failover
```typescript
import { ProviderAdapter } from './providers';

const providers = [
  new ProviderAdapter({
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY,
    priority: 1
  }),
  new ProviderAdapter({
    provider: 'openai-compatible',
    model: 'backup-model',
    baseURL: 'https://api.backup-provider.com/v1',
    apiKey: process.env.BACKUP_API_KEY,
    priority: 2
  })
];

// Implementar failover
async function invokeWithFailover(messages: Message[]) {
  for (const provider of providers.sort((a, b) => a.priority - b.priority)) {
    try {
      const response = await provider.invoke({ messages });
      console.log(`Sucesso com ${provider.provider}`);
      return response;
    } catch (error) {
      console.warn(`Falha com ${provider.provider}:`, error.message);
      continue;
    }
  }
  throw new Error('Todos os provedores falharam');
}
```

## Configurações Avançadas

### Configuração de Timeout e Retry
```typescript
import { ProviderAdapter } from './providers';

const provider = new ProviderAdapter({
  provider: 'openai',
  model: 'gpt-4o-mini',
  timeout: 60000,     // 1 minuto
  retries: 5,         // 5 tentativas
  retryDelay: 2000,   // 2 segundos entre tentativas
  exponentialBackoff: true,
  maxRetryDelay: 30000 // Máximo 30 segundos entre tentativas
});
```

### Parâmetros do Modelo
```typescript
import { ProviderAdapter } from './providers';

const response = await provider.invoke({
  messages,
  temperature: 0.8,      // Criatividade (0-2)
  top_p: 0.9,           // Nucleus sampling
  frequency_penalty: 0.5, // Penalidade de frequência
  presence_penalty: 0.5,  // Penalidade de presença
  stop: ['\n', '.'],     // Sequências de parada
  maxTokens: 1000,       // Máximo de tokens
  seed: 42,              // Seed para reprodutibilidade
  logprobs: 10,          // Log probabilities
  top_logprobs: 5        // Top log probabilities
});
```

### Streaming Avançado
```typescript
import { ProviderAdapter } from './providers';

const stream = await provider.stream({ 
  messages,
  onChunk: (chunk) => {
    // Processar cada chunk
    console.log('Chunk:', chunk.content);
    
    if (chunk.usage) {
      console.log('Uso de tokens:', chunk.usage);
    }
  },
  onComplete: (fullResponse) => {
    // Chamado quando o streaming termina
    console.log('Resposta completa:', fullResponse);
  },
  onError: (error) => {
    // Tratar erros durante o streaming
    console.error('Erro no streaming:', error);
  },
  streamOptions: {
    include_usage: true,    // Incluir informações de uso
    include_logprobs: true  // Incluir log probabilities
  }
});
```

### Headers e Configurações Customizadas
```typescript
import { ProviderAdapter } from './providers';

const provider = new ProviderAdapter({
  provider: 'openai-compatible',
  model: 'custom-model',
  baseURL: 'https://api.custom-provider.com/v1',
  apiKey: process.env.CUSTOM_API_KEY,
  headers: {
    'X-Custom-Header': 'valor',
    'X-Organization': 'minha-org'
  },
  queryParams: {
    custom_param: 'valor'
  },
  requestConfig: {
    httpsAgent: customAgent, // Agent HTTPS customizado
    proxy: {
      host: 'proxy.example.com',
      port: 8080
    }
  }
});
```

## Integração com Outros Módulos

### LLM
O módulo LLM usa ProviderAdapter internamente:
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

### Agents
Agentes usam provedores através do LLM:
```typescript
import { ProviderAdapter } from '../providers';
import { LLM } from '../llm';

class MeuAgente {
  constructor(private config: IAgentConfig) {
    this.llm = new LLM({
      provider: config.provider,
      model: config.model,
      apiKey: config.apiKey
    });
  }
}
```

### Workflows
Workflows podem usar provedores diretamente:
```typescript
import { ProviderAdapter } from '../providers';

const step = {
  id: 'llm-processing',
  execute: async (context) => {
    const provider = new ProviderAdapter({
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: context.secrets.OPENAI_API_KEY
    });
    
    const response = await provider.invoke({
      messages: context.data.messages
    });
    
    return response.content;
  }
};
```

## Tratamento de Erros

### Tipos de Erros
```typescript
import { ProviderAdapter } from './providers';

try {
  const response = await provider.invoke({ messages });
} catch (error) {
  switch (error.name) {
    case 'ProviderTimeoutError':
      // Timeout - considerar aumentar timeout ou simplificar prompt
      break;
    case 'ProviderRateLimitError':
      // Rate limit - implementar backoff exponencial
      break;
    case 'ProviderAuthenticationError':
      // Problema de autenticação - verificar API key
      break;
    case 'ProviderValidationError':
      // Parâmetros inválidos - verificar configuração
      break;
    case 'ProviderServerError':
      // Erro do servidor - tentar novamente mais tarde
      break;
    default:
      console.error('Erro desconhecido:', error);
  }
}
```

## Performance e Otimização

### Reutilização de Instâncias
```typescript
// Criar uma vez, reutilizar múltiplas vezes
const provider = new ProviderAdapter({
  provider: 'openai',
  model: 'gpt-4o-mini'
});

// Reutilizar em múltiplas chamadas
const response1 = await provider.invoke({ messages: messages1 });
const response2 = await provider.invoke({ messages: messages2 });
```

### Connection Pooling
```typescript
import { ProviderAdapter } from './providers';

const provider = new ProviderAdapter({
  provider: 'openai',
  model: 'gpt-4o-mini',
  connectionPool: {
    enabled: true,
    maxConnections: 10,
    keepAlive: true,
    timeout: 30000
  }
});
```

### Cache de Respostas
```typescript
import { ProviderAdapter } from './providers';

const provider = new ProviderAdapter({
  provider: 'openai',
  model: 'gpt-4o-mini',
  cache: {
    enabled: true,
    ttl: 3600000, // 1 hora
    maxSize: 1000,
    keyGenerator: (messages) => {
      return JSON.stringify(messages);
    }
  }
});
```

## Documentação Adicional

- [API Reference](../../docs/api/modules/providers.md)
- [Exemplos de Provedores](../../examples/providers/)
- [Guia de Configuração](./configuration.md)
- [Integração com LLM](../llm/README.md)

## Notas Importantes

1. **API Keys Seguras**: Sempre use variáveis de ambiente para API keys
2. **Rate Limiting**: Respeite os limites de cada provedor
3. **Timeouts Apropriados**: Configure baseado no uso esperado
4. **Retry com Cuidado**: Muitas tentativas podem aumentar custos
5. **Streaming para UX**: Use streaming para melhor experiência do usuário
6. **Provedores Compatíveis**: Verifique compatibilidade antes de usar
7. **Headers Customizados**: Use apenas quando necessário
8. **Monitoramento**: Monitore uso e custos regularmente