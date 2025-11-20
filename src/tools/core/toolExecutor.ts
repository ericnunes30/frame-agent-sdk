// src/tools/toolExecutor.ts
import { toolRegistry } from './toolRegistry';
import { IToolCall } from './interfaces';

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
        console.log(`[ToolExecutor] Executing tool: ${toolCall.toolName}`);
        const toolInstance = toolRegistry.getTool(toolCall.toolName);

        if (!toolInstance) {
            const errorMsg = `Erro: A ferramenta '${toolCall.toolName}' não está registrada no sistema.`;
            console.warn(`[ToolExecutor] ${errorMsg}`);
            return errorMsg;
        }

        try {
            console.log(`[ToolExecutor] Calling execute method for tool: ${toolCall.toolName}`);
            // Chama o método execute com os parâmetros já tipados e validados.
            const result = await toolInstance.execute(toolCall.params);
            
            console.log(`[ToolExecutor] Tool execution completed: ${toolCall.toolName}`);
            // Converte o resultado para string para ser injetado como Observação.
            return `Observation: ${JSON.stringify(result)}`;
        } catch (error) {
            console.error(`[ToolExecutor] Failed to execute tool '${toolCall.toolName}': ${(error as Error).message}`);
            return `Erro de Execução: Falha ao executar a ferramenta '${toolCall.toolName}'. Detalhes: ${(error as Error).message}`;
        }
    }
}
/**
 * Executor de ferramentas: resolve e executa chamadas de ferramentas
 * (ex.: a partir de uma instrução SAP) e retorna o resultado serializado.
 */
