// src/tools/toolRegistry.ts
import { ITool, IToolParams } from '@/tools/core/interfaces';
import { logger } from '@/utils/logger';

/**
 * Registry centralizado para gerenciar e fornecer instâncias de ferramentas.
 * 
 * Esta classe atua como um catálogo central para todo o sistema de ferramentas,
 * fornecendo funcionalidades de registro, descoberta e listagem que são
 * utilizadas pelo PromptBuilder (para geração de schemas) e pelo
 * ToolExecutor (para execução de ferramentas).
 * 
 * ## Funcionalidades Principais
 * 
 * - **Registro de Ferramentas**: Permite registrar novas ferramentas no sistema
 * - **Descoberta por Nome**: Localiza ferramentas específicas pelo nome
 * - **Listagem Completa**: Retorna todas as ferramentas registradas
 * - **Sobrescrita Segura**: Permite sobrescrever ferramentas existentes com warning
 * - **Pattern Singleton**: Uma única instância global para toda a aplicação
 * 
 * ## Padrão de Uso
 * 
 * O ToolRegistry segue o padrão Singleton, garantindo que exista apenas
 * uma instância global compartilhada em toda a aplicação. Isso permite
 * que diferentes módulos (PromptBuilder, ToolExecutor, Agents) acessem
 * o mesmo conjunto de ferramentas registradas.
 * 
 * @example
 * ```typescript
 * import { toolRegistry } from '@/tools/core/toolRegistry';
 * import { CalculatorTool } from './tools/calculatorTool';
 * 
 * // Registrar uma ferramenta
 * const calculator = new CalculatorTool();
 * toolRegistry.register(calculator);
 * 
 * // Descobrir uma ferramenta
 * const tool = toolRegistry.getTool('calculator');
 * if (tool) {
 *   console.log('Ferramenta encontrada:', tool.name);
 * }
 * 
 * // Listar todas as ferramentas
 * const allTools = toolRegistry.listTools();
 * console.log(`Total de ferramentas: ${allTools.length}`);
 * ```
 * 
 * @see {@link ITool} Para interface de ferramentas
 * @see {@link ToolExecutor} Para execução de ferramentas
 * @see {@link PromptBuilder} Para geração de schemas
 */
class ToolRegistry {
  /** 
   * Mapa interno de instâncias de ferramentas, chaveado pelo nome.
   * Garante acesso O(1) para descoberta de ferramentas.
   */
  private toolInstances = new Map<string, ITool<IToolParams, unknown>>();

  /** 
   * Registra uma nova instância de ferramenta no registry.
   * 
   * Se já existir uma ferramenta com o mesmo nome, ela será sobrescrita
   * após um warning ser emitido no console.
   * 
   * @param toolInstance A instância da ferramenta a ser registrada.
   * Deve implementar a interface ITool e ter um nome único.
   * 
   * @example
   * ```typescript
   * // Registrar ferramenta simples
   * toolRegistry.register(new CalculatorTool());
   * 
   * // Registrar múltiplas ferramentas
   * const tools = [new CalculatorTool(), new SearchTool(), new TodoListTool()];
   * tools.forEach(tool => toolRegistry.register(tool));
   * 
   * // Sobrescrever ferramenta existente (gera warning)
   * toolRegistry.register(new NewCalculatorTool()); // Warning no console
   * ```
   * 
   * @remarks
   * - Ferramentas com nomes duplicados são sobrescritas
   * - Warning é emitido quando sobrescrevendo ferramentas existentes
   * - O registro é imediato e síncrono
   * - Ferramentas registradas ficam disponíveis globalmente
   * 
   * @see {@link getTool} Para descobrir ferramentas registradas
   * @see {@link listTools} Para listar todas as ferramentas
   */
  public register(toolInstance: ITool<IToolParams, unknown>): void {
    if (this.toolInstances.has(toolInstance.name)) {
      logger.warn(
        `[ToolRegistry] A ferramenta com o nome '${toolInstance.name}' ` +
        `já está registrada e será sobrescrita.`
      );
    }
    this.toolInstances.set(toolInstance.name, toolInstance);
  }

  /** 
   * Obtém uma instância de ferramenta pelo nome.
   * 
   * @param name O nome único da ferramenta a ser encontrada.
   * 
   * @returns A instância da ferramenta se encontrada, ou undefined caso contrário.
   * 
   * @example
   * ```typescript
   * // Obter ferramenta específica
   * const calculator = toolRegistry.getTool('calculator');
   * if (calculator) {
   *   console.log('Ferramenta encontrada:', calculator.description);
   * } else {
   *   console.log('Ferramenta não encontrada');
   * }
   * 
   * // Verificar se ferramenta existe antes de usar
   * const searchTool = toolRegistry.getTool('web_search');
   * if (searchTool) {
   *   // Usar a ferramenta
   *   const result = await searchTool.execute(searchParams);
   * }
   * ```
   * 
   * @remarks
   * - Retorna undefined se a ferramenta não for encontrada
   * - Busca é case-sensitive pelo nome exato
   * - Operação O(1) devido ao uso de Map
   * - Útil para verificar se ferramenta está disponível antes de usar
   * 
   * @see {@link register} Para registrar novas ferramentas
   * @see {@link listTools} Para obter lista completa
   */
  public getTool(name: string): ITool<IToolParams, unknown> | undefined {
    return this.toolInstances.get(name);
  }

