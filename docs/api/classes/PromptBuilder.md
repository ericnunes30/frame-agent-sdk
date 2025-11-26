# Class: PromptBuilder

Classe utilitária estática para gerenciar e construir System Prompts
baseados em modo do agente, informações do agente e tools disponíveis.

Esta classe centraliza toda a lógica de construção de prompts estruturados,
oferecendo um sistema flexível e extensível para diferentes tipos de agentes
e estratégias de prompting.

## Funcionalidades Principais

- **Registro de Modos**: Suporte a modos customizados via `addPromptMode()`
- **Construção de Prompts**: Geração automática de System Prompts estruturados
- **Integração com Tools**: Conversão automática de tools para formato LLM
- **Templates Flexíveis**: Sistema de templates reutilizáveis
- **Validação**: Verificação de configurações e modos registrados

## Estrutura do Prompt Gerado

O System Prompt segue uma estrutura otimizada:
1. **Agent Identity**: Nome, objetivo e backstory
2. **Additional Instructions**: Instruções extras (se fornecidas)
3. **Task List**: Lista de tarefas (se fornecida)
4. **Tools**: Ferramentas disponíveis com schemas
5. **Mode Rules**: Regras específicas do modo selecionado

**`Example`**

```typescript
// Registrar modo customizado
PromptBuilder.addPromptMode('code_reviewer', (config) => `
  ## Modo Code Reviewer
  Você é um especialista em revisão de código...
`);

// Construir prompt
const prompt = PromptBuilder.buildSystemPrompt({
  mode: 'code_reviewer',
  agentInfo: { name: 'Revisor', goal: 'Revisar código', backstory: 'Expert...' },
  toolNames: ['code_analyzer', 'test_runner']
});
```

