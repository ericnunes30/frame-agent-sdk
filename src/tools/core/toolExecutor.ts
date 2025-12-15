import { toolRegistry } from './toolRegistry';
import type { IToolCall, IToolResult } from './interfaces';
import { logger } from '@/utils/logger';

/**
 * Verifica se um valor é um IToolResult estruturado.
 * 
 * Função utilitária que determina se o resultado de uma ferramenta
 * já está no formato IToolResult ou se precisa ser normalizado.
 * 
 * @param value Valor a ser verificado.
 * 
 * @returns true se o valor é um IToolResult, false caso contrário.
 * 
 * @example
 * ```typescript
 * // Resultado já estruturado
 * const structuredResult = { observation: 'sucesso', metadata: {...} };
 * console.log(isToolResult(structuredResult)); // true
 * 
 * // Resultado simples
 * const simpleResult = 'sucesso';
 * console.log(isToolResult(simpleResult)); // false
 * ```
 */
function isToolResult(value: unknown): value is IToolResult {
    return (
        typeof value === 'object' &&
        value !== null &&
        'observation' in value
    );
}

/**
 * Executor centralizado de ferramentas para agentes de IA.
 * 
 * Esta classe é responsável por receber chamadas de ferramentas (IToolCall),
 * localizar a ferramenta apropriada no ToolRegistry e executá-la de forma
 * segura, tratando erros e normalizando resultados.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Descoberta Automática**: Localiza ferramentas no registry pelo nome
 * - **Execução Segura**: Tratamento robusto de erros com logging
 * - **Normalização de Resultados**: Converte resultados para formato padrão
 * - **Logging Detalhado**: Registra todas as operações para debugging
 * - **Validação de Entrada**: Verifica existência da ferramenta antes de executar
 * 
 * ## Fluxo de Execução
 * 
 * 1. **Descoberta**: Localiza ferramenta no ToolRegistry pelo nome
 * 2. **Validação**: Verifica se a ferramenta existe
 * 3. **Execução**: Chama o método execute da ferramenta
 * 4. **Normalização**: Converte resultado para IToolResult padrão
 * 5. **Logging**: Registra sucesso ou erro da operação
 * 
 * @example
 * ```typescript
 * import { ToolExecutor } from '@/tools/core/toolExecutor';
 * import { toolRegistry } from '@/tools/core/toolRegistry';
 * 
 * // Registrar ferramenta
 * toolRegistry.register(new CalculatorTool());
 * 
 * // Executar ferramenta
 * const toolCall = {
 *   toolName: 'calculator',
 *   params: {
 *     operation: 'add',
 *     a: 10,
 *     b: 5
 *   }
 * };
 * 
 * try {
 *   const result = await ToolExecutor.execute(toolCall);
 *   console.log('Resultado:', result.observation);
 *   console.log('Metadados:', result.metadata);
 * } catch (error) {
 *   console.error('Erro na execução:', error.message);
 * }
 * ```
 * 
 * @see {@link IToolCall} Para formato de chamadas de ferramenta
 * @see {@link IToolResult} Para formato de resultados
 * @see {@link toolRegistry} Para registro e descoberta de ferramentas
 */
export class ToolExecutor {
    /** 
     * Executa uma chamada de ferramenta de forma segura e normalizada.
     * 
     * Este método é o ponto de entrada principal do sistema de execução
     * de ferramentas. Ele coordena todo o processo desde a descoberta
     * da ferramenta até a normalização do resultado.
     * 
     * @param toolCall Estrutura contendo o nome da ferramenta e parâmetros.
     * Deve incluir toolName válido e params compatíveis com a ferramenta.
     * 
     * @returns Promise que resolve para IToolResult normalizado.
     * 
     * @throws {Error} Se a ferramenta não for encontrada no registry
     * @throws {Error} Se houver erro durante a execução da ferramenta
     * 
     * @example
     * ```typescript
     * // Execução básica
     * const result = await ToolExecutor.execute({
     *   toolName: 'calculator',
     *   params: { operation: 'multiply', a: 6, b: 7 }
     * });
     * 
     * console.log(result.observation); // "Resultado: 42"
     * 
     * // Com tratamento de erro
     * try {
     *   const result = await ToolExecutor.execute(toolCall);
     *   // Processar resultado...
     * } catch (error) {
     *   if (error.message.includes('não encontrada')) {
     *     // Ferramenta não registrada
     *   } else {
     *     // Erro na execução da ferramenta
     *   }
     * }
     * ```
     * 
     * @remarks
     * - Localiza ferramenta no ToolRegistry pelo nome
     * - Emite logs detalhados para debugging
     * - Normaliza resultados para formato IToolResult padrão
     * - Propaga erros da ferramenta após logging
     * 
     * @see {@link IToolCall} Para formato da chamada
     * @see {@link IToolResult} Para formato do resultado
     */
    static async execute(toolCall: IToolCall): Promise<IToolResult> {
        logger.debug(`[ToolExecutor] Buscando ferramenta: ${toolCall.toolName}`);

        // 1. Descobrir ferramenta no registry
        const tool = toolRegistry.getTool(toolCall.toolName);

        // 2. Validar se ferramenta existe
        if (!tool) {
            const errorMsg = `Ferramenta não encontrada: ${toolCall.toolName}`;
            logger.error(`[ToolExecutor] ${errorMsg}`);
            throw new Error(errorMsg);
        }

        // 3. Log do início da execução
        logger.info(`[ToolExecutor] Executando ferramenta: ${toolCall.toolName}`);
        logger.debug(`[ToolExecutor] Parâmetros:`, toolCall.params);

        try {
            // 4. Executar a ferramenta
            const result = await tool.execute(toolCall.params);
            logger.debug(`[ToolExecutor] Sucesso na execução de ${toolCall.toolName}`);

            // 5. Normalizar resultado para IToolResult
            if (isToolResult(result)) {
                // Ferramenta já retornou estruturado
                return result;
            }

            // Tool retornou valor simples - wrap em IToolResult
            return {
                observation: result,
                metadata: undefined
            };
        } catch (error) {
            logger.error(`[ToolExecutor] Erro na execução de ${toolCall.toolName}:`, error);
            throw error;
        }
    }
}
