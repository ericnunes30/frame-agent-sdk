# Class: ToolExecutor

[tools/core/toolExecutor](../modules/tools_core_toolExecutor.md).ToolExecutor

Executor centralizado de ferramentas para agentes de IA.

Esta classe é responsável por receber chamadas de ferramentas (IToolCall),
localizar a ferramenta apropriada no ToolRegistry e executá-la de forma
segura, tratando erros e normalizando resultados.

## Funcionalidades Principais

- **Descoberta Automática**: Localiza ferramentas no registry pelo nome
- **Execução Segura**: Tratamento robusto de erros com logging
- **Normalização de Resultados**: Converte resultados para formato padrão
- **Logging Detalhado**: Registra todas as operações para debugging
- **Validação de Entrada**: Verifica existência da ferramenta antes de executar

## Fluxo de Execução

1. **Descoberta**: Localiza ferramenta no ToolRegistry pelo nome
2. **Validação**: Verifica se a ferramenta existe
3. **Execução**: Chama o método execute da ferramenta
4. **Normalização**: Converte resultado para IToolResult padrão
5. **Logging**: Registra sucesso ou erro da operação

**`Example`**

```typescript
import { ToolExecutor } from '@/tools/core/toolExecutor';
import { toolRegistry } from '@/tools/core/toolRegistry';

// Registrar ferramenta
toolRegistry.register(new CalculatorTool());

// Executar ferramenta
const toolCall = {
  toolName: 'calculator',
  params: {
    operation: 'add',
    a: 10,
    b: 5
  }
};

try {
  const result = await ToolExecutor.execute(toolCall);
  console.log('Resultado:', result.observation);
  console.log('Metadados:', result.metadata);
} catch (error) {
  console.error('Erro na execução:', error.message);
}
```

**`See`**

 - [IToolCall](../interfaces/tools_core_interfaces.IToolCall.md) Para formato de chamadas de ferramenta
 - [IToolResult](../interfaces/tools_core_interfaces.IToolResult.md) Para formato de resultados
 - [toolRegistry](../modules/tools_core_toolRegistry.md#toolregistry) Para registro e descoberta de ferramentas

## Table of contents

### Constructors

- [constructor](tools_core_toolExecutor.ToolExecutor.md#constructor)

### Methods

- [execute](tools_core_toolExecutor.ToolExecutor.md#execute)

## Constructors

### constructor

• **new ToolExecutor**(): [`ToolExecutor`](tools_core_toolExecutor.ToolExecutor.md)

#### Returns

[`ToolExecutor`](tools_core_toolExecutor.ToolExecutor.md)

## Methods

### execute

▸ **execute**(`toolCall`): `Promise`\<[`IToolResult`](../interfaces/tools_core_interfaces.IToolResult.md)\<`Record`\<`string`, `unknown`\>\>\>

Executa uma chamada de ferramenta de forma segura e normalizada.

Este método é o ponto de entrada principal do sistema de execução
de ferramentas. Ele coordena todo o processo desde a descoberta
da ferramenta até a normalização do resultado.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `toolCall` | [`IToolCall`](../interfaces/tools_core_interfaces.IToolCall.md) | Estrutura contendo o nome da ferramenta e parâmetros. Deve incluir toolName válido e params compatíveis com a ferramenta. |

#### Returns

`Promise`\<[`IToolResult`](../interfaces/tools_core_interfaces.IToolResult.md)\<`Record`\<`string`, `unknown`\>\>\>

Promise que resolve para IToolResult normalizado.

**`Throws`**

Se a ferramenta não for encontrada no registry

**`Throws`**

Se houver erro durante a execução da ferramenta

**`Example`**

```typescript
// Execução básica
const result = await ToolExecutor.execute({
  toolName: 'calculator',
  params: { operation: 'multiply', a: 6, b: 7 }
});

console.log(result.observation); // "Resultado: 42"

// Com tratamento de erro
try {
  const result = await ToolExecutor.execute(toolCall);
  // Processar resultado...
} catch (error) {
  if (error.message.includes('não encontrada')) {
    // Ferramenta não registrada
  } else {
    // Erro na execução da ferramenta
  }
}
```

**`Remarks`**

- Localiza ferramenta no ToolRegistry pelo nome
- Emite logs detalhados para debugging
- Normaliza resultados para formato IToolResult padrão
- Propaga erros da ferramenta após logging

**`See`**

 - [IToolCall](../interfaces/tools_core_interfaces.IToolCall.md) Para formato da chamada
 - [IToolResult](../interfaces/tools_core_interfaces.IToolResult.md) Para formato do resultado

#### Defined in

[src/tools/core/toolExecutor.ts:136](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/core/toolExecutor.ts#L136)
