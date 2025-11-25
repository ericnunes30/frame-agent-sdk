/**
 * Módulo Providers - Integração Unificada com LLMs
 * 
 * Este módulo fornece um sistema completo para integração com diferentes
 * provedores de modelos de linguagem, oferecendo uma interface unificada
 * que abstrai as diferenças entre APIs e permite troca fácil entre provedores.
 * 
 * ## Componentes Principais
 * 
 * - **ProviderAdapter**: Interface unificada para todos os provedores
 * - **ProviderConfig**: Configuração padronizada para provedores
 * - **IProviderResponse**: Resposta normalizada de qualquer provedor
 * - **OpenAIProvider**: Provedor oficial da OpenAI
 * - **OpenAICompatibleProvider**: Provedores compatíveis com OpenAI
 * - **ProviderRegistry**: Sistema de registro e descoberta de provedores
 * - **stream**: Utilitários para processamento de streams
 * 
 * ## Uso Básico
 * 
 * ```typescript
 * import { ProviderAdapter, ProviderConfig } from '@/providers';
 * 
 * // Configuração simples
 * const config: ProviderConfig = {
 *   model: 'gpt-4',
 *   messages: [{ role: 'user', content: 'Olá!' }],
 *   apiKey: 'sua-api-key'
 * };
 * 
 * // Chamada unificada
 * const response = await ProviderAdapter.chatCompletion(config);
 * console.log(response.content);
 * 
 * // Com provedor compatível
 * const compatibleConfig: ProviderConfig = {
 *   model: 'claude-3-sonnet',
 *   messages: [...],
 *   apiKey: 'sua-api-key',
 *   baseUrl: 'https://api.anthropic.com'
 * };
 * 
 * const response2 = await ProviderAdapter.chatCompletion(compatibleConfig);
 * ```
 * 
 * @module Providers
 */

// ==================== Adaptador Unificado ====================

export * from './adapter';

// ==================== Provedores Específicos ====================

export * from './providers';

// ==================== Utilitários ====================

export * from './utils';
