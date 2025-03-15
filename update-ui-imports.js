const fs = require('fs');
const path = require('path');

// 定义 UI 组件目录
const uiComponentsDir = path.join(__dirname, 'src', 'components', 'ui');

// 遍历 UI 组件目录中的所有文件
fs.readdir(uiComponentsDir, (err, files) => {
  if (err) {
    console.error('读取目录时出错:', err);
    return;
  }

  // 过滤出 .tsx 文件
  const tsxFiles = files.filter(file => file.endsWith('.tsx'));
  
  // 处理每个文件
  tsxFiles.forEach(file => {
    const filePath = path.join(uiComponentsDir, file);
    
    // 读取文件内容
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`读取文件 ${file} 时出错:`, err);
        return;
      }
      
      // 替换导入路径
      const updatedContent = data.replace(
        /import\s+{\s*cn\s*}\s+from\s+["']@\/lib\/utils["']/g, 
        'import { cn } from "@/utils/helpers/common-utils"'
      );
      
      // 如果内容有变化，写回文件
      if (updatedContent !== data) {
        fs.writeFile(filePath, updatedContent, 'utf8', err => {
          if (err) {
            console.error(`写入文件 ${file} 时出错:`, err);
            return;
          }
          console.log(`✅ 已更新 ${file} 中的导入路径`);
        });
      } else {
        console.log(`⏭️ 文件 ${file} 不需要更新`);
      }
    });
  });
});

console.log('正在更新 UI 组件的导入路径...');
