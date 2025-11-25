import { toolRegistry } from '@/tools/core/toolRegistry';
import type { IToolCall, IToolResult } from '@/tools/core/interfaces';
import { logger } from '@/utils/logger';

/**
 * Verifica se o valor é um IToolResult estruturado
 */
function isToolResult(value: unknown): value is IToolResult {
    return (
        typeof value === 'object' &&
        value !== null &&
        'observation' in value
    );
}

/**
 * Executor de ferramentas.
 * Responsável por receber uma chamada de ferramenta (IToolCall),
 * localizar a ferramenta no registro e executá-la.
 */
export class ToolExecutor {
    /**
     * Executa uma chamada de ferramenta.
     * @param toolCall A estrutura contendo o nome da ferramenta e os parâmetros.
     * @returns Resultado estruturado com observation e metadata opcional
     */
    static async execute(toolCall: IToolCall): Promise<IToolResult> {
        logger.debug(`[ToolExecutor] Buscando ferramenta: ${toolCall.toolName}`);

        const tool = toolRegistry.getTool(toolCall.toolName);

        if (!tool) {
            const errorMsg = `Ferramenta não encontrada: ${toolCall.toolName}`;
            logger.error(`[ToolExecutor] ${errorMsg}`);
            throw new Error(errorMsg);
        }

        logger.info(`[ToolExecutor] Executando ferramenta: ${toolCall.toolName}`);
        logger.debug(`[ToolExecutor] Parâmetros:`, toolCall.params);

        try {
            const result = await tool.execute(toolCall.params);
            logger.debug(`[ToolExecutor] Sucesso na execução de ${toolCall.toolName}`);

            // Normaliza resultado para IToolResult
            if (isToolResult(result)) {
                // Tool já retornou estruturado
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
