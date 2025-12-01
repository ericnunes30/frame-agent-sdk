import { ToolDetector, ToolDetectionResult } from '@/tools/core/toolDetector';
import type { GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import type { Message } from '@/memory';
import { logger } from '@/utils/logger';

/**
 * Cria um nó de detecção de ferramentas.
 * Este nó analisa a última mensagem do estado (geralmente do LLM) e tenta detectar uma chamada de ferramenta.
 * Se detectado com sucesso, preenche `state.lastToolCall` e salva no histórico apenas saídas válidas.
 * Se houver erro de detecção, preenche metadados para feedback ao LLM.
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

            // Salva APENAS saídas válidas no histórico
            const assistantMessage: Message = { role: 'assistant', content: contentToParse };

            return {
                lastToolCall: result.toolCall,
                messages: [assistantMessage], // Salva no histórico apenas saídas válidas
                metadata: newMetadata,
                logs: [`Tool detected: ${result.toolCall.toolName}`]
            };
        }

        if (result.error) {
            logger.debug(`[ToolDetectionNode] Erro de detecção: ${result.error.message}`);

            // PADRONIZADO: Usa o mesmo formato do reactValidationNode
            const validationError = {
                isValid: false,
                error: {
                    message: result.error.message,
                    issues: result.error.issues,
                    llmHint: result.error.llmHint
                }
            };

            return {
                lastToolCall: undefined,
                metadata: {
                    ...(state.metadata || {}),
                    validation: {
                        passed: false,
                        error: validationError.error
                    }
                },
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
