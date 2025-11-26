import { OpenAIProvider } from '@/providers/providers/openAiProvider';
import { OpenAICompatibleProvider } from '@/providers/providers/openaiCompatibleProvider';
// import { AnthropicProvider } from './anthropicProvider';

/**
 * Interfaces para o sistema de registro de provedores
 * 
 * Define os contratos para construtores e instâncias de provedores,
 * permitindo um sistema flexível de registro e descoberta.
 */

/** 
 * Interface para construtores de provedores.
 * Qualquer provedor deve implementar esta interface para ser registrado.
 */
export interface ProviderConstructor {
  /** 
   * Construtor do provedor que aceita parâmetros específicos.
   * @param args Argumentos específicos do provedor (ex: apiKey)
   */
  new(...args: any[]): any;
}

/** 
 * Interface para instâncias de provedores.
 * Define a estrutura mínima que uma instância de provedor deve ter.
 */
export interface ProviderInstance {
  /** Nome identificador do provedor */
  name: string;
  
  /** Método principal para chat completion */
  chatCompletion: (...args: any[]) => Promise<any>;
  
  /** Propriedades adicionais específicas do provedor */
  [key: string]: any;
}

/** 
 * Lista de provedores disponíveis para registro automático.
 * Esta lista é usada para inicializar o registry com provedores padrão.
 */
const providerList = [
  OpenAIProvider,
  OpenAICompatibleProvider,
  // AnthropicProvider, // Descomente quando implementado
];

/**
 * Registry estático centralizado para gerenciar provedores de LLM.
 * 
 * Esta classe implementa um sistema de registro que permite:
 * - Registro automático de provedores padrão
 * - Descoberta de provedores por nome
 * - Registro dinâmico de novos provedores
 * - Listagem de provedores disponíveis
 * 
 * ## Provedores Padrão Registrados
 * 
 * - **openai**: Provedor oficial da OpenAI
 * - **gpt**: Alias para OpenAI (para modelos 'gpt-*')
 * - **openaiCompatible**: Provedores compatíveis com OpenAI
 * 
 * @example
 * ```typescript
 * // Obter provedor registrado
 * const OpenAIConstructor = ProviderRegistry.getProvider('openai');
 * const provider = new OpenAIConstructor('sk-...');
 * 
 * // Listar provedores disponíveis
 * const providers = ProviderRegistry.listProviders();
 * console.log(providers); // ['openai', 'gpt', 'openaiCompatible']
 * 
 * // Registrar novo provedor
 * ProviderRegistry.registerProvider('custom', CustomProvider);
 * ```
 * 
 * @see {@link ProviderConstructor} Para interface de construtores
 * @see {@link ProviderInstance} Para interface de instâncias
 */
export default class ProviderRegistry {
  /** Mapa interno de provedores registrados (nome → construtor) */
  private static providerMap = new Map<string, ProviderConstructor>();

  /** 
   * Inicialização estática do registry.
   * Registra automaticamente todos os provedores padrão.
   */
  static {
    // Registrar provedores padrão
    ProviderRegistry.providerMap.set('openai', OpenAIProvider);
    
    // Alias comum para modelos OpenAI (gpt-4, gpt-3.5-turbo, etc.)
    ProviderRegistry.providerMap.set('gpt', OpenAIProvider);
    
    // Provedores compatíveis com OpenAI
    ProviderRegistry.providerMap.set('openaiCompatible', OpenAICompatibleProvider);
    
    // Anthropic (descomente quando implementado)
    // ProviderRegistry.providerMap.set('anthropic', AnthropicProvider);
  }

