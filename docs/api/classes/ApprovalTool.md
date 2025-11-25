# Class: ApprovalTool

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

- [`ToolBase`](ToolBase.md)\<[`ApprovalParams`](ApprovalParams.md), \{ `approved`: `boolean` ; `feedback`: `string` ; `suggestions?`: `string`[] ; `type`: ``"approval"``  }\>

  ↳ **`ApprovalTool`**

## Table of contents

### Constructors

- [constructor](ApprovalTool.md#constructor)

### Properties

- [description](ApprovalTool.md#description)
- [name](ApprovalTool.md#name)
- [parameterSchema](ApprovalTool.md#parameterschema)

### Methods

- [execute](ApprovalTool.md#execute)

## Constructors

### constructor

• **new ApprovalTool**(): [`ApprovalTool`](ApprovalTool.md)

#### Returns

[`ApprovalTool`](ApprovalTool.md)

#### Inherited from

[ToolBase](ToolBase.md).[constructor](ToolBase.md#constructor)

## Properties

### description

• `Readonly` **description**: ``"Aprova ou rejeita soluções com feedback detalhado e sugestões de melhoria."``

Descrição da funcionalidade da ferramenta

#### Overrides

[ToolBase](ToolBase.md).[description](ToolBase.md#description)

#### Defined in

[src/tools/tools/approvalTool.ts:109](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/approvalTool.ts#L109)

___

### name

• `Readonly` **name**: ``"approval"``

Nome da ferramenta no sistema

#### Overrides

[ToolBase](ToolBase.md).[name](ToolBase.md#name)

#### Defined in

[src/tools/tools/approvalTool.ts:107](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/approvalTool.ts#L107)

___

### parameterSchema

• `Readonly` **parameterSchema**: typeof [`ApprovalParams`](ApprovalParams.md) = `ApprovalParams`

Schema de parâmetros para validação

#### Overrides

[ToolBase](ToolBase.md).[parameterSchema](ToolBase.md#parameterschema)

#### Defined in

[src/tools/tools/approvalTool.ts:111](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/approvalTool.ts#L111)

## Methods

### execute

▸ **execute**(`params`): `Promise`\<\{ `approved`: `boolean` ; `feedback`: `string` ; `suggestions?`: `string`[] ; `type`: ``"approval"``  }\>

Executa processo de aprovação/rejeição.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`ApprovalParams`](ApprovalParams.md) | Parâmetros contendo decisão, feedback e sugestões. |

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

[ToolBase](ToolBase.md).[execute](ToolBase.md#execute)

#### Defined in

[src/tools/tools/approvalTool.ts:140](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/approvalTool.ts#L140)
