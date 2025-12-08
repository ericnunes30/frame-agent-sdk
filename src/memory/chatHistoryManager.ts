// src/memory/chatHistoryManager.ts
import { Message, ITokenizerService, IChatHistoryManager, ChatHistoryConfig } from './memory.interface';
import { logger } from '@/utils/logger';

/**
 * Gerenciador de Histórico de Chat (Memória Processual).
 * 
 * Esta classe é responsável por armazenar e gerenciar o histórico de mensagens
 * de conversas em agentes de IA, implementando um sistema inteligente de
 * truncamento baseado em tokens que garante que o contexto caiba dentro das
 * limitações dos modelos de linguagem.
 * 
 * ## Estratégia de Preservação
 * 
 * O gerenciador implementa uma estratégia de preservação que garante que:
 * 1. **System Prompt** (primeira mensagem) - sempre preservado
 * 2. **Última mensagem do usuário** - sempre preservada (contexto atual)
 * 3. **Histórico intermediário** - truncado do mais antigo para o mais novo
 * 
 * ## Algoritmo de Truncamento
 * 
 * Quando o limite de tokens é excedido, o algoritmo:
 * 1. Remove mensagens do meio da conversa (mais antigas primeiro)
 * 2. Preserva sempre o System Prompt e a última mensagem
 * 3. Para quando não há mais mensagens para remover ou quando atingir o limite
 * 
 * @example
 * ```typescript
 * import { ChatHistoryManager, TokenizerService } from '@/memory';
 * 
 * // Configuração
 * const tokenizer = new TokenizerService('gpt-4');
 * const config = {
 *   maxContextTokens: 8192,
 *   tokenizer
 * };
 * 
 * const history = new ChatHistoryManager(config);
 * 
 * // Adicionar System Prompt
 * history.addSystemPrompt('Você é um assistente especializado em programação.');
 * 
 * // Gerenciar conversa
 * history.addMessage({ role: 'user', content: 'Como fazer um loop?' });
 * history.addMessage({ role: 'assistant', content: 'Use for ou while...' });
 * 
 * // Obter contexto truncado
 * const messages = history.getTrimmedHistory();
 * 
 * // Verificar orçamento
 * const remaining = history.getRemainingBudget();
 * ```
 * 
 * @see {@link ChatHistoryConfig} Para configuração
 * @see {@link IChatHistoryManager} Para a interface implementada
 */
export class ChatHistoryManager implements IChatHistoryManager {

    /** O histórico de mensagens, mantido em ordem cronológica */
    private history: Message[] = [];

    /** O limite máximo de tokens para o contexto total */
    private maxContextTokens: number;

    /** O serviço injetado para calcular o custo em tokens */
    private tokenizer: ITokenizerService;

    /** Contador para gerar IDs únicos de mensagens */
    private messageIdCounter: number = 0;

    /**
     * Cria uma nova instância do ChatHistoryManager.
     * 
     * @param config Configuração do gerenciador contendo:
     * - `maxContextTokens`: Limite de tokens do modelo (ex: 8192 para GPT-4)
     * - `tokenizer`: Instância do serviço de tokenização
     * 
     * @example
     * ```typescript
     * // Configuração básica
     * const config = {
     *   maxContextTokens: 8192,
     *   tokenizer: new TokenizerService('gpt-4')
     * };
     * const history = new ChatHistoryManager(config);
     * 
     * // Configuração para Claude (maior limite)
     * const claudeConfig = {
     *   maxContextTokens: 100000,
     *   tokenizer: new ClaudeTokenizer()
     * };
     * const claudeHistory = new ChatHistoryManager(claudeConfig);
     * ```
     */
    constructor(config: ChatHistoryConfig) {
        this.maxContextTokens = config.maxContextTokens;
        this.tokenizer = config.tokenizer;
        logger.debug(`[ChatHistoryManager] ChatHistoryManager created with maxContextTokens: ${this.maxContextTokens}`);
    }

    /**
     * Gera um ID único para uma mensagem.
     * 
     * @returns ID único no formato 'msg-<timestamp>-<counter>'
     */
    private generateMessageId(): string {
        return `msg-${Date.now()}-${++this.messageIdCounter}`;
    }

