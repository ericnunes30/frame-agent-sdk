// src/tools/schemaGenerator.ts

import { ITool } from '@/tools/core/interfaces';
import type { SchemaProperties, PropertyDescriptor, PropertyType } from '@/tools/core/interfaces';

/**
 * Converte o parameterSchema de uma ferramenta no formato de Typed Schema (string) 
 * para injeção no System Prompt.
 * * EXEMPLO DE OUTPUT:
 * class Search = {
 * query: string;
 * maxResults: number;
 * }
 * * @param tool A instância da ferramenta com o parameterSchema definido.
 * @returns Uma string que representa o Typed Schema para o LLM.
 */
import { MCPToSAPConverter } from '@/tools/constructor/mcpToSapConverter';

/**
 * Converte o parameterSchema de uma ferramenta no formato de Typed Schema (string) 
 * para injeção no System Prompt.
 * * EXEMPLO DE OUTPUT:
 * class Search = {
 * query: string;
 * maxResults: number;
 * }
 * * @param tool A instância da ferramenta com o parameterSchema definido.
 * @returns Uma string que representa o Typed Schema para o LLM.
 */
function isDescriptor(v: unknown): v is PropertyDescriptor {
  const isObject = !!v && typeof v === 'object';
  const hasTypeProperty = isObject && 'type' in (v as Record<string, unknown>);
  return hasTypeProperty;
}

function formatEnum(desc: PropertyDescriptor): string {
  const hasEnum = desc.enum;
  const hasEnumItems = hasEnum && desc.enum && desc.enum.length > 0;
  return hasEnumItems ? ` // enum: ${desc.enum!.join(', ')}` : '';
}

function formatRange(desc: PropertyDescriptor): string {
  const parts: string[] = [];
  if (typeof desc.min === 'number') parts.push(`min=${desc.min}`);
  if (typeof desc.max === 'number') parts.push(`max=${desc.max}`);
  return parts.length ? ` // range: ${parts.join(', ')}` : '';
}

function formatLength(desc: PropertyDescriptor): string {
  const parts: string[] = [];
  if (typeof desc.minLength === 'number') parts.push(`min=${desc.minLength}`);
  if (typeof desc.maxLength === 'number') parts.push(`max=${desc.maxLength}`);
  return parts.length ? ` // length: ${parts.join(', ')}` : '';
}

export function generateTypedSchema(tool: ITool): string {
  // OBSERVAÇÃO: Em um ambiente real com reflection, esta lógica inspecionaria
  // metadados de decorators (ex: @type, @description) na classe referenciada.

  const schemaClass = tool.parameterSchema as { schemaProperties?: SchemaProperties } | undefined;
  const schemaName = tool.name;

  // VERIFICAÇÃO: Se for um JSON Schema padrão (usado pelo MCP), delegar para o conversor MCP
  // JSON Schema geralmente tem 'type': 'object' e 'properties' no nível raiz
  const isJsonSchema = tool.parameterSchema &&
    typeof tool.parameterSchema === 'object' &&
    ('type' in tool.parameterSchema || 'properties' in tool.parameterSchema) &&
    !('schemaProperties' in tool.parameterSchema);

  if (isJsonSchema) {
    try {
      // Usa o nome da ferramenta como base para o nome da classe, removendo caracteres inválidos se necessário
      // Mas o MCPToSAPConverter já lida com isso gerando `${toolName}Params`
      return MCPToSAPConverter.convertJsonSchemaToSAP(tool.parameterSchema, tool.name);
    } catch (error) {
      console.warn(`Falha ao converter JSON Schema para tool ${tool.name}, fallback para default:`, error);
    }
  }

  if (!schemaClass) {
    return `class ${schemaName} = {}`;
  }

  // Simulação: assumindo que a classe de parâmetros expõe um mapa de suas propriedades
  // em uma propriedade estática chamada 'schemaProperties'.
  const hasSchemaClass = schemaClass;
  const hasSchemaProperties = hasSchemaClass && schemaClass.schemaProperties;
  const schemaProperties: SchemaProperties = hasSchemaProperties || {};

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

      let typeStr: string = desc.type;
      if (desc.type === 'array' && desc.items) {
        const itemType = isDescriptor(desc.items) ? desc.items.type : desc.items;
        typeStr = `${itemType}[]`;
      }

      return `  ${key}${optMark}: ${typeStr};${enumTxt}${rangeTxt}${lenTxt}`;
    })
    .join('\n');

  // Constrói a string do Typed Schema
  // Se não há propriedades, retornar em uma linha para manter formato compacto esperado nos testes
  if (!propertiesString || propertiesString.trim() === '') {
    return `class ${schemaName} = {}`;
  }

  return `class ${schemaName} = {\n${propertiesString}\n}`;
}
/**
 * Geração de schemas tipados (JSON Schema) para ferramentas.
 * Pode ser estendido para suportar validações mais ricas.
 */
