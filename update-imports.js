/**
 * 导入路径更新脚本
 * 
 * 这个脚本会自动更新所有 TypeScript/JavaScript 文件中的导入路径，
 * 使其适应新的目录结构和路径别名。
 */

const fs = require('fs');
const path = require('path');

// 定义源代码目录
const SRC_DIR = path.join(__dirname, 'src');
const TESTS_DIR = path.join(__dirname, 'tests');

// 导入路径映射规则
const importPathMappings = [
  // 组件路径映射
  { from: /from ['"]\.\.\/components\/mcpapi\/([^'"]+)['"]/g, to: "from '@components/mcp/$1'" },
  { from: /from ['"]\.\.\/components\/ui\/([^'"]+)['"]/g, to: "from '@components/ui/$1'" },
  { from: /from ['"]\.\.\/\.\.\/components\/mcpapi\/([^'"]+)['"]/g, to: "from '@components/mcp/$1'" },
  { from: /from ['"]\.\.\/\.\.\/components\/ui\/([^'"]+)['"]/g, to: "from '@components/ui/$1'" },
  
  // hooks 路径映射
  { from: /from ['"]\.\.\/hooks\/([^'"]+)['"]/g, to: "from '@hooks/mcp/$1'" },
  { from: /from ['"]\.\.\/\.\.\/hooks\/([^'"]+)['"]/g, to: "from '@hooks/mcp/$1'" },
  
  // 服务路径映射
  { from: /from ['"]\.\.\/lib\/services\/([^'"]+)['"]/g, to: "from '@services/$1'" },
  { from: /from ['"]\.\.\/\.\.\/lib\/services\/([^'"]+)['"]/g, to: "from '@services/$1'" },
  { from: /from ['"]\.\.\/api\/services\/([^'"]+)['"]/g, to: "from '@services/$1'" },
  
  // 工具函数路径映射
  { from: /from ['"]\.\.\/lib\/utils\/([^'"]+)['"]/g, to: "from '@utils/helpers/$1'" },
  { from: /from ['"]\.\.\/lib\/constants\/([^'"]+)['"]/g, to: "from '@utils/constants/$1'" },
  { from: /from ['"]\.\.\/\.\.\/lib\/utils\/([^'"]+)['"]/g, to: "from '@utils/helpers/$1'" },
  { from: /from ['"]\.\.\/\.\.\/lib\/constants\/([^'"]+)['"]/g, to: "from '@utils/constants/$1'" },
  
  // 上下文路径映射
  { from: /from ['"]\.\.\/contexts\/([^'"]+)['"]/g, to: "from '@contexts/$1'" },
  { from: /from ['"]\.\.\/\.\.\/contexts\/([^'"]+)['"]/g, to: "from '@contexts/$1'" },
  
  // 类型路径映射
  { from: /from ['"]\.\.\/types\/([^'"]+)['"]/g, to: "from '@types/$1'" },
  { from: /from ['"]\.\.\/\.\.\/types\/([^'"]+)['"]/g, to: "from '@types/$1'" },
  
  // 数据路径映射
  { from: /from ['"]\.\.\/data\/([^'"]+)['"]/g, to: "from '@data/$1'" },
  { from: /from ['"]\.\.\/\.\.\/data\/([^'"]+)['"]/g, to: "from '@data/$1'" },
  
  // app 路径映射
  { from: /from ['"]\.\.\/app\/([^'"]+)['"]/g, to: "from '@app/$1'" },
  { from: /from ['"]\.\.\/\.\.\/app\/([^'"]+)['"]/g, to: "from '@app/$1'" },
];

// 特殊组件路径映射
const componentMappings = {
  'error-boundary.tsx': 'common/error-boundary.tsx',
  'theme-provider.tsx': 'common/theme-provider.tsx',
  'header.tsx': 'layout/header.tsx',
  'main-layout.tsx': 'layout/main-layout.tsx',
  'search-bar.tsx': 'search/search-bar.tsx',
  'search-results.tsx': 'search/search-results.tsx',
  'mcp-card.tsx': 'mcp/mcp-card.tsx',
  'mcp-section.tsx': 'mcp/mcp-section.tsx',
  'recommendations-section.tsx': 'mcp/recommendations-section.tsx',
  'section-grid.tsx': 'mcp/section-grid.tsx',
  'section-header.tsx': 'mcp/section-header.tsx',
  'user-collections.tsx': 'mcp/user-collections.tsx',
  'hero-section.tsx': 'mcp/hero-section.tsx',
};

// hooks 路径映射
const hooksMappings = {
  'use-mobile.tsx': 'ui/use-mobile.tsx',
  'use-toast.ts': 'ui/use-toast.ts',
  'use-form.ts': 'form/use-form.ts',
  'use-infinite-scroll.ts': 'mcp/use-infinite-scroll.ts',
  'use-mcp-items.ts': 'mcp/use-mcp-items.ts',
  'use-mcp-search.ts': 'mcp/use-mcp-search.ts',
  'use-keyboard-shortcut.ts': 'mcp/use-keyboard-shortcut.ts',
};

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
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
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
    
    // 更新特定组件的导入
    Object.entries(componentMappings).forEach(([oldName, newPath]) => {
      const pattern = new RegExp(`from ['"].*components\/mcpapi\/${oldName.replace('.tsx', '')}['"]`, 'g');
      const replacement = `from '@components/${newPath.replace('.tsx', '')}'`;
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        hasChanged = true;
      }
    });
    
    // 更新特定 hooks 的导入
    Object.entries(hooksMappings).forEach(([oldName, newPath]) => {
      const pattern = new RegExp(`from ['"].*hooks\/${oldName.replace(/\.(ts|tsx)$/, '')}['"]`, 'g');
      const replacement = `from '@hooks/${newPath.replace(/\.(ts|tsx)$/, '')}'`;
      const newContent = content.replace(pattern, replacement);
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
console.log('正在收集文件...');
const srcFiles = getAllFiles(SRC_DIR);
const testFiles = getAllFiles(TESTS_DIR);
const allFiles = [...srcFiles, ...testFiles];

console.log(`找到 ${allFiles.length} 个文件需要处理`);

// 更新所有文件中的导入路径
allFiles.forEach((filePath, index) => {
  console.log(`处理文件 ${index + 1}/${allFiles.length}: ${filePath}`);
  updateImportsInFile(filePath);
});

console.log('导入路径更新完成！');
