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
    'CRITICAL: You must ALWAYS use a tool. Do NOT output raw text.',
    'Follow the pattern: Reason → Act → Observe → Answer',
  ].join('\n');

  const format = [
    'STRUCTURE (strict):',
    '',
    '1. To use a tool:',
    'Thought: <reasoning about why tool is needed>',
    'Action: <toolName> = { "param": value }',
    '',
    '2. To answer the user (including chat/greetings):',
    'Thought: <reasoning about the answer>',
    'Action: final_answer = { "answer": "<your response>" }',
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
    '- YOU MUST ALWAYS USE A TOOL. Do not output raw text.',
    '- For general chat, greetings, or final results, use the "final_answer" tool.',
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