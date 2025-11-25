import { logger } from '@/utils/logger'

/**
 * Conversor de formato SAP (Schema Aligned Parsing) para formato MCP (JSON Schema)
 * 
 * Responsabilidade: Converter formato SAP para JSON válido do MCP
 * 
 * Regras de Conversão:
 * - Propriedades com ? → required omitido
 * - Comentários length → minLength/maxLength
 * - Comentários range → minimum/maximum
 * - Tipos TypeScript → Tipos JSON Schema correspondentes
 */
export class SAPToMCPConverter {
  /**
   * Converte formato SAP para JSON Schema do MCP
   * 
   * @param sapFormat - String no formato SAP
   * @param toolName - Nome da ferramenta
   * @returns JSON Schema válido do MCP
   */
  static convertSAPToMCP(sapFormat: string, toolName: string): any {
    if (!sapFormat || typeof sapFormat !== 'string') {
      throw new Error('Formato SAP inválido fornecido para conversão')
    }

    if (!toolName || typeof toolName !== 'string') {
      throw new Error('Nome da ferramenta inválido fornecido para conversão')
    }

    logger.debug('SAPToMCPConverter - Convertendo formato SAP:', {
      toolName,
      sapFormat
    })

    const parsedSAP = this.parseSAPFormat(sapFormat)
    const jsonSchema = this.convertParsedSAPToJSONSchema(parsedSAP)

    logger.debug('SAPToMCPConverter - Conversão concluída:', {
      toolName,
      propertyCount: Object.keys(jsonSchema.properties || {}).length,
      requiredCount: jsonSchema.required?.length || 0,
      jsonSchema
    })

    return jsonSchema
  }

  /**
   * Analisa o formato SAP e extrai as propriedades
   */
  private static parseSAPFormat(sapFormat: string): any {
    const lines = sapFormat.split('\n').map(line => line.trim()).filter(line => line.length > 0)

    // Encontrar a linha da classe
    const classLine = lines.find(line => line.startsWith('class ') && line.endsWith('{'))
    if (!classLine) {
      throw new Error('Formato SAP inválido: classe não encontrada')
    }

    const properties: any = {}
    const required: string[] = []

    // Processar propriedades (linhas entre { e })
    let inClassBody = false
    let braceCount = 0

    for (const line of lines) {
      if (line.includes('{')) {
        inClassBody = true
        braceCount += (line.match(/{/g) || []).length
        continue
      }

      if (line.includes('}')) {
        braceCount -= (line.match(/}/g) || []).length
        if (braceCount === 0) {
          break
        }
        continue
      }

      if (inClassBody && line.includes(':')) {
        const property = this.parseSAPProperty(line)
        if (property) {
          properties[property.name] = property.schema
          if (!property.isOptional) {
            required.push(property.name)
          }
        }
      }
    }

    return {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined
    }
  }

  /**
   * Analisa uma linha de propriedade SAP
   */
  private static parseSAPProperty(line: string): { name: string; schema: any; isOptional: boolean } | null {
    // Remover comentários e extrair parte da declaração
    const commentIndex = line.indexOf('//')
    const propertyLine = commentIndex !== -1 ? line.substring(0, commentIndex).trim() : line.trim()

    // Verificar se é opcional (termina com ?)
    const isOptional = propertyLine.endsWith('?')
    const cleanLine = isOptional ? propertyLine.slice(0, -1) : propertyLine

    // Extrair nome e tipo
    const colonIndex = cleanLine.indexOf(':')
    if (colonIndex === -1) {
      logger.warn('SAPToMCPConverter - Propriedade inválida encontrada:', line)
      return null
    }

    const propName = cleanLine.substring(0, colonIndex).trim()
    const typePart = cleanLine.substring(colonIndex + 1).trim()

    if (!propName || !typePart) {
      logger.warn('SAPToMCPConverter - Propriedade com nome ou tipo vazio:', line)
      return null
    }

    // Converter tipo TypeScript para JSON Schema
    const jsonType = this.mapTypeScriptTypeToJSON(typePart)

    // Extrair comentários
    const comments = commentIndex !== -1 ? line.substring(commentIndex + 2).trim() : ''

    const schema: any = {
      type: jsonType
    }

    // Processar comentários
    if (comments) {
      this.parseCommentsIntoSchema(comments, schema)
    }

    return {
      name: propName,
      schema,
      isOptional
    }
  }

  /**
   * Mapeia tipos TypeScript para tipos JSON Schema
   */
  private static mapTypeScriptTypeToJSON(typeScriptType: string): string | string[] {
    const trimmed = typeScriptType.trim()

    // Arrays
    if (trimmed.endsWith('[]')) {
      return 'array'
    }

    // Union types (string | number | null)
    if (trimmed.includes('|')) {
      const types = trimmed.split('|').map(t => t.trim())
      const jsonTypes = types.map(t => this.mapSingleTypeScriptTypeToJSON(t))
      return jsonTypes
    }

    return this.mapSingleTypeScriptTypeToJSON(trimmed)
  }

