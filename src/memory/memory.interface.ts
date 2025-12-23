// src/memory/memory.interface.ts

/**
 * Representa uma única mensagem na conversa, compatível com os principais Providers de LLM.
 * 
 * Esta interface segue o padrão de mensagens do OpenAI e é compatível com a maioria
 * dos provedores de modelos de linguagem, incluindo OpenAI, Anthropic Claude, e outros.
 * 
 * @example
 * ```typescript
 * const userMessage: Message = {
 *   id: 'msg-123',
 *   role: 'user',
 *   content: 'Como funciona o aprendizado de máquina?'
 * };
 * 
 * const systemMessage: Message = {
 *   id: 'msg-456',
 *   role: 'system',
 *   content: 'Você é um assistente especializado em IA.'
 * };
 * ```
 * 
 * @remarks
 * - 'system': Instruções de comportamento do assistente (sempre primeira, nunca truncada)
 * - 'user': Mensagens do usuário/contexto da conversa
 * - 'assistant': Respostas do modelo de linguagem
 * - 'tool': Resultados de chamadas de ferramentas (quando suportado)
 * - 'id': Identificador único para operações de edição e remoção (gerado automaticamente)
 */
export interface Message {
  /** 
   * Identificador único da mensagem.
   * Usado para operações de edição, remoção e busca.
   * Gerado automaticamente pelo ChatHistoryManager se não fornecido.
   */
  id?: string;
  
  /** 
   * O papel/função da mensagem na conversa.
   * Valores aceitos: 'system', 'user', 'assistant', 'tool'
   */
  role: string;
  
  /** 
   * O conteúdo textual da mensagem.
   * Pode ser uma string simples ou conteúdo estruturado (JSON, markdown, etc.)
   */
  content: MessageContent;
}

/**
 * Conteudo de uma mensagem.
 *
 * - `string`: texto puro (legado)
 * - `ContentPart[]`: conteudo multimodal (ex.: texto + imagens)
 */
export type MessageContent = string | ContentPart[];

/** Parte de conteudo multimodal (minimo viavel). */
export type ContentPart = TextContentPart | ImageUrlContentPart;

export interface TextContentPart {
  type: 'text';
  text: string;
}

export interface ImageUrlContentPart {
  type: 'image_url';
  image_url: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}

/**
 * Contrato para qualquer serviço que possa calcular o custo (em tokens)
 * de uma lista de mensagens. Isso permite desacoplar a lógica de contagem
 * de tokens (ex: tiktoken, Claude API) da lógica de gerenciamento de memória.
 * 
 * Esta interface permite que diferentes implementações de tokenização sejam
 * injetadas no sistema, desde tokenizadores aproximados até implementações
 * precisas específicas por modelo.
 * 
 * @example
 * ```typescript
 * // Implementação com tiktoken (OpenAI)
 * class TiktokenService implements ITokenizerService {
 *   countTokens(messages: Message[]): number {
 *     // Implementação real com tiktoken
 *   }
 * }
 * 
 * // Implementação aproximada (atual)
 * class ApproximateTokenizer implements ITokenizerService {
 *   countTokens(messages: Message[]): number {
 *     // Implementação aproximada por caracteres
 *   }
 * }
 * ```
 */
export interface ITokenizerService {
    /**
     * Calcula o número total de tokens para uma lista de mensagens.
     * 
     * Esta função deve considerar não apenas o conteúdo das mensagens,
     * mas também o overhead estrutural (roles, formatação JSON, etc.).
     * 
     * @param messages O histórico de mensagens a ser analisado.
     * As mensagens devem estar na ordem cronológica da conversa.
     * 
     * @returns O número total de tokens estimado para todas as mensagens.
     * O valor deve ser um número inteiro arredondado para cima.
     * 
     * @throws {Error} Se as mensagens forem inválidas ou null/undefined
     * 
     * @example
     * ```typescript
     * const tokenizer = new TokenizerService('gpt-4');
     * const messages = [
     *   { role: 'system', content: 'You are helpful' },
     *   { role: 'user', content: 'Hello' }
     * ];
     * 
     * const totalTokens = tokenizer.countTokens(messages);
     * console.log(`Total de tokens: ${totalTokens}`);
     * ```
     */
    countTokens(messages: Message[]): number;
}

/**
 * Contrato para o Gerenciador de Histórico de Chat, responsável pela memória processual.
 * 
 * Esta interface define as operações fundamentais para gerenciar o histórico de conversas
 * em agentes de IA, implementando estratégias inteligentes de truncamento que preservam
 * sempre o System Prompt e a última mensagem do usuário.
 * 
 * @example
 * ```typescript
 * const history = new ChatHistoryManager(config);
 * 
 * // Adicionar System Prompt (sempre primeiro)
 * history.addSystemPrompt('Você é um assistente especializado em programação.');
 * 
 * // Adicionar mensagens da conversa
 * history.addMessage({ role: 'user', content: 'Como fazer um loop?' });
 * history.addMessage({ role: 'assistant', content: 'Use for ou while...' });
 * 
 * // Obter histórico truncado para enviar ao LLM
 * const messages = history.getTrimmedHistory();
 * 
 * // Verificar tokens restantes
 * const remaining = history.getRemainingBudget();
 * ```
 */
