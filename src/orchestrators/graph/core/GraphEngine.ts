import type { Message } from '@/memory';
import type { GraphDefinition, GraphNode, GraphRunResult } from '@/orchestrators/graph/core/interfaces/graphEngine.interface';
import type { IGraphState } from '@/orchestrators/graph/core/interfaces/graphState.interface';
import { GraphStatus } from '@/orchestrators/graph/core/enums/graphEngine.enum';
import { ChatHistoryManager, TokenizerService } from '@/memory';
import type { IChatHistoryManager } from '@/memory';
import type { AgentLLMConfig } from '@/agent';

export class GraphEngine {
  private readonly definition: GraphDefinition;
  private readonly maxSteps?: number;
  private readonly moduleName = 'GraphEngine';
  private chatHistoryManager?: IChatHistoryManager;
  private tokenizerService?: TokenizerService;
  private readonly llmConfig?: AgentLLMConfig;

  constructor(
    definition: GraphDefinition,
    options?: {
      maxSteps?: number;
      chatHistoryManager?: IChatHistoryManager;
    },
    llmConfig?: AgentLLMConfig
  ) {
    this.definition = definition;
    this.maxSteps = options?.maxSteps;
    this.llmConfig = llmConfig;

    if (options?.chatHistoryManager) {
      this.chatHistoryManager = options.chatHistoryManager;
    }

    if (llmConfig) {
      this.tokenizerService = new TokenizerService(llmConfig.model);
    }
  }

  public addMessage(message: Message): void {
    if (!this.chatHistoryManager) {
      console.warn(`[GraphEngine] ChatHistoryManager not initialized, message not added`);
      return;
    }

    this.chatHistoryManager.addMessage(message);
  }

  public getMessagesForLLM(): Message[] {
    if (!this.chatHistoryManager) {
      console.warn(`ChatHistoryManager not initialized, returning empty array`, this.moduleName);
      return [];
    }

    return this.chatHistoryManager.getTrimmedHistory();
  }

  private syncStateFromChatHistory(): void {
    if (!this.chatHistoryManager) {
      console.warn(`ChatHistoryManager not initialized, cannot sync state`, this.moduleName);
      return;
    }

    const trimmedHistory = this.chatHistoryManager.getTrimmedHistory();
  }

  private ensureChatHistoryManager(initialState: IGraphState): void {
    if (this.chatHistoryManager) {
      return;
    }

    if (!this.tokenizerService) {
      console.warn(`TokenizerService not available, cannot create ChatHistoryManager`, this.moduleName);
      return;
    }

    // maxTokens deve vir da configuração fornecida pelo desenvolvedor
    // Se não fornecido, undefined permite que ChatHistoryManager ou ProviderAdapter apliquem seus defaults
    const maxTokens = this.llmConfig?.defaults?.maxTokens;
    const config = {
      maxContextTokens: maxTokens,
      tokenizer: this.tokenizerService
    };

    this.chatHistoryManager = new ChatHistoryManager(config);
    this.syncMessagesToChatHistory(initialState.messages);
  }

  private syncMessagesToChatHistory(messages: Message[]): void {
    if (!this.chatHistoryManager) {
      console.warn(`ChatHistoryManager not initialized, cannot sync messages`, this.moduleName);
      return;
    }

    for (const message of messages) {
      this.chatHistoryManager.addMessage(message);
    }
  }

  public async execute(initialState: IGraphState): Promise<GraphRunResult> {
    this.ensureChatHistoryManager(initialState);
    console.log('GraphEngine executing...');
    this.syncStateFromChatHistory();

    let state = this.bootstrapState(initialState, this.definition.entryPoint);
    let steps = 0;

    while (state.status === GraphStatus.RUNNING) {
      this.assertMaxSteps(steps);
      const nodeName = state.currentNode;
      if (!nodeName) throw new Error('Current node is undefined');
      const node = this.definition.nodes[nodeName];
      if (!node) throw new Error(`Node '${nodeName}' not found`);

      const delta = await this.runNode(node, state);
      state = this.mergeState(state, delta);
      const next = this.resolveNext(nodeName, state, delta.nextNodeOverride);
      state = { ...state, nextNode: next };
      state = this.applyPause(state);
      if (state.status !== GraphStatus.RUNNING) break;

      state = { ...state, currentNode: next };
      steps += 1;
      if (state.status !== GraphStatus.RUNNING) break;
      if (next === this.definition.endNodeName) {
        state = { ...state, status: GraphStatus.FINISHED };
        break;
      }
    }

    return { state, status: state.status };
  }

