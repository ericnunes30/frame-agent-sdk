# Plano: separar `<thinking>` no `OpenAICompatibleProvider` (primeira entrega)

## Objetivo
Garantir que, ao usar `provider: openaiCompatible`, o SDK:

- Retorne **`content` apenas com o texto final** (user-facing).
- Extraia “thinking” (quando existir) para **`metadata`**, sem misturar no `content`.
- Suporte os 3 cenários: campo separado, tags no texto, ausência de thinking.

---

## Contrato unificado (para o ProviderAdapter e UI)
Para deixar a adaptação do restante do SDK trivial, **todos os providers** (openai e openaiCompatible) devem devolver thinking **no mesmo lugar e com as mesmas chaves**, sem colocar thinking no `content`.

Padrão único em `IProviderResponse.metadata`:
- `metadata.thinking`: `string` (texto do pensamento; por default será um *summary* quando a API suportar)
- `metadata.thinking_type`: `"summary" | "raw"` (opcional, mas recomendado)
- `metadata.thinking_source`: `"responses_summary" | "field" | "tags" | "none"` (opcional, mas recomendado)

Regras:
- `content` = texto final (user-facing), **sempre sem thinking**.
- O SDK **não persiste** thinking em memória/histórico: como o thinking não entra em `content`, qualquer `ChatHistoryManager` que persista `messages` continuará persistindo só a resposta final.
- A UI de chat (em outro projeto) pode exibir `metadata.thinking` sem depender de persistência.

## Escopo desta entrega (só openaiCompatible)
Arquivos alvo:
- `src/providers/providers/openaiCompatibleProvider.ts`
- `tests/unit/providers/providers/openaiCompatibleProvider.test.ts` (novo)
- (opcional) `src/providers/README.md` (documentar o novo `metadata.thinking`)

Sem alterar ainda:
- `OpenAIProvider` (OpenAI oficial)
- contrato `ProviderConfig` (feature flag de thinking)
- retorno streaming real (iterador de chunks)

---

## Decisão de contrato (sem breaking change)
Como `IProviderResponse` já tem `metadata?: Record<string, unknown>`, vamos padronizar:

- `metadata.thinking`: string (thinking extraído)
- `metadata.thinking_type`: `"summary" | "raw"` (para openaiCompatible, geralmente `"raw"`/indefinido — depende do provider)
- `metadata.thinking_source`: `"field"` | `"tags"` | `"none"`

Opcional (se fizer sentido):
- `metadata.thinking_raw`: string (quando houver “raw CoT” e você quiser guardar — **não exibir**)

---

## Implementação (passo a passo)

### 1) Criar um parser utilitário (local ao provider)
Adicionar função interna em `openaiCompatibleProvider.ts`:

- `extractThinkingFromTaggedText(text: string): { finalText: string; thinking: string | null }`
  - Suportar `<think>...</think>` e `<thinking>...</thinking>`
  - Remover blocos do texto final
  - Concatenar múltiplos blocos (se houver) em `thinking`

Regras:
- Se o texto não contém tags: `thinking=null`, `finalText=text`.
- Se contém tags vazias: `thinking=""` (ou `null`, definir consistente).

### 2) Ajustar o fluxo não-streaming (message final)
Hoje:
- `content = msg.content ?? msg.reasoning_content ?? null`

Novo:
- Ler separados:
  - `finalText = msg.content ?? ""`
  - `thinkingField = msg.reasoning_content ?? msg.reasoning ?? null`
- Se `thinkingField` existir:
  - `metadata.thinking = thinkingField`
  - `metadata.thinking_source = "field"`
- Senão, tentar parse de tags em `finalText`:
  - se extrair `thinking`: `metadata.thinking_source = "tags"`
  - ajustar `content = finalText` sem as tags
- Se nenhum: `metadata.thinking_source = "none"`

### 3) Ajustar o fluxo streaming (delta a delta)
Hoje:
- acumula `fullContent += delta.content ?? delta.reasoning_content ?? ""` (mistura)

Novo:
- Manter 2 buffers:
  - `finalText += delta.content ?? ""`
  - `thinkingText += delta.reasoning_content ?? delta.reasoning ?? ""`
- Após finalizar o stream:
  - Se `thinkingText` vazio, tentar parse de tags em `finalText`
  - Retornar `content = finalText` e `metadata.thinking = thinkingText || extracted`

### 4) Não “quebrar” metadata existente
Preservar o que já existe:
- `metadata.model`, `metadata.usage`, `metadata.raw`

Somar novos campos:
- `metadata.thinking`, `metadata.thinking_source`

### 5) Testes unitários (mock do SDK OpenAI)
Criar `tests/unit/providers/providers/openaiCompatibleProvider.test.ts` semelhante ao `openAiProvider.test.ts`:

Casos mínimos:
1. **non-streaming com `message.content` + `message.reasoning_content`**
   - `result.content` == conteúdo final
   - `result.metadata.thinking` == reasoning_content
   - `result.metadata.thinking_source` == `"field"`
2. **streaming com `delta.content` e `delta.reasoning_content`**
   - buffers separados, sem mistura
3. **non-streaming com tags `<think>` no content**
   - `result.content` sem tags
   - `result.metadata.thinking` com o conteúdo do tag
   - `result.metadata.thinking_source` == `"tags"`
4. **sem thinking**
   - `result.metadata.thinking_source` == `"none"` e `thinking` ausente/null

### 6) Documentação (opcional nesta entrega)
Atualizar `src/providers/README.md` para citar:
- `openaiCompatible` agora retorna `metadata.thinking` quando disponível.

