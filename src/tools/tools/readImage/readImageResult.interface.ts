import type { ContentPart } from '@/memory';

export interface ReadImageMeta {
  mimeType: string;
  bytes: number;
  width?: number;
  height?: number;
  hash?: string;
}

export interface ReadImageResult {
  /**
   * Conteudo pronto para ser anexado em uma mensagem multimodal
   * (o host ja deve ter convertido para `data:` quando aplicavel).
   */
  contentParts: ContentPart[];
  meta: ReadImageMeta;
  imageRef?: string;
}

