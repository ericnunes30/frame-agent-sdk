// src/tools/tools/askUserTool.ts
import { ToolBase } from '@/tools/constructor/toolBase';
import type { IToolParams } from '@/tools/core/interfaces';

/**
 * Parâmetros para a ferramenta AskUserTool.
 * 
 * Define os dados necessários para solicitar informações do usuário
 * durante a execução de um agente.
 */
export class AskUserParams implements IToolParams {
  /** Pergunta principal a ser feita ao usuário */
  public question!: string;
  /** Detalhes adicionais ou contexto para a pergunta (opcional) */
  public details?: string;

  /** Schema de validação para os parâmetros */
  static schemaProperties = {
    question: { type: 'string', required: true, minLength: 1 },
    details: { type: 'string', required: false, minLength: 0 },
  };
}

/**
 * Ferramenta para solicitação de input do usuário.
 * 
 * Esta ferramenta permite que agentes de IA solicitem informações
 * adicionais ou esclarecimentos dos usuários durante a execução
 * de tarefas, criando fluxos interativos e colaborativos.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Solicitação Estruturada**: Permite fazer perguntas específicas ao usuário
 * - **Contexto Adicional**: Suporta detalhes extras para contextualizar perguntas
 * - **Integração com Agentes**: Usada por agentes para obter informações faltantes
 * - **Fluxos Interativos**: Habilita conversas dinâmicas entre agente e usuário
 * 
 * ## Casos de Uso
 * 
 * - **Informações Faltantes**: Quando o agente precisa de dados não disponíveis
 * - **Confirmação de Ações**: Para validar decisões antes de executá-las
 * - **Esclarecimento de Requisitos**: Para entender melhor as necessidades do usuário
 * - **Validação de Resultados**: Para confirmar se o output atende às expectativas
 * 
 * ## Exemplo de Uso
 * 
 * ```typescript
 * import { AskUserTool } from '@/tools/tools/askUserTool';
 * import { toolRegistry } from '@/tools/core/toolRegistry';
 * 
 * // Registrar ferramenta
 * toolRegistry.register(new AskUserTool());
 * 
 * // Usar em um agente
 * const toolCall = {
 *   toolName: 'ask_user',
 *   params: {
 *     question: 'Qual é o seu orçamento máximo para este projeto?',
 *     details: 'Preciso saber para recomendar as melhores opções dentro da sua faixa de preço.'
 *   }
 * };
 * 
 * // Executar
 * const result = await ToolExecutor.execute(toolCall);
 * console.log(result.observation);
 * // { type: 'ask_user', question: '...', details: '...' }
 * ```
 * 
 * @extends {ToolBase<AskUserParams, { type: 'ask_user'; question: string; details?: string }>}
 * 
 * @example
 * ```typescript
 * // Exemplo de integração em um agente
 * class ShoppingAgent {
 *   async processRequest(request: string) {
 *     // Se informações importantes estão faltando...
 *     if (!this.hasBudgetInfo(request)) {
 *       return await this.callTool('ask_user', {
 *         question: 'Qual é o seu orçamento para esta compra?',
 *         details: 'Isso me ajudará a filtrar as melhores opções para você.'
 *       });
 *     }
 *     
 *     // Continuar com o processamento...
 *   }
 * }
 * ```
 */
export class AskUserTool extends ToolBase<AskUserParams, { type: 'ask_user'; question: string; details?: string }> {
  /** Nome da ferramenta no sistema */
  public readonly name = 'ask_user';
  /** Descrição da funcionalidade da ferramenta */
  public readonly description = 'Pede esclarecimentos ao usuário quando informações adicionais são necessárias para prosseguir.';
  /** Schema de parâmetros para validação */
  public readonly parameterSchema = AskUserParams;

  /**
   * Executa a solicitação de input do usuário.
   * 
   * @param params Parâmetros contendo a pergunta e detalhes opcionais.
   * 
   * @returns Resultado estruturado com tipo, pergunta e detalhes.
   * 
   * @example
   * ```typescript
   * const tool = new AskUserTool();
   * const result = await tool.execute({
   *   question: 'Qual sua cor favorita?',
   *   details: 'Preciso saber para personalizar sua experiência.'
   * });
   * 
   * console.log(result);
   * // {
   * //   type: 'ask_user',
   * //   question: 'Qual sua cor favorita?',
   * //   details: 'Preciso saber para personalizar sua experiência.'
   * // }
   * ```
   */
  public async execute(params: AskUserParams): Promise<{ type: 'ask_user'; question: string; details?: string }> {
    return { type: 'ask_user', question: params.question, details: params.details };
  }
}
