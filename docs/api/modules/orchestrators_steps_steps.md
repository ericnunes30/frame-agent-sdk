# Module: orchestrators/steps/steps

## Table of contents

### Functions

- [createStepAgent](orchestrators_steps_steps.md#createstepagent)
- [createStepSubflow](orchestrators_steps_steps.md#createstepsubflow)
- [stepAgent](orchestrators_steps_steps.md#stepagent)
- [stepAgentCustom](orchestrators_steps_steps.md#stepagentcustom)
- [stepFinalize](orchestrators_steps_steps.md#stepfinalize)

## Functions

### createStepAgent

▸ **createStepAgent**(`id`, `config`): [`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

Cria um step de agente com suporte a LLMConfig.
Similar ao createAgentNode do Graph Engine.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | ID do step |
| `config` | [`AgentStepConfig`](../interfaces/orchestrators_steps_interfaces.AgentStepConfig.md) | Configuração do agente (pode incluir LLMConfig) |

#### Returns

[`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

Step configurado

#### Defined in

[src/orchestrators/steps/steps.ts:36](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/steps.ts#L36)

___

### createStepSubflow

▸ **createStepSubflow**(`id`, `args`): [`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

Cria um step que executa um subfluxo e aplica SharedPatch em data.shared.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `args` | `Object` |
| `args.flowId` | `string` |
| `args.runner` | [`FlowRunner`](../interfaces/flows_interfaces_flowRunner_interface.FlowRunner.md) |

#### Returns

[`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

#### Defined in

[src/orchestrators/steps/steps.ts:120](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/steps.ts#L120)

___

### stepAgent

▸ **stepAgent**(`id`): [`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

Step que invoca o AgentLLM usando a memória atual.
Usa o AgentLLM injetado nas dependências.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

[`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

#### Defined in

[src/orchestrators/steps/steps.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/steps.ts#L12)

___

### stepAgentCustom

▸ **stepAgentCustom**(`id`, `opts`): [`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

Step que cria um AgentLLM customizado para esse step específico.
Útil quando você precisa usar modelo/provider diferente por step.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `opts` | [`StepProviderOptions`](../interfaces/orchestrators_steps_interfaces.StepProviderOptions.md) |

#### Returns

[`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

#### Defined in

[src/orchestrators/steps/steps.ts:88](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/steps.ts#L88)

___

### stepFinalize

▸ **stepFinalize**(`id`, `fromStateKey`): [`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

Step que finaliza a orquestração com valor do estado.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `fromStateKey` | `string` |

#### Returns

[`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

#### Defined in

[src/orchestrators/steps/steps.ts:75](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/orchestrators/steps/steps.ts#L75)
