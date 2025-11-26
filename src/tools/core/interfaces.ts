// src/tools/core/interfaces.ts

/**
 * Interface vazia que serve como base para todas as classes de parâmetros de ferramentas.
 * 
 * Esta interface atua como um marcador de tipo para garantir que todas as classes
 * de parâmetros implementem uma estrutura comum. Classes de parâmetros devem
 * extender esta interface para serem compatíveis com o sistema de ferramentas.
 * 
 * @example
 * ```typescript
 * // Classe de parâmetros válida
 * export class CalculatorParams implements IToolParams {
 *   operation!: 'add' | 'subtract' | 'multiply' | 'divide';
 *   a!: number;
 *   b!: number;
 * }
 * 
 * // Uso em ferramenta
 * export class CalculatorTool extends ToolBase<CalculatorParams> {
 *   public readonly name = 'calculator';
 *   public readonly parameterSchema = CalculatorParams;
 * }
 * ```
 * 
 * @remarks
 * - Interface vazia serve apenas para tipagem
 * - Classes de parâmetros devem implementar propriedades específicas
 * - Usada como constraint genérico em ITool
 * 
 * @see {@link ITool} Para interface principal de ferramentas
 * @see {@link ToolBase} Para classe base de ferramentas
 */
export interface IToolParams { }

/** 
 * Resultado estruturado de uma execução de ferramenta.
 * 
 * Permite que ferramentas retornem tanto a observação principal quanto
 * metadados opcionais que podem ser usados para atualizar o estado
 * do agente ou grafo de execução.
 * 
 * @template TMetadata O tipo customizado de metadados. Default: Record<string, unknown>
 * 
 * @example
 * ```typescript
 * // Resultado simples
 * const simpleResult: IToolResult = {
 *   observation: 'Operação concluída com sucesso'
 * };
 * 
 * // Resultado com metadados
 * interface CalculatorMetadata {
 *   result: number;
 *   operation: string;
 *   timestamp: number;
 * }
 * 
 * const complexResult: IToolResult<CalculatorMetadata> = {
 *   observation: 'Resultado: 15',
 *   metadata: {
 *     result: 15,
 *     operation: 'add',
 *     timestamp: Date.now()
 *   }
 * };
 * ```
 * 
 * @remarks
 * - `observation` é sempre obrigatória e contém o resultado principal
 * - `metadata` é opcional e pode ser usada para atualizar estado
 * - Metadados são mergeados ao state.metadata do grafo
 * - Útil para ferramentas que gerenciam estado (ex: todo_list)
 * 
 * @see {@link ToolExecutor} Para execução de ferramentas
 * @see {@link ToolBase} Para implementação de ferramentas
 */
export interface IToolResult<TMetadata = Record<string, unknown>> {
  /** 
   * A observação/resposta principal da ferramenta.
   * Este é o valor que será mostrado como resultado da execução.
   * Pode ser string, number, object, array, etc.
   */
  observation: unknown;

  /** 
   * Metadados opcionais que serão mergeados ao state.metadata do grafo.
   * 
   * Útil para ferramentas que precisam atualizar estado persistente,
   * como listas de tarefas, histórico de operações, configurações, etc.
   * 
   * @example
   * ```typescript
   * // Para TodoListTool
   * metadata: {
   *   taskList: {
   *     items: [
   *       { id: '1', title: 'Task 1', status: 'pending' }
   *     ]
   *   }
   * }
   * 
   * // Para CalculatorTool
   * metadata: {
   *   calculationHistory: [10, 15, 20],
   *   lastOperation: 'add'
   * }
   * ```
   */
  metadata?: TMetadata;
}

