# Changelog

All notable changes to this project will be documented in this file.

## [0.0.11] - 2026-02-17

### Improvements
- Telemetry `TraceContext` now supports optional `sessionId` and `userId` fields to propagate session identity across orchestrator and provider layers.

## [0.0.10] - 2026-02-17

### Features
- ToDoIst: added incremental planning actions `add_task`, `remove_task` and `reorder_tasks` with new params (`title`, `insertAt`, `orderedIds`).
- ToDoIst: expanded tool description to document action/parameter contract more clearly for LLM tool usage.

### Improvements
- PromptBuilder: updated ToDoIst guidance to prefer incremental planning actions for plan maintenance.

## [0.0.9] - 2026-02-17

### Bug Fixes
- ReAct validation: translated runtime validation error messages to English in `validateReAct` to avoid mojibake/encoding artifacts in CLI feedback.
- ProviderAdapter: normalize provider aliases (`openai-compatible` and `openaicompatible`) to `openaiCompatible` for consistent provider resolution and native telemetry gating.

## [0.0.6] - 2026-01-25

### Chore
- Remove arquivos internos de planejamento (plan/resumo) do repositório.

## [0.0.5] - 2026-01-18

### Features
- Providers: adiciona suporte a `thinking` via `metadata.thinking` nos providers `openai` e `openaiCompatible` (configurável via `ProviderConfig.thinking`).

## [0.0.4] - 2026-01-02

### Bug Fixes
- TerminalTool: mantém a sessão por um TTL após encerrar para permitir `status/getOutput` (evita "Sessão de processo não encontrada" em comandos rápidos)
- TerminalTool: captura stdout/stderr também em processos foreground, permitindo `getOutput` consistente

### Improvements
- Ignore: adiciona `outputsrun-*` ao `.gitignore`

## [0.0.3] - 2025-12-31

### Breaking Changes
- Complete removal of StepOrchestrator references
- Cleaned up legacy code and deprecated interfaces

### Features
- **New Tool**: Enhanced tool capabilities with improved error handling
- **Graph Engine Improvements**: Better performance and reliability
- **Tool Registry**: Enhanced tool detection and validation

### Bug Fixes
- Fixed tool execution edge cases
- Improved error messages for debugging
- Fixed memory management issues in long-running agents

### Improvements
- Better type safety across tool implementations
- Improved documentation and code comments
- Enhanced telemetry for tool execution tracking

## [0.0.2] - 2025-12-29

### Breaking Changes
- Removed complete support for `StepOrchestrator`
- Migrated to exclusive Graph-based architecture
- Refactored core interfaces and abstractions

### Features
- **Graph Engine**: New execution engine with nodes (agentNode, subflowNode, toolExecutorNode, toolDetectionNode)
- **MCP Support**: Model Context Protocol client and tool wrapper implementations
- **Telemetry System**: Comprehensive telemetry service with ring buffer
- **Template System**: Reusable flow templates for Graph mode
- **AgentLLM Context Hooks**: Enhanced LLM integration with ReAct Action Input support
- **Multi-Agent Flow**: Ability to call sub-agents as tools
- **File System Tools**: readFile, editFile, and createFile tools
- **Skills System**: Developer assistance functionality
- **ReadImage Tool**: Image processing capabilities
- **Shared Context**: Context sharing between agents via PromptBuilder

### Bug Fixes
- Fixed ID creation bug in ToDoIst tool
- Fixed context sharing bug between agents

### Improvements
- Enhanced memory management and tokenization system
- Improved validation for ReAct mode
- Better error handling with Vision error support
- Compression extensions (90% accuracy improvement)

## [0.0.1] - Initial Release
- Initial version of Frame Agent SDK
