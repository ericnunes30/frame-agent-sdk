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

[src/providers/providers/providerRegistry.ts:21](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/providers/providers/providerRegistry.ts#L21)
