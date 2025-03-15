#!/bin/bash

# 创建目录结构
mkdir -p src/{app/{api/mcp,api/recommend},components/{common,layout,search,mcp,ui},hooks/{ui,form,mcp},contexts,services,utils/{constants,helpers},types,data} tests/{unit/{components,hooks,services},integration,e2e,setup}

# 迁移测试配置文件
cp babel.config.jest.js tests/setup/
cp jest.config.js tests/setup/
cp jest.setup.js tests/setup/

# 迁移 app 目录
cp -r app/* src/app/

# 迁移组件文件
# 通用组件
mkdir -p src/components/common
cp components/error-boundary.tsx src/components/common/
cp components/theme-provider.tsx src/components/common/

# 布局组件
mkdir -p src/components/layout
cp components/mcpapi/header.tsx src/components/layout/
cp components/mcpapi/main-layout.tsx src/components/layout/

# 搜索组件
mkdir -p src/components/search
cp components/mcpapi/search-bar.tsx src/components/search/
cp components/mcpapi/search-results.tsx src/components/search/

# MCP 组件
mkdir -p src/components/mcp
cp components/mcpapi/mcp-card.tsx src/components/mcp/
cp components/mcpapi/mcp-section.tsx src/components/mcp/
cp components/mcpapi/recommendations-section.tsx src/components/mcp/
cp components/mcpapi/section-grid.tsx src/components/mcp/
cp components/mcpapi/section-header.tsx src/components/mcp/
cp components/mcpapi/user-collections.tsx src/components/mcp/
cp components/mcpapi/hero-section.tsx src/components/mcp/

# UI 组件
cp -r components/ui/* src/components/ui/

# 迁移 hooks
mkdir -p src/hooks/ui
cp hooks/use-mobile.tsx src/hooks/ui/
cp hooks/use-toast.ts src/hooks/ui/
cp components/ui/use-mobile.tsx src/hooks/ui/use-mobile-ui.tsx
cp components/ui/use-toast.ts src/hooks/ui/use-toast-ui.ts

mkdir -p src/hooks/form
cp hooks/use-form.ts src/hooks/form/

mkdir -p src/hooks/mcp
cp hooks/use-infinite-scroll.ts src/hooks/mcp/
cp hooks/use-mcp-items.ts src/hooks/mcp/
cp hooks/use-mcp-search.ts src/hooks/mcp/
cp hooks/use-keyboard-shortcut.ts src/hooks/mcp/

# 迁移上下文
mkdir -p src/contexts
cp contexts/mcp-context.tsx src/contexts/

# 迁移服务
mkdir -p src/services
cp lib/services/api-client.ts src/services/
cp lib/services/icon-service.ts src/services/
cp app/api/services/llm-service.ts src/services/
cp app/api/services/mcp-service.ts src/services/

# 迁移工具函数
mkdir -p src/utils/constants
cp lib/constants/theme.ts src/utils/constants/

mkdir -p src/utils/helpers
cp lib/utils/theme-utils.ts src/utils/helpers/
cp lib/utils.ts src/utils/helpers/common-utils.ts

# 迁移类型
mkdir -p src/types
cp types/mcp.ts src/types/

# 迁移数据
mkdir -p src/data
cp data/mcp-data.tsx src/data/

# 迁移测试文件
mkdir -p tests/unit/components
cp -r components/mcpapi/__tests__/* tests/unit/components/

mkdir -p tests/unit/hooks
cp -r hooks/__tests__/* tests/unit/hooks/

mkdir -p tests/unit/app
cp -r app/__tests__/* tests/unit/app/

mkdir -p tests/e2e
cp -r e2e/__tests__/* tests/e2e/

# 创建根目录的 package.json 更新
echo '{
  "name": "mcpapi",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest --config tests/setup/jest.config.js"
  }
}' > package.json.new

echo "目录结构重构完成！"
echo "请注意，这只是第一步。接下来需要更新所有文件中的导入路径。"
