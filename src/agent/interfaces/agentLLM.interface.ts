/**
 * Parâmetros padrão por provedor de LLM.
 * 
 * Define valores padrão que são aplicados quando parâmetros não são
 * explicitamente fornecidos nas chamadas ao modelo. Permite configurar
 * comportamento consistente por provedor.
 * 
 * ## Parâmetros Suportados
 * 
 * - **temperature**: Controla criatividade das respostas (0.0 = determinístico, 1.0 = criativo)
 * - **topP**: Nucleus sampling para controle de diversidade vocabular
 * - **maxTokens**: Limite máximo de tokens na resposta gerada
 * 
 * ## Valores Recomendados
 * 
 * - **temperature**: 0.5 (equilíbrio entre criatividade e consistência)
 * - **topP**: 1.0 (sem limitação de vocabulário)
 * - **maxTokens**: 1000 (resposta padrão)
 * 
 * @example
 * ```typescript
 * // Configuração para agente técnico
 * const technicalDefaults: ProviderDefaults = {
 *   temperature: 0.2,    // Respostas mais precisas
 *   topP: 0.9,          // Boa diversidade
 *   maxTokens: 1500     // Respostas detalhadas
 * };
 * 
 * // Configuração para agente criativo
 * const creativeDefaults: ProviderDefaults = {
 *   temperature: 0.8,    // Mais criativo
 *   topP: 0.95,         // Alta diversidade
 *   maxTokens: 2000     // Respostas longas
 * };
 * ```
 */
export interface ProviderDefaults {
    /**
     * Temperatura do modelo (0.0 a 1.0).
     * 
     * Controla a criatividade e aleatoriedade das respostas:
     * - **0.0-0.3**: Respostas determinísticas (tarefas técnicas)
     * - **0.4-0.7**: Equilíbrio (conversas gerais)
     * - **0.8-1.0**: Mais criativas (brainstorming)
     * 
     * @example
     * ```typescript
     * temperature: 0.2  // Para cálculos precisos
     * temperature: 0.7  // Para conversas naturais
     * temperature: 0.9  // Para tarefas criativas
     * ```
     */
    temperature?: number;

    /**
     * Núcleo de sampling (0.0 a 1.0).
     * 
     * Controla a diversidade do vocabulário considerado:
     * - **0.1**: Vocabulário restrito, respostas previsíveis
     * - **0.5**: Equilíbrio entre previsibilidade e diversidade
     * - **0.9-1.0**: Vocabulário amplo, máxima diversidade
     * 
     * Geralmente usado em conjunto com temperature.
     * 
     * @example
     * ```typescript
     * topP: 0.1   // Respostas conservadoras
     * topP: 0.9   // Respostas diversificadas
     * ```
     */
    topP?: number;

    /**
     * Máximo de tokens de saída.
     * 
     * Limita o tamanho da resposta gerada pelo modelo:
     * - **100-500**: Respostas curtas e diretas
     * - **500-2000**: Respostas médias e detalhadas
     * - **2000+**: Respostas longas e abrangentes
     * 
     * @example
     * ```typescript
     * maxTokens: 100   // Resposta muito concisa
     * maxTokens: 1000  // Resposta padrão
     * maxTokens: 4000  // Resposta detalhada
     * ```
     */
    maxTokens?: number;
}

/**
 * Configuração para integração com modelos de linguagem.
 * 
 * Define todos os parâmetros necessários para conectar e configurar
 * um modelo de linguagem específico, incluindo credenciais, endpoint
 * e parâmetros padrão de geração.
 * 
 * ## Campos Obrigatórios
 * 
 * - **model**: Nome do modelo a ser usado
 * - **apiKey**: Chave de autenticação do provedor
 * 
 * ## Campos Opcionais
 * 
 * - **baseUrl**: URL customizada para APIs compatíveis
 * - **defaults**: Parâmetros padrão de geração
 * 
 * @example
 * ```typescript
 * // Configuração OpenAI
 * const openaiConfig: AgentLLMConfig = {
 *   model: 'gpt-4',
 *   apiKey: 'sk-...',
 *   defaults: {
 *     temperature: 0.7,
 *     maxTokens: 1000
 *   }
 * };
 * 
 * // Configuração com endpoint customizado
 * const customConfig: AgentLLMConfig = {
 *   model: 'claude-3-sonnet',
 *   apiKey: 'sk-ant-...',
 *   baseUrl: 'https://api.anthropic.com',
 *   defaults: {
 *     temperature: 0.5,
 *     topP: 0.9,
 *     maxTokens: 2000
 *   }
 * };
 * ```
 */
export interface AgentLLMConfig {
    /**
     * Nome do modelo de linguagem a ser utilizado.
     * 
     * Identificador específico do modelo conforme suportado
     * pelo provedor (ex: 'gpt-4', 'claude-3-sonnet', 'llama-2').
     * 
     * @example
     * ```typescript
     * model: 'gpt-4'              // OpenAI GPT-4
     * model: 'gpt-3.5-turbo'      // OpenAI GPT-3.5
     * model: 'claude-3-opus'      // Anthropic Claude 3 Opus
     * model: 'claude-3-sonnet'    // Anthropic Claude 3 Sonnet
     * ```
     */
    model: string;

    /**
     * Nome do provedor explícito (opcional).
     * Se fornecido, força o uso deste provedor ignorando inferência pelo modelo.
     */
    provider?: string;

    /**
     * Chave de API para autenticação no provedor.
     * 
     * Token de acesso necessário para fazer requisições ao
     * modelo de linguagem. Deve ser mantido seguro e nunca
     * exposto em código cliente.
     * 
     * @example
     * ```typescript
     * apiKey: 'sk-1234567890abcdef...'  // OpenAI
     * apiKey: 'sk-ant-1234567890...'    // Anthropic
     * ```
     */
    apiKey: string;

    /**
     * URL base para o endpoint da API.
     * 
     * Permite usar APIs customizadas ou provedores compatíveis.
     * Se não fornecida, usa a URL padrão do provedor.
     * 
     * @example
     * ```typescript
     * baseUrl: 'https://api.openai.com/v1'           // OpenAI oficial
     * baseUrl: 'https://api.anthropic.com'           // Anthropic
     * baseUrl: 'http://localhost:8000/v1'            // Local/self-hosted
     * baseUrl: 'https://api.cohere.ai'               // Cohere
     * ```
     */
    baseUrl?: string;

    /**
     * Parâmetros padrão de geração do modelo.
     * 
     * Configurações que serão aplicadas por padrão em todas
     * as chamadas ao modelo, a menos que explicitamente
     * sobrescritas na requisição.
     * 
     * @example
     * ```typescript
     * defaults: {
     *   temperature: 0.7,    // Criatividade padrão
     *   topP: 0.9,          // Diversidade padrão
     *   maxTokens: 1000     // Limite padrão
     * }
     * ```
     * 
     * @see {@link ProviderDefaults} Para estrutura dos parâmetros padrão
     */
    defaults?: ProviderDefaults;
}
