# Interface: PromptBuilderConfig

Configuração completa para construir o System Prompt via PromptBuilder.

Esta interface define todos os parâmetros necessários para que o PromptBuilder
possa gerar um System Prompt estruturado e otimizado para o agente especificado.

**`Example`**

```typescript
const config: PromptBuilderConfig = {
  mode: 'react',
  agentInfo: {
    name: 'Assistente de Pesquisa',
    goal: 'Realizar pesquisas abrangentes',
    backstory: 'Especialista em metodologia de pesquisa'
  },
  additionalInstructions: 'Sempre cite fontes e valide informações.',
  toolNames: ['web_search', 'data_analyzer'],
  taskList: {
    items: [
      { id: '1', title: 'Definir escopo', status: 'completed' },
      { id: '2', title: 'Coletar dados', status: 'in_progress' }
    ]
  }
};

const prompt = PromptBuilder.buildSystemPrompt(config);
```

## Table of contents

### Properties

- [additionalInstructions](PromptBuilderConfig.md#additionalinstructions)
- [agentInfo](PromptBuilderConfig.md#agentinfo)
- [mode](PromptBuilderConfig.md#mode)
- [taskList](PromptBuilderConfig.md#tasklist)
- [toolNames](PromptBuilderConfig.md#toolnames)
- [tools](PromptBuilderConfig.md#tools)

## Properties

### additionalInstructions

• `Optional` **additionalInstructions**: `string`

Instruções adicionais específicas para o agente.
São adicionadas como seção separada no System Prompt.

**`Optional`**

**`Example`**

```
- Sempre forneça exemplos práticos
- Explique conceitos complexos de forma simples
- Use markdown para formatação de código
```

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:150](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.interface.ts#L150)

___

### agentInfo

• **agentInfo**: [`AgentInfo`](AgentInfo.md)

Informações essenciais do agente.
Define identidade, objetivo e contexto do agente.

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:136](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.interface.ts#L136)

___

### mode

• **mode**: `string`

O modo do agente a ser utilizado.
Define o tipo de comportamento e estratégia de prompting.

**`Example`**

```ts
'react', 'chat', 'code_reviewer'
```

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:130](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.interface.ts#L130)

___

### taskList

• `Optional` **taskList**: `Object`

Lista de tarefas para acompanhamento no prompt.
Útil para agentes que gerenciam workflows ou processos multi-step.

**`Optional`**

**`Example`**

```typescript
{
  items: [
    { id: '1', title: 'Analisar requisitos', status: 'completed' },
    { id: '2', title: 'Implementar solução', status: 'in_progress' },
    { id: '3', title: 'Testar implementação', status: 'pending' }
  ]
}
```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `items` | \{ `id`: `string` ; `status`: ``"pending"`` \| ``"in_progress"`` \| ``"completed"`` ; `title`: `string`  }[] | Array de itens de tarefa com status de acompanhamento |

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:195](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.interface.ts#L195)

___

### toolNames

• `Optional` **toolNames**: `string`[]

Nomes de tools registradas para conversão automática.
O PromptBuilder irá buscar e converter as tools automaticamente.

**`Optional`**

**`Remarks`**

- Requer que as tools estejam registradas no ToolRegistry
- Mutuamente exclusivo com `tools`
- Mais conveniente para uso direto com tools registradas

**`Example`**

```ts
['search', 'file_create', 'terminal']
```

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:177](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.interface.ts#L177)

___

### tools

• `Optional` **tools**: [`ToolSchema`](../README.md#toolschema)[]

Tool schemas já formatadas para uso no prompt.
Usado quando as tools já estão no formato correto.

**`Optional`**

**`Remarks`**

- Use esta opção quando já possui ToolSchema[] formatadas
- Mutuamente exclusivo com `toolNames`

**`See`**

[ToolSchema](../README.md#toolschema) Para formato das tools

#### Defined in

[src/promptBuilder/promptBuilder.interface.ts:163](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/promptBuilder/promptBuilder.interface.ts#L163)
