// src/tools/core/toolValidator.ts
import { ITool, PropertyDescriptor, PropertyType, SchemaProperties, ToolValidationIssue, ToolValidationResult } from '@/tools/core/interfaces';
import { ToolDetector } from './toolDetector';
import { logger } from '@/utils/logger';

/**
 * Utilitários de validação de parâmetros de ferramentas.
 * 
 * Este módulo fornece funções para validar parâmetros de ferramentas contra
 * schemas definidos, retornando informações detalhadas sobre problemas de
 * validação que podem ser usadas para fornecer feedback ao LLM.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Validação de Presença**: Verifica se propriedades obrigatórias estão presentes
 * - **Validação de Tipo**: Confirma se valores correspondem aos tipos esperados
 * - **Validação de Enum**: Verifica se valores estão em listas permitidas
 * - **Validação de Range**: Confirma se números estão em intervalos válidos
 * - **Validação de Comprimento**: Verifica limites de tamanho para strings/arrays
 * - **Feedback Estruturado**: Retorna problemas formatados para LLM
 * 
 * ## Tipos de Validação Suportados
 * 
 * - **Tipos Básicos**: string, number, boolean, array, object
 * - **Propriedades Opcionais**: Marcadas com ? no nome ou required: false
 * - **Enums**: Listas de valores permitidos
 * - **Ranges Numéricos**: min/max para números
 * - **Comprimento**: minLength/maxLength para strings e arrays
 * 
 * @example
 * ```typescript
 * import { validateToolParams, formatIssuesForLLM } from '@/tools/core/toolValidator';
 * 
 * // Definir schema da ferramenta
 * class CalculatorTool {
 *   static schemaProperties = {
 *     operation: { type: 'string', enum: ['add', 'subtract', 'multiply', 'divide'] },
 *     a: { type: 'number', required: true },
 *     b: { type: 'number', required: true },
 *     precision?: { type: 'number', min: 0, max: 10 }
 *   };
 * }
 * 
 * // Validar parâmetros
 * const tool = new CalculatorTool();
 * const params = { operation: 'add', a: 10, b: 'five' }; // b deveria ser number
 * 
 * const result = validateToolParams(tool, params);
 * 
 * if (!result.valid) {
 *   console.log('Problemas encontrados:', result.issues);
 *   const feedback = formatIssuesForLLM(result.issues);
 *   console.log('Feedback para LLM:', feedback);
 * }
 * ```
 */

/**
 * Verifica se um valor é um PropertyDescriptor completo.
 * 
 * Função utilitária que determina se um valor é um descriptor de propriedade
 * completo (com type, required, etc.) ou apenas um tipo simples.
 * 
 * @param v Valor a ser verificado.
 * 
 * @returns true se é um PropertyDescriptor, false se é apenas um tipo.
 */
function isDescriptor(v: unknown): v is PropertyDescriptor {
  const isObject = !!v && typeof v === 'object';
  const hasTypeProperty = isObject && 'type' in (v as Record<string, unknown>);
  return hasTypeProperty;
}

/**
 * Determina o tipo primitivo de um valor.
 * 
 * Função que retorna o tipo básico de um valor para fins de validação,
 * tratando arrays como tipo especial 'array'.
 * 
 * @param value Valor cujo tipo será determinado.
 * 
 * @returns Tipo primitivo do valor.
 */
function typeOf(value: unknown): PropertyType {
  if (Array.isArray(value)) return 'array';
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'object';
}

/**
 * Normaliza um descriptor de propriedade.
 * 
 * Converte descritores de propriedade em formato misto (tipo simples ou
 * objeto completo) para um formato padrão PropertyDescriptor.
 * 
 * @param rawKey Chave da propriedade (pode terminar com ? para opcional).
 * @param rawDesc Descriptor em formato simples ou completo.
 * 
 * @returns Objeto com chave normalizada e descriptor completo.
 */
function normalizeDescriptor(rawKey: string, rawDesc: PropertyType | PropertyDescriptor): { key: string; desc: PropertyDescriptor } {
  const key = rawKey.replace(/\?$/, '');
  const desc: PropertyDescriptor = isDescriptor(rawDesc)
    ? { required: true, ...(rawDesc as PropertyDescriptor) }
    : {
        type: (rawDesc as string).replace(/\?$/, '') as PropertyType,
        required: !rawKey.endsWith('?') && !(typeof rawDesc === 'string' && rawDesc.endsWith('?'))
      };
  return { key, desc };
}

/**
 * Valida se uma propriedade obrigatória está presente.
 * 
 * @param key Nome da propriedade.
 * @param desc Descriptor da propriedade.
 * @param value Valor da propriedade.
 * 
 * @returns ToolValidationIssue se a propriedade está ausente, null caso contrário.
 */
function validatePresence(key: string, desc: PropertyDescriptor, value: unknown): ToolValidationIssue | null {
  const present = value !== undefined && value !== null;
  if ((desc.required ?? true) && !present) {
    return { path: key, code: 'missing_required', message: `Property '${key}' is required` };
  }
  return null;
}

