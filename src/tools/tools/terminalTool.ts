import { ToolBase } from '@/tools/constructor/toolBase';
import { IToolParams } from '@/tools/core/interfaces';
import { randomUUID } from 'crypto';
import treeKill from 'tree-kill';

const DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30 minutos em ms
const DANGEROUS_COMMANDS: readonly string[] = ['rm -rf', 'format', 'del', 'shutdown', ':(){ :|:& };:'];

// Buffer circular para armazenar output de processos background
class OutputBuffer {
  private buffer: string[] = [];
  private maxSize: number = 1000;

  add(data: string): void {
    this.buffer.push(data);
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift();
    }
  }

  get(lines?: number): string {
    if (lines) {
      return this.buffer.slice(-lines).join('');
    }
    return this.buffer.join('');
  }

  getLastLines(count: number): string[] {
    return this.buffer.slice(-count);
  }

  clear(): void {
    this.buffer = [];
  }

  size(): number {
    return this.buffer.length;
  }
}

// Interface para informações do processo
interface ProcessInfo {
  process: any; // Usando any devido à importação dinâmica do execa
  createdAt: number;
  command: string;
  background: boolean;
  interactive: boolean;
  sessionId: string;
  outputBuffer: OutputBuffer;
  timeoutId?: NodeJS.Timeout;
}

// Map global para processos ativos
const processMap = new Map<string, ProcessInfo>();

function addProcess(sessionId: string, process: any, command: string, background: boolean, interactive: boolean, timeoutMs: number): void {
  if (!sessionId) {
    throw new Error('SessionId é obrigatório para addProcess');
  }

  const outputBuffer = new OutputBuffer();

  // Configurar captura de output para processos background
  if (background) {
    process.stdout?.on('data', (data: Buffer) => {
      outputBuffer.add(data.toString());
    });

    process.stderr?.on('data', (data: Buffer) => {
      outputBuffer.add(data.toString());
    });
  }

  let timeoutId: NodeJS.Timeout | undefined;

  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      const info = processMap.get(sessionId);
      if (info && info.process.pid) {
        treeKill(info.process.pid, 'SIGTERM', (err) => {
          if (err) {
            try {
              info.process.kill();
            } catch { }
          }
        });
      }
      cleanupProcess(sessionId);
    }, timeoutMs);
  }

  const info: ProcessInfo = {
    process,
    createdAt: Date.now(),
    command,
    background,
    interactive,
    sessionId,
    outputBuffer,
    timeoutId,
  };

  processMap.set(sessionId, info);
}

function getProcess(sessionId: string): ProcessInfo | undefined {
  if (!sessionId) {
    return undefined;
  }
  return processMap.get(sessionId);
}

function removeProcess(sessionId: string): void {
  if (!sessionId) {
    return;
  }
  processMap.delete(sessionId);
}

function listProcesses(): Array<{
  sessionId: string;
  createdAt: number;
  command: string;
  background: boolean;
  interactive: boolean;
}> {
  return Array.from(processMap.entries()).map(([sessionId, info]) => ({
    sessionId,
    createdAt: info.createdAt,
    command: info.command,
    background: info.background,
    interactive: info.interactive,
  }));
}

function validateCommandSafety(command: string): void {
  if (DANGEROUS_COMMANDS.some((dangerous: string) => command.includes(dangerous))) {
    throw new Error('Comando bloqueado por segurança');
  }
}

