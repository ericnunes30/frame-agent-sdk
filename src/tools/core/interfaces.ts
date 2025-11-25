// src/tools/core/interfaces.ts

/**
 * Interface vazia para servir como o tipo base para todas as classes de parâmetros de ferramentas.
 */
export interface IToolParams { }

/**
 * Resultado estruturado de uma execução de tool.
 * Permite que tools retornem observação + metadados opcionais.
 * @template TMetadata O tipo customizado de metadata. Default: Record<string, unknown>
 */
export interface IToolResult<TMetadata = Record<string, unknown>> {
  /**
   * A observação/resposta principal da tool (o que será mostrado como resultado)
   */
  observation: unknown;

  /**
   * Metadados opcionais que serão mergeados ao state.metadata do grafo
   * Útil para tools que precisam atualizar estado (ex: taskList)
   */
  metadata?: TMetadata;
}

/**
 * O contrato principal para a definição de uma ferramenta (SAP).
 * @template TParams O tipo da CLASSE de parâmetros de entrada.
 * @template TReturn O tipo do valor de retorno do método execute.
 * 
 * Tools podem retornar:
 * - Um valor simples (string, object, etc) - apenas observação
 * - Um IToolResult<TMetadata> - observação + metadata tipado para atualizar state
 */
export interface ITool<TParams extends IToolParams = IToolParams, TReturn = unknown> {
  name: string;
  description: string;
  readonly parameterSchema: unknown;
  execute(params: TParams): Promise<TReturn>;
}

/**
 * Estrutura de dados que o SAP Parser devolve, representando a ação a ser executada.
 * Esta é a entrada tipada para o ToolExecutor.
 */
export interface IToolCall {
  toolName: string;
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
