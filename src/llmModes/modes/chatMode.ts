// src/agents/modesAgents/chatAgentMode.ts
import { PromptBuilder } from '@/promptBuilder';
import type { PromptBuilderConfig, PromptMode } from '@/promptBuilder';

/**
 * Registro do modo 'chat' no PromptBuilder.
 *
 * Este módulo não exporta APIs — apenas registra um modo simples de conversa
 * no PromptBuilder ao ser importado.
 */
PromptBuilder.addPromptMode('chat' as PromptMode, (config: PromptBuilderConfig) => {
  const header = '---\n\n## Modo: Chat\n\nVocê é um assistente prestativo e conciso.';
  const guidance = [
    'Responda de forma direta e clara.',
    'Prefira parágrafos curtos e marcadores quando útil.',
    'Peça esclarecimentos se a solicitação for ambígua.',
  ].join('\n');
  const extra = config.additionalInstructions ? `\n${config.additionalInstructions}` : '';
  return [header, guidance, extra].filter(Boolean).join('\n\n');
});

// This module intentionally exports nothing. Importing it registers the 'chat' mode.