function detectWaitingInput(output: string): boolean {
  if (!output || output.trim().length === 0) {
    return false;
  }

  const inputPrompts = [
    ':', '?', '>', '$', '#', '=>', '>>>',
    'Password:', 'password:', 'Enter password', 'Enter password:',
    'Enter:', 'enter:', 'Input:', 'input:',
    'Choose:', 'choose:', 'Select:', 'select:',
    'Continue?', 'continue?', 'Proceed?', 'proceed?',
    'Are you sure?', 'are you sure?', '(y/n)', '(Y/n)',
    'What is your', 'what is your', 'Project name:', 'project name:',
    'Author name:', 'author name:', 'Description:', 'description:'
  ];

  const lastLines = output.split('\n').slice(-3).join('\n').toLowerCase();

  return inputPrompts.some(prompt =>
    lastLines.includes(prompt.toLowerCase()) &&
    lastLines.trim().endsWith(prompt.toLowerCase()) ||
    lastLines.includes(prompt.toLowerCase()) &&
    lastLines.slice(-1).match(/[:?>$#]$/)
  );
}

function cleanupProcess(sessionId: string): void {
  const info = getProcess(sessionId);
  if (!info) {
    return;
  }
  if (info.timeoutId) {
    clearTimeout(info.timeoutId);
  }
  removeProcess(sessionId);
}

function setupProcessListeners(sessionId: string): void {
  const info = getProcess(sessionId);
  if (!info) {
    return;
  }
  const proc = info.process;
  proc.on('close', () => cleanupProcess(sessionId));
  proc.on('error', (err: Error) => {
    cleanupProcess(sessionId);
  });
}

// Resultado padronizado das operações do terminal
interface ITerminalResult {
  success: boolean;
  message?: string;
  sessionId?: string;
  output?: string;
  status?: 'running' | 'waiting_input' | 'completed' | 'error';
  exitCode?: number;
  timedOut?: boolean;
  processes?: Array<{
    sessionId: string;
    createdAt: number;
    command: string;
    background: boolean;
    interactive: boolean;
  }>;
}

// Mensagens de erro padronizadas
enum TerminalErrorMessages {
  ACTION_REQUIRED = 'Ação é obrigatória',
  ACTION_INVALID = 'Ação inválida',
  COMMAND_REQUIRED = 'Comando é obrigatório para ação create',
  SESSION_REQUIRED = 'SessionId é obrigatório',
  SESSION_NOT_FOUND = 'Sessão de processo não encontrada',
  PROCESS_INACTIVE = 'Processo inativo ou stdin não disponível',
  INPUT_REQUIRED = 'Input é obrigatório para ação send',
  PROCESS_NOT_FOUND = 'Processo não encontrado',
  DANGEROUS_COMMAND = 'Comando bloqueado por segurança',
}

interface ITerminalParams extends IToolParams {
  action: 'create' | 'send' | 'kill' | 'list' | 'status' | 'getOutput';
  sessionId?: string;
  command?: string;
  input?: string;
  background?: boolean;
  interactive?: boolean;
  lines?: number;
  shell?: string;
  timeout?: number;
}

class TerminalParams {
  static schemaProperties = {
    action: { type: 'string', enum: ['create', 'send', 'kill', 'list', 'status', 'getOutput'], required: true },
    sessionId: { type: 'string', required: false },
    command: { type: 'string', required: false },
    input: { type: 'string', required: false },
    background: { type: 'boolean', required: false },
    interactive: { type: 'boolean', required: false },
    lines: { type: 'number', required: false },
    shell: { type: 'string', required: false },
    timeout: { type: 'number', required: false }
  } as const;

  static validate(params: any): { isValid: boolean; error?: string } {
    return { isValid: true };
  }
}

export const TerminalTool = new class extends ToolBase<ITerminalParams, ITerminalResult> {
  public readonly name = 'terminal';
  public readonly description = `Gerencia múltiplas sessões de terminal com suporte a background, interatividade e status assíncrono.
  
## Parâmetros
- action: create|send|kill|list|status|getOutput
- sessionId: (opcional) ID da sessão única
- command: (obrigatório para create) comando a executar
- input: (obrigatório para send) texto a enviar
- background: (default: false) executa em background (ideal para servidores/long-running)
- interactive: (default: false) modo interativo (mantém stdin aberto)
- timeout: (opcional) tempo em ms para matar processo background automaticamente (padrão: 30min)

## Fluxo Recomendado
1. create: inicia processo (use background:true para servidores)
2. status: verifica estado real (running/waiting_input/completed/error)
3. send: envia input se status for "waiting_input"
4. Para pausar o agente, use a ferramenta "sleep" em vez do statusTimeout`;
  public readonly parameterSchema = TerminalParams;

  public async execute(params: ITerminalParams): Promise<ITerminalResult> {
    if (!params.action) {
      return { success: false, message: TerminalErrorMessages.ACTION_REQUIRED };
    }

    const validation = TerminalParams.validate(params);
    if (!validation.isValid) {
      return { success: false, message: validation.error };
    }

    switch (params.action) {
      case 'create':
        if (!params.command) {
          return { success: false, message: TerminalErrorMessages.COMMAND_REQUIRED };
        }
        break;
      case 'send':
        if (!params.sessionId) {
          return { success: false, message: TerminalErrorMessages.SESSION_REQUIRED };
        }
        if (!params.input) {
          return { success: false, message: TerminalErrorMessages.INPUT_REQUIRED };
        }
        break;
      case 'kill':
      case 'status':
      case 'getOutput':
        if (!params.sessionId) {
          return { success: false, message: TerminalErrorMessages.SESSION_REQUIRED };
        }
        break;
      case 'list':
        break;
      default:
        return { success: false, message: TerminalErrorMessages.ACTION_INVALID };
    }

    const handlers: Record<ITerminalParams['action'], (params: ITerminalParams) => Promise<ITerminalResult>> = {
      create: this.handleCreate.bind(this),
      send: this.handleSend.bind(this),
      kill: this.handleKill.bind(this),
      list: this.handleList.bind(this),
      status: this.handleStatus.bind(this),
      getOutput: this.handleGetOutput.bind(this),
    };

    try {
      const handler = handlers[params.action];
      if (!handler) {
        return { success: false, message: TerminalErrorMessages.ACTION_INVALID };
      }

      return await handler(params);
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro interno no terminal' };
    }
  }

  public async handleCreate(params: ITerminalParams): Promise<ITerminalResult> {
    if (!params.command) {
      return { success: false, message: TerminalErrorMessages.COMMAND_REQUIRED };
    }

    validateCommandSafety(params.command);

    const timeoutMs = (params.background || params.interactive) ? (params.timeout ?? DEFAULT_TIMEOUT) : 0;
    const sessionId = params.sessionId ?? randomUUID();
    const isInteractive = params.interactive ?? false;
    const isBackgroundProcess = params.background ?? false;
    const shellOptions = params.shell ?
      { shell: params.shell } :
      { shell: process.platform === 'win32' ? 'bash' : true };

    if (isBackgroundProcess) {
      const { spawn } = await import('child_process');
      const childProcess = spawn(params.command, {
        ...shellOptions,
        detached: true,
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true
      });

      addProcess(sessionId, childProcess, params.command, true, isInteractive, timeoutMs);
      setupProcessListeners(sessionId);
      childProcess.unref?.();

      return {
        success: true,
        sessionId,
        message: `Processo em background criado${isInteractive ? ' (interativo)' : ''}. PID: ${childProcess.pid}. (Active processes: ${processMap.size})`,
      };
    }

    const { spawn } = await import('child_process');
    const childProcess = spawn(params.command, {
      ...shellOptions,
      stdio: 'pipe',
      windowsHide: true
    });

    addProcess(sessionId, childProcess, params.command, false, isInteractive, timeoutMs);
    setupProcessListeners(sessionId);

    return {
      success: true,
      sessionId,
      message: `Processo iniciado. Use 'status' para verificar progresso ou 'getOutput' para ver output. PID: ${childProcess.pid}. (Active processes: ${processMap.size})`,
      status: 'running'
    };
  }

  public async handleSend(params: ITerminalParams): Promise<ITerminalResult> {
    if (!params.sessionId) {
      return { success: false, message: TerminalErrorMessages.SESSION_REQUIRED };
    }

    if (!params.input) {
      return { success: false, message: TerminalErrorMessages.INPUT_REQUIRED };
    }

    const processInfo = getProcess(params.sessionId);
    if (!processInfo) {
      return { success: false, message: TerminalErrorMessages.SESSION_NOT_FOUND };
    }

    const childProcess = processInfo.process;
    if (!childProcess.stdin) {
      return { success: false, message: TerminalErrorMessages.PROCESS_INACTIVE };
    }

    childProcess.stdin.write(`${params.input}\n`);

    if (processInfo.background) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const recentOutput = processInfo.outputBuffer.getLastLines(5).join('');
          resolve({
            success: true,
            message: `Input enviado ao processo: ${params.input}`,
            sessionId: params.sessionId,
            output: recentOutput || 'Nenhum output capturado após o input'
          });
        }, 500);
      });
    }

    return {
      success: true,
      message: `Input enviado ao processo: ${params.input}`,
      sessionId: params.sessionId
    };
  }

  public async handleKill(params: ITerminalParams): Promise<ITerminalResult> {
    if (!params.sessionId) {
      return { success: false, message: TerminalErrorMessages.SESSION_REQUIRED };
    }

    const processInfo = getProcess(params.sessionId);
    if (!processInfo) {
      return { success: false, message: TerminalErrorMessages.SESSION_NOT_FOUND };
    }

    const command = processInfo.command;
    const pid = processInfo.process.pid;

    if (!pid) {
      processInfo.process.kill();
      cleanupProcess(params.sessionId);
      return {
        success: true,
        message: `Processo finalizado: ${command}. (Remaining active processes: ${processMap.size})`,
        sessionId: params.sessionId
      };
    }

    return new Promise((resolve) => {
      treeKill(pid, 'SIGTERM', (err) => {
        if (err) {
          try {
            processInfo.process.kill();
          } catch (killErr: any) {
            // Fallback silencioso
          }
        }
        cleanupProcess(params.sessionId!);
        resolve({
          success: true,
          message: `Processo e filhos finalizados: ${command}. (Remaining active processes: ${processMap.size})`,
          sessionId: params.sessionId
        });
      });
    });
  }

  public formatProcessList(processes: Array<{
    sessionId: string;
    createdAt: number;
    command: string;
    background: boolean;
    interactive: boolean;
  }>): string {
    if (processes.length === 0) {
      return "Nenhum processo ativo.";
    }

    const header = "Processos ativos:\n";
    const processLines = processes.map(p => {
      const mode = p.background ? 'background' : 'foreground';
      const interactive = p.interactive ? ' [INTERACTIVE]' : '';
      const uptime = Math.floor((Date.now() - p.createdAt) / 1000);
      const uptimeStr = uptime < 60 ? `${uptime}s` : uptime < 3600 ? `${Math.floor(uptime / 60)}m` : `${Math.floor(uptime / 3600)}h`;

      return `  ${p.sessionId}: ${p.command} (${mode})${interactive} [UP: ${uptimeStr}]`;
    });

    return header + processLines.join('\n');
  }

  public async handleList(_params: ITerminalParams): Promise<ITerminalResult> {
    const processesList = listProcesses();
    const formattedOutput = this.formatProcessList(processesList);
    return {
      success: true,
      message: formattedOutput,
      processes: processesList,
    };
  }

  public async handleStatus(params: ITerminalParams): Promise<ITerminalResult> {
    if (!params.sessionId) {
      return { success: false, message: TerminalErrorMessages.SESSION_REQUIRED };
    }

    const processInfo = getProcess(params.sessionId);
    if (!processInfo) {
      return { success: false, message: TerminalErrorMessages.SESSION_NOT_FOUND };
    }

    const recentOutput = processInfo.outputBuffer.get(10);
    const isWaitingInput = detectWaitingInput(recentOutput);

    let isProcessActive = false;
    let exitCode: number | null = null;

    if (processInfo.process) {
      try {
        process.kill(processInfo.process.pid, 0);
        isProcessActive = true;
      } catch (error) {
        isProcessActive = false;
        exitCode = processInfo.process.exitCode || 1;
      }
    }

    let status: 'running' | 'waiting_input' | 'completed' | 'error';

    if (!isProcessActive) {
      if (exitCode === null) {
        exitCode = processInfo.process?.exitCode ?? 1;
      }
      status = exitCode === 0 ? 'completed' : 'error';
    } else if (isWaitingInput) {
      status = 'waiting_input';
    } else {
      status = 'running';
    }

    const activeProcessesCount = processMap.size;

    return {
      success: true,
      sessionId: params.sessionId!,
      status,
      output: recentOutput || 'Nenhum output disponível',
      message: `Processo ${status}: ${processInfo.command}. (Active processes: ${activeProcessesCount})`,
      exitCode: isProcessActive ? undefined : (exitCode ?? undefined),
      timedOut: status === 'running'
    };
  }

  public async handleGetOutput(params: ITerminalParams): Promise<ITerminalResult> {
    if (!params.sessionId) {
      return { success: false, message: TerminalErrorMessages.SESSION_REQUIRED };
    }

    const processInfo = getProcess(params.sessionId);
    if (!processInfo) {
      return { success: false, message: TerminalErrorMessages.SESSION_NOT_FOUND };
    }

    const lines = params.lines ?? 50;
    const output = processInfo.outputBuffer.get(lines);

    return {
      success: true,
      sessionId: params.sessionId,
      output: output || 'Nenhum output disponível',
      message: `Últimas ${lines} linhas do processo ${params.sessionId} (${processInfo.command})`
    };
  }
}();
