// src/tools/tools/finalAnswerTool.ts
import { ToolBase } from '@/tools/constructor/toolBase';
import type { IToolParams } from '@/tools/core/interfaces';

export class FinalAnswerParams implements IToolParams {
  public answer!: string;

  static schemaProperties = {
    answer: { type: 'string', required: true, minLength: 1 },
  };
}

export class FinalAnswerTool extends ToolBase<FinalAnswerParams, { type: 'final_answer'; answer: string }> {
  public readonly name = 'final_answer';
  public readonly description = 'Finaliza o ciclo de execução retornando a resposta final para o usuário.';
  public readonly parameterSchema = FinalAnswerParams;

  public async execute(params: FinalAnswerParams): Promise<{ type: 'final_answer'; answer: string }> {
    return { type: 'final_answer', answer: params.answer };
  }
}
/**
 * Ferramenta que encapsula a resposta final do agente.
 */
