// src/orchestrators/index.ts

// Sistema Steps existente (mantido intacto)
export * from './steps/interfaces';
export * from './steps/stepsOrchestrator';
export * from './steps/steps';

export * from './graph';

/**
 * Exports dos orquestradores e steps.
 *
 * Este módulo contempla:
 * - StepsOrchestrator: Sistema existente para workflows simples (mantido intacto)
 * - WorkflowOrchestrator: Novo sistema avançado para workflows complexos
 * - GraphEngine: Motor de grafos para dependências complexas (LangGraph-inspired)
 * - Supervisor: Sistema hierárquico para múltiplos agentes (CrewAI-inspired)
 * - Builders: Interface fluida para construção de workflows
 * - Compatibilidade total zero breaking changes
 */
