// src/agents/modesAgents/AgentMode.ts
import { PromptBuilder } from '@/promptBuilder';
import type { PromptBuilderConfig, PromptMode } from '@/promptBuilder';

// Registra os modos padrão automaticamente
import './chatMode';
import './reactMode';

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

}

