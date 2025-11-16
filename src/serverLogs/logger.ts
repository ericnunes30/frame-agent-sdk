import { ILogger, LoggerConfig, LogLevel } from './logger.interface';

/**
 * Default logger implementation
 */
export class Logger implements ILogger {
  private static instance: Logger;
  private config: LoggerConfig;
  
  private constructor() {
    this.config = {
      level: LogLevel.INFO,
      timestamp: true,
      moduleName: true
    };
  }
  
  /**
   * Get the singleton instance of the logger
   * @returns The logger instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  /**
   * Configure the logger
   * @param config - The configuration to apply
   */
  public configure(config: LoggerConfig): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Log a debug message
   * @param message - The message to log
   * @param moduleName - The module name to include in the log
   */
  public debug(message: string, moduleName?: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.log(LogLevel.DEBUG, message, moduleName);
    }
  }
  
  /**
   * Log an info message
   * @param message - The message to log
   * @param moduleName - The module name to include in the log
   */
  public info(message: string, moduleName?: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.log(LogLevel.INFO, message, moduleName);
    }
  }
  
  /**
   * Log a warning message
   * @param message - The message to log
   * @param moduleName - The module name to include in the log
   */
  public warn(message: string, moduleName?: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.log(LogLevel.WARN, message, moduleName);
    }
  }
  
  /**
   * Log an error message
   * @param message - The message to log
   * @param moduleName - The module name to include in the log
   */
  public error(message: string, moduleName?: string): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.log(LogLevel.ERROR, message, moduleName);
    }
  }
  
  /**
   * Check if a message should be logged based on the current level
   * @param level - The level of the message to check
   * @returns Whether the message should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.config.level || LogLevel.INFO);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }
  
  /**
   * Log a message with the specified level
   * @param level - The log level
   * @param message - The message to log
   * @param moduleName - The module name to include in the log
   */
  private log(level: LogLevel, message: string, moduleName?: string): void {
    let output = '';
    
    // Use custom formatter if provided
    if (this.config.formatter) {
      output = this.config.formatter(level, moduleName || '', message, this.config.timestamp ? new Date() : undefined);
    } else {
      // Default formatting
      if (this.config.timestamp) {
        output += `[${new Date().toISOString()}] `;
      }
      
      output += `[${level.toUpperCase()}]`;
      
      if (this.config.moduleName && moduleName) {
        output += ` [${moduleName}]`;
      }
      
      output += ` ${message}`;
    }
    
    // Output to console based on level
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.ERROR:
        console.error(output);
        break;
      default:
        console.log(output);
    }
  }
}

// Export a default instance for easy access
export const logger = Logger.getInstance();
export { LogLevel, LoggerConfig } from './logger.interface';