  /** 
   * Obtém o construtor de um provedor pelo nome registrado.
   * 
   * @param name Nome do provedor a ser obtido.
   * Deve corresponder a um provedor previamente registrado.
   * 
   * @returns Construtor do provedor solicitado.
   * 
   * @throws {Error} Se o provedor não estiver registrado
   * 
   * @example
   * ```typescript
   * // Obter provedor OpenAI
   * const OpenAIConstructor = ProviderRegistry.getProvider('openai');
   * const openaiProvider = new OpenAIConstructor('sk-...');
   * 
   * // Obter provedor compatível
   * const CompatibleConstructor = ProviderRegistry.getProvider('openaiCompatible');
   * const compatibleProvider = new CompatibleConstructor('api-key');
   * 
   * // Tentar obter provedor inexistente
   * try {
   *   const UnknownConstructor = ProviderRegistry.getProvider('unknown');
   * } catch (error) {
   *   console.error(error.message); // "O provedor 'unknown' não está registrado."
   * }
   * ```
   * 
   * @see {@link registerProvider} Para registrar novos provedores
   * @see {@link listProviders} Para listar provedores disponíveis
   */
  public static getProvider(name: string): ProviderConstructor {
    const ProviderClass = ProviderRegistry.providerMap.get(name);
    if (!ProviderClass) {
      const availableProviders = Array.from(ProviderRegistry.providerMap.keys());
      throw new Error(
        `O provedor '${name}' não está registrado. ` +
        `Provedores disponíveis: ${availableProviders.join(', ')}`
      );
    }
    return ProviderClass;
  }

  /** 
   * Lista todos os nomes dos provedores registrados.
   * 
   * @returns Array com os nomes de todos os provedores disponíveis.
   * 
   * @example
   * ```typescript
   * const providers = ProviderRegistry.listProviders();
   * console.log(providers);
   * // ['openai', 'gpt', 'openaiCompatible']
   * 
   * // Verificar se um provedor está disponível
   * const availableProviders = ProviderRegistry.listProviders();
   * if (availableProviders.includes('anthropic')) {
   *   console.log('Anthropic está disponível');
   * }
   * ```
   * 
   * @see {@link getProvider} Para obter um provedor específico
   * @see {@link registerProvider} Para registrar novos provedores
   */
  public static listProviders(): string[] {
    return Array.from(ProviderRegistry.providerMap.keys());
  }

  /** 
   * Registra um novo provedor no registry.
   * 
   * @param name Nome único para identificar o provedor.
   * @param constructor Construtor do provedor a ser registrado.
   * 
   * @throws {Error} Se o nome já estiver em uso
   * 
   * @example
   * ```typescript
   * // Registrar provedor customizado
   * class CustomProvider {
   *   name = 'custom';
   *   constructor(apiKey: string) { ... }
   *   async chatCompletion(config) { ... }
   * }
   * 
   * ProviderRegistry.registerProvider('custom', CustomProvider);
   * 
   * // Usar o provedor registrado
   * const CustomConstructor = ProviderRegistry.getProvider('custom');
   * const provider = new CustomConstructor('api-key');
   * ```
   * 
   * @see {@link getProvider} Para obter um provedor registrado
   * @see {@link listProviders} Para listar provedores disponíveis
   */
  public static registerProvider(name: string, constructor: ProviderConstructor): void {
    if (ProviderRegistry.providerMap.has(name)) {
      throw new Error(`Provedor '${name}' já está registrado.`);
    }
    ProviderRegistry.providerMap.set(name, constructor);
  }

  /** 
   * Remove um provedor do registry.
   * 
   * @param name Nome do provedor a ser removido.
   * 
   * @returns true se o provedor foi removido, false se não estava registrado.
   * 
   * @example
   * ```typescript
   * // Remover provedor customizado
   * const removed = ProviderRegistry.unregisterProvider('custom');
   * console.log(removed); // true se foi removido
   * 
   * // Tentar remover provedor padrão (não recomendado)
   * ProviderRegistry.unregisterProvider('openai'); // false
   * ```
   * 
   * @see {@link registerProvider} Para registrar provedores
   */
  public static unregisterProvider(name: string): boolean {
    return ProviderRegistry.providerMap.delete(name);
  }

  /** 
   * Verifica se um provedor está registrado.
   * 
   * @param name Nome do provedor a ser verificado.
   * 
   * @returns true se o provedor estiver registrado, false caso contrário.
   * 
   * @example
   * ```typescript
   * if (ProviderRegistry.hasProvider('openai')) {
   *   console.log('OpenAI está disponível');
   * }
   * 
   * if (!ProviderRegistry.hasProvider('anthropic')) {
   *   console.log('Anthropic não está disponível');
   * }
   * ```
   * 
   * @see {@link getProvider} Para obter um provedor
   * @see {@link listProviders} Para listar todos os provedores
   */
  public static hasProvider(name: string): boolean {
    return ProviderRegistry.providerMap.has(name);
  }
}



