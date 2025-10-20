// src/agents/react/reactAgent.ts
import { PromptBuilder } from '../../promptBuilder';
import type { PromptBuilderConfig } from '../../promptBuilder';

/**
 * Registro do modo 'react' (ReAct + SAP guidance) no PromptBuilder.
 *
 * Este módulo não exporta APIs — ao ser importado, apenas registra o modo.
 */
PromptBuilder.addPromptMode('react', (config: PromptBuilderConfig) => {
  const header = [
    '## Mode: ReAct (Schema Aligned Parsing)',
    'Follow the pattern: Reason → Act → Observe → Answer',
  ].join('\n');

  const format = [
    'STRUCTURE (strict):',
    '',
    'When a tool IS needed:',
    'Thought: <brief reasoning (1-2 sentences)>',
    'Action: <toolName> = { "param": value }',
    '',
    'When you are DONE (no more tools required):',
    'Thought: <brief reasoning (1-2 sentences)>',
    'Action: final_answer = { "answer": "<your answer>" }',
  ].join('\n');

  const sapRules = [
    'IMPORTANT (SAP format):',
    "- All parameters must match the tool's class schema exactly",
    '- Include schema validation notes where relevant',
    '- Required parameters are mandatory (marked required: true)',
    '- Optional parameters use their default values if omitted',
    '- Parameter types are strictly validated (string, number, boolean)',
    '- Use strict JSON with double quotes, no comments, no trailing commas',
  ].join('\n');

  const actPolicy = [
    'POLICIES:',
    '- Output exactly one Action per turn when acting',
    "- Do not add any text before 'Action:' when acting",
    "- Do not fabricate 'Observation:' — it will be provided after tool execution",
    "- Always finish by calling the tool 'final_answer' with the field 'answer'",
    "- Do not use 'Final:'; use the 'final_answer' tool instead",
    "- If you need user input, call 'ask_user' = { \"question\": string, \"details\"?: string }",
  ].join('\n');

  const style = 'Be concise, factual, and avoid restating the question.';

  // additionalInstructions is appended by PromptBuilder (not here) to avoid duplication
  return [header, format, sapRules, actPolicy, style].filter(Boolean).join('\n\n');
});

// This module only registers the 'react' mode; no class or memory control here.
