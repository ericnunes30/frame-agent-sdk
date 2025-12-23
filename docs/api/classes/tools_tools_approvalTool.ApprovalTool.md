# Class: ApprovalTool

[tools/tools/approvalTool](../modules/tools_tools_approvalTool.md).ApprovalTool

Ferramenta para aprovação/rejeição de soluções com feedback estruturado.

Esta ferramenta é fundamental para workflows que requerem validação
humana ou de agentes críticos, permitindo registrar decisões de
aprovação/rejeição com feedback detalhado e sugestões de melhoria.

## Funcionalidades Principais

- **Decisão Binária**: Aprova ou rejeita soluções de forma clara
- **Feedback Detalhado**: Permite explicar os motivos da decisão
- **Sugestões de Melhoria**: Oferece direcionamento para correções
- **Estruturação de Resultado**: Retorna dados formatados para processamento
- **Integração com Workflows**: Usada em fluxos de validação e iteração

## Casos de Uso

- **Code Review**: Aprovação de código por revisores
- **Validação de Soluções**: Verificação de respostas de agentes
- **Controle de Qualidade**: Aprovação de outputs antes de entrega
- **Workflows Iterativos**: Controle de iterações em processos complexos
- **Aprovação Humana**: Validação de decisões automatizadas

## Fluxo de Aprovação

1. **Análise**: Avaliar a solução apresentada
2. **Decisão**: Determinar se aprova ou rejeita
3. **Feedback**: Documentar motivos da decisão
4. **Sugestões**: Propor melhorias quando aplicável
5. **Registro**: Estruturar resultado para próximo passo

**`Example`**

```typescript
import { ApprovalTool } from '@/tools/tools/approvalTool';
import { toolRegistry } from '@/tools/core/toolRegistry';

// Registrar ferramenta
toolRegistry.register(new ApprovalTool());

// Aprovar solução
const approvalCall = {
  toolName: 'approval',
  params: {
    approved: true,
    feedback: 'Solução está correta e bem implementada. Código limpo e eficiente.',
    suggestions: ['Adicionar mais testes de edge cases', 'Documentar funções públicas']
  }
};

const result = await ToolExecutor.execute(approvalCall);
console.log(result.observation);
// {
//   type: 'approval',
//   approved: true,
//   feedback: 'Solução está correta...',
//   suggestions: ['Adicionar mais testes...', 'Documentar funções...']
// }
```

**`Example`**

```typescript
// Rejeitar solução com feedback construtivo
const rejectionCall = {
  toolName: 'approval',
  params: {
    approved: false,
    feedback: 'A implementação não atende aos requisitos. Faltam validações de entrada.',
    suggestions: [
      'Adicionar validação de parâmetros',
      'Tratar casos de erro',
      'Melhorar tratamento de edge cases'
    ]
  }
};
```

## Hierarchy

- [`ToolBase`](tools_constructor_toolBase.ToolBase.md)\<[`ApprovalParams`](tools_tools_approvalTool.ApprovalParams.md), \{ `approved`: `boolean` ; `feedback`: `string` ; `suggestions?`: `string`[] ; `type`: ``"approval"``  }\>

  ↳ **`ApprovalTool`**

## Table of contents

### Constructors

- [constructor](tools_tools_approvalTool.ApprovalTool.md#constructor)

### Properties

- [description](tools_tools_approvalTool.ApprovalTool.md#description)
- [name](tools_tools_approvalTool.ApprovalTool.md#name)
- [parameterSchema](tools_tools_approvalTool.ApprovalTool.md#parameterschema)

### Methods

- [execute](tools_tools_approvalTool.ApprovalTool.md#execute)

## Constructors

### constructor

• **new ApprovalTool**(): [`ApprovalTool`](tools_tools_approvalTool.ApprovalTool.md)

#### Returns

[`ApprovalTool`](tools_tools_approvalTool.ApprovalTool.md)

#### Inherited from

[ToolBase](tools_constructor_toolBase.ToolBase.md).[constructor](tools_constructor_toolBase.ToolBase.md#constructor)

## Properties

### description

• `Readonly` **description**: ``"Aprova ou rejeita soluções com feedback detalhado e sugestões de melhoria."``

Descrição da funcionalidade da ferramenta

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[description](tools_constructor_toolBase.ToolBase.md#description)

#### Defined in

[src/tools/tools/approvalTool.ts:109](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/approvalTool.ts#L109)

___

### name

• `Readonly` **name**: ``"approval"``

Nome da ferramenta no sistema

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[name](tools_constructor_toolBase.ToolBase.md#name)

#### Defined in

[src/tools/tools/approvalTool.ts:107](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/approvalTool.ts#L107)

___

### parameterSchema

• `Readonly` **parameterSchema**: typeof [`ApprovalParams`](tools_tools_approvalTool.ApprovalParams.md) = `ApprovalParams`

Schema de parâmetros para validação

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[parameterSchema](tools_constructor_toolBase.ToolBase.md#parameterschema)

#### Defined in

[src/tools/tools/approvalTool.ts:111](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/approvalTool.ts#L111)

## Methods

### execute

▸ **execute**(`params`): `Promise`\<\{ `approved`: `boolean` ; `feedback`: `string` ; `suggestions?`: `string`[] ; `type`: ``"approval"``  }\>

Executa processo de aprovação/rejeição.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`ApprovalParams`](tools_tools_approvalTool.ApprovalParams.md) | Parâmetros contendo decisão, feedback e sugestões. |

#### Returns

`Promise`\<\{ `approved`: `boolean` ; `feedback`: `string` ; `suggestions?`: `string`[] ; `type`: ``"approval"``  }\>

Resultado estruturado com tipo, decisão e dados completos.

**`Example`**

```typescript
const tool = new ApprovalTool();

// Aprovação com sugestões
const result = await tool.execute({
  approved: true,
  feedback: 'Excelente implementação!',
  suggestions: ['Considerar adicionar cache', 'Otimizar queries do banco']
});

console.log(result);
// {
//   type: 'approval',
//   approved: true,
//   feedback: 'Excelente implementação!',
//   suggestions: ['Considerar adicionar cache', 'Otimizar queries do banco']
// }
```

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[execute](tools_constructor_toolBase.ToolBase.md#execute)

#### Defined in

[src/tools/tools/approvalTool.ts:140](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/approvalTool.ts#L140)
