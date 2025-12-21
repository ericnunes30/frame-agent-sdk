# Module: tools/core/toolRegistry

## Table of contents

### Variables

- [toolRegistry](tools_core_toolRegistry.md#toolregistry)

## Variables

### toolRegistry

• `Const` **toolRegistry**: `ToolRegistry`

Instância singleton global do ToolRegistry.

Esta instância é exportada e usada em toda a aplicação para
registro e descoberta de ferramentas. Garante que todos os
módulos acessem o mesmo conjunto de ferramentas.

**`Example`**

```typescript
// Uso direto da instância global
import { toolRegistry } from '@/tools/core/toolRegistry';

toolRegistry.register(new CalculatorTool());
const tools = toolRegistry.listTools();
```

**`See`**

ToolRegistry Para documentação da classe

#### Defined in

[src/tools/core/toolRegistry.ts:284](https://github.com/ericnunes30/frame-agent-sdk/blob/a8ed935aa5f9700d47bfce931a0662a7ab3d590d/src/tools/core/toolRegistry.ts#L284)
