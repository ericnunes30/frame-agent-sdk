import { AgentRegistryInstance } from '../../../agents/registry/AgentRegistry';
import type { IAgent } from '../../../agents/interfaces';
import type { GraphNode, GraphNodeResult } from '../core/interfaces/graphEngine.interface';
import type { IRegisteredAgentNodeOptions } from './interfaces/registeredAgentNode.interface';

export function createRegisteredAgentNode(options: IRegisteredAgentNodeOptions): GraphNode {
  assertOptions(options);
  const agentId = options.agentId;

  return async (state): Promise<GraphNodeResult> => {
    const agent = resolveAgent(agentId, options);
    if (!agent) return { logs: [`Agent '${agentId}' not available`], shouldPause: true };

    const result = await agent.execute(state.messages ?? [], {
      additionalInstructions: options?.configOverride?.additionalInstructions,
      tools: options?.configOverride?.tools,
    });

    let updates: GraphNodeResult = { lastModelOutput: result.content };
    const metadata = result.metadata as Record<string, unknown> | undefined;
    if (metadata) updates = { ...updates, metadata };
    const messages = Array.isArray(result.messages) ? result.messages : [];
    if (messages.length > 0) updates = { ...updates, messages: [...(state.messages ?? []), ...messages] };
    console.log(`Registered agent '${agentId}' executed`, 'RegisteredAgentNode');
    return updates;
  };
}

function resolveAgent(agentId: string, options: IRegisteredAgentNodeOptions): IAgent | null {
  const agent = AgentRegistryInstance.get(agentId, options.configOverride);
  if (agent) return agent;
  console.warn(`Agent '${agentId}' not found in registry`, 'RegisteredAgentNode');
  return null;
}

function assertOptions(options: IRegisteredAgentNodeOptions): void {
  if (!options) throw new Error('Registered agent node options are required');
  if (!options.agentId) throw new Error('agentId is required');
}
