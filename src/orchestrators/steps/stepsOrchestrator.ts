import type { StepsDeps, StepsConfig, OrchestrationState, Step, StepContext } from '@/orchestrators/steps/interfaces';
import { ToolDetector, ToolExecutor } from '../../tools';
import { PromptBuilder } from '@/promptBuilder';
import { AGENT_MODES } from '@/llmModes';
import type { AgentMode } from '@/llmModes';

export class StepsOrchestrator {
  private readonly deps: StepsDeps;
  private readonly config: StepsConfig;

  constructor(deps: StepsDeps, config: StepsConfig) {
    this.deps = deps;
    this.config = config;
  }

  public async run(steps: Step[], userInput: string): Promise<{ final: string | null; state: OrchestrationState }> {
    // initialize state
    const state: OrchestrationState = { data: {}, final: undefined, lastModelOutput: null };

    // seed user input
    this.deps.memory.addMessage({ role: 'user', content: userInput });

    // step iteration
    let index = 0;
    const jumpMap: Map<string, number> = new Map<string, number>(
      steps.map((s, i) => [s.id, i] as [string, number])
    );

    while (index < steps.length) {
      const step = steps[index];
      const ctx: StepContext = { deps: this.deps, config: this.config, state };
      const res = (await step.run(ctx)) || {};

      // apply updates
      if (res.data) state.data = { ...state.data, ...res.data };
      if (typeof res.final === 'string') state.final = res.final;

      if (res.halt) break;
      const ni = res.next ? jumpMap.get(res.next) : undefined;
      if (ni !== undefined) { index = ni; continue; }
      index += 1;
    }

    return { final: state.final ?? null, state };
  }

  // Full single-agent flow orchestrated here. Uses LLM to build System Prompt via mode.
  public async runFlow(userInput: string, opts?: { maxTurns?: number }): Promise<{
    final: string | null;
    state: OrchestrationState;
    pendingAskUser?: { question: string; details?: string };
  }> {
    const maxTurns = opts?.maxTurns ?? 8;
    const state: OrchestrationState = { data: {}, final: undefined, lastModelOutput: null };

    // seed user input
    this.deps.memory.addMessage({ role: 'user', content: userInput });

    // chat mode: single turn
    if (this.config.mode === AGENT_MODES.CHAT) {
      const systemPrompt = PromptBuilder.buildSystemPrompt(this.config);
      const { content, metadata } = await this.deps.llm.invoke({
        messages: this.deps.memory.getTrimmedHistory(),
        systemPrompt,
      });
      state.lastModelOutput = content ?? null;
      if (content) this.deps.memory.addMessage({ role: 'assistant', content });
      if (metadata) state.data.metadata = metadata;
      return { final: content ?? null, state };
    }

    // react mode: iterative loop with SAP
    let turns = 0;
    if (!state.data) state.data = {};
    if (!Array.isArray((state.data as any).steps)) (state.data as any).steps = [] as Array<{ thought?: string; actionName?: string; observation?: string }>;
    while (turns < maxTurns) {
      // Guard: stop if token budget exhausted (memory module)
      if (this.deps.memory.getRemainingBudget() <= 0) {
        state.final = state.final ?? undefined;
        break;
      }
      turns += 1;
      const systemPrompt = PromptBuilder.buildSystemPrompt(this.config);
      const { content, metadata } = await this.deps.llm.invoke({
        messages: this.deps.memory.getTrimmedHistory(),
        systemPrompt,
      });
      state.lastModelOutput = content ?? null;
      if (metadata) state.data.metadata = metadata;

      const text = content ?? '';
      // Add assistant output to memory before parsing (ReAct action or final)
      this.deps.memory.addMessage({ role: 'assistant', content: text });

      // Use ToolDetector to parse output
      const detection = ToolDetector.detect(text);

      if (!detection.success) {
        // Check if it's an error that needs a hint
        if (detection.error && (detection.error.llmHint || detection.error.message)) {
          const hint = detection.error.llmHint || 'Your tool output does not match the required schema. Fix format and try again using exact JSON.';
          this.deps.memory.addMessage({ role: 'system', content: hint });
          continue;
        }

        // No tool detected and no error hint -> treat as final answer (or thought only)
        try {
          const m = text.match(/Thought:\s*([\s\S]*?)(?:\n|$)/i);
          const thought = (m ? m[1] : '').toString().trim();
          if (thought) ((state.data as any).steps as any[]).push({ thought });
        } catch { }

        const final = text || null;
        state.final = final ?? undefined;
        break;
      }

      // Tool detected successfully
      const call = detection.toolCall!;
      const toolName = call.toolName;

      // Handle built-in final_answer (capture Thought + Action before finishing)
      if (toolName === 'final_answer') {
        const answer = String((call.params as any)?.answer ?? '');
        try {
          const m = text.match(/Thought:\s*([\s\S]*?)(?:\n|$)/i);
          const thought = (m ? m[1] : '').toString().trim();
          ((state.data as any).steps as any[]).push({ thought, actionName: 'final_answer' });
        } catch { }
        const final = answer || text || null;
        if (final) this.deps.memory.addMessage({ role: 'assistant', content: final });
        state.final = final ?? undefined;
        break;
      }

      // Handle built-in ask_user -> pause and return pending question
      if (toolName === 'ask_user') {
        const question = String((call.params as any)?.question ?? '');
        const details = (call.params as any)?.details as string | undefined;
        const pending = { question, details };
        state.data.ask_user = pending;
        return { final: null, state, pendingAskUser: pending };
      }

      // Execute other tools and append observation (capture Thought + Action BEFORE executing)
      let stepIndex = -1;
      try {
        const m = text.match(/Thought:\s*([\s\S]*?)(?:\n|$)/i);
        const thought = (m ? m[1] : '').toString().trim();
        const stepsArr = ((state.data as any).steps as any[]);
        stepIndex = stepsArr.push({ thought, actionName: toolName }) - 1;
      } catch { }

      // Execute tool e recebe resultado estruturado
      const toolResult = await ToolExecutor.execute({ toolName, params: call.params } as any);
      const observation = toolResult.observation;
      const toolMetadata = toolResult.metadata;

      // Adiciona observation ao histórico
      this.deps.memory.addMessage({ role: 'tool', content: String(observation) });

      // attach observation to the last step (if available)
      try {
        const stepsArr = ((state.data as any).steps as any[]);
        if (stepIndex >= 0 && stepsArr[stepIndex]) stepsArr[stepIndex].observation = String(observation);
      } catch { }

      // Aplica metadata retornado pela tool (se houver)
      if (toolMetadata) {
        // TaskList é aplicado automaticamente pela tool
        if (toolMetadata.taskList) {
          this.config.taskList = toolMetadata.taskList as any;
        }

        // Outros metadados podem ser aplicados no futuro
        // Exemplo: if (toolMetadata.otherData) { ... }
      }

      // Continue loop for next LLM turn
    }

    return { final: state.final ?? null, state };
  }
}
/**
 * (Esqueleto) Orquestrador de steps.
 *
 * Este arquivo pode definir uma classe utilitária para executar uma sequência de steps
 * recebendo `StepContext` inicial e produzindo um resultado final. Documente aqui
 * o contrato de execução assim que a implementação evoluir.
 */
