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

[src/promptBuilder/promptBuilder.interface.ts:93](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/promptBuilder/promptBuilder.interface.ts#L93)

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

[src/promptBuilder/promptBuilder.interface.ts:68](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/promptBuilder/promptBuilder.interface.ts#L68)