    /**
     * Adiciona uma mensagem de prompt do sistema (System Prompt).
     * 
     * O System Prompt é sempre inserido na primeira posição do histórico e é
     * imunizado contra truncamento. Se já existir um System Prompt, ele será
     * substituído pelo novo.
     * 
     * **Importante**: Esta deve ser a primeira operação realizada no gerenciador
     * para garantir que o System Prompt fique na posição correta.
     * 
     * @param prompt O texto do System Prompt com as instruções de comportamento.
     * Deve ser uma string não vazia com as diretrizes para o assistente.
     * 
     * @remarks
     * - Utiliza Guard Clause para early return quando o prompt já existe
     * - Substitui prompts existentes mantendo a posição primeira
     * - É sempre preservado durante o truncamento
     * 
     * @example
     * ```typescript
     * history.addSystemPrompt(`
     *   Você é um assistente especializado em TypeScript e Node.js.
     *   Sempre forneça exemplos práticos e código limpo.
     *   Explique conceitos complexos de forma simples.
     * `);
     * ```
     * 
     * @see {@link getTrimmedHistory} Para entender como o prompt é preservado
     */
    public addSystemPrompt(prompt: string): void {
        logger.debug(`Adding system prompt`, 'ChatHistoryManager');
        const systemMessage: Message = { 
            id: this.generateMessageId(),
            role: 'system', 
            content: prompt 
        };

        // Verifica se o System Prompt já está presente na primeira posição
        const hasHistory = this.history.length > 0;
        const isFirstMessageSystem = hasHistory && this.history[0].role === 'system';

        // Guard Clause: se já existe, substitui e retorna (Early Exit)
        if (isFirstMessageSystem) {
            logger.debug(`System prompt already exists, replacing it`, 'ChatHistoryManager');
            this.history[0] = systemMessage;
            return;
        }

        // Ação primária: insere no início do histórico
        this.history.unshift(systemMessage);
        logger.debug(`System prompt added to history`, 'ChatHistoryManager');
    }

    /**
     * Adiciona uma mensagem ao histórico de chat.
     * 
     * As mensagens são adicionadas ao final do histórico, mantendo a ordem
     * cronológica da conversa. Esta mensagem pode ser removida durante o
     * truncamento, exceto se for a última mensagem do usuário.
     * 
     * @param message A mensagem a ser adicionada ao histórico.
     * Deve ter uma role válida ('user', 'assistant', 'tool') e content não vazio.
     * 
     * @throws {Error} Se a mensagem for inválida (role ou content ausente)
     * 
     * @remarks
     * - As mensagens são adicionadas no final (ordem cronológica)
     * - Pode ser removida durante truncamento (exceto última do usuário)
     * - Use addSystemPrompt() antes desta função para definir o comportamento
     * 
     * @example
     * ```typescript
     * // Adicionar mensagem do usuário
     * history.addMessage({
     *   role: 'user',
     *   content: 'Como implementar um algoritmo de ordenação?'
     * });
     * 
     * // Adicionar resposta do assistente
     * history.addMessage({
     *   role: 'assistant',
     *   content: 'Existem vários algoritmos: bubble sort, quick sort, merge sort...'
     * });
     * 
     * // Adicionar resultado de ferramenta
     * history.addMessage({
     *   role: 'tool',
     *   content: JSON.stringify({ result: 'execution completed' })
     * });
     * ```
     */
    public addMessage(message: Message): void {
        logger.debug(`Adding message with role: ${message.role}`, 'ChatHistoryManager');

        // Validação básica da mensagem
        if (!message || !message.role || !message.content) {
            throw new Error('Message must have valid role and content');
        }

        // Garantir que a mensagem tenha ID
        const messageWithId: Message = {
            id: message.id || this.generateMessageId(),
            role: message.role,
            content: message.content
        };

        this.history.push(messageWithId);
    }

    /**
     * Limpa todo o histórico de mensagens, preservando o System Prompt.
     * 
     * Remove todas as mensagens do histórico exceto o System Prompt (se existir).
     * Esta operação é útil para iniciar uma nova conversa mantendo as instruções
     * de comportamento do assistente.
     * 
     * @remarks
     * - O System Prompt é sempre preservado (se existir)
     * - Para limpeza completa (incluindo System Prompt), chame addSystemPrompt('') depois
     * - Esta operação não pode ser desfeita
     * - Útil para iniciar nova conversa com mesmo comportamento
     * 
     * @example
     * ```typescript
     * // Limpar conversa mantendo instruções
     * history.clearHistory();
     * // System prompt permanece, histórico é limpo
     * 
     * // Limpeza completa (incluindo System Prompt)
     * history.clearHistory();
     * history.addSystemPrompt(''); // Remove prompt também
     * 
     * // Nova conversa com novo prompt
     * history.clearHistory();
     * history.addSystemPrompt('Novo comportamento do assistente');
     * ```
     */
    public clearHistory(): void {
        logger.debug(`Clearing chat history`, 'ChatHistoryManager');

        // Obtém o System Prompt usando validações lineares
        const hasHistory = this.history.length > 0;
        const hasSystemPrompt = hasHistory && this.history[0].role === 'system';
        const systemPrompt = hasSystemPrompt ? this.history[0] : null;

        // Limpa todo o histórico
        this.history = [];

        // Adiciona o System Prompt de volta, se ele existia
        if (systemPrompt) {
            this.history.push(systemPrompt);
            logger.debug(`System prompt preserved during history clear`, 'ChatHistoryManager');
        }
    }

