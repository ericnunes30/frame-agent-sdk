# Módulo Tools

## Propósito
Sistema completo de ferramentas para LLMs e agentes, incluindo construção, validação, execução e gerenciamento de ferramentas com suporte a schemas dinâmicos, validação de parâmetros e integração com diferentes provedores.

## Estrutura
```
tools/
├── constructor/          # Construtores de ferramentas
│   ├── sapParser.ts     # Parser para SAP/ERP
│   ├── schemaGenerator.ts # Gerador de schemas JSON
│   ├── toolBase.ts      # Classe base para ferramentas
│   └── index.ts         # Exportações
├── core/                # Núcleo do sistema de ferramentas
│   ├── interfaces.ts    # Interfaces e tipos principais
│   ├── toolExecutor.ts  # Executor de ferramentas
│   ├── toolRegistry.ts  # Registro de ferramentas
│   ├── toolValidator.ts # Validador de ferramentas
│   └── index.ts         # Exportações
├── tools/               # Ferramentas prontas para uso
│   ├── askUserTool.ts   # Ferramenta para perguntar ao usuário
│   ├── finalAnswerTool.ts # Ferramenta para resposta final
│   ├── searchTool.ts    # Ferramenta de busca
│   ├── approvalTool.ts  # Ferramenta de aprovação
│   └── index.ts         # Exportações
└── index.ts            # Exportações principais
```

## Principais Componentes

### ToolBase
- **Localização**: [`constructor/toolBase.ts`](constructor/toolBase.ts)
- **Função**: Classe base abstrata para todas as ferramentas
- **Características**:
  - Estrutura padronizada para ferramentas
  - Validação automática de parâmetros
  - Geração de schemas JSON
  - Tratamento de erros unificado

### ToolExecutor
- **Localização**: [`core/toolExecutor.ts`](core/toolExecutor.ts)
- **Função**: Executor centralizado de ferramentas
- **Características**:
  - Execução síncrona e assíncrona
  - Tratamento de erros robusto
  - Logging e monitoramento
  - Suporte a diferentes tipos de ferramentas

### ToolRegistry
- **Localização**: [`core/toolRegistry.ts`](core/toolRegistry.ts)
- **Função**: Registro centralizado de ferramentas
- **Características**:
  - Registro dinâmico de ferramentas
  - Descoberta de ferramentas
  - Gerenciamento de dependências
  - Validação de schemas

### ToolValidator
- **Localização**: [`core/toolValidator.ts`](core/toolValidator.ts)
- **Função**: Validação de ferramentas e parâmetros
- **Características**:
  - Validação de schemas JSON
  - Validação de tipos
  - Validação de requisitos
  - Geração de relatórios de validação

## Ferramentas Incluídas

### SearchTool
- **Localização**: [`tools/searchTool.ts`](tools/searchTool.ts)
- **Função**: Realizar buscas na web ou bancos de dados
- **Parâmetros**:
  - `query`: Termo de busca
  - `maxResults`: Número máximo de resultados
  - `filters`: Filtros adicionais

### AskUserTool
- **Localização**: [`tools/askUserTool.ts`](tools/askUserTool.ts)
- **Função**: Fazer perguntas ao usuário
- **Parâmetros**:
  - `question`: Pergunta a ser feita
  - `options`: Opções de resposta (se aplicável)
  - `timeout`: Timeout para resposta

### FinalAnswerTool
- **Localização**: [`tools/finalAnswerTool.ts`](tools/finalAnswerTool.ts)
- **Função**: Fornecer resposta final
- **Parâmetros**:
  - `answer`: Resposta final
  - `confidence`: Nível de confiança
  - `sources`: Fontes utilizadas

### ApprovalTool
- **Localização**: [`tools/approvalTool.ts`](tools/approvalTool.ts)
- **Função**: Solicitar aprovação para ações
- **Parâmetros**:
  - `action`: Ação a ser aprovada
  - `reason`: Razão para a ação
  - `urgency`: Nível de urgência

## Exemplos de Uso

### Criando uma Ferramenta Customizada
```typescript
import { ToolBase } from './tools/constructor';
import type { ITool, IToolParams, ToolSchema } from './tools/core';

interface CalculadoraParams extends IToolParams {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  a: number;
  b: number;
}

class CalculadoraTool extends ToolBase<CalculadoraParams> {
  constructor() {
    super({
      name: 'calculadora',
      description: 'Realiza operações matemáticas básicas',
      version: '1.0.0'
    });
  }

  getSchema(): ToolSchema {
    return {
      name: this.name,
      description: this.description,
      parameters: {
        type: 'object',
        properties: {
          operation: {
            type: 'string',
            enum: ['add', 'subtract', 'multiply', 'divide'],
            description: 'Operação matemática a realizar'
          },
          a: {
            type: 'number',
            description: 'Primeiro número'
          },
          b: {
            type: 'number',
            description: 'Segundo número'
          }
        },
        required: ['operation', 'a', 'b']
      }
    };
  }

  async execute(params: CalculadoraParams): Promise<any> {
    const { operation, a, b } = params;
    
    switch (operation) {
      case 'add':
        return { result: a + b };
      case 'subtract':
        return { result: a - b };
      case 'multiply':
        return { result: a * b };
      case 'divide':
        if (b === 0) {
          throw new Error('Divisão por zero não permitida');
        }
        return { result: a / b };
      default:
        throw new Error(`Operação desconhecida: ${operation}`);
    }
  }

  validate(params: CalculadoraParams): boolean {
    if (!['add', 'subtract', 'multiply', 'divide'].includes(params.operation)) {
      throw new Error('Operação inválida');
    }
    if (typeof params.a !== 'number' || typeof params.b !== 'number') {
      throw new Error('Parâmetros devem ser números');
    }
    return true;
  }
}
```

