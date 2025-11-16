// src/agents/modesAgents/AgentMode.ts
import { PromptBuilder } from '../../promptBuilder';
import type { PromptBuilderConfig, PromptMode } from '../../promptBuilder';

/**
 * Classe utilitária para gerenciar modos de agentes
 * 
 * Esta classe fornece métodos para registrar e gerenciar diferentes modos
 * de comportamento de agentes no PromptBuilder.
 */
export class AgentMode {
  private static registeredModes: Set<string> = new Set();

  /**
   * Registra um novo modo de agente no PromptBuilder
   */
  public static registerMode(modeName: string, modeFunction: (config: PromptBuilderConfig) => string): void {
    if (this.registeredModes.has(modeName)) {
      console.warn(`Modo '${modeName}' já está registrado. Ignorando registro duplicado.`);
      return;
    }

    PromptBuilder.addPromptMode(modeName as PromptMode, modeFunction);
    this.registeredModes.add(modeName);
  }

  /**
   * Verifica se um modo está registrado
   */
  public static isModeRegistered(modeName: string): boolean {
    return this.registeredModes.has(modeName);
  }

  /**
   * Lista todos os modos registrados
   */
  public static listRegisteredModes(): string[] {
    return Array.from(this.registeredModes);
  }

  /**
   * Remove um modo registrado (para testes)
   */
  public static unregisterMode(modeName: string): void {
    this.registeredModes.delete(modeName);
  }

  /**
   * Limpa todos os modos registrados (para testes)
   */
  public static clearRegisteredModes(): void {
    this.registeredModes.clear();
  }
}

// Registra os modos padrão automaticamente
import('./chatAgentMode');
import('./reactAgentMode');