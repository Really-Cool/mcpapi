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

### React 19 兼容性问题

如果遇到类似以下的 React 19 兼容性错误：

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
npm ERR! 
npm ERR! While resolving: react-day-picker@8.10.1
npm ERR! Found: react@19.0.0
npm ERR! node_modules/react
npm ERR!   react@"^19" from the root project
npm ERR! 
npm ERR! Could not resolve dependency:
npm ERR! peer react@">=16.8.0" from @floating-ui/react-dom@2.1.2
```

或者：

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
npm ERR! 
npm ERR! While resolving: vaul@0.9.9
npm ERR! Found: react@19.0.0
npm ERR! node_modules/react
npm ERR!   react@"^19" from the root project
npm ERR! 
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^16.8 || ^17.0 || ^18.0" from vaul@0.9.9
```

解决方法：

1. **移除不兼容的组件库**：
   - 从 `package.json` 中移除 `react-day-picker` 和 `vaul` 等不兼容的依赖
   - 创建简化版的组件替代原有组件，保持 API 兼容性
   - 重新安装依赖：`npm install`
   - 重新构建项目：`npm run build`

2. **降级 React**：
   - 如果组件是必需的，可以考虑将 React 降级到 18.x 版本
   - 在 `package.json` 中将 `react` 和 `react-dom` 的版本从 `^19` 改为 `^18`
   - 重新安装依赖：`npm install`

3. **使用兼容性标志**：
   - 尝试使用 `--force` 或 `--legacy-peer-deps` 标志强制安装
   - 例如：`npm install --legacy-peer-deps`
   - 注意：这可能导致运行时错误，不推荐用于生产环境

4. **寻找替代方案**：
   - 寻找与 React 19 兼容的替代组件库
   - 自行实现必要的组件功能

### Wrangler 配置问题

如果遇到 "No wrangler.toml file found" 或 "wrangler.toml file was found but it does not appear to be valid" 错误，请确保在项目根目录创建了正确的 `wrangler.toml` 文件，内容如下：

```toml
# Wrangler 配置文件 - Cloudflare Pages 部署配置

name = "mcpapi"
compatibility_date = "2025-03-16"

# Pages 特定配置
[build]
command = "npm run build"
output_directory = ".next"

# 环境变量配置
[site]
bucket = ".next"

[env.production]
vars = { APP_ENV = "production" }

# 兼容性标志
[compatibility_flags]
nodejs_compat = true
```

注意：
- Cloudflare Pages 使用 `output_directory` 而不是 `pages_build_output_dir`
- 环境变量应该在 `[env.production]` 下的 `vars` 中定义
- `[site]` 部分中的 `bucket` 应指向构建输出目录

### Node.js 版本问题

如果遇到类似以下的 Node.js 版本错误：

```
You are using Node.js 18.17.1. For Next.js, Node.js version "^18.18.0 || ^19.8.0 || >= 20.0.0" is required.
```

解决方法：

1. **创建 `.node-version` 文件**：
   在项目根目录创建 `.node-version` 文件，指定 Node.js 版本：
   ```
   20.11.1
   ```

2. **在 `.env.local` 中指定 Node.js 版本**：
   ```
   NODE_VERSION=20.11.1
   ```

3. **在 `package.json` 中指定 Node.js 版本**：
   在 `package.json` 中添加 `engines` 字段：
   ```json
   "engines": {
     "node": ">=20.0.0"
   }
   ```

注意：Cloudflare Pages 会自动检测这些文件并使用指定的 Node.js 版本。

### Cloudflare Pages 文件大小限制问题

如果遇到类似以下的文件大小限制错误：

```
✘ [ERROR] Error: Pages only supports files up to 25 MiB in size
cache/webpack/server-production/0.pack is 27.4 MiB in size
```

Cloudflare Pages 对单个文件的大小限制为 25MB，解决方法：

1. **优化 Next.js 配置**：
   在 `next.config.js` 中添加以下配置：
   ```javascript
   module.exports = {
     // 其他配置...
     output: 'standalone',
     webpack: (config, { dev, isServer }) => {
       // 仅在生产环境中应用优化
       if (!dev) {
         // 优化分块策略
         config.optimization.splitChunks = {
           chunks: 'all',
           maxInitialRequests: 25,
           minSize: 20000,
           maxSize: 20 * 1024 * 1024, // 20MB
           // 其他配置...
         };
         
         // 减少 webpack 缓存文件大小
         if (isServer) {
           config.cache = {
             type: 'filesystem',
             compression: 'gzip',
             // 其他配置...
           };
         }
       }
       return config;
     },
   };
   ```

2. **排除 webpack 缓存文件**：
   - 创建 `.cfignore` 文件排除大文件：
     ```
     # 忽略 webpack 缓存文件
     .next/cache/
     .next/cache/webpack/
     .next/server/chunks/**/*.js.map
     .next/server/pages/**/*.js.map
     ```
   
   - 在 `wrangler.toml` 中添加排除规则：
     ```toml
     [build.upload]
     format = "directory"
     include = [".next/**/*"]
     exclude = [
       ".next/cache/**",
       ".next/server/chunks/**/*.js.map",
       ".next/server/pages/**/*.js.map",
       ".next/cache/webpack/**"
     ]
     ```

3. **清理构建缓存**：
   在部署前清理构建缓存：
   ```bash
   rm -rf .next/cache
   npm run build
   ```

4. **使用 `standalone` 输出模式**：
   在 `next.config.js` 中设置 `output: 'standalone'`，这会创建一个包含所有必要文件的独立输出，不包括缓存文件。

注意：Cloudflare Pages 的文件大小限制是固定的，无法通过配置修改。因此，必须确保所有文件都小于 25MB。

---
如有任何部署问题或需要进一步的帮助，请参考 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/) 或联系 Cloudflare 支持。


### node 找不到问题
实在不行，自己登陆服务器去装

```sh
# Install xz-utils if missing
if ! command -v xz &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y xz-utils
fi

# Install Node.js
NODE_VERSION=$(curl -s https://nodejs.org/dist/index.json | grep -oP '(?<="version":"v)[^"]+' | head -1)
curl -O https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz
sudo mkdir -p /usr/local/lib/nodejs
sudo tar -xJf node-v$NODE_VERSION-linux-x64.tar.xz -C /usr/local/lib/nodejs

# Add to PATH
export PATH=/usr/local/lib/nodejs/node-v$NODE_VERSION-linux-x64/bin:$PATH

# Verify installation
node -v
{{ ... }}
```