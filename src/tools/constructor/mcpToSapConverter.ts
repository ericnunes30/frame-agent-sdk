import { logger } from '@/utils/logger'

/**
 * Conversor de formato MCP (JSON Schema) para formato SAP (Schema Aligned Parsing)
 * 
 * Responsabilidade: Converter JSON Schema do MCP para formato SAP simplificado
 * 
 * Regras de Conversão Simplificadas:
 * - Envolve todo o JSON Schema original dentro de uma classe
 * - Formato: class NomeClasse = ({ JSON Schema completo })
 * - Preserva toda a estrutura original do MCP sem transformações complexas
 */
export class MCPToSAPConverter {
  /**
   * Converte JSON Schema do MCP para formato SAP simplificado
   * 
   * @param jsonSchema - Schema JSON do MCP
   * @param toolName - Nome da ferramenta para gerar nome da classe
   * @returns String no formato SAP simplificado
   */
  static convertJsonSchemaToSAP(jsonSchema: any, toolName: string): string {
    if (!jsonSchema || typeof jsonSchema !== 'object') {
      throw new Error('JSON Schema inválido fornecido para conversão')
    }

    if (!toolName || typeof toolName !== 'string') {
      throw new Error('Nome da ferramenta inválido fornecido para conversão')
    }

    logger.debug('🔄 MCPToSAPConverter - INICIANDO CONVERSÃO MCP → SAP (SIMPLIFICADO)');
    logger.debug('='.repeat(80));
    logger.debug(`🛠️  Tool Name: ${toolName}`);
    logger.debug('📋 JSON Schema Completo (MCP):');
    logger.debug(JSON.stringify(jsonSchema, null, 2));
    logger.debug('='.repeat(80));

    const className = toolName
    const jsonString = JSON.stringify(jsonSchema, null, 2)

    // Formato simplificado: envolver todo o JSON Schema dentro da classe
    const sapClass = `class ${className} = (\n  { \n${jsonString}\n  }\n)`

    logger.debug('✅ MCPToSAPConverter - CONVERSÃO CONCLUÍDA (SIMPLIFICADO)');
    logger.debug('='.repeat(80));
    logger.debug(`🛠️  Tool Name: ${toolName}`);
    logger.debug(`📝 Class Name: ${className}`);
    logger.debug('📄 SAP Output Completo:');
    logger.debug(sapClass);
    logger.debug('='.repeat(80));

    return sapClass
  }

  
}