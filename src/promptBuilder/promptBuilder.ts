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
 * Classe utilitária estática para gerenciar e construir System Prompts
 * baseados em modo do agente, informações do agente e tools disponíveis.
 * 
 * Esta classe centraliza toda a lógica de construção de prompts estruturados,
 * oferecendo um sistema flexível e extensível para diferentes tipos de agentes
 * e estratégias de prompting.
 * 
 * ## Funcionalidades Principais
 * 
 * - **Registro de Modos**: Suporte a modos customizados via `addPromptMode()`
 * - **Construção de Prompts**: Geração automática de System Prompts estruturados
 * - **Integração com Tools**: Conversão automática de tools para formato LLM
 * - **Templates Flexíveis**: Sistema de templates reutilizáveis
 * - **Validação**: Verificação de configurações e modos registrados
 * 
 * ## Estrutura do Prompt Gerado
 * 
 * O System Prompt segue uma estrutura otimizada:
 * 1. **Agent Identity**: Nome, objetivo e backstory
 * 2. **Additional Instructions**: Instruções extras (se fornecidas)
 * 3. **Task List**: Lista de tarefas (se fornecida)
 * 4. **Tools**: Ferramentas disponíveis com schemas
 * 5. **Mode Rules**: Regras específicas do modo selecionado
 * 
 * @example
 * ```typescript
 * // Registrar modo customizado
 * PromptBuilder.addPromptMode('code_reviewer', (config) => `
 *   ## Modo Code Reviewer
 *   Você é um especialista em revisão de código...
 * `);
 * 
 * // Construir prompt
 * const prompt = PromptBuilder.buildSystemPrompt({
 *   mode: 'code_reviewer',
 *   agentInfo: { name: 'Revisor', goal: 'Revisar código', backstory: 'Expert...' },
 *   toolNames: ['code_analyzer', 'test_runner']
 * });
 * ```
 * 
 * @see {@link PromptBuilderConfig} Para configuração completa
 * @see {@link PromptMode} Para modos disponíveis
 */
export class PromptBuilder {
  /** 
   * Registry interno de modos de prompt registrados.
   * Mapeia nomes de modo para funções construtoras de prompt.
   */
  private static promptModes = new Map<PromptMode, (config: PromptBuilderConfig) => string>();

  /**
   * Registra um novo modo de prompt personalizado no sistema.
   * 
   * Esta função permite estender o sistema com modos customizados de prompting,
   * cada um com suas próprias regras e estratégias específicas.
   * 
   * @param mode Nome do modo a ser registrado.
   * Deve ser único e descritivo do comportamento desejado.
   * 
   * @param builder Função construtora que retorna o texto específico do modo.
   * Recebe a configuração completa e deve retornar as regras do modo.
   * 
   * @throws {Error} Se o modo já estiver registrado
   * 
   * @example
   * ```typescript
   * // Registrar modo de code review
   * PromptBuilder.addPromptMode('code_reviewer', (config) => `
   *   ## Modo Code Reviewer
   *   
   *   Você é um especialista em revisão de código focado em:
   *   1. Qualidade e legibilidade
   *   2. Performance e otimização
   *   3. Segurança e boas práticas
   *   4. Manutenibilidade
   *   
   *   Sempre forneça sugestões específicas e exemplos práticos.
   * `);
   * 
   * // Registrar modo de pesquisa
   * PromptBuilder.addPromptMode('researcher', (config) => `
   *   ## Modo Pesquisador
   *   
   *   Você é um especialista em metodologia de pesquisa:
   *   1. Sempre valide fontes e informações
   *   2. Cite fontes confiáveis
   *   3. Apresente múltiplas perspectivas
   *   4. Organize informações de forma lógica
   * `);
   * ```
   * 
   * @remarks
   * - Modos registrados ficam disponíveis globalmente
   * - Pode sobrescrever modos existentes (com warning)
   * - Use nomes descritivos e únicos
   * - A função builder recebe toda a configuração do agente
   * 
   * @see {@link buildSystemPrompt} Para usar o modo registrado
   */
  public static addPromptMode(
    mode: PromptMode,
    builder: (config: PromptBuilderConfig) => string
  ): void {
    if (PromptBuilder.promptModes.has(mode)) {
      console.warn(`[PromptBuilder.addPromptMode] Mode '${mode}' is already registered. Overwriting.`);
    }
    PromptBuilder.promptModes.set(mode, builder);
  }


