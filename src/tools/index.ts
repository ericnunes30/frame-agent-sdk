// src/tools/index.ts
/** Re-exporta contratos, construtores e ferramentas do subsistema de Tools. */

// Contratos base
export { ITool, IToolParams, IToolCall, IToolResult } from '@/tools/core/interfaces';
export { ToolExecutor } from './core/toolExecutor';

// Componentes da arquitetura SAP
export { ToolBase } from '@/tools/constructor/toolBase';
export { toolRegistry } from '@/tools/core/toolRegistry';
export { generateTypedSchema } from '@/tools/constructor/schemaGenerator';
export { SAPParser, ISAPError } from '@/tools/constructor/sapParser'; // Adiciona SAPParser e ISAPError
export { validateToolParams, formatIssuesForLLM } from '@/tools/core/toolValidator';
export { ToolDetector, ToolDetectionResult } from '@/tools/core/toolDetector';

// Policy (allow/deny)
export { applyToolPolicyToToolNames, applyToolPolicyToToolSchemas, isToolAllowedByPolicy } from '@/tools/policy';
export type { ToolPolicy } from '@/tools/policy';

// Ferramentas Nativas
export { AskUserParams, AskUserTool } from '@/tools/tools/askUserTool';
export { FinalAnswerParams, FinalAnswerTool } from '@/tools/tools/finalAnswerTool';
export { ApprovalParams, ApprovalTool } from '@/tools/tools/approvalTool';
export { ToDoIstParams, ToDoIstTool } from '@/tools/tools/toDoIstTool';
export { CallFlowParams } from '@/tools/tools/callFlow/callFlowParams';
export { CallFlowTool } from '@/tools/tools/callFlow/callFlowTool';

// Contratos (host-implemented)
export type { ReadImageParams, ReadImageSource, ReadImageRegion } from '@/tools/tools/readImage/readImageParams.interface';
export type { ReadImageResult, ReadImageMeta } from '@/tools/tools/readImage/readImageResult.interface';

// Ferramentas de Sistema e Arquivo
export { FileReadTool } from '@/tools/tools/fileReadTool';
export { FileEditTool } from '@/tools/tools/fileEditTool';
export { FileCreateTool } from '@/tools/tools/fileCreateTool';
export { TerminalTool } from '@/tools/tools/terminalTool';
export { SearchTool, SearchTypeEnum, MatchCaseEnum, SearchModeEnum } from '@/tools/tools/searchTool';

// Ferramentas Externas para MCP
export { MCPClient, MCPTransport } from '@/tools/tools/mcp'
export { MCPToolWrapper } from '@/tools/tools/mcp'
export { MCPBase, MCPBaseConfig, MCPSelection } from '@/tools/tools/mcp'
