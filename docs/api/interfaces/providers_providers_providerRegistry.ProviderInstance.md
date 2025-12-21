# Interface: ProviderInstance

[providers/providers/providerRegistry](../modules/providers_providers_providerRegistry.md).ProviderInstance

Interface para instâncias de provedores.
Define a estrutura mínima que uma instância de provedor deve ter.

## Indexable

▪ [key: `string`]: `any`

Propriedades adicionais específicas do provedor

## Table of contents

### Properties

- [chatCompletion](providers_providers_providerRegistry.ProviderInstance.md#chatcompletion)
- [name](providers_providers_providerRegistry.ProviderInstance.md#name)

## Properties

### chatCompletion

• **chatCompletion**: (...`args`: `any`[]) => `Promise`\<`any`\>

Método principal para chat completion

#### Type declaration

▸ (`...args`): `Promise`\<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`Promise`\<`any`\>

#### Defined in

[src/providers/providers/providerRegistry.ts:33](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/providers/providerRegistry.ts#L33)

___

### name

• **name**: `string`

Nome identificador do provedor

#### Defined in

[src/providers/providers/providerRegistry.ts:30](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/providers/providerRegistry.ts#L30)
