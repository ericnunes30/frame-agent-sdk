// src/tools/schemaGenerator.ts

import { ITool } from '@/tools/core/interfaces';
import type { SchemaProperties, PropertyDescriptor, PropertyType } from '@/tools/core/interfaces';
import { MCPToSAPConverter } from '@/tools/constructor/mcpToSapConverter';
import { logger } from '@/utils/logger';

/**
 * Gerador de schemas tipados para ferramentas do sistema.
 * 
 * Este módulo é responsável por converter schemas de parâmetros de ferramentas
 * em formato legível por LLMs, facilitando a geração automática de prompts
 * que incluem definições de ferramentas com suas respectivas interfaces.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Conversão de Schema**: Transforma schemas TypeScript em strings legíveis
 * - **Suporte a JSON Schema**: Compatível com schemas no formato JSON Schema
 * - **Formatação Rica**: Inclui informações sobre enums, ranges e validações
 * - **Integração MCP**: Suporte a conversão de schemas MCP para formato SAP
 * - **Geração Automática**: Cria schemas para injeção em system prompts
 * 
 * ## Formato de Saída
 * 
 * O gerador produz schemas no formato:
 * ```typescript
 * class NomeFerramenta = {
 *   parametro1: string; // enum: valor1, valor2
 *   parametro2: number; // range: min=1, max=100
 *   parametroOpcional?: boolean;
 * }
 * ```
 * 
 * ## Casos de Uso
 * 
 * - **System Prompts**: Gerar definições de ferramentas para LLMs
 * - **Documentação**: Criar documentação automática de ferramentas
 * - **Validação**: Verificar compatibilidade de parâmetros
 * - **Integração**: Facilitar integração entre diferentes sistemas de ferramentas
 * 
 * @example
 * ```typescript
 * import { generateTypedSchema } from '@/tools/constructor/schemaGenerator';
 * 
 * // Definir ferramenta
 * class CalculatorTool extends ToolBase<CalculatorParams, number> {
 *   public readonly name = 'calculator';
 *   public readonly parameterSchema = CalculatorParams;
 * }
 * 
 * // Gerar schema
 * const schema = generateTypedSchema(new CalculatorTool());
 * console.log(schema);
 * // Output:
 * // class calculator = {
 * //   operation: string; // enum: add, subtract, multiply, divide
 * //   a: number;
 * //   b: number;
 * // }
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
 * Formata informações de enum para inclusão no schema.
 * 
 * @param desc Descriptor da propriedade contendo informações de enum.
 * 
 * @returns String formatada com valores do enum ou string vazia.
 */
function formatEnum(desc: PropertyDescriptor): string {
  const hasEnum = desc.enum;
  const hasEnumItems = hasEnum && desc.enum && desc.enum.length > 0;
  return hasEnumItems ? ` // enum: ${desc.enum!.join(', ')}` : '';
}

/**
 * Formata informações de range numérico para inclusão no schema.
 * 
 * @param desc Descriptor da propriedade contendo informações de range.
 * 
 * @returns String formatada com valores min/max ou string vazia.
 */
function formatRange(desc: PropertyDescriptor): string {
  const parts: string[] = [];
  if (typeof desc.min === 'number') parts.push(`min=${desc.min}`);
  if (typeof desc.max === 'number') parts.push(`max=${desc.max}`);
  return parts.length ? ` // range: ${parts.join(', ')}` : '';
}

/**
 * Formata informações de comprimento para inclusão no schema.
 * 
 * @param desc Descriptor da propriedade contendo informações de comprimento.
 * 
 * @returns String formatada com valores minLength/maxLength ou string vazia.
 */
function formatLength(desc: PropertyDescriptor): string {
  const parts: string[] = [];
  if (typeof desc.minLength === 'number') parts.push(`min=${desc.minLength}`);
  if (typeof desc.maxLength === 'number') parts.push(`max=${desc.maxLength}`);
  return parts.length ? ` // length: ${parts.join(', ')}` : '';
}

