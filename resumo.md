# Pesquisa: suporte a `<thinking>` (OpenAI e OpenAI-compatible)

## Objetivo
Definir como implementar suporte consistente a “pensamento”/“reasoning” (o que normalmente aparece como `<thinking>...</thinking>` ou `<think>...</think>` em alguns modelos) nos provedores:

- **OpenAI oficial** (API `https://api.openai.com/v1`)
- **OpenAI-compatible** (APIs que expõem endpoints estilo `/v1/chat/completions`, ex.: OpenRouter, Groq, proxies, etc.)

O foco aqui é **capturar “thinking” sem misturar com o texto final**, com opções seguras (não vazar CoT bruto para usuário final) e com suporte a **streaming**.

---

## Como o SDK está hoje (o que importa para `<thinking>`)

### Onde está a integração atual
- `src/providers/providers/openAiProvider.ts` usa `client.chat.completions.create(...)` (Chat Completions).
- `src/providers/providers/openaiCompatibleProvider.ts` também usa Chat Completions, mas tem “fallback” para `reasoning_content`.
- A resposta normalizada `IProviderResponse` (em `src/providers/adapter/providerAdapter.interface.ts`) só possui:
  - `content: string | null`
  - `metadata?: Record<string, unknown>`

### Ponto crítico atual
`OpenAICompatibleProvider` faz:
- Streaming: `fullContent += delta.content ?? delta.reasoning_content ?? ''`
- Não-streaming: `content = msg.content ?? msg.reasoning_content ?? null`

Ou seja: **se o provedor manda “reasoning” separado**, hoje o SDK **mistura no `content`** (ou usa como fallback quando `content` vem vazio). Isso é o oposto do que queremos para `<thinking>` (separação limpa).

---

## OpenAI oficial: o que existe na API para “thinking/reasoning”

### 1) Dois “mundos”: Chat Completions vs Responses
**Chat Completions**: `POST /v1/chat/completions`
- Ainda existe e funciona bem.
- Para modelos com reasoning, há:
  - **parâmetro** `reasoning_effort` (top-level) em alguns modelos.
  - **uso de tokens** com `usage.completion_tokens_details.reasoning_tokens`.
- Porém, Chat Completions **não é o melhor caminho** para obter “thinking” estruturado (principalmente “summary”).

**Responses API** (recomendado para novos projetos): `POST /v1/responses`
- Exponde “primitivas” mais ricas para agentes.
- Permite **controlar esforço de reasoning** e **opt-in de reasoning summary**.

Referências:
- API Reference (visão geral): https://platform.openai.com/docs/api-reference/introduction
- Guia “Responses vs Chat Completions”: https://platform.openai.com/docs/guides/responses-vs-chat-completions
- Guia de reasoning: https://platform.openai.com/docs/guides/reasoning

### 1.1) Mapeamento de parâmetros (ProviderConfig -> OpenAI)
Se o SDK continuar expondo a interface `ProviderConfig`, a tradução mais comum fica:

- `ProviderConfig.systemPrompt` -> `responses.create({ instructions: ... })` **ou** virar um item `input` com role `system` (depende do estilo que você quer padronizar).
- `ProviderConfig.messages[]` -> `responses.create({ input: [...] })` (array de mensagens/itens).
- `ProviderConfig.maxTokens` -> `responses.create({ max_output_tokens: ... })` (Responses) **ou** `chat.completions.create({ max_tokens: ... })` (Chat Completions).
- `ProviderConfig.stream` -> `stream: true|false` (ambos).
- `ProviderConfig.temperature`/`topP` -> parâmetros homônimos quando suportados pelo modelo/endpoint.

### 2) Controlar effort (equivalências)
No **Responses**:
```json
{
  "model": "gpt-5",
  "input": "...",
  "reasoning": { "effort": "low" }
}
```

No **Chat Completions**:
```json
{
  "model": "gpt-5.2",
  "messages": [...],
  "reasoning_effort": "none"
}
```

### 3) “Thinking” seguro: Reasoning Summary (opt-in)
A OpenAI expõe **Reasoning Summaries** (um resumo do raciocínio) via:
- request: `reasoning: { summary: "auto" | "concise" | "detailed", effort?: ... }`
- response: aparece como **um item separado** na saída, `type: "reasoning"` com `summary: [...]`.

Exemplo (forma simplificada, do guia de reasoning):
```json
[
  {
    "type": "reasoning",
    "summary": [{ "type": "summary_text", "text": "..." }]
  },
  {
    "type": "message",
    "role": "assistant",
    "content": [{ "type": "output_text", "text": "..." }]
  }
]
```

Isso é o “match” mais direto para implementar `<thinking>` **sem vazar CoT bruto**:
- `<thinking>` = `reasoning.summary[].text` (concatenado)
- resposta final = `message.content[].text` (output_text)

