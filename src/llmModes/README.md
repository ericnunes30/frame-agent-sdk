# LLM Modes Module

O módulo **LLM Modes** é um componente essencial do framework de construção de agentes de IA que define e implementa diferentes modos de operação para agentes baseados em modelos de linguagem (LLM). Este módulo permite que os agentes se comportem de maneiras distintas dependendo do contexto e dos objetivos da tarefa.

## Visão Geral

Este módulo oferece:

- **Modos padronizados** de interação com LLMs
- **Extensibilidade** para modos personalizados
- **Registro centralizado** de modos disponíveis
- **Integração direta** com o sistema de agentes

## Estrutura do Módulo

```
llmModes/
├── modes/
│   ├── chatMode.ts      # Modo de chat simples
│   ├── reactMode.ts     # Modo ReAct (Reasoning + Action)
│   ├── modeRegistry.ts  # Registro de modos
│   └── index.ts
├── index.ts             # Exportação principal do módulo
└── README.md           # Documentação do módulo
```

## Modos Disponíveis

### 1. CHAT Mode

O modo **CHAT** é projetado para interações diretas e conversacionais simples:

#### Características:
- **Execução de turno único**: Processa uma entrada e retorna uma resposta imediata
- **Conversacional**: Ideal para perguntas diretas e respostas concisas
- **Eficiente**: Baixo consumo de tokens e tempo de processamento
- **Direto**: Sem loops ou chamadas de ferramentas complexas

#### Prompt System:
```markdown
## Modo: Chat

Você é um assistente prestativo e conciso.

Responda de forma direta e clara.
Prefira parágrafos curtos e marcadores quando útil.
Peça esclarecimentos se a solicitação for ambígua.
```

#### Casos de Uso:
- Assistente virtual simples
- Perguntas e respostas diretas
- Consultas de informações básicas
- Interações de suporte inicial

### 2. REACT Mode

O modo **REACT** (Reasoning + Action) implementa o padrão ReAct com Structured Action Protocol (SAP):

#### Características:
- **Loop iterativo**: Reasoning → Action → Observation → Answer
- **Uso de ferramentas**: Integração com ferramentas externas via SAP
- **Reasoning estruturado**: Thought process explícito
- **Controle de fluxo**: Limites de turnos e budget de tokens

#### Prompt System:
```markdown
## Mode: ReAct (Schema Aligned Parsing)

Follow the pattern: Reason → Act → Observe → Answer

STRUCTURE (strict):

When a tool IS required:
Thought: <brief reasoning (1-2 sentences)>
Action: <toolName> = { "parameter": value }

When you are DONE (no more tools needed):
Thought: <brief reasoning (1-2 sentences)>
Action: final_answer = { "answer": "<your answer>" }

IMPORTANT (SAP format):
- All parameters must match the tool class schema exactly
- Include schema validation notes when relevant
- Required parameters are mandatory (marked as required: true)
- Optional parameters use their default values if omitted
- Parameter types are strictly validated (string, number, boolean)
- Use strict JSON with double quotes, no comments, no trailing commas

POLICIES:
- Return exactly one Action per turn when acting
- Do not add any text before 'Action:' when acting
- Do not invent 'Observation:' — it will be provided after tool execution
- Always finish by calling the 'final_answer' tool with the 'answer' field
- Do not use 'Final:'; use the 'final_answer' tool instead
- If you need user information, call 'ask_user' = { "question": string, "details"?: string }

Be concise, factual, and avoid repeating the question.
```

#### Ferramentas Built-in:
- **final_answer**: Finaliza a execução com resposta final
- **ask_user**: Pausa execução e solicita input do usuário

#### Casos de Uso:
- Tarefas complexas que requerem múltiplos passos
- Integração com APIs e sistemas externos
- Processos de reasoning e tomada de decisão
- Workflows automatizados com validações

## Registro de Modos

O sistema utiliza um **registro centralizado** para gerenciar modos disponíveis:

```typescript
// Registro automático de modos
export const AGENT_MODES = {
  CHAT: 'chat',
  REACT: 'react'
} as const;

// Registro de implementações
ModeRegistry.register(AGENT_MODES.CHAT, chatMode);
ModeRegistry.register(AGENT_MODES.REACT, reactMode);
```

## Uso Básico

### Selecionando um Modo

```typescript
import { AGENT_MODES } from '@/llmModes';

const agentConfig = {
  name: 'MyAgent',
  role: 'Assistant',
  mode: AGENT_MODES.CHAT // ou AGENT_MODES.REACT
};
```

### Prompt Builder Integration

```typescript
import { PromptBuilder } from '@/promptBuilder';

const systemPrompt = PromptBuilder.buildSystemPrompt({
  mode: AGENT_MODES.REACT,
  agentInfo: {
    name: 'Researcher',
    role: 'Research Assistant',
    goal: 'Find accurate information'
  }
});
```

