import { ProviderConfig } from './provider.interface';
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
    const providerName = config.model.split('-')[0];
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
