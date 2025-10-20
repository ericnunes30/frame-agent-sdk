// tests/real/reactAgent.real.js
// Agente ReAct real via terminal usando nosso framework.
// - Usa Step LLMCallStepWithProvider para escolher provider por step (sem depender de .env fixo)
// - Requer credenciais no .env (OPENAI_API_KEY, OPENAI_BASE_URL opcional conforme provider)

require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs', moduleResolution: 'node' } });
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Registro do modo ReAct ao importar o módulo
require('../../src/agents/react/reactAgent');

const { PromptBuilder } = require('../../src/promptBuilder');
const { ChatHistoryManager, TokenizerService } = require('../../src/memory');
const { LLMCallStepWithProvider } = require('../../src/orchestrators/steps/steps');

function loadDotEnvIfPresent() {
  try {
    const envPath = path.resolve(__dirname, '../../.env');
    if (!fs.existsSync(envPath)) return;
    const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {}
}

async function main() {
  loadDotEnvIfPresent();

  // Config do agente
  const agentName = process.env.AGENT_NAME || 'ReactAgent';
  const agentGoal = process.env.AGENT_GOAL || 'Responder perguntas e raciocinar passo a passo.';
  const agentBackstory = process.env.AGENT_BACKSTORY || '';

  // Provider escolhido por step
  const provider = process.env.OPENAI_PROVIDER || 'openaiCompatible';
  const apiKey = process.env.OPENAI_API_KEY || '';
  const baseUrl = process.env.OPENAI_BASE_URL || '';
  const baseModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    console.error('OPENAI_API_KEY é obrigatório. Configure no .env.');
    process.exit(1);
  }
  if (provider === 'openaiCompatible' && !baseUrl) {
    console.error('OPENAI_BASE_URL é obrigatório para provider openaiCompatible. Configure no .env.');
    process.exit(1);
  }

  // Memória (com tokenizador simples)
  const memory = new ChatHistoryManager({ maxContextTokens: 4096, tokenizer: new TokenizerService() });

  // System prompt do agente (registrado pelo modo react)
  const stepsConfig = {
    mode: 'react',
    agentInfo: { name: agentName, goal: agentGoal, backstory: agentBackstory },
  };
  const systemPrompt = PromptBuilder.buildSystemPrompt(stepsConfig);
  memory.addSystemPrompt(systemPrompt);

  // Step com provider informado por step
  const step = LLMCallStepWithProvider('react-step', {
    provider,
    model: baseModel,
    apiKey,
    baseUrl,
    temperature: 0.2,
    stream: false,
    topP: 1,
    maxTokens: 512,
  });

  console.log(`Agente: ${agentName}`);
  console.log(`Goal: ${agentGoal}`);
  console.log(`Provider: ${provider} | Model: ${baseModel}`);
  console.log("Digite sua mensagem. Use 'exit' para sair.\n");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  async function ask() {
    rl.question('Você: ', async (text) => {
      if (!text || text.trim().toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      // Adiciona mensagem do usuário na memória
      memory.addMessage({ role: 'user', content: text });

      // Executa step
      try {
        await step.run({
          deps: { memory, llm: {} },
          config: stepsConfig,
          state: { data: {} },
        });

        const last = memory.getTrimmedHistory().slice(-1)[0];
        console.log(`Agente: ${last?.content ?? '(sem conteúdo)'}`);
      } catch (err) {
        console.error('Erro ao executar o step:', err?.message || err);
      }

      ask();
    });
  }

  ask();
}

main().catch((e) => { console.error(e); process.exit(1); });

