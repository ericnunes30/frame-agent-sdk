/**
 * Transforma um stream de chunks da API em um iterador assíncrono.
 * @param stream O stream retornado pela API.
 * @returns Um iterador assíncrono que emite cada chunk do stream.
 */
export async function* stream<T>(stream: AsyncIterable<T>): AsyncIterable<T> {
  for await (const chunk of stream) {
    yield chunk;
  }
}