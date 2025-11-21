import { MCPClient, MCPClientConfig, MCPListedTool } from './MCPClient'
import { MCPToolWrapper } from './MCPToolWrapper'
import type { ITool } from '@/tools/core/interfaces'
import type { ToolSchema } from '../promptBuilder'

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
    return tools.map(t => ({ name: t.name, description: t.description, parameters: t.parameterSchema as any }))
  }
}