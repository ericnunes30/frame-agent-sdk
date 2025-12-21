# Class: default

[providers/providers/providerRegistry](../modules/providers_providers_providerRegistry.md).default

Registry estático centralizado para gerenciar provedores de LLM.

Esta classe implementa um sistema de registro que permite:
- Registro automático de provedores padrão
- Descoberta de provedores por nome
- Registro dinâmico de novos provedores
- Listagem de provedores disponíveis

## Provedores Padrão Registrados

- **openai**: Provedor oficial da OpenAI
- **gpt**: Alias para OpenAI (para modelos 'gpt-*')
- **openaiCompatible**: Provedores compatíveis com OpenAI

**`Example`**

```typescript
// Obter provedor registrado
const OpenAIConstructor = ProviderRegistry.getProvider('openai');
const provider = new OpenAIConstructor('sk-...');

// Listar provedores disponíveis
const providers = ProviderRegistry.listProviders();
console.log(providers); // ['openai', 'gpt', 'openaiCompatible']

// Registrar novo provedor
ProviderRegistry.registerProvider('custom', CustomProvider);
```

**`See`**

 - [ProviderConstructor](../interfaces/providers_providers_providerRegistry.ProviderConstructor.md) Para interface de construtores
 - [ProviderInstance](../interfaces/providers_providers_providerRegistry.ProviderInstance.md) Para interface de instâncias

## Table of contents

### Constructors

- [constructor](providers_providers_providerRegistry.default.md#constructor)

### Properties

- [providerMap](providers_providers_providerRegistry.default.md#providermap)

### Methods

- [getProvider](providers_providers_providerRegistry.default.md#getprovider)
- [hasProvider](providers_providers_providerRegistry.default.md#hasprovider)
- [listProviders](providers_providers_providerRegistry.default.md#listproviders)
- [registerProvider](providers_providers_providerRegistry.default.md#registerprovider)
- [unregisterProvider](providers_providers_providerRegistry.default.md#unregisterprovider)

## Constructors

### constructor

• **new default**(): [`default`](providers_providers_providerRegistry.default.md)

#### Returns

[`default`](providers_providers_providerRegistry.default.md)

## Properties

### providerMap

▪ `Static` `Private` **providerMap**: `Map`\<`string`, [`ProviderConstructor`](../interfaces/providers_providers_providerRegistry.ProviderConstructor.md)\>

Mapa interno de provedores registrados (nome → construtor)

#### Defined in

[src/providers/providers/providerRegistry.ts:83](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/providers/providerRegistry.ts#L83)

## Methods

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

 - [registerProvider](providers_providers_providerRegistry.default.md#registerprovider) Para registrar novos provedores
 - [listProviders](providers_providers_providerRegistry.default.md#listproviders) Para listar provedores disponíveis

#### Defined in

[src/providers/providers/providerRegistry.ts:135](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/providers/providerRegistry.ts#L135)

___

### hasProvider

▸ **hasProvider**(`name`): `boolean`

Verifica se um provedor está registrado.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Nome do provedor a ser verificado. |

#### Returns

`boolean`

true se o provedor estiver registrado, false caso contrário.

**`Example`**

```typescript
if (ProviderRegistry.hasProvider('openai')) {
  console.log('OpenAI está disponível');
}

if (!ProviderRegistry.hasProvider('anthropic')) {
  console.log('Anthropic não está disponível');
}
```

**`See`**

 - [getProvider](providers_providers_providerRegistry.default.md#getprovider) Para obter um provedor
 - [listProviders](providers_providers_providerRegistry.default.md#listproviders) Para listar todos os provedores

#### Defined in

[src/providers/providers/providerRegistry.ts:250](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/providers/providerRegistry.ts#L250)

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

 - [getProvider](providers_providers_providerRegistry.default.md#getprovider) Para obter um provedor específico
 - [registerProvider](providers_providers_providerRegistry.default.md#registerprovider) Para registrar novos provedores

#### Defined in

[src/providers/providers/providerRegistry.ts:168](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/providers/providerRegistry.ts#L168)

___

### registerProvider

▸ **registerProvider**(`name`, `constructor`): `void`

Registra um novo provedor no registry.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Nome único para identificar o provedor. |
| `constructor` | [`ProviderConstructor`](../interfaces/providers_providers_providerRegistry.ProviderConstructor.md) | Construtor do provedor a ser registrado. |

#### Returns

`void`

**`Throws`**

Se o nome já estiver em uso

**`Example`**

```typescript
// Registrar provedor customizado
class CustomProvider {
  name = 'custom';
  constructor(apiKey: string) { ... }
  async chatCompletion(config) { ... }
}

ProviderRegistry.registerProvider('custom', CustomProvider);

// Usar o provedor registrado
const CustomConstructor = ProviderRegistry.getProvider('custom');
const provider = new CustomConstructor('api-key');
```

**`See`**

 - [getProvider](providers_providers_providerRegistry.default.md#getprovider) Para obter um provedor registrado
 - [listProviders](providers_providers_providerRegistry.default.md#listproviders) Para listar provedores disponíveis

#### Defined in

[src/providers/providers/providerRegistry.ts:199](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/providers/providerRegistry.ts#L199)

___

### unregisterProvider

▸ **unregisterProvider**(`name`): `boolean`

Remove um provedor do registry.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Nome do provedor a ser removido. |

#### Returns

`boolean`

true se o provedor foi removido, false se não estava registrado.

**`Example`**

```typescript
// Remover provedor customizado
const removed = ProviderRegistry.unregisterProvider('custom');
console.log(removed); // true se foi removido

// Tentar remover provedor padrão (não recomendado)
ProviderRegistry.unregisterProvider('openai'); // false
```

**`See`**

[registerProvider](providers_providers_providerRegistry.default.md#registerprovider) Para registrar provedores

#### Defined in

[src/providers/providers/providerRegistry.ts:225](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/providers/providers/providerRegistry.ts#L225)