---

## Critérios de aceite
- Nunca concatenar `reasoning_content`/`reasoning` dentro de `content`.
- Quando existir thinking:
  - `metadata.thinking` vem preenchido
  - `content` fica “limpo”
- Testes passam: `npm test -- --testPathPattern=providers`

---

## Próximos passos (fora do escopo imediato)
- Introduzir `ProviderConfig.thinking` (feature flag global).
- Implementar OpenAI oficial via `Responses API` com `reasoning.summary`.
- Decidir se o SDK precisa “renderizar” tags (`wrapThinkingTags`) ou só metadata.

---

# Plano: adicionar suporte a thinking no `OpenAIProvider` (OpenAI oficial)

## Objetivo
Para `provider: openai` (API oficial), suportar “thinking” como **metadado separado** (ex.: `metadata.thinking`) usando o mecanismo nativo da OpenAI (preferencialmente **Responses API** com `reasoning.summary`), mantendo `content` apenas com o texto final.

## Problema estrutural a corrigir primeiro
Hoje existe um desalinhamento:
- `ProviderAdapter` chama `provider.chatCompletion({ ...config, model })` (passa `ProviderConfig`)
- `OpenAIProvider.chatCompletion(...)` hoje usa assinatura **posicional** (legado)

Antes de falar de thinking, o `OpenAIProvider` precisa oferecer um `chatCompletion(config: ProviderConfig): Promise<IProviderResponse>`.

## Escopo desta entrega (openaiProvider)
Arquivos alvo:
- `src/providers/providers/openAiProvider.ts`
- `tests/unit/providers/providers/openAiProvider.test.ts` (adaptar + ampliar)
- `src/providers/README.md` (opcional: documentar `metadata.thinking`)

## Decisão de contrato (mesmo padrão do openaiCompatible)
Padronizar em `IProviderResponse.metadata`:
- `metadata.thinking`: string (summary do raciocínio)
- `metadata.thinking_type`: `"summary" | "raw"` (no modo recomendado, sempre `"summary"`)
- `metadata.thinking_source`: `"responses_summary" | "none"` (opcionalmente `"responses_raw"`)

Pré-requisito recomendado:
- adicionar `ProviderConfig.thinking?: { mode: "off" | "summary" | "raw"; effort?: "none"|"low"|"medium"|"high" }`
  - Se você não quiser mexer no contrato agora, dá para usar heurística por modelo/feature flag externa, mas a implementação fica frágil.

## Implementação (passo a passo)

### 1) Tornar `OpenAIProvider` compatível com `ProviderAdapter`
Em `src/providers/providers/openAiProvider.ts`:
- manter o método legado, mas renomear para algo tipo `chatCompletionLegacy(...)` (para não quebrar consumidores diretos).
- implementar `async chatCompletion(config: ProviderConfig): Promise<IProviderResponse>` (assinatura padrão do SDK).

### 2) Escolher endpoint por modo
No `chatCompletion(config)`:
- Se `config.thinking?.mode === "summary"`: usar **Responses API** (`client.responses.create`)
- Caso contrário (default): manter **Chat Completions** (`client.chat.completions.create`)

Motivo: Responses é onde a OpenAI expõe reasoning summary de forma estruturada.

### 3) Mapear ProviderConfig -> Responses API
Regras sugeridas:
- `instructions`: usar `config.systemPrompt` (se existir)
- `input`: converter `config.messages` para o formato de input do Responses
- `reasoning`: `{ effort: config.thinking.effort ?? "medium", summary: "auto" }`
- `max_output_tokens`: usar `config.maxTokens`
- `temperature` / `top_p`: repassar quando suportado
- `stream`: se `config.stream`, usar `stream: true` e agregar o texto final (mesma estratégia já usada nos providers atuais)

### 4) Parsing da resposta (Responses)
No não-streaming:
- Texto final: `response.output_text`
- Thinking: localizar item `type: "reasoning"` e concatenar `summary[].text`
- Retornar:
  - `content = response.output_text`
  - `metadata.thinking = summaryText`
  - `metadata.thinking_source = "responses_summary"`
  - `metadata.raw = response` e `metadata.usage = response.usage` (para telemetria)

No streaming:
- Agregar `response.output_text.delta` para `finalText`
- Agregar eventos de summary (quando existirem) para `thinkingSummary`
- Ao final, retornar `IProviderResponse` com os buffers acumulados

### 5) Garantir que não há vazamento de CoT bruto
Mesmo que algum modelo/conta retorne `reasoning_text`:
- não colocar isso em `content`
- só armazenar em `metadata.thinking_raw` se você tiver um caso explícito e controlado (e documentação de risco)

### 6) Testes unitários
Atualizar `tests/unit/providers/providers/openAiProvider.test.ts` para cobrir:
1. `chatCompletion(config)` via Chat Completions (default)
2. `chatCompletion(config)` via Responses quando `thinking.mode="summary"`
3. Streaming agregando `output_text.delta` (Responses) quando `config.stream=true`
4. Confirmação de que `content` não inclui thinking e que thinking cai em `metadata`

Observação importante:
- confirmar se `openai@^4.104.0` expõe `client.responses.create`. Se não expuser, o plano inclui **bump controlado** da lib `openai` e ajuste de mocks nos testes.

## Critérios de aceite
- `ProviderAdapter` consegue usar `provider: openai` sem erro de assinatura.
- `thinking.mode="summary"` produz `metadata.thinking` preenchido e `content` limpo.
- Testes passam: `npm test -- --testPathPattern=providers`
