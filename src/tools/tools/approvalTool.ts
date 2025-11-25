// src/tools/tools/approvalTool.ts
import { ToolBase } from '@/tools/constructor/toolBase';
import type { IToolParams } from '@/tools/core/interfaces';

export class ApprovalParams implements IToolParams {
  public approved!: boolean;
  public feedback!: string;
  public suggestions?: string[];

  static schemaProperties = {
    approved: { type: 'boolean', required: true },
    feedback: { type: 'string', required: true, minLength: 1 },
    suggestions: { type: 'array', required: false, items: { type: 'string' } },
  };
}

export class ApprovalTool extends ToolBase<ApprovalParams, { type: 'approval'; approved: boolean; feedback: string; suggestions?: string[] }> {
  public readonly name = 'approval';
  public readonly description = 'Aprova ou rejeita soluções com feedback detalhado e sugestões de melhoria.';
  public readonly parameterSchema = ApprovalParams;

  public async execute(params: ApprovalParams): Promise<{ type: 'approval'; approved: boolean; feedback: string; suggestions?: string[] }> {
    return {
      type: 'approval',
      approved: params.approved,
      feedback: params.feedback,
      suggestions: params.suggestions
    };
  }
}

/**
 * Ferramenta que encapsula a decisão de aprovação/rejeição do agente crítico.
 * Usada no workflow Code-Critic para controlar o fluxo de iterações.
 */