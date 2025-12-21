export interface ToolPolicy {
  /**
   * Lista de nomes permitidos. Quando definida e não vazia, tem prioridade sobre `deny`.
   * Importante: o nome deve corresponder exatamente ao `tool.name` (ex.: `file_read`, `call_flow`).
   */
  allow?: string[];

  /** Lista de nomes proibidos (aplicada quando `allow` não está definida). */
  deny?: string[];

  /**
   * Permite `ask_user` mesmo que não esteja na allowlist (ou esteja em deny).
   * Default: false.
   */
  allowAskUser?: boolean;

  /**
   * Permite tools MCP (ex.: `mcp:context7/resolve-library-id` ou `mcp_*`).
   * Default: true.
   */
  allowMcpTools?: boolean;
}