**`See`**

 - [PromptBuilderConfig](../interfaces/PromptBuilderConfig.md) Para configuração completa
 - [PromptMode](../README.md#promptmode) Para modos disponíveis

## Table of contents

### Constructors

- [constructor](PromptBuilder.md#constructor)

### Properties

- [promptModes](PromptBuilder.md#promptmodes)

### Methods

- [addPromptMode](PromptBuilder.md#addpromptmode)
- [buildSystemPrompt](PromptBuilder.md#buildsystemprompt)
- [buildTaskListPrompt](PromptBuilder.md#buildtasklistprompt)
- [buildToolSchemasByNames](PromptBuilder.md#buildtoolschemasbynames)
- [buildToolsPrompt](PromptBuilder.md#buildtoolsprompt)
- [determineSystemPrompt](PromptBuilder.md#determinesystemprompt)

## Constructors

### constructor

• **new PromptBuilder**(): [`PromptBuilder`](PromptBuilder.md)

#### Returns

[`PromptBuilder`](PromptBuilder.md)

## Properties

### promptModes

▪ `Static` `Private` **promptModes**: `Map`\<`string`, (`config`: [`PromptBuilderConfig`](../interfaces/PromptBuilderConfig.md)) => `string`\>

Registry interno de modos de prompt registrados.
Mapeia nomes de modo para funções construtoras de prompt.

#### Defined in

[src/promptBuilder/promptBuilder.ts:60](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.ts#L60)

## Methods

### addPromptMode

▸ **addPromptMode**(`mode`, `builder`): `void`

Registra um novo modo de prompt personalizado no sistema.

Esta função permite estender o sistema com modos customizados de prompting,
cada um com suas próprias regras e estratégias específicas.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | `string` | Nome do modo a ser registrado. Deve ser único e descritivo do comportamento desejado. |
| `builder` | (`config`: [`PromptBuilderConfig`](../interfaces/PromptBuilderConfig.md)) => `string` | Função construtora que retorna o texto específico do modo. Recebe a configuração completa e deve retornar as regras do modo. |

#### Returns

`void`

**`Throws`**

Se o modo já estiver registrado

**`Example`**

```typescript
// Registrar modo de code review
PromptBuilder.addPromptMode('code_reviewer', (config) => `
  ## Modo Code Reviewer
  
  Você é um especialista em revisão de código focado em:
  1. Qualidade e legibilidade
  2. Performance e otimização
  3. Segurança e boas práticas
  4. Manutenibilidade
  
  Sempre forneça sugestões específicas e exemplos práticos.
`);

// Registrar modo de pesquisa
PromptBuilder.addPromptMode('researcher', (config) => `
  ## Modo Pesquisador
  
  Você é um especialista em metodologia de pesquisa:
  1. Sempre valide fontes e informações
  2. Cite fontes confiáveis
  3. Apresente múltiplas perspectivas
  4. Organize informações de forma lógica
`);
```

**`Remarks`**

- Modos registrados ficam disponíveis globalmente
- Pode sobrescrever modos existentes (com warning)
- Use nomes descritivos e únicos
- A função builder recebe toda a configuração do agente

**`See`**

[buildSystemPrompt](PromptBuilder.md#buildsystemprompt) Para usar o modo registrado

#### Defined in

[src/promptBuilder/promptBuilder.ts:111](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.ts#L111)

___

### buildSystemPrompt

▸ **buildSystemPrompt**(`config`): `string`

Constrói o System Prompt completo baseado na configuração fornecida.

Esta é a função principal do PromptBuilder, responsável por gerar um
System Prompt estruturado e otimizado que incorpora todas as informações
do agente, tools disponíveis, instruções adicionais e regras do modo.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`PromptBuilderConfig`](../interfaces/PromptBuilderConfig.md) | Configuração completa do prompt builder. Deve incluir mode, agentInfo e pode incluir tools, instructions, etc. |

#### Returns

`string`

String contendo o System Prompt completo e estruturado.

**`Throws`**

Se o modo especificado não estiver registrado

**`Throws`**

Se agentInfo for inválido ou incompleto

**`Example`**

```typescript
// Configuração básica
const prompt = PromptBuilder.buildSystemPrompt({
  mode: 'chat',
  agentInfo: {
    name: 'Assistente Virtual',
    goal: 'Ajudar usuários com suas perguntas',
    backstory: 'Assistente especializado em fornecer informações precisas'
  }
});

// Configuração avançada com tools e instruções
const advancedPrompt = PromptBuilder.buildSystemPrompt({
  mode: 'react',
  agentInfo: {
    name: 'Agente de Pesquisa',
    goal: 'Realizar pesquisas abrangentes',
    backstory: 'Especialista em metodologia de pesquisa'
  },
  additionalInstructions: 'Sempre cite fontes e valide informações.',
  toolNames: ['web_search', 'data_analyzer'],
  taskList: {
    items: [
      { id: '1', title: 'Definir escopo', status: 'completed' },
      { id: '2', title: 'Coletar dados', status: 'in_progress' }
    ]
  }
});
```

**`Remarks`**

- A estrutura do prompt é otimizada para maximizar atenção do LLM
- Modos devem ser registrados previamente via `addPromptMode()`
- Tools são convertidas automaticamente se fornecidos nomes
- Instruções adicionais são incluídas como seção separada
- Task lists são formatadas para fácil acompanhamento

**`See`**

 - [addPromptMode](PromptBuilder.md#addpromptmode) Para registrar modos customizados
 - [buildToolSchemasByNames](PromptBuilder.md#buildtoolschemasbynames) Para conversão de tools
 - [PromptBuilderConfig](../interfaces/PromptBuilderConfig.md) Para formato da configuração

#### Defined in

[src/promptBuilder/promptBuilder.ts:252](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.ts#L252)

___

### buildTaskListPrompt

▸ **buildTaskListPrompt**(`taskList?`): `string`

Constrói a seção de Task List do System Prompt.

Método privado que formata uma lista de tarefas em uma seção legível
do prompt, permitindo que agentes acompanhem o progresso de workflows
ou processos multi-step diretamente no contexto da conversa.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskList?` | `Object` | Objeto contendo array de itens de tarefa. Se vazio, undefined ou inválido, retorna string vazia. |
| `taskList.items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] | - |

#### Returns

`string`

String formatada contendo a seção de Task List do prompt,
ou string vazia se não houver tarefas para exibir.

**`Example`**

```typescript
const taskList = {
  items: [
    { id: '1', title: 'Analisar requisitos', status: 'completed' },
    { id: '2', title: 'Implementar solução', status: 'in_progress' },
    { id: '3', title: 'Testar implementação', status: 'pending' }
  ]
};

const taskListSection = PromptBuilder.buildTaskListPrompt(taskList);
// Retorna:
// "\n---\n\n## Task List\n\n- [completed] Analisar requisitos (id: 1)\n- [in_progress] Implementar solução (id: 2)\n- [pending] Testar implementação (id: 3)"
```

**`Remarks`**

- Formato: `- [status] title (id: id)`
- Status suportados: 'pending', 'in_progress', 'completed'
- Útil para agentes que gerenciam workflows
- Permite acompanhamento visual do progresso

**`See`**

[PromptBuilderConfig.taskList](../interfaces/PromptBuilderConfig.md#tasklist) Para formato da task list

#### Defined in

[src/promptBuilder/promptBuilder.ts:545](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.ts#L545)

___

### buildToolSchemasByNames

▸ **buildToolSchemasByNames**(`names`): [`ToolSchema`](../README.md#toolschema)[]

Converte nomes de tools registradas em schemas tipados para uso no LLM.

Esta função automatiza o processo de conversão de tools registradas no
ToolRegistry para o formato ToolSchema, gerando schemas de parâmetros
automaticamente e fornecendo fallbacks para tools que falham na geração.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `names` | `string`[] | Array de nomes de ferramentas registradas no toolRegistry. Cada nome deve corresponder a uma tool válida no registry. |

#### Returns

[`ToolSchema`](../README.md#toolschema)[]

Array de ToolSchema prontos para uso no PromptBuilder.
Tools que falham na geração são incluídas com schema vazio.

**`Throws`**

Se o toolRegistry não estiver disponível

**`Example`**

```typescript
// Converter tools específicas
const schemas = PromptBuilder.buildToolSchemasByNames([
  'search',
  'file_create', 
  'terminal',
  'web_scraper'
]);

console.log(schemas);
// [
//   { name: 'search', description: '...', parameterSchema: 'class SearchParams = {...}' },
//   { name: 'file_create', description: '...', parameterSchema: 'class FileCreateParams = {...}' },
//   ...
// ]
```

**`Remarks`**

- Tools não encontradas são ignoradas (com warning no log)
- Falhas na geração de schema resultam em schema vazio
- Útil para preparar tools antes de construir prompts
- Pode ser usado independentemente do buildSystemPrompt

**`See`**

 - [toolRegistry](../README.md#toolregistry) Para registro de tools
 - [generateTypedSchema](../README.md#generatetypedschema) Para geração de schemas
 - [buildSystemPrompt](PromptBuilder.md#buildsystemprompt) Para uso dos schemas gerados

#### Defined in

[src/promptBuilder/promptBuilder.ts:165](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.ts#L165)

___

### buildToolsPrompt

▸ **buildToolsPrompt**(`tools?`): `string`

Constrói a seção de tools do System Prompt em formato otimizado para LLMs.

Método privado que converte ToolSchema[] para uma seção formatada do prompt,
incluindo descrições das tools e schemas de parâmetros em formato SAP
(Schema as Protocol) para otimizar a comunicação com modelos de linguagem.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tools?` | [`ToolSchema`](../README.md#toolschema)[] | Array de ToolSchema a serem incluídas no prompt. Se vazio ou undefined, retorna seção indicando ausência de tools. |

#### Returns

`string`

String formatada contendo a seção de tools do prompt.

**`Remarks`**

- Tools sem parâmetros úteis são automaticamente filtradas
- Schemas são convertidos para formato SAP automaticamente
- Fallbacks são fornecidos para tools com geração de schema falha
- Formatação otimizada para legibilidade por LLMs

**`Example`**

```typescript
const tools = [
  {
    name: 'search',
    description: 'Busca informações na web',
    parameterSchema: 'class SearchParams = { query: string, limit?: number }'
  }
];

const toolsSection = PromptBuilder.buildToolsPrompt(tools);
// Retorna seção formatada com tool description e schema
```

#### Defined in

[src/promptBuilder/promptBuilder.ts:363](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.ts#L363)

___

### determineSystemPrompt

▸ **determineSystemPrompt**(`args`): `Object`

Determina o systemPrompt a partir de diferentes fontes de entrada.

Função utilitária que centraliza a lógica de decisão sobre qual fonte
de prompt usar, oferecendo flexibilidade para diferentes padrões de uso
e permitindo fallback entre diferentes métodos de especificação de prompt.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | Objeto contendo diferentes opções de especificação de prompt: - `promptConfig`: Configuração completa do PromptBuilder (prioridade mais alta) - `systemPrompt`: String de prompt pré-construído (prioridade média) - `mode` + `agentInfo`: Construção dinâmica (prioridade mais baixa) |
| `args.additionalInstructions?` | `string` | - |
| `args.agentInfo?` | [`AgentInfo`](../interfaces/AgentInfo.md) | - |
| `args.mode?` | `string` | - |
| `args.promptConfig?` | [`PromptBuilderConfig`](../interfaces/PromptBuilderConfig.md) | - |
| `args.systemPrompt?` | `string` | - |
| `args.taskList?` | `Object` | - |
| `args.taskList.items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] | - |
| `args.tools?` | [`ToolSchema`](../README.md#toolschema)[] | - |

#### Returns

`Object`

Objeto contendo:
- `systemPrompt`: String do prompt final
- `source`: Identificador da fonte utilizada

| Name | Type |
| :------ | :------ |
| `source` | ``"promptConfig"`` \| ``"systemPrompt"`` \| ``"mode+agentInfo+additionalInstructions"`` |
| `systemPrompt` | `string` |

**`Throws`**

Se nenhuma fonte válida for fornecida

**`Example`**

```typescript
// Usando configuração completa
const result1 = PromptBuilder.determineSystemPrompt({
  promptConfig: { mode: 'chat', agentInfo: {...} }
});

// Usando prompt pré-construído
const result2 = PromptBuilder.determineSystemPrompt({
  systemPrompt: 'Você é um assistente útil...'
});

// Usando construção dinâmica
const result3 = PromptBuilder.determineSystemPrompt({
  mode: 'react',
  agentInfo: { name: 'Bot', goal: 'Ajudar', backstory: '...' },
  additionalInstructions: 'Seja gentil',
  toolNames: ['search']
});
```

**`Remarks`**

- Prioridade: promptConfig > systemPrompt > mode+agentInfo
- Útil para APIs que aceitam múltiplos formatos de entrada
- Facilita migração de prompts antigos para novo sistema
- Retorna source para logging e debugging

**`See`**

[buildSystemPrompt](PromptBuilder.md#buildsystemprompt) Para construção com configuração

#### Defined in

[src/promptBuilder/promptBuilder.ts:467](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.ts#L467)
