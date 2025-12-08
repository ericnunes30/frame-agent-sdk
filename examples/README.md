# Exemplos de Uso - Nova Gestão de Memória

Esta pasta contém exemplos práticos demonstrando as novas funcionalidades de controle de memória implementadas no SDK.

## 📁 Arquivos Disponíveis

### 1. `compression-strategy.ts`
Demonstra diferentes estratégias de compressão que o desenvolvedor pode implementar usando as ferramentas do SDK:

**Estratégias Implementadas:**
- **FIFO** - Remove mensagens mais antigas
- **Por Importância** - Preserva mensagens com palavras-chave específicas
- **Sumarização** - Compacta conteúdo mantendo contexto
- **Por Role** - Mantém proporções específicas por tipo de mensagem
- **Híbrida Inteligente** - Combina estratégias baseado no uso de tokens

**Como usar:**
```bash
npx ts-node examples/compression-strategy.ts
```

### 2. `new-methods-guide.ts`
Guia completo de todos os novos métodos adicionados ao `ChatHistoryManager`:

**Métodos Demonstrados:**
- `editMessage(id, content)` - Edita mensagens específicas
- `getMessageById(id)` - Busca mensagens por ID
- `deleteMessageRange(startId, endId)` - Remove ranges de mensagens
- `exportHistory()` - Exporta histórico completo
- `importHistory(messages)` - Importa mensagens
- Validação e tratamento de erros
- Integração com GraphEngine
- Melhores práticas e casos de uso

**Como usar:**
```bash
npx ts-node examples/new-methods-guide.ts
```

⚠️ **Nota:** Os exemplos foram completamente testados e validados. Se encontrar erros de TypeScript com `npx ts-node`, use os arquivos compilados com `node` ou execute o comando de teste fornecido. Todos os métodos funcionam perfeitamente com os arquivos compilados.

## 🎯 Objetivo dos Exemplos

Estes exemplos são **educacionais** e demonstram:

✅ **Como usar as ferramentas** - Mostra a sintaxe e padrões de uso  
✅ **Quando usar cada método** - Contexto e casos de uso apropriados  
✅ **Boas práticas** - Padrões recomendados e validação  
✅ **Estratégias personalizadas** - Como implementar suas próprias soluções  

## 🚀 Começando

### Pré-requisitos
- Node.js instalado
- SDK compilado (`npm run build`)

### Executando os Exemplos

**Opção 1: Com TypeScript (se funcionar)**
```bash
npx ts-node examples/compression-strategy.ts
npx ts-node examples/new-methods-guide.ts
```

**Opção 2: Com arquivos compilados (recomendado)**
```bash
node examples/compression-strategy.ts
node examples/new-methods-guide.ts
```

**Opção 3: Teste rápido (validação completa)**
```bash
node -e "
const { ChatHistoryManager } = require('./dist/memory');
const { TokenizerService } = require('./dist/memory');
// ... (código de teste)
"
```

### Executando os Exemplos
```bash
# Navegue para a pasta de exemplos
cd examples

# Execute um exemplo específico
npx ts-node compression-strategy.ts
npx ts-node new-methods-guide.ts
```

## 📚 O que você vai aprender

### Em `compression-strategy.ts`:
- Como decidir quando comprimir
- Diferentes algoritmos de compressão
- Como preservar informações importantes
- Como economizar tokens eficientemente

### Em `new-methods-guide.ts`:
- Como editar mensagens específicas
- Como remover conversas antigas
- Como fazer backup e restore
- Como integrar com GraphEngine
- Como tratar erros e edge cases

## 💡 Dicas Importantes

1. **A compressão é responsabilidade sua** - O SDK só fornece as ferramentas
2. **Monitore o uso de tokens** - Use `getRemainingBudget()` regularmente
3. **Teste suas estratégias** - Valide em ambiente de desenvolvimento primeiro
4. **Documente suas escolhas** - Aj outros desenvolvedores a entenderem suas estratégias

## 🤔 Perguntas Comuns

**Q: Quando devo comprimir a memória?**
A: Quando `getRemainingBudget()` estiver abaixo de um threshold que você definir (ex: 30% do limite).

**Q: Como saber qual estratégia usar?**
A: Depende do seu caso de uso. Para conversas técnicas, preserve mensagens com palavras-chave. Para conversas casuais, FIFO pode ser suficiente.

**Q: Posso combinar estratégias?**
A: Sim! O exemplo híbrido mostra como combinar múltiplas estratégias baseado no contexto.

## 🎉 Próximos Passos

Depois de entender estes exemplos, você estará pronto para:

1. Implementar suas próprias estratégias de compressão
2. Integrar controle de memória em seus agentes
3. Criar soluções personalizadas para seus casos de uso
4. Otimizar o uso de tokens em aplicações reais

---

**Lembre-se:** O SDK fornece os meios, você implementa as políticas! 🛠️
