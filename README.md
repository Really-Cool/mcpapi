# MCP API

MCP API 是一个基于 Next.js 构建的 API 服务，提供 MCP (Model Context Protocol) 项目的搜索和智能推荐功能。该服务利用大语言模型 (LLM) 技术为用户提供个性化的 MCP 项目推荐。

## 项目架构

### 目录结构

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
│   ├── styles/                    # 样式
│   │   └── globals.css
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
├── .next/                         # Next.js 构建输出
├── node_modules/                  # 依赖
├── package.json                   # 项目配置
├── tsconfig.json                  # TypeScript 配置
├── tailwind.config.ts             # Tailwind 配置
└── next.config.js                 # Next.js 配置
```
### 核心组件

1. **MCP API** (`/api/mcp/route.ts`)
   - 提供 MCP 项目的搜索和分页功能
   - 支持按关键词过滤 MCP 项目

2. **推荐 API** (`/api/recommend/route.ts`)
   - 基于用户查询提供智能 MCP 项目推荐
   - 利用 LLM 技术分析用户需求并匹配合适的 MCP 项目

3. **服务层**
   - **MCPService** (`/api/services/mcp-service.ts`): 处理 MCP 数据的获取、过滤和分页
   - **LLMService** (`/api/services/llm-service.ts`): 处理与 LLM 的交互、缓存和兜底推荐

4. **工具函数** (`/api/mcp/utils.ts`)
   - 提供 MCP 项目序列化和图标处理功能

## 技术特点

- **缓存机制**: 实现 LLM 响应缓存，提高性能并减少 API 调用
- **兜底逻辑**: 当 LLM 调用失败时提供基于关键词匹配的推荐
- **OpenAI SDK 集成**: 使用 OpenAI SDK 简化 LLM API 调用
- **环境变量配置**: 支持灵活配置 LLM API 参数

## 启动项目

### 安装依赖

```bash
npm install
```

### 配置环境变量

1. 复制环境变量示例文件:

```bash
cp env.example .env.local
```

2. 编辑 `.env.local` 文件，填入您的 API 密钥和配置:

```
# LLM API 配置
OPENAI_API_KEY=your_openai_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# LLM API 基础 URL
LLM_API_BASE_URL=https://api.deepseek.com

# LLM 模型
LLM_MODEL=deepseek-chat

# 限流配置
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### 启动开发服务器

```bash
npm run dev
```

服务将在 [http://localhost:3000](http://localhost:3000) 启动。

## API 使用说明

### MCP 搜索 API

**端点**: `GET /api/mcp`

**参数**:
- `query` (可选): 搜索关键词
- `page` (可选): 页码，默认为 1
- `pageSize` (可选): 每页项目数，默认为 10

**示例请求**:
```
GET /api/mcp?query=chat&page=1&pageSize=5
```

**示例响应**:
```json
{
  "items": [...],
  "total": 10,
  "page": 1,
  "pageSize": 5,
  "query": "chat"
}
```

### MCP 推荐 API

**端点**: `POST /api/recommend`

**请求体**:
```json
{
  "query": "我需要一个支持多模态的聊天机器人"
}
```

**示例响应**:
```json
{
  "recommendations": [...],
  "explanation": "基于您的查询，我推荐以下MCP服务器...",
  "query": "我需要一个支持多模态的聊天机器人"
}
```

## 环境变量配置说明

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `OPENAI_API_KEY` | OpenAI API 密钥 | - |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | - |
| `LLM_API_BASE_URL` | LLM API 基础 URL | `https://api.deepseek.com` |
| `LLM_MODEL` | 使用的 LLM 模型 | `deepseek-chat` |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL（用于限流） | - |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST Token（用于限流） | - |

## API 限流

为了保护 API 服务不被滥用，MCP API 实现了请求限流机制。默认配置下，每个 IP 地址或认证令牌每秒最多允许 5 个请求（QPS=5）。

### 限流配置

限流功能使用 Upstash Redis 作为存储后端。要配置限流，请在 `.env.local` 文件中添加以下环境变量：

```
# 限流配置
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

如果未配置 Upstash Redis，系统将自动降级为使用内存存储进行限流，但这不适合生产环境的多实例部署。

### 限流响应

当请求超过限流阈值时，API 将返回 HTTP 429 状态码（Too Many Requests）和以下响应：

```json
{
  "error": "请求过于频繁，请稍后再试",
  "details": "超出 API 调用限制"
}
```

每个响应都包含以下限流相关的 HTTP 头：

- `X-RateLimit-Limit`: 时间窗口内允许的最大请求数
- `X-RateLimit-Remaining`: 当前时间窗口内剩余的请求数
- `X-RateLimit-Reset`: 限流计数器重置的时间戳

### 限流标识

系统按以下优先级确定请求的唯一标识：

1. 如果请求包含 `Authorization` 头（Bearer 令牌），则使用令牌作为标识
2. 否则，使用客户端 IP 地址作为标识（从 `X-Forwarded-For` 或 `X-Real-IP` 头获取）

## 开发指南

### 添加新的 MCP 项目

编辑 `data/mcp-data.tsx` 文件，在适当的部分添加新的 MCP 项目。

### 自定义 LLM 提示

修改 `services/llm-service.ts` 中的 `systemPrompt` 变量来自定义 LLM 的行为。

### 替换缓存实现

当前使用内存缓存，可以通过修改 `LLMService` 中的缓存相关方法来集成 Redis 或其他缓存服务。
