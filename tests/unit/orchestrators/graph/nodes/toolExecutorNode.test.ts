import { GraphStatus } from '@/orchestrators/graph/core/enums/graphEngine.enum'
import { createToolExecutorNode } from '@/orchestrators/graph/nodes/toolExecutorNode'
import { ToolExecutor } from '@/tools/core/toolExecutor'

jest.mock('@/tools/core/toolExecutor', () => ({
  ToolExecutor: {
    execute: jest.fn(),
  },
}))

function createState(overrides: Record<string, unknown> = {}) {
  return {
    messages: [],
    data: {},
    status: GraphStatus.RUNNING,
    ...overrides,
  } as any
}

function createEngine() {
  return {
    emitTrace: jest.fn(),
    addMessage: jest.fn(),
  } as any
}

describe('ToolExecutorNode todo plan guardrails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('blocks non-toDoIst tool before initial plan is created', async () => {
    const node = createToolExecutorNode({
      todoPlanGuard: { enabled: true, minInitialPlanItems: 2 },
    })
    const engine = createEngine()
    const state = createState({
      lastToolCall: {
        toolName: 'file_read',
        params: { filePath: 'README.md' },
      },
    })

    const result = await node(state, engine)

    expect(ToolExecutor.execute).not.toHaveBeenCalled()
    expect(engine.addMessage).toHaveBeenCalled()
    expect(result.lastToolCall).toBeUndefined()
    expect((result.metadata as any)?.todoPlanGuard?.initialPlanReady).toBe(false)
    expect((result.metadata as any)?.validation?.error?.message).toContain('before using "file_read"')
  })

  it('blocks initial update_plan when plan is too short', async () => {
    const node = createToolExecutorNode({
      todoPlanGuard: { enabled: true, minInitialPlanItems: 2 },
    })
    const engine = createEngine()
    const state = createState({
      lastToolCall: {
        toolName: 'toDoIst',
        params: {
          action: 'update_plan',
          plan: [{ step: 'Only one step', status: 'in_progress' }],
        },
      },
    })

    const result = await node(state, engine)

    expect(ToolExecutor.execute).not.toHaveBeenCalled()
    expect(result.lastToolCall).toBeUndefined()
    expect((result.metadata as any)?.todoPlanGuard?.initialPlanReady).toBe(false)
    expect((result.metadata as any)?.validation?.error?.message).toContain('at least 2 items')
  })

  it('blocks update_plan with more than one in_progress item', async () => {
    const node = createToolExecutorNode({
      todoPlanGuard: { enabled: true, minInitialPlanItems: 2 },
    })
    const engine = createEngine()
    const state = createState({
      lastToolCall: {
        toolName: 'toDoIst',
        params: {
          action: 'update_plan',
          plan: [
            { step: 'Analyze request', status: 'in_progress' },
            { step: 'Implement API', status: 'in_progress' },
            { step: 'Validate output', status: 'pending' },
          ],
        },
      },
    })

    const result = await node(state, engine)

    expect(ToolExecutor.execute).not.toHaveBeenCalled()
    expect(result.lastToolCall).toBeUndefined()
    expect((result.metadata as any)?.validation?.error?.message).toContain('only one item can be "in_progress"')
  })

  it('blocks mass completion that skips in_progress transitions', async () => {
    const node = createToolExecutorNode({
      todoPlanGuard: { enabled: true, minInitialPlanItems: 2 },
    })
    const engine = createEngine()
    const state = createState({
      metadata: {
        todoPlanGuard: {
          enabled: true,
          initialPlanReady: true,
          minInitialPlanItems: 2,
        },
        taskList: {
          items: [
            { id: '1', title: 'Analyze request', status: 'in_progress' },
            { id: '2', title: 'Implement API', status: 'pending' },
            { id: '3', title: 'Validate output', status: 'pending' },
          ],
        },
      },
      lastToolCall: {
        toolName: 'toDoIst',
        params: {
          action: 'update_plan',
          plan: [
            { step: 'Analyze request', status: 'completed' },
            { step: 'Implement API', status: 'completed' },
            { step: 'Validate output', status: 'completed' },
          ],
        },
      },
    })

    const result = await node(state, engine)

    expect(ToolExecutor.execute).not.toHaveBeenCalled()
    expect(result.lastToolCall).toBeUndefined()
    expect((result.metadata as any)?.validation?.error?.message).toContain('do not move items directly from "pending" to "completed"')
  })

  it('marks guard as ready after valid initial update_plan', async () => {
    ;(ToolExecutor.execute as jest.Mock).mockResolvedValue({
      observation: 'Plan updated',
      metadata: {
        taskList: {
          items: [
            { id: '1', title: 'Analyze request', status: 'in_progress' },
            { id: '2', title: 'Implement API', status: 'pending' },
          ],
        },
      },
    })

    const node = createToolExecutorNode({
      todoPlanGuard: { enabled: true, minInitialPlanItems: 2 },
    })
    const engine = createEngine()
    const state = createState({
      lastToolCall: {
        toolName: 'toDoIst',
        params: {
          action: 'update_plan',
          plan: [
            { step: 'Analyze request', status: 'in_progress' },
            { step: 'Implement API', status: 'pending' },
          ],
        },
      },
    })

    const result = await node(state, engine)

    expect(ToolExecutor.execute).toHaveBeenCalledTimes(1)
    expect((result.metadata as any)?.todoPlanGuard?.initialPlanReady).toBe(true)
    expect((result.metadata as any)?.taskList?.items).toHaveLength(2)
  })

  it('allows non-toDoIst tool when guard is already ready', async () => {
    ;(ToolExecutor.execute as jest.Mock).mockResolvedValue({
      observation: 'file content',
      metadata: {},
    })

    const node = createToolExecutorNode({
      todoPlanGuard: { enabled: true, minInitialPlanItems: 2 },
    })
    const engine = createEngine()
    const state = createState({
      metadata: {
        todoPlanGuard: {
          enabled: true,
          initialPlanReady: true,
          minInitialPlanItems: 2,
        },
      },
      lastToolCall: {
        toolName: 'file_read',
        params: { filePath: 'README.md' },
      },
    })

    const result = await node(state, engine)

    expect(ToolExecutor.execute).toHaveBeenCalledTimes(1)
    expect((result.metadata as any)?.validation).toBeUndefined()
    expect((result.metadata as any)?.todoPlanGuard?.initialPlanReady).toBe(true)
  })
})
