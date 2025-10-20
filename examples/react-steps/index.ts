// examples/react-steps/index.ts
// Minimal ReAct agent using StepsOrchestrator from the SDK

// Register react mode
import '../../src/agents/react/reactAgent';

import { PromptBuilder } from '../../src/promptBuilder';
import { ChatHistoryManager, TokenizerService } from '../../src/memory';
import { StepsOrchestrator } from '../../src/orchestrators/steps/stepsOrchestrator';
import { LLM } from '../../src/llm';
import { toolRegistry, generateTypedSchema } from '../../src/tools';
import { AskUserTool } from '../../src/tools/tools/askUserTool';
import { FinalAnswerTool } from '../../src/tools/tools/finalAnswerTool';
import { SearchTool } from '../../src/tools/tools/searchTool';

function normalizeProviderName(name?: string): 'openaiCompatible' | 'openai' | 'gpt' {
  const raw = (name || '').trim().toLowerCase();
  if (raw === 'openai-compatible' || raw === 'openai_compatible' || raw === 'openaicompatible') return 'openaiCompatible';
  if (raw === 'gpt') return 'gpt';
  if (raw === 'openai') return 'openai';
  return 'openaiCompatible';
}

function resolveProviderConfig() {
  const provider = normalizeProviderName(process.env.LLM_PROVIDER || process.env.OPENAI_PROVIDER || 'openai-compatible');
  const apiKey = provider === 'openaiCompatible'
    ? (process.env.OPENAI_COMPATIBLE_API_KEY || process.env.OPENAI_API_KEY || '')
    : (process.env.OPENAI_API_KEY || '');
  const baseUrl = provider === 'openaiCompatible'
    ? (process.env.OPENAI_COMPATIBLE_BASE_URL || process.env.OPENAI_BASE_URL || '')
    : undefined;
  const modelOnly = provider === 'openaiCompatible'
    ? (process.env.OPENAI_COMPATIBLE_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini')
    : (process.env.OPENAI_MODEL || 'gpt-4o-mini');
  const temperature = parseFloat(process.env.LLM_TEMPERATURE || '0.5') || 0.5;
  const maxOutputTokens = process.env.LLM_MAX_OUTPUT_TOKENS ? parseInt(process.env.LLM_MAX_OUTPUT_TOKENS, 10) : undefined;
  const maxContextTokens = process.env.LLM_MAX_CONTEXT_TOKENS ? parseInt(process.env.LLM_MAX_CONTEXT_TOKENS, 10) : 4096;
  return { provider, apiKey, baseUrl, modelOnly, temperature, maxOutputTokens, maxContextTokens } as const;
}

function buildToolSchemas() {
  const tools = toolRegistry.listTools();
  return tools.map((t) => ({ name: t.name, description: t.description, parameters: generateTypedSchema(t as any) }));
}

async function main() {
  // Register a minimal set of tools
  try { toolRegistry.register(new AskUserTool()); } catch {}
  try { toolRegistry.register(new FinalAnswerTool()); } catch {}
  try { toolRegistry.register(new SearchTool()); } catch {}

  const { provider, apiKey, baseUrl, modelOnly, temperature, maxOutputTokens, maxContextTokens } = resolveProviderConfig();
  if (!apiKey) throw new Error('Missing API key. Configure OPENAI_COMPATIBLE_API_KEY or OPENAI_API_KEY.');
  if (provider === 'openaiCompatible' && !baseUrl) throw new Error("Missing OPENAI_COMPATIBLE_BASE_URL for 'openai-compatible'.");

  const model = `${provider}-${modelOnly}`;
  const llm = new LLM({ model, apiKey, baseUrl, defaults: { temperature, maxTokens: maxOutputTokens } });

  const memory = new ChatHistoryManager({ maxContextTokens, tokenizer: new TokenizerService() });

  const stepsConfig = {
    mode: 'react',
    agentInfo: {
      name: process.env.AGENT_NAME || 'React Example Agent',
      goal: process.env.AGENT_GOAL || 'Execute tasks via ReAct and tools.',
      backstory: process.env.AGENT_BACKSTORY || 'Demonstration agent using StepsOrchestrator.',
    },
    tools: buildToolSchemas(),
  } as any;

  const sys = PromptBuilder.buildSystemPrompt(stepsConfig);
  memory.addSystemPrompt(sys);

  const orchestrator = new StepsOrchestrator({ memory, llm: llm as any }, stepsConfig);

  const userInput = process.argv.slice(2).join(' ') || 'Diga olá e finalize.';
  const { final, state, pendingAskUser } = await orchestrator.runFlow(userInput);

  const steps = ((state?.data as any)?.steps as Array<{ thought?: string; actionName?: string; observation?: string }>) || [];
  for (const s of steps) {
    console.log('LLM');
    const t = (s.thought || '').toString().trim();
    if (t) console.log(t);
    if (s.actionName) console.log(`→ ação/${s.actionName}`);
    if (s.observation) console.log(String(s.observation));
    console.log('');
  }

  if (pendingAskUser?.question) {
    console.log('[ask_user] Pergunta do agente:');
    console.log(pendingAskUser.question);
    if (pendingAskUser.details) console.log(pendingAskUser.details);
  }

  if (final) {
    console.log('Final:');
    console.log(final);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

