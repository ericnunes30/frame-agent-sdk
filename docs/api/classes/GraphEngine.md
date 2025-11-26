# Class: GraphEngine

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

 - [GraphDefinition](../interfaces/GraphDefinition.md) Para definição de grafos
 - [IGraphState](../interfaces/IGraphState.md) Para estado do grafo
 - [GraphStatus](../enums/GraphStatus.md) Para status de execução

## Table of contents

### Constructors

- [constructor](GraphEngine.md#constructor)

### Properties

- [chatHistoryManager](GraphEngine.md#chathistorymanager)
- [definition](GraphEngine.md#definition)
- [llmConfig](GraphEngine.md#llmconfig)
- [maxSteps](GraphEngine.md#maxsteps)
- [moduleName](GraphEngine.md#modulename)
- [tokenizerService](GraphEngine.md#tokenizerservice)

### Methods

- [addMessage](GraphEngine.md#addmessage)
- [applyPause](GraphEngine.md#applypause)
- [assertMaxSteps](GraphEngine.md#assertmaxsteps)
- [bootstrapState](GraphEngine.md#bootstrapstate)
- [ensureChatHistoryManager](GraphEngine.md#ensurechathistorymanager)
- [execute](GraphEngine.md#execute)
- [getMessagesForLLM](GraphEngine.md#getmessagesforllm)
- [mergeLogs](GraphEngine.md#mergelogs)
- [mergeMessages](GraphEngine.md#mergemessages)
- [mergeState](GraphEngine.md#mergestate)
- [resolveNext](GraphEngine.md#resolvenext)
- [resume](GraphEngine.md#resume)
- [runNode](GraphEngine.md#runnode)
- [syncMessagesToChatHistory](GraphEngine.md#syncmessagestochathistory)
- [syncStateFromChatHistory](GraphEngine.md#syncstatefromchathistory)

## Constructors

### constructor

• **new GraphEngine**(`definition`, `options?`, `llmConfig?`): [`GraphEngine`](GraphEngine.md)

Construtor do GraphEngine.

Inicializa o motor de execução com a definição do grafo e opções
de configuração, incluindo gerenciamento de histórico e limites
de execução.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `definition` | [`GraphDefinition`](../interfaces/GraphDefinition.md) | Definição completa do grafo a ser executado. Deve incluir nós, arestas e ponto de entrada válidos. |
| `options?` | `Object` | Opções adicionais de configuração. - maxSteps: Limite máximo de passos para evitar loops infinitos - chatHistoryManager: Gerenciador de histórico customizado |
| `options.chatHistoryManager?` | [`IChatHistoryManager`](../interfaces/IChatHistoryManager.md) | - |
| `options.maxSteps?` | `number` | - |
| `llmConfig?` | [`AgentLLMConfig`](../interfaces/AgentLLMConfig.md) | Configuração opcional do LLM. Usada para criar TokenizerService e gerenciar contexto. |

#### Returns

[`GraphEngine`](GraphEngine.md)

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

 - [GraphDefinition](../interfaces/GraphDefinition.md) Para formato da definição
 - [IChatHistoryManager](../interfaces/IChatHistoryManager.md) Para gerenciamento de histórico
 - [AgentLLMConfig](../interfaces/AgentLLMConfig.md) Para configuração do LLM

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:136](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L136)

## Properties

### chatHistoryManager

• `Private` `Optional` **chatHistoryManager**: [`IChatHistoryManager`](../interfaces/IChatHistoryManager.md)

Gerenciador de histórico de chat

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:88](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L88)

___

### definition

• `Private` `Readonly` **definition**: [`GraphDefinition`](../interfaces/GraphDefinition.md)

Definição completa do grafo a ser executado

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:82](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L82)

___

### llmConfig

• `Private` `Optional` `Readonly` **llmConfig**: [`AgentLLMConfig`](../interfaces/AgentLLMConfig.md)

Configuração do LLM (opcional)

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:92](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L92)

___

### maxSteps

• `Private` `Optional` `Readonly` **maxSteps**: `number`

Limite máximo de passos de execução

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:84](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L84)

___

### moduleName

• `Private` `Readonly` **moduleName**: ``"GraphEngine"``

Nome do módulo para logging

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:86](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L86)

___

### tokenizerService

• `Private` `Optional` **tokenizerService**: [`TokenizerService`](TokenizerService.md)

Serviço de tokenização para gerenciamento de contexto

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:90](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L90)

## Methods

### addMessage

▸ **addMessage**(`message`): `void`

Adiciona uma mensagem ao histórico de chat do grafo.

Método utilitário para adicionar mensagens ao ChatHistoryManager
interno, permitindo que o grafo mantenha contexto durante a execução.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](../interfaces/Message.md) | Mensagem a ser adicionada ao histórico. Deve seguir o formato padrão de Message do sistema. |

#### Returns

`void`

**`Example`**

```typescript
const engine = new GraphEngine(graphDefinition);

// Adicionar mensagem do usuário
engine.addMessage({
  role: 'user',
  content: 'Preciso de ajuda com análise de dados'
});

// Adicionar resposta do assistente
engine.addMessage({
  role: 'assistant',
  content: 'Claro! Posso ajudar com análise de dados. Que tipo de análise você precisa?'
});
```

**`See`**

[Message](../interfaces/Message.md) Para formato das mensagens

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:187](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L187)

___

### applyPause

▸ **applyPause**(`state`): [`IGraphState`](../interfaces/IGraphState.md)

Aplica controle de pausa ao estado.

Método interno que verifica se o estado deve ser pausado
baseado em shouldPause ou pendingAskUser, alterando o status
para PAUSED quando necessário.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`IGraphState`](../interfaces/IGraphState.md) | Estado atual do grafo. |

#### Returns

[`IGraphState`](../interfaces/IGraphState.md)

Estado com status atualizado se necessário.

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:646](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L646)

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

[src/orchestrators/graph/core/GraphEngine.ts:758](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L758)

___

### bootstrapState

▸ **bootstrapState**(`state`, `entryPoint`): [`IGraphState`](../interfaces/IGraphState.md)

Inicializa estado do grafo para execução.

Método interno que prepara o estado inicial do grafo,
definindo valores padrão para propriedades não fornecidas
e configurando status de execução.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`IGraphState`](../interfaces/IGraphState.md) | Estado fornecido pelo usuário. |
| `entryPoint` | `string` | Nome do nó de entrada do grafo. |

#### Returns

[`IGraphState`](../interfaces/IGraphState.md)

Estado inicializado para execução.

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:725](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L725)

___

### ensureChatHistoryManager

▸ **ensureChatHistoryManager**(`initialState`): `void`

Garante que o ChatHistoryManager está inicializado.

Método interno que verifica se o ChatHistoryManager existe,
criando um novo se necessário usando o TokenizerService
e configurando com base no LLM config fornecido.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialState` | [`IGraphState`](../interfaces/IGraphState.md) | Estado inicial do grafo. Usado para sincronizar mensagens iniciais se um novo ChatHistoryManager for criado. |

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:268](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L268)

___

### execute

▸ **execute**(`initialState`): `Promise`\<[`GraphRunResult`](../interfaces/GraphRunResult.md)\>

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
| `initialState` | [`IGraphState`](../interfaces/IGraphState.md) | Estado inicial do grafo. Deve incluir mensagens, dados e metadados iniciais. |

#### Returns

`Promise`\<[`GraphRunResult`](../interfaces/GraphRunResult.md)\>

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

 - [IGraphState](../interfaces/IGraphState.md) Para formato do estado
 - [GraphRunResult](../interfaces/GraphRunResult.md) Para formato do resultado
 - [GraphStatus](../enums/GraphStatus.md) Para status possíveis

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:360](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L360)

___

### getMessagesForLLM

▸ **getMessagesForLLM**(): [`Message`](../interfaces/Message.md)[]

Obtém mensagens do histórico para envio ao LLM.

Retorna o histórico de mensagens trimado e otimizado para
envio aos modelos de linguagem, respeitando limites de tokens
e mantendo contexto relevante.

#### Returns

[`Message`](../interfaces/Message.md)[]

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

 - [Message](../interfaces/Message.md) Para formato das mensagens
 - [()](../interfaces/IChatHistoryManager.md#gettrimmedhistory) Para detalhes do trim

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:226](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L226)

___

### mergeLogs

▸ **mergeLogs**(`state`, `logs?`): [`IGraphState`](../interfaces/IGraphState.md)

Combina logs com o estado do grafo.

Método utilitário interno para adicionar logs ao estado.
Atualmente não é usado diretamente (funcionalidade incorporada
em mergeState), mas mantido para extensibilidade futura.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`IGraphState`](../interfaces/IGraphState.md) | Estado atual do grafo. |
| `logs?` | `string`[] | Logs para adicionar. |

#### Returns

[`IGraphState`](../interfaces/IGraphState.md)

Estado com logs adicionados.

**`Deprecated`**

Use mergeState diretamente

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:627](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L627)

___

### mergeMessages

▸ **mergeMessages**(`state`, `messages?`): [`IGraphState`](../interfaces/IGraphState.md)

Combina mensagens com o estado do grafo.

Método utilitário interno para adicionar mensagens ao estado.
Atualmente não é usado diretamente (funcionalidade incorporada
em mergeState), mas mantido para extensibilidade futura.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`IGraphState`](../interfaces/IGraphState.md) | Estado atual do grafo. |
| `messages?` | [`Message`](../interfaces/Message.md)[] | Mensagens para adicionar. |

#### Returns

[`IGraphState`](../interfaces/IGraphState.md)

Estado com mensagens adicionadas.

**`Deprecated`**

Use mergeState diretamente

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:607](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L607)

___

### mergeState

▸ **mergeState**(`state`, `delta`): [`IGraphState`](../interfaces/IGraphState.md)

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
| `state` | [`IGraphState`](../interfaces/IGraphState.md) | Estado atual do grafo. |
| `delta` | `Partial`\<[`IGraphState`](../interfaces/IGraphState.md)\> & \{ `logs?`: `string`[] ; `shouldEnd?`: `boolean` ; `shouldPause?`: `boolean`  } | Resultado parcial do nó executado. Pode incluir mensagens, data, metadata, logs e controles de fluxo. |

#### Returns

[`IGraphState`](../interfaces/IGraphState.md)

Novo estado combinado.

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:537](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L537)

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
| `state` | [`IGraphState`](../interfaces/IGraphState.md) | Estado atual do grafo (usado para arestas condicionais). |
| `override?` | `string` | Próximo nó forçado (opcional). |

#### Returns

`string`

Nome do próximo nó a executar.

**`Throws`**

Error se aresta não definida ou retorno condicional vazio.

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:685](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L685)

___

### resume

▸ **resume**(`savedState`, `userInput?`): `Promise`\<[`GraphRunResult`](../interfaces/GraphRunResult.md)\>

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
| `savedState` | [`IGraphState`](../interfaces/IGraphState.md) | Estado salvo do grafo pausado. Deve ter status PAUSED e conter informações suficientes para retomar a execução. |
| `userInput?` | [`Message`](../interfaces/Message.md) | Mensagem opcional do usuário para prosseguir. Adicionada ao histórico e incluída no estado para o próximo nó. |

#### Returns

`Promise`\<[`GraphRunResult`](../interfaces/GraphRunResult.md)\>

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

 - [IGraphState](../interfaces/IGraphState.md) Para formato do estado
 - [GraphStatus.PAUSED](../enums/GraphStatus.md#paused) Para status de pausa
 - [()](GraphEngine.md#execute) Para execução inicial

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:458](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L458)

___

### runNode

▸ **runNode**(`node`, `state`): `Promise`\<[`GraphNodeResult`](../interfaces/GraphNodeResult.md)\>

Executa um nó individual do grafo.

Método interno que chama a função do nó com o estado atual
e trata erros de execução, garantindo que falhas em nós
individuais não quebrem toda a execução do grafo.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`GraphNode`](../interfaces/GraphNode.md) | Função do nó a ser executada. Deve aceitar estado atual e GraphEngine como parâmetros. |
| `state` | [`IGraphState`](../interfaces/IGraphState.md) | Estado atual do grafo. Passado para o nó para que possa tomar decisões baseadas no contexto. |

#### Returns

`Promise`\<[`GraphNodeResult`](../interfaces/GraphNodeResult.md)\>

Promise com resultado da execução do nó.
Em caso de erro, retorna estado de erro com logs.

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:500](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L500)

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
| `messages` | [`Message`](../interfaces/Message.md)[] | Array de mensagens para sincronizar. |

#### Returns

`void`

#### Defined in

[src/orchestrators/graph/core/GraphEngine.ts:306](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L306)

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

[src/orchestrators/graph/core/GraphEngine.ts:245](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/orchestrators/graph/core/GraphEngine.ts#L245)
