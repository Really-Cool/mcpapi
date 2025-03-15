# MCP API

MCP API 是一个基于 Next.js 构建的 API 服务，提供 MCP (Model Context Protocol) 项目的搜索和智能推荐功能。该服务利用大语言模型 (LLM) 技术为用户提供个性化的 MCP 项目推荐。

## 项目架构

### 目录结构

```
mcpapi/
├── app/                    # Next.js 应用目录
│   ├── api/                # API 路由
│   │   ├── mcp/            # MCP 搜索 API
│   │   │   ├── route.ts    # MCP 搜索路由处理
│   │   │   └── utils.ts    # MCP 工具函数
│   │   ├── recommend/      # 推荐 API
│   │   │   └── route.ts    # 推荐路由处理
│   │   └── services/       # 服务层
│   │       ├── mcp-service.ts  # MCP 数据服务
│   │       └── llm-service.ts  # LLM 推荐服务
│   └── page.tsx            # 前端页面
├── data/                   # 数据文件
│   └── mcp-data.tsx        # MCP 项目数据
├── types/                  # 类型定义
│   └── mcp.ts              # MCP 相关类型
├── env.example             # 环境变量示例
├── package.json            # 项目依赖
└── README.md               # 项目文档
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

## 开发指南

### 添加新的 MCP 项目

编辑 `data/mcp-data.tsx` 文件，在适当的部分添加新的 MCP 项目。

### 自定义 LLM 提示

修改 `services/llm-service.ts` 中的 `systemPrompt` 变量来自定义 LLM 的行为。

### 替换缓存实现

当前使用内存缓存，可以通过修改 `LLMService` 中的缓存相关方法来集成 Redis 或其他缓存服务。
