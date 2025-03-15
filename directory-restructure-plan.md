# MCPAPI 目录结构重构计划

## 当前问题

1. **测试文件分散**：测试文件分布在不同目录的 `__tests__` 文件夹中
2. **hooks 目录混乱**：有些 UI 相关的 hooks 放在了 components/ui 目录下
3. **utils 目录结构不清晰**：utils 和 lib 目录存在重叠
4. **类型定义分散**：类型定义没有集中管理
5. **配置文件散乱**：测试配置文件放在根目录
6. **组件结构不合理**：mcpapi 目录下的组件没有明确的分类

## 重构计划

### 1. 新的目录结构

```
mcpapi/
├── src/                           # 所有源代码放在 src 目录下
│   ├── app/                       # Next.js App Router 页面
│   │   ├── api/                   # API 路由
│   │   │   ├── mcp/
│   │   │   └── recommend/
│   │   └── page.tsx               # 主页
│   ├── components/                # 组件目录
│   │   ├── common/                # 通用组件
│   │   │   ├── error-boundary.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── layout/                # 布局组件
│   │   │   ├── header.tsx
│   │   │   └── main-layout.tsx
│   │   ├── search/                # 搜索相关组件
│   │   │   ├── search-bar.tsx
│   │   │   └── search-results.tsx
│   │   ├── mcp/                   # MCP 相关组件
│   │   │   ├── mcp-card.tsx
│   │   │   ├── mcp-section.tsx
│   │   │   └── recommendations-section.tsx
│   │   └── ui/                    # UI 组件库
│   │       ├── button.tsx
│   │       └── ...
│   ├── hooks/                     # 所有自定义 hooks
│   │   ├── ui/                    # UI 相关 hooks
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── form/                  # 表单相关 hooks
│   │   │   └── use-form.ts
│   │   └── mcp/                   # MCP 相关 hooks
│   │       ├── use-infinite-scroll.ts
│   │       ├── use-mcp-items.ts
│   │       └── use-mcp-search.ts
│   ├── contexts/                  # 上下文
│   │   └── mcp-context.tsx
│   ├── services/                  # 服务层
│   │   ├── api-client.ts
│   │   ├── icon-service.ts
│   │   ├── llm-service.ts
│   │   └── mcp-service.ts
│   ├── utils/                     # 工具函数
│   │   ├── constants/             # 常量
│   │   │   └── theme.ts
│   │   └── helpers/               # 辅助函数
│   │       └── theme-utils.ts
│   ├── types/                     # 类型定义
│   │   ├── api.ts                 # API 相关类型
│   │   ├── mcp.ts                 # MCP 相关类型
│   │   └── common.ts              # 通用类型
│   └── data/                      # 静态数据
│       └── mcp-data.tsx
├── public/                        # 静态资源
├── tests/                         # 测试文件集中管理
│   ├── unit/                      # 单元测试
│   │   ├── components/            # 组件测试
│   │   ├── hooks/                 # Hooks 测试
│   │   └── services/              # 服务测试
│   ├── integration/               # 集成测试
│   ├── e2e/                       # 端到端测试
│   └── setup/                     # 测试配置
│       ├── jest.config.js
│       ├── jest.setup.js
│       └── babel.config.jest.js
├── styles/                        # 全局样式
├── .next/                         # Next.js 构建输出
├── node_modules/                  # 依赖
├── package.json                   # 项目配置
├── tsconfig.json                  # TypeScript 配置
├── tailwind.config.ts             # Tailwind 配置
└── next.config.js                 # Next.js 配置
```

### 2. 迁移步骤

1. **创建新的目录结构**
   - 创建 src 目录，将所有源代码移动到其中
   - 创建 tests 目录，整合所有测试文件

2. **重组组件**
   - 将 mcpapi 目录下的组件按功能分类到新的目录
   - 将通用组件移至 common 目录

3. **整合 hooks**
   - 将 UI 相关的 hooks 从 components/ui 移至 hooks/ui
   - 按功能对 hooks 进行分类

4. **整合服务层**
   - 将 lib/services 和 app/api/services 合并到 src/services

5. **集中类型定义**
   - 将所有类型定义整合到 src/types 目录

6. **集中测试配置**
   - 将测试配置文件移至 tests/setup 目录

### 3. 路径别名配置

在 tsconfig.json 中添加路径别名，简化导入：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"],
      "@contexts/*": ["./src/contexts/*"],
      "@data/*": ["./src/data/*"],
      "@tests/*": ["./tests/*"]
    }
  }
}
```

### 4. 更新导入路径

在重构过程中，需要更新所有文件中的导入路径，以适应新的目录结构。

## 优势

1. **更清晰的关注点分离**：按功能和类型组织代码
2. **更好的可扩展性**：新功能可以轻松添加到相应目录
3. **更容易导航**：目录结构反映了应用架构
4. **测试更加集中**：所有测试在一个地方管理
5. **更好的开发体验**：路径别名简化导入
6. **符合行业最佳实践**：遵循 React 和 Next.js 社区推荐的结构

## 实施注意事项

1. 重构应分阶段进行，确保每个阶段后应用仍然可以正常运行
2. 使用版本控制记录每个重构步骤
3. 更新导入路径时要特别小心，确保所有引用都已更新
4. 重构后运行所有测试，确保功能正常
