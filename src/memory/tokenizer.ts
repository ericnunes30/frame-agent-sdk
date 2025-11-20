// src/memory/tokenizer.ts
import { Message, ITokenizerService } from './memory.interface';

/**
 * IMPLEMENTAÇÃO PLACEHOLDER: Esta classe simula o comportamento de um tokenizador
 * contando caracteres, onde 1 token é aproximadamente 4 caracteres.
 * * TODO: SUBSTITUIR ESTA CLASSE PELA IMPLEMENTAÇÃO REAL (ex: usando a biblioteca 'tiktoken').
 */
export class TokenizerService implements ITokenizerService {
    
    private readonly model: string;
    // Proporção de tokens (aproximação comum)
    private readonly CHARS_PER_TOKEN = 4;
    // Buffer fixo para simular o custo estrutural de cada mensagem (role, chaves, JSON, etc.)
    private readonly FIXED_CHAR_OVERHEAD_PER_MESSAGE = 10;
    
    constructor(model: string) {
        this.model = model;
    }
    
    /**
     * Retorna o número de tokens com base em uma proporção de caracteres,
     * utilizando 'reduce' para evitar aninhamento de ganchos lógicos.
     * @param messages O histórico de mensagens.
     * @param model O nome do modelo. Usado apenas para fins de compatibilidade com a interface.
     */
    public countTokens(messages: Message[]): number {
        
        // Usa reduce para somar os caracteres, eliminando o loop 'for' e o 'if' aninhado.
        const totalChars = messages.reduce((acc, message) => {
            // Obtém o comprimento do conteúdo com safe access (?? 0), evitando o 'if'
            const contentChars = message.content?.length ?? 0;

            // Retorna o acumulador somado ao conteúdo e ao overhead fixo.
            return acc + contentChars + this.FIXED_CHAR_OVERHEAD_PER_MESSAGE;
        }, 0);

        // Calcula os tokens (arredondando para cima)
        return Math.ceil(totalChars / this.CHARS_PER_TOKEN);
    }
}