export interface IChatHistoryManager {
    /**
     * Adiciona uma mensagem ao histórico de chat.
     * 
     * As mensagens são adicionadas ao final do histórico (ordem cronológica).
     * Esta mensagem pode ser removida durante o truncamento, exceto se for
     * a última mensagem do usuário.
     * 
     * @param message A mensagem a ser adicionada ao histórico.
     * Deve ter role válida ('user', 'assistant', 'tool') e content não vazio.
     * 
     * @throws {Error} Se a mensagem for inválida (role ou content ausente)
     * 
     * @example
     * ```typescript
     * history.addMessage({
     *   role: 'user',
     *   content: 'Explique machine learning'
     * });
     * ```
     */
    addMessage(message: Message): void;

    /**
     * Adiciona uma mensagem de prompt do sistema (System Prompt), que é imunizada contra truncamento.
     * 
     * O System Prompt é sempre inserido na primeira posição do histórico e nunca
     * é removido durante o truncamento. Se já existir um System Prompt, ele será
     * substituído pelo novo.
     * 
     * @param prompt O texto do System Prompt.
     * Deve ser uma string não vazia com as instruções de comportamento do assistente.
     * 
     * @remarks
     * - Deve ser chamado antes de addMessage() para garantir posição correta
     * - Pode ser chamado a qualquer momento para atualizar o prompt
     * - É sempre preservado durante o truncamento
     * 
     * @example
     * ```typescript
     * history.addSystemPrompt(`
     *   Você é um assistente especializado em TypeScript.
     *   Sempre forneça exemplos práticos e código limpo.
     * `);
     * ```
     */
    addSystemPrompt(prompt: string): void;

    /**
     * Retorna o histórico de mensagens, aplicando truncamento baseado em tokens.
     * 
     * Esta é a operação principal do gerenciador. Ela aplica o algoritmo de
     * truncamento inteligente que:
     * 1. Preserva sempre o System Prompt (primeira mensagem)
     * 2. Preserva sempre a última mensagem do usuário
     * 3. Remove mensagens intermediárias do mais antigo para o mais novo
     * 4. Garante que o total de tokens não exceda maxContextTokens
     * 
     * @returns O array de mensagens pronto para ser enviado ao LLM.
     * As mensagens estão em ordem cronológica e respeitam o limite de tokens.
     * 
     * @remarks
     * - Retorna uma cópia do histórico (não a referência interna)
     * - O truncamento é aplicado a cada chamada
     * - Se o System Prompt + última mensagem excederem o limite, emite warning
     * 
     * @example
     * ```typescript
     * const messages = history.getTrimmedHistory();
     * 
     * // Enviar para o provider
     * const response = await provider.chat(messages);
     * ```
     */
    getTrimmedHistory(): Message[];

    /**
     * Retorna o orçamento de tokens restante com base no histórico atual.
     * 
     * Útil para monitoramento e logging, permitindo acompanhar o uso de tokens
     * e tomar decisões sobre otimização do contexto.
     * 
     * @returns O número de tokens restantes disponíveis.
     * Retorna 0 se o limite já foi excedido.
     * 
     * @example
     * ```typescript
     * const remaining = history.getRemainingBudget();
     * console.log(`Tokens restantes: ${remaining}`);
     * 
     * if (remaining < 100) {
     *   console.warn('Poucos tokens restantes!');
     * }
     * ```
     */
    getRemainingBudget(): number;

    /**
     * Limpa todo o histórico de mensagens, preservando o System Prompt.
     * 
     * Remove todas as mensagens do histórico exceto o System Prompt (se existir).
     * Útil para iniciar uma nova conversa mantendo as instruções do assistente.
     * 
     * @remarks
     * - O System Prompt é sempre preservado
     * - Para limpeza completa (incluindo System Prompt), chame addSystemPrompt('') depois
     * - Esta operação não pode ser desfeita
     * 
     * @example
     * ```typescript
     * // Limpar conversa mantendo instruções
     * history.clearHistory();
     * 
     * // Limpeza completa
     * history.clearHistory();
     * history.addSystemPrompt(''); // Remove prompt também
     * ```
     */
    clearHistory(): void;

    /**
     * Edita o conteúdo de uma mensagem específica no histórico.
     * 
     * Permite modificar o conteúdo de uma mensagem existente mantendo
     * sua posição e outras propriedades. Útil para correções ou
     * otimizações de conteúdo.
     * 
     * @param messageId Identificador único da mensagem a ser editada.
     * @param newContent Novo conteúdo para a mensagem.
     * 
     * @throws {Error} Se a mensagem não for encontrada ou content for inválido
     * 
     * @example
     * ```typescript
     * // Corrigir uma mensagem
     * history.editMessage('msg-123', 'Conteúdo corrigido');
     * 
     * // Otimizar para reduzir tokens
     * history.editMessage('msg-456', 'Versão compactada da mensagem original');
     * ```
     */
    editMessage(messageId: string, newContent: MessageContent): void;

