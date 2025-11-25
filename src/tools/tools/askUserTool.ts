// src/tools/tools/askUserTool.ts
import { ToolBase } from '@/tools/constructor/toolBase';
import type { IToolParams } from '@/tools/core/interfaces';

export class AskUserParams implements IToolParams {
  public question!: string;
  public details?: string;

  static schemaProperties = {
    question: { type: 'string', required: true, minLength: 1 },
    details: { type: 'string', required: false, minLength: 0 },
  };
}

export class AskUserTool extends ToolBase<AskUserParams, { type: 'ask_user'; question: string; details?: string }> {
  public readonly name = 'ask_user';
  public readonly description = 'Pede esclarecimentos ao usuário quando informações adicionais são necessárias para prosseguir.';
  public readonly parameterSchema = AskUserParams;

  public async execute(params: AskUserParams): Promise<{ type: 'ask_user'; question: string; details?: string }> {
    return { type: 'ask_user', question: params.question, details: params.details };
  }
}
/**
 * Ferramenta que solicita input do usuário (placeholder para fluxos interativos).
 */
