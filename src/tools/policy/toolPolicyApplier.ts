import type { ToolSchema } from '@/promptBuilder';
import type { ToolPolicy } from '@/tools/policy/toolPolicy.interface';

function normalizeList(list?: string[]): string[] {
  return (list ?? []).map((s) => s.trim()).filter(Boolean);
}

function isAskUserToolName(toolName: string): boolean {
  return toolName === 'ask_user' || toolName === 'askUser';
}

function isMcpToolName(toolName: string): boolean {
  return toolName.startsWith('mcp:') || toolName.startsWith('mcp_');
}

export function isToolAllowedByPolicy(toolName: string, policy?: ToolPolicy): boolean {
  if (!policy) return true;

  const allowAskUser = policy.allowAskUser ?? false;
  if (allowAskUser && isAskUserToolName(toolName)) return true;

  const allowMcpTools = policy.allowMcpTools ?? true;
  if (!allowMcpTools && isMcpToolName(toolName)) return false;

  const allow = normalizeList(policy.allow);
  if (allow.length > 0) {
    return allow.includes(toolName);
  }

  const deny = normalizeList(policy.deny);
  if (deny.length > 0) {
    return !deny.includes(toolName);
  }

  return true;
}

export function applyToolPolicyToToolNames(toolNames: string[], policy?: ToolPolicy): string[] {
  if (!policy) return toolNames;
  return toolNames.filter((name) => isToolAllowedByPolicy(name, policy));
}

export function applyToolPolicyToToolSchemas(tools: ToolSchema[] | undefined, policy?: ToolPolicy): ToolSchema[] | undefined {
  if (!tools) return tools;
  if (!policy) return tools;
  return tools.filter((tool) => isToolAllowedByPolicy(tool.name, policy));
}

