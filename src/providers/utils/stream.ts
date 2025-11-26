/**
 * Utilitário para processamento de streams de APIs de LLM.
 * 
 * Este módulo fornece funções utilitárias para trabalhar com streams
 * de dados retornados por APIs de modelos de linguagem, especialmente
 * útil para respostas em tempo real (streaming responses).
 */

/** 
 * Transforma um stream de chunks da API em um iterador assíncrono.
 * 
 * Esta função é um wrapper que facilita o processamento de streams
 * retornados por APIs de LLM, permitindo consumo fácil dos chunks
 * de dados em tempo real.
 * 
 * @param stream Stream de chunks retornado pela API.
 * Pode ser um AsyncIterable de qualquer tipo de dados.
 * 
 * @returns Um iterador assíncrono que emite cada chunk do stream.
 * 
 * @example
 * ```typescript
 * import { stream } from '@/providers/utils';
 * 
 * // Processar stream da OpenAI
 * const openaiStream = await openai.chat.completions.create({
 *   model: 'gpt-4',
 *   messages: [{ role: 'user', content: 'Conte uma história' }],
 *   stream: true
 * });
 * 
 * for await (const chunk of stream(openaiStream)) {
 *   const content = chunk.choices[0]?.delta?.content ?? '';
 *   process.stdout.write(content);
 * }
 * 
 * // Processar stream de provedor compatível
 * const compatibleStream = await compatibleProvider.chatCompletion({
 *   // ... config
 *   stream: true
 * });
 * 
 * for await (const chunk of stream(compatibleStream)) {
 *   console.log('Chunk received:', chunk);
 * }
 * ```
 * 
 * @remarks
 * - Útil para respostas em tempo real de LLMs
 * - Funciona com qualquer AsyncIterable
 * - Preserva o tipo original dos chunks
 * - Facilita debugging e logging de streams
 * 
 * @see {@link OpenAIProvider} Para uso com OpenAI
 * @see {@link OpenAICompatibleProvider} Para uso com provedores compatíveis
 */
export async function* stream<T>(stream: AsyncIterable<T>): AsyncIterable<T> {
  for await (const chunk of stream) {
    yield chunk;
  }
}