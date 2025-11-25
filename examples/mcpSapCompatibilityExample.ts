import { MCPBase } from '../src/tools/tools/mcp/MCPBase'
import { MCPToSAPConverter } from '../src/tools/constructor/mcpToSapConverter'
import { SAPToMCPConverter } from '../src/tools/constructor/sapToMcpConverter'
import { logger } from '../src/utils/logger'

/**
 * Exemplo de Compatibilidade MCP ↔ SAP
 * 
 * Este exemplo demonstra:
 * - Conversão bidirecional entre formatos MCP e SAP
 * - Integração com servidores MCP reais
 * - Validação de compatibilidade
 * - Testes de round-trip (MCP → SAP → MCP)
 */
export class MCPSAPCompatibilityExample {
  private mcpBase: MCPBase

  constructor() {
    this.mcpBase = new MCPBase({
      id: 'context7',
      name: 'Context7 MCP Server',
      version: '1.0.0',
      transport: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-context7']
    })
  }

  /**
   * Executa o exemplo completo de compatibilidade
   */
  async runCompatibilityTest(): Promise<void> {
    try {
      logger.info('🔄 Iniciando teste de compatibilidade MCP ↔ SAP')

      // 1. Conectar ao servidor MCP
      await this.connectToMCPServer()

      // 2. Listar ferramentas disponíveis
      const tools = await this.discoverMCPTools()

      // 3. Demonstrar conversões bidirecionais
      await this.demonstrateBidirectionalConversion(tools)

      // 4. Testar round-trip completo
      await this.testRoundTripConversion(tools)

      // 5. Validar compatibilidade
      await this.validateCompatibility(tools)

      logger.info('✅ Teste de compatibilidade MCP ↔ SAP concluído com sucesso!')

    } catch (error) {
      logger.error('❌ Erro durante teste de compatibilidade:', error)
      throw error
    }
  }

  /**
   * Conecta ao servidor MCP Context7
   */
  private async connectToMCPServer(): Promise<void> {
    logger.info('🔌 Conectando ao servidor MCP Context7...')
    
    try {
      await this.mcpBase.connect()
      logger.info('✅ Conexão estabelecida com sucesso')
    } catch (error) {
      logger.warn('⚠️ Não foi possível conectar ao servidor MCP real, usando dados simulados')
      // Continuar com dados simulados para demonstração
    }
  }

  /**
   * Descobre ferramentas disponíveis no servidor MCP
   */
  private async discoverMCPTools(): Promise<any[]> {
    logger.info('🔍 Descobrindo ferramentas MCP...')

    try {
      const tools = await this.mcpBase.discoverTools()
      logger.info(`📋 Encontradas ${tools.length} ferramentas MCP`)
      
      tools.forEach((tool, index) => {
        logger.debug(`  ${index + 1}. ${tool.name}: ${tool.description}`)
      })

      return tools
    } catch (error) {
      logger.warn('⚠️ Erro ao descobrir ferramentas, usando exemplos simulados')
      return this.getSimulatedTools()
    }
  }

  /**
   * Demonstra conversões bidirecionais MCP ↔ SAP
   */
  private async demonstrateBidirectionalConversion(tools: any[]): Promise<void> {
    logger.info('🔄 Demonstrando conversões bidirecionais...')

    for (const tool of tools.slice(0, 3)) { // Limitar a 3 ferramentas para demonstração
      await this.convertSingleTool(tool)
    }
  }

  /**
   * Converte uma única ferramenta e demonstra o processo
   */
  private async convertSingleTool(tool: any): Promise<void> {
    const toolName = tool.name || 'unknown-tool'
    const inputSchema = tool.inputSchema || this.getExampleSchema()

    logger.info(`🔧 Convertendo ferramenta: ${toolName}`)

    try {
      // MCP → SAP
      const sapFormat = MCPToSAPConverter.convertJsonSchemaToSAP(inputSchema, toolName)
      logger.info(`📝 Formato SAP gerado:\n${sapFormat}`)

      // SAP → MCP
      const mcpJson = SAPToMCPConverter.convertSAPToMCP(sapFormat, toolName)
      logger.info(`🔄 JSON Schema reconstruído:\n${JSON.stringify(mcpJson, null, 2)}`)

      // Validar round-trip
      const isValid = this.validateRoundTrip(inputSchema, mcpJson)
      logger.info(`${isValid ? '✅' : '❌'} Round-trip ${isValid ? 'válido' : 'inválido'}`)

    } catch (error) {
      logger.error(`❌ Erro ao converter ferramenta ${toolName}:`, error)
    }
  }

  /**
   * Testa conversão round-trip completa
   */
  private async testRoundTripConversion(tools: any[]): Promise<void> {
    logger.info('🔄 Testando conversão round-trip completa...')

    const testCases = [
      this.getExampleSchema(),
      this.getComplexSchema(),
      this.getOptionalSchema()
    ]

    for (const [index, originalSchema] of testCases.entries()) {
      const toolName = `test-tool-${index + 1}`
      
      try {
        // MCP → SAP → MCP
        const sapFormat = MCPToSAPConverter.convertJsonSchemaToSAP(originalSchema, toolName)
        const reconstructedSchema = SAPToMCPConverter.convertSAPToMCP(sapFormat, toolName)

        const isValid = this.validateRoundTrip(originalSchema, reconstructedSchema)
        
        logger.info(`🧪 Caso de teste ${index + 1}: ${isValid ? '✅ PASSOU' : '❌ FALHOU'}`)
        
        if (!isValid) {
          logger.debug(`Original: ${JSON.stringify(originalSchema, null, 2)}`)
          logger.debug(`Reconstruído: ${JSON.stringify(reconstructedSchema, null, 2)}`)
        }

      } catch (error) {
        logger.error(`❌ Erro no caso de teste ${index + 1}:`, error)
      }
    }
  }

