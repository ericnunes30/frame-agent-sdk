# frame-agent-sdk

## Table of contents

### References

- [AgentModeType](README.md#agentmodetype)

### Enumerations

- [GraphStatus](enums/GraphStatus.md)
- [ToolRouterKey](enums/ToolRouterKey.md)

### Classes

- [AgentLLM](classes/AgentLLM.md)
- [AgentModeUtil](classes/AgentModeUtil.md)
- [AgentRegistry](classes/AgentRegistry.md)
- [ApprovalParams](classes/ApprovalParams.md)
- [ApprovalTool](classes/ApprovalTool.md)
- [AskUserParams](classes/AskUserParams.md)
- [AskUserTool](classes/AskUserTool.md)
- [ChatHistoryManager](classes/ChatHistoryManager.md)
- [FinalAnswerParams](classes/FinalAnswerParams.md)
- [FinalAnswerTool](classes/FinalAnswerTool.md)
- [GraphBuilder](classes/GraphBuilder.md)
- [GraphEngine](classes/GraphEngine.md)
- [MCPBase](classes/MCPBase.md)
- [MCPClient](classes/MCPClient.md)
- [MCPToolWrapper](classes/MCPToolWrapper.md)
- [PromptBuilder](classes/PromptBuilder.md)
- [ProviderAdapter](classes/ProviderAdapter.md)
- [SAPParser](classes/SAPParser.md)
- [StepsOrchestrator](classes/StepsOrchestrator.md)
- [TodoListParams](classes/TodoListParams.md)
- [TodoListTool](classes/TodoListTool.md)
- [TokenizerService](classes/TokenizerService.md)
- [ToolBase](classes/ToolBase.md)
- [ToolDetector](classes/ToolDetector.md)
- [ToolExecutor](classes/ToolExecutor.md)

### Interfaces

- [AgentExecutionOptions](interfaces/AgentExecutionOptions.md)
- [AgentExecutionResult](interfaces/AgentExecutionResult.md)
- [AgentInfo](interfaces/AgentInfo.md)
- [AgentLLMConfig](interfaces/AgentLLMConfig.md)
- [AgentRegistrationOptions](interfaces/AgentRegistrationOptions.md)
- [AgentRegistryInfo](interfaces/AgentRegistryInfo.md)
- [AgentRegistryStats](interfaces/AgentRegistryStats.md)
- [ChatHistoryConfig](interfaces/ChatHistoryConfig.md)
- [ConditionalEdge](interfaces/ConditionalEdge.md)
- [GraphBuilderOptions](interfaces/GraphBuilderOptions.md)
- [GraphDefinition](interfaces/GraphDefinition.md)
- [GraphNode](interfaces/GraphNode.md)
- [GraphNodeControl](interfaces/GraphNodeControl.md)
- [GraphNodeResult](interfaces/GraphNodeResult.md)
- [GraphRunResult](interfaces/GraphRunResult.md)
- [IAgent](interfaces/IAgent.md)
- [IAgentConfig](interfaces/IAgentConfig.md)
- [IAgentRegistry](interfaces/IAgentRegistry.md)
- [IChatHistoryManager](interfaces/IChatHistoryManager.md)
- [IGraphBuilder](interfaces/IGraphBuilder.md)
- [IGraphState](interfaces/IGraphState.md)
- [IProviderResponse](interfaces/IProviderResponse.md)
- [ISAPError](interfaces/ISAPError.md)
- [ITokenizerService](interfaces/ITokenizerService.md)
- [ITool](interfaces/ITool.md)
- [IToolCall](interfaces/IToolCall.md)
- [IToolParams](interfaces/IToolParams.md)
- [IToolResult](interfaces/IToolResult.md)
- [MCPBaseConfig](interfaces/MCPBaseConfig.md)
- [MCPSelection](interfaces/MCPSelection.md)
- [Message](interfaces/Message.md)
- [OrchestrationState](interfaces/OrchestrationState.md)
- [PromptBuilderConfig](interfaces/PromptBuilderConfig.md)
- [ProviderConfig](interfaces/ProviderConfig.md)
- [ProviderInstance](interfaces/ProviderInstance.md)
- [Step](interfaces/Step.md)
- [StepContext](interfaces/StepContext.md)
- [StepProviderOptions](interfaces/StepProviderOptions.md)
- [StepResultUpdate](interfaces/StepResultUpdate.md)
- [StepsConfig](interfaces/StepsConfig.md)
- [StepsDeps](interfaces/StepsDeps.md)
- [ToolDetectionResult](interfaces/ToolDetectionResult.md)

### Type Aliases

- [AgentMode](README.md#agentmode)
- [AgentType](README.md#agenttype)
- [MCPTransport](README.md#mcptransport)
- [PromptMode](README.md#promptmode)
- [ToolSchema](README.md#toolschema)

### Variables

- [AGENT\_MODES](README.md#agent_modes)
- [AgentRegistryInstance](README.md#agentregistryinstance)
- [DEFAULT\_AGENT\_CONFIG](README.md#default_agent_config)
- [toolRegistry](README.md#toolregistry)

### Functions

- [createAgentNode](README.md#createagentnode)
- [createHumanInLoopNode](README.md#createhumaninloopnode)
- [createRegisteredAgentNode](README.md#createregisteredagentnode)
- [createToolDetectionNode](README.md#createtooldetectionnode)
- [createToolExecutorNode](README.md#createtoolexecutornode)
- [createToolRouter](README.md#createtoolrouter)
- [formatIssuesForLLM](README.md#formatissuesforllm)
- [generateTypedSchema](README.md#generatetypedschema)
- [getProvider](README.md#getprovider)
- [listProviders](README.md#listproviders)
- [stepAgent](README.md#stepagent)
- [stepAgentCustom](README.md#stepagentcustom)
- [stepFinalize](README.md#stepfinalize)
- [stream](README.md#stream)
- [validateAgentConfig](README.md#validateagentconfig)
- [validateToolParams](README.md#validatetoolparams)

## References

### AgentModeType

Renames and re-exports [AgentMode](README.md#agentmode)

## Type Aliases

### AgentMode

Ƭ **AgentMode**: typeof [`AGENT_MODES`](README.md#agent_modes)[keyof typeof [`AGENT_MODES`](README.md#agent_modes)]

#### Defined in

[src/llmModes/modes/index.ts:19](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/llmModes/modes/index.ts#L19)

___

### AgentType

Ƭ **AgentType**: ``"chat"`` \| ``"react"`` \| `string`

Tipos de agente suportados pelo sistema.

Define os modos de operação disponíveis para agentes de IA,
cada um com comportamentos e capacidades específicas.

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L14)

___

### MCPTransport

Ƭ **MCPTransport**: ``"stdio"``

#### Defined in

[src/tools/tools/mcp/MCPClient.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/mcp/MCPClient.ts#L6)

___

### PromptMode

Ƭ **PromptMode**: ``"react"`` \| ``"chat"`` \| `string`

Modos de prompt suportados pelo sistema.

Define os diferentes tipos de comportamento e estratégia de prompting
que podem ser aplicados aos agentes de IA.

**`Example`**

```typescript
// Modo de conversa simples
const chatMode: PromptMode = 'chat';

// Modo de reasoning e action
const reactMode: PromptMode = 'react';

// Modo customizado
const customMode: PromptMode = 'code_reviewer';
```

**`Remarks`**

- 'chat': Conversa simples e direta
- 'react': Reasoning e action com uso de tools
- string: Modos customizados registrados via `addPromptMode()`

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:93](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.interface.ts#L93)

___

### ToolSchema

Ƭ **ToolSchema**: `Pick`\<[`ITool`](interfaces/ITool.md), ``"name"`` \| ``"description"`` \| ``"parameterSchema"``\>

Schema de uma ferramenta para uso no System Prompt.

É um alias especializado para ITool, extraindo apenas os campos necessários
para a construção de prompts. Os schemas são convertidos para formato SAP
(Schema as Protocol) pelo PromptBuilder para otimizar a comunicação com LLMs.

**`Example`**

```typescript
const toolSchema: ToolSchema = {
  name: 'search',
  description: 'Busca informações na web',
  parameterSchema: 'class SearchParams = { query: string, limit?: number }'
};
```

**`Remarks`**

- `name`: Identificador único da ferramenta
- `description`: Explicação clara do propósito da ferramenta
- `parameterSchema`: Schema dos parâmetros em formato de classe

**`See`**

[PromptBuilder.buildToolsPrompt](classes/PromptBuilder.md#buildtoolsprompt) Para conversão automática

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:68](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.interface.ts#L68)

## Variables

### AGENT\_MODES

• `Const` **AGENT\_MODES**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CHAT` | ``"chat"`` |
| `REACT` | ``"react"`` |

#### Defined in

[src/llmModes/modes/index.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/llmModes/modes/index.ts#L14)

___

### AgentRegistryInstance

• `Const` **AgentRegistryInstance**: [`AgentRegistry`](classes/AgentRegistry.md)

#### Defined in

[src/agent/registry/AgentRegistry.ts:379](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/registry/AgentRegistry.ts#L379)

___

### DEFAULT\_AGENT\_CONFIG

• `Const` **DEFAULT\_AGENT\_CONFIG**: `Partial`\<[`IAgentConfig`](interfaces/IAgentConfig.md)\>

Configuração padrão para agentes do sistema.

Valores padrão sensatos que podem ser usados como base
para configurações de agentes, garantindo comportamento
consistente e configurações razoáveis.

## Valores Padrão

- **LLM**: temperature moderada (0.5), topP completo (1.0), maxTokens padrão (1000)
- **Memória**: contexto amplo (8192 tokens), preservar system prompt, histórico médio (100 mensagens)

**`Example`**

```typescript
// Usar como base para configuração customizada
const myConfig: Partial<IAgentConfig> = {
  ...DEFAULT_AGENT_CONFIG,
  type: 'react',
  provider: 'openai',
  model: 'gpt-4',
  agentInfo: {
    name: 'Meu Agente',
    role: 'Assistente personalizado',
    backstory: 'Agente criado para tarefas específicas'
  }
};

// Validar configuração baseada no padrão
const errors = validateAgentConfig(myConfig as IAgentConfig);
if (errors.length > 0) {
  console.error('Configuração inválida:', errors);
}
```

**`See`**

 - [IAgentConfig](interfaces/IAgentConfig.md) Para estrutura completa da configuração
 - [validateAgentConfig](README.md#validateagentconfig) Para validação de configurações

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:412](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L412)

___

### toolRegistry

• `Const` **toolRegistry**: `ToolRegistry`

Instância singleton global do ToolRegistry.

Esta instância é exportada e usada em toda a aplicação para
registro e descoberta de ferramentas. Garante que todos os
módulos acessem o mesmo conjunto de ferramentas.

**`Example`**

```typescript
// Uso direto da instância global
import { toolRegistry } from '@/tools/core/toolRegistry';

toolRegistry.register(new CalculatorTool());
const tools = toolRegistry.listTools();
```

**`See`**

ToolRegistry Para documentação da classe

#### Defined in

[src/tools/core/toolRegistry.ts:283](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/core/toolRegistry.ts#L283)

## Functions

### createAgentNode

▸ **createAgentNode**(`options`): [`GraphNode`](interfaces/GraphNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `IAgentNodeOptions` |

#### Returns

[`GraphNode`](interfaces/GraphNode.md)

#### Defined in

[src/orchestrators/graph/nodes/agentNode.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/nodes/agentNode.ts#L9)

___

### createHumanInLoopNode

▸ **createHumanInLoopNode**(): [`GraphNode`](interfaces/GraphNode.md)

#### Returns

[`GraphNode`](interfaces/GraphNode.md)

#### Defined in

[src/orchestrators/graph/nodes/humanInLoopNode.ts:4](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/nodes/humanInLoopNode.ts#L4)

___

### createRegisteredAgentNode

▸ **createRegisteredAgentNode**(`options`): [`GraphNode`](interfaces/GraphNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `IRegisteredAgentNodeOptions` |

#### Returns

[`GraphNode`](interfaces/GraphNode.md)

#### Defined in

[src/orchestrators/graph/nodes/registeredAgentNode.ts:6](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/nodes/registeredAgentNode.ts#L6)

___

### createToolDetectionNode

▸ **createToolDetectionNode**(): [`GraphNode`](interfaces/GraphNode.md)

Cria um nó de detecção de ferramentas.
Este nó analisa a última mensagem do estado (geralmente do LLM) e tenta detectar uma chamada de ferramenta.
Se detectado com sucesso, preenche `state.lastToolCall`.
Se houver erro de validação/parsing, preenche metadados de validação para feedback ao LLM.

#### Returns

[`GraphNode`](interfaces/GraphNode.md)

#### Defined in

[src/orchestrators/graph/nodes/toolDetectionNode.ts:11](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/nodes/toolDetectionNode.ts#L11)

___

### createToolExecutorNode

▸ **createToolExecutorNode**(): [`GraphNode`](interfaces/GraphNode.md)

#### Returns

[`GraphNode`](interfaces/GraphNode.md)

#### Defined in

[src/orchestrators/graph/nodes/toolExecutorNode.ts:5](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/nodes/toolExecutorNode.ts#L5)

___

### createToolRouter

▸ **createToolRouter**(`options`): [`ConditionalEdge`](interfaces/ConditionalEdge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `IToolRouterOptions` |

#### Returns

[`ConditionalEdge`](interfaces/ConditionalEdge.md)

#### Defined in

[src/orchestrators/graph/routing/toolRouter.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/routing/toolRouter.ts#L8)

___

### formatIssuesForLLM

▸ **formatIssuesForLLM**(`issues`): `string`

Formata problemas de validação para feedback ao LLM.

Esta função converte uma lista de ToolValidationIssue em uma string
formatada especificamente para ser usada como feedback ao modelo de
linguagem, seguindo o padrão esperado pelos agentes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issues` | `ToolValidationIssue`[] | Lista de problemas de validação encontrados. |

#### Returns

`string`

String formatada com feedback para o LLM.

**`Example`**

```typescript
const issues = [
  { path: 'query', code: 'missing_required', message: "Property 'query' is required" },
  { path: 'limit', code: 'out_of_range', message: "Property 'limit' must be <= 100" }
];

const feedback = formatIssuesForLLM(issues);
console.log(feedback);
// Output:
// Your tool output does not match the required schema. Fix these issues and try again using the exact JSON format.
// - query: Property 'query' is required
// - limit: Property 'limit' must be <= 100
```

#### Defined in

[src/tools/core/toolValidator.ts:306](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/core/toolValidator.ts#L306)

___

### generateTypedSchema

▸ **generateTypedSchema**(`tool`): `string`

Gera schema tipado para uma ferramenta em formato legível por LLM.

Esta função é o ponto de entrada principal do gerador de schemas. Ela
converte o parameterSchema de uma ferramenta em uma string formatada
que pode ser injetada em system prompts para fornecer ao LLM informações
sobre como chamar a ferramenta corretamente.

## Processo de Conversão

1. **Detecção de Formato**: Identifica se é JSON Schema ou schemaProperties
2. **Conversão MCP**: Se for JSON Schema, delega para MCPToSAPConverter
3. **Processamento SAP**: Converte schemaProperties para formato legível
4. **Formatação**: Adiciona metadados como enums, ranges e validações
5. **Geração Final**: Produz string no formato class Nome = { ... }

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tool` | [`ITool`](interfaces/ITool.md)\<[`IToolParams`](interfaces/IToolParams.md), `unknown`\> | Instância da ferramenta com parameterSchema definido. |

#### Returns

`string`

String representando o Typed Schema para o LLM.

**`Example`**

```typescript
// Schema simples
class SimpleTool extends ToolBase<SimpleParams, string> {
  public readonly name = 'simple_tool';
  public readonly parameterSchema = SimpleParams;
}

const schema = generateTypedSchema(new SimpleTool());
console.log(schema);
// class simple_tool = {
//   message: string;
// }
```

**`Example`**

```typescript
// Schema com validações
class ValidatedTool extends ToolBase<ValidatedParams, number> {
  public readonly name = 'validated_tool';
  public readonly parameterSchema = ValidatedParams;
}

const schema = generateTypedSchema(new ValidatedTool());
console.log(schema);
// class validated_tool = {
//   operation: string; // enum: add, subtract, multiply, divide
//   value: number; // range: min=1, max=100
//   precision?: number; // range: min=0, max=10
// }
```

**`Example`**

```typescript
// Schema vazio
class EmptyTool extends ToolBase<EmptyParams, void> {
  public readonly name = 'empty_tool';
  public readonly parameterSchema = EmptyParams;
}

const schema = generateTypedSchema(new EmptyTool());
console.log(schema);
// class empty_tool = {}
```

**`See`**

 - [ITool](interfaces/ITool.md) Para interface da ferramenta
 - SchemaProperties Para formato do schema
 - MCPToSAPConverter Para conversão de JSON Schema

#### Defined in

[src/tools/constructor/schemaGenerator.ts:188](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/constructor/schemaGenerator.ts#L188)

___

### getProvider

▸ **getProvider**(`name`): `ProviderConstructor`

Obtém o construtor de um provedor pelo nome registrado.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Nome do provedor a ser obtido. Deve corresponder a um provedor previamente registrado. |

#### Returns

`ProviderConstructor`

Construtor do provedor solicitado.

**`Throws`**

Se o provedor não estiver registrado

**`Example`**

```typescript
// Obter provedor OpenAI
const OpenAIConstructor = ProviderRegistry.getProvider('openai');
const openaiProvider = new OpenAIConstructor('sk-...');

// Obter provedor compatível
const CompatibleConstructor = ProviderRegistry.getProvider('openaiCompatible');
const compatibleProvider = new CompatibleConstructor('api-key');

// Tentar obter provedor inexistente
try {
  const UnknownConstructor = ProviderRegistry.getProvider('unknown');
} catch (error) {
  console.error(error.message); // "O provedor 'unknown' não está registrado."
}
```

**`See`**

 - registerProvider Para registrar novos provedores
 - [listProviders](README.md#listproviders) Para listar provedores disponíveis

#### Defined in

[src/providers/providers/index.ts:4](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/providers/index.ts#L4)

___

### listProviders

▸ **listProviders**(): `string`[]

Lista todos os nomes dos provedores registrados.

#### Returns

`string`[]

Array com os nomes de todos os provedores disponíveis.

**`Example`**

```typescript
const providers = ProviderRegistry.listProviders();
console.log(providers);
// ['openai', 'gpt', 'openaiCompatible']

// Verificar se um provedor está disponível
const availableProviders = ProviderRegistry.listProviders();
if (availableProviders.includes('anthropic')) {
  console.log('Anthropic está disponível');
}
```

**`See`**

 - [getProvider](README.md#getprovider) Para obter um provedor específico
 - registerProvider Para registrar novos provedores

#### Defined in

[src/providers/providers/index.ts:5](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/providers/index.ts#L5)

___

### stepAgent

▸ **stepAgent**(`id`): [`Step`](interfaces/Step.md)

Step que invoca o AgentLLM usando a memória atual.
Usa o AgentLLM injetado nas dependências.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

[`Step`](interfaces/Step.md)

#### Defined in

[src/orchestrators/steps/steps.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/steps/steps.ts#L9)

___

### stepAgentCustom

▸ **stepAgentCustom**(`id`, `opts`): [`Step`](interfaces/Step.md)

Step que cria um AgentLLM customizado para esse step específico.
Útil quando você precisa usar modelo/provider diferente por step.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `opts` | [`StepProviderOptions`](interfaces/StepProviderOptions.md) |

#### Returns

[`Step`](interfaces/Step.md)

#### Defined in

[src/orchestrators/steps/steps.ts:41](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/steps/steps.ts#L41)

___

### stepFinalize

▸ **stepFinalize**(`id`, `fromStateKey`): [`Step`](interfaces/Step.md)

Step que finaliza a orquestração com valor do estado.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `fromStateKey` | `string` |

#### Returns

[`Step`](interfaces/Step.md)

#### Defined in

[src/orchestrators/steps/steps.ts:28](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/steps/steps.ts#L28)

___

### stream

▸ **stream**\<`T`\>(`stream`): `AsyncIterable`\<`T`\>

Transforma um stream de chunks da API em um iterador assíncrono.

Esta função é um wrapper que facilita o processamento de streams
retornados por APIs de LLM, permitindo consumo fácil dos chunks
de dados em tempo real.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream` | `AsyncIterable`\<`T`\> | Stream de chunks retornado pela API. Pode ser um AsyncIterable de qualquer tipo de dados. |

#### Returns

`AsyncIterable`\<`T`\>

Um iterador assíncrono que emite cada chunk do stream.

**`Example`**

```typescript
import { stream } from '@/providers/utils';

// Processar stream da OpenAI
const openaiStream = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Conte uma história' }],
  stream: true
});

for await (const chunk of stream(openaiStream)) {
  const content = chunk.choices[0]?.delta?.content ?? '';
  process.stdout.write(content);
}

// Processar stream de provedor compatível
const compatibleStream = await compatibleProvider.chatCompletion({
  // ... config
  stream: true
});

for await (const chunk of stream(compatibleStream)) {
  console.log('Chunk received:', chunk);
}
```

**`Remarks`**

- Útil para respostas em tempo real de LLMs
- Funciona com qualquer AsyncIterable
- Preserva o tipo original dos chunks
- Facilita debugging e logging de streams

**`See`**

 - OpenAIProvider Para uso com OpenAI
 - OpenAICompatibleProvider Para uso com provedores compatíveis

#### Defined in

[src/providers/utils/stream.ts:57](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/providers/utils/stream.ts#L57)

___

### validateAgentConfig

▸ **validateAgentConfig**(`config`): `string`[]

Valida configuração de agente e retorna lista de erros.

Função utilitária que verifica se uma configuração de agente
está completa e válida, retornando array com mensagens de erro
descritivas para problemas encontrados.

## Validações Realizadas

- **Campos Obrigatórios**: type, provider, model, agentInfo
- **AgentInfo**: name, goal, backstory
- **LLM Config**: ranges válidos para temperature, topP, maxTokens
- **Tipos**: Verificação de tipos básicos

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`IAgentConfig`](interfaces/IAgentConfig.md) | Configuração do agente a ser validada. |

#### Returns

`string`[]

Array com mensagens de erro. Array vazio = configuração válida.

**`Example`**

```typescript
// Configuração válida
const validConfig: IAgentConfig = {
  type: 'chat',
  provider: 'openai',
  model: 'gpt-4',
  agentInfo: {
    name: 'Assistente',
    role: 'Ajuda usuários',
    backstory: 'Agente prestativo'
  }
};

const errors = validateAgentConfig(validConfig);
console.log(errors.length); // 0

// Configuração inválida
const invalidConfig = {
  type: '',
  provider: 'openai',
  model: 'gpt-4'
};

const errors2 = validateAgentConfig(invalidConfig as IAgentConfig);
console.log(errors2);
// ['Tipo do agente é obrigatório', 'Informações do agente são obrigatórias']
```

**`See`**

 - [IAgentConfig](interfaces/IAgentConfig.md) Para estrutura da configuração
 - [DEFAULT_AGENT_CONFIG](README.md#default_agent_config) Para valores padrão

#### Defined in

[src/agent/interfaces/IAgentConfig.ts:475](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgentConfig.ts#L475)

___

### validateToolParams

▸ **validateToolParams**(`tool`, `params`): `ToolValidationResult`

Valida parâmetros de uma ferramenta contra seu schema.

Esta função é o ponto de entrada principal para validação de parâmetros.
Ela verifica todos os aspectos do schema da ferramenta e retorna um
resultado detalhado com todos os problemas encontrados.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tool` | [`ITool`](interfaces/ITool.md)\<[`IToolParams`](interfaces/IToolParams.md), `unknown`\> | Ferramenta cujo schema será usado para validação. |
| `params` | `unknown` | Parâmetros a serem validados. |

#### Returns

`ToolValidationResult`

ToolValidationResult com resultado da validação.

**`Example`**

```typescript
// Definir ferramenta com schema
class SearchTool {
  static schemaProperties = {
    query: { type: 'string', required: true, minLength: 3 },
    limit?: { type: 'number', min: 1, max: 100 }
  };
}

// Validar parâmetros
const tool = new SearchTool();
const result = validateToolParams(tool, { query: 'ab', limit: 150 });

console.log(result.valid); // false
console.log(result.issues); // [
  // { path: 'query', code: 'length_out_of_range', message: '...' },
  // { path: 'limit', code: 'out_of_range', message: '...' }
// ]
```

#### Defined in

[src/tools/core/toolValidator.ts:234](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/core/toolValidator.ts#L234)
