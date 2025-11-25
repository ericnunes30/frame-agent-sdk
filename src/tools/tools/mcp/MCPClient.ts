import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { ListToolsResultSchema, CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js'
import { logger } from '@/utils/logger'

export type MCPTransport = 'stdio'

export interface MCPClientConfig {
  id: string
  transport: MCPTransport
  command?: string
  args?: string[]
  name?: string
  version?: string
  capabilities?: Record<string, unknown>
}

export interface MCPListedTool {
  name: string
  description?: string
  inputSchema?: unknown
}

export class MCPClient {
  private client: Client | null = null
  private transport: StdioClientTransport | null = null
  private readonly config: MCPClientConfig

  constructor(config: MCPClientConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    if (this.config.transport === 'stdio') {
      if (!this.config.command) throw new Error('MCP stdio requer command')
      this.transport = new StdioClientTransport({ command: this.config.command, args: this.config.args || [] })
      this.client = new Client(
        { name: this.config.name || this.config.id, version: this.config.version || '1.0.0' },
        { capabilities: this.config.capabilities || {} }
      )
      await this.client.connect(this.transport)
      return
    }
    throw new Error('Transporte MCP não suportado')
  }

  async listTools(): Promise<MCPListedTool[]> {
    if (!this.client) throw new Error('Cliente MCP não conectado')
    const res = await this.client.request({ method: 'tools/list' }, ListToolsResultSchema)
    
    // LOG DEBUG: Capturar exatamente o que vem do servidor MCP
    const rawTools = res?.tools || []
    logger.debug('MCPClient.listTools - Dados brutos do servidor MCP:', {
      totalTools: rawTools.length,
      tools: rawTools.map((t: any) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema
      }))
    })
    
    return rawTools.map((t: any) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema }))
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!this.client) throw new Error('Cliente MCP não conectado')
    const payload = { method: 'tools/call', params: { name, arguments: args } }
    const res = await this.client.request(payload as any, CallToolResultSchema)
    return res
  }
}