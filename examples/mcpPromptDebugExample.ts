// examples/mcpPromptDebugExample.ts
/**
 * Exemplo para debug do problema de formatação dos parâmetros das ferramentas MCP
 *
 * Este exemplo cria um agente React simples que usa MCP Context7 para validar
 * os logs adicionados e identificar onde está ocorrendo o problema de formatação.
 */

import 'dotenv/config';
import 'tsconfig-paths/register';
import '../src/agents';

// Componentes do Graph Engine
import type { IGraphState, LLMConfig } from '../src/orchestrators/graph';
import { GraphBuilder, GraphEngine, GraphStatus, createAgentNode } from '../src/orchestrators/graph';

// Tipos do PromptBuilder
import type { AgentInfo, PromptMode } from '../src/promptBuilder';
import { PromptBuilder } from '../src/promptBuilder';

// Componentes MCP
import { MCPBase } from '../src/tools/tools/mcp/MCPBase';

// Logger já está configurado com LogLevel.DEBUG por padrão

function createLlmConfigFromEnv(): LLMConfig {
  const model = process.env.LLM_MODEL || process.env.OPENAI_MODEL || 'openai-gpt-4o-mini';
  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY (or LLM_API_KEY) é obrigatório para executar o exemplo');
  }
  
  const baseUrl = process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL;
  
  return {
    model,
    apiKey,
    baseUrl,
    defaults: {
      temperature: 0.7,
      topP: 0.9,
    }
  };
}

function buildMCPDebugGraph(
  llmConfig: LLMConfig,
  mode: PromptMode,
  agentInfo: AgentInfo,
  tools: any[],
  maxSteps?: number
): GraphEngine {
  // Validar parâmetros
  if (!llmConfig) throw new Error('llmConfig é obrigatório');
  if (!mode) throw new Error('mode é obrigatório');
  if (!agentInfo) throw new Error('agentInfo é obrigatório');

  const endNodeName = '__end__';
  const builder = new GraphBuilder({ maxSteps, endNodeName });

  // Criar nó do agente com ferramentas MCP
  const agentNode = createAgentNode({
    llm: llmConfig,
    mode: mode,
    agentInfo: agentInfo,
    tools: tools,
  });

  // Construir grafo simples: agent -> end
  builder.addNode('agent', agentNode);
  builder.addEdge('agent', endNodeName);
  builder.setEntryPoint('agent');
  builder.setEndNode(endNodeName);

  const definition = builder.build();
  
  // Criar GraphEngine com LLMConfig para habilitar ChatHistoryManager
  const engine = new GraphEngine(
    definition, 
    { maxSteps: builder.getMaxSteps() },
    llmConfig
  );

  return engine;
}

function createInitialState(userInput?: string): IGraphState {
  const trimmed = String(userInput ?? '').trim();
  const messages = trimmed ? [{ role: 'user' as const, content: trimmed }] : [];
  
  return {
    messages,
    data: {},
    status: GraphStatus.RUNNING,
  };
}

async function main(): Promise<void> {
  console.log('🔍 MCP Prompt Debug Example - Testando formatação de parâmetros\n');

  try {
    // Configuração do LLM usando variáveis de ambiente
    const llmConfig = createLlmConfigFromEnv();
    console.log('✅ Configuração LLM criada:', { model: llmConfig.model });

    // Informações do agente
    const agentInfo: AgentInfo = {
      name: 'MCPDebugAgent',
      goal: 'Testar formatação de parâmetros das ferramentas MCP',
      backstory: 'Agente de debug para validar problema de formatação nos parâmetros MCP'
    };
    
    const mode = 'react' as PromptMode;
    
    // Configurar conexão com MCP Context7
    console.log('\n=== Conectando ao MCP Context7 ===');
    
    const mcpConfig = {
      id: 'context7',
      transport: 'stdio' as const,
      command: 'docker',
      args: ['exec', '-i', 'context7-mcp', 'context7-mcp'],
      name: 'Context7 MCP Server',
      version: '1.0.0',
      namespace: 'context7'
    };
    
    const mcpBase = new MCPBase(mcpConfig);
    await mcpBase.connect();
    
    console.log('✅ Conectado ao MCP Context7');
    
    // Descobrir ferramentas MCP
    const listedTools = await mcpBase.discoverTools();
    console.log(`📋 Ferramentas MCP descobertas: ${listedTools.length}`);
    
    // Criar ferramentas wrapadas
    const wrappedTools = await mcpBase.createTools();
    console.log(`🔧 Ferramentas MCP wrapadas: ${wrappedTools.length}`);
    
    // Converter para ToolSchema para o Graph Engine
    const toolSchemas = mcpBase.toToolSchemas(wrappedTools);
    console.log(`📝 ToolSchemas gerados: ${toolSchemas.length}`);
    
    // Mostrar detalhes das ferramentas para análise
    console.log('\n=== Análise das Ferramentas MCP ===');
    toolSchemas.forEach((tool, index) => {
      console.log(`\n${index + 1}. Ferramenta: ${tool.name}`);
      console.log(`   Descrição: ${tool.description}`);
      console.log(`   Tipo dos parâmetros: ${typeof tool.parameters}`);
      console.log(`   Parâmetros (raw):`, tool.parameters);
      console.log(`   Parâmetros (JSON.stringify):`, JSON.stringify(tool.parameters, null, 2));
    });
    
    // Construir Graph Engine com ferramentas MCP
    const engine = buildMCPDebugGraph(llmConfig, mode, agentInfo, toolSchemas, 3);
    console.log('\n✅ Graph Engine construído com ferramentas MCP');

    // Testar construção do prompt (isso vai acionar os logs de debug)
    console.log('\n=== Testando construção do prompt ===');
    PromptBuilder.buildSystemPrompt({ 
      mode, 
      agentInfo, 
      tools: toolSchemas,
      additionalInstructions: 'Use as ferramentas MCP para buscar documentação de bibliotecas.'
    });

    // Criar estado inicial para teste
    const question = process.env.DEMO_USER_INPUT || 'Busque a documentação da biblioteca React';
    const initialState = createInitialState(question);
    
    console.log('\n=== Executando Graph Engine ===');
    console.log('Pergunta:', question);
    
    // Executar Graph Engine
    const result = await engine.execute(initialState);
    
    console.log('\n=== Resultado da Execução ===');
    console.log('Graph status:', result.status);
    console.log('Mensagens finais:', result.state.messages.length);
    
    if (result.state.messages.length > 0) {
      console.log('\n📋 Última mensagem:');
      const lastMessage = result.state.messages[result.state.messages.length - 1];
      console.log(`[${lastMessage.role.toUpperCase()}]: ${lastMessage.content}`);
    }
    
  } catch (error: unknown) {
    console.error('❌ Erro ao executar exemplo:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
}