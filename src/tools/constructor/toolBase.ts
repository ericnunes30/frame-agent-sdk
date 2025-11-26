// src/tools/toolBase.ts
import { ITool, IToolParams } from '@/tools/core/interfaces';

/**
 * Classe base abstrata para implementação de ferramentas no sistema.
 * 
 * Esta classe implementa o contrato ITool e define a estrutura fundamental
 * para o Schema Aligned Parsing (SAP), fornecendo uma base padronizada
 * para todas as ferramentas do sistema de agentes de IA.
 * 
 * ## Características Principais
 * 
 * - **Abstração Completa**: Define interface mínima para ferramentas
 * - **Schema Aligned Parsing (SAP)**: Integração com sistema de validação de schemas
 * - **Tipagem Forte**: Suporte a generics para parâmetros e retorno
 * - **Contrato Padronizado**: Nome, descrição e schema obrigatórios
 * - **Execução Assíncrona**: Todos os métodos de execução são async
 * 
 * ## Arquitetura SAP (Schema Aligned Parsing)
 * 
 * O SAP é o coração do sistema de ferramentas, permitindo que:
 * - LLMs chamem ferramentas com parâmetros estruturados
 * - Parâmetros sejam validados automaticamente contra schemas
 * - Resultados sejam normalizados e tipados
 * - Erros sejam tratados de forma consistente
 * 
 * ## Template Parameters
 * 
 * - **TParams**: Classe TypeScript que define os parâmetros de entrada
 * - **TReturn**: Tipo do valor retornado pelo método execute
 * 
 * @template TParams Classe de parâmetros de entrada (deve implementar IToolParams)
 * @template TReturn Tipo do valor de retorno do método execute
 * 
 * @example
 * ```typescript
 * // Implementação básica de ferramenta
 * class CalculatorTool extends ToolBase<CalculatorParams, number> {
 *   public readonly name = 'calculator';
 *   public readonly description = 'Realiza operações matemáticas básicas';
 *   public readonly parameterSchema = CalculatorParams;
 * 
 *   public async execute(params: CalculatorParams): Promise<number> {
 *     switch (params.operation) {
 *       case 'add': return params.a + params.b;
 *       case 'subtract': return params.a - params.b;
 *       default: throw new Error('Operação não suportada');
 *     }
 *   }
 * }
 * 
 * // Uso da ferramenta
 * const tool = new CalculatorTool();
 * const result = await tool.execute({
 *   operation: 'add',
 *   a: 10,
 *   b: 5
 * });
 * console.log(result); // 15
 * ```
 * 
 * @example
 * ```typescript
 * // Ferramenta com retorno estruturado
 * class SearchTool extends ToolBase<SearchParams, SearchResult> {
 *   public readonly name = 'search';
 *   public readonly description = 'Busca informações em bases de dados';
 *   public readonly parameterSchema = SearchParams;
 * 
 *   public async execute(params: SearchParams): Promise<SearchResult> {
 *     const results = await this.performSearch(params.query);
 *     return {
 *       query: params.query,
 *       results: results,
 *       timestamp: new Date().toISOString()
 *     };
 *   }
 * }
 * ```
 * 
 * @see {@link ITool} Para interface completa da ferramenta
 * @see {@link IToolParams} Para estrutura de parâmetros
 * @see {@link toolRegistry} Para registro e descoberta de ferramentas
 */
export abstract class ToolBase<TParams extends IToolParams = IToolParams, TReturn = unknown>
  implements ITool<TParams, TReturn> {
  /**
   * Nome único da ferramenta no sistema.
   * 
   * Este nome é usado pelo LLM para identificar e chamar a ferramenta.
   * Deve ser único em todo o sistema e seguir convenções de nomenclatura
   * claras (snake_case recomendado).
   */
  public abstract readonly name: string;

  /**
   * Descrição detalhada da funcionalidade da ferramenta.
   * 
   * Esta descrição é fornecida ao LLM para ajudá-lo a entender quando
   * e como usar a ferramenta. Deve ser clara, específica e incluir
   * informações sobre parâmetros e casos de uso.
   */
  public abstract readonly description: string;

  /**
   * Referência à classe TypeScript que define os parâmetros esperados.
   * 
   * Este é o coração do sistema SAP (Schema Aligned Parsing). A classe
   * referenciada deve ter uma propriedade estática `schemaProperties` que
   * define o schema de validação dos parâmetros.
   * 
   * O schema é usado para:
   * - Validar parâmetros fornecidos pelo LLM
   * - Gerar documentação automática
   * - Fornecer feedback de erro estruturado
   * - Tipar parâmetros no método execute
   */
  public abstract readonly parameterSchema: unknown;

  /**
   * Método de execução da lógica de negócio da ferramenta.
   * 
   * Este método contém toda a lógica específica da ferramenta e é
   * chamado pelo ToolExecutor após validação bem-sucedida dos parâmetros.
   * 
   * @param params Parâmetros de entrada, já validados e tipados pelo SAP.
   * Os parâmetros já passaram pela validação de schema e estão no tipo TParams.
   * 
   * @returns Promise com o resultado da execução.
   * O tipo de retorno é definido pelo template TReturn.
   * 
   * @example
   * ```typescript
   * class DataProcessorTool extends ToolBase<ProcessorParams, ProcessingResult> {
   *   public readonly name = 'process_data';
   *   public readonly description = 'Processa dados de entrada';
   *   public readonly parameterSchema = ProcessorParams;
   * 
   *   public async execute(params: ProcessorParams): Promise<ProcessingResult> {
   *     // Lógica de processamento
   *     const processed = await this.transformData(params.data);
   *     
   *     return {
   *       success: true,
   *       output: processed,
 *       metadata: {
   *         processedAt: new Date().toISOString(),
   *         inputSize: params.data.length
   *       }
   *     };
   *   }
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // Tratamento de erro em ferramentas
   * class FileReaderTool extends ToolBase<FileReaderParams, string> {
   *   public async execute(params: FileReaderParams): Promise<string> {
   *     try {
   *       const content = await fs.readFile(params.filePath, 'utf-8');
   *       return content;
   *     } catch (error) {
   *       throw new Error(`Erro ao ler arquivo ${params.filePath}: ${error.message}`);
   *     }
   *   }
   * }
   * ```
   */
  public abstract execute(params: TParams): Promise<TReturn>;
}
