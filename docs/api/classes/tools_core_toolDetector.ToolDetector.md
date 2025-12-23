# Class: ToolDetector

[tools/core/toolDetector](../modules/tools_core_toolDetector.md).ToolDetector

Detector inteligente de chamadas de ferramenta em saídas de LLM.

Esta classe atua como uma fachada simplificada para o sistema SAPParser,
fornecendo uma interface unificada para detectar e extrair chamadas de
ferramentas a partir de texto gerado por modelos de linguagem.

## Funcionalidades Principais

- **Detecção Automática**: Identifica chamadas de ferramenta em texto livre
- **Validação Estrutural**: Verifica se a chamada segue o formato SAP esperado
- **Tratamento de Erros**: Fornece feedback detalhado sobre falhas na detecção
- **Logging Integrado**: Registra todo o processo para debugging
- **Interface Simplificada**: Abstrai complexidade do SAPParser

## Fluxo de Detecção

1. **Validação de Entrada**: Verifica se o texto é válido e não vazio
2. **Parsing**: Utiliza SAPParser para analisar o texto
3. **Validação de Resultado**: Determina se é uma chamada válida ou erro
4. **Normalização**: Retorna resultado estruturado com status e dados

## Formato SAP (SAP - Structured Action Protocol)

O sistema espera chamadas de ferramenta no formato:
```
[TOOL_CALL]
tool: nome_da_ferramenta
params: {param1: valor1, param2: valor2}
[/TOOL_CALL]
```

**`Example`**

```typescript
import { ToolDetector } from '@/tools/core/toolDetector';

// Texto com chamada de ferramenta
const llmOutput = `
Vou calcular a soma para você.

[TOOL_CALL]
tool: calculator
params: {"operation": "add", "a": 10, "b": 5}
[/TOOL_CALL]
`;

// Detectar ferramenta
const result = ToolDetector.detect(llmOutput);

if (result.success) {
  console.log('Ferramenta detectada:', result.toolCall);
  // { toolName: 'calculator', params: { operation: 'add', a: 10, b: 5 } }
} else {
  console.error('Erro na detecção:', result.error.message);
}
```

**`Example`**

```typescript
// Texto sem chamada de ferramenta
const simpleText = 'Olá! Como posso ajudá-lo hoje?';
const result = ToolDetector.detect(simpleText);

console.log(result.success); // false
console.log(result.error.message); // "Saída do LLM vazia ou inválida"
```

**`See`**

 - [IToolCall](../interfaces/tools_core_interfaces.IToolCall.md) Para formato das chamadas detectadas
 - [ISAPError](../interfaces/tools_constructor_sapParser.ISAPError.md) Para formato dos erros de detecção
 - [SAPParser](tools_constructor_sapParser.SAPParser.md) Para detalhes do parser subjacente

## Table of contents

### Constructors

- [constructor](tools_core_toolDetector.ToolDetector.md#constructor)

### Methods

- [detect](tools_core_toolDetector.ToolDetector.md#detect)

## Constructors

### constructor

• **new ToolDetector**(): [`ToolDetector`](tools_core_toolDetector.ToolDetector.md)

#### Returns

[`ToolDetector`](tools_core_toolDetector.ToolDetector.md)

## Methods

### detect

▸ **detect**(`llmOutput`): [`ToolDetectionResult`](../interfaces/tools_core_toolDetector.ToolDetectionResult.md)

Detecta e extrai chamadas de ferramenta de texto gerado por LLM.

Este método analisa o texto fornecido em busca de chamadas de ferramenta
no formato SAP (Structured Action Protocol). Se encontrar uma chamada
válida, retorna um ToolDetectionResult com success=true e os dados da
chamada. Caso contrário, retorna success=false com detalhes do erro.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `llmOutput` | `string` | Texto de saída do LLM a ser analisado. Deve ser uma string não vazia contendo possivelmente uma chamada SAP. |

#### Returns

[`ToolDetectionResult`](../interfaces/tools_core_toolDetector.ToolDetectionResult.md)

ToolDetectionResult com resultado da detecção.

**`Example`**

```typescript
// Detecção bem-sucedida
const output = '[TOOL_CALL]\ntool: search\nparams: {"query": "TypeScript"}\n[/TOOL_CALL]';
const result = ToolDetector.detect(output);

if (result.success) {
  console.log(result.toolCall.toolName); // "search"
  console.log(result.toolCall.params.query); // "TypeScript"
}

// Detecção com falha
const invalidOutput = 'Texto sem formato SAP';
const result2 = ToolDetector.detect(invalidOutput);

if (!result2.success) {
  console.error(result2.error.message);
}
```

**`Remarks`**

- Utiliza SAPParser internamente para análise estrutural
- Valida entrada antes de processar
- Emite logs detalhados para debugging
- Retorna resultado estruturado independente do sucesso/falha

**`See`**

 - [ToolDetectionResult](../interfaces/tools_core_toolDetector.ToolDetectionResult.md) Para formato do resultado
 - [IToolCall](../interfaces/tools_core_interfaces.IToolCall.md) Para formato das chamadas válidas

#### Defined in

[src/tools/core/toolDetector.ts:135](https://github.com/ericnunes30/frame-agent-sdk/blob/1db108249e8eb633be7c1499d2847cce9adc0709/src/tools/core/toolDetector.ts#L135)
