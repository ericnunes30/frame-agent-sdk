/**
 * Enum for log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Interface for logger configuration
 */
export interface LoggerConfig {
  /**
   * Minimum log level to output
   */
  level?: LogLevel;
  
  /**
   * Whether to include timestamps in logs
   */
  timestamp?: boolean;
  
  /**
   * Whether to include module names in logs
   */
  moduleName?: boolean;
  
  /**
   * Custom formatter function for log messages
   */
  formatter?: (level: LogLevel, moduleName: string, message: string, timestamp?: Date) => string;
}

/**
 * Interface for the logger
 */
export interface ILogger {
  /**
   * Log a debug message
   * @param message - The message to log
   * @param moduleName - The module name to include in the log
   */
  debug(message: string, moduleName?: string): void;
  
  /**
   * Log an info message
   * @param message - The message to log
   * @param moduleName - The module name to include in the log
   */
  info(message: string, moduleName?: string): void;
  
  /**
   * Log a warning message
   * @param message - The message to log
   * @param moduleName - The module name to include in the log
   */
  warn(message: string, moduleName?: string): void;
  
  /**
   * Log an error message
   * @param message - The message to log
   * @param moduleName - The module name to include in the log
   */
  error(message: string, moduleName?: string): void;
  
  /**
   * Configure the logger
   * @param config - The configuration to apply
   */
  configure(config: LoggerConfig): void;
}