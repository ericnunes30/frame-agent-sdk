import type { PromptBuilderConfig, PromptMode, AgentInfo, ToolSchema } from '@/promptBuilder';
import type { LLM } from '@/llm';
import type { LLMConfig } from '../../core/interfaces/llmConfig.interface';

export interface IAgentNodeOptions {
  llm: LLM | LLMConfig;
  promptConfig?: PromptBuilderConfig;
  mode?: PromptMode;
  agentInfo?: AgentInfo;
  additionalInstructions?: string;
  tools?: ToolSchema[];
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}
