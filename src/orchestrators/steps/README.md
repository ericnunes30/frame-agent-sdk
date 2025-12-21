# Steps Orchestrator

O **StepsOrchestrator** é um componente fundamental do **framework de construção de agentes de IA** que implementa um sistema de orquestração sequencial mais simples e direto comparado ao GraphEngine. Ele é projetado para ser integrado em aplicações que necessitam de agentes de IA com execução de fluxos sequenciais e suporte a diferentes modos de operação.

## Visão Geral

O StepsOrchestrator oferece uma abordagem mais linear e previsível para construção de agentes de IA, sendo ideal para integração em aplicações que necessitam de:

- **Workflows Lineares**: Processos que seguem uma sequência fixa
- **Formulários Multi-Step**: Coleta de informações em etapas
- **Pipelines Simples**: Processamento linear de dados
- **Agentes Conversacionais**: Chatbots com fluxos estruturados
- **Automação Básica**: Tarefas automatizadas sequenciais

Como um **framework de construção**, ele fornece as peças fundamentais para que desenvolvedores criem seus próprios agentes de IA personalizados.

## Arquitetura

### Componentes Principais

```typescript
interface StepsDeps {
  memory: ChatHistoryManager;     // Gerenciamento de memória/contexto
  llm: AgentLLM;                  // Interface com modelo de linguagem
  tools?: Tool[];                 // Ferramentas disponíveis (opcional)
}

interface StepsConfig {
  mode: AgentMode;                // Modo de operação (CHAT/REACT)
  agentInfo: AgentInfo;           // Informações do agente
  taskList?: TaskList;            // Lista de tarefas (opcional)
}
```

### Modos de Operação

#### 1. Modo CHAT
- **Execução**: Turno único com LLM
- **Fluxo**: Input → System Prompt → LLM → Output
- **Uso**: Conversas simples, perguntas diretas, respostas imediatas
- **Memória**: Adiciona input do usuário e output do assistente ao histórico

#### 2. Modo REACT
- **Execução**: Loop iterativo com reasoning, action e observation
- **Fluxo**: Input → Thought → Action → Observation → (repeat)
- **Uso**: Tarefas complexas, uso de ferramentas, reasoning passo a passo
- **SAP**: Suporte a Structured Action Protocol para ferramentas
- **Limite**: Máximo de turnos configurável (padrão: 8)

## Uso Básico

### Instalação e Configuração

```typescript
import { StepsOrchestrator } from '@/orchestrators/steps/stepsOrchestrator';
import { createChatMemory } from '@/memory';
import { AgentLLM } from '@/agent/llm/agentLLM';
import { AGENT_MODES } from '@/llmModes';

// Como framework de construção, você configura as dependências
const deps: StepsDeps = {
  memory: createChatMemory({ maxContextTokens: 4000 }),
  llm: new AgentLLM({ model: 'gpt-4', apiKey: '...' }),
  tools: [] // Ferramentas disponíveis para seus agentes
};

// Configura o orquestrador para seus agentes
const config: StepsConfig = {
  mode: AGENT_MODES.CHAT, // ou AGENT_MODES.REACT
  agentInfo: {
    name: 'Assistant',
    role: 'Helpful assistant',
    backstory: 'Friendly and knowledgeable'
  }
};

// Cria instância do orquestrador para usar em sua aplicação
const orchestrator = new StepsOrchestrator(deps, config);
```

### Execução de Fluxos

#### Modo CHAT - Conversa Simples

```typescript
// Como framework, você integra o orquestrador em sua aplicação
const result = await orchestrator.runFlow('Olá, como você está?');
console.log('Resposta do agente:', result.final);

// Use o resultado em sua aplicação
return res.json({ agentResponse: result.final });
```

#### Modo REACT - Com Ferramentas

```typescript
// Executar fluxo com ferramentas em sua aplicação
const reactResult = await orchestrator.runFlow(
  'Preciso calcular 15% de 200 e depois pesquisar sobre o resultado',
  { maxTurns: 10 }
);

console.log('Resultado final do agente:', reactResult.final);
console.log('Steps executados:', reactResult.state.data?.steps);

// Verificar se há pergunta pendente para sua aplicação
if (reactResult.pendingAskUser) {
  console.log('Pergunta pendente:', reactResult.pendingAskUser.question);
  
  // Sua aplicação pode pausar e solicitar input do usuário
  return res.json({ 
    requiresUserInput: true, 
    question: reactResult.pendingAskUser 
  });
}
```

### Execução de Steps Customizados

```typescript
// Como framework, você define steps customizados para seus agentes
const steps: Step[] = [
  {
    id: 'collect-info',
    name: 'Coletar Informações',
    run: async (ctx) => {
      const userData = ctx.state.data.userInfo || {};
      return {
        data: { userInfo: { ...userData, step: 'collect-info' } },
        next: 'validate-info'
      };
    }
  },
  {
    id: 'validate-info',
    name: 'Validar Informações',
    run: async (ctx) => {
      const isValid = ctx.state.data.userInfo?.step === 'collect-info';
      return {
        data: { validated: isValid },
        final: isValid ? 'Informações válidas!' : 'Dados inválidos!'
      };
    }
  }
];

// Executar fluxo de steps em sua aplicação
const result = await orchestrator.run(steps, 'Preciso de ajuda');
console.log('Resultado do agente:', result.final);
console.log('Estado final:', result.state);

// Integre o resultado em sua aplicação
return processAgentResult(result);
```

