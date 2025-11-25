import {
  AgentInfo,
  PromptBuilderConfig,
  PromptMode,
  ToolSchema,
} from './promptBuilder.interface';
import { logger } from '@/utils/logger';
import { toolRegistry } from '@/tools/core/toolRegistry';
import { generateTypedSchema } from '@/tools/constructor/schemaGenerator';

/**
 * Static utility class to manage and build the System Prompt
 * based on agent mode, agent info, and tools.
 */
/**
 * Utility to register prompt modes and build the final System Prompt.
 *
 * - Register modes via `addPromptMode(mode, builder)`
 * - Build prompts via `buildSystemPrompt(config)`
 */
export class PromptBuilder {
  private static promptModes = new Map<PromptMode, (config: PromptBuilderConfig) => string>();

  /**
   * Registers a prompt mode.
   * @param mode Mode name (e.g., 'react')
   * @param builder Function that returns the mode-specific prompt text
   */
  public static addPromptMode(
    mode: PromptMode,
    builder: (config: PromptBuilderConfig) => string
  ): void {
    PromptBuilder.promptModes.set(mode, builder);
  }


  /**
   * Converte nomes de tools registradas em schemas tipados para o LLM.
   * Útil para preparar tools antes de construir o prompt.
   * 
   * @param names Array de nomes de ferramentas registradas no toolRegistry
   * @returns Array de ToolSchema prontos para uso
   * 
   * @example
   * ```typescript
   * const schemas = PromptBuilder.buildToolSchemasByNames(['search', 'file_create', 'terminal']);
   * ```
   */
  public static buildToolSchemasByNames(names: string[]): ToolSchema[] {
    const schemas: ToolSchema[] = [];

    for (const name of names) {
      const tool = toolRegistry.getTool(name);
      if (!tool) {
        logger.warn(`[PromptBuilder.buildToolSchemasByNames] Tool '${name}' not found in registry, skipping`);
        continue;
      }

      try {
        schemas.push({
          name: tool.name,
          description: tool.description,
          parameterSchema: generateTypedSchema(tool)
        });
      } catch (error) {
        logger.warn(`[PromptBuilder.buildToolSchemasByNames] Failed to generate schema for '${name}':`, error);
        // Fallback: schema sem parâmetros
        schemas.push({
          name: tool.name,
          description: tool.description,
          parameterSchema: ''
        });
      }
    }

    return schemas;
  }

  /**
   * Builds the System Prompt from the agent mode and info.
   * Throws an error if the mode is not registered.
   */
  public static buildSystemPrompt(config: PromptBuilderConfig): string {
    const { mode, agentInfo, additionalInstructions, tools, toolNames } = config;

    // Determinar tools a usar: ou as já fornecidas, ou converter de toolNames
    let finalTools: ToolSchema[] | undefined = tools;
    if (!finalTools && toolNames && toolNames.length > 0) {
      finalTools = PromptBuilder.buildToolSchemasByNames(toolNames);
    }

    const parts: string[] = [];

    // 1) Validation of registered mode (execution will be done at the end)
    const modeBuilder = PromptBuilder.promptModes.get(mode);
    if (!modeBuilder) {
      throw new Error(
        `The agent mode '${mode}' was not registered. Ensure that 'chat' mode or the specified mode was added via PromptBuilder.addPromptMode.`
      );
    }

    // 2) Agent identity with improved formatting
    const hasBackstory = agentInfo.backstory;
    const isBackstoryValid = hasBackstory && agentInfo.backstory.trim().length > 0;
    const backstoryText = isBackstoryValid ? agentInfo.backstory : 'No additional context.';

    const identity = [
      '# Agent Identity',
      '',
      `Name: ${agentInfo.name}`,
      `Role: ${agentInfo.goal}`,
      `Backstory: ${backstoryText}`,
    ].join('\n');

    parts.unshift(identity);

    // 2.1) Additional instructions in a separate section with separator
    const hasAdditionalInstructions = additionalInstructions;
    const isValidInstruction = hasAdditionalInstructions && String(additionalInstructions).trim().length > 0;
    if (isValidInstruction) {
      const additionalSection = [
        '---',
        '',
        '## Additional Instructions',
        '',
        String(additionalInstructions)
      ].join('\n');
      parts.push(additionalSection);
    }

    const taskListText = PromptBuilder.buildTaskListPrompt(config.taskList)
    if (taskListText) {
      parts.push(taskListText)
    }
    parts.push(PromptBuilder.buildToolsPrompt(finalTools));

    // 5) Mode rules last (optimizes LLM attention span)
    parts.push(modeBuilder(config));

    const finalPrompt = parts.join('\n\n');
    const preview = finalPrompt.length > 1500 ? `${finalPrompt.slice(0, 1500)}...` : finalPrompt;
    return finalPrompt;
  }

