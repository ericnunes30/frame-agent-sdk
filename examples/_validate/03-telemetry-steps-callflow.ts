import 'dotenv/config';
import 'tsconfig-paths/register';

import { AgentLLM } from '../../src/agent';
import { ChatHistoryManager, TokenizerService } from '../../src/memory';
import { StepsOrchestrator } from '../../src/orchestrators/steps/stepsOrchestrator';
import { FlowRegistryImpl } from '../../src/flows/registry/flowRegistryImpl';
import { FlowRunnerImpl } from '../../src/flows/runner/flowRunnerImpl';
import type { GraphDefinition } from '../../src/orchestrators/graph/core/interfaces/graphEngine.interface';
import { toolRegistry } from '../../src/tools/core/toolRegistry';
import { CallFlowTool } from '../../src/tools/tools/callFlowTool';
import { FinalAnswerTool } from '../../src/tools/tools/finalAnswerTool';
import type { TraceEvent } from '../../src/telemetry/interfaces/traceEvent.interface';
import type { TraceSink } from '../../src/telemetry/interfaces/traceSink.interface';
import { AGENT_MODES } from '../../src/llmModes';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

class CaptureSink implements TraceSink {
  public readonly events: TraceEvent[] = [];
  emit(event: TraceEvent): void {
    this.events.push(event);
  }
}

function createChildGraph(): GraphDefinition {
  return {
    entryPoint: 'child',
    endNodeName: 'end',
    nodes: {
      child: async (state) => ({
        data: { ...(state.data ?? {}), childOutput: 'pong' },
      }),
    },
    edges: { child: 'end' },
  };
}

async function main() {
  const model = process.env.OPENAI_MODEL;
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL;

  assert(model, 'OPENAI_MODEL is required');
  assert(apiKey, 'OPENAI_API_KEY is required');
  assert(baseUrl, 'OPENAI_BASE_URL is required');

  const trace = new CaptureSink();
  const registry = new FlowRegistryImpl();
  const tokenizer = new TokenizerService(model);
  const memory = new ChatHistoryManager({ maxContextTokens: 8000, tokenizer });
  const runner = new FlowRunnerImpl(registry, { chatHistoryManager: memory });

  registry.register('child-validate', {
    id: 'child-validate',
    version: '0.0.0',
    kind: 'graph',
    graph: createChildGraph(),
  });

  const callFlowTool = new CallFlowTool(runner);
  const finalAnswerTool = new FinalAnswerTool();
  toolRegistry.register(callFlowTool as any);
  toolRegistry.register(finalAnswerTool as any);
  try {
    const llm = new AgentLLM({
      model,
      apiKey,
      baseUrl,
      defaults: { temperature: 0, maxTokens: 400 },
    });

    const orchestrator = new StepsOrchestrator(
      { llm, memory },
      {
        mode: AGENT_MODES.REACT,
        agentInfo: {
          name: 'ValidatorSteps',
          goal: 'Validar a propagacao de telemetria em call_flow/subfluxos',
          backstory: 'Agente de teste que executa um fluxo minimo para validar spans e correlacao de runs',
        },
        tools: [callFlowTool, finalAnswerTool],
        additionalInstructions: [
          'Objetivo: validar propagacao de telemetria (steps -> call_flow -> subflow graph).',
          'Regras:',
          '1) Voce DEVE chamar a ferramenta call_flow exatamente uma vez.',
          '2) Use flowId "child-validate".',
          '3) Depois, voce DEVE finalizar com final_answer com answer exatamente "OK".',
          '4) Nao use ask_user.',
        ].join('\n'),
      },
      {
        trace,
        telemetry: { enabled: true, level: 'info', persistToState: false, includePrompts: false },
        traceContext: { agent: { label: 'validate-steps' } },
      }
    );

    const result = await orchestrator.runFlow('Inicie a validacao.', { maxTurns: 4 });
    assert(result.final === 'OK', 'expected final answer "OK"');

    const stepsRunStarted = trace.events.find((e) => e.type === 'run_started' && e.orchestrator === 'steps');
    assert(stepsRunStarted, 'expected steps run_started');

    const stepsRunId = stepsRunStarted.runId;
    const childRunStarted = trace.events.find(
      (e) => e.type === 'run_started' && e.orchestrator === 'graph' && e.parentRunId === stepsRunId
    );
    assert(childRunStarted, 'expected child graph run_started with parentRunId == steps runId');

    const toolFinished = trace.events.find((e) => e.type === 'tool_execution_finished' && e.tool?.name === 'call_flow');
    assert(toolFinished, 'expected tool_execution_finished for call_flow inside steps');

    console.log('[OK] telemetry-steps-callflow');
    console.log(`- events: ${trace.events.length}`);
    console.log(`- stepsRunId: ${stepsRunId}`);
    console.log(`- childRunId: ${childRunStarted.runId}`);
  } finally {
    toolRegistry.unregister('call_flow');
    toolRegistry.unregister('final_answer');
  }
}

main().catch((err) => {
  console.error('[FAIL] telemetry-steps-callflow');
  console.error(err);
  process.exitCode = 1;
});