/**
 * Gera schema tipado para uma ferramenta em formato legível por LLM.
 * 
 * Esta função é o ponto de entrada principal do gerador de schemas. Ela
 * converte o parameterSchema de uma ferramenta em uma string formatada
 * que pode ser injetada em system prompts para fornecer ao LLM informações
 * sobre como chamar a ferramenta corretamente.
 * 
 * ## Processo de Conversão
 * 
 * 1. **Detecção de Formato**: Identifica se é JSON Schema ou schemaProperties
 * 2. **Conversão MCP**: Se for JSON Schema, delega para MCPToSAPConverter
 * 3. **Processamento SAP**: Converte schemaProperties para formato legível
 * 4. **Formatação**: Adiciona metadados como enums, ranges e validações
 * 5. **Geração Final**: Produz string no formato class Nome = { ... }
 * 
 * @param tool Instância da ferramenta com parameterSchema definido.
 * 
 * @returns String representando o Typed Schema para o LLM.
 * 
 * @example
 * ```typescript
 * // Schema simples
 * class SimpleTool extends ToolBase<SimpleParams, string> {
 *   public readonly name = 'simple_tool';
 *   public readonly parameterSchema = SimpleParams;
 * }
 * 
 * const schema = generateTypedSchema(new SimpleTool());
 * console.log(schema);
 * // class simple_tool = {
 * //   message: string;
 * // }
 * ```
 * 
 * @example
 * ```typescript
 * // Schema com validações
 * class ValidatedTool extends ToolBase<ValidatedParams, number> {
 *   public readonly name = 'validated_tool';
 *   public readonly parameterSchema = ValidatedParams;
 * }
 * 
 * const schema = generateTypedSchema(new ValidatedTool());
 * console.log(schema);
 * // class validated_tool = {
 * //   operation: string; // enum: add, subtract, multiply, divide
 * //   value: number; // range: min=1, max=100
 * //   precision?: number; // range: min=0, max=10
 * // }
 * ```
 * 
 * @example
 * ```typescript
 * // Schema vazio
 * class EmptyTool extends ToolBase<EmptyParams, void> {
 *   public readonly name = 'empty_tool';
 *   public readonly parameterSchema = EmptyParams;
 * }
 * 
 * const schema = generateTypedSchema(new EmptyTool());
 * console.log(schema);
 * // class empty_tool = {}
 * ```
 * 
 * @see {@link ITool} Para interface da ferramenta
 * @see {@link SchemaProperties} Para formato do schema
 * @see {@link MCPToSAPConverter} Para conversão de JSON Schema
 */
export function generateTypedSchema(tool: ITool): string {
  // 1. Extrair informações básicas do schema
  const schemaClass = tool.parameterSchema as { schemaProperties?: SchemaProperties } | undefined;
  const schemaName = tool.name;

  // 2. Detectar se é JSON Schema (formato MCP)
  // JSON Schema geralmente tem 'type': 'object' e 'properties' no nível raiz
  const isJsonSchema = tool.parameterSchema &&
    typeof tool.parameterSchema === 'object' &&
    ('type' in tool.parameterSchema || 'properties' in tool.parameterSchema) &&
    !('schemaProperties' in tool.parameterSchema);

  // 3. Se for JSON Schema, delegar para conversor MCP
  if (isJsonSchema) {
    try {
      return MCPToSAPConverter.convertJsonSchemaToSAP(tool.parameterSchema, tool.name);
    } catch (error) {
      logger.warn(`Falha ao converter JSON Schema para tool ${tool.name}, fallback para default:`, error);
    }
  }

  // 4. Se não há schema class, retornar schema vazio
  if (!schemaClass) {
    return `class ${schemaName} = {}`;
  }

  // 5. Extrair propriedades do schema
  const hasSchemaClass = schemaClass;
  const hasSchemaProperties = hasSchemaClass && schemaClass.schemaProperties;
  const schemaProperties: SchemaProperties = hasSchemaProperties || {};

  // 6. Gerar string de propriedades formatadas
  const propertiesString = Object.entries(schemaProperties)
    .map(([rawKey, rawDesc]) => {
      const key = rawKey.replace(/\?$/, '');
      const desc: PropertyDescriptor = isDescriptor(rawDesc)
        ? { required: true, ...(rawDesc as PropertyDescriptor) }
        : { type: rawDesc as PropertyType, required: !rawKey.endsWith('?') };

      const optMark = (desc.required ?? true) ? '' : '?';
      const enumTxt = formatEnum(desc);
      const rangeTxt = formatRange(desc);
      const lenTxt = formatLength(desc);

      // 7. Formatar tipo da propriedade
      let typeStr: string = desc.type;
      if (desc.type === 'array' && desc.items) {
        const itemType = isDescriptor(desc.items) ? desc.items.type : desc.items;
        typeStr = `${itemType}[]`;
      }

      // 8. Retornar propriedade formatada
      return `  ${key}${optMark}: ${typeStr};${enumTxt}${rangeTxt}${lenTxt}`;
    })
    .join('\n');

  // 9. Construir schema final
  // Se não há propriedades, retornar em uma linha para manter formato compacto
  if (!propertiesString || propertiesString.trim() === '') {
    return `class ${schemaName} = {}`;
  }

  return `class ${schemaName} = {\n${propertiesString}\n}`;
}
/**
 * Geração de schemas tipados (JSON Schema) para ferramentas.
 * Pode ser estendido para suportar validações mais ricas.
 */
