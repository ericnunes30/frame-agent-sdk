# Example: ReAct Agent with Steps Orchestrator

A minimal example that runs a single-agent ReAct loop using the SDK StepsOrchestrator.

## Prerequisites

- Build the SDK: `npm run build`
- Set environment variables (provider + model):

For `openai-compatible` (requires baseUrl):

```
OPENAI_COMPATIBLE_API_KEY=...
OPENAI_COMPATIBLE_BASE_URL=https://your-compatible-endpoint/v1
OPENAI_COMPATIBLE_MODEL=gpt-4o-mini
LLM_PROVIDER=openai-compatible
```

For `openai` or `gpt` (OpenAI official):

```
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
LLM_PROVIDER=openai
```

Optional:

```
LLM_TEMPERATURE=0.5
LLM_MAX_OUTPUT_TOKENS=512
LLM_MAX_CONTEXT_TOKENS=4096
```

## Run

```
npm run example:react -- "crie um arquivo hello.txt"
```

You should see the prompt being executed in ReAct style with Thought/Action and tool outputs, finishing with `final_answer`.

