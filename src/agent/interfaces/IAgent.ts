// src/agents/interfaces/IAgent.ts
import type { AgentInfo, ToolSchema } from '../../promptBuilder';
import type { Message } from '../../memory';
import type { IAgentConfig } from './IAgentConfig';

/**
 * Interface base para todos os agentes do sistema de IA.
 * 
 * Define o contrato fundamental que todos os agentes devem implementar,
 * estabelecendo métodos para execução, configuração, validação e
 * gerenciamento de estado.
 * 
 * ## Características Principais
 * 
 * - **Execução Assíncrona**: Todos os agentes executam operações assíncronas
 * - **Configuração Dinâmica**: Suporte a reconfiguração em tempo de execução
 * - **Validação de Estado**: Verificação de prontidão antes da execução
 * - **Gerenciamento de Estado**: Capacidade de reset e controle de estado
 * - **Metadados Ricos**: Informações detalhadas sobre execuções
 * 
 * ## Integração com Módulos
 * 
 * - **Memory**: Utiliza Message para entrada/saída de dados
 * - **PromptBuilder**: Consome AgentInfo e ToolSchema para construção de prompts
 * - **Providers**: Integra com provedores LLM para geração de conteúdo
 * - **Tools**: Suporta execução de ferramentas quando configurado
 * 
 * @example
 * ```typescript
 * // Implementação básica de agente
 * class MyAgent implements IAgent {
 *   public readonly id = 'my-agent';
 *   public readonly type = 'chat';
 *   public readonly config: IAgentConfig;
 * 
 *   async execute(messages: Message[], options?: AgentExecutionOptions): Promise<AgentExecutionResult> {
 *     const startTime = new Date();
 *     
 *     try {
 *       // Lógica de execução do agente
 *       const response = await this.processMessages(messages, options);
 *       
 *       return {
 *         content: response,
 *         messages: [...messages, { role: 'assistant', content: response }],
 *         success: true,
 *         metadata: {
 *           executionTime: Date.now() - startTime.getTime(),
 *           startTime,
 *           endTime: new Date()
 *         }
 *       };
 *     } catch (error) {
 *       return {
 *         content: null,
 *         messages,
 *         success: false,
 *         error: error.message,
 *         metadata: {
 *           executionTime: Date.now() - startTime.getTime(),
 *           startTime,
 *           endTime: new Date()
 *         }
 *       };
 *     }
 *   }
 * 
 *   configure(config: Partial<IAgentConfig>): void {
 *     this.config = { ...this.config, ...config };
 *   }
 * 
 *   getInfo(): AgentInfo {
 *     return {
 *       name: 'My Agent',
 *       role: 'Assistente personalizado',
 *       backstory: 'Agente criado para tarefas específicas'
 *     };
 *   }
 * 
 *   validate(): boolean {
 *     return this.config.apiKey !== undefined && this.config.model !== undefined;
 *   }
 * 
 *   reset(): void {
 *     // Limpar estado interno
 *   }
 * }
 * ```
 * 
 * @see {@link IAgentConfig} Para configuração de agentes
 * @see {@link AgentInfo} Para informações do agente
 * @see {@link Message} Para formato de mensagens
 * @see {@link ToolSchema} Para definição de ferramentas
 */
export interface IAgent {
  /**
   * Identificador único do agente no sistema.
   * 
   * Este ID deve ser único em todo o sistema e é usado para
   * rastreamento, logging e identificação em registries.
   */
  readonly id: string;
  
  /**
   * Tipo/categoria do agente.
   * 
   * Define o comportamento e capacidades do agente (ex: 'chat', 'react', 'custom').
   * Este tipo é usado pelo sistema para determinar como processar o agente.
   */
  readonly type: string;
  
  /**
   * Configuração atual do agente.
   * 
   * Contém todas as configurações necessárias para o funcionamento
   * do agente, incluindo credenciais, modelos, parâmetros, etc.
   */
  readonly config: IAgentConfig;
  
