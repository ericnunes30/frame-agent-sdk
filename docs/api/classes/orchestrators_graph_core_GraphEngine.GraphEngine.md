# Class: GraphEngine

[orchestrators/graph/core/GraphEngine](../modules/orchestrators_graph_core_GraphEngine.md).GraphEngine

Motor de execução de grafos para orquestração de agentes de IA.

Esta classe é o coração do sistema de orquestração baseado em grafos,
responsável por executar fluxos de trabalho complexos definidos como
grafos acíclicos direcionados (DAGs) com nós e arestas condicionais.

## Funcionalidades Principais

- **Execução de Grafos**: Processa grafos definidos com nós e arestas
- **Gerenciamento de Estado**: Mantém estado global durante execução
- **Histórico de Chat**: Integração com ChatHistoryManager para contexto
- **Controle de Fluxo**: Suporte a arestas condicionais e paralelas
- **Limites de Execução**: Controle de maxSteps para evitar loops infinitos
- **Integração LLM**: Suporte nativo para modelos de linguagem

## Arquitetura do Sistema

- **GraphDefinition**: Define estrutura do grafo (nós, arestas, entry point)
- **GraphNode**: Nós individuais com lógica específica de execução
- **IGraphState**: Estado global compartilhado entre nós
- **GraphStatus**: Status de execução (RUNNING, FINISHED, ERROR, PAUSED)

## Casos de Uso

- **Workflows Complexos**: Orquestrar múltiplas tarefas interdependentes
- **Sistemas Multi-Agente**: Coordenar agentes especializados
- **Processamento Condicional**: Roteamento baseado em resultados
- **Pipelines de Dados**: Processar dados através de múltiplas etapas
- **Automação de Processos**: Automatizar workflows empresariais

**`Example`**

```typescript
import { GraphEngine } from '@/orchestrators/graph/core/GraphEngine';
import { createAgentNode } from '@/orchestrators/graph/builder';

// Definir nós do grafo
const agentNode = createAgentNode({
  llm: { model: 'gpt-4', apiKey: '...' },
  mode: 'react',
  agentInfo: { name: 'Assistant', goal: 'Help users', backstory: '...' }
});

// Definir grafo
const graphDefinition: GraphDefinition = {
  nodes: {
    start: agentNode,
    end: createEndNode()
  },
  edges: {
    start: { default: 'end' }
  },
  entryPoint: 'start'
};

// Executar grafo
const engine = new GraphEngine(graphDefinition);
const result = await engine.execute({
  messages: [{ role: 'user', content: 'Hello!' }],
  data: {},
  metadata: {}
});

console.log('Status:', result.status);
console.log('Final state:', result.finalState);
```

**`See`**

 - [GraphDefinition](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md) Para definição de grafos
 - [IGraphState](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) Para estado do grafo
 - [GraphStatus](../enums/orchestrators_graph_core_enums_graphEngine_enum.GraphStatus.md) Para status de execução

## Table of contents

### Constructors

