import type { ContentPart, ImageUrlContentPart, Message, MessageContent, TextContentPart } from '@/memory/memory.interface';

export function isContentParts(content: MessageContent): content is ContentPart[] {
  return Array.isArray(content);
}

export function extractText(content: MessageContent): string {
  if (typeof content === 'string') return content;
  return content
    .filter((part): part is TextContentPart => part?.type === 'text')
    .map((part) => part.text ?? '')
    .join('\n');
}

export function extractTextFromMessage(message: Message): string {
  return extractText(message.content);
}

export function hasImages(content: MessageContent): boolean {
  if (!Array.isArray(content)) return false;
  return content.some((p) => p?.type === 'image_url');
}

function estimateBytesFromBase64(base64: string): number | undefined {
  if (!base64) return undefined;
  const normalized = base64.trim().replace(/\s/g, '');
  const padding = normalized.endsWith('==') ? 2 : normalized.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((normalized.length * 3) / 4) - padding);
}

function parseDataUrl(url: string): { mimeType?: string; bytes?: number } | undefined {
  if (!url.startsWith('data:')) return undefined;
  const comma = url.indexOf(',');
  if (comma === -1) return { mimeType: 'unknown' };
  const header = url.slice(5, comma);
  const data = url.slice(comma + 1);
  const [mimeTypeRaw, ...params] = header.split(';');
  const mimeType = mimeTypeRaw || 'unknown';
  const isBase64 = params.includes('base64');
  const bytes = isBase64 ? estimateBytesFromBase64(data) : undefined;
  return { mimeType, bytes };
}

function sanitizeImageUrlPart(part: ImageUrlContentPart): string {
  const url = part.image_url?.url ?? '';
  if (!url) return '[image omitted]';
  const dataUrl = parseDataUrl(url);
  if (dataUrl) {
    const mime = dataUrl.mimeType ?? 'unknown';
    const bytes = dataUrl.bytes;
    const bytesLabel = typeof bytes === 'number' ? ` bytes~${bytes}` : '';
    return `[image omitted mime=${mime}${bytesLabel}]`;
  }

  const previewLimit = 160;
  const preview = url.length > previewLimit ? `${url.slice(0, previewLimit - 3)}...` : url;
  return `[image_url ${preview}]`;
}

export function sanitizeForLogs(content: MessageContent): string {
  if (typeof content === 'string') return content;
  const parts = content.map((part) => {
    if (part?.type === 'text') return part.text ?? '';
    if (part?.type === 'image_url') return sanitizeImageUrlPart(part);
    return '[content omitted]';
  });
  return parts.join('\n');
}

