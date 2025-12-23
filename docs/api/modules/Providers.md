# Module: Providers

Módulo Providers - Integração Unificada com LLMs

Este módulo fornece um sistema completo para integração com diferentes
provedores de modelos de linguagem, oferecendo uma interface unificada
que abstrai as diferenças entre APIs e permite troca fácil entre provedores.

## Componentes Principais

- **ProviderAdapter**: Interface unificada para todos os provedores
- **ProviderConfig**: Configuração padronizada para provedores
- **IProviderResponse**: Resposta normalizada de qualquer provedor
- **OpenAIProvider**: Provedor oficial da OpenAI
- **OpenAICompatibleProvider**: Provedores compatíveis com OpenAI
- **ProviderRegistry**: Sistema de registro e descoberta de provedores
- **stream**: Utilitários para processamento de streams

## Uso Básico

```typescript
import { ProviderAdapter, ProviderConfig } from '@/providers';

// Configuração simples
const config: ProviderConfig = {
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Olá!' }],
  apiKey: 'sua-api-key'
};

// Chamada unificada
const response = await ProviderAdapter.chatCompletion(config);
console.log(response.content);

// Com provedor compatível
const compatibleConfig: ProviderConfig = {
  model: 'claude-3-sonnet',
  messages: [...],
  apiKey: 'sua-api-key',
  baseUrl: 'https://api.anthropic.com'
};

const response2 = await ProviderAdapter.chatCompletion(compatibleConfig);
```

## Table of contents

### References

- [IProviderResponse](Providers.md#iproviderresponse)
- [ProviderAdapter](Providers.md#provideradapter)
- [ProviderConfig](Providers.md#providerconfig)
- [ProviderInstance](Providers.md#providerinstance)
- [VisionNotSupportedError](Providers.md#visionnotsupportederror)
- [getProvider](Providers.md#getprovider)
- [listProviders](Providers.md#listproviders)
- [stream](Providers.md#stream)

## References

### IProviderResponse

Re-exports [IProviderResponse](../interfaces/providers_adapter_providerAdapter_interface.IProviderResponse.md)

___

### ProviderAdapter

Re-exports [ProviderAdapter](../classes/providers_adapter_providerAdapter.ProviderAdapter.md)

___

### ProviderConfig

Re-exports [ProviderConfig](../interfaces/providers_adapter_providerAdapter_interface.ProviderConfig.md)

___

### ProviderInstance

Re-exports [ProviderInstance](../interfaces/providers_providers_providerRegistry.ProviderInstance.md)

___

### VisionNotSupportedError

Re-exports [VisionNotSupportedError](../classes/providers_errors_visionNotSupportedError.VisionNotSupportedError.md)

___

### getProvider

Re-exports [getProvider](providers_providers.md#getprovider)

___

### listProviders

Re-exports [listProviders](providers_providers.md#listproviders)

___

### stream

Re-exports [stream](providers_utils_stream.md#stream)