    /**
     * Remove um range de mensagens do histórico.
     * 
     * Remove todas as mensagens entre startId e endId (inclusive),
     * permitindo limpeza seletiva do histórico para compressão
     * ou remoção de conversas irrelevantes.
     * 
     * @param startId ID da primeira mensagem a ser removida.
     * @param endId ID da última mensagem a ser removida.
     * 
     * @throws {Error} Se os IDs não forem encontrados ou forem inválidos
     * 
     * @example
     * ```typescript
     * // Remover conversa antiga
     * history.deleteMessageRange('msg-old-1', 'msg-old-10');
     * 
     * // Remover seção específica
     * history.deleteMessageRange('msg-start', 'msg-end');
     * ```
     */
    deleteMessageRange(startId: string, endId: string): void;

    /**
     * Busca uma mensagem específica por seu ID.
     * 
     * Retorna a mensagem correspondente ao ID fornecido ou undefined
     * se não encontrada. Útil para operações de edição ou verificação.
     * 
     * @param messageId ID da mensagem a ser buscada.
     * 
     * @returns A mensagem encontrada ou undefined.
     * 
     * @example
     * ```typescript
     * const message = history.getMessageById('msg-123');
     * if (message) {
     *   console.log('Conteúdo:', message.content);
     * }
     * ```
     */
    getMessageById(messageId: string): Message | undefined;

    /**
     * Exporta todo o histórico de mensagens.
     * 
     * Retorna uma cópia completa do histórico atual, incluindo
     * System Prompt e todas as mensagens, sem aplicação de truncamento.
     * Útil para persistência ou análise.
     * 
     * @returns Array com todas as mensagens do histórico.
     * 
     * @example
     * ```typescript
     * // Salvar histórico
     * const fullHistory = history.exportHistory();
     * localStorage.setItem('chat-history', JSON.stringify(fullHistory));
     * 
     * // Analisar histórico
     * const totalMessages = fullHistory.length;
     * ```
     */
    exportHistory(): Message[];

    /**
     * Importa mensagens para o histórico.
     * 
     * Substitui o histórico atual pelas mensagens fornecidas.
     * Útil para restaurar conversas anteriores ou mesclar
     * históricos de diferentes fontes.
     * 
     * @param messages Array de mensagens a serem importadas.
     * As mensagens devem estar em ordem cronológica.
     * 
     * @throws {Error} Se as mensagens forem inválidas ou null/undefined
     * 
     * @example
     * ```typescript
     * // Restaurar histórico salvo
     * const savedHistory = JSON.parse(localStorage.getItem('chat-history'));
     * history.importHistory(savedHistory);
     * 
     * // Importar de outra fonte
     * history.importHistory([
     *   { role: 'system', content: 'Você é útil' },
     *   { role: 'user', content: 'Olá' }
     * ]);
     * ```
     */
    importHistory(messages: Message[]): void;
}

/**
 * Configuração para o gerenciador de histórico baseada em tokens.
 * 
 * Esta interface define os parâmetros necessários para configurar o
 * ChatHistoryManager, permitindo que seja adaptado para diferentes
 * modelos de LLM com diferentes limites de contexto.
 * 
 * @example
 * ```typescript
 * // Configuração para GPT-4
 * const gpt4Config: ChatHistoryConfig = {
 *   maxContextTokens: 8192,
 *   tokenizer: new TokenizerService('gpt-4')
 * };
 * 
 * // Configuração para Claude
 * const claudeConfig: ChatHistoryConfig = {
 *   maxContextTokens: 100000,
 *   tokenizer: new ClaudeTokenizer()
 * };
 * 
 * const history = new ChatHistoryManager(gpt4Config);
 * ```
 */
export interface ChatHistoryConfig {
  /** 
   * O limite máximo de tokens para o contexto total da conversa.
   * 
   * Este valor deve corresponder ao limite do modelo de LLM sendo usado:
   * - GPT-3.5: ~4,096 tokens
   * - GPT-4: ~8,192 tokens (ou 32,768 para GPT-4-32k)
   * - Claude: até 100,000 tokens
   * 
   * @remarks
   * - Deve ser um número inteiro positivo
   * - Considere uma margem de segurança (ex: 90% do limite real)
   * - Valores muito baixos podem causar truncamento excessivo
   */
  maxContextTokens: number;
  
  /** 
   * O serviço de tokenização responsável por calcular o custo em tokens.
   * 
   * Pode ser qualquer implementação da interface ITokenizerService:
   * - TokenizerService (aproximação por caracteres)
   * - TiktokenService (OpenAI)
   * - ClaudeTokenizer (Anthropic)
   * - Implementações customizadas
   * 
   * @remarks
   * - Deve ser compatível com o modelo especificado
   * - A precisão do tokenizador afeta a qualidade do truncamento
   * - Tokenizadores específicos por modelo são mais precisos
   */
  tokenizer: ITokenizerService;
}
