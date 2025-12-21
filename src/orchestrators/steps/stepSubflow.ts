import type { FlowRunner } from '@/flows/interfaces/flowRunner.interface';
import type { SharedState } from '@/flows/interfaces/sharedState.interface';
import { getActiveTelemetry } from '@/telemetry/context/telemetryStore';

export class StepSubflow {
  private readonly runner: FlowRunner;

  constructor(runner: FlowRunner) {
    this.runner = runner;
  }

  async execute(flowId: string, input: Record<string, unknown>, shared: SharedState) {
    const active = getActiveTelemetry();
    return this.runner.run({
      flowId,
      input,
      shared,
      trace: active?.trace,
      telemetry: active?.telemetry,
      traceContext: active?.traceContext,
    });
  }
}
