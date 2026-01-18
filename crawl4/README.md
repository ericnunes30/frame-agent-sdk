# Crawl4AI MCP - Pasta de Saida (Brutos)

Esta pasta (`crawl4/`) e o **destino dos resultados brutos** (markdown + manifest + links) gerados pelo **Crawl4AI MCP Server** quando usado via **stdio** (Docker) e com `output_dir` habilitado.

## Como funciona (resumo)

- O MCP roda em **stdio** dentro de um container efemero: `docker run --rm -i ...`.
- Para os arquivos aparecerem no Windows, voce precisa **montar um volume** do host em `/app/crawls`.
- Para **persistir** resultados, voce chama os tools com `output_dir="/app/crawls"`.
- Cada execucao cria uma pasta `run_id` dentro de `crawl4/`:
  - `scrape_YYYYMMDD_.../`
  - `crawl_YYYYMMDD_.../`
  - `site_YYYYMMDD_.../`
  - `sitemap_YYYYMMDD_.../`

## Configuracao universal (Docker stdio)

Use este padrao (mude apenas o caminho do host):

```bash
docker run --rm -i ^
  -e CRAWL4AI_MCP_LOG=INFO ^
  -e CRAWL4_AI_BASE_DIRECTORY=/app/crawls ^
  -v <CAMINHO_DO_HOST>:/app/crawls ^
  crawl4ai-mcp-server:local
```

`CRAWL4_AI_BASE_DIRECTORY=/app/crawls` faz o Crawl4AI persistir tambem o state em:

`/app/crawls/.crawl4ai` -> no host vira `<CAMINHO_DO_HOST>/.crawl4ai`

## Codex CLI (config.toml global)

No `C:/Users/Eric/.codex/config.toml`, o server esta registrado em `[mcp_servers.crawl4ai-mcp]`.

Para mudar o destino dos brutos, ajuste somente este trecho:

- `-v "<CAMINHO_DO_HOST>:/app/crawls"`
- `CRAWL4_AI_BASE_DIRECTORY=/app/crawls`

Depois **reinicie o Codex** para recarregar o `config.toml`.

## Como salvar brutos (output_dir)

- **Salvar no disco (recomendado para "brutos")**:
  - use `output_dir="/app/crawls"` (ou um subdiretorio: `"/app/crawls/meu-projeto"`).
- **Nao salvar (retornar no payload)**:
  - omita `output_dir` e o tool retorna o markdown diretamente.

Arquivos gerados por run (exemplo `scrape`):

- `manifest.json` (metadados do run)
- `links.csv` (links extraidos)
- `pages/*.md` (conteudo em Markdown)

## Observacoes

- O container nao fica "no ar" (por ser stdio + `--rm`): ele sobe apenas durante a chamada do tool e encerra.
- O exemplo `crawler_agent/agents_example.py` e opcional e **so** precisa `OPENAI_API_KEY` se voce for usar OpenAI Agents SDK.