  /**
   * Mapeia um tipo TypeScript individual para JSON Schema
   */
  private static mapSingleTypeScriptTypeToJSON(typeScriptType: string): string {
    switch (typeScriptType) {
      case 'string':
        return 'string'
      case 'number':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'any':
        return 'object'
      case 'null':
        return 'null'
      default:
        logger.warn('SAPToMCPConverter - Tipo TypeScript não reconhecido:', typeScriptType)
        return 'object'
    }
  }

  /**
   * Converte comentários SAP para propriedades do schema
   */
  private static parseCommentsIntoSchema(comments: string, schema: any): void {
    const commentParts = comments.split('//').map(part => part.trim()).filter(part => part.length > 0)

    const commentHandlers = this.getCommentHandlers()

    for (const part of commentParts) {
      const handler = this.findHandlerForComment(part, commentHandlers)

      if (!handler) {
        continue
      }

      handler(part, schema)
    }
  }

  /**
   * Retorna os handlers para cada tipo de comentário
   */
  private static getCommentHandlers(): Array<{ test: (part: string) => boolean; handle: (part: string, schema: any) => void }> {
    return [
      {
        test: (part) => part.startsWith('description:'),
        handle: this.handleDescriptionComment.bind(this)
      },
      {
        test: (part) => part.startsWith('length:'),
        handle: this.handleLengthComment.bind(this)
      },
      {
        test: (part) => part.startsWith('range:'),
        handle: this.handleRangeComment.bind(this)
      },
      {
        test: (part) => part.startsWith('enum:'),
        handle: this.handleEnumComment.bind(this)
      }
    ]
  }

  /**
   * Encontra o handler apropriado para um comentário
   */
  private static findHandlerForComment(
    part: string,
    handlers: Array<{ test: (part: string) => boolean; handle: (part: string, schema: any) => void }>
  ): ((part: string, schema: any) => void) | null {
    const handler = handlers.find(h => h.test(part))
    return handler ? handler.handle : null
  }

  /**
   * Processa comentário de descrição
   */
  private static handleDescriptionComment(part: string, schema: any): void {
    const descMatch = part.match(/description:\s*"(.*)"/)

    if (!descMatch) {
      return
    }

    schema.description = descMatch[1]
  }

  /**
   * Processa comentário de length
   */
  private static handleLengthComment(part: string, schema: any): void {
    const lengthMatch = part.match(/length:\s*(.*)/)

    if (!lengthMatch) {
      return
    }

    const lengthSpec = lengthMatch[1]
    const minMatch = lengthSpec.match(/min=(\d+)/)
    const maxMatch = lengthSpec.match(/max=(\d+)/)

    if (minMatch) {
      schema.minLength = parseInt(minMatch[1], 10)
    }

    if (maxMatch) {
      schema.maxLength = parseInt(maxMatch[1], 10)
    }
  }

  /**
   * Processa comentário de range
   */
  private static handleRangeComment(part: string, schema: any): void {
    const rangeMatch = part.match(/range:\s*(.*)/)

    if (!rangeMatch) {
      return
    }

    const rangeSpec = rangeMatch[1]
    const minMatch = rangeSpec.match(/min=([\d.-]+)/)
    const maxMatch = rangeSpec.match(/max=([\d.-]+)/)

    if (minMatch) {
      schema.minimum = parseFloat(minMatch[1])
    }

    if (maxMatch) {
      schema.maximum = parseFloat(maxMatch[1])
    }
  }

  /**
   * Processa comentário de enum
   */
  private static handleEnumComment(part: string, schema: any): void {
    const enumMatch = part.match(/enum:\s*\[(.*)\]/)

    if (!enumMatch) {
      return
    }

    const enumValues = enumMatch[1].split(',').map(v => {
      const trimmed = v.trim()

      // Tentar converter para número
      if (/^\d+$/.test(trimmed)) {
        return parseInt(trimmed, 10)
      }

      if (/^\d*\.\d+$/.test(trimmed)) {
        return parseFloat(trimmed)
      }

      // Remover aspas e retornar string
      return trimmed.replace(/^"|"$/g, '')
    })

    schema.enum = enumValues
  }

  /**
   * Converte SAP parseado para JSON Schema final
   */
  private static convertParsedSAPToJSONSchema(parsedSAP: any): any {
    const jsonSchema: any = {
      type: 'object',
      properties: {}
    }

    // Copiar propriedades
    if (parsedSAP.properties) {
      jsonSchema.properties = { ...parsedSAP.properties }
    }

    // Adicionar required se houver
    if (parsedSAP.required && parsedSAP.required.length > 0) {
      jsonSchema.required = [...parsedSAP.required]
    }

    return jsonSchema
  }
}