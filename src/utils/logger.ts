// Sistema de logging simples para o exemplo SAP Parser MCP
import 'dotenv/config';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

class SimpleLogger implements Logger {
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.WARN) {
    this.logLevel = logLevel;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
}

// Logger global
// Configuração de nível de log via variáveis de ambiente:
// - DEBUG=true → mostra DEBUG, INFO, WARN, ERROR
// - INFO=true  → mostra INFO, WARN, ERROR (sem DEBUG)
// - padrão    → mostra apenas WARN, ERROR
const isDebug = process.env.DEBUG === 'True' || process.env.DEBUG === 'true';
const isInfo = process.env.INFO === 'True' || process.env.INFO === 'true';

let logLevel = LogLevel.WARN;
if (isDebug) {
  logLevel = LogLevel.DEBUG;
} else if (isInfo) {
  logLevel = LogLevel.INFO;
}

export const logger = new SimpleLogger(logLevel);