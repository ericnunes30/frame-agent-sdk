import { MCPToSAPConverter } from '../src/tools/constructor/mcpToSapConverter'
import { logger } from '../src/utils/logger'

/**
 * Exemplo da Simplificação do MCPToSAPConverter
 * 
 * Demonstra como a nova implementação simplificada envolve
 * todo o JSON Schema do MCP dentro de uma classe SAP
 */
export class SimplifiedMcpToSapExample {
  
  /**
   * Executa o exemplo de conversão simplificada
   */
  static runExample(): void {
    logger.info('🚀 Exemplo: MCPToSAPConverter Simplificado')
    logger.info('='.repeat(60))

    // Schema JSON típico de uma ferramenta MCP
    const exampleSchema = {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'URL para navegar',
          minLength: 1
        },
        waitFor: {
          type: 'string',
          description: 'Seletor para aguardar elemento',
          optional: true
        },
        timeout: {
          type: 'number',
          description: 'Timeout em segundos',
          minimum: 1,
          maximum: 60
        }
      },
      required: ['url'],
      additionalProperties: false
    }

    const toolName = 'navigateToUrl'

    logger.info('📋 JSON Schema Original (MCP):')
    logger.info(JSON.stringify(exampleSchema, null, 2))
    logger.info('')

    // Converter usando a nova implementação simplificada
    const sapFormat = MCPToSAPConverter.convertJsonSchemaToSAP(exampleSchema, toolName)

    logger.info('✨ Formato SAP Simplificado:')
    logger.info(sapFormat)
    logger.info('')

    logger.info('💡 Vantagens da Simplificação:')
    logger.info('✅ Preserva toda a estrutura original do MCP')
    logger.info('✅ Não perde informações de validação')
    logger.info('✅ Formato mais limpo e legível')
    logger.info('✅ Facilita debugging e manutenção')
    logger.info('='.repeat(60))
  }
}

// Executar exemplo
SimplifiedMcpToSapExample.runExample()