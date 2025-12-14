// src/tools/index.ts
/** Re-exporta contratos, construtores e ferramentas do subsistema de Tools. */

// Contratos base
export { ITool, IToolParams, IToolCall, IToolResult } from '@/tools/core/interfaces';
export { ToolExecutor } from '@/tools/core/toolExecutor';

// Componentes da arquitetura SAP
export { ToolBase } from '@/tools/constructor/toolBase';
export { toolRegistry } from '@/tools/core/toolRegistry';
export { generateTypedSchema } from '@/tools/constructor/schemaGenerator';
export { SAPParser, ISAPError } from '@/tools/constructor/sapParser'; // Adiciona SAPParser e ISAPError
export { validateToolParams, formatIssuesForLLM } from '@/tools/core/toolValidator';
export { ToolDetector, ToolDetectionResult } from '@/tools/core/toolDetector';

// Ferramentas Nativas
export { AskUserParams, AskUserTool } from '@/tools/tools/askUserTool';
export { FinalAnswerParams, FinalAnswerTool } from '@/tools/tools/finalAnswerTool';
export { ApprovalParams, ApprovalTool } from '@/tools/tools/approvalTool';
export { ToDoIstParams, ToDoIstTool } from '@/tools/tools/toDoIstTool';

// Ferramentas Externas para MCP
export { MCPClient, MCPTransport } from '@/tools/tools/mcp'
export { MCPToolWrapper } from '@/tools/tools/mcp'
export { MCPBase, MCPBaseConfig, MCPSelection } from '@/tools/tools/mcp'