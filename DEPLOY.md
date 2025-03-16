# 部署指南：将 MCP API 部署到 Cloudflare

本文档详细说明如何将 MCP API 项目部署到 Cloudflare，并配置 mcpapi.net 域名。

## 目录

1. [准备工作](#准备工作)
2. [Cloudflare Pages 部署](#cloudflare-pages-部署)
3. [环境变量配置](#环境变量配置)
4. [域名配置](#域名配置)
5. [持续集成/持续部署 (CI/CD)](#持续集成持续部署-cicd)
6. [监控与维护](#监控与维护)
7. [常见问题解答](#常见问题解答)
8. [故障排除](#故障排除)

## 准备工作

### 1. 账户准备

- 注册 [Cloudflare 账户](https://dash.cloudflare.com/sign-up)（如果尚未注册）
- 确保您拥有 mcpapi.net 域名的管理权限，或准备将其添加到 Cloudflare

### 2. 本地项目准备

- 确保项目在本地环境正常运行
- 确保 Git 仓库已更新到最新版本
- 确保所有测试通过：`npm test`

### 3. 安装 Cloudflare CLI（可选）

```bash
npm install -g wrangler
```

## Cloudflare Pages 部署

### 1. 登录 Cloudflare Dashboard

访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 并登录您的账户。

### 2. 创建 Cloudflare Pages 项目

1. 在左侧导航栏中，点击 **Pages**
2. 点击 **创建应用程序**
3. 选择 **连接到 Git**
4. 选择您的 Git 提供商（GitHub、GitLab 等）并授权 Cloudflare 访问
5. 选择包含 MCP API 项目的仓库
6. 配置构建设置：
   - **项目名称**：`mcpapi`（或您喜欢的名称）
   - **生产分支**：`main`（或您的主分支名称）
   - **构建命令**：`npm run build`
   - **构建输出目录**：`.next`
   - **构建系统版本**：选择最新版本
   - **Node.js 版本**：选择与项目兼容的版本（推荐 18.x 或更高）
7. 点击 **保存并部署**

### 3. 等待初始部署完成

Cloudflare 将克隆您的仓库并开始构建过程。这可能需要几分钟时间。

## 环境变量配置

在 Cloudflare Pages 中配置必要的环境变量：

1. 在 Cloudflare Dashboard 中，导航到您的 Pages 项目
2. 点击 **设置** > **环境变量**
3. 添加以下环境变量（根据 README.md 中的说明）：

| 变量名 | 值 | 环境 |
|--------|------|--------|
| `OPENAI_API_KEY` | 您的 OpenAI API 密钥 | 生产/预览 |
| `DEEPSEEK_API_KEY` | 您的 DeepSeek API 密钥 | 生产/预览 |
| `LLM_API_BASE_URL` | `https://api.deepseek.com`（或您的自定义 URL） | 生产/预览 |
| `LLM_MODEL` | `deepseek-chat`（或您选择的模型） | 生产/预览 |
| `UPSTASH_REDIS_REST_URL` | 您的 Upstash Redis REST URL | 生产/预览 |
| `UPSTASH_REDIS_REST_TOKEN` | 您的 Upstash Redis REST Token | 生产/预览 |
| `NODE_VERSION` | `18`（或与项目兼容的版本） | 生产/预览 |

4. 点击 **保存**

### Upstash Redis 设置（用于限流）

1. 注册 [Upstash](https://upstash.com/) 账户
2. 创建新的 Redis 数据库
3. 获取 REST URL 和 REST Token
4. 将这些值添加到 Cloudflare Pages 环境变量中

## 域名配置

### 1. 将 mcpapi.net 添加到 Cloudflare

如果 mcpapi.net 尚未在 Cloudflare 管理：

1. 在 Cloudflare Dashboard 中，点击 **添加站点**
2. 输入 `mcpapi.net`
3. 选择合适的计划
4. 按照指示更新域名服务器

### 2. 配置自定义域名

1. 在 Cloudflare Dashboard 中，导航到您的 Pages 项目
2. 点击 **自定义域** > **设置自定义域**
3. 输入 `mcpapi.net`
4. 点击 **继续**
5. 选择 **激活域名**

### 3. 配置 DNS 记录

Cloudflare 将自动为您创建必要的 DNS 记录。如果需要手动配置：

1. 在 Cloudflare Dashboard 中，导航到 **DNS** > **记录**
2. 添加 `CNAME` 记录，将 `mcpapi.net` 指向您的 Cloudflare Pages 域名（例如 `mcpapi.pages.dev`）
3. 确保 **代理状态** 设置为 **已代理**（橙色云图标）

## 持续集成/持续部署 (CI/CD)

Cloudflare Pages 自动提供 CI/CD 功能：

1. 每当您推送到主分支时，Cloudflare 将自动构建并部署您的应用
2. 对于拉取请求，Cloudflare 会创建预览部署

### 自定义构建钩子（可选）

如果需要自定义构建过程，可以在项目根目录创建 `.cloudflare/workers-site/index.js` 文件。

## 监控与维护

### 1. 监控部署

1. 在 Cloudflare Dashboard 中，导航到您的 Pages 项目
2. 查看 **部署** 选项卡以监控部署状态和历史

### 2. 查看日志

1. 在 Cloudflare Dashboard 中，导航到您的 Pages 项目
2. 点击特定部署
3. 查看 **函数** 选项卡下的日志

### 3. 设置警报（可选）

1. 在 Cloudflare Dashboard 中，导航到 **通知**
2. 配置部署成功/失败的电子邮件或 Webhook 通知

## 常见问题解答

### 部署失败怎么办？

1. 检查构建日志以识别错误
2. 确保所有环境变量都已正确设置
3. 验证构建命令和输出目录配置是否正确
4. 确保项目在本地可以成功构建：`npm run build`

### 如何回滚到之前的部署？

1. 在 Cloudflare Dashboard 中，导航到您的 Pages 项目
2. 点击 **部署** 选项卡
3. 找到要回滚到的部署
4. 点击 **...** > **重新部署**

### 如何处理 API 限流问题？

确保正确配置了 Upstash Redis 环境变量。如果限流太严格，可以修改 `src/utils/helpers/rateLimiter.ts` 文件中的限流参数，然后重新部署。

### 如何更新环境变量？

1. 在 Cloudflare Dashboard 中，导航到您的 Pages 项目
2. 点击 **设置** > **环境变量**
3. 更新相应的环境变量
4. 点击 **保存**
5. 重新部署应用以应用更改

### 如何配置自定义缓存策略？

1. 在项目根目录创建 `_headers` 文件
2. 添加适当的缓存控制头
3. 重新部署应用

### 如何监控 API 性能？

1. 在 Cloudflare Dashboard 中，导航到 **分析** > **Web 分析**
2. 查看请求、带宽和错误统计信息

## 故障排除

### 依赖冲突问题

如果遇到类似以下的依赖冲突错误：

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
npm ERR! 
npm ERR! While resolving: react-day-picker@8.10.1
npm ERR! Found: date-fns@4.1.0
npm ERR! node_modules/date-fns
npm ERR!   date-fns@"4.1.0" from the root project
npm ERR! 
npm ERR! Could not resolve dependency:
npm ERR! peer date-fns@"^2.28.0 || ^3.0.0" from react-day-picker@8.10.1
```

解决方法：
1. 在 `package.json` 中将 `date-fns` 的版本从 `4.1.0` 降级到 `3.0.0`
2. 重新安装依赖：`npm install`
3. 重新构建项目：`npm run build`

### Wrangler 配置问题

如果遇到 "No wrangler.toml file found" 错误，请确保在项目根目录创建了 `wrangler.toml` 文件，内容如下：

```toml
# Wrangler 配置文件 - Cloudflare Pages 部署配置

name = "mcpapi"
compatibility_date = "2023-10-30"

# 构建配置
[build]
command = "npm run build"
output_directory = ".next"

# 环境变量配置
[vars]
APP_ENV = "production"

# 路由配置
[routes]
pattern = "/*"
script = "index.js"

# 兼容性标志
[compatibility_flags]
nodejs_compat = true
```

---

如有任何部署问题或需要进一步的帮助，请参考 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/) 或联系 Cloudflare 支持。