  /** 
   * Retorna todas as instâncias de ferramentas registradas.
   * 
   * @returns Um array contendo todas as ferramentas registradas.
   * O array é uma cópia, modificações não afetam o registry interno.
   * 
   * @example
   * ```typescript
   * // Obter lista completa de ferramentas
   * const allTools = toolRegistry.listTools();
   * console.log(`Total de ferramentas: ${allTools.length}`);
   * 
   * // Filtrar ferramentas por tipo
   * const mathTools = allTools.filter(tool => 
   *   tool.name.includes('calc') || tool.name.includes('math')
   * );
   * 
   * // Gerar lista de nomes para logging
   * const toolNames = allTools.map(tool => tool.name);
   * console.log('Ferramentas disponíveis:', toolNames.join(', '));
   * ```
   * 
   * @remarks
   * - Retorna uma cópia do array interno para evitar modificações acidentais
   * - Ordem das ferramentas no array não é garantida
   * - Útil para PromptBuilder gerar schemas de todas as ferramentas
   * - Pode ser usado para validação e debugging
   * 
   * @see {@link register} Para adicionar novas ferramentas
   * @see {@link getTool} Para obter ferramenta específica
   */
  public listTools(): ITool<IToolParams, unknown>[] {
    return Array.from(this.toolInstances.values());
  }

  /** 
   * Remove uma ferramenta do registry.
   * 
   * @param name O nome da ferramenta a ser removida.
   * 
   * @returns true se a ferramenta foi removida, false se não existia.
   * 
   * @example
   * ```typescript
   * // Remover ferramenta específica
   * const removed = toolRegistry.unregister('old_calculator');
   * console.log(removed ? 'Ferramenta removida' : 'Ferramenta não encontrada');
   * 
   * // Limpar todas as ferramentas (uso avançado)
   * const allTools = toolRegistry.listTools();
   * allTools.forEach(tool => {
   *   if (tool.name.startsWith('deprecated_')) {
   *     toolRegistry.unregister(tool.name);
   *   }
   * });
   * ```
   * 
   * @remarks
   * - Remove permanentemente a ferramenta do registry
   * - Retorna boolean indicando se a remoção foi bem-sucedida
   * - Útil para gerenciamento dinâmico de ferramentas
   * - Use com cautela em aplicações em produção
   * 
   * @see {@link register} Para adicionar ferramentas
   */
  public unregister(name: string): boolean {
    return this.toolInstances.delete(name);
  }

  /** 
   * Verifica se uma ferramenta está registrada.
   * 
   * @param name O nome da ferramenta a ser verificada.
   * 
   * @returns true se a ferramenta estiver registrada, false caso contrário.
   * 
   * @example
   * ```typescript
   * // Verificar disponibilidade antes de usar
   * if (toolRegistry.hasTool('calculator')) {
   *   const calculator = toolRegistry.getTool('calculator');
   *   // Usar a ferramenta...
   * }
   * 
   * // Verificar múltiplas ferramentas
   * const requiredTools = ['calculator', 'search', 'todo_list'];
   * const availableTools = requiredTools.filter(name => toolRegistry.hasTool(name));
   * console.log('Ferramentas disponíveis:', availableTools);
   * ```
   * 
   * @remarks
   * - Verificação rápida sem retornar a instância
   * - Útil para validação de dependências
   * - Operação O(1) como getTool
   * 
   * @see {@link getTool} Para obter a instância da ferramenta
   */
  public hasTool(name: string): boolean {
    return this.toolInstances.has(name);
  }

  /** 
   * Retorna o número total de ferramentas registradas.
   * 
   * @returns Quantidade de ferramentas no registry.
   * 
   * @example
   * ```typescript
   * const totalTools = toolRegistry.count();
   * console.log(`Total de ferramentas registradas: ${totalTools}`);
   * 
   * // Verificar se registry está vazio
   * if (toolRegistry.count() === 0) {
   *   console.log('Nenhuma ferramenta registrada');
   * }
   * ```
   * 
   * @remarks
   * - Operação O(1) devido ao uso de Map
   * - Útil para debugging e monitoramento
   * 
   * @see {@link listTools} Para obter as ferramentas reais
   */
  public count(): number {
    return this.toolInstances.size;
  }
}

/** 
 * Instância singleton global do ToolRegistry.
 * 
 * Esta instância é exportada e usada em toda a aplicação para
 * registro e descoberta de ferramentas. Garante que todos os
 * módulos acessem o mesmo conjunto de ferramentas.
 * 
 * @example
 * ```typescript
 * // Uso direto da instância global
 * import { toolRegistry } from '@/tools/core/toolRegistry';
 * 
 * toolRegistry.register(new CalculatorTool());
 * const tools = toolRegistry.listTools();
 * ```
 * 
 * @see {@link ToolRegistry} Para documentação da classe
 */
export const toolRegistry = new ToolRegistry();

/** 
 * Registro global de ferramentas disponíveis ao agente.
 * 
 * Este comentário serve como documentação para desenvolvedores
 * indicando que o toolRegistry é o ponto central para gerenciar
 * todas as ferramentas que agentes podem usar.
 * 
 * Cada ferramenta deve implementar o contrato definido em `core/interfaces.ts`
 * para ser compatível com o sistema.
 * 
 * @see {@link ITool} Para interface de ferramentas
 * @see {@link ToolBase} Para classe base de ferramentas
 */
