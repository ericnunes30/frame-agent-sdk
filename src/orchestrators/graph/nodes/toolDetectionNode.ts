import { ToolDetector, ToolDetectionResult } from '@/tools/core/toolDetector';
import type { GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import { logger } from '@/utils/logger';

/**
 * Cria um nó de detecção de ferramentas.
 * Este nó analisa a última mensagem do estado (geralmente do LLM) e tenta detectar uma chamada de ferramenta.
 * Se detectado com sucesso, preenche `state.lastToolCall`.
 * Se houver erro de validação/parsing, preenche metadados de validação para feedback ao LLM.
 */
export function createToolDetectionNode(): GraphNode {
    return async (state, engine): Promise<GraphNodeResult> => {
        logger.debug('[ToolDetectionNode] Iniciando detecção de tool');

        // 1. Obter a última mensagem (output do LLM)
        // Pode vir de state.lastModelOutput ou da última mensagem do histórico
        let contentToParse = state.lastModelOutput;

        if (!contentToParse && state.messages.length > 0) {
            const lastMsg = state.messages[state.messages.length - 1];
            if (lastMsg.role === 'assistant') {
                contentToParse = String(lastMsg.content);
            }
        }

        if (!contentToParse) {
            logger.warn('[ToolDetectionNode] Nenhuma saída de modelo encontrada para analisar');
            return { logs: ['No content to parse'] };
        }

        // 2. Usar ToolDetector para analisar
        const result: ToolDetectionResult = ToolDetector.detect(contentToParse);

        // 3. Processar resultado
        if (result.success && result.toolCall) {
            logger.info(`[ToolDetectionNode] Tool detectada: ${result.toolCall.toolName}`);

            // Limpa metadados de erro anteriores se houver
            const newMetadata = { ...(state.metadata || {}) };
            delete (newMetadata as any).validationHint;
            delete (newMetadata as any).validationIssues;

            return {
                lastToolCall: result.toolCall,
                metadata: newMetadata,
                logs: [`Tool detected: ${result.toolCall.toolName}`]
            };
        }

        if (result.error) {
            logger.debug(`[ToolDetectionNode] Erro de detecção: ${result.error.message}`);

            // Atualiza metadados com dicas de validação para o próximo passo (ex: Critic ou loop de correção)
            const newMetadata = {
                ...(state.metadata || {}),
                validationHint: result.error.llmHint,
                validationIssues: result.error.issues
            };

            return {
                lastToolCall: undefined, // Garante que não há tool call pendente
                metadata: newMetadata,
                logs: [`Detection error: ${result.error.message}`]
            };
        }

        // Caso não encontre nada (nem tool, nem erro explícito de parsing que retorne hint)
        // Pode ser apenas um texto comum do LLM
        logger.debug('[ToolDetectionNode] Nenhuma tool detectada (texto comum)');
        return {
            lastToolCall: undefined,
            logs: ['No tool detected']
        };
    };
}
