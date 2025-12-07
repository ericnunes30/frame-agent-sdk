# Configuração MCP para Roocode

Este documento descreve a configuração do servidor MCP (Model Context Protocol) para o Roocode.

## Visão Geral

O Roocode MCP permite conectar-se ao servidor MCP do Roocode através de um container Docker, fornecendo acesso às ferramentas disponíveis no servidor.

## Configuração

### Variáveis de Ambiente

As seguintes variáveis de ambiente podem ser configuradas:

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `ROOCODE_MCP_ID` | ID do servidor MCP | `roocode` |
| `ROOCODE_MCP_CONTAINER` | Nome do container Docker | `roocode-mcp` |
| `ROOCODE_MCP_COMMAND` | Comando para executar o MCP | `roocode-mcp` |
| `ROOCODE_MCP_NAMESPACE` | Namespace para as ferramentas | `roocode` |

### Configuração Padrão

```typescript
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
```

## Uso

### Importação

```typescript
import { roocodeMcpConfig } from '@/tools/tools/mcp/roocode-mcp-config'
import { MCPBase } from '@/tools/tools/mcp/MCPBase'

// Criar instância do MCP
const roocodeMCP = new MCPBase(roocodeMcpConfig)

// Conectar ao servidor
await roocodeMCP.connect()

// Descobrir ferramentas disponíveis
const tools = await roocodeMCP.discoverTools()

// Criar wrappers das ferramentas
const toolWrappers = await roocodeMCP.createTools()
```

### Configuração de Seleção de Ferramentas

```typescript
// Selecionar ferramentas específicas
const selection = {
  include: ['tool1', 'tool2'],
  exclude: ['tool3'],
  alias: {
    'mcp:roocode/tool1': 'roocode-tool1'
  }
}

const selectedTools = await roocodeMCP.createTools(selection)
```

## Requisitos

- Docker instalado e em execução
- Container `roocode-mcp` rodando
- Servidor MCP do Roocode configurado no container

## Troubleshooting

### Erro de Conexão

Se ocorrer erro de conexão, verifique:

1. O container Docker está rodando: `docker ps | grep roocode-mcp`
2. O comando MCP está correto no container
3. As variáveis de ambiente estão configuradas corretamente

### Permissões Docker

Certifique-se de que o usuário tem permissão para executar comandos Docker.

### Logs

Ative o modo debug para ver logs detalhados da conexão MCP:

```bash
DEBUG=true