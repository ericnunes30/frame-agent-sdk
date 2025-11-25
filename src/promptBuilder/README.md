# Módulo PromptBuilder

## Propósito
Sistema de construção e gerenciamento de prompts para LLMs, oferecendo modos estruturados (chat, react) e templates flexíveis para criar prompts otimizados para diferentes tipos de agentes e casos de uso.

## Estrutura
```
promptBuilder/
├── promptBuilder.ts              # Classe principal PromptBuilder
├── promptBuilder.interface.ts    # Interfaces e tipos
└── index.ts                     # Exportações principais
```

## Principais Componentes

### Classe PromptBuilder
- **Localização**: [`promptBuilder.ts`](promptBuilder.ts)
- **Função**: Construtor de prompts com diferentes modos e templates
- **Métodos principais**:
  - `build(options)`: Constrói prompt baseado nas opções
  - `buildChatPrompt(messages, config)`: Modo de chat
  - `buildReactPrompt(messages, tools, config)`: Modo react
  - `validatePrompt(prompt)`: Valida estrutura do prompt

### Modos de Prompt
```typescript
type PromptMode = 'chat' | 'react' | 'custom';

interface PromptBuilderConfig {
  mode: PromptMode;
  systemPrompt?: string;
  agentInfo?: AgentInfo;
  tools?: ToolSchema[];
  context?: Record<string, any>;
}
```

## Exemplos de Uso

### Modo Chat Simples
```typescript
import { PromptBuilder } from './promptBuilder';
import type { Message } from '../memory';

const messages: Message[] = [
  { role: 'system', content: 'Você é um assistente prestativo.' },
  { role: 'user', content: 'Qual é a capital do Brasil?' }
];

// Construir prompt de chat
const prompt = PromptBuilder.build({
  mode: 'chat',
  messages,
  systemPrompt: 'Você é um especialista em geografia.'
});

// Saída: Prompt formatado para modo chat
```

### Modo React com Ferramentas
```typescript
import { PromptBuilder } from './promptBuilder';
import { SearchTool, CalculatorTool } from '../tools';

const messages: Message[] = [
  { role: 'user', content: 'Qual é a população de Tóquio e qual a raiz quadrada dela?' }
];

const tools = [
  new SearchTool(),
  new CalculatorTool()
];

// Construir prompt react
const prompt = PromptBuilder.build({
  mode: 'react',
  messages,
  tools: tools.map(tool => tool.getSchema()),
  agentInfo: {
    name: 'Assistente Matemático',
    goal: 'Realizar cálculos e buscas',
    backstory: 'Especialista em análise de dados'
  }
});

// Saída: Prompt estruturado para modo react com ferramentas
```

### Prompt com Informações do Agente
```typescript
import { PromptBuilder } from './promptBuilder';

const agentInfo = {
  name: 'Analisador de Dados',
  goal: 'Analisar e interpretar dados complexos',
  backstory: 'Especialista em estatística e análise de dados com 10 anos de experiência'
};

const prompt = PromptBuilder.build({
  mode: 'chat',
  messages: [
    { role: 'user', content: 'Analise estes dados de vendas.' }
  ],
  agentInfo,
  context: {
    dataSource: 'vendas_2024.csv',
    analysisType: 'tendências mensais'
  }
});
```

### Prompt Customizado com Template
```typescript
import { PromptBuilder } from './promptBuilder';

// Template customizado
const customTemplate = `
Você é {agentName}, {agentGoal}.

Contexto: {context}

Instruções: {instructions}

Histórico da conversa:
{conversationHistory}

Com base nas informações acima, responda à seguinte pergunta:
{userQuestion}
`;

const prompt = PromptBuilder.build({
  mode: 'custom',
  template: customTemplate,
  variables: {
    agentName: 'Assistente Financeiro',
    agentGoal: 'especialista em análise de investimentos',
    context: 'Análise de portfólio de ações',
    instructions: 'Forneça recomendações baseadas em dados históricos',
    conversationHistory: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
    userQuestion: 'Devo investir em tecnologia ou energia renovável?'
  }
});
```

