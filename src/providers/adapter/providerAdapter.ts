import { ProviderConfig } from './providerAdapter.interface';
import { getProvider } from '../providers';

/**
 * Adaptador genérico unificado para provedores de LLM.
 * 
 * Esta classe fornece uma interface consistente para interagir com diferentes
 * provedores de modelos de linguagem, abstraindo as diferenças entre APIs
 * e permitindo troca fácil entre provedores.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Interface Unificada**: API consistente independente do provedor
 * - **Auto-detecção**: Detecta automaticamente o provedor baseado no modelo
 * - **Fallback Inteligente**: Usa openaiCompatible para modelos desconhecidos com baseUrl
 * - **Logging Detalhado**: Log completo do prompt para debugging
 * - **Configuração Flexível**: Suporte a todos os parâmetros via ProviderConfig
 * 
 * ## Auto-detecção de Provedores
 * 
 * O ProviderAdapter infere o provedor baseado no prefixo do modelo:
 * - `gpt-4` → OpenAI
 * `claude-3-sonnet` → OpenAI Compatible (se baseUrl fornecida)
 * - `meta-llama/llama-3.1-70b` → OpenAI Compatible (se baseUrl fornecida)
 * 
 * @example
 * ```typescript
 * // Uso básico
 * const config: ProviderConfig = {
 *   model: 'gpt-4',
 *   messages: [{ role: 'user', content: 'Olá!' }],
 *   apiKey: 'sua-api-key'
 * };
 * 
 * const response = await ProviderAdapter.chatCompletion(config);
 * console.log(response.content);
 * 
 * // Com provedor compatível
 * const compatibleConfig: ProviderConfig = {
 *   model: 'claude-3-sonnet',
 *   messages: [...],
 *   apiKey: 'sua-api-key',
 *   baseUrl: 'https://api.anthropic.com'
 * };
 * 
 * const response2 = await ProviderAdapter.chatCompletion(compatibleConfig);
 * ```
 * 
 * @see {@link ProviderConfig} Para configuração completa
 * @see {@link ProviderRegistry} Para registro de provedores
 */
export class ProviderAdapter {
  /** 
   * Executa uma chamada de chat completion usando o provedor apropriado.
   * 
   * Este método é o ponto de entrada principal do ProviderAdapter. Ele:
   * 1. Infere o provedor baseado no modelo
   * 2. Aplica defaults para parâmetros não especificados
   * 3. Implementa fallback para provedores compatíveis
   * 4. Loga informações detalhadas para debugging
   * 5. Chama o provedor apropriado com configuração unificada
   * 
   * @param config Configuração completa do provedor.
   * Deve incluir model, messages, apiKey e pode incluir parâmetros opcionais.
   * 
   * @returns Resposta do provedor no formato unificado.
   * 
   * @throws {Error} Se o provedor não estiver registrado
   * @throws {Error} Se o provedor não implementar chatCompletion
   * @throws {Error} Se baseUrl for necessária mas não fornecida
   * 
   * @example
   * ```typescript
   * // Configuração básica
   * const response = await ProviderAdapter.chatCompletion({
   *   model: 'gpt-4',
   *   messages: [{ role: 'user', content: 'Explique IA' }],
   *   apiKey: 'sk-...',
   *   temperature: 0.7,
   *   maxTokens: 1000
   * });
   * 
   * // Com streaming
   * const streamingConfig = {
   *   model: 'gpt-4',
   *   messages: [...],
   *   apiKey: 'sk-...',
   *   stream: true
   * };
   * 
   * const streamResponse = await ProviderAdapter.chatCompletion(streamingConfig);
   * for await (const chunk of streamResponse) {
   *   process.stdout.write(chunk.content);
   * }
   * ```
   * 
   * @remarks
   * - O nome do provedor é extraído do prefixo do modelo (antes do primeiro '-')
   * - Parâmetros não especificados usam defaults inteligentes
   * - Modelos desconhecidos com baseUrl são tratados como openaiCompatible
   * - Log detalhado é emitido para debugging (pode ser desabilitado em produção)
   * 
   * @see {@link ProviderConfig} Para formato da configuração
   */
  static async chatCompletion(config: ProviderConfig): Promise<any> {
    // Inferir nome do provedor baseado no modelo
    let providerName = config.model.split('-')[0];

    // Aplicar defaults para parâmetros não especificados
    config.temperature = config.temperature ?? 0.7; // Default comum
    config.maxTokens = config.maxTokens ?? 2048;    // Default comum

    // Fallback inteligente: se provedor não existe mas temos baseUrl,
    // assumir provedor compatível com OpenAI (ex: OpenRouter, Claude, etc.)
    if (!ProviderAdapter.hasProvider(providerName) && config.baseUrl) {
      providerName = 'openaiCompatible';
    }

    // Log detalhado para debugging
    ProviderAdapter._logPromptDetails(providerName, config);

    // Obter e instanciar o provedor
    const ProviderClass: any = getProvider(providerName);
    const provider = new ProviderClass(config.apiKey);
    
    // Extrair nome do modelo sem o prefixo do provedor
    const model = config.model.startsWith(providerName + '-')
      ? config.model.slice(providerName.length + 1)
      : config.model;

    // Validar que o provedor implementa o método necessário
    if (typeof provider.chatCompletion !== 'function') {
      throw new Error(`Provedor para o modelo ${config.model} não implementa o método chatCompletion`);
    }

    // Chamar o provedor com configuração unificada
    return provider.chatCompletion({ ...config, model });
  }

  /** 
   * Verifica se um provedor está registrado e disponível.
   * 
   * @param providerName Nome do provedor a ser verificado.
   * 
   * @returns true se o provedor estiver registrado, false caso contrário.
   * 
   * @example
   * ```typescript
   * if (ProviderAdapter.hasProvider('openai')) {
   *   console.log('OpenAI está disponível');
   * }
   * 
   * if (ProviderAdapter.hasProvider('anthropic')) {
   *   console.log('Anthropic está disponível');
   * } else {
   *   console.log('Anthropic não está registrado');
   * }
   * ```
   */
  static hasProvider(providerName: string): boolean {
    try {
      getProvider(providerName);
      return true;
    } catch {
      return false;
    }
  }

  /** 
   * Log detalhado das informações do prompt para debugging.
   * 
   * @private
   * @param providerName Nome do provedor sendo usado
   * @param config Configuração completa
   */
  private static _logPromptDetails(providerName: string, config: ProviderConfig): void {
    console.log('\n' + '='.repeat(80));
    console.log('🤖 PROMPT COMPLETO ANTES DA CHAMADA AO LLM');
    console.log('='.repeat(80));
    console.log(`📋 Provider: ${providerName}`);
    console.log(`🎯 Modelo: ${config.model}`);
    console.log(`🌡️  Temperatura: ${config.temperature || 'default'}`);
    console.log(`🔢 Max Tokens: ${config.maxTokens || 'default'}`);
    console.log('='.repeat(80));

    // Log do system prompt completo
    if (config.systemPrompt) {
      console.log('\n📄 SYSTEM PROMPT COMPLETO:');
      console.log('-'.repeat(60));
      console.log(config.systemPrompt);
      console.log('-'.repeat(60));
    }

    // Log das mensagens (preview)
    if (config.messages && config.messages.length > 0) {
      console.log('\n💬 MENSAGENS DA CONVERSA:');
      console.log('-'.repeat(60));
      config.messages.forEach((msg, index) => {
        console.log(`${index + 1}. [${msg.role}] ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`);
      });
      console.log('-'.repeat(60));
    }
  }
}
