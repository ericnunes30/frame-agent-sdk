import { logger, LogLevel, LoggerConfig } from './logger';
import { LoggerConfigFile } from './logger.config.interface';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Default logger configuration file path
 */
const DEFAULT_CONFIG_FILE = 'logger.config.json';

// Internal state to route SDK console logs (like WorkflowBuilder)
// through the global logger, respecting the enabled flag.
let consolePatched = false;
let workflowLogsEnabled = false;
let originalConsoleLog: (...args: any[]) => void;
let originalConsoleInfo: (...args: any[]) => void;
let originalConsoleWarn: (...args: any[]) => void;
let originalConsoleError: (...args: any[]) => void;

function normalizeWorkflowBuilderMessage(args: any[]): string {
  if (!args.length) {
    return '';
  }

  const [first, ...rest] = args;
  let message =
    typeof first === 'string'
      ? first.replace(/^\[WorkflowBuilder\]\s*/, '')
      : String(first);

  if (rest.length > 0) {
    const restMessage = rest
      .map((value) => {
        if (typeof value === 'string') {
          return value;
        }

        try {
          return JSON.stringify(value);
        } catch {
          return String(value);
        }
      })
      .join(' ');

    if (message.length > 0) {
      message += ' ';
    }

    message += restMessage;
  }

  return message;
}

function patchConsoleForWorkflowLogs(enabled: boolean): void {
  workflowLogsEnabled = enabled;

  if (consolePatched) {
    return;
  }

  originalConsoleLog = console.log.bind(console);
  originalConsoleInfo = console.info.bind(console);
  originalConsoleWarn = console.warn.bind(console);
  originalConsoleError = console.error.bind(console);

  const handleConsole =
    (
      level: 'debug' | 'info' | 'warn' | 'error',
      originalFn: (...args: any[]) => void
    ) =>
    (...args: any[]): void => {
      if (!args.length) {
        return;
      }

      const first = args[0];
      const isWorkflowLog =
        typeof first === 'string' && first.startsWith('[WorkflowBuilder]');

      // Only route WorkflowBuilder logs through the SDK logger.
      if (!isWorkflowLog) {
        originalFn(...args);
        return;
      }

      if (!workflowLogsEnabled) {
        // Logging disabled globally: swallow WorkflowBuilder logs.
        return;
      }

      const message = normalizeWorkflowBuilderMessage(args);
      const moduleName = 'WorkflowBuilder';

      if (level === 'debug') {
        logger.debug(message, moduleName);
        return;
      }

      if (level === 'warn') {
        logger.warn(message, moduleName);
        return;
      }

      if (level === 'error') {
        logger.error(message, moduleName);
        return;
      }

      logger.info(message, moduleName);
    };

  console.log = handleConsole('info', originalConsoleLog);
  console.info = handleConsole('info', originalConsoleInfo);
  console.warn = handleConsole('warn', originalConsoleWarn);
  console.error = handleConsole('error', originalConsoleError);

  consolePatched = true;
}

/**
 * Load logger configuration from file
 * @param configPath - Path to the configuration file
 * @returns LoggerConfigFile or null if file doesn't exist
 */
export function loadLoggerConfig(configPath: string = DEFAULT_CONFIG_FILE): LoggerConfigFile | null {
  try {
    const fullPath = path.resolve(configPath);
    if (fs.existsSync(fullPath)) {
      const configFileContent = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(configFileContent) as LoggerConfigFile;
    }
    return null;
  } catch (error) {
    console.warn(`Failed to load logger configuration from ${configPath}:`, error);
    return null;
  }
}

/**
 * Apply logger configuration from file
 * @param configPath - Path to the configuration file
 */
export function setupLoggerFromFile(configPath: string = DEFAULT_CONFIG_FILE): void {
  const configFile = loadLoggerConfig(configPath);
  
  if (!configFile) {
    // If no config file, disable logging by default
    logger.configure({
      level: LogLevel.ERROR,
      formatter: () => '' // Suppress all output
    });

    // Ensure internal WorkflowBuilder logs do not bypass the global flag.
    patchConsoleForWorkflowLogs(false);
    return;
  }
  
  // If logging is disabled, set to highest level to suppress output
  if (configFile.enabled === false) {
    logger.configure({
      level: LogLevel.ERROR,
      formatter: () => '' // Suppress all output
    });

    // Ensure internal WorkflowBuilder logs do not bypass the global flag.
    patchConsoleForWorkflowLogs(false);
    return;
  }
  
  // Convert string level to LogLevel enum
  let level: LogLevel;
  switch (configFile.level) {
    case 'debug':
      level = LogLevel.DEBUG;
      break;
    case 'warn':
      level = LogLevel.WARN;
      break;
    case 'error':
      level = LogLevel.ERROR;
      break;
    default:
      level = LogLevel.INFO;
      break;
  }
  
  // Apply configuration
  const loggerConfig: LoggerConfig = {
    level,
    timestamp: configFile.timestamp !== false, // default true
    moduleName: configFile.moduleName !== false // default true
  };
  
  logger.configure(loggerConfig);

   // Route internal SDK console logs (WorkflowBuilder) through the global logger.
   patchConsoleForWorkflowLogs(true);
}

/**
 * Create a default logger configuration file
 * @param configPath - Path where to create the configuration file
 */
export function createDefaultLoggerConfig(configPath: string = DEFAULT_CONFIG_FILE): void {
  const defaultConfig: LoggerConfigFile = {
    enabled: false,
    level: 'info',
    timestamp: true,
    moduleName: true,
    colors: true
  };
  
  try {
    const fullPath = path.resolve(configPath);
    fs.writeFileSync(fullPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
    console.log(`Default logger configuration file created at ${fullPath}`);
  } catch (error) {
    console.error(`Failed to create logger configuration file at ${configPath}:`, error);
  }
}
