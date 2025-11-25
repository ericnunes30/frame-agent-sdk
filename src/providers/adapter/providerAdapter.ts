import { ProviderConfig } from './providerAdapter.interface';
import { getProvider } from '../providers';

/**
 * Adaptador genérico para provedores de LLM.
 * Expõe uma API unificada baseada em `ProviderConfig` e resolve o provider via `ProviderRegistry`.
 */
export class ProviderAdapter {
  /**
   * Chama um provedor registrado passando `ProviderConfig` completo.
   * - O nome do provider é inferido do prefixo de `config.model` (antes do primeiro '-')
   * - O provider recebe `ProviderConfig` com o `model` já sem o prefixo do provider
   * @returns Resposta normalizada do provedor
   */
  static async chatCompletion(config: ProviderConfig): Promise<any> {
    // CORREÇÃO: Tratar modelos desconhecidos como openai-compatible se houver baseUrl
    let providerName = config.model.split('-')[0];

    // Assign defaults if undefined
    config.temperature = config.temperature ?? 0.7; // Common default
    config.maxTokens = config.maxTokens ?? 2048; // Common default

    // Se o provedor inferido não existir (ex: 'meta' de 'meta-llama') e tivermos baseUrl,
    // assumimos que é um provedor compatível com OpenAI (ex: OpenRouter)
    if (!ProviderAdapter.hasProvider(providerName) && config.baseUrl) {
      providerName = 'openaiCompatible';
    }

    // LOG COMPLETO DO PROMPT ANTES DA CHAMADA AO LLM
    console.log('\n' + '='.repeat(80));
    console.log('🤖 PROMPT COMPLETO ANTES DA CHAMADA AO LLM');
    console.log('='.repeat(80));
    console.log(`📋 Provider: ${providerName}`);
    console.log(`🎯 Modelo: ${config.model}`);
    console.log(`🌡️  Temperatura: ${config.temperature || 'default'}`);
    console.log(`🔢 Max Tokens: ${config.maxTokens || 'default'}`);
    console.log('='.repeat(80));

    // System Prompt completo sem truncamento
    if (config.systemPrompt) {
      console.log('\n📄 SYSTEM PROMPT COMPLETO:');
      console.log('-'.repeat(60));
      console.log(config.systemPrompt);
      console.log('-'.repeat(60));
    }

    const ProviderClass: any = getProvider(providerName);
    const provider = new ProviderClass(config.apiKey);
    const model = config.model.startsWith(providerName + '-')
      ? config.model.slice(providerName.length + 1)
      : config.model;

    if (typeof provider.chatCompletion !== 'function') {
      throw new Error(`Provedor para o modelo ${config.model} não implementa o método chatCompletion`);
    }

    // Passa o objeto de configuração completo para o provedor (contrato unificado)
    return provider.chatCompletion({ ...config, model });
  }

  /**
   * Verifica se um provedor está disponível por nome.
   */
  static hasProvider(providerName: string): boolean {
    try {
      getProvider(providerName);
      return true;
    } catch {
      return false;
    }
  }
}
