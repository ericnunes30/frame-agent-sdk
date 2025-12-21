import type { FlowRunner } from '@/flows/interfaces/flowRunner.interface';
import type { SharedState } from '@/flows/interfaces/sharedState.interface';

export class StepSubflow {
  private readonly runner: FlowRunner;

  constructor(runner: FlowRunner) {
    this.runner = runner;
  }

  async execute(flowId: string, input: Record<string, unknown>, shared: SharedState) {
    return this.runner.run({ flowId, input, shared });
  }
}
