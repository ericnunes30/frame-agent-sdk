// src/orchestrators/steps/steps.ts
import type { Step, StepResultUpdate, StepProviderOptions } from '@/orchestrators/steps/interfaces';
import { AgentLLM } from '@/agent';

/**
 * Step que invoca o AgentLLM usando a memória atual.
 * Usa o AgentLLM injetado nas dependências.
 */
export const stepAgent = (id: string): Step => ({
  id,
  async run(ctx): Promise<StepResultUpdate> {
    const messages = ctx.deps.memory.getTrimmedHistory();
    const { content, metadata } = await ctx.deps.llm.invoke({
      messages,
      mode: ctx.config.mode,
      agentInfo: ctx.config.agentInfo,
      additionalInstructions: ctx.config.additionalInstructions,
      tools: ctx.config.tools
    });
    ctx.deps.memory.addMessage({ role: 'assistant', content: content ?? '' });
    return { data: { metadata } };
  },
});

/**
 * Step que finaliza a orquestração com valor do estado.
 */
export const stepFinalize = (id: string, fromStateKey: string): Step => ({
  id,
  async run(ctx): Promise<StepResultUpdate> {
    const val = ctx.state.data[fromStateKey];
    const text = typeof val === 'string' ? val : JSON.stringify(val ?? null);
    return { final: text, halt: true };
  },
});

/**
 * Step que cria um AgentLLM customizado para esse step específico.
 * Útil quando você precisa usar modelo/provider diferente por step.
 */
export const stepAgentCustom = (id: string, opts: StepProviderOptions): Step => ({
  id,
  async run(ctx): Promise<StepResultUpdate> {
    // Cria AgentLLM específico para este step
    const customAgent = new AgentLLM({
      model: opts.model,
      apiKey: opts.apiKey,
      baseUrl: opts.baseUrl,
      defaults: {
        temperature: opts.temperature ?? 0.5,
        topP: opts.topP,
        maxTokens: opts.maxTokens
      }
    });

    const messages = ctx.deps.memory.getTrimmedHistory();
    const { content, metadata } = await customAgent.invoke({
      messages,
      mode: ctx.config.mode,
      agentInfo: ctx.config.agentInfo,
      additionalInstructions: ctx.config.additionalInstructions,
      tools: ctx.config.tools
    });

    ctx.deps.memory.addMessage({ role: 'assistant', content: content ?? '' });
    return { data: { metadata } };
  }
});
