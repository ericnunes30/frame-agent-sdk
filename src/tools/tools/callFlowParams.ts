import type { IToolParams } from '@/tools/core/interfaces';
import type { SharedState } from '@/flows/interfaces/sharedState.interface';

export class CallFlowParams implements IToolParams {
  public flowId!: string;
  public input?: Record<string, unknown>;
  public shared?: SharedState;

  static schemaProperties = {
    flowId: { type: 'string', required: true, minLength: 1 },
    input: { type: 'object', required: false },
    shared: { type: 'object', required: false }
  };
}
