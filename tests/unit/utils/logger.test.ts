import { Logger, LogLevel, configureLogger, configureLoggerForEnvironment } from '../../../src/utils';

describe('Logger', () => {
  let logger: Logger;
  
  beforeEach(() => {
    logger = Logger.getInstance();
    // Reset to default configuration
    logger.configure({
      level: LogLevel.INFO,
      timestamp: true,
      moduleName: true
    });
  });
  
  it('should be a singleton', () => {
    const logger1 = Logger.getInstance();
    const logger2 = Logger.getInstance();
    expect(logger1).toBe(logger2);
  });
  
  it('should log messages at or above the configured level', () => {
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    
    logger.info('Test message', 'TestModule');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[TestModule] Test message'));
    
    consoleSpy.mockRestore();
  });
  
  it('should not log messages below the configured level', () => {
    const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
    logger.configure({ level: LogLevel.WARN });
    
    logger.debug('Debug message', 'TestModule');
    expect(consoleSpy).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
  
  it('should include timestamp when configured', () => {
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    logger.configure({ timestamp: true });
    
    logger.info('Test message', 'TestModule');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T.*Z\] \[INFO\] \[TestModule\] Test message/));
    
    consoleSpy.mockRestore();
  });
  
  it('should use custom formatter when provided', () => {
    const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    const customFormatter = jest.fn().mockReturnValue('Custom formatted message');
    
    logger.configure({ formatter: customFormatter });
    logger.info('Test message', 'TestModule');
    
    expect(customFormatter).toHaveBeenCalledWith(LogLevel.INFO, 'TestModule', 'Test message', expect.any(Date));
    expect(consoleSpy).toHaveBeenCalledWith('Custom formatted message');
    
    consoleSpy.mockRestore();
  });

  it('should configure logger with helper function', () => {
    const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
    
    configureLogger({ level: LogLevel.DEBUG });
    logger.debug('Test debug message', 'TestModule');
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[DEBUG] [TestModule] Test debug message'));
    
    consoleSpy.mockRestore();
  });

  it('should configure logger for development environment', () => {
    // Save original env
    const originalEnv = process.env.NODE_ENV;
    
    // Set env to development
    process.env.NODE_ENV = 'development';
    configureLoggerForEnvironment();
    
    // Test that debug level is enabled
    const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
    logger.debug('Test debug message', 'TestModule');
    expect(consoleSpy).toHaveBeenCalled();
    
    // Restore original env
    process.env.NODE_ENV = originalEnv;
    consoleSpy.mockRestore();
  });
});