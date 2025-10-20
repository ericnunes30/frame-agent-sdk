// src/tools/searchTool.ts
import { IToolParams } from '../core/interfaces';
import { ToolBase } from '../constructor/toolBase';

/**
 * 1. Definição da Classe de Parâmetros de Entrada (Schema Aligned)
 * Esta classe é referenciada em parameterSchema e deve ser a fonte da verdade para o parsing.
 * * CORREÇÃO TS2564: O operador '!' (asserção de atribuição definitiva) é usado para indicar 
 * que as propriedades serão atribuídas pelo SAP Parser em runtime.
 */
export class SearchParams implements IToolParams {
    public query!: string;
    public maxResults!: number;
    
    // Propriedade estática para simular o schema (usada pelo schemaGenerator.ts)
    static schemaProperties = {
        query: { type: 'string', required: true, minLength: 1 },
        // optional via required: false; also enforce range 1..10
        maxResults: { type: 'number', required: false, min: 1, max: 10 },
    };
}

/**
 * 2. Implementação da Tool Concreta
 * Esta tool usa a SearchParams como seu contrato de entrada (TParams).
 */
export class SearchTool extends ToolBase<SearchParams, string> {
    public readonly name = 'search';
    public readonly description = 'Use esta ferramenta para buscar informações na internet sobre qualquer tópico.';
    public readonly parameterSchema = SearchParams; // Referência à classe de parâmetros
    
    /**
     * Lógica de negócio da ferramenta.
     */
    public async execute(params: SearchParams): Promise<string> {
        // Implementação real da chamada de API (ex: Google Search) ou lógica de negócio
        console.log(`Executando busca por: "${params.query}" (Max: ${params.maxResults})`);
        
        return `Observação: Resultados da busca para "${params.query}" (limitados a ${params.maxResults}) foram obtidos.`;
    }
}
/**
 * Exemplo de ferramenta de busca (mock para testes).
 * Demonstra como expor parâmetros e retorno para o LLM via SAP.
 */
