import { ToolBase } from '@/tools/constructor/toolBase'
import type { IToolParams, IToolResult } from '@/tools/core/interfaces'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

type PlanStatus = 'pending' | 'in_progress' | 'completed'

interface PlanItem {
  id: string
  title: string
  status: PlanStatus
}

interface PlanItemInput {
  step: string
  status: PlanStatus
}

interface PersistedTodoState {
  taskList?: {
    items?: Array<{
      id?: unknown
      title?: unknown
      status?: unknown
    }>
  }
  nextId?: unknown
}

/**
 * Parameters for ToDoIst execution-plan management.
 *
 * This tool intentionally follows a Codex-like declarative plan API:
 * - `get_plan`: returns the current plan
 * - `update_plan`: replaces the full plan with a new ordered list
 */
export class ToDoIstParams implements IToolParams {
  public action!: string
  public plan?: PlanItemInput[]
  public explanation?: string

  static schemaProperties = {
    action: {
      type: 'string',
      required: true,
      enum: ['get_plan', 'update_plan']
    },
    plan: {
      type: 'array',
      required: false,
      items: {
        type: 'object'
      }
    },
    explanation: {
      type: 'string',
      required: false
    }
  }
}

export interface TodoListMetadata {
  taskList: {
    items: PlanItem[]
  }
}

export class ToDoIstTool extends ToolBase<
  ToDoIstParams,
  IToolResult<TodoListMetadata>
