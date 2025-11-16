# Frame Agent SDK API Documentation

## Table of contents

### Core Modules

- [agents](modules/agents.md) - Agent modes and configurations
- [agents/chat/chatAgent](modules/agents_chat_chatAgent.md) - Chat agent implementation
- [agents/react/reactAgent](modules/agents_react_reactAgent.md) - ReAct agent implementation
- [llm](modules/llm.md) - LLM client and management
- [llm/llm](modules/llm_llm.md) - Main LLM class
- [memory](modules/memory.md) - Memory management system
- [memory/chatHistoryManager](modules/memory_chatHistoryManager.md) - Chat history management
- [memory/memory.interface](modules/memory_memory_interface.md) - Memory interfaces
- [memory/tokenizer](modules/memory_tokenizer.md) - Token estimation service
- [orchestrators](modules/orchestrators.md) - Orchestration system
- [orchestrators/steps/interfaces](modules/orchestrators_steps_interfaces.md) - Step orchestration interfaces
- [orchestrators/steps/steps](modules/orchestrators_steps_steps.md) - Step implementations
- [orchestrators/steps/stepsOrchestrator](modules/orchestrators_steps_stepsOrchestrator.md) - Main orchestrator
- [promptBuilder](modules/promptBuilder.md) - Prompt building system
- [promptBuilder/promptBuilder](modules/promptBuilder_promptBuilder.md) - Prompt builder implementation
- [promptBuilder/promptBuilder.interface](modules/promptBuilder_promptBuilder_interface.md) - Prompt builder interfaces

### Providers & LLM Integration

- [providers](modules/providers.md) - Provider system overview
- [providers/adapter](modules/providers_adapter.md) - Provider adapter system
- [providers/adapter/provider.interface](modules/providers_adapter_provider_interface.md) - Provider interfaces
- [providers/adapter/providerAdapter](modules/providers_adapter_providerAdapter.md) - Provider adapter implementation
- [providers/providers](modules/providers_providers.md) - Available providers
- [providers/providers/openAiProvider](modules/providers_providers_openAiProvider.md) - OpenAI provider
- [providers/providers/openaiCompatibleProvider](modules/providers_providers_openaiCompatibleProvider.md) - OpenAI-compatible provider
- [providers/providers/providerRegistry](modules/providers_providers_providerRegistry.md) - Provider registry
- [providers/utils](modules/providers_utils.md) - Provider utilities
- [providers/utils/stream](modules/providers_utils_stream.md) - Stream handling

### Tools System (SAP)

- [tools](modules/tools.md) - Tools system overview
- [tools/constructor/sapParser](modules/tools_constructor_sapParser.md) - Schema Aligned Parser
- [tools/constructor/schemaGenerator](modules/tools_constructor_schemaGenerator.md) - Schema generation
- [tools/constructor/toolBase](modules/tools_constructor_toolBase.md) - Base tool class
- [tools/core/interfaces](modules/tools_core_interfaces.md) - Tool interfaces
- [tools/core/toolExecutor](modules/tools_core_toolExecutor.md) - Tool execution engine
- [tools/core/toolRegistry](modules/tools_core_toolRegistry.md) - Tool registry
- [tools/core/toolValidator](modules/tools_core_toolValidator.md) - Tool validation

### Built-in Tools

- [tools/tools/askUserTool](modules/tools_tools_askUserTool.md) - Ask user tool
- [tools/tools/finalAnswerTool](modules/tools_tools_finalAnswerTool.md) - Final answer tool
- [tools/tools/searchTool](modules/tools_tools_searchTool.md) - Search tool

### Task Management System (Planned)

- [Task Tools Guide](../guides/task-tools.md) - Complete task management documentation
- [Task Planner Implementation Plan](../../TASK_PLANNER_IMPLEMENTATION_PLAN.md) - Technical specifications

## Getting Started

### Quick Setup

```typescript
import { LLM, StepsOrchestrator, ChatHistoryManager } from 'frame-agent-sdk';
import { SearchTool, AskUserTool, FinalAnswerTool } from 'frame-agent-sdk/tools';

// Initialize LLM
const llm = new LLM({
  apiKey: process.env.OPENAI_API_KEY,
  provider: 'openaiCompatible',
  baseUrl: process.env.OPENAI_BASE_URL,
  model: 'gpt-4o-mini'
});

// Initialize memory
const memory = new ChatHistoryManager({
  maxContextTokens: 8000,
  tokenizer: { estimateTokens: (text) => Math.ceil(text.length / 4) }
});

// Register tools
toolRegistry.register(new SearchTool(llm));
toolRegistry.register(new AskUserTool());
toolRegistry.register(new FinalAnswerTool());

// Create orchestrator
const orchestrator = new StepsOrchestrator({
  llm,
  memory,
  tools: toolRegistry,
  mode: 'react'
});

// Execute
const result = await orchestrator.runFlow("What's the weather like today?");
console.log(result.final);
```

### Key Components

1. **LLM Client**: Unified interface for multiple LLM providers
2. **Memory System**: Context management with intelligent truncation
3. **Orchestrator**: Step-by-step execution engine
4. **Tools System**: Schema Aligned Parsing for reliable tool execution
5. **Prompt Builder**: Flexible prompt composition with multiple modes

## Design Patterns

- **Strategy Pattern**: Different agent modes (chat, react, custom)
- **Factory Pattern**: Tool and provider creation
- **Registry Pattern**: Dynamic component discovery
- **Adapter Pattern**: Unified provider interface
- **Builder Pattern**: Flexible prompt construction

## Code Standards

This project follows strict code standards defined in [CLAUDE.md](../../CLAUDE.md):

- **Early Returns**: No nested `else/else if` statements
- **Linear Validations**: One validation per line
- **Interfaces & Enums**: Strong typing without type aliases
- **Consistent Structure**: Imports → Interfaces → Schemas → Class
- **Error Handling**: Separated from conditional logic

## Additional Documentation

- [Architecture Guide](../arquitetura/) - Detailed architecture documentation
- [Code Standards](../../CLAUDE.md) - Development guidelines
- [Task Management](../guides/task-tools.md) - Task planning system
- [Real Tests](../../tests/real/README.md) - Integration test examples
