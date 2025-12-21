# Scripts descartáveis de validação (telemetria)

Estes scripts existem apenas para validar cenários reais e podem ser removidos depois.

## Como rodar

Na raiz do `frame-agent-sdk`:

```bash
npx ts-node examples/_validate/01-telemetry-subflow-graph.ts
npx ts-node examples/_validate/02-telemetry-tool-executor-metadata.ts
npx ts-node examples/_validate/03-telemetry-steps-callflow.ts
npx ts-node examples/_validate/04-telemetry-redaction.ts
```

## Requisitos

- `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL` (necessário para `03-telemetry-steps-callflow.ts`).
