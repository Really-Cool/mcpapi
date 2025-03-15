// 一个非常简单的 Jest 配置，只用于运行简单测试
module.exports = {
  rootDir: '../../',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/simple.test.js',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/src/',
  ],
  // 不转换任何文件
  transform: {},
  verbose: true,
};
