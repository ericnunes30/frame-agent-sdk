# Changelog

All notable changes to this project will be documented in this file.

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
