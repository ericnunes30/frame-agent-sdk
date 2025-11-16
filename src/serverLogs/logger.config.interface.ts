/**
 * Interface for logger configuration file
 */
export interface LoggerConfigFile {
  /**
   * Enable or disable logging completely
   * @default false
   */
  enabled?: boolean;
  
  /**
   * Minimum log level to output
   * @default 'info'
   */
  level?: 'debug' | 'info' | 'warn' | 'error';
  
  /**
   * Whether to include timestamps in logs
   * @default true
   */
  timestamp?: boolean;
  
  /**
   * Whether to include module names in logs
   * @default true
   */
  moduleName?: boolean;
  
  /**
   * Whether to use colors in logs (if supported by environment)
   * @default true
   */
  colors?: boolean;
  
  /**
   * Output file path for logs (if not provided, logs go to console)
   * @default undefined (console output)
   */
  outputFile?: string;
  
  /**
   * Maximum file size in MB before rotation (if outputFile is set)
   * @default 10
   */
  maxFileSizeMB?: number;
  
  /**
   * Maximum number of log files to keep (if outputFile is set)
   * @default 5
   */
  maxFiles?: number;
}