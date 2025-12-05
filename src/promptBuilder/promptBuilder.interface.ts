/**
 * Informações essenciais do agente para compor o System Prompt.
 * 
 * Esta interface define os dados fundamentais que descrevem um agente de IA,
 * permitindo que o PromptBuilder construa prompts personalizados e contextualmente
 * relevantes para diferentes tipos de agentes.
 * 
 * @example
 * ```typescript
 * const agentInfo: AgentInfo = {
 *   name: 'Assistente de Programação',
 *   goal: 'Ajudar desenvolvedores com código limpo e boas práticas',
 *   backstory: 'Especialista em TypeScript e Node.js com 10 anos de experiência'
 * };
 * ```
 * 
 * @remarks
 * - O `name` é usado para identificação do agente no prompt
 * - O `goal` define o propósito principal e comportamento esperado
 * - O `backstory` fornece contexto histórico e especialização
 */
export interface AgentInfo {
  /** 
   * Nome do agente para identificação no System Prompt.
   * Deve ser descritivo e único para o tipo de agente.
   */
  name: string;
  
  /** 
   * Objetivo principal do agente.
   * Define o que o agente deve fazer e como deve se comportar.
   */
  goal: string;
  
  /** 
   * Contexto histórico e background do agente.
   * Inclui especializações, experiência e características relevantes.
   */
  backstory: string;
}

// Import da interface de tool
import type { ITool } from '@/tools/core/interfaces';
import type { ISkill } from '@/skills/skill.interface';

/** 
 * Schema de uma ferramenta para uso no System Prompt.
 * 
 * É um alias especializado para ITool, extraindo apenas os campos necessários
 * para a construção de prompts. Os schemas são convertidos para formato SAP
 * (Schema as Protocol) pelo PromptBuilder para otimizar a comunicação com LLMs.
 * 
 * @example
 * ```typescript
 * const toolSchema: ToolSchema = {
 *   name: 'search',
 *   description: 'Busca informações na web',
 *   parameterSchema: 'class SearchParams = { query: string, limit?: number }'
 * };
 * ```
 * 
 * @remarks
 * - `name`: Identificador único da ferramenta
 * - `description`: Explicação clara do propósito da ferramenta
 * - `parameterSchema`: Schema dos parâmetros em formato de classe
 * 
 * @see {@link PromptBuilder.buildToolsPrompt} Para conversão automática
 */
export type ToolSchema = Pick<ITool, 'name' | 'description' | 'parameterSchema'>;

/** 
 * Modos de prompt suportados pelo sistema.
 * 
 * Define os diferentes tipos de comportamento e estratégia de prompting
 * que podem ser aplicados aos agentes de IA.
 * 
 * @example
 * ```typescript
 * // Modo de conversa simples
 * const chatMode: PromptMode = 'chat';
 * 
 * // Modo de reasoning e action
 * const reactMode: PromptMode = 'react';
 * 
 * // Modo customizado
 * const customMode: PromptMode = 'code_reviewer';
 * ```
 * 
 * @remarks
 * - 'chat': Conversa simples e direta
 * - 'react': Reasoning e action com uso de tools
 * - string: Modos customizados registrados via `addPromptMode()`
 */
export type PromptMode = 'react' | 'chat' | string;

/** 
 * Configuração completa para construir o System Prompt via PromptBuilder.
 * 
 * Esta interface define todos os parâmetros necessários para que o PromptBuilder
 * possa gerar um System Prompt estruturado e otimizado para o agente especificado.
 * 
 * @example
 * ```typescript
 * const config: PromptBuilderConfig = {
 *   mode: 'react',
 *   agentInfo: {
 *     name: 'Assistente de Pesquisa',
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
 * };
 * 
 * const prompt = PromptBuilder.buildSystemPrompt(config);
 * ```
 */
export interface PromptBuilderConfig {
  /** 
   * O modo do agente a ser utilizado.
   * Define o tipo de comportamento e estratégia de prompting.
   * 
   * @example 'react', 'chat', 'code_reviewer'
   */
  mode: PromptMode;
  
  /** 
   * Informações essenciais do agente.
   * Define identidade, objetivo e contexto do agente.
   */
  agentInfo: AgentInfo;
  
  /** 
   * Instruções adicionais específicas para o agente.
   * São adicionadas como seção separada no System Prompt.
   * 
   * @optional
   * @example
   * ```
   * - Sempre forneça exemplos práticos
   * - Explique conceitos complexos de forma simples
   * - Use markdown para formatação de código
   * ```
   */
  additionalInstructions?: string;
  
  /** 
   * Tool schemas já formatadas para uso no prompt.
   * Usado quando as tools já estão no formato correto.
   * 
   * @optional
   * @remarks
   * - Use esta opção quando já possui ToolSchema[] formatadas
   * - Mutuamente exclusivo com `toolNames`
   * 
   * @see {@link ToolSchema} Para formato das tools
   */
  tools?: ToolSchema[];
  
  /** 
   * Nomes de tools registradas para conversão automática.
   * O PromptBuilder irá buscar e converter as tools automaticamente.
   * 
   * @optional
   * @remarks
   * - Requer que as tools estejam registradas no ToolRegistry
   * - Mutuamente exclusivo com `tools`
   * - Mais conveniente para uso direto com tools registradas
   * 
   * @example ['search', 'file_create', 'terminal']
   */
  toolNames?: string[];
  
  /** 
   * Lista de tarefas para acompanhamento no prompt.
   * Útil para agentes que gerenciam workflows ou processos multi-step.
   * 
   * @optional
   * @example
   * ```typescript
   * {
   *   items: [
   *     { id: '1', title: 'Analisar requisitos', status: 'completed' },
   *     { id: '2', title: 'Implementar solução', status: 'in_progress' },
   *     { id: '3', title: 'Testar implementação', status: 'pending' }
   *   ]
   * }
   * ```
   */
  taskList?: {
    /** Array de itens de tarefa com status de acompanhamento */
    items: Array<{
      /** Identificador único da tarefa */
      id: string;
      
      /** Título/descrição da tarefa */
      title: string;
      
      /** Status atual da tarefa */
      status: 'pending' | 'in_progress' | 'completed';
    }>
  };
  
  /** 
   * Skills ativas para esta execução.
   * Útil para fornecer contexto especializado dinamicamente.
   * 
   * @optional
   * @example
   * ```typescript
   * [{
   *   name: 'solid-principles',
   *   description: 'Princípios SOLID para desenvolvimento OOP',
   *   keywords: ['class', 'interface', 'solid', 'oop'],
   *   instructions: 'Siga os princípios SOLID...'
   * }]
   * ```
   */
  skills?: ISkill[];
}

