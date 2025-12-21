# Interface: IToolParams

[tools/core/interfaces](../modules/tools_core_interfaces.md).IToolParams

Interface vazia que serve como base para todas as classes de parâmetros de ferramentas.

Esta interface atua como um marcador de tipo para garantir que todas as classes
de parâmetros implementem uma estrutura comum. Classes de parâmetros devem
extender esta interface para serem compatíveis com o sistema de ferramentas.

**`Example`**

```typescript
// Classe de parâmetros válida
export class CalculatorParams implements IToolParams {
  operation!: 'add' | 'subtract' | 'multiply' | 'divide';
  a!: number;
  b!: number;
}

// Uso em ferramenta
export class CalculatorTool extends ToolBase<CalculatorParams> {
  public readonly name = 'calculator';
  public readonly parameterSchema = CalculatorParams;
}
```

**`Remarks`**

- Interface vazia serve apenas para tipagem
- Classes de parâmetros devem implementar propriedades específicas
- Usada como constraint genérico em ITool

**`See`**

 - [ITool](tools_core_interfaces.ITool.md) Para interface principal de ferramentas
 - ToolBase Para classe base de ferramentas

## Implemented by

- [`ApprovalParams`](../classes/tools_tools_approvalTool.ApprovalParams.md)
- [`AskUserParams`](../classes/tools_tools_askUserTool.AskUserParams.md)
- [`CallFlowParams`](../classes/tools_tools_callFlowParams.CallFlowParams.md)
- [`FinalAnswerParams`](../classes/tools_tools_finalAnswerTool.FinalAnswerParams.md)
- [`ToDoIstParams`](../classes/tools_tools_toDoIstTool.ToDoIstParams.md)
