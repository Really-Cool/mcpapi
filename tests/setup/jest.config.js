/** @type {import('jest').Config} */
const path = require('path');

const config = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // 处理模块别名
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    // 为了兼容旧代码中的导入路径
    '^@/lib/services/api-client$': '<rootDir>/src/services/api-client',
    '^@/lib/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/mcp/$1',
    '^@/components/mcpapi$': '<rootDir>/src/components/mcp',
    '^@/components/mcpapi/(.*)$': '<rootDir>/src/components/mcp/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@/data/(.*)$': '<rootDir>/src/data/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    // 处理相对路径导入
    '\\.\\./([^/]+)$': '<rootDir>/src/components/mcp/$1',
    '\\.\\./(section-grid)$': '<rootDir>/src/components/layout/section-grid',
    '\\.\\./(search-bar)$': '<rootDir>/src/components/search/search-bar',
    '\\.\\./(search-results)$': '<rootDir>/src/components/search/search-results',
    '\\.\\./(mcp-card)$': '<rootDir>/src/components/mcp/mcp-card',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/tests/setup/node_modules/',
    '<rootDir>/tests/setup/.next/'
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  transform: {
    // 使用 babel-jest 转译测试文件
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!next.config.js',
  ],
  rootDir: '../../',
};

module.exports = config;
