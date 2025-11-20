import 'dotenv/config'
import 'tsconfig-paths/register'
import '../src/agents'
import { ChatHistoryManager, TokenizerService } from '../src/memory'
import { StepsOrchestrator } from '../src/orchestrators/steps/stepsOrchestrator'
import type { StepsDeps, StepsConfig } from '../src/orchestrators/steps/interfaces'
import type { AgentInfo, PromptMode, ToolSchema } from '../src/promptBuilder'
import { PromptBuilder } from '../src/promptBuilder'
import type { LLM } from '../src/llm'
import { toolRegistry } from '../src/tools/core/toolRegistry'
import { TodoListTool } from '../src/tools'
import { generateTypedSchema } from '../src/tools'

function createMockLLM(): LLM {
  const mock: any = {
    invoke: async (args: { messages: Array<{ role: string; content: string }>; systemPrompt?: string }) => {
      const assistantCount = (args.messages || []).filter((m) => m.role === 'assistant').length
      if (assistantCount === 0) {
        const thought = 'Thought: Inicializar a lista de tarefas'
        const action = 'Action: todo_list = { "action": "create", "tasks": ["Planejar Sprint", "Configurar CI"], "defaultStatus": "pending" }'
        return { content: `${thought}\n${action}` }
      }
      const thought2 = 'Thought: Lista criada, finalizar'
      const finalAction = 'Action: final_answer = { "answer": "Lista criada e exibida no System Prompt." }'
      return { content: `${thought2}\n${finalAction}` }
    },
  }
  return mock as unknown as LLM
}

async function main(): Promise<void> {
  toolRegistry.register(new TodoListTool())

  const agentInfo: AgentInfo = { name: 'TodoStepsDemo', goal: 'Demonstrar manipulação de tarefas', backstory: 'Demo de Steps com todo_list' }
  const mode = 'react' as PromptMode
  const tools: ToolSchema[] = [{ name: 'todo_list', description: 'Gerencia uma lista de tarefas', parameters: generateTypedSchema(new TodoListTool()) }]
  const config: StepsConfig = { mode, agentInfo, additionalInstructions: 'Use a ferramenta todo_list para manter a seção Task List atualizada.', tools }

  const tokenizer = new TokenizerService('mock-model')
  const memory = new ChatHistoryManager({ maxContextTokens: 8192, tokenizer })
  const deps: StepsDeps = { memory, llm: createMockLLM() }

  const orchestrator = new StepsOrchestrator(deps, config)
  const userInput = 'Por favor, crie uma lista de tarefas inicial.'
  const result = await orchestrator.runFlow(userInput, { maxTurns: 3 })

  const finalPrompt = PromptBuilder.buildSystemPrompt(config)
  // eslint-disable-next-line no-console
  console.log('Final:', result.final)
  // eslint-disable-next-line no-console
  console.log('TaskList items:', config.taskList?.items)
  // eslint-disable-next-line no-console
  console.log('SystemPrompt has Task List?:', /## Task List/.test(finalPrompt))
}

if (require.main === module) {
  main().catch((err) => { console.error(err); process.exitCode = 1 })
}
