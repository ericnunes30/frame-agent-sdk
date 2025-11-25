import { SAPParser, ISAPError } from '@/tools/constructor/sapParser';
import { IToolCall } from '@/tools/core/interfaces';
import { logger } from '@/utils/logger';

/**
 * Resultado da detecção de chamadas de ferramenta.
 * 
 * Interface que encapsula o resultado da operação de detecção,
 * indicando se uma chamada de ferramenta foi encontrada ou se
 * houve algum erro durante o processo.
 */
export interface ToolDetectionResult {
    /** Indica se a detecção foi bem-sucedida */
    success: boolean;
    /** Chamada de ferramenta detectada (apenas se success = true) */
    toolCall?: IToolCall;
    /** Erro detalhado da detecção (apenas se success = false) */
    error?: ISAPError;
}

/**
 * Detector inteligente de chamadas de ferramenta em saídas de LLM.
 * 
 * Esta classe atua como uma fachada simplificada para o sistema SAPParser,
 * fornecendo uma interface unificada para detectar e extrair chamadas de
 * ferramentas a partir de texto gerado por modelos de linguagem.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Detecção Automática**: Identifica chamadas de ferramenta em texto livre
 * - **Validação Estrutural**: Verifica se a chamada segue o formato SAP esperado
 * - **Tratamento de Erros**: Fornece feedback detalhado sobre falhas na detecção
 * - **Logging Integrado**: Registra todo o processo para debugging
 * - **Interface Simplificada**: Abstrai complexidade do SAPParser
 * 
 * ## Fluxo de Detecção
 * 
 * 1. **Validação de Entrada**: Verifica se o texto é válido e não vazio
 * 2. **Parsing**: Utiliza SAPParser para analisar o texto
 * 3. **Validação de Resultado**: Determina se é uma chamada válida ou erro
 * 4. **Normalização**: Retorna resultado estruturado com status e dados
 * 
 * ## Formato SAP (SAP - Structured Action Protocol)
 * 
 * O sistema espera chamadas de ferramenta no formato:
 * ```
 * [TOOL_CALL]
 * tool: nome_da_ferramenta
 * params: {param1: valor1, param2: valor2}
 * [/TOOL_CALL]
 * ```
 * 
 * @example
 * ```typescript
 * import { ToolDetector } from '@/tools/core/toolDetector';
 * 
 * // Texto com chamada de ferramenta
 * const llmOutput = `
 * Vou calcular a soma para você.
 * 
 * [TOOL_CALL]
 * tool: calculator
 * params: {"operation": "add", "a": 10, "b": 5}
 * [/TOOL_CALL]
 * `;
 * 
 * // Detectar ferramenta
 * const result = ToolDetector.detect(llmOutput);
 * 
 * if (result.success) {
 *   console.log('Ferramenta detectada:', result.toolCall);
 *   // { toolName: 'calculator', params: { operation: 'add', a: 10, b: 5 } }
 * } else {
 *   console.error('Erro na detecção:', result.error.message);
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Texto sem chamada de ferramenta
 * const simpleText = 'Olá! Como posso ajudá-lo hoje?';
 * const result = ToolDetector.detect(simpleText);
 * 
 * console.log(result.success); // false
 * console.log(result.error.message); // "Saída do LLM vazia ou inválida"
 * ```
 * 
 * @see {@link IToolCall} Para formato das chamadas detectadas
 * @see {@link ISAPError} Para formato dos erros de detecção
 * @see {@link SAPParser} Para detalhes do parser subjacente
 */
export class ToolDetector {
    /**
     * Detecta e extrai chamadas de ferramenta de texto gerado por LLM.
     * 
     * Este método analisa o texto fornecido em busca de chamadas de ferramenta
     * no formato SAP (Structured Action Protocol). Se encontrar uma chamada
     * válida, retorna um ToolDetectionResult com success=true e os dados da
     * chamada. Caso contrário, retorna success=false com detalhes do erro.
     * 
     * @param llmOutput Texto de saída do LLM a ser analisado.
     * Deve ser uma string não vazia contendo possivelmente uma chamada SAP.
     * 
     * @returns ToolDetectionResult com resultado da detecção.
     * 
     * @example
     * ```typescript
     * // Detecção bem-sucedida
     * const output = '[TOOL_CALL]\ntool: search\nparams: {"query": "TypeScript"}\n[/TOOL_CALL]';
     * const result = ToolDetector.detect(output);
     * 
     * if (result.success) {
     *   console.log(result.toolCall.toolName); // "search"
     *   console.log(result.toolCall.params.query); // "TypeScript"
     * }
     * 
     * // Detecção com falha
     * const invalidOutput = 'Texto sem formato SAP';
     * const result2 = ToolDetector.detect(invalidOutput);
     * 
     * if (!result2.success) {
     *   console.error(result2.error.message);
     * }
     * ```
     * 
     * @remarks
     * - Utiliza SAPParser internamente para análise estrutural
     * - Valida entrada antes de processar
     * - Emite logs detalhados para debugging
     * - Retorna resultado estruturado independente do sucesso/falha
     * 
     * @see {@link ToolDetectionResult} Para formato do resultado
     * @see {@link IToolCall} Para formato das chamadas válidas
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
