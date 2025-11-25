# Interface: ToolDetectionResult

Resultado da detecção de chamadas de ferramenta.

Interface que encapsula o resultado da operação de detecção,
indicando se uma chamada de ferramenta foi encontrada ou se
houve algum erro durante o processo.

## Table of contents

### Properties

- [error](ToolDetectionResult.md#error)
- [success](ToolDetectionResult.md#success)
- [toolCall](ToolDetectionResult.md#toolcall)

## Properties

### error

• `Optional` **error**: [`ISAPError`](ISAPError.md)

Erro detalhado da detecção (apenas se success = false)

#### Defined in

[src/tools/core/toolDetector.ts:18](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/core/toolDetector.ts#L18)

___

### success

• **success**: `boolean`

Indica se a detecção foi bem-sucedida

#### Defined in

[src/tools/core/toolDetector.ts:14](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/core/toolDetector.ts#L14)

___

### toolCall

• `Optional` **toolCall**: [`IToolCall`](IToolCall.md)

Chamada de ferramenta detectada (apenas se success = true)

#### Defined in

[src/tools/core/toolDetector.ts:16](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/tools/core/toolDetector.ts#L16)
