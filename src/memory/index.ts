// src/memory/index.ts

/**
 * Módulo Memory - Gerenciamento de Memória de Conversas
 * 
 * Este módulo fornece componentes para gerenciamento inteligente de memória
 * em agentes de IA, implementando sistemas de truncamento baseado em tokens
 * que garantem que o contexto das conversas caiba dentro das limitações dos
 * modelos de linguagem.
 * 
 * ## Componentes Principais
 * 
 * - **Message**: Interface para representar mensagens de conversa
 * - **ITokenizerService**: Contrato para serviços de tokenização
 * - **IChatHistoryManager**: Contrato para gerenciadores de histórico
 * - **ChatHistoryConfig**: Configuração para gerenciadores de histórico
 * - **TokenizerService**: Implementação aproximada de tokenização
 * - **ChatHistoryManager**: Gerenciador principal de histórico com truncamento inteligente
 * 
 * ## Uso Básico
 * 
 * ```typescript
 * import { ChatHistoryManager, TokenizerService } from '@/memory';
 * 
 * // Configurar tokenizador e gerenciador
 * const tokenizer = new TokenizerService('gpt-4');
 * const config = {
 *   maxContextTokens: 8192,
 *   tokenizer
 * };
 * const history = new ChatHistoryManager(config);
 * 
 * // Adicionar System Prompt e gerenciar conversa
 * history.addSystemPrompt('Você é um assistente especializado em programação.');
 * history.addMessage({ role: 'user', content: 'Como fazer um loop?' });
 * 
 * // Obter contexto truncado para enviar ao LLM
 * const messages = history.getTrimmedHistory();
 * ```
 * 
 * @module Memory
 */

// ==================== Interfaces e Contratos ====================

export {
    /** Interface para representar mensagens de conversa */
    Message,

    /** Contrato para serviços de tokenização */
    ITokenizerService,

    /** Contrato para gerenciadores de histórico */
    IChatHistoryManager,

    /** Configuração para gerenciadores de histórico */
    ChatHistoryConfig
} from './memory.interface';

// ==================== Implementações ====================

export {
    /** Implementação aproximada de tokenização baseada em caracteres */
    TokenizerService
} from './tokenizer';

export {
    /** Gerenciador principal de histórico com truncamento inteligente */
    ChatHistoryManager
} from './chatHistoryManager';

// ==================== Extensões (Hooks) ====================

export type { ContextHooks, ContextBeforeRequestResult, ContextOnErrorResult } from './contextHooks.interface';

export type { MessageContent, ContentPart, TextContentPart, ImageUrlContentPart } from './memory.interface';
export { isContentParts, extractText, extractTextFromMessage, hasImages, sanitizeForLogs } from './messageContentUtils';