### Construção com Configuração Detalhada
```typescript
import { PromptBuilder } from './promptBuilder';

const config = {
  mode: 'react' as const,
  systemPrompt: 'Você é um assistente de pesquisa acadêmica.',
  agentInfo: {
    name: 'Pesquisador Acadêmico',
    goal: 'Realizar pesquisas acadêmicas rigorosas',
    backstory: 'PhD em Ciência da Computação com foco em IA'
  },
  tools: [
    {
      name: 'search_arxiv',
      description: 'Pesquisar artigos no arXiv',
      parameters: {
        query: { type: 'string', description: 'Termo de pesquisa' },
        max_results: { type: 'number', description: 'Máximo de resultados' }
      }
    },
    {
      name: 'summarize_paper',
      description: 'Resumir artigo acadêmico',
      parameters: {
        paper_id: { type: 'string', description: 'ID do artigo' }
      }
    }
  ],
  context: {
    research_area: 'Inteligência Artificial',
    publication_year: '2024',
    methodology: 'systematic_review'
  },
  maxTokens: 2000,
  temperature: 0.3
};

const prompt = PromptBuilder.build(config);
```

### Validação de Prompt
```typescript
import { PromptBuilder } from './promptBuilder';

const prompt = 'Texto do prompt aqui...';

try {
  const isValid = PromptBuilder.validatePrompt(prompt);
} catch (error) {
  console.error('Erro na validação:', error.message);
}

// Validação com regras específicas
const validationRules = {
  maxLength: 4000,
  requiredSections: ['system', 'user'],
  forbiddenWords: ['palavra_proibida']
};

const validationResult = PromptBuilder.validatePrompt(prompt, validationRules);
```

## Modos de Prompt Detalhados

### Modo Chat
```typescript
// Estrutura do modo chat
const chatPrompt = PromptBuilder.buildChatPrompt(messages, {
  systemPrompt: 'Você é um especialista.',
  agentInfo: { name: 'Especialista', goal: 'Fornecer expertise' },
  context: { domain: 'medicina' }
});

// Resultado esperado:
// System: Você é um especialista.
// Human: Pergunta do usuário
// Assistant: [resposta]
```

### Modo React
```typescript
// Estrutura do modo react
const reactPrompt = PromptBuilder.buildReactPrompt(messages, tools, {
  agentInfo: { name: 'Assistente', goal: 'Resolver problemas' },
  maxIterations: 5,
  context: { task: 'análise de dados' }
});

// Resultado esperado:
// Thought: Preciso analisar os dados
// Action: usar_ferramenta_análise
// Action Input: { dados: [...] }
// Observation: Resultado da análise
// Thought: Com base na análise, posso responder
// Final Answer: A resposta baseada nos dados é...
```

### Modo Custom
```typescript
// Template completamente customizado
const customPrompt = PromptBuilder.build({
  mode: 'custom',
  template: `
    Contexto: {context}
    Pergunta: {question}
    
    Por favor, forneça:
    1. Uma explicação detalhada
    2. Exemplos práticos
    3. Possíveis aplicações
    
    Resposta:
  `,
  variables: {
    context: 'Inteligência Artificial',
    question: 'Como funciona o aprendizado de máquina?'
  }
});
```

## Integração com Outros Módulos

### Memory
Integração com histórico de conversas:
```typescript
import { PromptBuilder } from './promptBuilder';
import { ChatHistoryManager } from '../memory';

const history = new ChatHistoryManager();
const messages = await history.getMessages();

const prompt = PromptBuilder.build({
  mode: 'chat',
  messages,
  context: {
    conversationId: history.getSessionId(),
    messageCount: messages.length
  }
});
```

### Tools
Integração com ferramentas:
```typescript
import { PromptBuilder } from './promptBuilder';
import { SearchTool, CalculatorTool } from '../tools';

const tools = [new SearchTool(), new CalculatorTool()];
const toolSchemas = tools.map(tool => tool.getSchema());

const prompt = PromptBuilder.build({
  mode: 'react',
  messages: [{ role: 'user', content: 'Pesquise e calcule...' }],
  tools: toolSchemas
});
```

### Agents
Uso em agentes:
```typescript
import { PromptBuilder } from './promptBuilder';

class MeuAgente {
  constructor(private config: IAgentConfig) {}
  
  async execute(messages, options) {
    const prompt = PromptBuilder.build({
      mode: this.config.mode || 'chat',
      messages,
      agentInfo: this.config.agentInfo,
      tools: this.config.tools,
      context: options.context
    });
    
    return await this.llm.invoke({ messages: prompt });
  }
}
```

## Configurações Avançadas

