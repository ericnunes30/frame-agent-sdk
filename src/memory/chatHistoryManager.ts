// src/memory/chatHistoryManager.ts
import { Message, ITokenizerService, IChatHistoryManager, ChatHistoryConfig } from './memory.interface';

/**
 * Gerenciador de Histórico de Chat (Memória Processual).
 * Responsável por armazenar o histórico de mensagens e aplicar o truncamento
 * baseado em tokens antes de enviar ao LLM, garantindo que o contexto caiba na janela.
 */
export class ChatHistoryManager implements IChatHistoryManager {
    
    // O histórico de mensagens, mantido em ordem cronológica
    private history: Message[] = [];
    
    // O limite máximo de tokens para o contexto total
    private maxContextTokens: number;
    
    // O serviço injetado para calcular o custo em tokens
    private tokenizer: ITokenizerService;

    /**
     * @param config.maxContextTokens O limite de tokens do modelo (ex: 8192).
     * @param config.tokenizer A instância do TokenizerService.
     */
    constructor(config: ChatHistoryConfig) {
        this.maxContextTokens = config.maxContextTokens;
        this.tokenizer = config.tokenizer;
    }

    /**
     * Adiciona o System Prompt. Deve ser a primeira mensagem.
     * Usa um Guard Clause/Early Return para remover o 'else'.
     * @param prompt O texto do System Prompt.
     */
    public addSystemPrompt(prompt: string): void {
        const systemMessage: Message = { role: 'system', content: prompt };
        
        // Verifica se o System Prompt já está presente na primeira posição.
        const isSystemPromptPresent = this.history.length > 0 && this.history[0].role === 'system';

        // Usa Guard Clause: se já existe, substitui e retorna (Early Exit).
        if (isSystemPromptPresent) {
            this.history[0] = systemMessage;
            return; 
        }

        // Ação primária: insere no início.
        this.history.unshift(systemMessage);
    }

    /**
     * Adiciona uma mensagem ao histórico.
     * @param message A mensagem a ser adicionada.
     */
    public addMessage(message: Message): void {
        this.history.push(message);
    }

    /**
     * Limpa todo o histórico de mensagens, preservando apenas o System Prompt, se existir.
     */
    public clearHistory(): void {
        // Obtém o System Prompt usando ternário para evitar nesting (o 'else' não existe aqui).
        const systemPrompt = this.history.length > 0 && this.history[0].role === 'system' 
            ? this.history[0] 
            : null;
        
        this.history = [];
        
        // Adiciona o System Prompt de volta, se ele existia.
        if (systemPrompt) {
            this.history.push(systemPrompt);
        }
    }

    /**
     * Retorna o histórico de mensagens, aplicando a lógica de truncamento baseada em tokens.
     * Regra de Preservação: System Prompt (primeira) e a última mensagem (user input atual) são protegidos.
     * @param model O modelo que será usado para a requisição.
     * @returns O array de mensagens truncado.
     */
    public getTrimmedHistory(): Message[] {
        // Early Return: Se o histórico estiver vazio ou só tiver o system prompt, não há o que truncar.
        if (this.history.length <= 2) {
            return [...this.history];
        }

        // Clonar o histórico para manipulação
        let trimmedHistory = [...this.history];
        
        // Índice da primeira mensagem que pode ser truncada (depois do System Prompt)
        const firstMutableIndex = trimmedHistory[0].role === 'system' ? 1 : 0;
        
        // Índice da última mensagem, que é protegida (o input atual do usuário)
        const lastProtectedIndex = trimmedHistory.length - 1;

        // Loop principal de truncamento
        while (this.tokenizer.countTokens(trimmedHistory) > this.maxContextTokens) {
            
            const removableIndex = firstMutableIndex;
            
            // Guard Clause ESSENCIAL: Impede o truncamento de mensagens protegidas e evita loop infinito.
            if (removableIndex >= lastProtectedIndex) {
                console.warn("ALERTA DE CONTEXTO: O System Prompt e a última mensagem excedem o limite de tokens.");
                break;
            }

            // Remove a mensagem mais antiga e mutável (o miolo da conversa)
            trimmedHistory.splice(removableIndex, 1);
        }

        return trimmedHistory;
    }

    /**
     * Calcula o orçamento de tokens restante considerando o histórico atual.
     */
    public getRemainingBudget(): number {
        const used = this.tokenizer.countTokens(this.history);
        return Math.max(0, this.maxContextTokens - used);
    }
}
