# Interface: IAgentConfig

Configuração base para todos os agentes do sistema.

Esta interface define todos os parâmetros necessários para configurar
um agente de IA, incluindo informações do modelo, ferramentas,
configurações de memória e parâmetros customizados.

## Estrutura da Configuração

- **Identificação**: type, provider, model para especificar o agente
- **Personalização**: agentInfo, additionalInstructions para comportamento
- **Ferramentas**: tools para capacidades estendidas
- **LLM**: llmConfig para controle fino do modelo
- **Memória**: memoryConfig para gerenciamento de contexto
- **Customização**: customConfig para extensibilidade

**`Example`**

```typescript
// Configuração básica para agente de chat
const chatConfig: IAgentConfig = {
  type: 'chat',
  provider: 'openai',
  model: 'gpt-4',
  agentInfo: {
    name: 'Assistente Virtual',
    role: 'Assistente prestativo',
    backstory: 'Sou um assistente virtual designed para ajudar usuários'
  },
  llmConfig: {
    temperature: 0.7,
    maxTokens: 1000
  }
};

// Configuração avançada para agente ReAct
const reactConfig: IAgentConfig = {
  type: 'react',
  provider: 'openaiCompatible',
  model: 'claude-3-sonnet',
  agentInfo: {
    name: 'Agente de Pesquisa',
    role: 'Pesquisador especializado',
    backstory: 'Especializado em encontrar informações precisas e atualizadas'
  },
  tools: [searchTool, calculatorTool, webScraperTool],
  llmConfig: {
    temperature: 0.3,
    topP: 0.9,
    maxTokens: 2000
  },
  memoryConfig: {
    maxContextTokens: 16384,
    preserveSystemPrompt: true,
    maxMessages: 50
  },
  customConfig: {
    researchDepth: 'comprehensive',
    citationStyle: 'apa'
  }
};
```

