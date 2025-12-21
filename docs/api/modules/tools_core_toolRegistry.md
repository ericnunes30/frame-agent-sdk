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

[src/tools/core/toolRegistry.ts:284](https://github.com/ericnunes30/frame-agent-sdk/blob/1852cae29827cab7c8370a94a17046aff7065c1b/src/tools/core/toolRegistry.ts#L284)
