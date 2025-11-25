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
        console.log(`[ChatHistoryManager] ChatHistoryManager created with maxContextTokens: ${this.maxContextTokens}`);
    }

    /**
     * Adiciona o System Prompt. Deve ser a primeira mensagem.
     * Usa um Guard Clause/Early Return para remover o 'else'.
     * @param prompt O texto do System Prompt.
     */
    public addSystemPrompt(prompt: string): void {
        console.log(`Adding system prompt`, 'ChatHistoryManager');
        const systemMessage: Message = { role: 'system', content: prompt };

        // Verifica se o System Prompt já está presente na primeira posição.
        const hasHistory = this.history.length > 0;
        const isFirstMessageSystem = hasHistory && this.history[0].role === 'system';

        // Usa Guard Clause: se já existe, substitui e retorna (Early Exit).
        if (isFirstMessageSystem) {
            console.log(`System prompt already exists, replacing it`, 'ChatHistoryManager');
            this.history[0] = systemMessage;
            return;
        }

        // Ação primária: insere no início.
        this.history.unshift(systemMessage);
        console.log(`System prompt added to history`, 'ChatHistoryManager');
    }

    /**
     * Adiciona uma mensagem ao histórico.
     * @param message A mensagem a ser adicionada.
     */
    public addMessage(message: Message): void {
        console.log(`Adding message with role: ${message.role}`, 'ChatHistoryManager');
        this.history.push(message);
    }

    /**
     * Limpa todo o histórico de mensagens, preservando apenas o System Prompt, se existir.
     */
    public clearHistory(): void {
        console.log(`Clearing chat history`, 'ChatHistoryManager');
        // Obtém o System Prompt usando validações lineares.
        const hasHistory = this.history.length > 0;
        const hasSystemPrompt = hasHistory && this.history[0].role === 'system';
        const systemPrompt = hasSystemPrompt ? this.history[0] : null;

        this.history = [];

        // Adiciona o System Prompt de volta, se ele existia.
        if (systemPrompt) {
            this.history.push(systemPrompt);
            console.log(`System prompt preserved during history clear`, 'ChatHistoryManager');
        }
    }

    /**
     * Retorna o histórico de mensagens, aplicando a lógica de truncamento baseada em tokens.
     * Regra de Preservação: System Prompt (primeira) e a última mensagem (user input atual) são protegidos.
     * @param model O modelo que será usado para a requisição.
     * @returns O array de mensagens truncado.
     */
    public getTrimmedHistory(): Message[] {
        console.log(`Getting trimmed history`, 'ChatHistoryManager');
        // Early Return: Se o histórico estiver vazio ou só tiver o system prompt, não há o que truncar.
        if (this.history.length <= 2) {
            console.log(`History has 2 or fewer messages, returning as is`, 'ChatHistoryManager');
            return [...this.history];
        }

        // Clonar o histórico para manipulação
        let trimmedHistory = [...this.history];

        // Índice da primeira mensagem que pode ser truncada (depois do System Prompt)
        const firstMutableIndex = trimmedHistory[0].role === 'system' ? 1 : 0;

        // Loop principal de truncamento
        while (this.tokenizer.countTokens(trimmedHistory) > this.maxContextTokens) {

            const removableIndex = firstMutableIndex;

            // Recalcula o índice da última mensagem protegida a cada iteração
            // (o array diminui conforme mensagens são removidas)
            const lastProtectedIndex = trimmedHistory.length - 1;

            // Guard Clause ESSENCIAL: Impede o truncamento de mensagens protegidas e evita loop infinito.
            // Garante que System Prompt e última mensagem do usuário sejam sempre preservados.
            if (removableIndex >= lastProtectedIndex) {
                console.warn("ALERTA DE CONTEXTO: O System Prompt e a última mensagem excedem o limite de tokens.", 'ChatHistoryManager');
                break;
            }

            // Remove a mensagem mais antiga e mutável (o miolo da conversa)
            trimmedHistory.splice(removableIndex, 1);
        }

        console.log(`Trimmed history to ${trimmedHistory.length} messages`, 'ChatHistoryManager');
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