### Step de Subfluxo

O `createStepSubflow` executa um subfluxo registrado e aplica automaticamente o `SharedPatch` em `state.data.shared`.

```typescript
import { createStepSubflow, stepFinalize } from '@/orchestrators/steps';
import { FlowRegistryImpl, FlowRunnerImpl } from '@/flows';

const registry = new FlowRegistryImpl();
const runner = new FlowRunnerImpl(registry);

const steps: Step[] = [
  createStepSubflow('subflow', { runner, flowId: 'meu-subfluxo' }),
  stepFinalize('final', 'shared')
];
```

## Structured Action Protocol (SAP)

O modo REACT utiliza SAP para comunicação estruturada com ferramentas:

```json
{
  "toolName": "nome_da_ferramenta",
  "params": {
    "param1": "valor1",
    "param2": "valor2"
  }
}
```

### Ferramentas Built-in

#### final_answer
Finaliza a execução com resposta final:

```json
{
  "toolName": "final_answer",
  "params": {
    "answer": "Esta é a resposta final da tarefa"
  }
}
```

#### ask_user
Pausa execução e solicita input do usuário:

```json
{
  "toolName": "ask_user",
  "params": {
    "question": "Qual é o seu nome?",
    "details": "Preciso saber para personalizar a resposta"
  }
}
```

## Controle de Fluxo

### Execução Sequencial
Por padrão, o orquestrador executa steps em ordem (0, 1, 2, ...).

### Saltos Controlados
Steps podem definir `res.next` para pular para step específico:

```typescript
{
  id: 'step1',
  run: async (ctx) => {
    return {
      next: 'step3' // Pula para step3
    };
  }
}
```

### Interrupção
Steps podem definir `res.halt` para parar execução:

```typescript
{
  id: 'step1',
  run: async (ctx) => {
    return {
      halt: true // Para execução
    };
  }
}
```

## Gerenciamento de Estado

O orquestrador mantém um estado persistente entre steps:

```typescript
interface OrchestrationState {
  data: Record<string, any>;        // Dados persistentes
  final?: string;                   // Resultado final
  lastModelOutput?: string | null;  // Último output do modelo
}
```

### Atualização de Estado

```typescript
// Em um step
return {
  data: { 
    userInfo: { name: 'João', age: 30 },
    processed: true 
  },
  final: 'Processamento concluído!'
};
```

## Tratamento de Erros

### Budget de Tokens
O orquestrador para automaticamente se o orçamento de tokens estiver esgotado:

```typescript
// Verificação automática
if (this.deps.memory.getRemainingBudget() <= 0) {
  state.final = state.final ?? undefined;
  break;
}
```

### Hints Automáticos
Para erros de formato SAP, hints automáticos são fornecidos:

```typescript
if (detection.error && detection.error.llmHint) {
  this.deps.memory.addMessage({ 
    role: 'system', 
    content: detection.error.llmHint 
  });
}
```

## Integração com Ferramentas

### Detecção Automática
O StepsOrchestrator integra com `ToolDetector` para parsing automático de SAP:

```typescript
const detection = ToolDetector.detect(text);

if (detection.success) {
  const call = detection.toolCall!;
  // Executar ferramenta...
}
```

### Execução de Ferramentas
Utiliza `ToolExecutor` para execução de ferramentas:

```typescript
const toolResult = await ToolExecutor.execute({ 
  toolName, 
  params: call.params 
});

const observation = toolResult.observation;
const toolMetadata = toolResult.metadata;
```

## Melhores Práticas para Desenvolvimento com o Framework

### 1. Definição de Steps
- Use IDs únicos e descritivos para steps
- Mantenha lógica simples e focada por step
- Documente claramente o propósito de cada step
- Reutilize steps comuns entre diferentes agentes

### 2. Gerenciamento de Estado
- Use `state.data` para dados persistentes entre steps
- Evite mutações diretas, sempre crie novos objetos
- Limpe dados desnecessários para economizar tokens
- Organize dados por contexto (user, system, agent, etc.)

### 3. Controle de Fluxo
- Use `next` para saltos condicionais entre steps
- Defina `halt` para interrupções claras
- Evite loops infinitos com verificações adequadas
- Implemente fallbacks para casos de erro

### 4. Tratamento de Erros
- Sempre trate casos de erro em steps customizados
- Use hints informativos para o LLM quando necessário
- Monitore budget de tokens em fluxos longos
- Implemente logging adequado para debugging

