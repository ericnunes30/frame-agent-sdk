// tests/jest.config.js (único config)
module.exports = {
  testEnvironment: 'node',
  rootDir: '../',
  testMatch: ['<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/unit/providers/openaiCompatibleProvider.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.ts'],
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['<rootDir>'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tests/unit/tsconfig.json',
      useESM: false,
      diagnostics: { 
        ignoreCodes: [2554, 2307],
        warnOnly: true
      }
    }
  },
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
  verbose: false,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};

