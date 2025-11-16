## Resumo dos Principais Padrões

1. **Nomenclatura**: camelCase para variáveis/funções, PascalCase para classes/interfaces/enums
2. **Tipos**: USAR APENAS INTERFACES + ENUMS - NUNCA usar type (é gambiarra)
3. **Validação**: Valibot obrigatório apenas para inputs externos (usuário/API)
4. **Design Patterns**: Strategy + Factory (AgentBuilder) + Registry são obrigatórios
5. **Controle de Fluxo**: NUNCA usar else/else if, NUNCA aninhar ifs, usar early returns
6. **Validações Lineares**: UMA validação por linha, NUNCA combinar com || ou && em if
7. **Mensagens de Erro**: Usar enums padronizados para todas as mensagens de erro
8. **Tratamento de Erros**: Sem aninhamento de try/catch com if, separar responsabilidades
9. **Nomenclatura de Métodos**: Sem get/set genéricos, usar nomes descritivos e específicos
10. **Arquivos**: Estrutura consistente com imports → interfaces/enums → schemas → classe
11. **Erro**: Exceções específicas com tratamento adequado
12. **Documentação**: JSDoc para APIs públicas, comentários explicativos para lógica complexa
13. **Testes**: AAA pattern com descrições claras
14. **Git**: Commits semânticos com branch organization adequada
15. **Regra de Ouro**: Early return + validações lineares + erros padronizados + métodos descritivos
16. **Evite aninhar ganchos de lógicas e validações:** Não aninhe ifs, for if, try cat e etc.

Seguir esses padrões garantirá código maintainable, legível e consistente em todo o projeto.