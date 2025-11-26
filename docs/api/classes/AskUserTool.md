# Class: AskUserTool

Ferramenta para solicitação de input do usuário.

Esta ferramenta permite que agentes de IA solicitem informações
adicionais ou esclarecimentos dos usuários durante a execução
de tarefas, criando fluxos interativos e colaborativos.

## Funcionalidades Principais

- **Solicitação Estruturada**: Permite fazer perguntas específicas ao usuário
- **Contexto Adicional**: Suporta detalhes extras para contextualizar perguntas
- **Integração com Agentes**: Usada por agentes para obter informações faltantes
- **Fluxos Interativos**: Habilita conversas dinâmicas entre agente e usuário

## Casos de Uso

- **Informações Faltantes**: Quando o agente precisa de dados não disponíveis
- **Confirmação de Ações**: Para validar decisões antes de executá-las
- **Esclarecimento de Requisitos**: Para entender melhor as necessidades do usuário
- **Validação de Resultados**: Para confirmar se o output atende às expectativas

## Exemplo de Uso

```typescript
import { AskUserTool } from '@/tools/tools/askUserTool';
import { toolRegistry } from '@/tools/core/toolRegistry';

// Registrar ferramenta
toolRegistry.register(new AskUserTool());

// Usar em um agente
const toolCall = {
  toolName: 'ask_user',
  params: {
    question: 'Qual é o seu orçamento máximo para este projeto?',
    details: 'Preciso saber para recomendar as melhores opções dentro da sua faixa de preço.'
  }
};

// Executar
const result = await ToolExecutor.execute(toolCall);
console.log(result.observation);
// { type: 'ask_user', question: '...', details: '...' }
```

**`Example`**

```typescript
// Exemplo de integração em um agente
class ShoppingAgent {
  async processRequest(request: string) {
    // Se informações importantes estão faltando...
    if (!this.hasBudgetInfo(request)) {
      return await this.callTool('ask_user', {
        question: 'Qual é o seu orçamento para esta compra?',
        details: 'Isso me ajudará a filtrar as melhores opções para você.'
      });
    }
    
    // Continuar com o processamento...
  }
}
```

## Hierarchy

- [`ToolBase`](ToolBase.md)\<[`AskUserParams`](AskUserParams.md), \{ `details?`: `string` ; `question`: `string` ; `type`: ``"ask_user"``  }\>

  ↳ **`AskUserTool`**

## Table of contents

### Constructors

- [constructor](AskUserTool.md#constructor)

### Properties

- [description](AskUserTool.md#description)
- [name](AskUserTool.md#name)
- [parameterSchema](AskUserTool.md#parameterschema)

### Methods

- [execute](AskUserTool.md#execute)

## Constructors

### constructor

• **new AskUserTool**(): [`AskUserTool`](AskUserTool.md)

#### Returns

[`AskUserTool`](AskUserTool.md)

#### Inherited from

[ToolBase](ToolBase.md).[constructor](ToolBase.md#constructor)

## Properties

### description

• `Readonly` **description**: ``"Pede esclarecimentos ao usuário quando informações adicionais são necessárias para prosseguir."``

Descrição da funcionalidade da ferramenta

#### Overrides

[ToolBase](ToolBase.md).[description](ToolBase.md#description)

#### Defined in

[src/tools/tools/askUserTool.ts:93](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/askUserTool.ts#L93)

___

### name

• `Readonly` **name**: ``"ask_user"``

Nome da ferramenta no sistema

#### Overrides

[ToolBase](ToolBase.md).[name](ToolBase.md#name)

#### Defined in

[src/tools/tools/askUserTool.ts:91](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/askUserTool.ts#L91)

___

### parameterSchema

• `Readonly` **parameterSchema**: typeof [`AskUserParams`](AskUserParams.md) = `AskUserParams`

Schema de parâmetros para validação

#### Overrides

[ToolBase](ToolBase.md).[parameterSchema](ToolBase.md#parameterschema)

#### Defined in

[src/tools/tools/askUserTool.ts:95](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/askUserTool.ts#L95)

## Methods

### execute

▸ **execute**(`params`): `Promise`\<\{ `details?`: `string` ; `question`: `string` ; `type`: ``"ask_user"``  }\>

Executa a solicitação de input do usuário.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AskUserParams`](AskUserParams.md) | Parâmetros contendo a pergunta e detalhes opcionais. |

#### Returns

`Promise`\<\{ `details?`: `string` ; `question`: `string` ; `type`: ``"ask_user"``  }\>

Resultado estruturado com tipo, pergunta e detalhes.

**`Example`**

```typescript
const tool = new AskUserTool();
const result = await tool.execute({
  question: 'Qual sua cor favorita?',
  details: 'Preciso saber para personalizar sua experiência.'
});

console.log(result);
// {
//   type: 'ask_user',
//   question: 'Qual sua cor favorita?',
//   details: 'Preciso saber para personalizar sua experiência.'
// }
```

#### Overrides

[ToolBase](ToolBase.md).[execute](ToolBase.md#execute)

#### Defined in

[src/tools/tools/askUserTool.ts:120](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/tools/askUserTool.ts#L120)
