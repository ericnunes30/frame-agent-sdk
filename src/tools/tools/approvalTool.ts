// src/tools/tools/approvalTool.ts
import { ToolBase } from '@/tools/constructor/toolBase';
import type { IToolParams } from '@/tools/core/interfaces';

/**
 * Parâmetros para ferramenta de aprovação.
 * 
 * Define os dados necessários para registrar uma decisão de aprovação
 * ou rejeição, incluindo feedback detalhado e sugestões de melhoria.
 */
export class ApprovalParams implements IToolParams {
  /** Indica se a solução foi aprovada (true) ou rejeitada (false) */
  public approved!: boolean;
  /** Feedback detalhado sobre a decisão de aprovação/rejeição */
  public feedback!: string;
  /** Lista de sugestões para melhoria (opcional) */
  public suggestions?: string[];

  /** Schema de validação para os parâmetros */
  static schemaProperties = {
    approved: { type: 'boolean', required: true },
    feedback: { type: 'string', required: true, minLength: 1 },
    suggestions: { type: 'array', required: false, items: { type: 'string' } },
  };
}

/**
 * Ferramenta para aprovação/rejeição de soluções com feedback estruturado.
 * 
 * Esta ferramenta é fundamental para workflows que requerem validação
 * humana ou de agentes críticos, permitindo registrar decisões de
 * aprovação/rejeição com feedback detalhado e sugestões de melhoria.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Decisão Binária**: Aprova ou rejeita soluções de forma clara
 * - **Feedback Detalhado**: Permite explicar os motivos da decisão
 * - **Sugestões de Melhoria**: Oferece direcionamento para correções
 * - **Estruturação de Resultado**: Retorna dados formatados para processamento
 * - **Integração com Workflows**: Usada em fluxos de validação e iteração
 * 
 * ## Casos de Uso
 * 
 * - **Code Review**: Aprovação de código por revisores
 * - **Validação de Soluções**: Verificação de respostas de agentes
 * - **Controle de Qualidade**: Aprovação de outputs antes de entrega
 * - **Workflows Iterativos**: Controle de iterações em processos complexos
 * - **Aprovação Humana**: Validação de decisões automatizadas
 * 
 * ## Fluxo de Aprovação
 * 
 * 1. **Análise**: Avaliar a solução apresentada
 * 2. **Decisão**: Determinar se aprova ou rejeita
 * 3. **Feedback**: Documentar motivos da decisão
 * 4. **Sugestões**: Propor melhorias quando aplicável
 * 5. **Registro**: Estruturar resultado para próximo passo
 * 
 * @example
 * ```typescript
 * import { ApprovalTool } from '@/tools/tools/approvalTool';
 * import { toolRegistry } from '@/tools/core/toolRegistry';
 * 
 * // Registrar ferramenta
 * toolRegistry.register(new ApprovalTool());
 * 
 * // Aprovar solução
 * const approvalCall = {
 *   toolName: 'approval',
 *   params: {
 *     approved: true,
 *     feedback: 'Solução está correta e bem implementada. Código limpo e eficiente.',
 *     suggestions: ['Adicionar mais testes de edge cases', 'Documentar funções públicas']
 *   }
 * };
 * 
 * const result = await ToolExecutor.execute(approvalCall);
 * console.log(result.observation);
 * // {
 * //   type: 'approval',
 * //   approved: true,
 * //   feedback: 'Solução está correta...',
 * //   suggestions: ['Adicionar mais testes...', 'Documentar funções...']
 * // }
 * ```
 * 
 * @example
 * ```typescript
 * // Rejeitar solução com feedback construtivo
 * const rejectionCall = {
 *   toolName: 'approval',
 *   params: {
 *     approved: false,
 *     feedback: 'A implementação não atende aos requisitos. Faltam validações de entrada.',
 *     suggestions: [
 *       'Adicionar validação de parâmetros',
 *       'Tratar casos de erro',
 *       'Melhorar tratamento de edge cases'
 *     ]
 *   }
 * };
 * ```
 * 
 * @extends {ToolBase<ApprovalParams, { type: 'approval'; approved: boolean; feedback: string; suggestions?: string[] }>}
 */
export class ApprovalTool extends ToolBase<ApprovalParams, { type: 'approval'; approved: boolean; feedback: string; suggestions?: string[] }> {
  /** Nome da ferramenta no sistema */
  public readonly name = 'approval';
  /** Descrição da funcionalidade da ferramenta */
  public readonly description = 'Aprova ou rejeita soluções com feedback detalhado e sugestões de melhoria.';
  /** Schema de parâmetros para validação */
  public readonly parameterSchema = ApprovalParams;

  /**
   * Executa processo de aprovação/rejeição.
   * 
   * @param params Parâmetros contendo decisão, feedback e sugestões.
   * 
   * @returns Resultado estruturado com tipo, decisão e dados completos.
   * 
   * @example
   * ```typescript
   * const tool = new ApprovalTool();
   * 
   * // Aprovação com sugestões
   * const result = await tool.execute({
   *   approved: true,
   *   feedback: 'Excelente implementação!',
   *   suggestions: ['Considerar adicionar cache', 'Otimizar queries do banco']
   * });
   * 
   * console.log(result);
   * // {
   * //   type: 'approval',
   * //   approved: true,
   * //   feedback: 'Excelente implementação!',
   * //   suggestions: ['Considerar adicionar cache', 'Otimizar queries do banco']
   * // }
   * ```
   */
  public async execute(params: ApprovalParams): Promise<{ type: 'approval'; approved: boolean; feedback: string; suggestions?: string[] }> {
    return {
      type: 'approval',
      approved: params.approved,
      feedback: params.feedback,
      suggestions: params.suggestions
    };
  }
}