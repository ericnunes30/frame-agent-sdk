// src/agents/chat/chatAgent.ts
import { PromptBuilder } from '../../promptBuilder';
import type { PromptBuilderConfig } from '../../promptBuilder';

/**
 * Registro do modo 'chat'.
 *
 * Este módulo não exporta APIs — apenas registra um modo simples de conversa
 * no PromptBuilder ao ser importado.
 */
PromptBuilder.addPromptMode('chat', (config: PromptBuilderConfig) => {
  const header = '## Mode: Chat\nYou are a helpful, concise assistant.';
  const guidance = [
    'Answer directly and clearly.',
    'Prefer short paragraphs and bullet points when helpful.',
    'Ask for clarification if the request is ambiguous.',
  ].join('\n');
  const extra = config.additionalInstructions ? `\n${config.additionalInstructions}` : '';
  return [header, guidance, extra].filter(Boolean).join('\n\n');
});

// This module intentionally exports nothing. Importing it registers the 'chat' mode.
