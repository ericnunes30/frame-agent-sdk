# Module: providers/providers

## Table of contents

### References

- [ProviderInstance](providers_providers.md#providerinstance)

### Functions

- [getProvider](providers_providers.md#getprovider)
- [listProviders](providers_providers.md#listproviders)

## References

### ProviderInstance

Re-exports [ProviderInstance](../interfaces/providers_providers_providerRegistry.ProviderInstance.md)

## Functions

### getProvider

▸ **getProvider**(`name`): [`ProviderConstructor`](../interfaces/providers_providers_providerRegistry.ProviderConstructor.md)

Obtém o construtor de um provedor pelo nome registrado.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Nome do provedor a ser obtido. Deve corresponder a um provedor previamente registrado. |

#### Returns

[`ProviderConstructor`](../interfaces/providers_providers_providerRegistry.ProviderConstructor.md)

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

 - [registerProvider](../classes/providers_providers_providerRegistry.default.md#registerprovider) Para registrar novos provedores
 - [listProviders](../classes/providers_providers_providerRegistry.default.md#listproviders) Para listar provedores disponíveis

#### Defined in

[src/providers/providers/index.ts:4](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/providers/index.ts#L4)

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

 - [getProvider](../classes/providers_providers_providerRegistry.default.md#getprovider) Para obter um provedor específico
 - [registerProvider](../classes/providers_providers_providerRegistry.default.md#registerprovider) Para registrar novos provedores

#### Defined in

[src/providers/providers/index.ts:5](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/providers/index.ts#L5)
