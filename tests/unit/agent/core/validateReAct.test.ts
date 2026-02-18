import { validateReActFormat } from '@/agent/core/validateReAct'

describe('validateReActFormat', () => {
  it('accepts a single Action block', () => {
    const output = [
      'Thought: I need to inspect a file first.',
      'Action: file_read = {"filePath":"src/app.ts"}',
    ].join('\n')

    const result = validateReActFormat(output)
    expect(result.isValid).toBe(true)
  })

  it('accepts Action + Action Input format with one action', () => {
    const output = [
      'Thought: I will read the file.',
      'Action: file_read',
      'Action Input: {"filePath":"src/app.ts"}',
    ].join('\n')

    const result = validateReActFormat(output)
    expect(result.isValid).toBe(true)
  })

  it('accepts Action without Thought', () => {
    const output = 'Action: toDoIst = {"action":"get_plan"}'

    const result = validateReActFormat(output)
    expect(result.isValid).toBe(true)
  })

  it('rejects multiple Action headers in the same model response', () => {
    const output = [
      'Thought: I will update plan and then edit a file.',
      'Action: toDoIst = {"action":"update_plan","plan":[{"step":"A","status":"in_progress"}]}',
      'Action: file_create = {"filePath":"a.txt","content":"x"}',
    ].join('\n')

    const result = validateReActFormat(output)
    expect(result.isValid).toBe(false)
    expect(result.error?.message).toContain('Only one "Action:" is allowed per turn')
  })
})