    /**
     * Retorna o histórico de mensagens, aplicando truncamento inteligente baseado em tokens.
     * 
     * Esta é a operação principal do gerenciador. Ela aplica o algoritmo de truncamento
     * que garante que o contexto caiba dentro do limite de tokens do modelo, preservando
     * sempre as mensagens mais importantes da conversa.
     * 
     * ## Estratégia de Preservação
     * 
     * 1. **System Prompt** (primeira mensagem) - sempre preservado
     * 2. **Última mensagem do usuário** - sempre preservada (contexto atual)
     * 3. **Histórico intermediário** - removido do mais antigo para o mais novo
     * 
     * ## Algoritmo de Truncamento
     * 
     * 1. Se histórico ≤ 2 mensagens, retorna como está (não há o que truncar)
     * 2. Clona o histórico para manipulação segura
     * 3. Identifica primeira mensagem mutável (após System Prompt)
     * 4. Loop de remoção:
     *    - Remove mensagem mais antiga (índice = firstMutableIndex)
     *    - Recalcula tokens totais
     *    - Para quando atingir limite ou não houver mais mensagens para remover
     * 5. Retorna cópia do histórico truncado
     * 
     * @returns O array de mensagens pronto para ser enviado ao LLM.
     * As mensagens estão em ordem cronológica e respeitam o limite de tokens.
     * 
     * @remarks
     * - Retorna uma cópia (não a referência interna) para segurança
     * - O truncamento é aplicado a cada chamada
     * - Se System Prompt + última mensagem excederem limite, emite warning
     * - Utiliza Guard Clause para evitar loop infinito
     * 
     * @example
     * ```typescript
     * // Configurar gerenciador
     * const history = new ChatHistoryManager(config);
     * history.addSystemPrompt('Você é um assistente útil.');
     * history.addMessage({ role: 'user', content: 'Pergunta 1' });
     * history.addMessage({ role: 'assistant', content: 'Resposta 1' });
     * history.addMessage({ role: 'user', content: 'Pergunta 2' });
     * 
     * // Obter contexto truncado
     * const messages = history.getTrimmedHistory();
     * 
     * // Enviar para o provider
     * const response = await provider.chat(messages);
     * ```
     * 
     * @see {@link addSystemPrompt} Para entender como o prompt é preservado
     * @see {@link addMessage} Para entender como as mensagens são adicionadas
     */
    public getTrimmedHistory(): Message[] {
        logger.debug(`Getting trimmed history`, 'ChatHistoryManager');

        // Early Return: Se histórico vazio ou só system prompt, não há o que truncar
        if (this.history.length <= 2) {
            logger.debug(`History has 2 or fewer messages, returning as is`, 'ChatHistoryManager');
            return [...this.history];
        }

        // Clonar o histórico para manipulação segura
        let trimmedHistory = [...this.history];

        // Índice da primeira mensagem que pode ser truncada (depois do System Prompt)
        const firstMutableIndex = trimmedHistory[0].role === 'system' ? 1 : 0;

        // Loop principal de truncamento
        while (this.tokenizer.countTokens(trimmedHistory) > this.maxContextTokens) {

            const removableIndex = firstMutableIndex;

            // Recalcula índice da última mensagem protegida a cada iteração
            // (o array diminui conforme mensagens são removidas)
            const lastProtectedIndex = trimmedHistory.length - 1;

            // Guard Clause ESSENCIAL: Impede truncamento de mensagens protegidas
            // e evita loop infinito. Garante que System Prompt e última mensagem
            // sejam sempre preservados.
            if (removableIndex >= lastProtectedIndex) {
                logger.warn(
                    "ALERTA DE CONTEXTO: O System Prompt e a última mensagem excedem o limite de tokens.",
                    'ChatHistoryManager'
                );
                break;
            }

            // Remove a mensagem mais antiga e mutável (o miolo da conversa)
            trimmedHistory.splice(removableIndex, 1);
        }

        logger.debug(`Trimmed history to ${trimmedHistory.length} messages`, 'ChatHistoryManager');
        return trimmedHistory;
    }

