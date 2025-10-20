import {
  PromptBuilderConfig,
  PromptMode,
  ToolSchema,
} from './promptBuilder.interface';

/**
 * Classe utilitária estática para gerenciar e construir o System Prompt
 * com base no modo de agente, informações do agente e ferramentas.
 */
/**
 * Utilitário para registrar modos de prompt e construir o System Prompt final.
 *
 * - Registre modos via `addPromptMode(mode, builder)`
 * - Construa prompts via `buildSystemPrompt(config)`
 */
export class PromptBuilder {
  private static promptModes = new Map<PromptMode, (config: PromptBuilderConfig) => string>();

  /**
   * Registra um modo de prompt.
   * @param mode Nome do modo (ex.: 'react')
   * @param builder Função que devolve o texto do prompt específico do modo
   */
  public static addPromptMode(
    mode: PromptMode,
    builder: (config: PromptBuilderConfig) => string
  ): void {
    PromptBuilder.promptModes.set(mode, builder);
  }

  /**
   * Constrói o System Prompt a partir do modo e informações do agente.
   * Lança erro caso o modo não esteja registrado.
   */
  public static buildSystemPrompt(config: PromptBuilderConfig): string {
    const { mode, agentInfo, additionalInstructions, tools } = config;

    const parts: string[] = [];

    // 1) Modo do agente: obtém o builder registrado (sem auto-registro, sem fallback por modo)
    const modeBuilder = PromptBuilder.promptModes.get(mode);
    if (!modeBuilder) {
      throw new Error(
        `O modo de agente '${mode}' não foi registrado. Certifique-se de que o modo 'chat' ou o modo especificado foi adicionado via PromptBuilder.addPromptMode.`
      );
    }

    // Executa builder com tratamento raso de erro (sem aninhar)
    try {
      parts.push(modeBuilder(config));
    } catch {
      throw new Error(
        `O modo de agente '${mode}' não foi registrado. Certifique-se de que o modo 'chat' ou o modo especificado foi adicionado via PromptBuilder.addPromptMode.`
      );
    }

    // 2) Linha de resumo do agente (sem incluir additional aqui para evitar duplicação)
    const backstoryText = agentInfo.backstory && agentInfo.backstory.trim().length > 0 ? agentInfo.backstory : '.';
    const summary = `You are ${agentInfo.name}. Your goal: ${agentInfo.goal}. Background: ${backstoryText}`;
    parts.unshift(summary);

    // 2.1) Additional instructions em seção separada (se houver)
    if (additionalInstructions && String(additionalInstructions).trim().length > 0) {
      parts.push(String(additionalInstructions));
    }

    // 3) Tools
    parts.push(PromptBuilder.buildToolsPrompt(tools));

    return parts.join('\n\n');
  }

  private static buildToolsPrompt(tools?: ToolSchema[]): string {
    // Early Return: Retorna o prompt sem ferramentas se a lista estiver vazia.
    if (!tools || tools.length === 0) {
      return `\n## Tools\nVocê não tem acesso a ferramentas.`;
    }

    const toolsDescription = tools
      .map((tool) => {
        const parameters = JSON.stringify(tool.parameters, null, 2);
        return `Nome: ${tool.name}\nDescrição: ${tool.description}\nParâmetros (JSON Schema):\n${parameters}`;
      })
      .join('\n\n---\n\n');

    return `\n## Tools\nVocê tem acesso às seguintes ferramentas. Use-as quando for necessário para atingir seu Goal.\n\n${toolsDescription}`;
  }
}
