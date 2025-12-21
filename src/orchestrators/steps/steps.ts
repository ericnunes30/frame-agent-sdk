// src/orchestrators/steps/steps.ts
import type { Step, StepResultUpdate, StepProviderOptions, AgentStepConfig } from '@/orchestrators/steps/interfaces';
import type { FlowRunner } from '@/flows/interfaces/flowRunner.interface';
import type { SharedState } from '@/flows/interfaces/sharedState.interface';
import { applySharedPatch } from '@/flows/utils/sharedPatchApplier';
import { AgentLLM, type AgentLLMConfig } from '@/agent';

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
 * Cria um step de agente com suporte a LLMConfig.
 * Similar ao createAgentNode do Graph Engine.
 * 
 * @param id ID do step
 * @param config Configuração do agente (pode incluir LLMConfig)
 * @returns Step configurado
 */
export const createStepAgent = (id: string, config: AgentStepConfig): Step => ({
  id,
  async run(ctx): Promise<StepResultUpdate> {
    // Determina qual LLM usar
    let llm = ctx.deps.llm;
    
    // Se a configuração tem LLMConfig, cria nova instância
    if (config.llm && isLLMConfig(config.llm)) {
      llm = new AgentLLM(config.llm);
    } else if (config.llm && !isLLMConfig(config.llm)) {
      // Se é instância de AgentLLM, usa diretamente
      llm = config.llm;
    }
    
    const messages = ctx.deps.memory.getTrimmedHistory();
    const { content, metadata } = await llm.invoke({
      messages,
      mode: config.mode,
      agentInfo: config.agentInfo,
      additionalInstructions: config.additionalInstructions,
      tools: config.tools
    });
    
    ctx.deps.memory.addMessage({ role: 'assistant', content: content ?? '' });
    return { data: { metadata } };
  },
});

/**
 * Verifica se um objeto é LLMConfig.
 * Função auxiliar para distinguish entre LLMConfig e instância AgentLLM.
 */
function isLLMConfig(obj: any): obj is AgentLLMConfig {
  return obj && typeof obj === 'object' && 'model' in obj && !('invoke' in obj);
}

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

/**
 * Cria um step que executa um subfluxo e aplica SharedPatch em data.shared.
 */
export const createStepSubflow = (id: string, args: { runner: FlowRunner; flowId: string }): Step => ({
  id,
  async run(ctx): Promise<StepResultUpdate> {
    const data = (ctx.state.data ?? {}) as Record<string, unknown>;
    const shared = (data.shared ?? {}) as SharedState;
    const { shared: _shared, ...input } = data;

    const result = await args.runner.run({
      flowId: args.flowId,
      input,
      shared
    });

    const nextShared = applySharedPatch(shared, result.patch);

    const nextData = {
      ...data,
      shared: nextShared,
      subflow: {
        flowId: args.flowId,
        status: result.status,
        output: result.output,
        patch: result.patch,
        childState: result.childState
      }
    };

    return { data: nextData, halt: result.status === 'paused' };
  }
});