    /**
     * Calcula o orçamento de tokens restante com base no histórico atual.
     * 
     * Esta função é útil para monitoramento e logging, permitindo acompanhar
     * o uso de tokens e tomar decisões sobre otimização do contexto antes de
     * enviar a requisição ao LLM.
     * 
     * @returns O número de tokens restantes disponíveis.
     * Retorna 0 se o limite já foi excedido (nunca retorna valor negativo).
     * 
     * @remarks
     * - Útil para logging e monitoramento de uso de tokens
     * - Pode ser usado para tomar decisões sobre otimização
     * - Não considera o truncamento, apenas o estado atual
     * - Use antes de getTrimmedHistory() para entender o estado atual
     * 
     * @example
     * ```typescript
     * // Adicionar mensagens
     * history.addMessage({ role: 'user', content: 'Pergunta longa...' });
     * 
     * // Verificar orçamento antes de enviar
     * const remaining = history.getRemainingBudget();
     * console.log(`Tokens restantes: ${remaining}`);
     * 
     * if (remaining < 100) {
     *   console.warn('Poucos tokens restantes! Considere otimizar o contexto.');
     * }
     * 
     * // Obter contexto truncado
     * const messages = history.getTrimmedHistory();
     * 
     * // Verificar novamente após truncamento
     * const remainingAfter = history.getRemainingBudget();
     * console.log(`Tokens restantes após truncamento: ${remainingAfter}`);
     * ```
     * 
     * @see {@link getTrimmedHistory} Para obter o contexto otimizado
     */
    public getRemainingBudget(): number {
        const used = this.tokenizer.countTokens(this.history);
        return Math.max(0, this.maxContextTokens - used);
    }

    /**
     * Edita o conteúdo de uma mensagem específica no histórico.
     * 
     * @param messageId Identificador único da mensagem a ser editada.
     * @param newContent Novo conteúdo para a mensagem.
     * 
     * @throws {Error} Se a mensagem não for encontrada ou content for inválido
     */
    public editMessage(messageId: string, newContent: string): void {
        if (!newContent || newContent.trim() === '') {
            throw new Error('New content cannot be empty');
        }

        const messageIndex = this.history.findIndex(msg => msg.id === messageId);
        if (messageIndex === -1) {
            throw new Error(`Message with ID ${messageId} not found`);
        }

        this.history[messageIndex].content = newContent;
        logger.debug(`Message ${messageId} edited`, 'ChatHistoryManager');
    }

    /**
     * Remove um range de mensagens do histórico.
     * 
     * @param startId ID da primeira mensagem a ser removida.
     * @param endId ID da última mensagem a ser removida.
     * 
     * @throws {Error} Se os IDs não forem encontrados ou forem inválidos
     */
    public deleteMessageRange(startId: string, endId: string): void {
        const startIndex = this.history.findIndex(msg => msg.id === startId);
        const endIndex = this.history.findIndex(msg => msg.id === endId);

        if (startIndex === -1) {
            throw new Error(`Start message with ID ${startId} not found`);
        }

        if (endIndex === -1) {
            throw new Error(`End message with ID ${endId} not found`);
        }

        if (startIndex > endIndex) {
            throw new Error('Start message must come before end message');
        }

        const removedCount = endIndex - startIndex + 1;
        this.history.splice(startIndex, removedCount);
        logger.debug(`Removed ${removedCount} messages from ${startId} to ${endId}`, 'ChatHistoryManager');
    }

    /**
     * Busca uma mensagem específica por seu ID.
     * 
     * @param messageId ID da mensagem a ser buscada.
     * 
     * @returns A mensagem encontrada ou undefined.
     */
    public getMessageById(messageId: string): Message | undefined {
        return this.history.find(msg => msg.id === messageId);
    }

    /**
     * Exporta todo o histórico de mensagens.
     * 
     * @returns Array com todas as mensagens do histórico.
     */
    public exportHistory(): Message[] {
        return [...this.history];
    }

    /**
     * Importa mensagens para o histórico.
     * 
     * @param messages Array de mensagens a serem importadas.
     * 
     * @throws {Error} Se as mensagens forem inválidas ou null/undefined
     */
    public importHistory(messages: Message[]): void {
        if (!messages || !Array.isArray(messages)) {
            throw new Error('Messages must be a valid array');
        }

        // Validar todas as mensagens
        for (const message of messages) {
            if (!message.role || !message.content) {
                throw new Error('All messages must have valid role and content');
            }
            
            // Garantir ID para mensagens importadas
            if (!message.id) {
                message.id = this.generateMessageId();
            }
        }

        this.history = [...messages];
        logger.debug(`Imported ${messages.length} messages to history`, 'ChatHistoryManager');
    }
}
