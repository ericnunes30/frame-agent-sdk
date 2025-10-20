# Tests Directory

## Estrutura de Testes Unitários

Este diretório contém testes unitários para cada módulo do Frame Agent Framework.

### 📁 Estrutura de Diretórios

```
tests/
├── README.md                     # Este arquivo
├── jest.config.js               # Configuração do Jest
├── setup.ts                     # Setup global dos testes
├── memory/                      # Testes do módulo Memory
│   ├── tokenizer.test.ts        # TokenizerService
│   └── chatHistoryManager.test.ts # ChatHistoryManager
├── tools/                       # Testes do módulo Tools
│   ├── sapParser.test.ts        # SAPParser
│   ├── toolBase.test.ts         # ToolBase
│   ├── toolRegistry.test.ts     # ToolRegistry
│   └── tools/                   # Testes das ferramentas concretas
│       ├── searchTool.test.ts
│       ├── askUserTool.test.ts
│       └── finalAnswerTool.test.ts
├── providers/                   # Testes do módulo Providers
│   ├── providerAdapter.test.ts  # ProviderAdapter
│   └── openAiProvider.test.ts   # OpenAIProvider
├── llm/                         # Testes do módulo LLM
│   └── llm.test.ts              # LLM
├── promptBuilder/               # Testes do módulo PromptBuilder
│   └── promptBuilder.test.ts    # PromptBuilder
├── agents/                      # Testes do módulo Agents
│   └── reactAgent.test.ts       # ReactAgent
├── orchestrators/               # Testes do módulo Orchestrators
│   └── stepsOrchestrator.test.ts # StepsOrchestrator
└── integration/                 # Testes de integração (opcional)
    └── agentFlow.test.ts        # Fluxo completo do agente
```

### 🎯 Estratégia de Testes

1. **Unitários**: Testar cada módulo isoladamente
2. **Independentes**: Cada teste não deve depender de outros
3. **Completos**: Cobrir todos os métodos e casos de uso
4. **Mocks**: Usar mocks para dependências externas (APIs, etc.)

### 🚀 Como Executar

```bash
# Executar todos os testes
npm test

# Executar testes de um módulo específico
npm test -- memory

# Executar testes em watch mode
npm test -- --watch

# Ver cobertura de testes
npm test -- --coverage
```

### 📋 Critérios de Conclusão

Cada módulo deve ter:
- ✅ Testes de todos os métodos públicos
- ✅ Testes de casos de borda
- ✅ Testes de tratamento de erros
- ✅ Mocks de dependências externas
- ✅ Cobertura > 90%