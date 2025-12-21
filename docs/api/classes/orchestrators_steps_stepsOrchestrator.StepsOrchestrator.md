# Class: StepsOrchestrator

[orchestrators/steps/stepsOrchestrator](../modules/orchestrators_steps_stepsOrchestrator.md).StepsOrchestrator

Orquestrador de steps sequenciais para agentes de IA.

Esta classe implementa um orquestrador mais simples que o GraphEngine,
focado na execução sequencial de steps predefinidos e fluxos de
agente único com suporte a diferentes modos de operação.

## Funcionalidades Principais

- **Execução Sequencial**: Processa steps em ordem definida
- **Saltos Controlados**: Suporte a jump/next para controle de fluxo
- **Modos de Agente**: Suporte a CHAT e REACT modes
- **Detecção de Ferramentas**: Integração com ToolDetector para SAP
- **Execução de Ferramentas**: Suporte a ToolExecutor para ferramentas
- **Gerenciamento de Estado**: Mantém estado entre steps

## Modos de Operação

- **CHAT**: Execução simples de um turno com LLM
- **REACT**: Loop iterativo com reasoning, action e observation
- **Custom**: Steps personalizados com lógica específica

## Casos de Uso

- **Workflows Lineares**: Processos que seguem uma sequência fixa
- **Formulários Multi-Step**: Coleta de informações em etapas
- **Pipelines Simples**: Processamento linear de dados
- **Agentes Conversacionais**: Chatbots com fluxos estruturados
- **Automação Básica**: Tarefas automatizadas sequenciais

**`Example`**

```typescript
import { StepsOrchestrator } from '@/orchestrators/steps/stepsOrchestrator';
import { createChatMemory } from '@/memory';
import { AgentLLM } from '@/agent/llm/agentLLM';

// Configurar dependências
const deps: StepsDeps = {
  memory: createChatMemory({ maxContextTokens: 4000 }),
  llm: new AgentLLM({ model: 'gpt-4', apiKey: '...' }),
  tools: []
};

// Configurar orquestrador
const config: StepsConfig = {
  mode: AGENT_MODES.CHAT,
  agentInfo: {
    name: 'Assistant',
    role: 'Helpful assistant',
    backstory: 'Friendly and knowledgeable'
  }
};

const orchestrator = new StepsOrchestrator(deps, config);

// Executar fluxo simples
const result = await orchestrator.runFlow('Hello! How can you help me?');
console.log('Resposta:', result.final);
```

**`See`**

 - [StepsConfig](../interfaces/orchestrators_steps_interfaces.StepsConfig.md) Para configuração do orquestrador
 - [Step](../interfaces/orchestrators_steps_interfaces.Step.md) Para definição de steps
 - [OrchestrationState](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md) Para estado da orquestração

## Implements

- [`IStepsOrchestrator`](../interfaces/orchestrators_steps_interfaces.IStepsOrchestrator.md)

## Table of contents

### Constructors