  private static buildToolsPrompt(tools?: ToolSchema[]): string {
    // Early Return: Returns the prompt without tools if the list is empty.
    if (!tools || tools.length === 0) {
      return '\n---\n\n## Tools\n\nYou do not have access to tools.';
    }

    logger.debug('PromptBuilder.buildToolsPrompt - Building tools prompt with SAP format:', {
      totalTools: tools.length,
      toolNames: tools.map(t => t.name)
    });

    // Construir descrições filtrando ferramentas sem parâmetros úteis
    const descriptions: string[] = [];
    const emptyClassPattern = /^class\s+\w+\s*=\s*{\s*}$/;

    for (const tool of tools) {
      let parametersString: string;

      if (typeof tool.parameterSchema === 'string' && tool.parameterSchema.trim().length > 0) {
        parametersString = tool.parameterSchema;
        logger.debug('PromptBuilder.buildToolsPrompt - Using existing SAP format:', {
          toolName: tool.name,
          parametersPreview: parametersString.substring(0, 100)
        });
      } else {
        try {
          parametersString = generateTypedSchema(tool as any);
          logger.debug('PromptBuilder.buildToolsPrompt - Generated SAP from parameterSchema:', {
            toolName: tool.name,
            parametersPreview: parametersString.substring(0, 100)
          });
        } catch (error) {
          logger.warn(`PromptBuilder.buildToolsPrompt - Failed to generate SAP for '${tool.name}':`, error);
          parametersString = typeof tool.parameterSchema === 'object' && tool.parameterSchema !== null
            ? JSON.stringify(tool.parameterSchema, null, 2)
            : '';
        }
      }

      const trimmed = typeof parametersString === 'string' ? parametersString.trim() : '';
      // Se o schema for vazio (string vazia ou `class Name = {}`), ignoramos a tool
      if (!trimmed || emptyClassPattern.test(trimmed)) {
        logger.debug('PromptBuilder.buildToolsPrompt - Skipping tool without parameters:', { toolName: tool.name });
        continue;
      }

      descriptions.push(`Name: ${tool.name}\nDescription: ${tool.description}\nParameters (Class Schema):\n${parametersString}`);
    }

    if (descriptions.length === 0) {
      return '\n---\n\n## Tools\n\nYou do not have access to tools.';
    }

    const toolsDescription = descriptions.join('\n\n---\n\n');
    return `\n---\n\n## Tools\n\nYou have access to the following tools. Use them when necessary to achieve your goal.\n\n${toolsDescription}`;
  }

  /**
   * Determina o systemPrompt a partir dos argumentos fornecidos.
   * Centraliza a lógica de decisão de qual fonte de prompt usar.
   */
  public static determineSystemPrompt(args: {
    promptConfig?: PromptBuilderConfig;
    systemPrompt?: string;
    mode?: PromptMode;
    agentInfo?: AgentInfo;
    additionalInstructions?: string;
    tools?: ToolSchema[];
    taskList?: { items: Array<{ id: string; title: string; status: 'pending' | 'in_progress' | 'completed' }> };
  }): { systemPrompt: string; source: 'promptConfig' | 'systemPrompt' | 'mode+agentInfo+additionalInstructions' } {

    if (args.promptConfig) {
      return {
        systemPrompt: PromptBuilder.buildSystemPrompt(args.promptConfig),
        source: 'promptConfig'
      };
    }

    if (args.systemPrompt) {
      return { systemPrompt: args.systemPrompt, source: 'systemPrompt' };
    }

    if (args.mode && args.agentInfo) {
      const promptConfig: PromptBuilderConfig = {
        mode: args.mode,
        agentInfo: args.agentInfo,
        additionalInstructions: args.additionalInstructions,
        tools: args.tools,
        taskList: args.taskList,
      };
      return {
        systemPrompt: PromptBuilder.buildSystemPrompt(promptConfig),
        source: 'mode+agentInfo+additionalInstructions'
      };
    }

    throw new Error('Deve fornecer promptConfig, systemPrompt, ou mode+agentInfo');
  }

  private static buildTaskListPrompt(taskList?: { items: Array<{ id: string; title: string; status: 'pending' | 'in_progress' | 'completed' }> }): string {
    if (!taskList || !Array.isArray(taskList.items) || taskList.items.length === 0) return ''
    const lines = taskList.items
      .map((t) => `- [${t.status}] ${t.title} (id: ${t.id})`)
      .join('\n')
    return `\n---\n\n## Task List\n\n${lines}`;
  }
}