  public async resume(savedState: IGraphState, userInput?: Message): Promise<GraphRunResult> {
    let resumed = { ...savedState };
    resumed = { ...resumed, shouldPause: false, status: GraphStatus.RUNNING };

    if (userInput) {
      this.addMessage(userInput);
      resumed = { ...resumed, messages: [...(resumed.messages ?? []), userInput] };
    }

    const hasNext = Boolean(resumed.nextNode);
    const entry = savedState.status === GraphStatus.PAUSED && hasNext
      ? (resumed.nextNode as string)
      : resumed.currentNode ?? this.definition.entryPoint;

    resumed = { ...resumed, currentNode: entry, nextNode: entry };
    return this.execute(resumed);
  }

  private async runNode(node: GraphNode, state: IGraphState) {
    try {
      const result = await node(state, this);
      return result;
    } catch (error) {
      console.error(`Node execution failed: ${(error as Error).message}`, this.moduleName);
      return { logs: [`Error in node: ${(error as Error).message}`], status: GraphStatus.ERROR };
    }
  }

  private mergeState(state: IGraphState, delta: Partial<IGraphState> & { shouldPause?: boolean; shouldEnd?: boolean; logs?: string[] }): IGraphState {
    let newState = { ...state };

    if (delta.messages && delta.messages.length > 0) {
      for (const message of delta.messages) {
        this.addMessage(message);
      }
      newState = { ...newState, messages: [...newState.messages, ...delta.messages] };
    }

    if (delta.data) newState = { ...newState, data: { ...newState.data, ...delta.data } };
    if (delta.metadata) newState = { ...newState, metadata: { ...(newState.metadata ?? {}), ...delta.metadata } };
    newState = { ...newState, lastToolCall: delta.lastToolCall ?? newState.lastToolCall };
    newState = { ...newState, lastModelOutput: delta.lastModelOutput ?? newState.lastModelOutput };
    newState = { ...newState, pendingAskUser: delta.pendingAskUser ?? newState.pendingAskUser };
    newState = { ...newState, shouldPause: delta.shouldPause ?? newState.shouldPause };

    if (delta.logs && delta.logs.length > 0) {
      const existing = newState.logs ?? [];
      newState = { ...newState, logs: [...existing, ...delta.logs] };
    }

    if (delta.status) newState = { ...newState, status: delta.status };
    if (delta.shouldEnd) newState = { ...newState, status: GraphStatus.FINISHED };

    return this.applyPause(newState);
  }

  private mergeMessages(state: IGraphState, messages?: Message[]): IGraphState {
    if (!messages || messages.length === 0) return state;
    return { ...state, messages: [...state.messages, ...messages] };
  }

  private mergeLogs(state: IGraphState, logs?: string[]): IGraphState {
    if (!logs || logs.length === 0) return state;
    const existing = state.logs ?? [];
    return { ...state, logs: [...existing, ...logs] };
  }

  private applyPause(state: IGraphState): IGraphState {
    if (state.shouldPause) {
      return { ...state, status: GraphStatus.PAUSED };
    }
    if (state.pendingAskUser) {
      return { ...state, status: GraphStatus.PAUSED };
    }
    return state;
  }

  private resolveNext(current: string, state: IGraphState, override?: string): string {
    if (override) return override;
    const edge = this.definition.edges[current];
    if (!edge) throw new Error(`No edge defined for node '${current}'`);
    const isString = typeof edge === 'string';
    if (isString) return edge as string;
    const conditional = edge as (s: IGraphState) => string;
    const next = conditional(state);
    if (!next) throw new Error(`Conditional edge from '${current}' returned empty target`);
    return next;
  }

  private bootstrapState(state: IGraphState, entryPoint: string): IGraphState {
    const messages = state.messages ?? [];
    const data = state.data ?? {};
    const metadata = state.metadata ?? {};
    const logs = state.logs ?? [];
    return {
      ...state,
      messages,
      data,
      metadata,
      logs,
      status: GraphStatus.RUNNING,
      currentNode: state.currentNode ?? entryPoint,
      nextNode: state.nextNode ?? entryPoint,
    };
  }

  private assertMaxSteps(count: number): void {
    if (!this.maxSteps) return;
    if (count < this.maxSteps) return;
    throw new Error(`Exceeded max steps (${this.maxSteps})`);
  }
}