/**
 * Valida se o tipo de um valor corresponde ao esperado.
 * 
 * @param key Nome da propriedade.
 * @param expected Tipo esperado.
 * @param value Valor a ser validado.
 * 
 * @returns ToolValidationIssue se o tipo está incorreto, null caso contrário.
 */
function validateType(key: string, expected: PropertyType, value: unknown): ToolValidationIssue | null {
  if (value === undefined || value === null) return null; // handled by presence
  const t = typeOf(value);
  return t === expected ? null : { path: key, code: 'invalid_type', message: `Property '${key}' must be of type ${expected}` };
}

/**
 * Valida se um valor está em uma lista de valores permitidos (enum).
 * 
 * @param key Nome da propriedade.
 * @param desc Descriptor da propriedade.
 * @param value Valor a ser validado.
 * 
 * @returns ToolValidationIssue se o valor não está no enum, null caso contrário.
 */
function validateEnum(key: string, desc: PropertyDescriptor, value: unknown): ToolValidationIssue | null {
  if (!desc.enum || value === undefined || value === null) return null;
  return (desc.enum as ReadonlyArray<unknown>).includes(value as unknown)
    ? null
    : { path: key, code: 'invalid_enum', message: `Property '${key}' must be one of: ${desc.enum.join(', ')}` };
}

/**
 * Valida se um número está dentro de um intervalo permitido.
 * 
 * @param key Nome da propriedade.
 * @param desc Descriptor da propriedade.
 * @param value Valor numérico a ser validado.
 * 
 * @returns Lista de ToolValidationIssue para problemas de range.
 */
function validateNumberRange(key: string, desc: PropertyDescriptor, value: unknown): ToolValidationIssue[] {
  if (typeOf(value) !== 'number') return [];
  const v = value as number;
  const out: ToolValidationIssue[] = [];
  if (typeof desc.min === 'number' && v < desc.min) {
    out.push({ path: key, code: 'out_of_range', message: `Property '${key}' must be >= ${desc.min}` });
  }
  if (typeof desc.max === 'number' && v > desc.max) {
    out.push({ path: key, code: 'out_of_range', message: `Property '${key}' must be <= ${desc.max}` });
  }
  return out;
}

/**
 * Valida restrições de comprimento para strings e arrays.
 * 
 * @param key Nome da propriedade.
 * @param desc Descriptor da propriedade.
 * @param value Valor a ser validado.
 * 
 * @returns Lista de ToolValidationIssue para problemas de comprimento.
 */
function validateLengthConstraints(key: string, desc: PropertyDescriptor, value: unknown): ToolValidationIssue[] {
  const t = typeOf(value);
  if (t !== 'string' && t !== 'array') return [];
  const len = t === 'string' ? (value as string).length : (value as unknown[]).length;
  const out: ToolValidationIssue[] = [];
  if (typeof desc.minLength === 'number' && len < desc.minLength) {
    out.push({ path: key, code: 'length_out_of_range', message: `Property '${key}' length must be >= ${desc.minLength}` });
  }
  if (typeof desc.maxLength === 'number' && len > desc.maxLength) {
    out.push({ path: key, code: 'length_out_of_range', message: `Property '${key}' length must be <= ${desc.maxLength}` });
  }
  return out;
}

/**
 * Valida parâmetros de uma ferramenta contra seu schema.
 * 
 * Esta função é o ponto de entrada principal para validação de parâmetros.
 * Ela verifica todos os aspectos do schema da ferramenta e retorna um
 * resultado detalhado com todos os problemas encontrados.
 * 
 * @param tool Ferramenta cujo schema será usado para validação.
 * @param params Parâmetros a serem validados.
 * 
 * @returns ToolValidationResult com resultado da validação.
 * 
 * @example
 * ```typescript
 * // Definir ferramenta com schema
 * class SearchTool {
 *   static schemaProperties = {
 *     query: { type: 'string', required: true, minLength: 3 },
 *     limit?: { type: 'number', min: 1, max: 100 }
 *   };
 * }
 * 
 * // Validar parâmetros
 * const tool = new SearchTool();
 * const result = validateToolParams(tool, { query: 'ab', limit: 150 });
 * 
 * console.log(result.valid); // false
 * console.log(result.issues); // [
 *   // { path: 'query', code: 'length_out_of_range', message: '...' },
 *   // { path: 'limit', code: 'out_of_range', message: '...' }
 * // ]
 * ```
 */
