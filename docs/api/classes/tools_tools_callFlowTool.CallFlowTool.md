# Class: CallFlowTool

[tools/tools/callFlowTool](../modules/tools_tools_callFlowTool.md).CallFlowTool

Classe base abstrata para implementação de ferramentas no sistema.

Esta classe implementa o contrato ITool e define a estrutura fundamental
para o Schema Aligned Parsing (SAP), fornecendo uma base padronizada
para todas as ferramentas do sistema de agentes de IA.

## Características Principais

- **Abstração Completa**: Define interface mínima para ferramentas
- **Schema Aligned Parsing (SAP)**: Integração com sistema de validação de schemas
- **Tipagem Forte**: Suporte a generics para parâmetros e retorno
- **Contrato Padronizado**: Nome, descrição e schema obrigatórios
- **Execução Assíncrona**: Todos os métodos de execução são async

## Arquitetura SAP (Schema Aligned Parsing)

O SAP é o coração do sistema de ferramentas, permitindo que:
- LLMs chamem ferramentas com parâmetros estruturados
- Parâmetros sejam validados automaticamente contra schemas
- Resultados sejam normalizados e tipados
- Erros sejam tratados de forma consistente

## Template Parameters

- **TParams**: Classe TypeScript que define os parâmetros de entrada
- **TReturn**: Tipo do valor retornado pelo método execute

**`Example`**

```typescript
// Implementação básica de ferramenta
class CalculatorTool extends ToolBase<CalculatorParams, number> {
  public readonly name = 'calculator';
  public readonly description = 'Realiza operações matemáticas básicas';
  public readonly parameterSchema = CalculatorParams;

  public async execute(params: CalculatorParams): Promise<number> {
    switch (params.operation) {
      case 'add': return params.a + params.b;
      case 'subtract': return params.a - params.b;
      default: throw new Error('Operação não suportada');
    }
  }
}

// Uso da ferramenta
const tool = new CalculatorTool();
const result = await tool.execute({
  operation: 'add',
  a: 10,
  b: 5
});
console.log(result); // 15
```

**`Example`**

```typescript
// Ferramenta com retorno estruturado
class SearchTool extends ToolBase<SearchParams, SearchResult> {
  public readonly name = 'search';
  public readonly description = 'Busca informações em bases de dados';
  public readonly parameterSchema = SearchParams;

  public async execute(params: SearchParams): Promise<SearchResult> {
    const results = await this.performSearch(params.query);
    return {
      query: params.query,
      results: results,
      timestamp: new Date().toISOString()
    };
  }
}
```

**`See`**

 - [ITool](../interfaces/tools_core_interfaces.ITool.md) Para interface completa da ferramenta
 - [IToolParams](../interfaces/tools_core_interfaces.IToolParams.md) Para estrutura de parâmetros
 - toolRegistry Para registro e descoberta de ferramentas

## Hierarchy

- [`ToolBase`](tools_constructor_toolBase.ToolBase.md)\<[`CallFlowParams`](tools_tools_callFlowParams.CallFlowParams.md), [`IToolResult`](../interfaces/tools_core_interfaces.IToolResult.md)\<`unknown`\>\>

  ↳ **`CallFlowTool`**

## Table of contents

### Constructors

