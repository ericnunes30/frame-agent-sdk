// src/llm/llm.ts
import { ProviderAdapter } from '../providers/adapter/providerAdapter';
import type { Message } from '../memory';
import type { IProviderResponse } from '../providers/adapter/providerAdapter.interface';
import type { ProviderConfig } from '../providers/adapter/providerAdapter.interface';
import { PromptBuilder } from '../promptBuilder';
import type { PromptBuilderConfig, PromptMode, AgentInfo, ToolSchema } from '../promptBuilder';

/**
 * Parâmetros padrão por provedor (aplicados quando não informados na chamada).
 *
 * - temperature: temperatura do modelo (default sugerido 0.5)
 * - topP: nucleus sampling
 * - maxTokens: limite de tokens de saída
 */
interface ProviderDefaults {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}

/**
 * Cliente LLM baseado no ProviderAdapter.
 * Mantém `model` e `apiKey` fixos e aplica opções a cada chamada.
 *
 * Use `invoke` com `mode` e `agentInfo` obrigatórios para gerar o systemPrompt
 * via PromptBuilder internamente (ex.: modo 'react', 'chat', etc.).
 */
export class LLM {
  private readonly model: string;
  private readonly apiKey: string;
  private readonly defaults: ProviderDefaults;
  private readonly baseUrl?: string;

  /**
   * Cria uma instância de LLM com modelo/chave fixos.
   * @param params.model Modelo completo (ex.: 'openaiCompatible-gpt-4o-mini' ou 'openai-gpt-4o')
   * @param params.apiKey Chave do provedor escolhido
   * @param params.defaults Valores padrão (temperature/topP/maxTokens)
   */
  constructor(params: { model: string; apiKey: string; defaults?: ProviderDefaults; baseUrl?: string }) {
    this.model = params.model;
    this.apiKey = params.apiKey;
    this.defaults = params.defaults ?? {};
    this.baseUrl = params.baseUrl;
    
    console.log(`[LLM] LLM instance created with model: ${this.model}`);
  }

  /**
   * Garante que o modo esteja registrado no PromptBuilder, senão lança erro amigável.
   * @private
   */
  private assertModeRegistered(mode: PromptMode): void {
    try {
      // Minimal config to trigger builder existence
      PromptBuilder.buildSystemPrompt({
        mode,
        agentInfo: { name: 'validator', goal: 'validate mode', backstory: '' },
      } as unknown as PromptBuilderConfig);
    } catch (e) {
      throw new Error(
        `Prompt mode '${mode}' não está registrado. Importe o módulo correspondente (ex.: 'src/agents') antes de invocar.`
      );
    }
  }