  /**
   * Converte nomes de tools registradas em schemas tipados para uso no LLM.
   * 
   * Esta função automatiza o processo de conversão de tools registradas no
   * ToolRegistry para o formato ToolSchema, gerando schemas de parâmetros
   * automaticamente e fornecendo fallbacks para tools que falham na geração.
   * 
   * @param names Array de nomes de ferramentas registradas no toolRegistry.
   * Cada nome deve corresponder a uma tool válida no registry.
   * 
   * @returns Array de ToolSchema prontos para uso no PromptBuilder.
   * Tools que falham na geração são incluídas com schema vazio.
   * 
   * @throws {Error} Se o toolRegistry não estiver disponível
   * 
   * @example
   * ```typescript
   * // Converter tools específicas
   * const schemas = PromptBuilder.buildToolSchemasByNames([
   *   'search',
   *   'file_create', 
   *   'terminal',
   *   'web_scraper'
   * ]);
   * 
   * console.log(schemas);
   * // [
   * //   { name: 'search', description: '...', parameterSchema: 'class SearchParams = {...}' },
   * //   { name: 'file_create', description: '...', parameterSchema: 'class FileCreateParams = {...}' },
   * //   ...
   * // ]
   * ```
   * 
   * @remarks
   * - Tools não encontradas são ignoradas (com warning no log)
   * - Falhas na geração de schema resultam em schema vazio
   * - Útil para preparar tools antes de construir prompts
   * - Pode ser usado independentemente do buildSystemPrompt
   * 
   * @see {@link toolRegistry} Para registro de tools
   * @see {@link generateTypedSchema} Para geração de schemas
   * @see {@link buildSystemPrompt} Para uso dos schemas gerados
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
   * Constrói o System Prompt completo baseado na configuração fornecida.
   * 
   * Esta é a função principal do PromptBuilder, responsável por gerar um
   * System Prompt estruturado e otimizado que incorpora todas as informações
   * do agente, tools disponíveis, instruções adicionais e regras do modo.
   * 
   * @param config Configuração completa do prompt builder.
   * Deve incluir mode, agentInfo e pode incluir tools, instructions, etc.
   * 
   * @returns String contendo o System Prompt completo e estruturado.
   * 
   * @throws {Error} Se o modo especificado não estiver registrado
   * @throws {Error} Se agentInfo for inválido ou incompleto
   * 
   * @example
   * ```typescript
   * // Configuração básica
   * const prompt = PromptBuilder.buildSystemPrompt({
   *   mode: 'chat',
   *   agentInfo: {
   *     name: 'Assistente Virtual',
   *     goal: 'Ajudar usuários com suas perguntas',
   *     backstory: 'Assistente especializado em fornecer informações precisas'
   *   }
   * });
   * 
   * // Configuração avançada com tools e instruções
   * const advancedPrompt = PromptBuilder.buildSystemPrompt({
   *   mode: 'react',
   *   agentInfo: {
   *     name: 'Agente de Pesquisa',
   *     goal: 'Realizar pesquisas abrangentes',
   *     backstory: 'Especialista em metodologia de pesquisa'
   *   },
   *   additionalInstructions: 'Sempre cite fontes e valide informações.',
   *   toolNames: ['web_search', 'data_analyzer'],
   *   taskList: {
   *     items: [
   *       { id: '1', title: 'Definir escopo', status: 'completed' },
   *       { id: '2', title: 'Coletar dados', status: 'in_progress' }
   *     ]
   *   }
   * });
   * ```
   * 
   * @remarks
   * - A estrutura do prompt é otimizada para maximizar atenção do LLM
   * - Modos devem ser registrados previamente via `addPromptMode()`
   * - Tools são convertidas automaticamente se fornecidos nomes
   * - Instruções adicionais são incluídas como seção separada
   * - Task lists são formatadas para fácil acompanhamento
   * 
   * @see {@link addPromptMode} Para registrar modos customizados
   * @see {@link buildToolSchemasByNames} Para conversão de tools
   * @see {@link PromptBuilderConfig} Para formato da configuração
   */
  public static buildSystemPrompt(config: PromptBuilderConfig): string {
    const { mode, agentInfo, additionalInstructions, tools, toolNames } = config;

    // Validação básica da configuração
    if (!mode) {
      throw new Error('Mode é obrigatório na configuração');
    }
    
    if (!agentInfo?.name || !agentInfo?.goal) {
      throw new Error('AgentInfo deve incluir name e goal');
    }

    // Determinar tools a usar: ou as já fornecidas, ou converter de toolNames
    let finalTools: ToolSchema[] | undefined = tools;
    if (!finalTools && toolNames && toolNames.length > 0) {
      finalTools = PromptBuilder.buildToolSchemasByNames(toolNames);
    }

    const parts: string[] = [];

    // 1) Validação e obtenção do modo registrado
    const modeBuilder = PromptBuilder.promptModes.get(mode);
    if (!modeBuilder) {
      throw new Error(
        `The agent mode '${mode}' was not registered. Ensure that 'chat' mode or the specified mode was added via PromptBuilder.addPromptMode.`
      );
    }

    // 2) Construção da identidade do agente
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

    // 3) Instruções adicionais (se fornecidas)
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

    // 4) Lista de tarefas (se fornecida)
    const taskListText = PromptBuilder.buildTaskListPrompt(config.taskList);
    if (taskListText) {
      parts.push(taskListText);
    }

    // 5) Seção de tools (se fornecidas)
    parts.push(PromptBuilder.buildToolsPrompt(finalTools));

    // 6) Regras específicas do modo (posicionadas no final para otimizar atenção)
    parts.push(modeBuilder(config));

    // 7) Montagem final do prompt
    const finalPrompt = parts.join('\n\n');
    
    // Log para debug (preview do prompt gerado)
    const preview = finalPrompt.length > 1500 ? `${finalPrompt.slice(0, 1500)}...` : finalPrompt;
    logger.debug('[PromptBuilder.buildSystemPrompt] Generated prompt preview:', { preview });
    
    return finalPrompt;
  }