export function validateToolParams(tool: ITool, params: unknown): ToolValidationResult {
  // 1. Extrair schema da ferramenta
  const schemaClass = tool.parameterSchema as { schemaProperties?: SchemaProperties } | undefined;
  const schemaProps: SchemaProperties = (schemaClass && schemaClass.schemaProperties) || {};

  // Debug para identificar problema
  logger.debug(`[ToolValidator] Validando tool: ${tool.name}`, {
    schema: schemaProps,
    params: params,
    paramsType: typeof params
  });

  const issues: ToolValidationIssue[] = [];

  // 2. Validar cada propriedade do schema
  for (const [rawKey, rawDesc] of Object.entries(schemaProps)) {
    const { key, desc } = normalizeDescriptor(rawKey, rawDesc as PropertyType | PropertyDescriptor);
    const value = (params as Record<string, unknown> | undefined)?.[key];

    // 3. Validação de presença (propriedades obrigatórias)
    const missing = validatePresence(key, desc, value);
    if (missing) {
      issues.push(missing);
    }

    // 4. Early return para valores nulos/undefined - evita validações desnecessárias
    if (value === undefined || value === null) {
      continue;
    }

    // 5. Validação de tipo
    const typeIssue = validateType(key, desc.type, value);
    if (typeIssue) {
      issues.push(typeIssue);
    }

    // 6. Validação de enum
    const enumIssue = validateEnum(key, desc, value);
    if (enumIssue) {
      issues.push(enumIssue);
    }

    // 7. Validações numéricas e de comprimento
    issues.push(
      ...validateNumberRange(key, desc, value),
      ...validateLengthConstraints(key, desc, value),
    );
  }

  // 8. Retornar resultado estruturado
  return { valid: issues.length === 0, issues: issues.length ? issues : undefined };
}

/**
 * Formata problemas de validação para feedback ao LLM.
 * 
 * Esta função converte uma lista de ToolValidationIssue em uma string
 * formatada especificamente para ser usada como feedback ao modelo de
 * linguagem, seguindo o padrão esperado pelos agentes.
 * 
 * @param issues Lista de problemas de validação encontrados.
 * 
 * @returns String formatada com feedback para o LLM.
 * 
 * @example
 * ```typescript
 * const issues = [
 *   { path: 'query', code: 'missing_required', message: "Property 'query' is required" },
 *   { path: 'limit', code: 'out_of_range', message: "Property 'limit' must be <= 100" }
 * ];
 * 
 * const feedback = formatIssuesForLLM(issues);
 * console.log(feedback);
 * // Output:
 * // Your tool output does not match the required schema. Fix these issues and try again using the exact JSON format.
 * // - query: Property 'query' is required
 * // - limit: Property 'limit' must be <= 100
 * ```
 */
export function formatIssuesForLLM(issues: ToolValidationIssue[]): string {
  const bullets = issues
    .map((i) => `- ${i.path}: ${i.message}`)
    .join('\n');
  return `Your tool output does not match the required schema. Fix these issues and try again using the exact JSON format.\n${bullets}`;
}

/**
 * Validador de formato ReAct para integração com agentFlow.ts
 * 
 * Esta classe fornece uma interface simplificada para validar saídas do LLM
 * no formato ReAct e determinar se o fluxo deve continuar ou retornar ao agente
 * para correção.
 * 
 * ## Funcionalidades
 * 
 * - Validação completa do formato ReAct usando ToolDetector
 * - Classificação de tipos de erro (parsing, validation, format, unknown)
 * - Retorno estruturado booleano para controle de fluxo
 * - Integração direta com o sistema de metadados do GraphEngine
 * 
 * ## Uso no agentFlow.ts
 * 
 * ```typescript
 * // No router do agentFlow.ts
 * const validation = state.metadata?.validation;
 * if (validation?.isValid === false) {
 *   return 'agent'; // Volta ao agente para correção
 * }
 * if (validation?.isValid === true) {
 *   return 'execute'; // Continua para execução
 * }
 * ```
 */
export class ReActValidator {
  /**
   * Valida uma saída do LLM no formato ReAct
   * 
   * @param llmOutput Saída do LLM a ser validada
   * @returns Objeto com isValid boolean e detalhes do erro ou toolCall
   */
  static validateReActFormat(llmOutput: string): {
    isValid: boolean;
    error?: {
      message: string;
      type: 'parsing' | 'validation' | 'format' | 'unknown';
      details?: any;
    };
    toolCall?: any;
  } {
    try {
      const result = ToolDetector.detect(llmOutput);
      
      if (result.success && result.toolCall) {
        return {
          isValid: true,
          toolCall: result.toolCall
        };
      }
      
      if (result.error) {
        return {
          isValid: false,
          error: {
            message: result.error.message,
            type: this.getErrorType(result.error.message),
            details: result.error
          }
        };
      }
      
      // Nenhuma tool detectada, mas também nenhum erro explícito
      return {
        isValid: false,
        error: {
          message: 'Nenhuma chamada de ferramenta detectada no formato ReAct',
          type: 'format'
        }
      };
    } catch (error) {
      return {
        isValid: false,
        error: {
          message: error instanceof Error ? error.message : 'Erro desconhecido na validação',
          type: 'unknown'
        }
      };
    }
  }
  
  /**
   * Classifica o tipo de erro com base na mensagem
   * 
   * @param errorMessage Mensagem de erro do ToolDetector
   * @returns Tipo de erro classificado
   */
  private static getErrorType(errorMessage: string): 'parsing' | 'validation' | 'format' | 'unknown' {
    if (errorMessage.includes('JSON inválido') || errorMessage.includes('JSON')) {
      return 'parsing';
    }
    if (errorMessage.includes('Parâmetros inválidos') || errorMessage.includes('schema')) {
      return 'validation';
    }
    if (errorMessage.includes('extrair uma chamada de ferramenta')) {
      return 'format';
    }
    return 'unknown';
  }
}
