// tests/real/openaiCompatible.real.js
// Runner real em JS (CommonJS) para evitar complicações de ESM em ts-node.
require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs', moduleResolution: 'node' } });
const fs = require('fs');
const path = require('path');
const { ProviderAdapter } = require('../../src/providers/adapter/providerAdapter');

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

  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  const baseUrl = (process.env.OPENAI_BASE_URL || '').trim();
  const baseModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  if (!apiKey || !baseUrl) {
    console.error('OPENAI_API_KEY e OPENAI_BASE_URL são obrigatórios para o teste real.');
    process.exit(1);
  }

  const config = {
    model: `openaiCompatible-${baseModel}`,
    apiKey,
    baseUrl,
    messages: [
      { role: 'system', content: 'Você é um assistente que responde de forma curta.' },
      { role: 'user', content: 'Responda apenas com a palavra: ok' },
    ],
    systemPrompt: 'Responda com apenas uma palavra, sem explicações.',
    temperature: 0.2,
    stream: false,
    maxTokens: 20,
    topP: 1,
  };

  const result = await ProviderAdapter.chatCompletion(config);
  console.log('Resposta:', result);
  try {
    console.log('Resposta bruta (JSON):', JSON.stringify(result, null, 2));
  } catch {}
}

main().catch(err => { console.error(err); process.exit(1); });
