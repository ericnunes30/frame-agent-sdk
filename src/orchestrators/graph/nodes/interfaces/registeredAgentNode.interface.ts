import type { IAgentConfig } from '@/agent/interfaces';

export interface IRegisteredAgentNodeOptions {
  agentId: string;
  configOverride?: Partial<IAgentConfig>;
}
