import { ToolBase } from '../tools/constructor/toolBase'
import type { IToolParams } from '../tools/core/interfaces'
import { MCPClient } from './MCPClient'

export class MCPToolWrapper extends ToolBase<IToolParams, unknown> {
  public readonly name: string
  public readonly description: string
  public readonly parameterSchema: unknown
  private readonly client: MCPClient
  private readonly mcpToolName: string

  constructor(args: { name: string; description: string; parameterSchema: unknown; client: MCPClient; mcpToolName: string }) {
    super()
    this.name = args.name
    this.description = args.description
    this.parameterSchema = args.parameterSchema
    this.client = args.client
    this.mcpToolName = args.mcpToolName
  }

  async execute(params: IToolParams): Promise<unknown> {
    const res = await this.client.callTool(this.mcpToolName, params as Record<string, unknown>)
    return res
  }
}