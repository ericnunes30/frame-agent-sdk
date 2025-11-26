# Frame Agent SDK

Framework criador de agentes com motor baseado em grafos, módulos reutilizáveis e um orchestrator baseado em steps muito simples e fácil de configurar.

## 🚀 Características

- **Motor de Grafos**: Sistema de orquestração baseado em grafos para workflows complexos
- **Orchestrator de Steps**: Sistema simples e intuitivo para fluxos lineares
- **Modular**: Componentes reutilizáveis e extensíveis
- **Multi-Provider**: Suporte para OpenAI e provedores compatíveis
- **Sistema de Tools**: Framework completo para criação e execução de ferramentas
- **Memória Inteligente**: Gerenciamento automático de contexto e histórico
- **Logging Configurável**: Sistema de logs com níveis DEBUG, INFO, WARN e ERROR

## 📦 Instalação

```bash
npm install
```

## 🔧 Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Preencha suas credenciais no arquivo `.env`:
```env
# Ativa logs de debug (True/true para ativar)
DEBUG=false

# Configurações do provedor LLM
OPENAI_API_KEY=sua-chave-aqui
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

## 🏗️ Build

```bash
npm run build
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes com coverage
npm run test:coverage

# Executar apenas testes unitários
npm run test:unit

# Executar testes em modo watch
npm run test:watch
```

## 📚 Documentação

### Logging

O SDK possui um sistema de logging configurável via variável de ambiente `DEBUG`:

- **`DEBUG=True`** ou **`DEBUG=true`**: Exibe todos os logs (DEBUG, INFO, WARN, ERROR)
- **`DEBUG=False`** ou não definido: Exibe apenas WARN e ERROR

### Estrutura do Projeto

```
frame-agent-sdk/
├── src/
│   ├── agent/           # Sistema de agentes
│   ├── llmModes/        # Modos de operação (CHAT, REACT)
│   ├── memory/          # Gerenciamento de memória e contexto
│   ├── orchestrators/   # Orquestradores (Graph e Steps)
│   ├── promptBuilder/   # Construção de prompts
│   ├── providers/       # Provedores LLM
│   ├── tools/           # Sistema de ferramentas
│   └── utils/           # Utilitários (logger, etc)
├── tests/               # Testes unitários
└── dist/                # Build compilado
```

## 📄 Licença

**LICENÇA PROPRIETÁRIA - USO RESTRITO**

Copyright (c) 2025 Eric Nunes. Todos os direitos reservados.

Este software é proprietário e está disponível apenas para:
- ✅ Uso interno da organização
- ✅ Pesquisa e testes pessoais
- ✅ Uso pessoal não-comercial

**NÃO É PERMITIDO:**
- ❌ Uso comercial
- ❌ Redistribuição
- ❌ Venda de produtos construídos com este SDK

Para mais detalhes, consulte o arquivo [LICENSE](./LICENSE).

## 🤝 Contribuindo

Este é um projeto proprietário de uso interno. Contribuições externas não são aceitas no momento.

## 📞 Contato

- **Autor**: Eric Nunes
- **GitHub**: [https://github.com/ericnunes30/frame-agent-sdk](https://github.com/ericnunes30/frame-agent-sdk)
- **Issues**: [https://github.com/ericnunes30/frame-agent-sdk/issues](https://github.com/ericnunes30/frame-agent-sdk/issues)

## ⚠️ Aviso Legal

ESTE SOFTWARE É FORNECIDO "NO ESTADO EM QUE SE ENCONTRA", SEM GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS. O AUTOR NÃO SE RESPONSABILIZA POR QUAISQUER DANOS DECORRENTES DO USO DESTE SOFTWARE.
