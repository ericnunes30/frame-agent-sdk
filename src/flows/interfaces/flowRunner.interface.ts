import type { SharedState } from '@/flows/interfaces/sharedState.interface';
import type { SharedPatch } from '@/flows/interfaces/sharedPatch.interface';
import type { SubflowPolicy } from '@/flows/interfaces/subflowPolicy.interface';
import type { IGraphState } from '@/orchestrators/graph/core/interfaces/graphState.interface';
import type { TraceContext } from '@/telemetry/interfaces/traceContext.interface';
import type { TraceSink } from '@/telemetry/interfaces/traceSink.interface';
import type { TelemetryOptions } from '@/telemetry/interfaces/telemetryOptions.interface';

export interface FlowRunner {
  /**
   * Executa um fluxo registrado e retorna status, output, patch e childState.
   * Implementacoes podem exigir memoria isolada para flows do tipo agentFlow.
   */
  run(args: {
    flowId: string;
    input: Record<string, unknown>;
    shared: SharedState;
    policy?: SubflowPolicy;
    childState?: IGraphState;
    trace?: TraceSink;
    telemetry?: TelemetryOptions;
    traceContext?: TraceContext;
  }): Promise<{
    status: 'success' | 'failed' | 'paused';
    output: Record<string, unknown>;
    patch: SharedPatch[];
    childState?: IGraphState;
  }>;
}