### 5. Performance e Integração
- Configure `maxTurns` adequadamente para modo REACT
- Use memória eficiente para contextos longos
- Limpe histórico desnecessário periodicamente
- Integre com sistemas de cache quando apropriado
- Considere pooling de instâncias do orquestrador

## Exemplos Avançados de Integração

### Formulário Multi-Step com Validação

```typescript
// Como framework, você cria agentes para formulários específicos
const createFormAgent = (orchestrator: StepsOrchestrator) => {
  const formSteps: Step[] = [
    {
      id: 'collect-name',
      name: 'Coletar Nome',
      run: async (ctx) => {
        const name = ctx.state.data.name;
        if (!name || name.length < 2) {
          return {
            data: { error: 'Nome deve ter pelo menos 2 caracteres' },
            next: 'collect-name' // Repete step
          };
        }
        return { next: 'collect-email' };
      }
    },
    {
      id: 'collect-email',
      name: 'Coletar Email',
      run: async (ctx) => {
        const email = ctx.state.data.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          return {
            data: { error: 'Email inválido' },
            next: 'collect-email'
          };
        }
        return { next: 'confirm-data' };
      }
    },
    {
      id: 'confirm-data',
      name: 'Confirmar Dados',
      run: async (ctx) => {
        return {
          final: `Dados confirmados: ${ctx.state.data.name} - ${ctx.state.data.email}`
        };
      }
    }
  ];

  return {
    async processForm(userInput: string) {
      return await orchestrator.run(formSteps, userInput);
    }
  };
};

// Uso em sua aplicação
const formAgent = createFormAgent(orchestrator);
const result = await formAgent.processForm('João Silva - joao@email.com');
```

### Pipeline de Processamento de Dados

```typescript
// Framework para criar agentes de processamento de dados
const createDataProcessingAgent = (orchestrator: StepsOrchestrator) => {
  const dataPipeline: Step[] = [
    {
      id: 'load-data',
      name: 'Carregar Dados',
      run: async (ctx) => {
        // Sua lógica de carregamento de dados
        const data = await yourDataLoader.load();
        return { data: { rawData: data } };
      }
    },
    {
      id: 'transform-data',
      name: 'Transformar Dados',
      run: async (ctx) => {
        const transformed = ctx.state.data.rawData.map(item => ({
          ...item,
          processed: true,
          timestamp: new Date().toISOString()
        }));
        return { data: { transformedData: transformed } };
      }
    },
    {
      id: 'validate-data',
      name: 'Validar Dados',
      run: async (ctx) => {
        const errors = yourValidator.validate(ctx.state.data.transformedData);
        if (errors.length > 0) {
          return {
            data: { validationErrors: errors },
            next: 'load-data' // Volta para recarregar
          };
        }
        return { next: 'save-data' };
      }
    },
    {
      id: 'save-data',
      name: 'Salvar Dados',
      run: async (ctx) => {
        await yourDataSaver.save(ctx.state.data.transformedData);
        return {
          final: `Processamento concluído! ${ctx.state.data.transformedData.length} registros salvos.`
        };
      }
    }
  ];

  return {
    async processData(input: string) {
      return await orchestrator.run(dataPipeline, input);
    }
  };
};

// Uso em sua aplicação
const dataAgent = createDataProcessingAgent(orchestrator);
const result = await dataAgent.processData('Processar arquivo de vendas');
```

## Comparação com GraphEngine

| Aspecto | StepsOrchestrator | GraphEngine |
|---------|------------------|-------------|
| **Complexidade** | Simples, linear | Complexo, baseado em grafos |
| **Casos de Uso** | Fluxos sequenciais | Workflows complexos com ramificações |
| **Performance** | Mais rápido | Mais lento devido à complexidade |
| **Manutenibilidade** | Fácil de entender | Requer conhecimento de grafos |
| **Flexibilidade** | Limitada a sequências | Alta, com ramificações e loops |
| **Debugging** | Simples, linear | Complexo, requer visualização de grafo |

## Conclusão

O StepsOrchestrator é um **framework poderoso e simples** para desenvolvedores que precisam criar agentes de IA com execução sequencial de tarefas. Como parte do framework de construção de agentes, ele fornece as peças fundamentais necessárias para implementar fluxos de agente eficientes em suas aplicações.

### Vantagens do Framework

- **Simplicidade**: API clara e direta para construção de agentes
- **Flexibilidade**: Suporte a diferentes modos de operação (CHAT/REACT)
- **Extensibilidade**: Fácil integração com ferramentas customizadas
- **Performance**: Execução otimizada para casos de uso lineares
- **Manutenibilidade**: Código bem documentado e estruturado

### Quando Usar

- **Aplicações que precisam de agentes simples**: Chatbots, assistentes básicos
- **Workflows lineares**: Processos que seguem uma sequência fixa
- **Prototipagem rápida**: Desenvolvimento ágil de agentes de IA
- **Integração em sistemas existentes**: Como biblioteca reutilizável

Para casos de uso mais complexos com ramificações, loops e workflows dinâmicos, considere usar o **GraphEngine** como alternativa mais robusta dentro do mesmo framework.