  /**
   * Constrói a seção de tools do System Prompt em formato otimizado para LLMs.
   * 
   * Método privado que converte ToolSchema[] para uma seção formatada do prompt,
   * incluindo descrições das tools e schemas de parâmetros em formato SAP
   * (Schema as Protocol) para otimizar a comunicação com modelos de linguagem.
   * 
   * @param tools Array de ToolSchema a serem incluídas no prompt.
   * Se vazio ou undefined, retorna seção indicando ausência de tools.
   * 
   * @returns String formatada contendo a seção de tools do prompt.
   * 
   * @remarks
   * - Tools sem parâmetros úteis são automaticamente filtradas
   * - Schemas são convertidos para formato SAP automaticamente
   * - Fallbacks são fornecidos para tools com geração de schema falha
   * - Formatação otimizada para legibilidade por LLMs
   * 
   * @example
   * ```typescript
   * const tools = [
   *   {
   *     name: 'search',
   *     description: 'Busca informações na web',
   *     parameterSchema: 'class SearchParams = { query: string, limit?: number }'
   *   }
   * ];
   * 
   * const toolsSection = PromptBuilder.buildToolsPrompt(tools);
   * // Retorna seção formatada com tool description e schema
   * ```
   */
  private static buildToolsPrompt(tools?: ToolSchema[]): string {
    // Early Return: Retorna prompt sem tools se a lista estiver vazia
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
   * Determina o systemPrompt a partir de diferentes fontes de entrada.
   * 
   * Função utilitária que centraliza a lógica de decisão sobre qual fonte
   * de prompt usar, oferecendo flexibilidade para diferentes padrões de uso
   * e permitindo fallback entre diferentes métodos de especificação de prompt.
   * 
   * @param args Objeto contendo diferentes opções de especificação de prompt:
   * - `promptConfig`: Configuração completa do PromptBuilder (prioridade mais alta)
   * - `systemPrompt`: String de prompt pré-construído (prioridade média)
   * - `mode` + `agentInfo`: Construção dinâmica (prioridade mais baixa)
   * 
   * @returns Objeto contendo:
   * - `systemPrompt`: String do prompt final
   * - `source`: Identificador da fonte utilizada
   * 
   * @throws {Error} Se nenhuma fonte válida for fornecida
   * 
   * @example
   * ```typescript
   * // Usando configuração completa
   * const result1 = PromptBuilder.determineSystemPrompt({
   *   promptConfig: { mode: 'chat', agentInfo: {...} }
   * });
   * 
   * // Usando prompt pré-construído
   * const result2 = PromptBuilder.determineSystemPrompt({
   *   systemPrompt: 'Você é um assistente útil...'
   * });
   * 
   * // Usando construção dinâmica
   * const result3 = PromptBuilder.determineSystemPrompt({
   *   mode: 'react',
   *   agentInfo: { name: 'Bot', goal: 'Ajudar', backstory: '...' },
   *   additionalInstructions: 'Seja gentil',
   *   toolNames: ['search']
   * });
   * ```
   * 
   * @remarks
   * - Prioridade: promptConfig > systemPrompt > mode+agentInfo
   * - Útil para APIs que aceitam múltiplos formatos de entrada
   * - Facilita migração de prompts antigos para novo sistema
   * - Retorna source para logging e debugging
   * 
   * @see {@link buildSystemPrompt} Para construção com configuração
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

    // Prioridade 1: Configuração completa do PromptBuilder
    if (args.promptConfig) {
      return {
        systemPrompt: PromptBuilder.buildSystemPrompt(args.promptConfig),
        source: 'promptConfig'
      };
    }

    // Prioridade 2: Prompt pré-construído
    if (args.systemPrompt) {
      return { systemPrompt: args.systemPrompt, source: 'systemPrompt' };
    }

    // Prioridade 3: Construção dinâmica com mode + agentInfo
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

    // Nenhuma fonte válida fornecida
    throw new Error('Deve fornecer promptConfig, systemPrompt, ou mode+agentInfo');
  }

