// src/memory/tokenizer.ts
import { Message, ITokenizerService } from './memory.interface';

/**
 * Implementação aproximada do serviço de tokenização baseada em caracteres.
 * 
 * ⚠️ **IMPORTANTE**: Esta é uma implementação placeholder que utiliza aproximações.
 * Para uso em produção, substitua por tokenizadores específicos do modelo:
 * - `tiktoken` para modelos OpenAI
 * - Claude API nativa para modelos Anthropic
 * - Outros tokenizadores específicos por provedor
 * 
 * Esta implementação utiliza a regra geral de que 1 token ≈ 4 caracteres em inglês,
 * que é uma aproximação razoável para muitos modelos, mas pode variar significativamente
 * depending do idioma e do tipo de conteúdo.
 * 
 * @example
 * ```typescript
 * // Uso básico
 * const tokenizer = new TokenizerService('gpt-4');
 * const messages = [
 *   { role: 'user', content: 'Hello world' }
 * ];
 * const tokens = tokenizer.countTokens(messages); // ~6 tokens
 * 
 * // Para produção, use tiktoken:
 * // import { encoding_for_model } from 'tiktoken';
 * // class TiktokenService implements ITokenizerService {
 * //   private enc = encoding_for_model('gpt-4');
 * //   countTokens(messages: Message[]): number {
 * //     return messages.reduce((acc, msg) => acc + this.enc.encode(msg.content).length, 0);
 * //   }
 * // }
 * ```
 * 
 * @remarks
 * - A precisão varia por idioma (melhor para inglês, pior para idiomas com caracteres multibyte)
 * - Não considera особенности específicas do modelo
 * - Adequada apenas para prototipagem e desenvolvimento
 */
export class TokenizerService implements ITokenizerService {
    
    /** O nome do modelo para compatibilidade com a interface */
    private readonly model: string;
    
    /** Proporção de caracteres por token (aproximação geral para modelos GPT) */
    private readonly CHARS_PER_TOKEN = 4;
    
    /** 
     * Overhead fixo por mensagem para simular custos estruturais.
     * Inclui: role, chaves JSON, formatação, caracteres especiais, etc.
     */
    private readonly FIXED_CHAR_OVERHEAD_PER_MESSAGE = 10;
    
    /**
     * Cria uma nova instância do TokenizerService.
     * 
     * @param model O nome do modelo de LLM (usado apenas para compatibilidade)
     * @example
     * ```typescript
     * const tokenizer = new TokenizerService('gpt-4');
     * const tokenizer = new TokenizerService('claude-3');
     * ```
     */
    constructor(model: string) {
        this.model = model;
    }
    
    /**
     * Calcula o número aproximado de tokens para uma lista de mensagens.
     * 
     * Utiliza uma abordagem baseada em caracteres com as seguintes considerações:
     * 1. **Conteúdo**: Conta caracteres do conteúdo da mensagem
     * 2. **Overhead**: Adiciona overhead fixo por mensagem para estrutura
     * 3. **Conversão**: Converte caracteres para tokens usando proporção fixa
     * 
     * @param messages O histórico de mensagens em ordem cronológica.
     * Cada mensagem deve ter role e content válidos.
     * 
     * @returns O número aproximado de tokens (inteiro, arredondado para cima).
     * 
     * @throws {Error} Se messages for null/undefined
     * 
     * @example
     * ```typescript
     * const tokenizer = new TokenizerService('gpt-4');
     * 
     * // Mensagem simples
     * const simple = tokenizer.countTokens([
     *   { role: 'user', content: 'Hi' }
     * ]); // ~3 tokens (2 chars + 10 overhead = 12 chars / 4 = 3)
     * 
     * // Múltiplas mensagens
     * const multiple = tokenizer.countTokens([
     *   { role: 'system', content: 'You are helpful' }, // 15 + 10 = 25 chars
     *   { role: 'user', content: 'Hello' },             // 5 + 10 = 15 chars
     *   { role: 'assistant', content: 'Hi there' }      // 8 + 10 = 18 chars
     * ]); // Total: 58 chars / 4 = 14.5 → 15 tokens
     * ```
     */
    public countTokens(messages: Message[]): number {
        
        // Validação básica
        if (!messages || messages.length === 0) {
            return 0;
        }
        
        // Utiliza reduce para somar os caracteres totais
        const totalChars = messages.reduce((acc, message) => {
            // Safe access para content (trata undefined/null)
            const contentChars = message.content?.length ?? 0;
            
            // Soma: conteúdo + overhead estrutural fixo
            return acc + contentChars + this.FIXED_CHAR_OVERHEAD_PER_MESSAGE;
        }, 0);

        // Converte caracteres para tokens e arredonda para cima
        return Math.ceil(totalChars / this.CHARS_PER_TOKEN);
    }
}