- [constructor](orchestrators_graph_core_GraphEngine.GraphEngine.md#constructor)

### Properties

- [chatHistoryManager](orchestrators_graph_core_GraphEngine.GraphEngine.md#chathistorymanager)
- [currentTraceContext](orchestrators_graph_core_GraphEngine.GraphEngine.md#currenttracecontext)
- [definition](orchestrators_graph_core_GraphEngine.GraphEngine.md#definition)
- [lastSyncedMessageCount](orchestrators_graph_core_GraphEngine.GraphEngine.md#lastsyncedmessagecount)
- [llmConfig](orchestrators_graph_core_GraphEngine.GraphEngine.md#llmconfig)
- [maxSteps](orchestrators_graph_core_GraphEngine.GraphEngine.md#maxsteps)
- [moduleName](orchestrators_graph_core_GraphEngine.GraphEngine.md#modulename)
- [telemetry](orchestrators_graph_core_GraphEngine.GraphEngine.md#telemetry)
- [tokenizerService](orchestrators_graph_core_GraphEngine.GraphEngine.md#tokenizerservice)
- [trace](orchestrators_graph_core_GraphEngine.GraphEngine.md#trace)
- [traceContextBase](orchestrators_graph_core_GraphEngine.GraphEngine.md#tracecontextbase)

### Methods

- [addMessage](orchestrators_graph_core_GraphEngine.GraphEngine.md#addmessage)
- [applyPause](orchestrators_graph_core_GraphEngine.GraphEngine.md#applypause)
- [assertMaxSteps](orchestrators_graph_core_GraphEngine.GraphEngine.md#assertmaxsteps)
- [bootstrapState](orchestrators_graph_core_GraphEngine.GraphEngine.md#bootstrapstate)
- [emitTrace](orchestrators_graph_core_GraphEngine.GraphEngine.md#emittrace)
- [ensureChatHistoryManager](orchestrators_graph_core_GraphEngine.GraphEngine.md#ensurechathistorymanager)
- [execute](orchestrators_graph_core_GraphEngine.GraphEngine.md#execute)
- [getChatHistoryManager](orchestrators_graph_core_GraphEngine.GraphEngine.md#getchathistorymanager)
- [getMessagesForLLM](orchestrators_graph_core_GraphEngine.GraphEngine.md#getmessagesforllm)
- [getTelemetryOptions](orchestrators_graph_core_GraphEngine.GraphEngine.md#gettelemetryoptions)
- [getTraceContext](orchestrators_graph_core_GraphEngine.GraphEngine.md#gettracecontext)
- [getTraceSink](orchestrators_graph_core_GraphEngine.GraphEngine.md#gettracesink)
- [mergeLogs](orchestrators_graph_core_GraphEngine.GraphEngine.md#mergelogs)
- [mergeMessages](orchestrators_graph_core_GraphEngine.GraphEngine.md#mergemessages)
- [mergeState](orchestrators_graph_core_GraphEngine.GraphEngine.md#mergestate)
- [resolveNext](orchestrators_graph_core_GraphEngine.GraphEngine.md#resolvenext)
- [resume](orchestrators_graph_core_GraphEngine.GraphEngine.md#resume)
- [runNode](orchestrators_graph_core_GraphEngine.GraphEngine.md#runnode)
- [setChatHistoryManager](orchestrators_graph_core_GraphEngine.GraphEngine.md#setchathistorymanager)
- [syncMessagesToChatHistory](orchestrators_graph_core_GraphEngine.GraphEngine.md#syncmessagestochathistory)
- [syncStateFromChatHistory](orchestrators_graph_core_GraphEngine.GraphEngine.md#syncstatefromchathistory)

## Constructors

### constructor

• **new GraphEngine**(`definition`, `options?`, `llmConfig?`): [`GraphEngine`](orchestrators_graph_core_GraphEngine.GraphEngine.md)

Construtor do GraphEngine.

Inicializa o motor de execução com a definição do grafo e opções
de configuração, incluindo gerenciamento de histórico e limites
de execução.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `definition` | [`GraphDefinition`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md) | Definição completa do grafo a ser executado. Deve incluir nós, arestas e ponto de entrada válidos. |
| `options?` | `Object` | Opções adicionais de configuração. - maxSteps: Limite máximo de passos para evitar loops infinitos - chatHistoryManager: Gerenciador de histórico customizado |
| `options.chatHistoryManager?` | [`IChatHistoryManager`](../interfaces/memory_memory_interface.IChatHistoryManager.md) | - |
| `options.maxSteps?` | `number` | - |
| `options.telemetry?` | [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md) | Opções de telemetria (volume/persistência/redaction) (opcional). |
| `options.trace?` | [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md) | Sink de telemetria (push) em tempo real (opcional). |
| `options.traceContext?` | `Omit`\<[`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md), ``"runId"`` \| ``"parentRunId"`` \| ``"orchestrator"``\> | Contexto base de telemetria (sem runId/orchestrator) (opcional). |
| `llmConfig?` | [`AgentLLMConfig`](../interfaces/agent_interfaces_agentLLM_interface.AgentLLMConfig.md) | Configuração opcional do LLM. Usada para criar TokenizerService e gerenciar contexto. |

#### Returns

[`GraphEngine`](orchestrators_graph_core_GraphEngine.GraphEngine.md)

**`Example`**

```typescript
// Configuração básica
const engine1 = new GraphEngine(graphDefinition);

// Com opções
const engine2 = new GraphEngine(graphDefinition, {
  maxSteps: 50,
  chatHistoryManager: customChatManager
});

// Com configuração LLM
const engine3 = new GraphEngine(graphDefinition, {
  maxSteps: 30
}, {
  model: 'gpt-4',
  apiKey: 'sk-...',
  defaults: { temperature: 0.7 }
});
```

**`See`**

 - [GraphDefinition](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md) Para formato da definição
 - [IChatHistoryManager](../interfaces/memory_memory_interface.IChatHistoryManager.md) Para gerenciamento de histórico
 - [AgentLLMConfig](../interfaces/agent_interfaces_agentLLM_interface.AgentLLMConfig.md) Para configuração do LLM

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:149](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L149)

## Properties

### chatHistoryManager

• `Private` `Optional` **chatHistoryManager**: [`IChatHistoryManager`](../interfaces/memory_memory_interface.IChatHistoryManager.md)

Gerenciador de histórico de chat

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:97](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L97)

___

### currentTraceContext

• `Private` `Optional` **currentTraceContext**: [`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md)

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:105](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L105)

___

### definition

• `Private` `Readonly` **definition**: [`GraphDefinition`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphDefinition.md)

Definição completa do grafo a ser executado

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:91](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L91)

___

### lastSyncedMessageCount

• `Private` **lastSyncedMessageCount**: `number` = `0`

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:332](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L332)

___

### llmConfig

• `Private` `Optional` `Readonly` **llmConfig**: [`AgentLLMConfig`](../interfaces/agent_interfaces_agentLLM_interface.AgentLLMConfig.md)

Configuração do LLM (opcional)

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:101](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L101)

___

### maxSteps

• `Private` `Optional` `Readonly` **maxSteps**: `number`

Limite máximo de passos de execução

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:93](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L93)

___

### moduleName

• `Private` `Readonly` **moduleName**: ``"GraphEngine"``

Nome do módulo para logging

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:95](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L95)

___

### telemetry

• `Private` `Optional` `Readonly` **telemetry**: [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md)

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:103](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L103)

___

### tokenizerService

• `Private` `Optional` **tokenizerService**: [`TokenizerService`](memory_tokenizer.TokenizerService.md)

Serviço de tokenização para gerenciamento de contexto

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:99](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L99)

___

### trace

• `Private` `Readonly` **trace**: [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md)

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:102](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L102)

___

### traceContextBase

• `Private` `Optional` `Readonly` **traceContextBase**: `Omit`\<[`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md), ``"runId"`` \| ``"parentRunId"`` \| ``"orchestrator"``\>

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:104](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L104)

## Methods

### addMessage

▸ **addMessage**(`message`): `void`

Adiciona uma mensagem ao historico interno (ChatHistoryManager).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](../interfaces/memory_memory_interface.Message.md) | Mensagem a ser adicionada. |

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:248](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L248)

___

### applyPause

▸ **applyPause**(`state`): [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)

Aplica controle de pausa ao estado.

Método interno que verifica se o estado deve ser pausado
baseado em shouldPause ou pendingAskUser, alterando o status
para PAUSED quando necessário.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) | Estado atual do grafo. |

#### Returns

[`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)

Estado com status atualizado se necessário.

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:833](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L833)

___

### assertMaxSteps

▸ **assertMaxSteps**(`count`): `void`

Verifica se limite máximo de passos foi excedido.

Método interno que valida se o número de passos executados
não excede o limite configurado, prevenindo loops infinitos
em grafos mal configurados.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `count` | `number` | Número atual de passos executados. |

#### Returns

`void`

**`Throws`**

Error se maxSteps configurado e excedido.

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:945](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L945)

___

### bootstrapState

▸ **bootstrapState**(`state`, `entryPoint`): [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)

Inicializa estado do grafo para execução.

Método interno que prepara o estado inicial do grafo,
definindo valores padrão para propriedades não fornecidas
e configurando status de execução.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) | Estado fornecido pelo usuário. |
| `entryPoint` | `string` | Nome do nó de entrada do grafo. |

#### Returns

[`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)

Estado inicializado para execução.

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:912](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L912)

___

### emitTrace

▸ **emitTrace**(`state`, `event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Object` |
| `state.metadata?` | `Record`\<`string`, `unknown`\> |
| `event` | `Omit`\<[`TraceEvent`](../interfaces/telemetry_interfaces_traceEvent_interface.TraceEvent.md), ``"ts"`` \| ``"runId"`` \| ``"parentRunId"`` \| ``"orchestrator"``\> |

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:230](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L230)

___

### ensureChatHistoryManager

▸ **ensureChatHistoryManager**(`initialState`): `void`

Garante que o ChatHistoryManager está inicializado e sincronizado.

Método interno que verifica se o ChatHistoryManager existe,
criando um novo se necessário. Sincroniza APENAS as novas mensagens
do initialState com o ChatHistoryManager para evitar duplicação.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialState` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) | Estado inicial do grafo. Usado para sincronizar mensagens com o ChatHistoryManager. |

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:346](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L346)

___

### execute

▸ **execute**(`initialState`, `options?`): `Promise`\<[`GraphRunResult`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphRunResult.md)\>

Executa o grafo a partir do estado inicial fornecido.

Este é o método principal do GraphEngine que coordena toda a execução
do grafo, gerenciando estado, fluxo de controle e comunicação entre nós.

## Fluxo de Execução

1. **Inicialização**: Configura ChatHistoryManager e sincroniza estado
2. **Loop Principal**: Executa nós sequencialmente até conclusão
3. **Execução de Nó**: Chama função do nó com estado atual
4. **Merge de Estado**: Combina resultado do nó com estado global
5. **Roteamento**: Determina próximo nó baseado em arestas
6. **Controle de Fluxo**: Aplica pausas, limites e condições de parada

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialState` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) | Estado inicial do grafo. Deve incluir mensagens, dados e metadados iniciais. |
| `options?` | [`ExecuteOptions`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.ExecuteOptions.md) | Opções de execução opcionais. Permite configurar sinal de cancelamento e outras opções. |

#### Returns

`Promise`\<[`GraphRunResult`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphRunResult.md)\>

Promise que resolve para GraphRunResult.
Contém estado final e status da execução.

**`Example`**

```typescript
const engine = new GraphEngine(graphDefinition);

const initialState: IGraphState = {
  messages: [{ role: 'user', content: 'Olá, preciso de ajuda!' }],
  data: { userId: '123' },
  metadata: { sessionId: 'abc-456' }
};

const result = await engine.execute(initialState);

console.log('Status:', result.status); // 'FINISHED', 'ERROR', 'PAUSED'
console.log('Final state:', result.state);
console.log('Messages:', result.state.messages);
console.log('Data:', result.state.data);
```

**`See`**

 - [IGraphState](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) Para formato do estado
 - [GraphRunResult](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphRunResult.md) Para formato do resultado
 - [GraphStatus](../enums/orchestrators_graph_core_enums_graphEngine_enum.GraphStatus.md) Para status possíveis
 - [ExecuteOptions](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.ExecuteOptions.md) Para opções de execução

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:460](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L460)

___

### getChatHistoryManager

▸ **getChatHistoryManager**(): [`IChatHistoryManager`](../interfaces/memory_memory_interface.IChatHistoryManager.md)

Obtém o ChatHistoryManager atual do grafo.

Retorna o gerenciador de histórico de chat utilizado pelo grafo
para manter contexto durante a execução. Permite ao desenvolvedor
acessar diretamente a memória do agente para implementar
estratégias customizadas de compressão ou manipulação.

#### Returns

[`IChatHistoryManager`](../interfaces/memory_memory_interface.IChatHistoryManager.md)

O ChatHistoryManager atual ou undefined se não inicializado.

**`Example`**

```typescript
const engine = new GraphEngine(graphDefinition);

// Acessar o gerenciador de memória
const memory = engine.getChatHistoryManager();
if (memory) {
  // Implementar estratégia de compressão
  const currentMessages = memory.exportHistory();
  const compressed = compressMessages(currentMessages);
  memory.importHistory(compressed);
}
```

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:980](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L980)

___

### getMessagesForLLM

▸ **getMessagesForLLM**(): [`Message`](../interfaces/memory_memory_interface.Message.md)[]

Obtém mensagens do histórico para envio ao LLM.

Retorna o histórico de mensagens trimado e otimizado para
envio aos modelos de linguagem, respeitando limites de tokens
e mantendo contexto relevante.

#### Returns

[`Message`](../interfaces/memory_memory_interface.Message.md)[]

Array de mensagens otimizadas para o LLM.
Retorna array vazio se ChatHistoryManager não estiver inicializado.

**`Example`**

```typescript
const engine = new GraphEngine(graphDefinition);

// Adicionar algumas mensagens
engine.addMessage({ role: 'user', content: 'Olá' });
engine.addMessage({ role: 'assistant', content: 'Olá! Como posso ajudar?' });

// Obter mensagens para LLM
const messages = engine.getMessagesForLLM();
console.log('Mensagens para LLM:', messages);
// [
//   { role: 'user', content: 'Olá' },
//   { role: 'assistant', content: 'Olá! Como posso ajudar?' }
// ]
```

**`See`**

 - [Message](../interfaces/memory_memory_interface.Message.md) Para formato das mensagens
 - [()](../interfaces/memory_memory_interface.IChatHistoryManager.md#gettrimmedhistory) Para detalhes do trim

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:287](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L287)

___

### getTelemetryOptions

▸ **getTelemetryOptions**(): [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md)

Retorna as opções de telemetria configuradas no engine.

#### Returns

[`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md)

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:226](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L226)

___

### getTraceContext

▸ **getTraceContext**(): [`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md)

Retorna o TraceContext atual (apenas durante `execute()`/`resume()`).

#### Returns

[`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md)

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:212](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L212)

___

### getTraceSink

▸ **getTraceSink**(): [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md)

Retorna o sink de telemetria configurado no engine.

#### Returns

[`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md)

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:219](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L219)

___

### mergeLogs

▸ **mergeLogs**(`state`, `logs?`): [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)

Combina logs com o estado do grafo.

Método utilitário interno para adicionar logs ao estado.
Atualmente não é usado diretamente (funcionalidade incorporada
em mergeState), mas mantido para extensibilidade futura.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) | Estado atual do grafo. |
| `logs?` | `string`[] | Logs para adicionar. |

#### Returns

[`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)

Estado com logs adicionados.

**`Deprecated`**

Use mergeState diretamente

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:814](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L814)

___

### mergeMessages

▸ **mergeMessages**(`state`, `messages?`): [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)

Combina mensagens com o estado do grafo.

Método utilitário interno para adicionar mensagens ao estado.
Atualmente não é usado diretamente (funcionalidade incorporada
em mergeState), mas mantido para extensibilidade futura.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) | Estado atual do grafo. |
| `messages?` | [`Message`](../interfaces/memory_memory_interface.Message.md)[] | Mensagens para adicionar. |

#### Returns

[`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)

Estado com mensagens adicionadas.

**`Deprecated`**

Use mergeState diretamente

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:794](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L794)

___

### mergeState

▸ **mergeState**(`state`, `delta`): [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)

Combina estado atual com resultado de um nó.

Método interno que faz merge do delta retornado por um nó
com o estado global do grafo, preservando dados existentes
e incorporando novas informações de forma não-destrutiva.

## Estratégia de Merge

- **Mensagens**: Adiciona ao final do histórico
- **Data**: Merge superficial (shallow merge) de objetos
- **Metadata**: Merge superficial preservando estrutura
- **Logs**: Concatena com logs existentes
- **Propriedades Especiais**: Preserva valores quando não fornecidos

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) | Estado atual do grafo. |
| `delta` | `Partial`\<[`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)\> & \{ `logs?`: `string`[] ; `shouldEnd?`: `boolean` ; `shouldPause?`: `boolean`  } | Resultado parcial do nó executado. Pode incluir mensagens, data, metadata, logs e controles de fluxo. |

#### Returns

[`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md)

Novo estado combinado.

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:724](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L724)

___

### resolveNext

▸ **resolveNext**(`current`, `state`, `override?`): `string`

Resolve o próximo nó a ser executado.

Método interno que determina qual nó executar next baseado
nas arestas definidas no grafo, considerando override opcional
e arestas condicionais.

## Estratégia de Roteamento

1. **Override**: Se nextNodeOverride fornecido, usar diretamente
2. **Aresta Estática**: Se aresta é string, usar como próximo nó
3. **Aresta Condicional**: Se aresta é função, avaliar com estado atual
4. **Validação**: Verificar se próximo nó existe e é válido

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `current` | `string` | Nome do nó atual em execução. |
| `state` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) | Estado atual do grafo (usado para arestas condicionais). |
| `override?` | `string` | Próximo nó forçado (opcional). |

#### Returns

`string`

Nome do próximo nó a executar.

**`Throws`**

Error se aresta não definida ou retorno condicional vazio.

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:872](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L872)

___

### resume

▸ **resume**(`savedState`, `userInput?`): `Promise`\<[`GraphRunResult`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphRunResult.md)\>

Retoma a execução de um grafo pausado.

Método que permite continuar a execução de um grafo que foi
pausado anteriormente, opcionalmente aceitando input adicional
do usuário para prosseguir a execução.

## Casos de Uso

- **Pausas para Input**: Quando um nó precisa de informações do usuário
- **Interrupção Voluntária**: Quando execução é pausada manualmente
- **Recuperação de Estado**: Continuar após falhas temporárias
- **Workflows Interativos**: Fluxos que requerem interação humana

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `savedState` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) | Estado salvo do grafo pausado. Deve ter status PAUSED e conter informações suficientes para retomar a execução. |
| `userInput?` | [`Message`](../interfaces/memory_memory_interface.Message.md) | Mensagem opcional do usuário para prosseguir. Adicionada ao histórico e incluída no estado para o próximo nó. |

#### Returns

`Promise`\<[`GraphRunResult`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphRunResult.md)\>

Promise que resolve para GraphRunResult da continuação.

**`Example`**

```typescript
const engine = new GraphEngine(graphDefinition);

// Primeira execução (pode ser pausada)
const initialState = { messages: [{ role: 'user', content: 'Preciso de dados' }] };
const result1 = await engine.execute(initialState);

if (result1.status === 'PAUSED') {
  console.log('Grafo pausado, aguardando input do usuário');
  
  // Simular input do usuário
  const userInput = { role: 'user', content: 'Aqui estão os dados: [1,2,3,4,5]' };
  
  // Retomar execução
  const result2 = await engine.resume(result1.state, userInput);
  console.log('Execução concluída:', result2.status);
}
```

**`See`**

 - [IGraphState](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) Para formato do estado
 - [GraphStatus.PAUSED](../enums/orchestrators_graph_core_enums_graphEngine_enum.GraphStatus.md#paused) Para status de pausa
 - [()](orchestrators_graph_core_GraphEngine.GraphEngine.md#execute) Para execução inicial

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:613](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L613)

___

### runNode

▸ **runNode**(`nodeName`, `node`, `state`): `Promise`\<[`GraphNodeResult`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md)\>

Executa um nó individual do grafo.

Método interno que chama a função do nó com o estado atual
e trata erros de execução, garantindo que falhas em nós
individuais não quebrem toda a execução do grafo.

Em vez de parar a execução com status ERROR, adicionamos
a mensagem de erro ao histórico para que o agente possa
tentar outra abordagem.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodeName` | `string` | - |
| `node` | [`GraphNode`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNode.md) | Função do nó a ser executada. Deve aceitar estado atual e GraphEngine como parâmetros. |
| `state` | [`IGraphState`](../interfaces/orchestrators_graph_core_interfaces_graphState_interface.IGraphState.md) | Estado atual do grafo. Passado para o nó para que possa tomar decisões baseadas no contexto. |

#### Returns

`Promise`\<[`GraphNodeResult`](../interfaces/orchestrators_graph_core_interfaces_graphEngine_interface.GraphNodeResult.md)\>

Promise com resultado da execução do nó.
Em caso de erro, retorna mensagem de erro para o agente.

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:659](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L659)

___

### setChatHistoryManager

▸ **setChatHistoryManager**(`manager`): `void`

Substitui o ChatHistoryManager do grafo.

Permite ao desenvolvedor substituir o gerenciador de memória
durante a execução do grafo, útil para implementar estratégias
de compressão, persistência ou otimização de contexto.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `manager` | [`IChatHistoryManager`](../interfaces/memory_memory_interface.IChatHistoryManager.md) | O novo ChatHistoryManager a ser utilizado. |

#### Returns

`void`

**`Throws`**

Se o manager fornecido for inválido

**`Example`**

```typescript
const engine = new GraphEngine(graphDefinition);

// Criar gerenciador com histórico compactado
const compactedManager = new ChatHistoryManager({
  maxContextTokens: 200000,
  tokenizer: new TokenizerService('gpt-4')
});

// Importar mensagens compactadas
compactedManager.importHistory(compactedMessages);

// Substituir o gerenciador do grafo
engine.setChatHistoryManager(compactedManager);
```

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:1012](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L1012)

___

### syncMessagesToChatHistory

▸ **syncMessagesToChatHistory**(`messages`): `void`

Sincroniza mensagens para o ChatHistoryManager.

Método interno que adiciona todas as mensagens do array
fornecido ao ChatHistoryManager, garantindo que o
histórico esteja consistente com o estado do grafo.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messages` | [`Message`](../interfaces/memory_memory_interface.Message.md)[] | Array de mensagens para sincronizar. |

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:402](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L402)

___

### syncStateFromChatHistory

▸ **syncStateFromChatHistory**(): `void`

Sincroniza estado do grafo com histórico de chat.

Método interno que atualiza o estado do grafo baseado nas
mensagens mais recentes do ChatHistoryManager. Atualmente
apenas obtém o histórico trimado (implementação futura
pode usar este histórico para atualizar estado).

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:321](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/orchestrators/graph/core/GraphEngine.ts#L321)
