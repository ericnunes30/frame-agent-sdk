// src/tools/toolRegistry.ts
import { ITool, IToolParams } from './interfaces';
import { logger } from '../../utils';

/**
 * Registry estático para gerenciar e fornecer instâncias de ferramentas.
 * Atua como um catálogo central para o PromptBuilder (listagem) e o Orquestrador (execução).
 */
class ToolRegistry {
  // Mapa de instâncias de ferramentas, chaveado pelo nome da ferramenta.
  private toolInstances = new Map<string, ITool<IToolParams, unknown>>();

  /**
   * Registra uma nova instância de ferramenta.
   * @param toolInstance A instância da ferramenta a ser registrada.
   */
  public register(toolInstance: ITool<IToolParams, unknown>): void {
    if (this.toolInstances.has(toolInstance.name)) {
      logger.warn(`A ferramenta com o nome '${toolInstance.name}' já está registrada e será sobrescrita.`, 'ToolRegistry');
    }
    this.toolInstances.set(toolInstance.name, toolInstance);
  }

  /**
   * Obtém uma instância de ferramenta pelo nome.
   * @param name O nome único da ferramenta.
   * @returns A instância da ferramenta, ou undefined se não for encontrada.
   */
  public getTool(name: string): ITool<IToolParams, unknown> | undefined {
    return this.toolInstances.get(name);
  }

  /**
   * Retorna todas as instâncias de ferramentas registradas.
   * @returns Um array de instâncias de ferramentas.
   */
  public listTools(): ITool<IToolParams, unknown>[] {
    return Array.from(this.toolInstances.values());
  }
}

// Exporta uma instância Singleton para uso em toda a aplicação.
export const toolRegistry = new ToolRegistry();
/**
 * Registro global de ferramentas disponíveis ao agente.
 * Cada ferramenta deve implementar o contrato em `core/interfaces`.
 */
