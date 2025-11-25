import { OpenAIProvider } from '@/providers/providers/openAiProvider';
import { OpenAICompatibleProvider } from '@/providers/providers/openaiCompatibleProvider';
// import { AnthropicProvider } from './anthropicProvider';

/**
 * Interfaces para o registro de provedores
 */
export interface ProviderConstructor {
  new(...args: any[]): any;
}

export interface ProviderInstance {
  [key: string]: any;
}

const providerList = [
  OpenAIProvider,
  OpenAICompatibleProvider,
  // AnthropicProvider,
];

/**
 * Registry estático para gerenciar e fornecer provedores de IA.
 *
 * Registro estático de provedores de LLM.
 * - `getProvider(name)`: retorna o construtor do provedor
 * - `listProviders()`: lista os nomes disponíveis
 */
export default class ProviderRegistry {
  private static providerMap = new Map<string, ProviderConstructor>();

  // Inicializa o mapa uma única vez
  static {
    ProviderRegistry.providerMap.set('openai', OpenAIProvider);
    // Alias comum para modelos OpenAI usados como 'gpt-*'
    ProviderRegistry.providerMap.set('gpt', OpenAIProvider);
    ProviderRegistry.providerMap.set('openaiCompatible', OpenAICompatibleProvider);
    // ProviderRegistry.providerMap.set('anthropic', AnthropicProvider);
  }

  // Retorna o construtor do provedor (sem instanciar e sem exigir apiKey)
  /**
   * Obtém o construtor do provedor pelo nome registrado.
   * @throws Error se o provedor não estiver registrado
   */
  public static getProvider(name: string): ProviderConstructor {
    const ProviderClass = ProviderRegistry.providerMap.get(name);
    if (!ProviderClass) {
      throw new Error(`O provedor '${name}' não está registrado.`);
    }
    return ProviderClass;
  }

  /** Lista os nomes dos provedores registrados. */
  public static listProviders(): string[] {
    return Array.from(ProviderRegistry.providerMap.keys());
  }
}