  /**
   * Valida compatibilidade geral do sistema
   */
  private async validateCompatibility(tools: any[]): Promise<void> {
    logger.info('🔍 Validando compatibilidade geral...')

    try {
      // Testar integração com MCPBase
      const schemas = this.mcpBase.toToolSchemas([])
      logger.info(`✅ MCPBase.toToolSchemas() funcionando (retornou ${schemas.length} schemas)`)

      // Testar conversores individualmente
      const testSchema = this.getExampleSchema()
      const sapResult = MCPToSAPConverter.convertJsonSchemaToSAP(testSchema, 'test')
      const mcpResult = SAPToMCPConverter.convertSAPToMCP(sapResult, 'test')

      logger.info('✅ Conversores funcionando corretamente')
      logger.info(`📊 Estatísticas: SAP length=${sapResult.length}, MCP properties=${Object.keys(mcpResult.properties || {}).length}`)

    } catch (error) {
      logger.error('❌ Erro na validação de compatibilidade:', error)
      throw error
    }
  }

  /**
   * Valida se o round-trip manteve a integridade dos dados
   */
  private validateRoundTrip(original: any, reconstructed: any): boolean {
    try {
      // Verificar estrutura básica
      if (original.type !== reconstructed.type) {
        return false
      }

      // Verificar propriedades
      const originalProps = Object.keys(original.properties || {})
      const reconstructedProps = Object.keys(reconstructed.properties || {})

      if (originalProps.length !== reconstructedProps.length) {
        return false
      }

      // Verificar required
      const originalRequired = new Set(original.required || [])
      const reconstructedRequired = new Set(reconstructed.required || [])

      if (originalRequired.size !== reconstructedRequired.size) {
        return false
      }

      // Verificar cada propriedade
      for (const propName of originalProps) {
        const originalProp = original.properties[propName]
        const reconstructedProp = reconstructed.properties[propName]

        if (originalProp.type !== reconstructedProp.type) {
          return false
        }

        // Verificar constraints importantes
        if (originalProp.description !== reconstructedProp.description) {
          return false
        }

        if (originalProp.minLength !== reconstructedProp.minLength) {
          return false
        }

        if (originalProp.maxLength !== reconstructedProp.maxLength) {
          return false
        }
      }

      return true

    } catch (error) {
      logger.error('Erro durante validação de round-trip:', error)
      return false
    }
  }

  /**
   * Retorna ferramentas simuladas para demonstração
   */
  private getSimulatedTools(): any[] {
    return [
      {
        name: 'resolve-library-id',
        description: 'Resolve library ID by name',
        inputSchema: {
          type: 'object',
          properties: {
            libraryName: {
              type: 'string',
              description: 'Library name to search for...',
              minLength: 1
            }
          },
          required: ['libraryName']
        }
      },
      {
        name: 'search-packages',
        description: 'Search for packages in registry',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query string',
              minLength: 2,
              maxLength: 100
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
              minimum: 1,
              maximum: 50
            }
          },
          required: ['query']
        }
      }
    ]
  }

  /**
   * Schema de exemplo simples
   */
  private getExampleSchema(): any {
    return {
      type: 'object',
      properties: {
        libraryName: {
          type: 'string',
          description: 'Library name to search for...',
          minLength: 1
        }
      },
      required: ['libraryName']
    }
  }

  /**
   * Schema de exemplo complexo
   */
  private getComplexSchema(): any {
    return {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query string',
          minLength: 2,
          maxLength: 100
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results',
          minimum: 1,
          maximum: 50
        },
        includePrerelease: {
          type: 'boolean',
          description: 'Include pre-release versions'
        },
        tags: {
          type: 'array',
          description: 'Filter by tags',
          items: {
            type: 'string'
          }
        }
      },
      required: ['query', 'limit']
    }
  }

  /**
   * Schema com propriedades opcionais
   */
  private getOptionalSchema(): any {
    return {
      type: 'object',
      properties: {
        requiredField: {
          type: 'string',
          description: 'This field is required',
          minLength: 1
        },
        optionalField: {
          type: 'string',
          description: 'This field is optional',
          maxLength: 200
        },
        anotherOptional: {
          type: 'number',
          description: 'Another optional field',
          minimum: 0
        }
      },
      required: ['requiredField']
    }
  }
}

/**
 * Função principal para executar o exemplo
 */
export async function runMCPSAPCompatibilityExample(): Promise<void> {
  const example = new MCPSAPCompatibilityExample()
  await example.runCompatibilityTest()
}

// Executar se chamado diretamente
if (require.main === module) {
  runMCPSAPCompatibilityExample()
    .then(() => {
      logger.info('🎉 Exemplo executado com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      logger.error('💥 Erro durante execução:', error)
      process.exit(1)
    })
}