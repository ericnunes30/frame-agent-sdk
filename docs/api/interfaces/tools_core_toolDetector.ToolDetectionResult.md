# Interface: ToolDetectionResult

[tools/core/toolDetector](../modules/tools_core_toolDetector.md).ToolDetectionResult

Resultado da detecção de chamadas de ferramenta.

Interface que encapsula o resultado da operação de detecção,
indicando se uma chamada de ferramenta foi encontrada ou se
houve algum erro durante o processo.

## Table of contents

### Properties

- [error](tools_core_toolDetector.ToolDetectionResult.md#error)
- [success](tools_core_toolDetector.ToolDetectionResult.md#success)
- [toolCall](tools_core_toolDetector.ToolDetectionResult.md#toolcall)

## Properties

### error

• `Optional` **error**: [`ISAPError`](tools_constructor_sapParser.ISAPError.md)

Erro detalhado da detecção (apenas se success = false)

#### Defined in

[src/tools/core/toolDetector.ts:18](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/core/toolDetector.ts#L18)

___

### success

• **success**: `boolean`

Indica se a detecção foi bem-sucedida

#### Defined in

[src/tools/core/toolDetector.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/core/toolDetector.ts#L14)

___

### toolCall

• `Optional` **toolCall**: [`IToolCall`](tools_core_interfaces.IToolCall.md)

Chamada de ferramenta detectada (apenas se success = true)

#### Defined in

[src/tools/core/toolDetector.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/core/toolDetector.ts#L16)