/** 
 * O contrato principal para a definição de uma ferramenta (Schema Aligned Parsing).
 * 
 * Esta interface define o contrato que todas as ferramentas devem implementar
 * para serem compatíveis com o sistema de ferramentas do framework.
 * 
 * @template TParams O tipo da CLASSE de parâmetros de entrada. Default: IToolParams
 * @template TReturn O tipo do valor de retorno do método execute. Default: unknown
 * 
 * ## Tipos de Retorno Suportados
 * 
 * Ferramentas podem retornar:
 * - **Valor simples** (string, number, object, etc.) - tratado como observation
 * - **IToolResult<TMetadata>** - observation + metadata tipado para atualizar state
 * 
 * @example
 * ```typescript
 * // Ferramenta com retorno simples
 * class SimpleTool implements ITool {
 *   name = 'simple_tool';
 *   description = 'Uma ferramenta simples';
 *   parameterSchema = SimpleParams;
 *   
 *   async execute(params: SimpleParams): Promise<string> {
 *     return 'Operação concluída';
 *   }
 * }
 * 
 * // Ferramenta com retorno estruturado
 * class ComplexTool implements ITool<ComplexParams, IToolResult<ComplexMetadata>> {
 *   name = 'complex_tool';
 *   description = 'Uma ferramenta complexa';
 *   parameterSchema = ComplexParams;
 *   
 *   async execute(params: ComplexParams): Promise<IToolResult<ComplexMetadata>> {
 *     return {
 *       observation: 'Operação concluída',
 *       metadata: {
 *         result: 'success',
 *         timestamp: Date.now()
 *       }
 *     };
 *   }
 * }
 * ```
 * 
 * @remarks
 * - `name` deve ser único no registry
 * - `description` é usada pelo PromptBuilder para gerar schemas
 * - `parameterSchema` é convertido automaticamente para formato LLM
 * - `execute` deve ser assíncrono para suportar operações I/O
 * 
 * @see {@link ToolBase} Para classe base que implementa esta interface
 * @see {@link ToolRegistry} Para registro e descoberta de ferramentas
 * @see {@link SchemaGenerator} Para conversão de schemas
 */
export interface ITool<TParams extends IToolParams = IToolParams, TReturn = unknown> {
  /** 
   * Nome único da ferramenta.
   * Usado para identificação no registry e chamadas pelo LLM.
   * Deve ser descritivo e único no sistema.
   */
  name: string;
  
  /** 
   * Descrição detalhada para o LLM.
   * Explica quando e como usar a ferramenta, quais parâmetros esperar,
   * e que tipo de resultado retornar.
   */
  description: string;
  
  /** 
   * Schema dos parâmetros em formato TypeScript ou descriptor.
   * 
   * Pode ser:
   * - Uma classe TypeScript que implementa IToolParams
   * - Um objeto descriptor com metadados de validação
   * - Uma string com schema customizado
   * 
   * Este schema é convertido automaticamente para formato legível por LLMs
   * pelo SchemaGenerator.
   */
  readonly parameterSchema: unknown;
  
  /** 
   * Método principal de execução da ferramenta.
   * 
   * @param params Parâmetros de entrada, já validados e tipados.
   * 
   * @returns Promise com o resultado da execução.
   * Pode ser valor simples ou IToolResult estruturado.
   * 
   * @throws {Error} Se houver erro durante a execução
   */
  execute(params: TParams): Promise<TReturn>;
}

/** 
 * Estrutura de dados que representa uma chamada de ferramenta.
 * 
 * Esta é a estrutura que o SAP Parser devolve e que serve como
 * entrada tipada para o ToolExecutor.
 * 
 * @example
 * ```typescript
 * // Chamada de ferramenta para calculadora
 * const toolCall: IToolCall = {
 *   toolName: 'calculator',
 *   params: {
 *     operation: 'add',
 *     a: 10,
 *     b: 5
 *   }
 * };
 * 
 * // Execução
 * const result = await ToolExecutor.execute(toolCall);
 * ```
 * 
 * @remarks
 * - `toolName` deve corresponder a uma ferramenta registrada
 * - `params` deve ser compatível com o parameterSchema da ferramenta
 * - Usada pelo ToolExecutor para localizar e executar ferramentas
 * 
 * @see {@link ToolExecutor} Para execução de chamadas
 * @see {@link ToolRegistry} Para descoberta de ferramentas
 */
export interface IToolCall {
  /** 
   * Nome da ferramenta a ser executada.
   * Deve corresponder ao `name` de uma ferramenta registrada no ToolRegistry.
   */
  toolName: string;
  
  /** 
   * Parâmetros para a execução da ferramenta.
   * Devem ser compatíveis com o parameterSchema da ferramenta especificada.
   */
  params: IToolParams;
}

// Validator-related shared interfaces (for class-based schema)
export type PropertyType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export interface PropertyDescriptor {
  type: PropertyType;
  required?: boolean; // default true
  enum?: Array<string | number | boolean>;
  min?: number; // for numbers
  max?: number; // for numbers
  minLength?: number; // for strings/arrays
  maxLength?: number; // for strings/arrays
  items?: PropertyType | PropertyDescriptor; // for arrays
}

export interface SchemaProperties {
  [key: string]: PropertyType | PropertyDescriptor;
}

export interface ToolValidationIssue {
  path: string;
  message: string;
  code: 'missing_required' | 'invalid_type' | 'invalid_enum' | 'out_of_range' | 'length_out_of_range';
}

export interface ToolValidationResult {
  valid: boolean;
  issues?: ToolValidationIssue[];
}
/**
 * Contratos de ferramentas e chamadas de ferramenta.
 * Fornecem base para registro/execução e validação.
 */
