# Frame Agent SDK

Framework leve e robusto para construir agentes (Chat / ReAct) com orquestração por etapas, memória, provedores plugáveis e sistema de gerenciamento de tarefas.


## ✨ Características Principais

### 🎯 Agentes Conversacionais
- **PromptBuilder** com modos registráveis (`react`, `chat`, custom)
- **Orquestração por Steps** com fluxo controlado
- **Memória persistente** com truncamento inteligente de tokens
- **Múltiplos provedores** (OpenAI, compatíveis, custom)

### 🚀 WorkflowOrchestrator (NOVO!)
- **Orquestração avançada** de múltiplos agentes com dependências complexas
- **Execução paralela controlada** quando não há dependências
- **Systemas hierárquicos** com supervisão e delegação automática
- **Grafos de workflow** com condicionais e merges
- **Sistema integrado** combinando grafos e hierarquia adaptativamente
- **Tomada de decisão autônoma** por orquestradores supervisor

### 🛠️ Sistema de Ferramentas (SAP)
- **Schema Aligned Parsing** para validação automática
- **Tool Registry** centralizado com descoberta automática
- **Tool Executor** com tratamento robusto de erros
- **Ferramentas integradas**: Search, AskUser, FinalAnswer

### 📋 Gerenciamento de Tarefas (Planejado)
- **TaskPlannerTool**: Geração automática de planos sequenciais
- **TaskStatusUpdateTool**: Atualização de status de tarefas
- **TaskVerifyTool**: Dashboard de progresso em tempo real
- **TaskStateManager**: Gerenciamento centralizado do estado

### 🏗️ Padrões de Código
- **Early Returns** - Sem `else/else if` aninhados
- **Validações Lineares** - Uma validação por linha
- **Interfaces & Enums** - Tipagem forte (sem `type` aliases)
- **Design Patterns** - Strategy, Factory, Registry
- **Estrutura Consistente** - Imports → Interfaces → Schemas → Classe

## 📦 Estrutura de Módulos

```typescript
// Agentes e modos
import { AgentMode } from 'frame-agent-sdk/agents';

// Cliente LLM
import { LLM } from 'frame-agent-sdk/llm';

// Memória e gerenciamento de contexto
import { ChatHistoryManager } from 'frame-agent-sdk/memory';

// Orquestração por steps
import { StepsOrchestrator } from 'frame-agent-sdk/orchestrators/steps';

// Orquestração avançada de workflows (NOVO!)
import {
  WorkflowOrchestrator,
  FlowBuilder,
  GraphBuilder,
  HierarchyBuilder,
  IntegratedBuilder
} from 'frame-agent-sdk/orchestrators/workflows';

// Construção de prompts
import { PromptBuilder } from 'frame-agent-sdk/promptBuilder';

// Providers e adapters
import { ProviderRegistry } from 'frame-agent-sdk/providers';

// Sistema de ferramentas SAP
import { toolRegistry, ToolBase } from 'frame-agent-sdk/tools';
```

## 🚀 Instalação

### Passo 1: Instalação Básica
```bash
# Clonar repositório
git clone <repository-url>
cd frame-agent-sdk

# Instalar dependências
npm install

# Compilar TypeScript
npm run build
```


## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Configuração Principal
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# Configurações Compatíveis (para exemplos)
OPENAI_COMPATIBLE_API_KEY=your-api-key-here
OPENAI_COMPATIBLE_BASE_URL=https://api.openai.com/v1
OPENAI_COMPATIBLE_MODEL=gpt-4o-mini

# Configurações Opcionais
AGENT_NAME=Assistant
AGENT_GOAL=Ajudar usuários com tarefas complexas
AGENT_BACKSTORY=IA assistente especializada
OPENAI_PROVIDER=openaiCompatible
```

### Configuração Rápida

```typescript
import { LLM, StepsOrchestrator, ChatHistoryManager } from 'frame-agent-sdk';

// Inicializar LLM
const llm = new LLM({
  apiKey: process.env.OPENAI_API_KEY,
  provider: 'openaiCompatible',
  baseUrl: process.env.OPENAI_BASE_URL,
  model: 'gpt-4o-mini'
});

// Inicializar memória
const memory = new ChatHistoryManager({
  maxContextTokens: 8000,
  tokenizer: { estimateTokens: (text) => Math.ceil(text.length / 4) }
});

// Criar orquestrador
const orchestrator = new StepsOrchestrator({
  llm,
  memory,
  tools: toolRegistry,
  mode: 'react'
});
```


## 📚 Exemplos

### Agente ReAct Básico
```typescript
import { LLM, StepsOrchestrator, ChatHistoryManager } from 'frame-agent-sdk';
import { SearchTool, AskUserTool, FinalAnswerTool } from 'frame-agent-sdk/tools';

