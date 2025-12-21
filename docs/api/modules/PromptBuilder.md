# Module: PromptBuilder

Módulo PromptBuilder - Construção Inteligente de Prompts para LLMs

Este módulo fornece um sistema completo para construção de prompts estruturados
para modelos de linguagem, oferecendo modos flexíveis, templates reutilizáveis
e integração automática com tools e agentes.

## Componentes Principais

- **PromptBuilder**: Classe principal para construção de prompts
- **AgentInfo**: Interface para informações do agente
- **PromptBuilderConfig**: Configuração completa para prompts
- **PromptMode**: Tipos de modo suportados
- **ToolSchema**: Schema de ferramentas para LLMs

## Uso Básico

```typescript
import { PromptBuilder, AgentInfo } from '@/promptBuilder';

// Definir agente
const agentInfo: AgentInfo = {
  name: 'Assistente IA',
  goal: 'Ajudar usuários com suas tarefas',
  backstory: 'Especialista em resolução de problemas'
};

// Construir prompt
const prompt = PromptBuilder.buildSystemPrompt({
  mode: 'chat',
  agentInfo
});

// Registrar modo customizado
PromptBuilder.addPromptMode('custom', (config) => 'Regras customizadas...');
```

## Table of contents

### References

- [AgentInfo](PromptBuilder.md#agentinfo)
- [PromptBuilder](PromptBuilder.md#promptbuilder)
- [PromptBuilderConfig](PromptBuilder.md#promptbuilderconfig)
- [PromptMode](PromptBuilder.md#promptmode)
- [ToolSchema](PromptBuilder.md#toolschema)

## References

### AgentInfo

Re-exports [AgentInfo](../interfaces/promptBuilder_promptBuilder_interface.AgentInfo.md)

___

### PromptBuilder

Re-exports [PromptBuilder](../classes/promptBuilder_promptBuilder.PromptBuilder.md)

___

### PromptBuilderConfig

Re-exports [PromptBuilderConfig](../interfaces/promptBuilder_promptBuilder_interface.PromptBuilderConfig.md)

___

### PromptMode

Re-exports [PromptMode](promptBuilder_promptBuilder_interface.md#promptmode)

___

### ToolSchema

Re-exports [ToolSchema](promptBuilder_promptBuilder_interface.md#toolschema)
