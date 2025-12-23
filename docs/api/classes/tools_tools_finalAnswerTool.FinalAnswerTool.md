# Class: FinalAnswerTool

[tools/tools/finalAnswerTool](../modules/tools_tools_finalAnswerTool.md).FinalAnswerTool

Ferramenta para finalização de execução com resposta final.

Esta ferramenta marca o término de um ciclo de execução de agente,
encapsulando a resposta final que será entregue ao usuário. É
fundamental para workflows que requerem uma conclusão clara e
estruturada do processo.

## Funcionalidades Principais

- **Finalização de Ciclo**: Marca o término da execução do agente
- **Encapsulação de Resultado**: Estrutura a resposta final de forma clara
- **Sinalização de Conclusão**: Indica que o processo foi completado
- **Integração com Workflows**: Usada como ponto final em fluxos complexos
- **Feedback ao Usuário**: Entrega a resposta de forma estruturada

## Casos de Uso

- **Conclusão de Tarefas**: Finalizar tarefas que foram completadas
- **Entrega de Resultados**: Apresentar resultados finais ao usuário
- **Encerramento de Processos**: Terminar workflows após conclusão
- **Resposta a Consultas**: Responder perguntas do usuário
- **Finalização de Análises**: Concluir análises e apresentar conclusões

## Fluxo de Finalização

1. **Processamento**: Executar todas as etapas necessárias
2. **Consolidação**: Compilar resultados e conclusões
3. **Estruturação**: Formatar resposta final
4. **Finalização**: Chamar final_answer com resultado
5. **Entrega**: Retornar resposta ao usuário

## Importância no Sistema

Esta ferramenta é crucial para:
- **Controle de Fluxo**: Indica quando um processo deve terminar
- **Experiência do Usuário**: Fornece conclusão clara e satisfatória
- **Debugging**: Facilita identificação do fim de execuções
- **Integração**: Permite integração com sistemas externos

**`Example`**

```typescript
import { FinalAnswerTool } from '@/tools/tools/finalAnswerTool';
import { toolRegistry } from '@/tools/core/toolRegistry';

// Registrar ferramenta
toolRegistry.register(new FinalAnswerTool());

// Finalizar execução com resultado
const finalCall = {
  toolName: 'final_answer',
  params: {
    answer: 'Análise concluída! Encontrei 3 padrões principais nos seus dados...'
  }
};

const result = await ToolExecutor.execute(finalCall);
console.log(result.observation);
// {
//   type: 'final_answer',
//   answer: 'Análise concluída! Encontrei 3 padrões principais...'
// }
```

**`Example`**

```typescript
// Exemplo em um agente de análise
class DataAnalysisAgent {
  async analyze(data: any[]) {
    try {
      // 1. Processar dados
      const insights = await this.processData(data);
      
      // 2. Gerar conclusões
      const conclusions = this.generateConclusions(insights);
      
      // 3. Finalizar com resposta estruturada
      return await this.callTool('final_answer', {
        answer: `Análise completa! Principais insights: ${conclusions.summary}`
      });
    } catch (error) {
      return await this.callTool('final_answer', {
        answer: `Erro durante análise: ${error.message}`
      });
    }
  }
}
```

## Hierarchy

- [`ToolBase`](tools_constructor_toolBase.ToolBase.md)\<[`FinalAnswerParams`](tools_tools_finalAnswerTool.FinalAnswerParams.md), \{ `answer`: `string` ; `type`: ``"final_answer"``  }\>

  ↳ **`FinalAnswerTool`**

## Table of contents

### Constructors

- [constructor](tools_tools_finalAnswerTool.FinalAnswerTool.md#constructor)

### Properties

- [description](tools_tools_finalAnswerTool.FinalAnswerTool.md#description)
- [name](tools_tools_finalAnswerTool.FinalAnswerTool.md#name)
- [parameterSchema](tools_tools_finalAnswerTool.FinalAnswerTool.md#parameterschema)

### Methods

- [execute](tools_tools_finalAnswerTool.FinalAnswerTool.md#execute)

## Constructors

### constructor

• **new FinalAnswerTool**(): [`FinalAnswerTool`](tools_tools_finalAnswerTool.FinalAnswerTool.md)

#### Returns

[`FinalAnswerTool`](tools_tools_finalAnswerTool.FinalAnswerTool.md)

#### Inherited from

[ToolBase](tools_constructor_toolBase.ToolBase.md).[constructor](tools_constructor_toolBase.ToolBase.md#constructor)

## Properties

### description

• `Readonly` **description**: ``"Finaliza o ciclo de execução retornando a resposta final para o usuário."``

Descrição da funcionalidade da ferramenta

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[description](tools_constructor_toolBase.ToolBase.md#description)

#### Defined in

[src/tools/tools/finalAnswerTool.ts:116](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/finalAnswerTool.ts#L116)

___

### name

• `Readonly` **name**: ``"final_answer"``

Nome da ferramenta no sistema

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[name](tools_constructor_toolBase.ToolBase.md#name)

#### Defined in

[src/tools/tools/finalAnswerTool.ts:114](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/finalAnswerTool.ts#L114)

___

### parameterSchema

• `Readonly` **parameterSchema**: typeof [`FinalAnswerParams`](tools_tools_finalAnswerTool.FinalAnswerParams.md) = `FinalAnswerParams`

Schema de parâmetros para validação

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[parameterSchema](tools_constructor_toolBase.ToolBase.md#parameterschema)

#### Defined in

[src/tools/tools/finalAnswerTool.ts:118](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/finalAnswerTool.ts#L118)

## Methods

### execute

▸ **execute**(`params`): `Promise`\<\{ `answer`: `string` ; `type`: ``"final_answer"``  }\>

Executa finalização com resposta final.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`FinalAnswerParams`](tools_tools_finalAnswerTool.FinalAnswerParams.md) | Parâmetros contendo a resposta final. |

#### Returns

`Promise`\<\{ `answer`: `string` ; `type`: ``"final_answer"``  }\>

Resultado estruturado com tipo e resposta.

**`Example`**

```typescript
const tool = new FinalAnswerTool();

// Finalização simples
const result = await tool.execute({
  answer: 'Tarefa concluída com sucesso!'
});

console.log(result);
// {
//   type: 'final_answer',
//   answer: 'Tarefa concluída com sucesso!'
// }
```

**`Example`**

```typescript
// Finalização com resultado detalhado
const detailedResult = await tool.execute({
  answer: `Processamento completo!

Resultados:
- 1,247 registros processados
- 15 anomalias detectadas
- 3 relatórios gerados

Tempo total: 2.3 segundos`
});
```

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[execute](tools_constructor_toolBase.ToolBase.md#execute)

#### Defined in

[src/tools/tools/finalAnswerTool.ts:158](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/tools/finalAnswerTool.ts#L158)