Exemplo TypeScript (parsing do `output`):
```ts
const response = await client.responses.create({
  model: "gpt-5",
  input: [{ role: "user", content: "..." }],
  reasoning: { effort: "low", summary: "auto" },
});

const reasoningItem = response.output.find((it: any) => it.type === "reasoning");
const thinkingSummary = (reasoningItem?.summary ?? [])
  .map((p: any) => p.text ?? "")
  .join("")
  .trim();

const finalText = response.output_text; // atalho útil do SDK
```

### 4) “Thinking” bruto: `reasoning_text` (quando existir) e eventos de streaming
Para alguns cenários/contas/modelos, a API pode incluir “reasoning content” (CoT bruto) como:
- item `type: "reasoning"` com `content: [{ type: "reasoning_text", text: "..." }]`
- no streaming: eventos `response.reasoning_text.delta` e `response.reasoning_text.done`.

Isso aparece documentado e exemplificado também no Cookbook (ex.: artigo “handle raw CoT”):
- https://cookbook.openai.com/articles/gpt-oss/handle-raw-cot

Importante (segurança/política):
- **CoT bruto não deve ser exibido ao usuário final**.
- Se for suportado, deve ir para logs/telemetria restrita ou ficar criptografado e apenas repassado ao modelo.

### 5) “Encrypted reasoning” (para repassar raciocínio sem armazenar)
Há um padrão para manter “estado de raciocínio” **sem persistência** usando:
- request: `include: ["reasoning.encrypted_content"]` (Responses API)
- a resposta volta com “encrypted reasoning content” para você **reenviar em chamadas subsequentes**.

Exemplo (Cookbook):
- https://cookbook.openai.com/examples/responses_api/reasoning_items

Isto é relevante se o objetivo do `<thinking>` for “memória de raciocínio” para múltiplos turnos (principalmente em workflows com tool-calls).

### 6) Streaming (Responses): eventos relevantes para thinking
No streaming do Responses API, os eventos mais diretamente úteis para este tema são:
- **Texto final**: `response.output_text.delta` (incremental) e `response.text_done`/`response.completed` (finalização, variando por SDK/evento).
- **Reasoning summary**: eventos do tipo `response.reasoning_summary_part.added` e correlatos de “done” (a API também expõe eventos específicos para “summary text” em algumas rotas do reference).
- **Reasoning text (raw CoT)**: `response.reasoning_text.delta` e `response.reasoning_text.done` (se o seu caso/modelo retornar `reasoning_text`).

Implicação de implementação:
- Se o SDK quiser suportar streaming com `<thinking>`, ele precisa **multiplexar** dois fluxos (texto final vs thinking) em buffers separados, ou emitir callbacks/eventos diferentes para cada um.

---

## OpenAI-compatible: o que dá para assumir (e o que NÃO dá)

### 1) Não existe padrão único de “thinking”
No ecossistema OpenAI-compatible, “thinking” costuma aparecer de 3 formas:
1) **Campos extras no JSON** (não padronizados pela OpenAI), por exemplo:
   - streaming: `choices[0].delta.reasoning_content` (ou `delta.reasoning`)
   - não-streaming: `choices[0].message.reasoning_content` (ou `message.reasoning`)
2) **“thinking” embutido no texto**: o modelo manda `"<think>... </think>"` no próprio `content`.
3) **Sem thinking**: nada vem, ou vem sempre “misturado” (não dá para separar com confiança).

O seu SDK já conhece (1) parcialmente via `reasoning_content`, mas hoje **concatena** em `content`.

### 2) Consequência prática
Para OpenAI-compatible, “suporte a `<thinking>`” precisa ser:
- **tolerante a variações**
- **baseado em heurísticas**, com “feature flag”/config para ativar/desativar
- com fallback: se não houver metadado separado, tentar extrair via tags (`<thinking>`/`<think>`) do texto

---

## Proposta de estratégia (implementação recomendada no SDK)

### A) Definir uma normalização interna: “texto final” vs “thinking”
Hoje `IProviderResponse` só tem `content`. Para suportar `<thinking>` bem, recomendo adicionar uma estrutura explícita (sem quebrar usuários atuais):

Opção 1 (menos breaking): colocar em `metadata`
- `metadata.thinking_summary?: string`
- `metadata.thinking_raw?: string`
- `metadata.thinking_encrypted?: string`

Opção 2 (mais limpa, mas pode impactar tipos): adicionar campo opcional
- `thinking?: string | null`

### B) OpenAI oficial: adicionar caminho via Responses API quando “thinking” estiver ligado
Critério sugerido:
- Se o usuário pedir `<thinking>` (ex.: `config.thinking.enabled === true`), usar `client.responses.create`.
- Caso contrário, manter `chat.completions` (compatibilidade).

No Responses:
- Request:
  - `instructions` = `systemPrompt` (quando existir)
  - `input` = conversão de `messages[]` para o formato de input do Responses
  - `reasoning.summary = "auto"` quando quiser `<thinking>` “seguro”
  - `reasoning.effort` configurável
  - opcional: `include=["reasoning.encrypted_content"]` se quiser persistir estado sem armazenar
- Response parse:
  - `output_text` vira o texto final (ou parse do item `type:"message"`/`output_text`)
  - `reasoning.summary[].text` vira o `<thinking>`
  - se existir `reasoning.content[].text` (`reasoning_text`), guardar apenas em metadados restritos