**`See`**

 - [AgentInfo](AgentInfo.md) Para informações do agente
 - [ToolSchema](../README.md#toolschema) Para definição de ferramentas
 - [DEFAULT_AGENT_CONFIG](../README.md#default_agent_config) Para configuração padrão
 - [validateAgentConfig](../README.md#validateagentconfig) Para validação de configuração

## Table of contents

### Properties

- [additionalInstructions](IAgentConfig.md#additionalinstructions)
- [agentInfo](IAgentConfig.md#agentinfo)
- [customConfig](IAgentConfig.md#customconfig)
- [llmConfig](IAgentConfig.md#llmconfig)
- [memoryConfig](IAgentConfig.md#memoryconfig)
- [model](IAgentConfig.md#model)
- [provider](IAgentConfig.md#provider)
- [tools](IAgentConfig.md#tools)
- [type](IAgentConfig.md#type)

## Properties

### additionalInstructions

• `Optional` **additionalInstructions**: `string`

Instruções adicionais para o agente.

Texto livre que será adicionado ao prompt do sistema para
personalizar comportamento específico. Útil para casos
especiais ou ajustes temporários.

**`Example`**

```typescript
additionalInstructions: 'Sempre responda em português brasileiro'
additionalInstructions: 'Use exemplos práticos e evite jargões técnicos'
additionalInstructions: 'Foque em soluções sustentáveis e econômicas'
```

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:170](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L170)

___

### agentInfo

• **agentInfo**: [`AgentInfo`](AgentInfo.md)

Informações do agente para compor o system prompt.

Dados estruturados que definem a identidade, papel e
comportamento do agente. Usados para construir prompts
personalizados e consistentes.

**`Example`**

```typescript
agentInfo: {
  name: 'Assistente de Código',
  role: 'Especialista em desenvolvimento de software',
  backstory: 'Tenho 10 anos de experiência em TypeScript e Node.js'
}
```

**`See`**

[AgentInfo](AgentInfo.md) Para formato completo das informações

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:154](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L154)

___

### customConfig

• `Optional` **customConfig**: `Record`\<`string`, `any`\>

Configurações customizadas específicas do agente.

Objeto flexível para parâmetros específicos que não
se encaixam nas categorias padrão. Permite extensibilidade
sem quebrar a interface principal.

**`Example`**

```typescript
customConfig: {
  // Configurações de pesquisa
  researchDepth: 'comprehensive',
  citationStyle: 'apa',
  
  // Configurações de código
  preferredLanguage: 'TypeScript',
  codeStyle: 'functional',
  
  // Configurações de domínio
  domain: 'healthcare',
  complianceLevel: 'strict',
  
  // Configurações de UI
  responseFormat: 'markdown',
  includeExamples: true
}
```

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:372](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L372)

___

### llmConfig

• `Optional` **llmConfig**: `Object`

Configurações específicas do modelo de linguagem.

Parâmetros que controlam o comportamento do LLM durante
a geração de texto, permitindo ajuste fino para diferentes
casos de uso.

**`Example`**

```typescript
llmConfig: {
  temperature: 0.7,    // Criatividade
  topP: 0.9,          // Diversidade vocabular
  maxTokens: 2000,    // Limite de resposta
  baseUrl: 'https://api.openai.com/v1'  // URL customizada
}
```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseUrl?` | `string` | URL base para provedores compatíveis. Permite usar APIs customizadas ou provedores compatíveis com OpenAI. Útil para: - APIs self-hosted - Provedores regionais - Ambientes corporativos **`Example`** ```typescript baseUrl: 'https://api.openai.com/v1' // OpenAI oficial baseUrl: 'https://api.anthropic.com' // Anthropic baseUrl: 'http://localhost:8000/v1' // Local ``` |
| `maxTokens?` | `number` | Máximo de tokens de saída. Limita o tamanho da resposta gerada: - **100-500**: Respostas curtas e diretas - **500-2000**: Respostas médias e detalhadas **2000+**: Respostas longas e abrangentes **`Example`** ```typescript maxTokens: 100 // Resposta muito concisa maxTokens: 1000 // Resposta padrão maxTokens: 4000 // Resposta detalhada ``` |
| `temperature?` | `number` | Temperatura do modelo (0.0 a 2.0). Controla criatividade e aleatoriedade: - **0.0-0.3**: Respostas mais determinísticas (tarefas técnicas) - **0.4-0.7**: Equilíbrio (conversas gerais) - **0.8-2.0**: Mais criativas (tarefas criativas) **`Example`** ```typescript temperature: 0.1 // Para cálculos precisos temperature: 0.7 // Para conversas naturais temperature: 1.2 // Para brainstorming ``` |
| `topP?` | `number` | Núcleo de sampling (0.0 a 1.0). Controla diversidade do vocabulário usado: - **0.1**: Vocabulário restrito, respostas previsíveis - **0.5**: Equilíbrio entre previsibilidade e diversidade - **0.9-1.0**: Vocabulário amplo, máxima diversidade Geralmente usado em conjunto com temperature. **`Example`** ```typescript topP: 0.1 // Respostas conservadoras topP: 0.9 // Respostas diversificadas ``` |

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:208](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L208)

___

### memoryConfig

• `Optional` **memoryConfig**: `Object`

Configurações de gerenciamento de memória/contexto.

Parâmetros que controlam como o agente gerencia o histórico
de conversas e mantém contexto ao longo da sessão.

**`Example`**

```typescript
memoryConfig: {
  maxContextTokens: 8192,      // Limite de tokens de contexto
  preserveSystemPrompt: true,  // Manter prompt do sistema
  maxMessages: 100             // Máximo de mensagens no histórico
}
```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `maxContextTokens?` | `number` | Máximo de tokens de contexto. Limite total de tokens que podem ser mantidos no contexto da conversa. Inclui prompt do sistema, histórico e resposta atual. **`Example`** ```typescript maxContextTokens: 4096 // Contexto limitado maxContextTokens: 8192 // Contexto padrão maxContextTokens: 32768 // Contexto amplo ``` |
| `maxMessages?` | `number` | Limite de mensagens a manter no histórico. Número máximo de mensagens da conversa que serão mantidas no contexto. Mensagens antigas são removidas para respeitar limites de tokens. **`Example`** ```typescript maxMessages: 20 // Histórico curto maxMessages: 100 // Histórico padrão maxMessages: 500 // Histórico longo ``` |
| `preserveSystemPrompt?` | `boolean` | Manter mensagens do system prompt. Se true, o prompt do sistema é sempre incluído no contexto, garantindo comportamento consistente. Se false, pode ser removido para economizar tokens. **`Example`** ```typescript preserveSystemPrompt: true // Sempre incluir (padrão) preserveSystemPrompt: false // Otimizar tokens ``` |

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:295](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L295)

___

### model

• **model**: `string`

Modelo específico do LLM a ser utilizado.

Nome do modelo conforme suportado pelo provedor:
- OpenAI: 'gpt-4', 'gpt-3.5-turbo'
- Anthropic: 'claude-3-opus', 'claude-3-sonnet'
- Outros: conforme documentação do provedor

**`Example`**

```typescript
model: 'gpt-4'              // OpenAI GPT-4
model: 'claude-3-sonnet'    // Anthropic Claude 3 Sonnet
model: 'llama-2-70b'        // Meta Llama 2
```

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:134](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L134)

___

### provider

• **provider**: `string`

Provedor do modelo de linguagem.

Identifica qual provedor LLM será usado:
- **'openai'**: OpenAI GPT models
- **'openaiCompatible'**: APIs compatíveis (Anthropic, Cohere, etc.)
- **string customizado**: Outros provedores suportados

**`Example`**

```typescript
provider: 'openai'              // OpenAI oficial
provider: 'openaiCompatible'    // Anthropic, Cohere, etc.
provider: 'azure-openai'        // Azure OpenAI
provider: 'local-llm'           // Modelos locais
```

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:117](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L117)

___

### tools

• `Optional` **tools**: [`ToolSchema`](../README.md#toolschema)[]

Ferramentas disponíveis para o agente.

Lista de schemas de ferramentas que o agente pode usar
durante a execução. Disponível apenas para agentes que
suportam ferramentas (ex: tipo 'react').

**`Example`**

```typescript
tools: [
  { name: 'calculator', description: 'Realiza cálculos', schema: {...} },
  { name: 'search', description: 'Busca informações', schema: {...} }
]
```

**`See`**

[ToolSchema](../README.md#toolschema) Para formato dos schemas de ferramenta

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:189](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L189)

___

### type

• **type**: `string`

Tipo/categoria do agente.

Define o comportamento e capacidades do agente:
- **'chat'**: Agente conversacional simples
- **'react'**: Agente com reasoning e action (ReAct pattern)
- **string customizado**: Tipos personalizados para agentes específicos

**`Example`**

```typescript
type: 'chat'        // Agente conversacional
type: 'react'       // Agente com ferramentas
type: 'researcher'  // Agente personalizado
```

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:99](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L99)
