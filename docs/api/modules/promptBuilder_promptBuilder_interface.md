# Module: promptBuilder/promptBuilder.interface

## Table of contents

### Interfaces

- [AgentInfo](../interfaces/promptBuilder_promptBuilder_interface.AgentInfo.md)
- [PromptBuilderConfig](../interfaces/promptBuilder_promptBuilder_interface.PromptBuilderConfig.md)

### Type Aliases

- [PromptMode](promptBuilder_promptBuilder_interface.md#promptmode)
- [ToolSchema](promptBuilder_promptBuilder_interface.md#toolschema)

## Type Aliases

### PromptMode

Ƭ **PromptMode**: ``"react"`` \| ``"chat"`` \| `string`

Modos de prompt suportados pelo sistema.

Define os diferentes tipos de comportamento e estratégia de prompting
que podem ser aplicados aos agentes de IA.

**`Example`**

```typescript
// Modo de conversa simples
const chatMode: PromptMode = 'chat';

// Modo de reasoning e action
const reactMode: PromptMode = 'react';

// Modo customizado
const customMode: PromptMode = 'code_reviewer';
```

**`Remarks`**

- 'chat': Conversa simples e direta
- 'react': Reasoning e action com uso de tools
- string: Modos customizados registrados via `addPromptMode()`

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:94](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/promptBuilder/promptBuilder.interface.ts#L94)

___

### ToolSchema

Ƭ **ToolSchema**: `Pick`\<[`ITool`](../interfaces/tools_core_interfaces.ITool.md), ``"name"`` \| ``"description"`` \| ``"parameterSchema"``\>

Schema de uma ferramenta para uso no System Prompt.

É um alias especializado para ITool, extraindo apenas os campos necessários
para a construção de prompts. Os schemas são convertidos para formato SAP
(Schema as Protocol) pelo PromptBuilder para otimizar a comunicação com LLMs.

**`Example`**

```typescript
const toolSchema: ToolSchema = {
  name: 'search',
  description: 'Busca informações na web',
  parameterSchema: 'class SearchParams = { query: string, limit?: number }'
};
```

**`Remarks`**

- `name`: Identificador único da ferramenta
- `description`: Explicação clara do propósito da ferramenta
- `parameterSchema`: Schema dos parâmetros em formato de classe

**`See`**

PromptBuilder.buildToolsPrompt Para conversão automática

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:69](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/promptBuilder/promptBuilder.interface.ts#L69)