  /**
   * Executa o agente com as mensagens fornecidas.
   * 
   * Este é o método principal de execução do agente. Recebe mensagens
   * de entrada, processa usando a lógica específica do agente e retorna
   * um resultado estruturado com conteúdo, mensagens atualizadas e metadados.
   * 
   * @param messages Array de mensagens de entrada para o agente.
   * Deve incluir mensagens do usuário e histórico relevante.
   * 
   * @param options Opções adicionais para execução.
   * Parâmetros opcionais como temperatura, tools, instruções extras, etc.
   * 
   * @returns Promise que resolve para AgentExecutionResult.
   * 
   * @example
   * ```typescript
   * const agent = new MyAgent(config);
   * 
   * const messages = [
   *   { role: 'user', content: 'Olá, como você pode me ajudar?' }
   * ];
   * 
   * const options = {
   *   temperature: 0.7,
   *   tools: [calculatorTool, searchTool],
   *   additionalInstructions: 'Seja conciso e útil'
   * };
   * 
   * const result = await agent.execute(messages, options);
   * 
   * if (result.success) {
   *   console.log('Resposta:', result.content);
   *   console.log('Mensagens atualizadas:', result.messages);
   *   console.log('Tempo de execução:', result.metadata.executionTime);
   * } else {
   *   console.error('Erro:', result.error);
   * }
   * ```
   * 
   * @see {@link AgentExecutionOptions} Para opções de execução
   * @see {@link AgentExecutionResult} Para formato do resultado
   */
  execute(
    messages: Message[], 
    options?: AgentExecutionOptions
  ): Promise<AgentExecutionResult>;
  
  /**
   * Configura o agente com novas opções.
   * 
   * Permite modificar a configuração do agente em tempo de execução,
   * útil para ajustes dinâmicos, mudanças de modelo, etc.
   * 
   * @param config Nova configuração parcial do agente.
   * Propriedades existentes são mantidas, novas sobrescrevem as antigas.
   * 
   * @example
   * ```typescript
   * // Alterar temperatura
   * agent.configure({ temperature: 0.9 });
   * 
   * // Adicionar novas ferramentas
   * agent.configure({ tools: [...agent.config.tools, newTool] });
   * 
   * // Alterar modelo
   * agent.configure({ model: 'gpt-4' });
   * ```
   * 
   * @see {@link IAgentConfig} Para estrutura de configuração
   */
  configure(config: Partial<IAgentConfig>): void;
  
  /**
   * Obtém informações sobre o agente.
   * 
   * Retorna dados estruturados sobre o agente, incluindo nome, papel,
   * backstory e outras informações relevantes para construção de prompts.
   * 
   * @returns AgentInfo com informações do agente.
   * 
   * @example
   * ```typescript
   * const info = agent.getInfo();
   * console.log('Nome:', info.name);
   * console.log('Papel:', info.role);
   * console.log('História:', info.backstory);
   * ```
   * 
   * @see {@link AgentInfo} Para formato das informações
   */
  getInfo(): AgentInfo;
  
  /**
   * Valida se o agente está pronto para execução.
   * 
   * Verifica se todas as dependências e configurações necessárias
   * estão presentes e válidas antes de permitir a execução.
   * 
   * @returns true se o agente estiver pronto, false caso contrário.
   * 
   * @example
   * ```typescript
   * if (!agent.validate()) {
   *   console.error('Agente não está configurado corretamente');
   *   return;
   * }
   * 
   * // Agente validado, pode executar
   * const result = await agent.execute(messages);
   * ```
   */
  validate(): boolean;
  
  /**
   * Reinicia o estado interno do agente.
   * 
   * Limpa caches, reseta contadores, remove dados temporários
   * e restaura o agente ao estado inicial. Útil para reutilização
   * ou limpeza de memória.
   * 
   * @example
   * ```typescript
   * // Após execução longa
   * agent.reset();
   * 
   * // Pronto para nova sessão
   * const newResult = await agent.execute(newMessages);
   * ```
   */
  reset(): void;
}

