// src/tools/toolBase.ts
import { ITool, IToolParams } from '../core/interfaces';

/**
 * Classe base abstrata para todas as ferramentas.
 * Implementa o contrato ITool e define a estrutura fundamental para
 * o Schema Aligned Parsing (SAP).
 * @template TParams O tipo da CLASSE de parâmetros de entrada.
 * @template TReturn O tipo do valor de retorno do método execute.
 */
export abstract class ToolBase<TParams extends IToolParams = IToolParams, TReturn = unknown> 
  implements ITool<TParams, TReturn> 
{
  /** Nome único da ferramenta, usado pelo LLM na chamada de função. */
  public abstract readonly name: string;

  /** Descrição detalhada para o LLM, explicando quando e como usar a ferramenta. */
  public abstract readonly description: string;
  
  /** * Referência à classe ou tipo TypeScript que define os parâmetros esperados.
   * Este é o coração do SAP, pois este tipo será usado para gerar o schema.
   */
  public abstract readonly parameterSchema: unknown; 

  /**
   * O método onde a lógica de negócio da ferramenta reside.
   * @param params Os parâmetros de entrada, já validados e tipados pelo SAP Parser/Executor.
   * @returns Uma Promise com o resultado da execução (a Observação do Agente).
   */
  public abstract execute(params: TParams): Promise<TReturn>;
}
/**
 * Classe base para implementação de ferramentas.
 * Padroniza nome, descrição e schema de parâmetros.
 */
