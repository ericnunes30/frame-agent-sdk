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
    // CORREÇÃO: Tratar modelos zai-org/* como openai-compatible
    let providerName = config.model.split('-')[0];
    
    // Se for um modelo zai-org, usar openai-compatible provider
    if (config.model.startsWith('zai-org/')) {
      providerName = 'openaiCompatible';
    }

    // Logs padronizados
    console.log(`[ProviderAdapter] ProviderAdapter.chatCompletion | provider=${providerName} | model=${config.model}`);
    console.log(`[ProviderAdapter] ProviderAdapter.messages.count=${config.messages ? config.messages.length : 0}`);
    
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
    
    // Todas as mensagens completas sem truncamento
    if (config.messages && config.messages.length > 0) {
      console.log(`\n💬 MENSAGENS (${config.messages.length} total):`);
      console.log('-'.repeat(60));
      
      config.messages.forEach((msg: { role: string; content: string }, index: number) => {
        console.log(`\n[${index}] Role: ${msg.role.toUpperCase()}`);
        console.log(`    Content (${msg.content?.length || 0} caracteres):`);
        if (msg.content) {
          console.log('    ' + msg.content.split('\n').join('\n    '));
        }
        console.log('');
      });
      console.log('-'.repeat(60));
    }
    
    console.log('\n🚀 ENVIANDO REQUISIÇÃO AO LLM...');
    console.log('='.repeat(80) + '\n');
    
    // Logs originais truncados para debug
    if (config.systemPrompt) {
      const sp = config.systemPrompt;
      const preview = sp.length > 1000 ? `${sp.slice(0, 1000)}...` : sp;
      console.log(`[ProviderAdapter] ProviderAdapter.systemPrompt.length=${sp.length}`);
      console.log(`[ProviderAdapter] ProviderAdapter.systemPrompt.preview=${preview}`);
      
      // 🎯 LOG ADICIONAL PARA VALIDAR TRUNCAMENTO
      console.log('\n' + '⚠️' + '='.repeat(78));
      console.log('⚠️  VALIDAÇÃO DE TRUNCAMENTO DO SYSTEM PROMPT');
      console.log('='.repeat(80));
      console.log(`📊 Tamanho original: ${sp.length} caracteres`);
      console.log(`📊 Tamanho do preview: ${preview.length} caracteres`);
      console.log(`🔍 Preview truncado? ${sp.length > 1000 ? 'SIM' : 'NÃO'}`);
      console.log(`📋 Preview: "${preview}"`);
      console.log('='.repeat(80) + '\n');
    }
    
    if (config.messages && config.messages.length > 0) {
      const systemMessages = config.messages.filter(m => m.role === 'system');
      console.log(`[ProviderAdapter] ProviderAdapter.messages.system.count=${systemMessages.length}`);
      const userMessages = config.messages.filter(m => m.role === 'user');
      console.log(`[ProviderAdapter] ProviderAdapter.messages.user.count=${userMessages.length}`);
      const assistantMessages = config.messages.filter(m => m.role === 'assistant');
      console.log(`[ProviderAdapter] ProviderAdapter.messages.assistant.count=${assistantMessages.length}`);
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
