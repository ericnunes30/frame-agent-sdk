import type { IAgentConfig } from '@/agents/interfaces';

export interface IRegisteredAgentNodeOptions {
  agentId: string;
  configOverride?: Partial<IAgentConfig>;
}
