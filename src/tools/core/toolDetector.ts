import { SAPParser, ISAPError } from '@/tools/constructor/sapParser';
import { IToolCall } from '@/tools/core/interfaces';
import { logger } from '@/utils/logger';

export interface ToolDetectionResult {
    success: boolean;
    toolCall?: IToolCall;
    error?: ISAPError;
}

/**
 * ToolDetector
 * 
 * Responsável por detectar e extrair chamadas de ferramentas a partir da saída do LLM.
 * Atua como uma fachada para o SAPParser, fornecendo uma interface simplificada para detecção.
 */
export class ToolDetector {
    /**
     * Detecta uma chamada de ferramenta na string fornecida.
     * 
     * @param llmOutput A string de saída do LLM.
     * @returns Um objeto ToolDetectionResult indicando sucesso ou falha.
     */
    static detect(llmOutput: string): ToolDetectionResult {
        logger.debug('[ToolDetector] Iniciando detecção de tool na saída do LLM');

        if (!llmOutput || typeof llmOutput !== 'string') {
            return {
                success: false,
                error: {
                    message: 'Saída do LLM vazia ou inválida',
                    rawOutput: String(llmOutput)
                }
            };
        }

        const result = SAPParser.parseAndValidate(llmOutput);

        // Verifica se o resultado é um erro (ISAPError)
        if ('message' in result && 'rawOutput' in result && !('toolName' in result)) {
            const error = result as ISAPError;
            logger.debug(`[ToolDetector] Falha na detecção: ${error.message}`);
            return {
                success: false,
                error: error
            };
        }

        // Se chegou aqui, é um IToolCall válido
        const toolCall = result as IToolCall;
        logger.debug(`[ToolDetector] Tool detectada com sucesso: ${toolCall.toolName}`);

        return {
            success: true,
            toolCall: toolCall
        };
    }
}