// Configurar ferramentas
const searchTool = new SearchTool(llm);
const askUserTool = new AskUserTool();
const finalAnswerTool = new FinalAnswerTool();

toolRegistry.register(searchTool);
toolRegistry.register(askUserTool);
toolRegistry.register(finalAnswerTool);

// Executar conversa
const result = await orchestrator.runFlow("Qual é o clima em São Paulo?");
console.log(result.final);
```

### WorkflowOrchestrator - Sequencial (NOVO!)
```typescript
import { WorkflowOrchestrator, WorkflowAgent } from 'frame-agent-sdk/orchestrators/workflows';

// Criar agentes especializados
const researcher = new WorkflowAgent({
  id: 'researcher',
  info: { name: 'Researcher', goal: 'Coletar informações' },
  mode: 'react'
});

const analyst = new WorkflowAgent({
  id: 'analyst',
  info: { name: 'Analyst', goal: 'Analisar dados' },
  mode: 'react'
});

// Criar orquestrador
const orchestrator = new WorkflowOrchestrator({
  deps: { llm, memory }
});

// Executar workflow sequencial
const result = await orchestrator.executeWorkflow([
  researcher, analyst
], "Pesquisar impactos da IA no mercado brasileiro");
```

### WorkflowOrchestrator - Paralelo (NOVO!)
```typescript
import { FlowBuilder, FlowType } from 'frame-agent-sdk/orchestrators/workflows';

const flow = new FlowBuilder()
  .setType(FlowType.PARALLEL)
  .addAgents([marketAnalyst, technicalAnalyst, riskAnalyst])
  .build();

const result = await orchestrator.executeFlow(flow, "Analisar viabilidade de startup");
```

### WorkflowOrchestrator - Hierárquico (NOVO!)
```typescript
import { HierarchyBuilder } from 'frame-agent-sdk/orchestrators/workflows';

const hierarchy = new HierarchyBuilder()
  .addSupervisor(supervisorAgent)
  .addAgent(financialExpert, ['financial-analysis'])
  .addAgent(technicalExpert, ['technical-feasibility'])
  .build();

const result = await orchestrator.executeHierarchy(hierarchy, "Avaliar proposta de investimento");
```


### Tool Personalizada
```typescript
import { ToolBase } from 'frame-agent-sdk/tools';

interface WeatherParams {
  city: string;
}

class WeatherTool extends ToolBase<WeatherParams, string> {
  readonly name = "weatherTool";
  readonly description = "Obtém informações climáticas de uma cidade";
  readonly parameterSchema = WeatherParams;

  async execute(params: WeatherParams): Promise<string> {
    // Implementação da tool
    return `O clima em ${params.city} é ensolarado`;
  }
}

// Registrar tool
toolRegistry.register(new WeatherTool());
```

## 🔌 Providers Disponíveis

### OpenAI Oficial
```typescript
const llm = new LLM({
  provider: 'openai',
  apiKey: 'sk-...',
  model: 'gpt-4'
});
```

### OpenAI Compatible
```typescript
const llm = new LLM({
  provider: 'openaiCompatible',
  apiKey: 'your-key',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat'
});
```

### Provider Customizado
```typescript
import { ProviderAdapter } from 'frame-agent-sdk/providers';

class CustomProvider extends ProviderAdapter {
  async chatCompletion(config) {
    // Implementação customizada
  }
}
```

## 🏗️ Arquitetura

### Estrutura de Diretórios
```
src/
├── agents/           # Modos de agente (chat, react)
├── llm/              # Cliente LLM unificado
├── memory/           # Gerenciamento de memória
├── orchestrators/    # Sistema de orquestração
│   ├── steps/        # Orquestração por steps (básica)
│   └── workflows/    # WorkflowOrchestrator (avançado)
│       ├── core/     # Componentes fundamentais
│       ├── builders/ # Construtores especializados
│       ├── graph/    # Motor de grafos
│       ├── hierarchy/# Sistema hierárquico
│       └── integrated# Sistema integrado
├── promptBuilder/    # Construção de prompts
├── providers/        # Adaptadores de providers
└── tools/            # Sistema de ferramentas SAP
    ├── core/         # Interfaces e executores
    ├── constructor/  # Base para ferramentas
    └── tools/        # Ferramentas concretas
