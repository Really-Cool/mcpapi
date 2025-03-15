#!/usr/bin/env node

/**
 * 这个脚本专门用于运行我们已经修复的 use-mcp-search.mock.test.ts 测试
 * 避免处理其他测试文件的配置问题
 */

const { execSync } = require('child_process');
const path = require('path');

// 获取项目根目录
const rootDir = path.resolve(__dirname);

// 要运行的测试文件
const testFile = path.join(rootDir, 'tests/unit/hooks/use-mcp-search.mock.test.ts');
// 专用的 Jest 配置文件
const configFile = path.join(rootDir, 'tests/setup/jest.mock.config.js');

try {
  // 直接运行特定的测试文件，使用专用的 Jest 配置
  console.log(`运行测试: ${testFile}`);
  execSync(`npx jest --env=jsdom --config ${configFile}`, { 
    stdio: 'inherit',
    cwd: rootDir 
  });
  console.log('测试成功完成！');
} catch (error) {
  console.error('测试运行失败:', error.message);
  process.exit(1);
}
