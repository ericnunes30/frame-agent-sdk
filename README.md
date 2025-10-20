# Frame Agent

Framework leve para construir agentes (Chat / ReAct) com orquestraÃ§Ã£o por etapas, memÃ³ria e provedores plugÃ¡veis.

## Visão Geral

- PromptBuilder com modos (ex.: `react`) registrados via `PromptBuilder.addPromptMode`.
- OrquestraÃ§Ã£o por etapas (Steps) com escolha de provider por step (`LLMCallStepWithProvider`).
- MemÃ³ria de chat com truncamento por â€œtokensâ€ (aproximaÃ§Ã£o) e system prompt persistente.
- Adaptador de provedores (`ProviderAdapter`) + registro (`ProviderRegistry`).
- Provider compatível com OpenAI (`openaiCompatible`) com `baseUrl` obrigatório.

### Imports (subpaths)

- `frame-agent-sdk/agents` registra modos para o PromptBuilder.
- `frame-agent-sdk/llm` expõe o cliente `LLM` (suporte a `baseUrl`).
- `frame-agent-sdk/memory` expõe `ChatHistoryManager` e tipos relacionados.
- `frame-agent-sdk/orchestrators/steps` expõe `StepsOrchestrator`, interfaces e steps utilitários.
- `frame-agent-sdk/promptBuilder` expõe `PromptBuilder` e tipos.
- `frame-agent-sdk/providers` expõe adaptador e providers.
- `frame-agent-sdk/tools` expõe contratos SAP, registro e utilitários.

## InstalaÃ§Ã£o

```bash
npm ci
```

## Build

```bash
npm run build
```
Gera a saÃ­da compilada em `dist/` (ignorados no git por padrão).

## Variáveis de Ambiente

Crie um `.env` baseado em `.env.example`:

- `OPENAI_API_KEY`: chave do provedor (OpenAI ou compatível)
- `OPENAI_BASE_URL`: obrigatório para `openaiCompatible` (endpoint compatível)
- `OPENAI_MODEL`: modelo (ex.: `gpt-4o-mini`)
- (opcional) `AGENT_NAME`, `AGENT_GOAL`, `AGENT_BACKSTORY`, `OPENAI_PROVIDER` (padrão `openaiCompatible`)

### Tokens: Contexto vs Saída

- Contexto (histórico): o `ChatHistoryManager` aplica truncamento com base em `maxContextTokens` (limite da janela do modelo). O `StepsOrchestrator` usa `memory.getTrimmedHistory()` em cada chamada.
- Saída (gerada): o `LLM` aceita `maxTokens` via `defaults` (no construtor) ou por chamada (`invoke`). Os providers mapeiam para a opção específica (ex.: `max_tokens` na OpenAI).

## Testes

- Unit: `npm test` (configuraÃ§Ãµes em `tests/jest.config.js`)
- ExecuÃ§Ã£o real (terminal):
  - Provider isolado: `node tests/real/openaiCompatible.real.js`
  - Agente ReAct (terminal): `node tests/real/reactAgent.real.js`

## Exemplo RÃ¡pido (Agente ReAct no terminal)

```bash
node tests/real/reactAgent.real.js
```
Requisitos: `.env` preenchido com `OPENAI_API_KEY` e, se `OPENAI_PROVIDER=openaiCompatible`, tambÃ©m `OPENAI_BASE_URL`.

## Providers

- `openai` (OpenAI oficial) â€“ registrado por padrão.
- `gpt` (alias para OpenAI) â€“ registrado por padrão.
- `openaiCompatible` â€“ requer `baseUrl` e aceita `ProviderConfig` direto no mÃ©todo `chatCompletion`.

## OrquestraÃ§Ã£o por Steps

Use `LLMCallStepWithProvider(id, { provider, model, apiKey, baseUrl, ... })` para escolher o provedor por step, sem amarrar ao `.env`.

## Estrutura Principal

- `src/promptBuilder/` â€“ modos e composiÃ§Ã£o do System Prompt
- `src/orchestrators/steps/` â€“ Steps, interfaces e orquestraÃ§Ã£o
- `src/memory/` â€“ memÃ³ria de chat e tokenizaÃ§Ã£o (aproximaÃ§Ã£o)
- `src/providers/` â€“ adaptadores e provedores
- `src/tools/` â€“ SAP (Schema Aligned Parsing), registro e validaÃ§Ã£o de ferramentas

## Boas PrÃ¡ticas

- Registre modos via `PromptBuilder.addPromptMode` em mÃ³dulos dedicados (ex.: `src/agents/react/reactAgent.ts`).
- Evite acoplamento de modos dentro do `PromptBuilder`.
- Use guards (early returns) e evite `else/else if` para simplificar fluxo.
- Escolha de provider por step usando `StepProviderOptions` (evita lÃ³gica rÃ­gida em `.env`).

## Contribuindo

1. Fork e branch (ex.: `feat/...` ou `fix/...`).
2. `npm ci` e `npm test`.
3. `npm run build` para compilar.
4. Abra PR com descriÃ§Ã£o objetiva do que foi alterado.

## LicenÃ§a

Defina a licenÃ§a do projeto aqui (ex.: MIT).
# frame-agent-sdk
