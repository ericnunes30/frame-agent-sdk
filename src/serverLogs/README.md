# Utils Module

This module contains utility classes and functions used across the SDK.

## Logger

The logger provides a centralized logging system with the following features:

- Different log levels (debug, info, warn, error)
- Configurable output (enable/disable levels, timestamp, module name)
- Singleton pattern for global access
- Custom formatting support
- Disabled by default (must be explicitly enabled via configuration file)

### Usage

```typescript
import { setupLoggerFromFile, logger } from '@utils/logger';

// Setup logger from configuration file (required to enable logging)
setupLoggerFromFile();

// Log messages with different levels (only shown if enabled in config)
logger.debug('Debug message', 'MyModule');
logger.info('Info message', 'MyModule');
logger.warn('Warning message', 'MyModule');
logger.error('Error message', 'MyModule');
```

### Configuration

The logger can be configured with the following options:

- `enabled`: Enable or disable logging completely (default: false)
- `level`: Minimum log level to output (default: INFO)
- `timestamp`: Whether to include timestamps in logs (default: true)
- `moduleName`: Whether to include module names in logs (default: true)
- `formatter`: Custom function to format log messages