- [constructor](tools_tools_callFlowTool.CallFlowTool.md#constructor)

### Properties

- [description](tools_tools_callFlowTool.CallFlowTool.md#description)
- [name](tools_tools_callFlowTool.CallFlowTool.md#name)
- [parameterSchema](tools_tools_callFlowTool.CallFlowTool.md#parameterschema)
- [runner](tools_tools_callFlowTool.CallFlowTool.md#runner)

### Methods

- [execute](tools_tools_callFlowTool.CallFlowTool.md#execute)

## Constructors

### constructor

• **new CallFlowTool**(`runner`): [`CallFlowTool`](tools_tools_callFlowTool.CallFlowTool.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `runner` | [`FlowRunner`](../interfaces/flows_interfaces_flowRunner_interface.FlowRunner.md) |

#### Returns

[`CallFlowTool`](tools_tools_callFlowTool.CallFlowTool.md)

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[constructor](tools_constructor_toolBase.ToolBase.md#constructor)

#### Defined in

[src/tools/tools/callFlowTool.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/callFlowTool.ts#L14)

## Properties

### description

• `Readonly` **description**: ``"Invokes a registered subflow."``

Descrição detalhada da funcionalidade da ferramenta.

Esta descrição é fornecida ao LLM para ajudá-lo a entender quando
e como usar a ferramenta. Deve ser clara, específica e incluir
informações sobre parâmetros e casos de uso.

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[description](tools_constructor_toolBase.ToolBase.md#description)

#### Defined in

[src/tools/tools/callFlowTool.ts:9](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/callFlowTool.ts#L9)

___

### name

• `Readonly` **name**: ``"call_flow"``

Nome único da ferramenta no sistema.

Este nome é usado pelo LLM para identificar e chamar a ferramenta.
Deve ser único em todo o sistema e seguir convenções de nomenclatura
claras (snake_case recomendado).

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[name](tools_constructor_toolBase.ToolBase.md#name)

#### Defined in

[src/tools/tools/callFlowTool.ts:8](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/callFlowTool.ts#L8)

___

### parameterSchema

• `Readonly` **parameterSchema**: typeof [`CallFlowParams`](tools_tools_callFlowParams.CallFlowParams.md) = `CallFlowParams`

Referência à classe TypeScript que define os parâmetros esperados.

Este é o coração do sistema SAP (Schema Aligned Parsing). A classe
referenciada deve ter uma propriedade estática `schemaProperties` que
define o schema de validação dos parâmetros.

O schema é usado para:
- Validar parâmetros fornecidos pelo LLM
- Gerar documentação automática
- Fornecer feedback de erro estruturado
- Tipar parâmetros no método execute

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[parameterSchema](tools_constructor_toolBase.ToolBase.md#parameterschema)

#### Defined in

[src/tools/tools/callFlowTool.ts:10](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/callFlowTool.ts#L10)

___

### runner

• `Private` `Readonly` **runner**: [`FlowRunner`](../interfaces/flows_interfaces_flowRunner_interface.FlowRunner.md)

#### Defined in

[src/tools/tools/callFlowTool.ts:12](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/callFlowTool.ts#L12)

## Methods

### execute

▸ **execute**(`params`): `Promise`\<[`IToolResult`](../interfaces/tools_core_interfaces.IToolResult.md)\<`unknown`\>\>

Método de execução da lógica de negócio da ferramenta.

Este método contém toda a lógica específica da ferramenta e é
chamado pelo ToolExecutor após validação bem-sucedida dos parâmetros.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`CallFlowParams`](tools_tools_callFlowParams.CallFlowParams.md) | Parâmetros de entrada, já validados e tipados pelo SAP. Os parâmetros já passaram pela validação de schema e estão no tipo TParams. |

#### Returns

`Promise`\<[`IToolResult`](../interfaces/tools_core_interfaces.IToolResult.md)\<`unknown`\>\>

Promise com o resultado da execução.
O tipo de retorno é definido pelo template TReturn.

**`Example`**

```typescript
class DataProcessorTool extends ToolBase<ProcessorParams, ProcessingResult> {
  public readonly name = 'process_data';
  public readonly description = 'Processa dados de entrada';
  public readonly parameterSchema = ProcessorParams;

  public async execute(params: ProcessorParams): Promise<ProcessingResult> {
    // Lógica de processamento
    const processed = await this.transformData(params.data);
    
    return {
      success: true,
      output: processed,
      metadata: {
        processedAt: new Date().toISOString(),
        inputSize: params.data.length
      }
    };
  }
}
```

**`Example`**

```typescript
// Tratamento de erro em ferramentas
class FileReaderTool extends ToolBase<FileReaderParams, string> {
  public async execute(params: FileReaderParams): Promise<string> {
    try {
      const content = await fs.readFile(params.filePath, 'utf-8');
      return content;
    } catch (error) {
      throw new Error(`Erro ao ler arquivo ${params.filePath}: ${error.message}`);
    }
  }
}
```

#### Overrides

[ToolBase](tools_constructor_toolBase.ToolBase.md).[execute](tools_constructor_toolBase.ToolBase.md#execute)

#### Defined in

[src/tools/tools/callFlowTool.ts:19](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/tools/callFlowTool.ts#L19)