/**
 * Opções de execução do agente.
 * 
 * Define parâmetros opcionais que podem ser fornecidos para personalizar
 * o comportamento do agente durante a execução, incluindo configurações
 * do modelo, ferramentas disponíveis e contexto adicional.
 * 
 * ## Parâmetros de Modelo
 * 
 * - **temperature**: Controla criatividade das respostas (0.0 = determinístico, 1.0 = criativo)
 * - **topP**: Nucleus sampling para controle de diversidade
 * - **maxTokens**: Limite máximo de tokens na resposta
 * - **stream**: Habilita resposta em streaming para interações em tempo real
 * 
 * ## Ferramentas e Contexto
 * 
 * - **tools**: Lista de ferramentas disponíveis para o agente usar
 * - **additionalInstructions**: Instruções extras para personalizar comportamento
 * - **context**: Dados adicionais para enriquecer a execução
 * 
 * @example
 * ```typescript
 * // Configuração para agente criativo
 * const creativeOptions: AgentExecutionOptions = {
 *   temperature: 0.9,
 *   topP: 0.95,
 *   additionalInstructions: 'Seja criativo e use analogias interessantes'
 * };
 * 
 * // Configuração para agente técnico
 * const technicalOptions: AgentExecutionOptions = {
 *   temperature: 0.1,
 *   maxTokens: 2000,
 *   tools: [calculatorTool, codeAnalyzerTool],
 *   context: { domain: 'programming', language: 'TypeScript' }
 * };
 * 
 * // Configuração para streaming
 * const streamingOptions: AgentExecutionOptions = {
 *   stream: true,
 *   temperature: 0.7,
 *   tools: [realtimeSearchTool]
 * };
 * ```
 * 
 * @see {@link ToolSchema} Para definição de ferramentas
 * @see {@link IAgentConfig} Para configuração base do agente
 */
export interface AgentExecutionOptions {
  /**
   * Instruções adicionais para o agente.
   * 
   * Texto livre que será adicionado ao prompt do sistema para
   * personalizar o comportamento do agente. Útil para casos
   * específicos ou ajustes temporários.
   * 
   * @example
   * ```typescript
   * additionalInstructions: 'Sempre responda em português e seja mais formal'
   * additionalInstructions: 'Use exemplos práticos e evite jargões técnicos'
   * additionalInstructions: 'Foque em soluções sustentáveis e econômicas'
   * ```
   */
  additionalInstructions?: string;
  
  /**
   * Ferramentas disponíveis para o agente.
   * 
   * Lista de schemas de ferramentas que o agente pode usar durante
   * a execução. As ferramentas devem estar registradas no sistema
   * e ser compatíveis com o tipo do agente.
   * 
   * @example
   * ```typescript
   * tools: [
   *   { name: 'calculator', description: 'Realiza cálculos', schema: {...} },
   *   { name: 'search', description: 'Busca informações', schema: {...} }
   * ];
   * ```
   * 
   * @see {@link ToolSchema} Para formato dos schemas de ferramenta
   */
  tools?: ToolSchema[];
  
  /**
   * Temperatura do modelo (0.0 a 1.0).
   * 
   * Controla a criatividade e aleatoriedade das respostas:
   * - **0.0**: Respostas mais determinísticas e focadas
   * - **0.7**: Equilíbrio entre criatividade e consistência (padrão)
   * - **1.0**: Máxima criatividade e diversidade
   * 
   * @example
   * ```typescript
   * temperature: 0.1  // Para tarefas técnicas e precisas
   * temperature: 0.7  // Para conversas gerais
   * temperature: 0.9  // Para tarefas criativas
   * ```
   */
  temperature?: number;
  
  /**
   * TopP do modelo (0.0 a 1.0).
   * 
   * Nucleus sampling que controla a diversidade do vocabulário:
   * - **0.1**: Vocabulário restrito, respostas mais previsíveis
   * - **0.9**: Vocabulário amplo, mais diversidade
   * - **1.0**: Sem limitação de vocabulário
   * 
   * Geralmente usado em conjunto com temperature para controle fino.
   * 
   * @example
   * ```typescript
   * topP: 0.1   // Respostas mais conservadoras
   * topP: 0.9   // Respostas mais diversificadas
   * ```
   */
  topP?: number;
  
