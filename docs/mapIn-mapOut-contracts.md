# MapIn / MapOut Contracts

## Objetivo
Padronizar o isolamento de mensagens e a atualizacao de `data.shared` ao executar subfluxos.

## MapIn
- Child messages iniciam vazias.
- `child.data.shared` e uma copia do shared do pai.
- `child.input` e o `data` do pai sem o campo `shared`.

## MapOut
- O shared do pai e atualizado aplicando `SharedPatch` na ordem recebida.
- Nenhuma mensagem e adicionada ao pai por padrao.

## Pause / Resume
- Quando o subfluxo pausa, o `FlowRunner` retorna `childState` (com `currentNode` e `nextNode`).
- O `SubflowNode` persiste `childState` em `metadata.subflow`.
- Em uma retomada, o `SubflowNode` passa `childState` para o `FlowRunner`, que executa `resume` a partir do ponto correto.
- O `childState.data` pode ser atualizado com novo input do pai antes de retomar.
- Subfluxos nao devem usar `ask_user`; qualquer `pendingAskUser` do filho e ignorado.

## SharedPatch
- Path usa dot notation relativa a `shared` (ex.: `plan.0.status`).
- Ops suportadas: `set`, `merge`, `append`.
- Patches sao aplicados em sequencia.

## Memoria (agentFlow)
- `agentFlow` exige memoria isolada via `llmConfig`.
- `chatHistoryManager` compartilhado nao e permitido em `agentFlow`.
- `graph` mantem memoria opcional.

## Patch em tools (generico)
- Tools podem retornar `metadata.sharedPatch` (preferencial) ou `metadata.patch`.
- O `toolExecutorNode` aplica esse patch em `data.shared` automaticamente.
