#!/usr/bin/env node

/**
 * Script to create a default logger configuration file
 * 
 * Usage:
 *   npx ts-node scripts/create-logger-config.ts
 *   npm run create-logger-config
 */

import { createDefaultLoggerConfig } from '../src/utils';

// Get output path from command line arguments or use default
const outputPath = process.argv[2] || 'logger.config.json';

console.log(`Creating default logger configuration file at: ${outputPath}`);
createDefaultLoggerConfig(outputPath);
console.log('Logger configuration file created successfully!');