  /**
   * Máximo de tokens para a resposta.
   * 
   * Limita o tamanho da resposta gerada pelo modelo. Útil para:
   * - Controlar custos de API
   * - Evitar respostas excessivamente longas
   * - Garantir respostas concisas
   * 
   * @example
   * ```typescript
   * maxTokens: 100   // Resposta muito curta
   * maxTokens: 500   // Resposta média
   * maxTokens: 2000  // Resposta longa
   * ```
   */
  maxTokens?: number;
  
  /**
   * Habilita streaming de resposta.
   * 
   * Quando true, a resposta é retornada em chunks conforme gerada,
   * permitindo interfaces mais responsivas e tempo real.
   * 
   * @example
   * ```typescript
   * stream: true  // Para chat interfaces em tempo real
   * stream: false // Para processamento batch (padrão)
   * ```
   */
  stream?: boolean;
  
  /**
   * Contexto adicional para execução.
   * 
   * Objeto com dados extras que podem ser usados pelo agente
   * para enriquecer suas respostas ou tomar decisões. Pode
   * incluir informações de domínio, preferências do usuário, etc.
   * 
   * @example
   * ```typescript
   * context: {
   *   userPreferences: { language: 'pt-BR', tone: 'formal' },
   *   domain: 'healthcare',
   *   sessionId: 'abc123',
   *   previousTopics: ['diabetes', 'exercise']
   * }
   * ```
   */
  context?: Record<string, any>;
}

/**
 * Resultado da execução do agente.
 * 
 * Estrutura que encapsula todos os dados retornados após a execução
 * de um agente, incluindo conteúdo gerado, mensagens atualizadas,
 * metadados de execução e status de sucesso.
 * 
 * ## Estrutura do Resultado
 * 
 * - **content**: Resposta principal do agente (texto ou null em caso de erro)
 * - **messages**: Array atualizado com histórico completo
 * - **toolsUsed**: Lista de ferramentas utilizadas (se aplicável)
 * - **metadata**: Informações detalhadas sobre a execução
 * - **success**: Status booleano da operação
 * - **error**: Mensagem de erro detalhada (se aplicável)
 * 
 * ## Casos de Uso
 * 
 * - **Sucesso**: content contém resposta, success=true, error=undefined
 * - **Erro**: content=null, success=false, error contém detalhes
 * - **Execução Parcial**: content pode estar presente mesmo com warnings
 * 
 * @example
 * ```typescript
 * // Resultado de sucesso
 * const successResult: AgentExecutionResult = {
 *   content: 'Olá! Como posso ajudá-lo hoje?',
 *   messages: [
 *     { role: 'user', content: 'Olá' },
 *     { role: 'assistant', content: 'Olá! Como posso ajudá-lo hoje?' }
 *   ],
 *   toolsUsed: ['search'],
 *   metadata: {
 *     executionTime: 1250,
 *     startTime: new Date('2024-01-01T10:00:00Z'),
 *     endTime: new Date('2024-01-01T10:00:01.250Z'),
 *     tokensUsed: 45,
 *     cost: 0.002
 *   },
 *   success: true
 * };
 * 
 * // Resultado com erro
 * const errorResult: AgentExecutionResult = {
 *   content: null,
 *   messages: [
 *     { role: 'user', content: 'Calcule 2+2' }
 *   ],
 *   metadata: {
 *     executionTime: 500,
 *     startTime: new Date('2024-01-01T10:00:00Z'),
 *     endTime: new Date('2024-01-01T10:00:00.500Z')
 *   },
 *   success: false,
 *   error: 'Ferramenta calculator não encontrada'
 * };
 * ```
 * 
 * @see {@link Message} Para formato das mensagens
 * @see {@link AgentExecutionOptions} Para opções de execução
 */
