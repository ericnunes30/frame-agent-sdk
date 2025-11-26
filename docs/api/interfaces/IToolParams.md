# Interface: IToolParams

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

 - [ITool](ITool.md) Para interface principal de ferramentas
 - [ToolBase](../classes/ToolBase.md) Para classe base de ferramentas

## Implemented by

- [`ApprovalParams`](../classes/ApprovalParams.md)
- [`AskUserParams`](../classes/AskUserParams.md)
- [`FinalAnswerParams`](../classes/FinalAnswerParams.md)
- [`TodoListParams`](../classes/TodoListParams.md)