  /**
   * Invoca o provedor configurado com modo e informações do agente obrigatórios.
   * O systemPrompt é gerado internamente via PromptBuilder a partir do modo e agentInfo.
   *
   * @param args Parâmetros de invocação com mode e agentInfo obrigatórios
   * @returns Conteúdo textual e metadados do provedor (quando disponíveis)
   */
  public async invoke(args: {
    messages: Message[];
    mode?: PromptMode;
    agentInfo?: AgentInfo;
    systemPrompt?: string;
    additionalInstructions?: string;
    tools?: ToolSchema[];
    taskList?: { items: Array<{ id: string; title: string; status: 'pending' | 'in_progress' | 'completed' }> };
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    stream?: boolean;
    promptConfig?: PromptBuilderConfig;
  }): Promise<{ content: string | null; metadata?: Record<string, unknown> }> {
    
    // 🎯 LOG DIRETO DO INVOCATION - MOMENTO EXATO ANTES DE CONSTRUIR O PROMPT
    console.log('\n' + '🧠' + '='.repeat(78));
    console.log('🎯 LLM.INVOKE - MOMENTO EXATO ANTES DE CONSTRUIR O PROMPT');
    console.log('='.repeat(80));
    console.log(`📊 Número de mensagens: ${args.messages.length}`);
    console.log(`🔧 Modo: ${args.mode || 'não definido'}`);
    console.log(`🤖 Agente: ${args.agentInfo?.name || 'não definido'}`);
    console.log(`🌡️  Temperatura: ${args.temperature || 'default'}`);
    console.log(`🔢 Max Tokens: ${args.maxTokens || 'default'}`);
    
    if (args.messages && args.messages.length > 0) {
      console.log(`\n💬 MENSAGENS DO USUÁRIO:`);
      console.log('-'.repeat(60));
      args.messages.forEach((msg, index) => {
        console.log(`\n[${index}] Role: ${msg.role.toUpperCase()}`);
        console.log(`    Content (${msg.content?.length || 0} caracteres):`);
        if (msg.content) {
          console.log('    ' + msg.content.split('\n').join('\n    '));
        }
      });
      console.log('-'.repeat(60));
    }
    console.log('='.repeat(80) + '\n');
    
    console.log(`LLM.invoke called with ${args.messages.length} messages`, 'LLM');
    
    // Determina qual systemPrompt usar
    let systemPrompt: string;
    let promptSource: 'promptConfig' | 'systemPrompt' | 'mode+agentInfo+additionalInstructions';
    
    if (args.promptConfig) {
      // Usa promptConfig se fornecido
      this.assertModeRegistered(args.promptConfig.mode);
      systemPrompt = PromptBuilder.buildSystemPrompt(args.promptConfig);
      promptSource = 'promptConfig';
    } else if (args.systemPrompt) {
      // Usa systemPrompt direto se fornecido
      systemPrompt = args.systemPrompt;
      promptSource = 'systemPrompt';
    } else if (args.mode && args.agentInfo) {
      // Fallback para modo e agentInfo
      this.assertModeRegistered(args.mode);
      const promptConfig: PromptBuilderConfig = {
        mode: args.mode,
        agentInfo: args.agentInfo,
        additionalInstructions: args.additionalInstructions,
        tools: args.tools,
        taskList: args.taskList,
      };
      systemPrompt = PromptBuilder.buildSystemPrompt(promptConfig);
      promptSource = 'mode+agentInfo+additionalInstructions';
    } else {
      throw new Error('Deve fornecer promptConfig, systemPrompt, ou mode+agentInfo');
    }
    
    // 🎯 LOG DO SYSTEM PROMPT COMPLETO APÓS CONSTRUÇÃO
    console.log('\n' + '📋' + '='.repeat(78));
    console.log('📋 SYSTEM PROMPT CONSTRUÍDO - CONTEÚDO COMPLETO');
    console.log('='.repeat(80));
    console.log(`📊 Fonte: ${promptSource}`);
    console.log(`📏 Tamanho: ${systemPrompt.length} caracteres`);
    console.log(`🔤 Preview: ${systemPrompt.length > 200 ? systemPrompt.substring(0, 200) + '...' : systemPrompt}`);
    console.log('\n📄 CONTEÚDO COMPLETO DO SYSTEM PROMPT:');
    console.log('-'.repeat(60));
    console.log(systemPrompt);
    console.log('-'.repeat(60));
    console.log('='.repeat(80) + '\n');
    
    const spPreview = systemPrompt.length > 1000 ? `${systemPrompt.slice(0, 1000)}...` : systemPrompt;
    console.log(`LLM SystemPrompt | source=${promptSource} | length=${systemPrompt.length}`, 'LLM');
    console.log(`LLM SystemPrompt preview: ${spPreview}`, 'LLM');
    
    // 🎯 LOG ADICIONAL PARA VALIDAR TRUNCAMENTO NO LLM
    console.log('\n' + '🔍' + '='.repeat(78));
    console.log('🔍 LLM - VALIDAÇÃO DE TRUNCAMENTO DO SYSTEM PROMPT');
    console.log('='.repeat(80));
    console.log(`📊 Tamanho original: ${systemPrompt.length} caracteres`);
    console.log(`📊 Tamanho do preview: ${spPreview.length} caracteres`);
    console.log(`🔍 Preview truncado? ${systemPrompt.length > 1000 ? 'SIM' : 'NÃO'}`);
    console.log(`📋 Preview: "${spPreview}"`);
    console.log('='.repeat(80) + '\n');
    const temperature = args.temperature ?? this.defaults.temperature ?? 0.5;
    const topP = args.topP ?? this.defaults.topP;
    const maxTokens = args.maxTokens ?? this.defaults.maxTokens;
    const stream = args.stream ?? false;

    const config: ProviderConfig = {
      model: this.model,
      apiKey: this.apiKey,
      messages: args.messages,
      systemPrompt,
      temperature,
      stream,
      topP,
      maxTokens,
      baseUrl: this.baseUrl,
    };

    console.log(`Calling ProviderAdapter with model: ${config.model}`, 'LLM');
    const resp: IProviderResponse = await ProviderAdapter.chatCompletion(config);
    console.log(`ProviderAdapter response received`, 'LLM');
    return { content: resp?.content ?? null, metadata: resp?.metadata };
  }
}
