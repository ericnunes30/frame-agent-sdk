// tests/unit/utils/logger.test.ts
import { LogLevel, Logger } from '@/utils/logger';

// Mock console methods
const mockConsole = {
    debug: jest.spyOn(console, 'debug').mockImplementation(),
    info: jest.spyOn(console, 'info').mockImplementation(),
    warn: jest.spyOn(console, 'warn').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation()
};

// Importar SimpleLogger via reflection (já que não é exportada diretamente)
// Vamos criar uma instância através do módulo
const createLogger = (logLevel: LogLevel): Logger => {
    // Usar dynamic import para acessar a classe não exportada
    const SimpleLogger = require('@/utils/logger').logger.constructor;
    return new SimpleLogger(logLevel);
};

describe('Logger', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        // Restore console methods
        Object.values(mockConsole).forEach(spy => spy.mockRestore());
    });

    describe('LogLevel.DEBUG', () => {
        let logger: Logger;

        beforeEach(() => {
            logger = createLogger(LogLevel.DEBUG);
        });

        it('deve logar mensagens debug', () => {
            // Act
            logger.debug('Debug message', { data: 'test' });

            // Assert
            expect(mockConsole.debug).toHaveBeenCalledWith(
                '[DEBUG] Debug message',
                { data: 'test' }
            );
        });

        it('deve logar mensagens info', () => {
            // Act
            logger.info('Info message');

            // Assert
            expect(mockConsole.info).toHaveBeenCalledWith('[INFO] Info message');
        });

        it('deve logar mensagens warn', () => {
            // Act
            logger.warn('Warning message');

            // Assert
            expect(mockConsole.warn).toHaveBeenCalledWith('[WARN] Warning message');
        });

        it('deve logar mensagens error', () => {
            // Act
            logger.error('Error message');

            // Assert
            expect(mockConsole.error).toHaveBeenCalledWith('[ERROR] Error message');
        });
    });

    describe('LogLevel.INFO', () => {
        let logger: Logger;

        beforeEach(() => {
            logger = createLogger(LogLevel.INFO);
        });

        it('não deve logar mensagens debug', () => {
            // Act
            logger.debug('Debug message');

            // Assert
            expect(mockConsole.debug).not.toHaveBeenCalled();
        });

        it('deve logar mensagens info', () => {
            // Act
            logger.info('Info message');

            // Assert
            expect(mockConsole.info).toHaveBeenCalledWith('[INFO] Info message');
        });

        it('deve logar mensagens warn', () => {
            // Act
            logger.warn('Warning message');

            // Assert
            expect(mockConsole.warn).toHaveBeenCalledWith('[WARN] Warning message');
        });

        it('deve logar mensagens error', () => {
            // Act
            logger.error('Error message');

            // Assert
            expect(mockConsole.error).toHaveBeenCalledWith('[ERROR] Error message');
        });
    });

    describe('LogLevel.WARN', () => {
        let logger: Logger;

        beforeEach(() => {
            logger = createLogger(LogLevel.WARN);
        });

        it('não deve logar mensagens debug', () => {
            // Act
            logger.debug('Debug message');

            // Assert
            expect(mockConsole.debug).not.toHaveBeenCalled();
        });

        it('não deve logar mensagens info', () => {
            // Act
            logger.info('Info message');

            // Assert
            expect(mockConsole.info).not.toHaveBeenCalled();
        });

        it('deve logar mensagens warn', () => {
            // Act
            logger.warn('Warning message');

            // Assert
            expect(mockConsole.warn).toHaveBeenCalledWith('[WARN] Warning message');
        });

        it('deve logar mensagens error', () => {
            // Act
            logger.error('Error message');

            // Assert
            expect(mockConsole.error).toHaveBeenCalledWith('[ERROR] Error message');
        });
    });

    describe('LogLevel.ERROR', () => {
        let logger: Logger;

        beforeEach(() => {
            logger = createLogger(LogLevel.ERROR);
        });

        it('não deve logar mensagens debug', () => {
            // Act
            logger.debug('Debug message');

            // Assert
            expect(mockConsole.debug).not.toHaveBeenCalled();
        });

        it('não deve logar mensagens info', () => {
            // Act
            logger.info('Info message');

            // Assert
            expect(mockConsole.info).not.toHaveBeenCalled();
        });

        it('não deve logar mensagens warn', () => {
            // Act
            logger.warn('Warning message');

            // Assert
            expect(mockConsole.warn).not.toHaveBeenCalled();
        });

        it('deve logar mensagens error', () => {
            // Act
            logger.error('Error message');

            // Assert
            expect(mockConsole.error).toHaveBeenCalledWith('[ERROR] Error message');
        });
    });

    describe('Múltiplos argumentos', () => {
        let logger: Logger;

        beforeEach(() => {
            logger = createLogger(LogLevel.DEBUG);
        });

        it('deve passar múltiplos argumentos para console.debug', () => {
            // Act
            logger.debug('Message', 'arg1', 123, { key: 'value' });

            // Assert
            expect(mockConsole.debug).toHaveBeenCalledWith(
                '[DEBUG] Message',
                'arg1',
                123,
                { key: 'value' }
            );
        });

        it('deve passar múltiplos argumentos para console.info', () => {
            // Act
            logger.info('Message', 'arg1', 123);

            // Assert
            expect(mockConsole.info).toHaveBeenCalledWith(
                '[INFO] Message',
                'arg1',
                123
            );
        });
    });
});
