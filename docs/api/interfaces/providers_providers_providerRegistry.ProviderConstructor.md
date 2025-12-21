# Interface: ProviderConstructor

[providers/providers/providerRegistry](../modules/providers_providers_providerRegistry.md).ProviderConstructor

Interface para construtores de provedores.
Qualquer provedor deve implementar esta interface para ser registrado.

## Table of contents

### Constructors

- [constructor](providers_providers_providerRegistry.ProviderConstructor.md#constructor)

## Constructors

### constructor

• **new ProviderConstructor**(`...args`): `any`

Construtor do provedor que aceita parâmetros específicos.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...args` | `any`[] | Argumentos específicos do provedor (ex: apiKey) |

#### Returns

`any`

#### Defined in

[src/providers/providers/providerRegistry.ts:21](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/providers/providerRegistry.ts#L21)
