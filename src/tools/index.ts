// src/tools/index.ts
/** Re-exporta contratos, construtores e ferramentas do subsistema de Tools. */

// Contratos base
export { ITool, IToolParams, IToolCall } from './core/interfaces';
export { ToolExecutor } from './core/toolExecutor';

// Componentes da arquitetura SAP
export { ToolBase } from './constructor/toolBase';
export { toolRegistry } from './core/toolRegistry';
export { generateTypedSchema } from './constructor/schemaGenerator';
export { SAPParser, ISAPError } from './constructor/sapParser'; // Adiciona SAPParser e ISAPError
export { validateToolParams, formatIssuesForLLM } from './core/toolValidator';

// Exemplo de Ferramenta
export { SearchParams, SearchTool } from './tools/searchTool';
export { AskUserParams, AskUserTool } from './tools/askUserTool';
export { FinalAnswerParams, FinalAnswerTool } from './tools/finalAnswerTool';
export { ApprovalParams, ApprovalTool } from './tools/approvalTool';
export { TodoListParams, TodoListTool } from './tools/todoListTool';