No streaming:
- Acumular `response.output_text.delta` para o texto final
- Acumular eventos de summary (ex.: `response.reasoning_summary_part.added` / `...done`) para o `<thinking>`
- Se habilitado e existir, acumular `response.reasoning_text.delta` em buffer “raw”

### C) OpenAI-compatible: separar buffers (não concatenar)
Mudança conceitual:
- Manter **dois buffers**:
  - `finalText` (do `content`)
  - `thinkingText` (de `reasoning_content` / `reasoning`)
- No final, retornar:
  - `content = finalText`
  - `metadata.thinking_* = thinkingText` (ou `thinking = thinkingText`)

Heurísticas a suportar:
- streaming delta:
  - `delta.content`
  - `delta.reasoning_content`
  - `delta.reasoning` (muitos providers usam esse nome)
- não-streaming message:
  - `message.content`
  - `message.reasoning_content`
  - `message.reasoning`

Fallback por tags (quando não houver campo separado):
- Se `content` contiver `<thinking>...</thinking>` ou `<think>...</think>`, extrair para `thinkingText` e remover do texto final.

### D) Renderização `<thinking>` (quando você realmente precisa do tag)
Uma decisão importante: **o SDK vai devolver o thinking separado, ou vai devolver texto com `<thinking>` embutido?**

Recomendação:
- **Interno/telemetria**: thinking separado (campo/metadata).
- **Compatibilidade com pipelines existentes**: oferecer um “modo” que reconstrói:
  - `content = "<thinking>... </thinking>\n\n" + finalText`

Isso evita forçar todo o resto do SDK a mudar de uma vez.

### E) Implicação no modo ReAct
O modo ReAct hoje exige `Thought:` no output (`src/agent/core/validateReAct.ts`).

Se a estratégia for migrar para `<thinking>...</thinking>`:
- O validador precisará aceitar:
  - `Thought:` **ou**
  - `<thinking>...</thinking>` (com ou sem “Thought:” dentro)

Outra alternativa (mais alinhada com OpenAI “reasoning summary”):
- Manter `Action:` / `final_answer` estruturados como hoje
- Tratar thinking como **metadado** (não como texto que o modelo precisa imprimir)

Isso reduz risco de “vazar pensamento” e melhora consistência entre provedores.

---

## Recomendações práticas (ordem de execução)

1) **Introduzir suporte a “thinking” no contrato** (metadata ou campo opcional).
2) **OpenAI (oficial)**: implementar caminho via `responses.create` com `reasoning.summary`.
3) **OpenAI-compatible**: refatorar para buffers separados e suportar `reasoning_content` + `reasoning` + extração por tags.
4) Atualizar/estender o modo ReAct para aceitar `<thinking>` (se isso for requisito do produto).
5) Adicionar testes unitários focados em parsing (streaming e não-streaming) com payloads mock.

---

## Links usados (principais)
- OpenAI API reference intro: https://platform.openai.com/docs/api-reference/introduction
- Reasoning guide: https://platform.openai.com/docs/guides/reasoning
- Streaming (Responses): https://platform.openai.com/docs/guides/streaming-responses_api-mode=responses
- Streaming events (Responses API): https://platform.openai.com/docs/api-reference/responses-streaming
- OpenAI Cookbook (raw CoT / reasoning items):
  - https://cookbook.openai.com/articles/gpt-oss/handle-raw-cot
  - https://cookbook.openai.com/examples/responses_api/reasoning_items

---

## Resultados do Crawl4AI (o que consegui extrair)

### OpenAI (sucesso: markdown extraído)
Páginas com conteúdo relevante extraído via Crawl4AI (usado como apoio, além do Context7):
- https://platform.openai.com/docs/guides/reasoning
  - Confirma “Reasoning models work better with the Responses API”.
  - Mostra exemplos com `openai.responses.create(...)` e `response.output_text`.
- https://platform.openai.com/docs/guides/streaming-responses
  - Mostra `stream: true` no Responses e exemplos de loop em eventos.
  - Lista eventos comuns (`response.created`, `response.output_text.delta`, `response.completed`, `error`) e aponta para o reference de streaming.
- https://platform.openai.com/docs/guides/responses-vs-chat-completions
  - Confirma recomendação: Responses é o “novo primitivo” e sugerido para novos projetos.
  - Detalha benefícios e caminhos de migração incremental.
- https://platform.openai.com/docs/api-reference/responses
  - Confirma formato do `response` (campo `output[]` com itens `type:"message"` e `content[]` com `type:"output_text"`).
  - Confirma `reasoning: { effort, summary }` no objeto `response` e `usage.output_tokens_details.reasoning_tokens`.

### OpenRouter (falha: conteúdo vazio)
Tentativa de scrape (Crawl4AI) em:
- https://openrouter.ai/docs/api-reference/chat-completions

Resultado:
- Conteúdo retornou vazio (provável página altamente dinâmica/JS + bloqueios), então não deu para obter um “API reference” confiável via crawl.
