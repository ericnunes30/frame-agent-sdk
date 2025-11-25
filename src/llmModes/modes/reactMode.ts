// src/agents/modesAgents/reactAgentMode.ts
import { PromptBuilder } from '@/promptBuilder';
import type { PromptBuilderConfig, PromptMode } from '@/promptBuilder';

/**
 * Registration of 'react' mode (ReAct + SAP guidance) in PromptBuilder.
 *
 * This module does not export APIs — importing it only registers the mode.
 */
PromptBuilder.addPromptMode('react' as PromptMode, (config: PromptBuilderConfig) => {
  const header = [
    '---',
    '',
    '## Mode: ReAct (Schema Aligned Parsing)',
    '',
    'Follow the pattern: Reason → Act → Observe → Answer',
  ].join('\n');

  const format = [
    'STRUCTURE (strict):',
    '',
    'When a tool IS required:',
    'Thought: <brief reasoning (1-2 sentences)>',
    'Action: <toolName> = { "parameter": value }',
    '',
    'When you are DONE (no more tools needed):',
    'Thought: <brief reasoning (1-2 sentences)>',
    'Action: final_answer = { "answer": "<your answer>" }',
  ].join('\n');

  const sapRules = [
    'IMPORTANT (SAP format):',
    "- All parameters must match the tool class schema exactly",
    '- Include schema validation notes when relevant',
    '- Required parameters are mandatory (marked as required: true)',
    '- Optional parameters use their default values if omitted',
    '- Parameter types are strictly validated (string, number, boolean)',
    '- Use strict JSON with double quotes, no comments, no trailing commas',
  ].join('\n');

  const actPolicy = [
    'POLICIES:',
    '- Return exactly one Action per turn when acting',
    "- Do not add any text before 'Action:' when acting",
    "- Do not invent 'Observation:' — it will be provided after tool execution",
    "- Always finish by calling the 'final_answer' tool with the 'answer' field",
    "- Do not use 'Final:'; use the 'final_answer' tool instead",
    "- If you need user information, call 'ask_user' = { \"question\": string, \"details\"?: string }",
  ].join('\n');

  const style = 'Be concise, factual, and avoid repeating the question.';

  // additionalInstructions is appended by PromptBuilder (not here) to avoid duplication
  return [header, format, sapRules, actPolicy, style].filter(Boolean).join('\n\n');
});

// This module only registers the 'react' mode; no class or memory control here.