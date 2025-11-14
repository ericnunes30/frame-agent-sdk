// src/orchestrators/workflows/steps/agentStep/index.ts
import { AgentLLMExecutor } from './AgentLLMExecutor';
import { AgentLLMFactory } from './AgentLLMFactory';
import type { LLMConfig, AgentStepOptions } from './interfaces';

export { AgentLLMExecutor, AgentLLMFactory, LLMConfig, AgentStepOptions };

// Factory function para conveniência
export function createAgentStep(
  id: string,
  agentConfig: string | any,
  options?: AgentStepOptions
): AgentLLMExecutor {
  return new AgentLLMExecutor(id, agentConfig, options);
}