### Templates Customizados por Modo
```typescript
import { PromptBuilder } from './promptBuilder';

// Template customizado para modo chat
PromptBuilder.registerTemplate('chat', 'custom-chat', `
  System: {systemPrompt}
  Agent: Você é {agentName}, {agentGoal}
  Context: {context}
  History: {conversationHistory}
  User: {userMessage}
`);

// Usar template customizado
const prompt = PromptBuilder.build({
  mode: 'chat',
  template: 'custom-chat',
  variables: {
    systemPrompt: 'Seja prestativo',
    agentName: 'Assistente',
    agentGoal: 'ajudar usuários',
    context: 'suporte técnico',
    conversationHistory: history.map(m => `${m.role}: ${m.content}`).join('\n'),
    userMessage: 'Meu computador não liga'
  }
});
```

### Multi-idioma
```typescript
import { PromptBuilder } from './promptBuilder';

const multiLangPrompt = PromptBuilder.build({
  mode: 'chat',
  messages,
  agentInfo,
  context: {
    language: 'pt-BR',
    region: 'Brasil',
    culturalContext: 'formal'
  },
  localization: {
    language: 'pt-BR',
    templates: {
      system: 'Você é um assistente prestativo que responde em português do Brasil.',
      greeting: 'Olá! Como posso ajudar você hoje?'
    }
  }
});
```

### Validação Avançada
```typescript
import { PromptBuilder } from './promptBuilder';

const strictValidation = {
  maxLength: 8000,
  minSections: 3,
  requiredFields: ['system', 'user', 'context'],
  forbiddenPatterns: [
    /senha|password/i,
    /cpf|rg|ssn/i
  ],
  contentFilters: [
    (content) => !content.includes('informação sensível'),
    (content) => content.length > 10
  ]
};

const isValid = PromptBuilder.validatePrompt(prompt, strictValidation);
```

## Performance e Otimização

### Cache de Templates
```typescript
import { PromptBuilder } from './promptBuilder';

// Habilitar cache de templates
PromptBuilder.enableTemplateCache({
  maxSize: 100,      // Cache até 100 templates
  ttl: 3600000      // TTL de 1 hora
});

// Templates serão cacheados automaticamente
const prompt1 = PromptBuilder.build({ mode: 'chat', messages, template: 'custom' });
const prompt2 = PromptBuilder.build({ mode: 'chat', messages, template: 'custom' }); // Usa cache
```

### Otimização de Tokens
```typescript
import { PromptBuilder } from './promptBuilder';

const optimizedPrompt = PromptBuilder.build({
  mode: 'react',
  messages,
  tools,
  agentInfo,
  optimization: {
    removeRedundancy: true,
    compressSystemPrompt: true,
    prioritizeRecentContext: true,
    tokenLimit: 4000
  }
});
```

## Tratamento de Erros

### Erros Comuns
```typescript
import { PromptBuilder } from './promptBuilder';

try {
  const prompt = PromptBuilder.build({
    mode: 'invalid-mode', // Modo inválido
    messages: []
  });
} catch (error) {
  switch (error.name) {
    case 'InvalidModeError':
      console.error('Modo de prompt inválido');
      break;
    case 'ValidationError':
      console.error('Validação falhou:', error.details);
      break;
    case 'TemplateError':
      console.error('Erro no template:', error.message);
      break;
    case 'MissingVariableError':
      console.error('Variável ausente:', error.variable);
      break;
    default:
      console.error('Erro desconhecido:', error);
  }
}
```

## Documentação Adicional

- [API Reference](../../docs/api/modules/promptBuilder.md)
- [Exemplos de Templates](../../examples/promptBuilder/)
- [Guia de Modos de Prompt](./modes.md)
- [Integração com Agentes](../agents/README.md)

## Notas Importantes

1. **Modos Predefinidos**: Use 'chat' para conversas e 'react' para agentes com ferramentas
2. **Templates Customizados**: Registre templates reutilizáveis para consistência
3. **Validação**: Sempre valide prompts complexos antes de usar
4. **Performance**: Use cache para templates frequentemente usados
5. **Tokens**: Monitore uso de tokens em prompts longos
6. **Contexto**: Forneça contexto relevante mas conciso
7. **Ferramentas**: No modo react, certifique-se de que as ferramentas estejam bem documentadas
8. **Teste**: Teste prompts com diferentes entradas antes de deploy