> {
  public readonly name = 'toDoIst'
  public readonly description =
    'Declarative execution-plan manager (Codex-like). Actions: get_plan, update_plan. update_plan requires plan: [{ step, status }], replaces the full plan order, and supports statuses pending | in_progress | completed (max 1 in_progress). Optional explanation can describe why the plan changed. Call update_plan at most once per model invocation (no parallel plan writes).'
  public readonly parameterSchema = ToDoIstParams

  private currentTaskList: TodoListMetadata['taskList'] = { items: [] }
  private nextId = 0
  private readonly persistencePath: string

  constructor() {
    super()

    const frameDir = path.join(os.homedir(), '.frame')
    if (!fs.existsSync(frameDir)) {
      fs.mkdirSync(frameDir, { recursive: true })
    }

    this.persistencePath = path.join(frameDir, 'todoist.json')
    this.loadFromDisk()
  }

  public getCurrentTasks(): TodoListMetadata['taskList'] {
    return this.currentTaskList
  }

  private getNextId(): string {
    return (this.nextId++).toString()
  }

  private saveToDisk(): void {
    const data = {
      taskList: this.currentTaskList,
      nextId: this.nextId
    }
    fs.writeFileSync(this.persistencePath, JSON.stringify(data, null, 2), 'utf-8')
  }

  private loadFromDisk(): void {
    if (!fs.existsSync(this.persistencePath)) {
      return
    }

    try {
      const persisted = JSON.parse(
        fs.readFileSync(this.persistencePath, 'utf-8')
      ) as PersistedTodoState

      const rawItems = Array.isArray(persisted.taskList?.items)
        ? persisted.taskList!.items!
        : []

      const normalizedItems: PlanItem[] = rawItems
        .map((item) => {
          const id = typeof item.id === 'string' ? item.id : String(item.id ?? '')
          const title = typeof item.title === 'string' ? item.title : String(item.title ?? '')
          const status = this.normalizeStatus(item.status)

          if (!id || !title || !status) {
            return null
          }

          return { id, title, status }
        })
        .filter((item): item is PlanItem => item !== null)

      this.currentTaskList = { items: normalizedItems }
      this.nextId = this.deriveNextId(persisted.nextId, normalizedItems)
    } catch {
      this.currentTaskList = { items: [] }
      this.nextId = 0
    }
  }

  private deriveNextId(rawNextId: unknown, items: PlanItem[]): number {
    if (typeof rawNextId === 'number' && Number.isFinite(rawNextId) && rawNextId >= 0) {
      return Math.trunc(rawNextId)
    }

    const numericIds = items
      .map((item) => Number(item.id))
      .filter((value) => Number.isFinite(value) && value >= 0)

    if (numericIds.length === 0) {
      return 0
    }

    return Math.max(...numericIds) + 1
  }

  private normalizeStatus(rawStatus: unknown): PlanStatus | null {
    if (rawStatus === 'pending' || rawStatus === 'in_progress' || rawStatus === 'completed') {
      return rawStatus
    }

    return null
  }

  private buildPlanObservation(prefix: string): string {
    const items = this.currentTaskList.items
    const pending = items.filter((item) => item.status === 'pending').length
    const inProgress = items.filter((item) => item.status === 'in_progress').length
    const completed = items.filter((item) => item.status === 'completed').length

    const lines = items
      .map((item) => `ID: ${item.id} - "${item.title}" (${item.status})`)
      .join('\n')

    return `${prefix}\nResumo: pending=${pending}, in_progress=${inProgress}, completed=${completed}\nItens (${items.length}):\n${lines || '(empty)'}`
  }

  private normalizeIncomingPlan(plan: unknown): {
    isValid: boolean
    issue?: string
    items?: PlanItem[]
  } {
    if (!Array.isArray(plan)) {
      return {
        isValid: false,
        issue: 'update_plan requires "plan" as an array of { step, status }.'
      }
    }

    const previousIdsByTitle = new Map<string, string[]>()
    for (const item of this.currentTaskList.items) {
      const queue = previousIdsByTitle.get(item.title) ?? []
      queue.push(item.id)
      previousIdsByTitle.set(item.title, queue)
    }

    const reusedIds = new Set<string>()
    const normalizedItems: PlanItem[] = []

    for (let index = 0; index < plan.length; index++) {
      const rawItem = plan[index] as Partial<PlanItemInput> | null | undefined
      const step = typeof rawItem?.step === 'string' ? rawItem.step.trim() : ''
      const status = this.normalizeStatus(rawItem?.status)

      if (!step) {
        return {
          isValid: false,
          issue: `Invalid plan item at index ${index}: "step" must be a non-empty string.`
        }
      }

      if (!status) {
        return {
          isValid: false,
          issue: `Invalid plan item at index ${index}: "status" must be pending, in_progress, or completed.`
        }
      }

      const reusableQueue = previousIdsByTitle.get(step)
      let id: string | undefined

      while (reusableQueue && reusableQueue.length > 0) {
        const candidate = reusableQueue.shift()!
        if (!reusedIds.has(candidate)) {
          id = candidate
          break
        }
      }

      if (!id) {
        id = this.getNextId()
      }

      reusedIds.add(id)
      normalizedItems.push({ id, title: step, status })
    }

    const inProgressCount = normalizedItems.filter(
      (item) => item.status === 'in_progress'
    ).length
    if (inProgressCount > 1) {
      return {
        isValid: false,
        issue: 'Invalid plan: only one item can be "in_progress" at a time.'
      }
    }

    return {
      isValid: true,
      items: normalizedItems
    }
  }

  public async execute(
    params: ToDoIstParams
  ): Promise<IToolResult<TodoListMetadata>> {
    switch (params.action) {
      case 'get_plan': {
        return {
          observation: this.buildPlanObservation('Current plan'),
          metadata: { taskList: this.currentTaskList }
        }
      }

      case 'update_plan': {
        const parsed = this.normalizeIncomingPlan(params.plan)
        if (!parsed.isValid || !parsed.items) {
          return {
            observation: parsed.issue ?? 'Invalid update_plan payload.',
            metadata: { taskList: this.currentTaskList }
          }
        }

        this.currentTaskList = { items: parsed.items }
        this.saveToDisk()

        const explanationText =
          typeof params.explanation === 'string' && params.explanation.trim().length > 0
            ? `Reason: ${params.explanation.trim()}\n`
            : ''

        return {
          observation: `${explanationText}${this.buildPlanObservation('Plan updated')}`,
          metadata: { taskList: this.currentTaskList }
        }
      }

      default:
        return {
          observation: `Unknown action "${params.action}". Allowed actions: get_plan, update_plan.`,
          metadata: { taskList: this.currentTaskList }
        }
    }
  }
}