```

### Design Patterns Implementados
- **Strategy**: Diferentes modos de agente
- **Factory**: Criação de ferramentas e providers
- **Registry**: Descoberta e registro automático
- **Adapter**: Interface unificada para providers
- **Builder**: Construção flexível de prompts

## 📋 Tokens: Contexto vs Saída

- **Contexto (histórico)**: O `ChatHistoryManager` aplica truncamento com base em `maxContextTokens` (limite da janela do modelo). O `StepsOrchestrator` usa `memory.getTrimmedHistory()` em cada chamada.
- **Saída (gerada)**: O `LLM` aceita `maxTokens` via `defaults` (no construtor) ou por chamada (`invoke`). Os providers mapeiam para a opção específica (ex.: `max_tokens` na OpenAI).

## 🛠️ Ferramentas Disponíveis

### Ferramentas Integradas
- **SearchTool**: Busca de informações usando LLM
- **AskUserTool**: Solicita input do usuário
- **FinalAnswerTool**: Fornece resposta final

### Sistema de Tarefas (Planejado)
- **TaskPlannerTool**: Cria planos sequenciais automaticamente
- **TaskStatusUpdateTool**: Atualiza status das tarefas
- **TaskVerifyTool**: Dashboard de progresso


## 🔄 Orquestração por Steps

Use `LLMCallStepWithProvider(id, { provider, model, apiKey, baseUrl, ... })` para escolher o provedor por step, sem amarrar ao `.env`.

## 🎯 Boas Práticas

### Padrões de Código
- ✅ Registre modos via `PromptBuilder.addPromptMode` em módulos dedicados
- ✅ Use guards (early returns) e evite `else/else if` para simplificar fluxo
- ✅ Escolha de provider por step usando `StepProviderOptions`
- ✅ Validações lineares - uma condição por linha
- ✅ Interfaces e enums - evite `type` aliases
- ✅ Sem aninhamento de estruturas de controle

### Organização de Arquivos
```
arquivo.ts
├── Imports (externos → internos)
├── Interfaces / Enums
├── Schemas (se aplicável)
└── Classe principal
```

## 📖 Documentação

- [API Reference](docs/api/README.md) - Documentação completa da API
- [Guia de Arquitetura](docs/arquitetura/) - Detalhes da arquitetura
- [Padrões de Projeto](docs/arquitetura/03-padroes-projeto.md) - Padrões implementados
- [TaskTools Guide](TASK_PLANNER_IMPLEMENTATION_PLAN.md) - Sistema de tarefas
- [WorkflowOrchestrator Guide](examples/workflow-orchestrator/README.md) - Guia completo do novo sistema
- [Plan.md](PLAN.md) - Planejamento da implementação do WorkflowOrchestrator

## 🤝 Contribuindo

### Fluxo de Contribuição
1. **Fork** o repositório
2. Criar **branch** (`feat/feature-name` ou `fix/bug-name`)
3. **Instalar dependências**: `npm ci`
4. **Compilar**: `npm run build`
5. **Abrir PR** com descrição objetiva

### Padrões de Commit
```
feat: adicionar nova funcionalidade
fix: corrigir bug específico
docs: atualizar documentação
refactor: refatorar código sem mudança de comportamento
test: adicionar ou corrigir testes
```

### Code Review
- Seguir padrões do [CLAUDE.md](CLAUDE.md)
- Testar todas as funcionalidades
- Manter cobertura de testes
- Documentar APIs públicas

## 🚀 Exemplo Completo de Configuração

### 1. Estrutura Inicial do Projeto
```
meu-projeto/
├── src/
│   └── index.ts
├── logger.config.json    ← ⚠️ ESSENCIAL
├── .env                  ← Configurações do LLM
└── package.json
```

### 2. Configuração Obrigatória do Logging
**logger.config.json**:
```json
{
  "enabled": true,
  "level": "info",
  "timestamp": true,
  "moduleName": true,
  "colors": true
}
```

### 3. Código de Exemplo Completo
**src/index.ts**:
```typescript
import { setupLoggerFromFile, logger } from 'frame-agent-sdk/utils';
import { LLM, StepsOrchestrator, ChatHistoryManager } from 'frame-agent-sdk';

// ⚠️ PASSO OBRIGATÓRIO: Configurar logging
setupLoggerFromFile();

// Agora você pode usar o logger
logger.info('Iniciando aplicação', 'Main');

// Configurar LLM
const llm = new LLM({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini'
});

// Configurar memória
const memory = new ChatHistoryManager({
  maxContextTokens: 8000,
  tokenizer: { estimateTokens: (text) => Math.ceil(text.length / 4) }
});

// Criar orquestrador
const orchestrator = new StepsOrchestrator({
  llm,
  memory,
  mode: 'react'
});

// Executar agente
const result = await orchestrator.runFlow("Qual é o clima em São Paulo?");
logger.info('Resposta recebida', 'Main');
console.log(result.final);
```


### ⚠️ Erros Comuns

## 📄 Licença

[MIT License](LICENSE) - Ver arquivo LICENSE para detalhes.

## 🔗 Links Úteis

- [Repositório](https://github.com/your-repo/frame-agent-sdk)
- [Issues](https://github.com/your-repo/frame-agent-sdk/issues)
- [Discussões](https://github.com/your-repo/frame-agent-sdk/discussions)
- [Documentação Online](https://your-docs-site.com)

---

**Frame Agent SDK** - Construa agentes inteligentes com simplicidade e robustez 🚀