## Estrutura de Implementação

### Interface Base

```typescript
interface AgentMode {
  name: string;
  buildSystemPrompt(config: any): string;
  processResponse?(response: string): any;
}
```

### Implementação do Chat Mode

```typescript
export const chatMode: AgentMode = {
  name: 'chat',
  buildSystemPrompt(config) {
    return `
## Modo: Chat

Você é um assistente prestativo e conciso.

Responda de forma direta e clara.
Prefira parágrafos curtos e marcadores quando útil.
Peça esclarecimentos se a solicitação for ambígua.
    `.trim();
  }
};
```

### Implementação do React Mode

```typescript
export const reactMode: AgentMode = {
  name: 'react',
  buildSystemPrompt(config) {
    return `
## Mode: ReAct (Schema Aligned Parsing)

Follow the pattern: Reason → Act → Observe → Answer
// ... restante do prompt
    `.trim();
  }
};
```

## Integração com Agentes

### Configuração do Agente

```typescript
import { AgentLLM } from '@/agent/llm/agentLLM';
import { AGENT_MODES } from '@/llmModes';

const agent = new AgentLLM({
  name: 'Researcher',
  role: 'Research Assistant',
  mode: AGENT_MODES.REACT, // Usa modo ReAct
  tools: [
    // Ferramentas disponíveis para este agente
  ]
});
```

### Processamento de Respostas

```typescript
// O modo é usado automaticamente pelo GraphEngine/templates
const result = await orchestrator.runFlow(
  'Pesquise sobre inteligência artificial', 
  { maxTurns: 5 }
);
```

## Extensibilidade

### Criando Modos Personalizados

```typescript
import { AgentMode } from '@/llmModes/modes';
import { ModeRegistry } from '@/llmModes/modes/modeRegistry';

// Definir novo modo
const customMode: AgentMode = {
  name: 'custom',
  buildSystemPrompt(config) {
    return `
## Custom Mode

Instruções personalizadas para este modo.
    `.trim();
  },
  processResponse(response) {
    // Processamento personalizado da resposta
    return response;
  }
};

// Registrar o modo
ModeRegistry.register('custom', customMode);

// Usar o modo
const AGENT_MODES_EXTENDED = {
  ...AGENT_MODES,
  CUSTOM: 'custom'
};
```

## Melhores Práticas

### 1. Seleção de Modos
- Use **CHAT** para interações simples e diretas
- Use **REACT** para tarefas complexas que requerem ferramentas
- Considere o consumo de tokens e tempo de processamento

### 2. Prompt Engineering
- Mantenha prompts claros e específicos
- Defina estruturas rigorosas para modos complexos
- Inclua exemplos quando apropriado

### 3. Tratamento de Erros
- Implemente fallbacks para modos não reconhecidos
- Valide configurações antes de usar modos
- Monitore performance de diferentes modos

### 4. Performance
- Otimize prompts para reduzir consumo de tokens
- Limite turnos em modos iterativos
- Use caching quando apropriado

## Exemplos Práticos

### Agente de Pesquisa (REACT Mode)

```typescript
const researcherAgent = new AgentLLM({
  name: 'Researcher',
  role: 'Research Assistant',
  mode: AGENT_MODES.REACT,
  tools: [
    // Ferramentas de busca, cálculo, etc.
  ]
});

const result = await researcherAgent.execute(
  'Compare the population of Brazil and Argentina'
);
// O agente usará ferramentas para obter dados e formular resposta
```

### Assistente Virtual (CHAT Mode)

```typescript
const assistantAgent = new AgentLLM({
  name: 'Assistant',
  role: 'Virtual Assistant',
  mode: AGENT_MODES.CHAT
});

const result = await assistantAgent.execute(
  'What time is it in New York?'
);
// Resposta direta e concisa
```

## Comparação de Modos

| Aspecto | CHAT Mode | REACT Mode |
|---------|-----------|------------|
| **Complexidade** | Baixa | Alta |
| **Tokens** | Menos | Mais |
| **Tempo** | Rápido | Mais lento |
| **Ferramentas** | Não | Sim |
| **Casos de Uso** | Simples | Complexos |
| **Reasoning** | Implícito | Explícito |
| **Controle** | Direto | Iterativo |

## Conclusão

O módulo LLM Modes fornece uma abordagem flexível e padronizada para diferentes estilos de interação com modelos de linguagem:

- **CHAT Mode**: Perfeito para interações diretas e eficientes
- **REACT Mode**: Ideal para tarefas complexas com uso de ferramentas
- **Extensibilidade**: Fácil de estender com modos personalizados
- **Integração**: Funciona perfeitamente com o restante do framework

Esta documentação serve como guia completo para utilizar e estender os modos LLM em seus agentes de IA.