### Usando Ferramentas com LLM
```typescript
import { ToolExecutor } from './tools/core';
import { SearchTool, CalculatorTool } from './tools';

const tools = [new SearchTool(), new CalculatorTool()];
const executor = new ToolExecutor(tools);

// Executar ferramenta específica
const result = await executor.execute('search', {
  query: 'população de Tóquio 2024',
  maxResults: 1
});

```

### Registro de Ferramentas
```typescript
import { ToolRegistry } from './tools/core';
import { SearchTool, CalculadoraTool } from './tools';

// Registrar ferramentas
ToolRegistry.register(new SearchTool());
ToolRegistry.register(new CalculadoraTool());

// Obter ferramenta registrada
const searchTool = ToolRegistry.get('search');
const calculadoraTool = ToolRegistry.get('calculadora');

// Listar todas as ferramentas
const allTools = ToolRegistry.list();

// Verificar se ferramenta existe
const hasSearch = ToolRegistry.has('search');
```

### Validação de Ferramentas
```typescript
import { ToolValidator } from './tools/core';
import { SearchTool } from './tools';

const tool = new SearchTool();
const validator = new ToolValidator();

// Validar ferramenta completa
const validationResult = validator.validateTool(tool);

// Validar parâmetros específicos
const params = {
  query: 'teste',
  maxResults: 10
};

const paramsValidation = validator.validateParameters(tool, params);

// Gerar relatório de validação
const report = validator.generateReport([tool]);
```

### Uso com Agentes
```typescript
import { ToolExecutor } from './tools/core';
import { SearchTool, CalculatorTool } from './tools';

class MeuAgente {
  private toolExecutor: ToolExecutor;
  
  constructor() {
    const tools = [new SearchTool(), new CalculatorTool()];
    this.toolExecutor = new ToolExecutor(tools);
  }
  
  async execute(messages, options) {
    const tools = this.toolExecutor.getAvailableTools();
    
    const prompt = PromptBuilder.build({
      mode: 'react',
      messages,
      tools: tools.map(tool => tool.getSchema()),
      agentInfo: this.config.agentInfo
    });
    
    const response = await this.llm.invoke({ messages: prompt });
    
    // Se houver chamadas de ferramenta, executá-las
    if (response.tool_calls) {
      for (const toolCall of response.tool_calls) {
        const result = await this.toolExecutor.execute(
          toolCall.name,
          toolCall.arguments
        );
        
        // Adicionar resultado ao contexto
        messages.push({
          role: 'tool',
          content: JSON.stringify(result),
          tool_call_id: toolCall.id
        });
      }
      
      // Obter resposta final
      return await this.llm.invoke({ messages });
    }
    
    return response;
  }
}
```

### Uso com Workflows
```typescript
import { ToolExecutor } from './tools/core';
import { SearchTool } from './tools';

const workflowStep = {
  id: 'search-step',
  execute: async (context) => {
    const executor = new ToolExecutor([new SearchTool()]);
    
    const searchResults = await executor.execute('search', {
      query: context.data.searchQuery,
      maxResults: 5,
      filters: context.data.filters
    });
    
    return {
      searchResults,
      resultCount: searchResults.length
    };
  }
};
```

## SAP Parser (Ferramenta Especializada)

### Visão Geral
- **Localização**: [`constructor/sapParser.ts`](constructor/sapParser.ts)
- **Função**: Parser especializado para dados SAP/ERP
- **Características**:
  - Parsing de estruturas SAP complexas
  - Validação de dados SAP
  - Transformação de formatos
  - Tratamento de erros SAP específicos

### Exemplo de Uso
```typescript
import { SAPParser } from './tools/constructor';

const parser = new SAPParser();

// Parser de dados SAP
const sapData = `
  BEGIN_OF_DATA
    CUSTOMER_ID: 12345
    CUSTOMER_NAME: João Silva
    ORDER_TOTAL: 1500.00
  END_OF_DATA
`;

try {
  const parsedData = parser.parse(sapData);
} catch (error) {
  if (error instanceof SAPParserError) {
    console.error('Erro SAP:', error.message);
    console.error('Linha:', error.line);
    console.error('Coluna:', error.column);
  }
}
```

## Schema Generator

