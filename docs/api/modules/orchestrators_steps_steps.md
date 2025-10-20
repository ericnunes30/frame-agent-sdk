# Module: orchestrators/steps/steps

## Table of contents

### Functions

- [FinalizeStep](orchestrators_steps_steps.md#finalizestep)
- [LLMCallStep](orchestrators_steps_steps.md#llmcallstep)
- [LLMCallStepWithProvider](orchestrators_steps_steps.md#llmcallstepwithprovider)

## Functions

### FinalizeStep

▸ **FinalizeStep**(`id`, `fromStateKey`): [`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

Step utilitário para finalizar a orquestração, definindo uma resposta final
a partir de uma chave do estado compartilhado.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `fromStateKey` | `string` |

#### Returns

[`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

#### Defined in

orchestrators/steps/steps.ts:26

___

### LLMCallStep

▸ **LLMCallStep**(`id`): [`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

Step simples que invoca o LLM usando a memória atual (mensagens truncadas)
e salva a resposta no histórico.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

[`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

#### Defined in

orchestrators/steps/steps.ts:11

___

### LLMCallStepWithProvider

▸ **LLMCallStepWithProvider**(`id`, `opts`): [`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

Step que permite escolher o provider por step (sem depender de variáveis globais).
Útil em cenários multi-agente/provedor.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `opts` | [`StepProviderOptions`](../interfaces/orchestrators_steps_interfaces.StepProviderOptions.md) |

#### Returns

[`Step`](../interfaces/orchestrators_steps_interfaces.Step.md)

#### Defined in

orchestrators/steps/steps.ts:39
