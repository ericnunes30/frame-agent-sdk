import { SAPParser } from '../src/tools/constructor/sapParser';
import { MCPBase } from '../src/tools/tools/mcp/MCPBase';
import { toolRegistry } from '../src/tools/core/toolRegistry';
import { logger } from '../src/utils/logger';

// Exemplo simples para validar SAP Parser com MCP
export class SapParserMCPExample {
  
  async demonstrateSapParserWithMCP(): Promise<void> {
    logger.info('Iniciando demonstração SAP Parser com MCP');
    
    // Exemplo 1: Parser de saída LLM para chamada de ferramenta
    await this.demonstrateBasicParsing();
    
    // Exemplo 2: Integração com ferramentas registradas
    await this.demonstrateToolRegistryIntegration();
    
    // Exemplo 3: Validação de erros e hints
    await this.demonstrateErrorHandling();
  }
  
  private async demonstrateBasicParsing(): Promise<void> {
    logger.info('=== Exemplo 1: Parsing Básico ===');
    
    // Exemplo de saída LLM bem formatada
    const validLLMOutput = `
      Action: search_tool = {
        "query": "typescript mcp integration",
        "max_results": 5
      }
    `;
    
    const result = SAPParser.parseAndValidate(validLLMOutput);
    
    if ('toolName' in result) {
      logger.info('✅ Parsing bem-sucedido:', {
        toolName: result.toolName,
        params: result.params
      });
    } else {
      logger.error('❌ Erro no parsing:', result.message);
    }
  }
  
  private async demonstrateToolRegistryIntegration(): Promise<void> {
    logger.info('=== Exemplo 2: Integração com Registry ===');
    
    // Verificar ferramentas disponíveis
    const availableTools = toolRegistry.listTools();
    logger.info('Ferramentas disponíveis:', availableTools);
    
    // Testar parsing com ferramenta que existe
    const toolOutput = `
      Action: final_answer = {
        "answer": "Esta é uma resposta final do assistente"
      }
    `;
    
    const result = SAPParser.parseAndValidate(toolOutput);
    
    if ('toolName' in result) {
      logger.info('✅ Ferramenta válida encontrada:', result.toolName);
    } else {
      logger.error('❌ Ferramenta não encontrada:', result.message);
    }
  }
  
  private async demonstrateErrorHandling(): Promise<void> {
    logger.info('=== Exemplo 3: Tratamento de Erros ===');
    
    // Exemplo 1: JSON inválido
    const invalidJson = `
      Action: search_tool = {
        "query": "test",
        "max_results": 5
      `; // JSON incompleto
    
    const result1 = SAPParser.parseAndValidate(invalidJson);
    
    if ('toolName' in result1) {
      logger.info('✅ Parsing corrigido com sucesso');
    } else {
      logger.warn('⚠️ Erro detectado:', {
        message: result1.message,
        hint: result1.llmHint,
        suppressRepetition: result1.suppressRepetition
      });
    }
    
    // Exemplo 2: Ferramenta inexistente
    const nonExistentTool = `
      Action: ferramenta_inexistente = {
        "parametro": "valor"
      }
    `;
    
    const result2 = SAPParser.parseAndValidate(nonExistentTool);
    
    if ('toolName' in result2) {
      logger.info('✅ Parsing bem-sucedido');
    } else {
      logger.warn('⚠️ Ferramenta não registrada:', result2.message);
    }
    
    // Exemplo 3: Formato inválido
    const invalidFormat = 'Esta é apenas uma mensagem sem formato de ação';
    
    const result3 = SAPParser.parseAndValidate(invalidFormat);
    
    if ('toolName' in result3) {
      logger.info('✅ Parsing bem-sucedido');
    } else {
      logger.warn('⚠️ Formato inválido:', {
        message: result3.message,
        hint: result3.llmHint
      });
    }
  }
  
  // Método para testar integração com MCP real
  async testMCPIntegration(): Promise<void> {
    logger.info('=== Teste de Integração MCP ===');
    
    try {
      // Configuração para conectar ao MCP Context7 em execução no Docker
      const mcpConfig = {
        id: 'context7',
        transport: 'stdio' as const,
        // Usando o container Docker existente
        command: 'docker',
        args: ['exec', '-i', 'context7-mcp', 'context7-mcp'],
        name: 'Context7 MCP Server',
        version: '1.0.0',
        capabilities: {
          'docker-container': 'context7-mcp'
        }
      };
      
      const mcpBase = new MCPBase(mcpConfig);
      await mcpBase.connect();
      
      logger.info('✅ Conectado ao MCP Context7');
      
      // Listar ferramentas disponíveis
      const tools = await mcpBase.discoverTools();
      logger.info('Ferramentas MCP disponíveis:', tools);
      
      // Criar ferramentas wrapadas
      const wrappedTools = await mcpBase.createTools();
      logger.info(`✅ ${wrappedTools.length} ferramentas MCP wrapadas criadas`);
      
    } catch (error) {
      logger.error('❌ Erro na integração MCP:', error);
    }
  }
  
  // Método para testar execução de ferramentas MCP
  async demonstrateMCPToolExecution(): Promise<void> {
    logger.info('=== Teste de Execução de Ferramentas MCP ===');
    
    try {
      // Configurar conexão com MCP
      const mcpConfig = {
        id: 'context7',
        transport: 'stdio' as const,
        command: 'docker',
        args: ['exec', '-i', 'context7-mcp', 'context7-mcp'],
        name: 'Context7 MCP Server',
        version: '1.0.0',
        capabilities: {
          'docker-container': 'context7-mcp'
        }
      };
      
      const mcpBase = new MCPBase(mcpConfig);
      await mcpBase.connect();
      // Obter ferramentas disponíveis
      const tools = await mcpBase.discoverTools();
      logger.info('Ferramentas MCP disponíveis para teste:', tools.map(t => t.name));
      // Log detalhado do schema da ferramenta
      const resolveToolSchema = tools.find(t => t.name === 'resolve-library-id');
      if (resolveToolSchema) {
        logger.info('Schema da ferramenta resolve-library-id:', JSON.stringify(resolveToolSchema, null, 2));
      }
     
      
      // Testar a ferramenta resolve-library-id
      if (tools.some(t => t.name === 'resolve-library-id')) {
        logger.info('Executando ferramenta resolve-library-id para "Typescript"');
        
        // Simular a saída do LLM no formato que o SAPParser espera
        const toolCall = {
          toolName: 'resolve-library-id',
          params: {
            libraryName: 'Typescript'
          }
        };
        
        // Executar a ferramenta via MCP
        const mcpTools = await mcpBase.createTools();
        const resolveTool = mcpTools.find(t => t.name === 'mcp:context7/resolve-library-id');
        
        if (!resolveTool) {
          throw new Error('Ferramenta resolve-library-id não encontrada após wrap');
        }
        
        logger.info('Executando chamada da ferramenta MCP...');
        const result = await resolveTool.execute(toolCall.params);
        
        logger.info('✅ Resultado da execução da ferramenta MCP:', {
          toolName: 'resolve-library-id',
          result
        });
      } else {
        logger.warn('⚠️ Ferramenta resolve-library-id não disponível para teste');
      }
      
    } catch (error) {
      logger.error('❌ Erro na execução de ferramentas MCP:', error);
    }
  }
}

// Função principal para executar o exemplo
async function main(): Promise<void> {
  const example = new SapParserMCPExample();
  
  try {
    await example.demonstrateSapParserWithMCP();
    await example.testMCPIntegration();
    await example.demonstrateMCPToolExecution();
  } catch (error) {
    logger.error('Erro na execução do exemplo:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}