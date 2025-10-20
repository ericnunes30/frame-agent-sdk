// src/orchestrators/steps/steps.ts
import type { Step, StepResultUpdate, StepProviderOptions } from './interfaces';
import { PromptBuilder } from '../../promptBuilder';
import { ProviderAdapter } from '../../providers/adapter/providerAdapter';
import type { ProviderConfig } from '../../providers/adapter/provider.interface';

/**
 * Step simples que invoca o LLM usando a memória atual (mensagens truncadas)
 * e salva a resposta no histórico.
 */
export const LLMCallStep = (id: string): Step => ({
  id,
  async run(ctx): Promise<StepResultUpdate> {
    const messages = ctx.deps.memory.getTrimmedHistory();
    const systemPrompt = PromptBuilder.buildSystemPrompt(ctx.config);
    const { content, metadata } = await ctx.deps.llm.invoke({ messages, systemPrompt });
    ctx.deps.memory.addMessage({ role: 'assistant', content: content ?? '' });
    return { data: { metadata }, }; // keep running
  },
});

/**
 * Step utilitário para finalizar a orquestração, definindo uma resposta final
 * a partir de uma chave do estado compartilhado.
 */
export const FinalizeStep = (id: string, fromStateKey: string): Step => ({
  id,
  async run(ctx): Promise<StepResultUpdate> {
    const val = ctx.state.data[fromStateKey];
    const text = typeof val === 'string' ? val : JSON.stringify(val ?? null);
    return { final: text, halt: true };
  },
});

/**
 * Step que permite escolher o provider por step (sem depender de variáveis globais).
 * Útil em cenários multi-agente/provedor.
 */
export const LLMCallStepWithProvider = (id: string, opts: StepProviderOptions): Step => ({
  id,
  async run(ctx): Promise<StepResultUpdate> {
    // Monta o system prompt usando o PromptBuilder do agente corrente
    const systemPrompt = PromptBuilder.buildSystemPrompt(ctx.config);

    // Usa todo o histórico aparado de memória
    const messages = ctx.deps.memory.getTrimmedHistory();

    // Concatena provider+model para acionar o provider correto no ProviderAdapter
    const modelWithProvider = `${opts.provider}-${opts.model}`;

    const config: ProviderConfig = {
      model: modelWithProvider,
      apiKey: opts.apiKey,
      baseUrl: opts.baseUrl,
      messages,
      systemPrompt,
      temperature: opts.temperature ?? 0.5,
      stream: opts.stream ?? false,
      topP: opts.topP,
      maxTokens: opts.maxTokens,
    };

    const result = await ProviderAdapter.chatCompletion(config);
    ctx.deps.memory.addMessage({ role: 'assistant', content: result?.content ?? '' });
    return { data: { metadata: result?.metadata } };
  }
});
