import { logger, LogLevel, LoggerConfig } from './logger';

/**
 * Default logger configuration for development environment
 */
export const developmentLoggerConfig: LoggerConfig = {
  level: LogLevel.DEBUG,
  timestamp: true,
  moduleName: true
};

/**
 * Default logger configuration for production environment
 */
export const productionLoggerConfig: LoggerConfig = {
  level: LogLevel.INFO,
  timestamp: true,
  moduleName: true
};

/**
 * Default logger configuration for testing environment
 */
export const testLoggerConfig: LoggerConfig = {
  level: LogLevel.WARN,
  timestamp: false,
  moduleName: false
};

/**
 * Configure logger based on environment
 */
export function configureLoggerForEnvironment(): void {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      logger.configure(productionLoggerConfig);
      break;
    case 'test':
      logger.configure(testLoggerConfig);
      break;
    default:
      logger.configure(developmentLoggerConfig);
      break;
  }
}

/**
 * Configure logger with custom settings
 * @param config - Custom logger configuration
 */
export function configureLogger(config: LoggerConfig): void {
  logger.configure(config);
}