- [constructor](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#constructor)

### Properties

- [agentConfigs](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#agentconfigs)
- [config](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#config)
- [currentTraceContext](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#currenttracecontext)
- [deps](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#deps)
- [telemetry](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#telemetry)
- [trace](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#trace)
- [traceContextBase](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#tracecontextbase)

### Methods

- [addAgent](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#addagent)
- [emitTrace](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#emittrace)
- [executeAgents](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#executeagents)
- [getTraceContext](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#gettracecontext)
- [isLLMConfig](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#isllmconfig)
- [prepareDepsForAgent](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#preparedepsforagent)
- [run](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#run)
- [runFlow](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md#runflow)

## Constructors

### constructor

• **new StepsOrchestrator**(`deps`, `config`, `options?`): [`StepsOrchestrator`](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md)

Construtor do StepsOrchestrator.

Inicializa o orquestrador com suas dependências e configuração,
preparando-o para executar steps ou fluxos de agente.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deps` | [`StepsDeps`](../interfaces/orchestrators_steps_interfaces.StepsDeps.md) | Dependências necessárias (memory, llm, tools). |
| `config` | [`StepsConfig`](../interfaces/orchestrators_steps_interfaces.StepsConfig.md) | Configuração do orquestrador (mode, agentInfo, etc.). |
| `options?` | `Object` | - |
| `options.telemetry?` | [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md) | Opções de telemetria (volume/persistência/redaction) (opcional). |
| `options.trace?` | [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md) | Sink de telemetria (push) em tempo real (opcional). |
| `options.traceContext?` | `Omit`\<[`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md), ``"runId"`` \| ``"parentRunId"`` \| ``"orchestrator"``\> | Contexto base de telemetria (sem runId/orchestrator) (opcional). |

#### Returns

[`StepsOrchestrator`](orchestrators_steps_stepsOrchestrator.StepsOrchestrator.md)

**`Example`**

```typescript
const orchestrator = new StepsOrchestrator(deps, config);
```

**`See`**

 - [StepsDeps](../interfaces/orchestrators_steps_interfaces.StepsDeps.md) Para dependências necessárias
 - [StepsConfig](../interfaces/orchestrators_steps_interfaces.StepsConfig.md) Para configuração disponível

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:109](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L109)

## Properties

### agentConfigs

• `Private` `Readonly` **agentConfigs**: [`AgentStepConfig`](../interfaces/orchestrators_steps_interfaces.AgentStepConfig.md)[] = `[]`

Lista de agentes para execução sequencial

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:86](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L86)

___

### config

• `Private` `Readonly` **config**: [`StepsConfig`](../interfaces/orchestrators_steps_interfaces.StepsConfig.md)

Configuração do orquestrador

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:84](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L84)

___

### currentTraceContext

• `Private` `Optional` **currentTraceContext**: [`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md)

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:90](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L90)

___

### deps

• `Private` `Readonly` **deps**: [`StepsDeps`](../interfaces/orchestrators_steps_interfaces.StepsDeps.md)

Dependências necessárias para execução

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:82](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L82)

___

### telemetry

• `Private` `Optional` `Readonly` **telemetry**: [`TelemetryOptions`](../interfaces/telemetry_interfaces_telemetryOptions_interface.TelemetryOptions.md)

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:88](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L88)

___

### trace

• `Private` `Readonly` **trace**: [`TraceSink`](../interfaces/telemetry_interfaces_traceSink_interface.TraceSink.md)

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:87](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L87)

___

### traceContextBase

• `Private` `Optional` `Readonly` **traceContextBase**: `Omit`\<[`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md), ``"runId"`` \| ``"parentRunId"`` \| ``"orchestrator"``\>

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:89](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L89)

## Methods

### addAgent

▸ **addAgent**(`config`): `this`

Adiciona um agente na sequencia.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`AgentStepConfig`](../interfaces/orchestrators_steps_interfaces.AgentStepConfig.md) | Config do agente. |

#### Returns

`this`

#### Implementation of

[IStepsOrchestrator](../interfaces/orchestrators_steps_interfaces.IStepsOrchestrator.md).[addAgent](../interfaces/orchestrators_steps_interfaces.IStepsOrchestrator.md#addagent)

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:172](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L172)

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

[src/orchestrators/steps/stepsOrchestrator.ts:154](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L154)

___

### executeAgents

▸ **executeAgents**(`input`): `Promise`\<\{ `final`: `string` ; `pendingAskUser?`: \{ `details?`: `string` ; `question`: `string`  } ; `state`: [`OrchestrationState`](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md)  }\>

Executa uma sequência de agentes configurados.

Este método executa todos os agentes adicionados via addAgent() em sequência.
Cada agente é executado até sua conclusão antes de passar para o próximo.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` | Input inicial para o primeiro agente. |

#### Returns

`Promise`\<\{ `final`: `string` ; `pendingAskUser?`: \{ `details?`: `string` ; `question`: `string`  } ; `state`: [`OrchestrationState`](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md)  }\>

Resultado final da execução com estado e possível pendingAskUser.

**`Example`**

```typescript
const result = await orchestrator.executeAgents('Processar pedido');
console.log('Resultado:', result.final);
```

#### Implementation of

[IStepsOrchestrator](../interfaces/orchestrators_steps_interfaces.IStepsOrchestrator.md).[executeAgents](../interfaces/orchestrators_steps_interfaces.IStepsOrchestrator.md#executeagents)

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:192](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L192)

___

### getTraceContext

▸ **getTraceContext**(): [`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md)

Retorna o TraceContext atual (apenas durante `run()`).

#### Returns

[`TraceContext`](../interfaces/telemetry_interfaces_traceContext_interface.TraceContext.md)

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:150](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L150)

___

### isLLMConfig

▸ **isLLMConfig**(`obj`): obj is AgentLLMConfig

Verifica se um objeto é LLMConfig.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `any` | Objeto a verificar. |

#### Returns

obj is AgentLLMConfig

True se for LLMConfig, false se for instância AgentLLM.

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:285](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L285)

___

### prepareDepsForAgent

▸ **prepareDepsForAgent**(`agentConfig`): `Promise`\<[`StepsDeps`](../interfaces/orchestrators_steps_interfaces.StepsDeps.md)\>

Prepara as dependências para um agente específico.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `agentConfig` | [`AgentStepConfig`](../interfaces/orchestrators_steps_interfaces.AgentStepConfig.md) | Configuração do agente. |

#### Returns

`Promise`\<[`StepsDeps`](../interfaces/orchestrators_steps_interfaces.StepsDeps.md)\>

Dependências preparadas para o agente.

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:255](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L255)

___

### run

▸ **run**(`steps`, `userInput`): `Promise`\<\{ `final`: `string` ; `state`: [`OrchestrationState`](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md)  }\>

Executa uma sequência de steps predefinidos.

Este método executa uma lista de steps em ordem sequencial, permitindo
controle de fluxo através de jumps e next. Cada step recebe um contexto
contendo as dependências, configuração e estado atual da orquestração.

## Fluxo de Execução

1. **Inicialização**: Cria estado inicial vazio e adiciona input do usuário
2. **Iteração**: Executa cada step sequencialmente
3. **Controle de Fluxo**: Permite jumps para steps específicos via `next`
4. **Atualização de Estado**: Aplica dados retornados por cada step
5. **Finalização**: Retorna resultado final e estado completo

## Controle de Fluxo

- **Sequencial**: Por padrão, executa steps em ordem (0, 1, 2, ...)
- **Jump**: Step pode definir `res.next` para pular para step específico
- **Halt**: Step pode definir `res.halt` para parar execução
- **Mapeamento**: Jump usa ID dos steps para navegação

## Estado da Orquestração

- **data**: Objeto para dados persistentes entre steps
- **final**: String final retornada pelo último step executado
- **lastModelOutput**: Último output do modelo (se aplicável)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `steps` | [`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)[] | Lista de steps a serem executados sequencialmente. |
| `userInput` | `string` | Input inicial do usuário para o fluxo. |

#### Returns

`Promise`\<\{ `final`: `string` ; `state`: [`OrchestrationState`](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md)  }\>

Resultado da execução com final e estado completo.

**`Throws`**

Se step retornar resultado inválido ou houver erro na execução.

**`Example`**

```typescript
// Definir steps customizados
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

// Executar fluxo
const result = await orchestrator.run(steps, 'Preciso de ajuda');
console.log('Resultado:', result.final);
console.log('Estado:', result.state);
```

**`See`**

 - [Step](../interfaces/orchestrators_steps_interfaces.Step.md) Para definição de steps
 - [StepContext](../interfaces/orchestrators_steps_interfaces.StepContext.md) Para contexto disponível nos steps
 - [OrchestrationState](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md) Para estrutura do estado

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:361](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L361)

___

### runFlow

▸ **runFlow**(`userInput`, `opts?`): `Promise`\<\{ `final`: `string` ; `pendingAskUser?`: \{ `details?`: `string` ; `question`: `string`  } ; `state`: [`OrchestrationState`](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md)  }\>

Executa um fluxo completo de agente único com LLM.

Este é o método principal para executar fluxos de agente, suportando diferentes
modos de operação (CHAT e REACT). Utiliza o PromptBuilder para criar prompts
do sistema baseados na configuração e integra com o sistema de memória para
gerenciar o histórico da conversa.

## Modos de Operação

### CHAT Mode
- **Execução**: Turno único com LLM
- **Fluxo**: Input → System Prompt → LLM → Output
- **Uso**: Conversas simples, perguntas diretas, respostas imediatas
- **Memória**: Adiciona input do usuário e output do assistente ao histórico

### REACT Mode
- **Execução**: Loop iterativo com reasoning, action e observation
- **Fluxo**: Input → Thought → Action → Observation → (repeat)
- **Uso**: Tarefas complexas, uso de ferramentas, reasoning passo a passo
- **SAP**: Suporte a Structured Action Protocol para ferramentas
- **Limite**: Máximo de turnos configurável (padrão: 8)

## Funcionalidades Avançadas

- **Detecção de Ferramentas**: Parser automático para Structured Action Protocol
- **Execução de Ferramentas**: Integração com ToolExecutor para ferramentas
- **Gerenciamento de Memória**: Controle automático de tokens e histórico
- **Metadados**: Captura e armazenamento de metadados do LLM
- **Fluxo de Interrupção**: Suporte a ask_user para pausar e solicitar input

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

- **final_answer**: Finaliza a execução com resposta final
- **ask_user**: Pausa execução e solicita input do usuário
- **Outras**: Ferramentas customizadas via ToolExecutor

## Controle de Fluxo

- **Limite de Turnos**: Previne loops infinitos (configurável)
- **Budget de Tokens**: Para automaticamente se memória estiver esgotada
- **Tratamento de Erros**: Hints automáticos para formato incorreto
- **Finalização Natural**: Detecção automática de resposta final

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userInput` | `string` | Input inicial do usuário para o fluxo. |
| `opts?` | `Object` | Opções de configuração (maxTurns para modo REACT). |
| `opts.maxTurns?` | `number` | - |

#### Returns

`Promise`\<\{ `final`: `string` ; `pendingAskUser?`: \{ `details?`: `string` ; `question`: `string`  } ; `state`: [`OrchestrationState`](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md)  }\>

Resultado da execução com final, estado e possível pendingAskUser.

**`Throws`**

Se houver erro na comunicação com LLM ou execução de ferramentas.

**`Example`**

```typescript
// Modo CHAT - Conversa simples
const chatResult = await orchestrator.runFlow('Olá, como você está?');
console.log('Resposta:', chatResult.final);

// Modo REACT - Com ferramentas
const reactResult = await orchestrator.runFlow(
  'Preciso calcular 15% de 200 e depois pesquisar sobre o resultado',
  { maxTurns: 10 }
);
console.log('Resultado final:', reactResult.final);
console.log('Steps executados:', reactResult.state.data?.steps);

// Com ask_user - Fluxo interrompido
if (reactResult.pendingAskUser) {
  console.log('Pergunta pendente:', reactResult.pendingAskUser.question);
  // Aguardar resposta do usuário...
}
```

**`See`**

 - [AGENT_MODES](../modules/llmModes_modes.md#agent_modes) Para modos disponíveis (CHAT, REACT)
 - [PromptBuilder](promptBuilder_promptBuilder.PromptBuilder.md) Para construção de prompts do sistema
 - [ToolDetector](tools_core_toolDetector.ToolDetector.md) Para detecção de SAP
 - [ToolExecutor](tools_core_toolExecutor.ToolExecutor.md) Para execução de ferramentas
 - [OrchestrationState](../interfaces/orchestrators_steps_interfaces.OrchestrationState.md) Para estrutura do estado retornado

#### Defined in

[src/orchestrators/steps/stepsOrchestrator.ts:525](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/stepsOrchestrator.ts#L525)