  /**
   * Constrói a seção de Task List do System Prompt.
   * 
   * Método privado que formata uma lista de tarefas em uma seção legível
   * do prompt, permitindo que agentes acompanhem o progresso de workflows
   * ou processos multi-step diretamente no contexto da conversa.
   * 
   * @param taskList Objeto contendo array de itens de tarefa.
   * Se vazio, undefined ou inválido, retorna string vazia.
   * 
   * @returns String formatada contendo a seção de Task List do prompt,
   * ou string vazia se não houver tarefas para exibir.
   * 
   * @example
   * ```typescript
   * const taskList = {
   *   items: [
   *     { id: '1', title: 'Analisar requisitos', status: 'completed' },
   *     { id: '2', title: 'Implementar solução', status: 'in_progress' },
   *     { id: '3', title: 'Testar implementação', status: 'pending' }
   *   ]
   * };
   * 
   * const taskListSection = PromptBuilder.buildTaskListPrompt(taskList);
   * // Retorna:
   * // "\n---\n\n## Task List\n\n- [completed] Analisar requisitos (id: 1)\n- [in_progress] Implementar solução (id: 2)\n- [pending] Testar implementação (id: 3)"
   * ```
   * 
   * @remarks
   * - Formato: `- [status] title (id: id)`
   * - Status suportados: 'pending', 'in_progress', 'completed'
   * - Útil para agentes que gerenciam workflows
   * - Permite acompanhamento visual do progresso
   * 
   * @see {@link PromptBuilderConfig.taskList} Para formato da task list
   */
  private static buildTaskListPrompt(taskList?: { items: Array<{ id: string; title: string; status: 'pending' | 'in_progress' | 'completed' }> }): string {
    // Validação: deve ter items válidos
    if (!taskList || !Array.isArray(taskList.items) || taskList.items.length === 0) {
      return '';
    }
    
    // Formatar cada item da tarefa
    const lines = taskList.items
      .map((t) => `- [${t.status}] ${t.title} (id: ${t.id})`)
      .join('\n');
      
    return `\n---\n\n## Task List\n\n${lines}`;
  }
}
