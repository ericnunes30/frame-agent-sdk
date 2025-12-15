// src/agents/modesAgents/reactAgentMode.ts
import { PromptBuilder } from '@/promptBuilder';
import type { PromptBuilderConfig, PromptMode } from '@/promptBuilder';

/**
 * Registration of 'react' mode (ReAct + SAP guidance) in PromptBuilder.
 *
 * This module does not export APIs — importing it only registers the mode.
 */
PromptBuilder.addPromptMode('react' as PromptMode, (config: PromptBuilderConfig) => {
  return `## Mode: ReAct (Strict Technical Execution)

**MANDATE:** You are a tool-using engine. You DO NOT speak with raw text. You ONLY execute actions.

### Execution Format
For every turn, you MUST follow this exact sequence:

1. **Thought:** Explain your reasoning briefly (1-2 sentences).
2. **Action:** Call exactly ONE tool using the syntax below.

### Syntax Rules (Non-Negotiable)
* **Pattern:** \`Action: tool_name = { "param": value }\`
* **JSON:** Parameters must be valid, strict JSON (double quotes, no trailing commas).
* **Types:** Respect the schema types (boolean is \`true\`, not \`"true"\`).

### Constraints
1. **Silence:** Do not add text before 'Action' or after the JSON.
2. **No Hallucinations:** Do not invent 'Observation:'. Wait for the system.
3. **Completion:** Use \`final_answer\` to send results to the user.
4. **Interaction:** Use \`ask_user\` if blocked.

**Example of Valid Turn:**
Thought: I need to check the file content to verify the implementation.
Action: file_read = { "filePath": "src/main.ts" }`;
});

// This module only registers the 'react' mode; no class or memory control here.