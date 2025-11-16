// src/tools/toolExecutor.ts
import { toolRegistry } from './toolRegistry';
import { IToolCall } from './interfaces';
import { logger } from '../../utils';

/**
 * ResponsÃ¡vel pelo fluxo de execuÃ§Ã£o da ferramenta. 
 * Recebe a aÃ§Ã£o tipada (IToolCall) e chama o mÃ©todo execute da ferramenta com seguranÃ§a.
 */
export class ToolExecutor {
    /**
     * Executa a Tool especificada na chamada de aÃ§Ã£o.
     * @param toolCall A chamada de ferramenta, jÃ¡ validada e tipada pelo SAP Parser.
     * @returns O resultado da execuÃ§Ã£o (a ObservaÃ§Ã£o do Agente).
     */
    public static async execute(toolCall: IToolCall): Promise<unknown> {
        logger.debug(`Executing tool: ${toolCall.toolName}`, 'ToolExecutor');
        const toolInstance = toolRegistry.getTool(toolCall.toolName);

        if (!toolInstance) {
            const errorMsg = `Erro: A ferramenta '${toolCall.toolName}' não está registrada no sistema.`;
            logger.warn(errorMsg, 'ToolExecutor');
            return errorMsg;
        }

        try {
            logger.debug(`Calling execute method for tool: ${toolCall.toolName}`, 'ToolExecutor');
            // Chama o método execute com os parâmetros já tipados e validados.
            const result = await toolInstance.execute(toolCall.params);
            
            logger.debug(`Tool execution completed: ${toolCall.toolName}`, 'ToolExecutor');
            // Converte o resultado para string para ser injetado como Observação.
            return `Observation: ${JSON.stringify(result)}`;
        } catch (error) {
            logger.error(`Failed to execute tool '${toolCall.toolName}': ${(error as Error).message}`, 'ToolExecutor');
            return `Erro de Execução: Falha ao executar a ferramenta '${toolCall.toolName}'. Detalhes: ${(error as Error).message}`;
        }
    }
}
/**
 * Executor de ferramentas: resolve e executa chamadas de ferramentas
 * (ex.: a partir de uma instrução SAP) e retorna o resultado serializado.
 */
