/**
 * 测试文件导入路径更新脚本
 * 
 * 这个脚本会自动更新所有测试文件中的导入路径，
 * 使其适应新的目录结构和路径别名。
 */

const fs = require('fs');
const path = require('path');

// 定义测试目录
const TESTS_DIR = path.join(__dirname, 'tests');
const SRC_TESTS_DIR = path.join(__dirname, 'src');

// 导入路径映射规则
const importPathMappings = [
  // 旧的相对路径导入
  { from: /from ['"]\.\.\/use-mcp-search['"]/g, to: "from '@hooks/mcp/use-mcp-search'" },
  { from: /from ['"]\.\.\/use-infinite-scroll['"]/g, to: "from '@hooks/mcp/use-infinite-scroll'" },
  { from: /from ['"]\.\.\/use-keyboard-shortcut['"]/g, to: "from '@hooks/mcp/use-keyboard-shortcut'" },
  { from: /from ['"]\.\.\/use-mcp-items['"]/g, to: "from '@hooks/mcp/use-mcp-items'" },
  { from: /from ['"]\.\.\/use-toast['"]/g, to: "from '@hooks/ui/use-toast'" },
  { from: /from ['"]\.\.\/use-mobile['"]/g, to: "from '@hooks/ui/use-mobile'" },
  { from: /from ['"]\.\.\/use-form['"]/g, to: "from '@hooks/form/use-form'" },
  
  // 组件相对路径导入
  { from: /from ['"]\.\.\/mcp-card['"]/g, to: "from '@components/mcp/mcp-card'" },
  { from: /from ['"]\.\.\/section-header['"]/g, to: "from '@components/mcp/section-header'" },
  { from: /from ['"]\.\.\/search-bar['"]/g, to: "from '@components/search/search-bar'" },
  { from: /from ['"]\.\.\/search-results['"]/g, to: "from '@components/search/search-results'" },
  
  // 旧的 @/ 路径别名导入
  { from: /from ['"]@\/hooks\/use-mcp-search['"]/g, to: "from '@hooks/mcp/use-mcp-search'" },
  { from: /from ['"]@\/hooks\/use-infinite-scroll['"]/g, to: "from '@hooks/mcp/use-infinite-scroll'" },
  { from: /from ['"]@\/hooks\/use-keyboard-shortcut['"]/g, to: "from '@hooks/mcp/use-keyboard-shortcut'" },
  { from: /from ['"]@\/hooks\/use-mcp-items['"]/g, to: "from '@hooks/mcp/use-mcp-items'" },
  { from: /from ['"]@\/hooks\/use-toast['"]/g, to: "from '@hooks/ui/use-toast'" },
  { from: /from ['"]@\/hooks\/use-mobile['"]/g, to: "from '@hooks/ui/use-mobile'" },
  { from: /from ['"]@\/hooks\/use-form['"]/g, to: "from '@hooks/form/use-form'" },
  
  // 服务导入
  { from: /from ['"]@\/lib\/services\/api-client['"]/g, to: "from '@services/api-client'" },
  { from: /from ['"]@\/lib\/services\/mcp-service['"]/g, to: "from '@services/mcp-service'" },
  { from: /from ['"]@\/lib\/services\/llm-service['"]/g, to: "from '@services/llm-service'" },
  { from: /from ['"]@\/lib\/services\/icon-service['"]/g, to: "from '@services/icon-service'" },
  
  // 组件导入
  { from: /from ['"]@\/components\/mcpapi['"]/g, to: "from '@components/mcp'" },
  { from: /from ['"]@\/components\/mcpapi\/mcp-card['"]/g, to: "from '@components/mcp/mcp-card'" },
  { from: /from ['"]@\/components\/mcpapi\/section-header['"]/g, to: "from '@components/mcp/section-header'" },
  { from: /from ['"]@\/components\/mcpapi\/search-bar['"]/g, to: "from '@components/search/search-bar'" },
  { from: /from ['"]@\/components\/mcpapi\/search-results['"]/g, to: "from '@components/search/search-results'" },
  { from: /from ['"]@\/components\/mcpapi\/error-boundary['"]/g, to: "from '@components/common/error-boundary'" },
  { from: /from ['"]@\/components\/mcpapi\/theme-provider['"]/g, to: "from '@components/common/theme-provider'" },
  
  // Mock 路径
  { from: /jest\.mock\(['"]@\/hooks\/use-mcp-search['"]\)/g, to: "jest.mock('@hooks/mcp/use-mcp-search')" },
  { from: /jest\.mock\(['"]@\/hooks\/use-infinite-scroll['"]\)/g, to: "jest.mock('@hooks/mcp/use-infinite-scroll')" },
  { from: /jest\.mock\(['"]@\/hooks\/use-keyboard-shortcut['"]\)/g, to: "jest.mock('@hooks/mcp/use-keyboard-shortcut')" },
  { from: /jest\.mock\(['"]@\/hooks\/use-mcp-items['"]\)/g, to: "jest.mock('@hooks/mcp/use-mcp-items')" },
  { from: /jest\.mock\(['"]@\/hooks\/use-toast['"]\)/g, to: "jest.mock('@hooks/ui/use-toast')" },
  { from: /jest\.mock\(['"]@\/hooks\/use-mobile['"]\)/g, to: "jest.mock('@hooks/ui/use-mobile')" },
  { from: /jest\.mock\(['"]@\/hooks\/use-form['"]\)/g, to: "jest.mock('@hooks/form/use-form')" },
  { from: /jest\.mock\(['"]@\/lib\/services\/api-client['"]/g, to: "jest.mock('@services/api-client'" },
  { from: /jest\.mock\(['"]@\/lib\/services\/mcp-service['"]/g, to: "jest.mock('@services/mcp-service'" },
  { from: /jest\.mock\(['"]@\/lib\/services\/llm-service['"]/g, to: "jest.mock('@services/llm-service'" },
  { from: /jest\.mock\(['"]@\/lib\/services\/icon-service['"]/g, to: "jest.mock('@services/icon-service'" },
  { from: /jest\.mock\(['"]@\/components\/mcpapi['"]/g, to: "jest.mock('@components/mcp'" },
  { from: /jest\.mock\(['"]\.\.\/mcp-card['"]/g, to: "jest.mock('@components/mcp/mcp-card'" },
  { from: /jest\.mock\(['"]\.\.\/search-bar['"]/g, to: "jest.mock('@components/search/search-bar'" },
  { from: /jest\.mock\(['"]\.\.\/search-results['"]/g, to: "jest.mock('@components/search/search-results'" },
];

/**
 * 递归获取目录中的所有文件
 * @param {string} dir 目录路径
 * @param {Array<string>} fileList 文件列表
 * @returns {Array<string>} 文件列表
 */
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (/\.(ts|tsx|js|jsx)$/.test(file) && (/test\.|spec\./).test(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * 更新文件中的导入路径
 * @param {string} filePath 文件路径
 */
function updateImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanged = false;
    
    // 应用导入路径映射规则
    importPathMappings.forEach(mapping => {
      const newContent = content.replace(mapping.from, mapping.to);
      if (newContent !== content) {
        content = newContent;
        hasChanged = true;
      }
    });
    
    // 如果有变更，写入文件
    if (hasChanged) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`已更新: ${filePath}`);
    }
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
  }
}

// 获取所有需要处理的文件
console.log('正在收集测试文件...');
const testFiles = getAllFiles(TESTS_DIR);
const srcTestFiles = getAllFiles(SRC_TESTS_DIR);
const allFiles = [...testFiles, ...srcTestFiles];

console.log(`找到 ${allFiles.length} 个测试文件需要处理`);

// 更新所有文件中的导入路径
allFiles.forEach((filePath, index) => {
  console.log(`处理文件 ${index + 1}/${allFiles.length}: ${filePath}`);
  updateImportsInFile(filePath);
});

console.log('测试文件导入路径更新完成！');