export interface AgentExecutionResult {
  /**
   * Conteúdo principal gerado pelo agente.
   * 
   * Texto da resposta do agente ou null se houve erro na execução.
   * Em caso de sucesso, contém a resposta formatada para o usuário.
   * Em caso de erro, é sempre null e detalhes estão em error.
   * 
   * @example
   * ```typescript
   * // Sucesso
   * content: 'A resposta para 2+2 é 4.'
   * 
   * // Erro
   * content: null
   * ```
   */
  content: string | null;
  
  /**
   * Array de mensagens atualizado com o histórico completo.
   * 
   * Inclui todas as mensagens de entrada mais as respostas geradas
   * durante a execução. Útil para manter contexto em sessões longas.
   * 
   * @example
   * ```typescript
   * messages: [
   *   { role: 'user', content: 'Olá' },
   *   { role: 'assistant', content: 'Olá! Como posso ajudar?' },
   *   { role: 'user', content: 'Preciso de ajuda com TypeScript' },
   *   { role: 'assistant', content: 'Claro! Sobre o que especificamente?' }
   * ]
   * ```
   * 
   * @see {@link Message} Para formato das mensagens
   */
  messages: Message[];
  
  /**
   * Lista de ferramentas utilizadas durante a execução.
   * 
   * Array com nomes das ferramentas que foram chamadas pelo agente.
   * Útil para debugging, analytics e controle de custos.
   * 
   * @example
   * ```typescript
   * toolsUsed: ['calculator', 'search', 'code_analyzer']
   * ```
   */
  toolsUsed?: string[];
  
  /**
   * Metadados detalhados da execução.
   * 
   * Objeto com informações técnicas sobre a execução, incluindo
   * timing, custos, tokens e dados específicos do provedor LLM.
   * 
   * @example
   * ```typescript
   * metadata: {
   *   executionTime: 2340,        // ms
   *   startTime: new Date(),      // timestamp início
   *   endTime: new Date(),        // timestamp fim
   *   tokensUsed: 156,            // total de tokens
   *   cost: 0.0047,               // custo em USD
   *   model: 'gpt-4',             // modelo usado
   *   provider: 'openai'          // provedor LLM
   * }
   * ```
   */
  metadata?: {
    /**
     * Tempo total de execução em milissegundos.
     * 
     * Medido desde o início do processamento até a conclusão,
     * incluindo tempo de rede, processamento e geração de resposta.
     */
    executionTime: number;
    
    /**
     * Timestamp de início da execução.
     * 
     * Momento exato em que a execução começou, útil para
     * correlação com logs e debugging.
     */
    startTime: Date;
    
    /**
     * Timestamp de término da execução.
     * 
     * Momento exato em que a execução foi concluída,
     * combinado com startTime para calcular executionTime.
     */
    endTime: Date;
    
    /**
     * Total de tokens utilizados na execução.
     * 
     * Inclui tokens de entrada (prompt) e saída (resposta),
     * usado para controle de custos e limites de API.
     */
    tokensUsed?: number;
    
    /**
     * Custo estimado da execução em USD.
     * 
     * Calculado baseado nos tokens utilizados e preços
     * do provedor LLM. Útil para controle de orçamento.
     */
    cost?: number;
    
    /**
     * Informações adicionais específicas do provedor.
     * 
     * Pode incluir dados como modelo usado, provedor,
     * configurações específicas, IDs de requisição, etc.
     */
    [key: string]: any;
  };
  
  /**
   * Indica se a execução foi bem-sucedida.
   * 
   * true se o agente processou a requisição com sucesso,
   * false se houve algum erro que impediu a conclusão.
   * 
   * @example
   * ```typescript
   * success: true   // Execução normal
   * success: false  // Erro na execução
   * ```
   */
  success: boolean;
  
  /**
   * Mensagem de erro detalhada, se houver.
   * 
   * Descrição clara do que deu errado durante a execução.
   * Presente apenas quando success=false.
   * 
   * @example
   * ```typescript
   * error: 'API key inválida'
   * error: 'Modelo não encontrado: gpt-5'
   * error: 'Timeout na requisição após 30s'
   * error: 'Ferramenta calculator não registrada'
   * ```
   */
  error?: string;
}