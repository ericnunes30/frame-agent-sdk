# AGENTS.md - Diretrizes de Codificação para Agentes de IA

## Comandos de Build/Lint/Test

- Build: `npm run build` (compila TypeScript para dist/)
- Executar todos os testes: `npm test`
- Executar arquivo de teste específico: `npx jest caminho/para/arquivo.test.ts`
- Executar testes com padrão: `npx jest -t "padrão"`
- Modo watch: `npm run test:watch`
- Cobertura: `npm run test:coverage`
- Testar módulos específicos: `npm run test:agents`, `npm run test:llm`, etc.
- Documentação: `npm run docs:build`

## Diretrizes de Estilo de Código

### Logging
- Usar o sistema de logging centralizado em `src/utils/logger`
- Incluir nome do módulo em todos os logs
- Usar níveis apropriados (debug para desenvolvimento, info para eventos importantes, warn para situações incomuns, error para falhas)
- Evitar console.log direto, usar logger.info/debug/warn/error

### TypeScript & Geral
- Usar apenas interfaces e enums (não usar types)
- camelCase para variáveis/funções, PascalCase para classes/interfaces/enums
- Estrutura de arquivo: imports → interfaces/enums → schemas → classe
- Early returns apenas (sem else/else if), sem condicionais aninhados
- Uma validação por linha (sem || ou && em if)
- Sem aninhamento de try/catch com condicionais

### Imports
- Usar imports absolutos com prefixo @/ para diretório src/
- Agrupar imports: bibliotecas externas → módulos internos → arquivos locais
- Usar imports de tipo para tipos: `import type { Interface } from './file'`

### Nomenclatura
- Nomes de métodos descritivos (sem get/set genéricos)
- Variáveis com nomes específicos e significativos
- Mensagens de erro via enums padronizados

### Tratamento de Erros
- Exceções específicas com tratamento adequado
- Enums de mensagem de erro padronizados
- Separação clara de responsabilidades no tratamento de erros

### Documentação
- JSDoc para APIs públicas
- Comentários para lógica complexa
- Descrições de testes claras usando padrão AAA (Arrange, Act, Assert)

### Validação
- Valibot obrigatório apenas para inputs externos (usuário/API)
- Padrões Strategy + Factory + Registry obrigatórios

### Git
- Commits semânticos com organização adequada de branches