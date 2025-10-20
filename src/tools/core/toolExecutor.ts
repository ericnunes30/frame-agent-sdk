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
        const toolInstance = toolRegistry.getTool(toolCall.toolName);

        if (!toolInstance) {
            return `Erro: A ferramenta '${toolCall.toolName}' nÃ£o estÃ¡ registrada no sistema.`;
        }

        try {
            // Chama o mÃ©todo execute com os parÃ¢metros jÃ¡ tipados e validados.
            const result = await toolInstance.execute(toolCall.params);
            
            // Converte o resultado para string para ser injetado como ObservaÃ§Ã£o.
            return `Observation: ${JSON.stringify(result)}`;
        } catch (error) {
            console.error(`Erro ao executar a ferramenta ${toolCall.toolName}:`, error);
            return `Erro de ExecuÃ§Ã£o: Falha ao executar a ferramenta '${toolCall.toolName}'. Detalhes: ${(error as Error).message}`;
        }
    }
}
/**
 * Executor de ferramentas: resolve e executa chamadas de ferramentas
 * (ex.: a partir de uma instrução SAP) e retorna o resultado serializado.
 */
