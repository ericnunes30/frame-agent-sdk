import { logger } from '@/utils/logger'

/**
 * Conversor de formato MCP (JSON Schema) para formato SAP (Schema Aligned Parsing)
 * 
 * Responsabilidade: Converter JSON Schema do MCP para formato SAP
 * 
 * Regras de Conversão:
 * - properties → Propriedades da classe
 * - required → Propriedades obrigatórias (sem ?)
 * - type → Tipo TypeScript correspondente
 * - description → Comentário inline
 * - minLength/maxLength → Comentário length: min=x, max=y
 * - minimum/maximum → Comentário range: min=x, max=y
 */
export class MCPToSAPConverter {
  /**
   * Converte JSON Schema do MCP para formato SAP
   * 
   * @param jsonSchema - Schema JSON do MCP
   * @param toolName - Nome da ferramenta para gerar nome da classe
   * @returns String no formato SAP
   */
  static convertJsonSchemaToSAP(jsonSchema: any, toolName: string): string {
    if (!jsonSchema || typeof jsonSchema !== 'object') {
      throw new Error('JSON Schema inválido fornecido para conversão')
    }

    if (!toolName || typeof toolName !== 'string') {
      throw new Error('Nome da ferramenta inválido fornecido para conversão')
    }

    logger.debug('MCPToSAPConverter - Convertendo schema:', {
      toolName,
      schema: jsonSchema
    })

    const className = toolName
    const properties = jsonSchema.properties || {}
    const required = new Set<string>(jsonSchema.required || [])

    const sapProperties: string[] = []

    for (const [propName, propSchema] of Object.entries(properties)) {
      const sapProperty = this.convertPropertyToSAP(propName, propSchema as any, required.has(propName))
      sapProperties.push(sapProperty)
    }

    const sapClass = `class ${className} = {\n${sapProperties.join('\n')}\n}`

    logger.debug('MCPToSAPConverter - Conversão concluída:', {
      toolName,
      className,
      propertyCount: sapProperties.length,
      sapOutput: sapClass
    })

    return sapClass
  }

  /**
   * Converte uma propriedade individual do JSON Schema para formato SAP
   */
  private static convertPropertyToSAP(propName: string, propSchema: any, isRequired: boolean): string {
    const typeScriptType = this.mapJsonTypeToTypeScript(propSchema.type)
    const comments = this.generatePropertyComments(propSchema)
    const optionalMarker = isRequired ? '' : '?'

    return `  ${propName}${optionalMarker}: ${typeScriptType}${comments}`
  }

  /**
   * Mapeia tipos JSON Schema para tipos TypeScript
   */
  private static mapJsonTypeToTypeScript(jsonType: string | string[]): string {
    if (Array.isArray(jsonType)) {
      // Para union types, pegar o primeiro não-null
      const nonNullType = jsonType.find(type => type !== 'null')
      return this.mapJsonTypeToTypeScript(nonNullType || 'string')
    }

    switch (jsonType) {
      case 'string':
        return 'string'
      case 'number':
        return 'number'
      case 'integer':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'array':
        return 'any[]'
      case 'object':
        return 'any'
      case 'null':
        return 'null'
      default:
        logger.warn('MCPToSAPConverter - Tipo JSON Schema não reconhecido:', jsonType)
        return 'any'
    }
  }

  /**
   * Gera comentários para a propriedade baseados no schema
   */
  private static generatePropertyComments(propSchema: any): string {
    const comments: string[] = []

    if (propSchema.description) {
      comments.push(`description: "${propSchema.description}"`)
    }

    if (propSchema.minLength !== undefined || propSchema.maxLength !== undefined) {
      const min = propSchema.minLength !== undefined ? `min=${propSchema.minLength}` : ''
      const max = propSchema.maxLength !== undefined ? `max=${propSchema.maxLength}` : ''
      const lengthRange = [min, max].filter(Boolean).join(', ')
      if (lengthRange) {
        comments.push(`length: ${lengthRange}`)
      }
    }

    if (propSchema.minimum !== undefined || propSchema.maximum !== undefined) {
      const min = propSchema.minimum !== undefined ? `min=${propSchema.minimum}` : ''
      const max = propSchema.maximum !== undefined ? `max=${propSchema.maximum}` : ''
      const range = [min, max].filter(Boolean).join(', ')
      if (range) {
        comments.push(`range: ${range}`)
      }
    }

    if (propSchema.enum) {
      comments.push(`enum: [${propSchema.enum.map((v: any) => JSON.stringify(v)).join(', ')}]`)
    }

    if (comments.length === 0) {
      return ''
    }

    return `; // ${comments.join(' // ')}`
  }
}