# Plano: “Algoritmo de Execução” (longo prazo) no System Prompt via PromptBuilder

## Objetivo
Adicionar automaticamente no `systemPrompt` um bloco de governança (state machine) que guie agentes de longo prazo por **planejamento → execução → validação**, usando lista de tarefas via tool `toDoIst`, sem depender de repetir esse texto manualmente no `additionalInstructions` de cada agente.

## Pesquisa na base (pontos de extensão)
- `src/agent/llm/agentLLM.ts`: sempre chama `PromptBuilder.determineSystemPrompt(args)` por request.
- `src/promptBuilder/promptBuilder.ts`: `PromptBuilder.buildSystemPrompt(config)` monta o prompt em blocos (identity, instructions, taskList, tools, mode, sharedContext).
- `src/llmModes/modes/reactMode.ts`: exemplo de “bloco de instruções” de modo via `PromptBuilder.addPromptMode(...)`.
- `src/llmModes/modes/chatMode.ts`: hoje também injeta `additionalInstructions` (potencial duplicação, porque o PromptBuilder já injeta).
- `tests/unit/promptBuilder/promptBuilder.test.ts`: já existe suite para validar o `PromptBuilder`.

## Requisitos funcionais
- O bloco deve existir **apenas quando o agente tiver a tool `toDoIst` disponível**.
- As instruções devem estar alinhadas com a tool atual:
  - `create`, `get`, `update_status`, `delete_list`, `complete_all`.
- O fluxo deve orientar:
  - usar `get` para ler/descobrir `id`
  - marcar tarefas por `id` com `update_status`
  - replanejar via `create` (overwrite) — se já existir lista, `create` substitui pela nova
  - finalizar com `complete_all` + `final_answer`.

## Proposta de implementação (mínima e sustentável)
### 0) (Pré-requisito) Evoluir `toDoIst.create` para sobrescrever lista existente
Motivação: simplificar o algoritmo de longo prazo (replanejamento) e evitar o fluxo verboso `get → delete_list → create`.

Proposta:
- Alterar a ação `create` para suportar “append/overwrite” no sentido de: **se já existir lista, criar uma nova substituindo a anterior**.
- Sugestão de API (para evitar breaking change acidental):
  - adicionar `overwrite?: boolean` (ou `reset?: boolean`) em `ToDoIstParams`
  - comportamento:
    - `overwrite: true` → limpa lista atual e recria a lista com as novas `tasks`
    - `overwrite: false|undefined` → mantém o comportamento atual (recusar `create` se já existir lista)
- Se você preferir o comportamento “sempre sobrescreve” por padrão, isso vira uma mudança comportamental (breaking): basta remover o “guard” que bloqueia `create` quando já há itens.

Impacto no texto do algoritmo:
- Em vez de orientar `delete_list`, orientar `create` com overwrite (ou orientar “`create` sobrescreve por padrão”, se essa for a decisão).

### 1) Incluir o texto diretamente no `promptBuilder.ts`
- Alterar: `src/promptBuilder/promptBuilder.ts`
- Adicionar um bloco Markdown (string) no próprio arquivo (ex.: constante `TODOIST_LONG_TERM_ALGORITHM_MD`) para evitar criar novos arquivos de snippet.
- Inserir esse texto na seção `## Prompt Instructions` quando a tool `toDoIst` estiver disponível.

### 2) Injeção automática no PromptBuilder (condicionada pela tool `toDoIst`)
- Alterar: `src/promptBuilder/promptBuilder.ts` dentro de `buildSystemPrompt`.
- Detectar `toDoIst` via:
  - `finalTools?.some(t => t.name === 'toDoIst')` (fonte mais confiável)
  - fallback: `config.toolNames?.includes('toDoIst')`.
- Se presente, anexar o snippet dentro da seção `## Prompt Instructions` (junto do `additionalInstructions`), para manter uma única seção.

## Testes (unitários)
Alterar: `tests/unit/promptBuilder/promptBuilder.test.ts`
1. Com `toolNames: ['toDoIst']` → prompt contém `## Algoritmo de Execução`.
2. Sem `toDoIst` → prompt não contém o bloco.

## Critérios de aceite
- System prompt inclui o “Algoritmo de Execução” automaticamente quando `toDoIst` estiver disponível.
- Conteúdo do bloco usa apenas as ações reais da tool e orienta replanejamento via `create` (overwrite).
- `npm test` passa.
