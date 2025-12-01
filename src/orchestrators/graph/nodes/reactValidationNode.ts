import { validateReActFormat, ValidationResponse } from '@/agent/core/validateReAct';
import type { GraphNode, GraphNodeResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import { logger } from '@/utils/logger';

/**
 * Cria um nó de validação de formato ReAct.
 * Este nó verifica se a última saída do modelo segue o formato ReAct correto.
 * O resultado da validação é armazenado em metadata.validation para uso por outros nós.
 */
export function createReactValidationNode(): GraphNode {
    return async (state, engine): Promise<GraphNodeResult> => {
        logger.debug('[ReactValidationNode] Iniciando validação do formato ReAct');

        // Verificar se há conteúdo para validar
        if (!state.lastModelOutput) {
            logger.debug('[ReactValidationNode] Não há output para validar');
            return { 
                metadata: { 
                    ...(state.metadata || {}),
                    validation: { 
                        passed: true 
                    } 
                } 
            };
        }

        // Validar o formato ReAct
        const validation: ValidationResponse = validateReActFormat(state.lastModelOutput);
        
        logger.debug(`[ReactValidationNode] Validação concluída: ${validation.isValid ? 'válida' : 'inválida'}`);

        // Armazenar resultado da validação em metadata para uso por outros nós
        return {
            metadata: {
                ...(state.metadata || {}),
                validation: {
                    passed: validation.isValid,
                    error: validation.error
                }
            },
            logs: [
                validation.isValid 
                    ? 'Formato ReAct válido' 
                    : `Formato ReAct inválido: ${validation.error?.message}`
            ]
        };
    };
}