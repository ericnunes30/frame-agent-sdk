import ProviderRegistry, { ProviderInstance } from './providerRegistry';

// Re-exporta as funções estáticas como named exports, mantendo a API pública
export const getProvider = ProviderRegistry.getProvider;
export const listProviders = ProviderRegistry.listProviders;

// Re-exporta o tipo ProviderInstance
export { ProviderInstance };
