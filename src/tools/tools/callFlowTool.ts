import { ToolBase } from '@/tools/constructor/toolBase';
import type { IToolResult } from '@/tools/core/interfaces';
import type { FlowRunner } from '@/flows/interfaces/flowRunner.interface';
import { CallFlowParams } from '@/tools/tools/callFlowParams';

export class CallFlowTool extends ToolBase<CallFlowParams, IToolResult<unknown>> {
  public readonly name = 'call_flow';
  public readonly description = 'Invokes a registered subflow.';
  public readonly parameterSchema = CallFlowParams;

  private readonly runner: FlowRunner;

  constructor(runner: FlowRunner) {
    super();
    this.runner = runner;
  }

  public async execute(params: CallFlowParams): Promise<IToolResult<unknown>> {
    const result = await this.runner.run({
      flowId: params.flowId,
      input: params.input ?? {},
      shared: params.shared ?? {}
    });

    return {
      observation: `call_flow status: ${result.status}`,
      metadata: {
        flowId: params.flowId,
        status: result.status,
        output: result.output,
        patch: result.patch
      }
    };
  }
}
