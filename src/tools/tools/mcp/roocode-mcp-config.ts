import { MCPBaseConfig } from './MCPBase'

/**
 * Configuração MCP para o Roocode
 * 
 * Esta configuração define a conexão com o servidor MCP do Roocode
 * através de um container Docker.
 */
export const roocodeMcpConfig: MCPBaseConfig = {
  id: process.env.ROOCODE_MCP_ID || 'roocode',
  transport: 'stdio',
  command: 'docker',
  args: ['exec', '-i', `${process.env.ROOCODE_MCP_CONTAINER || 'roocode-mcp'}`, process.env.ROOCODE_MCP_COMMAND || 'roocode-mcp'],
  namespace: process.env.ROOCODE_MCP_NAMESPACE || 'roocode',
  name: 'Roocode MCP Server',
  version: '1.0.0',
  capabilities: {
    'docker-container': process.env.ROOCODE_MCP_CONTAINER || 'roocode-mcp'
  }
}