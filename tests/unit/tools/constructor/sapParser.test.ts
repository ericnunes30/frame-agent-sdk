import { SAPParser } from '@/tools/constructor/sapParser'

describe('SAPParser multiple actions guard', () => {
  it('rejects multiple toDoIst actions in same response', () => {
    const raw = [
      'Thought: updating plan twice.',
      'Action: toDoIst = {"action":"update_plan","plan":[{"step":"A","status":"in_progress"}]}',
      'Action: toDoIst = {"action":"update_plan","plan":[{"step":"A","status":"completed"}]}',
    ].join('\n')

    const parsed = SAPParser.parseAndValidate(raw)
    expect('message' in parsed).toBe(true)
    if ('message' in parsed) {
      expect(parsed.message).toContain('should never be called multiple times in parallel')
    }
  })

  it('rejects multiple mixed tool actions in same response', () => {
    const raw = [
      'Thought: doing two things.',
      'Action: toDoIst = {"action":"get_plan"}',
      'Action: file_read = {"filePath":"src/a.ts"}',
    ].join('\n')

    const parsed = SAPParser.parseAndValidate(raw)
    expect('message' in parsed).toBe(true)
    if ('message' in parsed) {
      expect(parsed.message).toContain('Only one tool action is allowed per model invocation')
    }
  })
})

