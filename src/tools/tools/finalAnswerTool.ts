// src/tools/tools/finalAnswerTool.ts
import { ToolBase } from '@/tools/constructor/toolBase';
import type { IToolParams } from '@/tools/core/interfaces';

/**
 * Parâmetros para ferramenta de resposta final.
 * 
 * Define a estrutura necessária para encapsular a resposta final
 * de um agente ao usuário, marcando o término de um ciclo de execução.
 */
export class FinalAnswerParams implements IToolParams {
  /** Resposta final a ser retornada ao usuário */
  public answer!: string;

  /** Schema de validação para os parâmetros */
  static schemaProperties = {
    answer: { type: 'string', required: true, minLength: 1 },
  };
}

/**
 * Ferramenta para finalização de execução com resposta final.
 * 
 * Esta ferramenta marca o término de um ciclo de execução de agente,
 * encapsulando a resposta final que será entregue ao usuário. É
 * fundamental para workflows que requerem uma conclusão clara e
 * estruturada do processo.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Finalização de Ciclo**: Marca o término da execução do agente
 * - **Encapsulação de Resultado**: Estrutura a resposta final de forma clara
 * - **Sinalização de Conclusão**: Indica que o processo foi completado
 * - **Integração com Workflows**: Usada como ponto final em fluxos complexos
 * - **Feedback ao Usuário**: Entrega a resposta de forma estruturada
 * 
 * ## Casos de Uso
 * 
 * - **Conclusão de Tarefas**: Finalizar tarefas que foram completadas
 * - **Entrega de Resultados**: Apresentar resultados finais ao usuário
 * - **Encerramento de Processos**: Terminar workflows após conclusão
 * - **Resposta a Consultas**: Responder perguntas do usuário
 * - **Finalização de Análises**: Concluir análises e apresentar conclusões
 * 
 * ## Fluxo de Finalização
 * 
 * 1. **Processamento**: Executar todas as etapas necessárias
 * 2. **Consolidação**: Compilar resultados e conclusões
 * 3. **Estruturação**: Formatar resposta final
 * 4. **Finalização**: Chamar final_answer com resultado
 * 5. **Entrega**: Retornar resposta ao usuário
 * 
 * ## Importância no Sistema
 * 
 * Esta ferramenta é crucial para:
 * - **Controle de Fluxo**: Indica quando um processo deve terminar
 * - **Experiência do Usuário**: Fornece conclusão clara e satisfatória
 * - **Debugging**: Facilita identificação do fim de execuções
 * - **Integração**: Permite integração com sistemas externos
 * 
 * @example
 * ```typescript
 * import { FinalAnswerTool } from '@/tools/tools/finalAnswerTool';
 * import { toolRegistry } from '@/tools/core/toolRegistry';
 * 
 * // Registrar ferramenta
 * toolRegistry.register(new FinalAnswerTool());
 * 
 * // Finalizar execução com resultado
 * const finalCall = {
 *   toolName: 'final_answer',
 *   params: {
 *     answer: 'Análise concluída! Encontrei 3 padrões principais nos seus dados...'
 *   }
 * };
 * 
 * const result = await ToolExecutor.execute(finalCall);
 * console.log(result.observation);
 * // {
 * //   type: 'final_answer',
 * //   answer: 'Análise concluída! Encontrei 3 padrões principais...'
 * // }
 * ```
 * 
 * @example
 * ```typescript
 * // Exemplo em um agente de análise
 * class DataAnalysisAgent {
 *   async analyze(data: any[]) {
 *     try {
 *       // 1. Processar dados
 *       const insights = await this.processData(data);
 *       
 *       // 2. Gerar conclusões
 *       const conclusions = this.generateConclusions(insights);
 *       
 *       // 3. Finalizar com resposta estruturada
 *       return await this.callTool('final_answer', {
 *         answer: `Análise completa! Principais insights: ${conclusions.summary}`
 *       });
 *     } catch (error) {
 *       return await this.callTool('final_answer', {
 *         answer: `Erro durante análise: ${error.message}`
 *       });
 *     }
 *   }
 * }
 * ```
 * 
 * @extends {ToolBase<FinalAnswerParams, { type: 'final_answer'; answer: string }>}
 */
export class FinalAnswerTool extends ToolBase<FinalAnswerParams, { type: 'final_answer'; answer: string }> {
  /** Nome da ferramenta no sistema */
  public readonly name = 'final_answer';
  /** Descrição da funcionalidade da ferramenta */
  public readonly description = 'Finaliza o ciclo de execução retornando a resposta final para o usuário.';
  /** Schema de parâmetros para validação */
  public readonly parameterSchema = FinalAnswerParams;

  /**
   * Executa finalização com resposta final.
   * 
   * @param params Parâmetros contendo a resposta final.
   * 
   * @returns Resultado estruturado com tipo e resposta.
   * 
   * @example
   * ```typescript
   * const tool = new FinalAnswerTool();
   * 
   * // Finalização simples
   * const result = await tool.execute({
   *   answer: 'Tarefa concluída com sucesso!'
   * });
   * 
   * console.log(result);
   * // {
   * //   type: 'final_answer',
   * //   answer: 'Tarefa concluída com sucesso!'
   * // }
   * ```
   * 
   * @example
   * ```typescript
   * // Finalização com resultado detalhado
   * const detailedResult = await tool.execute({
   *   answer: `Processamento completo!
   * 
   * Resultados:
   * - 1,247 registros processados
   * - 15 anomalias detectadas
   * - 3 relatórios gerados
   * 
   * Tempo total: 2.3 segundos`
   * });
   * ```
   */
  public async execute(params: FinalAnswerParams): Promise<{ type: 'final_answer'; answer: string }> {
    return { type: 'final_answer', answer: params.answer };
  }
}
