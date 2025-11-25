# Interface: ChatHistoryConfig

Configuração para o gerenciador de histórico baseada em tokens.

Esta interface define os parâmetros necessários para configurar o
ChatHistoryManager, permitindo que seja adaptado para diferentes
modelos de LLM com diferentes limites de contexto.

**`Example`**

```typescript
// Configuração para GPT-4
const gpt4Config: ChatHistoryConfig = {
  maxContextTokens: 8192,
  tokenizer: new TokenizerService('gpt-4')
};

// Configuração para Claude
const claudeConfig: ChatHistoryConfig = {
  maxContextTokens: 100000,
  tokenizer: new ClaudeTokenizer()
};

const history = new ChatHistoryManager(gpt4Config);
```

## Table of contents

### Properties

- [maxContextTokens](ChatHistoryConfig.md#maxcontexttokens)
- [tokenizer](ChatHistoryConfig.md#tokenizer)

## Properties

### maxContextTokens

• **maxContextTokens**: `number`

O limite máximo de tokens para o contexto total da conversa.

Este valor deve corresponder ao limite do modelo de LLM sendo usado:
- GPT-3.5: ~4,096 tokens
- GPT-4: ~8,192 tokens (ou 32,768 para GPT-4-32k)
- Claude: até 100,000 tokens

**`Remarks`**

- Deve ser um número inteiro positivo
- Considere uma margem de segurança (ex: 90% do limite real)
- Valores muito baixos podem causar truncamento excessivo

#### Defined in

[src/memory/memory.interface.ts:282](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/memory.interface.ts#L282)

___

### tokenizer

• **tokenizer**: [`ITokenizerService`](ITokenizerService.md)

O serviço de tokenização responsável por calcular o custo em tokens.

Pode ser qualquer implementação da interface ITokenizerService:
- TokenizerService (aproximação por caracteres)
- TiktokenService (OpenAI)
- ClaudeTokenizer (Anthropic)
- Implementações customizadas

**`Remarks`**

- Deve ser compatível com o modelo especificado
- A precisão do tokenizador afeta a qualidade do truncamento
- Tokenizadores específicos por modelo são mais precisos

#### Defined in

[src/memory/memory.interface.ts:298](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/memory/memory.interface.ts#L298)
