import { ProviderConfig } from './providerAdapter.interface';
import { getProvider } from '../providers';
import { logger } from '../../utils';

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
    // CORREÇÃO: Tratar modelos zai-org/* como openai-compatible
    let providerName = config.model.split('-')[0];
    
    // Se for um modelo zai-org, usar openai-compatible provider
    if (config.model.startsWith('zai-org/')) {
      providerName = 'openaiCompatible';
    }

    // Logs de debug para verificar prompts
    logger.debug(`Provider: ${providerName}`, 'ProviderAdapter');
    logger.debug(`Model: ${config.model}`, 'ProviderAdapter');
    logger.debug(`Total messages: ${config.messages ? config.messages.length : 0}`, 'ProviderAdapter');
    
    // Verificar systemPrompt (passado separadamente)
    if (config.systemPrompt) {
      logger.debug(`SystemPrompt length: ${config.systemPrompt.length}`, 'ProviderAdapter');
      const systemPromptPreview = config.systemPrompt.substring(0, 100);
      logger.debug(`SystemPrompt preview: ${systemPromptPreview}...`, 'ProviderAdapter');
      if (config.systemPrompt.includes('Code Generator') || config.systemPrompt.includes('Code Critic')) {
        logger.debug(`System prompt detected in config.systemPrompt`, 'ProviderAdapter');
      }
    }
    
    if (config.messages && config.messages.length > 0) {
      const systemMessages = config.messages.filter(m => m.role === 'system');
      logger.debug(`System messages: ${systemMessages.length}`, 'ProviderAdapter');
      const userMessages = config.messages.filter(m => m.role === 'user');
      logger.debug(`User messages: ${userMessages.length}`, 'ProviderAdapter');
      const assistantMessages = config.messages.filter(m => m.role === 'assistant');
      logger.debug(`Assistant messages: ${assistantMessages.length}`, 'ProviderAdapter');
      
      // Mostrar conteúdo dos system messages
      systemMessages.forEach((msg, index) => {
        if (msg.content) {
          logger.debug(`System message ${index + 1} length: ${msg.content.length}`, 'ProviderAdapter');
          // Mostrar início do conteúdo para identificar se é o prompt do sistema
          const contentPreview = msg.content.substring(0, 100);
          logger.debug(`System message ${index + 1} preview: ${contentPreview}...`, 'ProviderAdapter');
          if (msg.content.includes('Code Generator') || msg.content.includes('Code Critic')) {
            logger.debug(`System prompt detected in message ${index + 1}`, 'ProviderAdapter');
          }
        }
      });
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
