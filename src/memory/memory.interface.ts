// src/memory/memory.interface.ts

/**
 * Representa uma única mensagem na conversa, compatível com os Providers (ex: OpenAI).
 * As 'roles' esperadas são 'system', 'user', 'assistant' e 'tool'.
 */
export interface Message {
  role: string;
  content: string;
}

/**
 * Contrato para qualquer serviço que possa calcular o custo (em tokens)
 * de uma lista de mensagens. Isso permite desacoplar a lógica de contagem
 * de tokens (ex: tiktoken, Claude API) da lógica de gerenciamento de memória.
 */
export interface ITokenizerService {
    /**
     * Calcula o número total de tokens para uma lista de mensagens.
     * Observação: o modelo é configurado fora do módulo de memória (no serviço de tokenização).
     * @param messages O histórico de mensagens a ser analisado.
     * @returns O número total de tokens.
     */
    countTokens(messages: Message[]): number;
}

/**
 * Contrato para o Gerenciador de Histórico de Chat, responsável pela memória processual.
 */
export interface IChatHistoryManager {
    /**
     * Adiciona uma mensagem ao histórico de chat.
     * @param message A mensagem a ser adicionada.
     */
    addMessage(message: Message): void;

    /**
     * Adiciona uma mensagem de prompt do sistema (System Prompt), que é imunizada contra truncamento.
     * @param prompt O texto do System Prompt.
     */
    addSystemPrompt(prompt: string): void;

    /**
     * Retorna o histórico de mensagens, aplicando truncamento baseado em tokens.
     * Garante que não exceda 'maxContextTokens' e preserva o System Prompt e a última mensagem do usuário.
     * @returns O array de mensagens pronto para ser enviado ao LLM.
     */
    getTrimmedHistory(): Message[];

    /**
     * Retorna o orçamento de tokens restante com base no histórico atual.
     */
    getRemainingBudget(): number;

    /**
     * Limpa todo o histórico de mensagens.
     */
    clearHistory(): void;
}

/**
 * Configuração para o gerenciador de histórico baseada em tokens.
 * O desenvolvedor deve fornecer explicitamente o limite de tokens do contexto
 * e o serviço de tokenização compatível com o modelo.
 */
export interface ChatHistoryConfig {
  maxContextTokens: number;
  tokenizer: ITokenizerService;
}