### Visão Geral
- **Localização**: [`constructor/schemaGenerator.ts`](constructor/schemaGenerator.ts)
- **Função**: Gerador automático de schemas JSON para ferramentas
- **Características**:
  - Geração a partir de interfaces TypeScript
  - Suporte a tipos complexos
  - Validação de schemas
  - Documentação automática

### Exemplo de Uso
```typescript
import { SchemaGenerator } from './tools/constructor';

interface MinhaFerramentaParams {
  nome: string;
  idade: number;
  ativo: boolean;
  habilidades: string[];
  endereco?: {
    rua: string;
    cidade: string;
    cep: string;
  };
}

const generator = new SchemaGenerator();
const schema = generator.generateSchema<MinhaFerramentaParams>();

```

## Configurações Avançadas

### Configuração de ToolExecutor
```typescript
import { ToolExecutor } from './tools/core';

const executor = new ToolExecutor(tools, {
  timeout: 30000,        // Timeout de 30 segundos
  maxRetries: 3,         // Máximo 3 tentativas
  retryDelay: 1000,      // 1 segundo entre tentativas
  parallel: true,        // Executar em paralelo quando possível
  maxConcurrency: 5,     // Máximo 5 ferramentas em paralelo
  logging: {
    enabled: true,
    level: 'info',
    includeParams: true,
    includeResults: true
  },
  validation: {
    enabled: true,
    strict: true,
    customValidators: [meuValidadorCustom]
  }
});
```

### Configuração de ToolRegistry
```typescript
import { ToolRegistry } from './tools/core';

ToolRegistry.configure({
  autoDiscover: true,           // Descobrir ferramentas automaticamente
  discoveryPaths: ['./tools'],  // Caminhos para procurar ferramentas
  validation: {
    enabled: true,
    onRegister: true,          // Validar ao registrar
    onUse: true                // Validar ao usar
  },
  caching: {
    enabled: true,
    ttl: 3600000,             // Cache por 1 hora
    maxSize: 100              // Máximo 100 ferramentas em cache
  }
});
```

### Ferramentas Assíncronas com Estado
```typescript
import { ToolBase } from './tools/constructor';

class DatabaseTool extends ToolBase {
  private connection: any;
  
  constructor() {
    super({
      name: 'database',
      description: 'Ferramenta para acesso a banco de dados',
      version: '1.0.0'
    });
  }
  
  async initialize(): Promise<void> {
    this.connection = await connectToDatabase();
  }
  
  async cleanup(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
    }
  }
  
  async execute(params: any): Promise<any> {
    if (!this.connection) {
      throw new Error('Ferramenta não inicializada');
    }
    
    return await this.connection.query(params.query);
  }
}
```

## Tratamento de Erros

### Tipos de Erros
```typescript
import { ToolExecutor } from './tools/core';

try {
  const result = await executor.execute('minha-ferramenta', params);
} catch (error) {
  switch (error.name) {
    case 'ToolNotFoundError':
      console.error('Ferramenta não encontrada');
      break;
    case 'ToolValidationError':
      console.error('Validação falhou:', error.details);
      break;
    case 'ToolExecutionError':
      console.error('Erro durante execução:', error.cause);
      break;
    case 'ToolTimeoutError':
      console.error('Timeout durante execução');
      break;
    case 'ToolPermissionError':
      console.error('Permissão negada');
      break;
    default:
      console.error('Erro desconhecido:', error);
  }
}
```

## Performance e Otimização

### Cache de Resultados
```typescript
import { ToolExecutor } from './tools/core';

const executor = new ToolExecutor(tools, {
  cache: {
    enabled: true,
    ttl: 300000,        // Cache por 5 minutos
    maxSize: 100,       // Máximo 100 resultados em cache
    keyGenerator: (name, params) => {
      return `${name}:${JSON.stringify(params)}`;
    }
  }
});

// Resultados serão cacheados automaticamente
```

### Execução Paralela
```typescript
import { ToolExecutor } from './tools/core';

// Executar múltiplas ferramentas em paralelo
const results = await executor.executeMultiple([
  { name: 'search', params: { query: 'IA' } },
  { name: 'calculator', params: { operation: 'add', a: 10, b: 20 } },
  { name: 'weather', params: { city: 'São Paulo' } }
], {
  parallel: true,
  maxConcurrency: 3
});
```

## Documentação Adicional

- [API Reference](../../docs/api/modules/tools.md)
- [Exemplos de Ferramentas](../../examples/tools/)
- [Guia de Criação de Ferramentas](./creating-tools.md)
- [Integração com Agentes](../agents/README.md)
- [Integração com Workflows](../orchestrators/README.md)

## Notas Importantes

1. **Validação Sempre**: Sempre valide parâmetros antes de executar
2. **Tratamento de Erros**: Implemente tratamento robusto de erros
3. **Documentação**: Documente ferramentas com descrições claras
4. **Performance**: Considere cache para operações custosas
5. **Segurança**: Valide e sanitize entradas do usuário
6. **Timeouts**: Configure timeouts apropriados
7. **Recursos**: Limpe recursos após uso (conexões, arquivos, etc.)
8. **Versionamento**: Use versionamento semântico para ferramentas