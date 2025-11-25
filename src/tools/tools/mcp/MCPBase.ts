import { MCPClient, MCPClientConfig, MCPListedTool } from './MCPClient'
import { MCPToolWrapper } from './MCPToolWrapper'
import { MCPToSAPConverter } from '@/tools/constructor/mcpToSapConverter'
import type { ITool } from '@/tools/core/interfaces'
import type { ToolSchema } from '@/promptBuilder'
import { logger } from '@/utils/logger'

export interface MCPBaseConfig extends MCPClientConfig {
  namespace?: string
}

export interface MCPSelection {
  include?: string[]
  exclude?: string[]
  alias?: Record<string, string>
}

export class MCPBase {
  private readonly config: MCPBaseConfig
  private readonly client: MCPClient

  constructor(config: MCPBaseConfig) {
    this.config = config
    this.client = new MCPClient(config)
  }

  async connect(): Promise<void> {
    await this.client.connect()
  }

  private canonicalName(toolName: string): string {
    const ns = this.config.namespace || this.config.id
    return `mcp:${ns}/${toolName}`
  }

  async discoverTools(): Promise<MCPListedTool[]> {
    const tools = await this.client.listTools()
    return tools
  }

  async createTools(selection?: MCPSelection): Promise<ITool[]> {
    const listed = await this.discoverTools()
    const include = selection?.include
    const exclude = new Set<string>(selection?.exclude || [])
    const alias = selection?.alias || {}
    const filtered = include && include.length > 0 ? listed.filter(t => include.includes(t.name)) : listed
    const out: ITool[] = filtered
      .filter(t => !exclude.has(t.name))
      .map(t => {
        const finalName = this.canonicalName(t.name)
        const exposedName = alias[finalName] || finalName
        return new MCPToolWrapper({
          name: exposedName,
          description: t.description || '',
          parameterSchema: t.inputSchema || {},
          client: this.client,
          mcpToolName: t.name,
        })
      })
    return out
  }

  toToolSchemas(tools: ITool[]): ToolSchema[] {
    const schemas = tools.map(t => ({
      name: t.name,
      description: t.description,
      parameterSchema: MCPToSAPConverter.convertJsonSchemaToSAP(t.parameterSchema, t.name)
    }))

    logger.debug('MCPBase.toToolSchemas - Conversão MCP → SAP concluída:', {
      totalTools: schemas.length,
      schemas: schemas.map(schema => ({
        name: schema.name,
        description: schema.description,
        parametersType: typeof schema.parameterSchema,
        parametersPreview: typeof schema.parameterSchema === 'string'
          ? schema.parameterSchema.substring(0, 100) + (schema.parameterSchema.length > 100 ? '...' : '')
          : JSON.stringify(schema.parameterSchema)
      }))
    })

    return schemas
  }
}