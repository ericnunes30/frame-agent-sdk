# Interface: AgentExecutionResult

Resultado da execução do agente.

Estrutura que encapsula todos os dados retornados após a execução
de um agente, incluindo conteúdo gerado, mensagens atualizadas,
metadados de execução e status de sucesso.

## Estrutura do Resultado

- **content**: Resposta principal do agente (texto ou null em caso de erro)
- **messages**: Array atualizado com histórico completo
- **toolsUsed**: Lista de ferramentas utilizadas (se aplicável)
- **metadata**: Informações detalhadas sobre a execução
- **success**: Status booleano da operação
- **error**: Mensagem de erro detalhada (se aplicável)

## Casos de Uso

- **Sucesso**: content contém resposta, success=true, error=undefined
- **Erro**: content=null, success=false, error contém detalhes
- **Execução Parcial**: content pode estar presente mesmo com warnings

**`Example`**

```typescript
// Resultado de sucesso
const successResult: AgentExecutionResult = {
  content: 'Olá! Como posso ajudá-lo hoje?',
  messages: [
    { role: 'user', content: 'Olá' },
    { role: 'assistant', content: 'Olá! Como posso ajudá-lo hoje?' }
  ],
  toolsUsed: ['search'],
  metadata: {
    executionTime: 1250,
    startTime: new Date('2024-01-01T10:00:00Z'),
    endTime: new Date('2024-01-01T10:00:01.250Z'),
    tokensUsed: 45,
    cost: 0.002
  },
  success: true
};

// Resultado com erro
const errorResult: AgentExecutionResult = {
  content: null,
  messages: [
    { role: 'user', content: 'Calcule 2+2' }
  ],
  metadata: {
    executionTime: 500,
    startTime: new Date('2024-01-01T10:00:00Z'),
    endTime: new Date('2024-01-01T10:00:00.500Z')
  },
  success: false,
  error: 'Ferramenta calculator não encontrada'
};
```

**`See`**

 - [Message](Message.md) Para formato das mensagens
 - [AgentExecutionOptions](AgentExecutionOptions.md) Para opções de execução

## Table of contents

### Properties

- [content](AgentExecutionResult.md#content)
- [error](AgentExecutionResult.md#error)
- [messages](AgentExecutionResult.md#messages)
- [metadata](AgentExecutionResult.md#metadata)
- [success](AgentExecutionResult.md#success)
- [toolsUsed](AgentExecutionResult.md#toolsused)

## Properties

### content

• **content**: `string`

Conteúdo principal gerado pelo agente.

Texto da resposta do agente ou null se houve erro na execução.
Em caso de sucesso, contém a resposta formatada para o usuário.
Em caso de erro, é sempre null e detalhes estão em error.

**`Example`**

```typescript
// Sucesso
content: 'A resposta para 2+2 é 4.'

// Erro
content: null
```

#### Defined in

[src/agent/interfaces/IAgent.ts:501](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgent.ts#L501)

___

### error

• `Optional` **error**: `string`

Mensagem de erro detalhada, se houver.

Descrição clara do que deu errado durante a execução.
Presente apenas quando success=false.

**`Example`**

```typescript
error: 'API key inválida'
error: 'Modelo não encontrado: gpt-5'
error: 'Timeout na requisição após 30s'
error: 'Ferramenta calculator não registrada'
```

#### Defined in

[src/agent/interfaces/IAgent.ts:633](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgent.ts#L633)

___

### messages

• **messages**: [`Message`](Message.md)[]

Array de mensagens atualizado com o histórico completo.

Inclui todas as mensagens de entrada mais as respostas geradas
durante a execução. Útil para manter contexto em sessões longas.

**`Example`**

```typescript
messages: [
  { role: 'user', content: 'Olá' },
  { role: 'assistant', content: 'Olá! Como posso ajudar?' },
  { role: 'user', content: 'Preciso de ajuda com TypeScript' },
  { role: 'assistant', content: 'Claro! Sobre o que especificamente?' }
]
```

**`See`**

[Message](Message.md) Para formato das mensagens

#### Defined in

[src/agent/interfaces/IAgent.ts:521](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgent.ts#L521)

___

### metadata

• `Optional` **metadata**: `Object`

Metadados detalhados da execução.

Objeto com informações técnicas sobre a execução, incluindo
timing, custos, tokens e dados específicos do provedor LLM.

**`Example`**

```typescript
metadata: {
  executionTime: 2340,        // ms
  startTime: new Date(),      // timestamp início
  endTime: new Date(),        // timestamp fim
  tokensUsed: 156,            // total de tokens
  cost: 0.0047,               // custo em USD
  model: 'gpt-4',             // modelo usado
  provider: 'openai'          // provedor LLM
}
```

#### Index signature

▪ [key: `string`]: `any`

Informações adicionais específicas do provedor.

Pode incluir dados como modelo usado, provedor,
configurações específicas, IDs de requisição, etc.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cost?` | `number` | Custo estimado da execução em USD. Calculado baseado nos tokens utilizados e preços do provedor LLM. Útil para controle de orçamento. |
| `endTime` | `Date` | Timestamp de término da execução. Momento exato em que a execução foi concluída, combinado com startTime para calcular executionTime. |
| `executionTime` | `number` | Tempo total de execução em milissegundos. Medido desde o início do processamento até a conclusão, incluindo tempo de rede, processamento e geração de resposta. |
| `startTime` | `Date` | Timestamp de início da execução. Momento exato em que a execução começou, útil para correlação com logs e debugging. |
| `tokensUsed?` | `number` | Total de tokens utilizados na execução. Inclui tokens de entrada (prompt) e saída (resposta), usado para controle de custos e limites de API. |

#### Defined in

[src/agent/interfaces/IAgent.ts:555](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgent.ts#L555)

___

### success

• **success**: `boolean`

Indica se a execução foi bem-sucedida.

true se o agente processou a requisição com sucesso,
false se houve algum erro que impediu a conclusão.

**`Example`**

```typescript
success: true   // Execução normal
success: false  // Erro na execução
```

#### Defined in

[src/agent/interfaces/IAgent.ts:617](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgent.ts#L617)

___

### toolsUsed

• `Optional` **toolsUsed**: `string`[]

Lista de ferramentas utilizadas durante a execução.

Array com nomes das ferramentas que foram chamadas pelo agente.
Útil para debugging, analytics e controle de custos.

**`Example`**

```typescript
toolsUsed: ['calculator', 'search', 'code_analyzer']
```

#### Defined in

[src/agent/interfaces/IAgent.ts:534](https://github.com/ericnunes30/frame-agent-sdk/blob/80882e3a1098ffccfeb4dd22eb10f4edeb4c782e/src/agent/interfaces/IAgent.ts#L534)
