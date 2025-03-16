#!/bin/bash

# 下载重试函数
download_with_retry() {
    local url=$1
    local output=$2
    local max_retries=3
    local retry=0
    
    while [ $retry -lt $max_retries ]; do
        if curl -fsSL "$url" -o "$output"; then
            return 0
        fi
        retry=$((retry + 1))
        echo "下载失败，正在重试 ($retry/$max_retries)..."
        sleep 2
    done
    return 1
}

# 安装 Node.js
install_nodejs() {
    echo "正在安装 Node.js 20..."
    # 在用户目录下创建 nodejs 目录
    NODE_INSTALL_DIR="$HOME/.local/nodejs"
    mkdir -p "$NODE_INSTALL_DIR"
    
    # 设置下载链接（包括备用源）
    NODEJS_URLS=(
        "https://nodejs.org/dist/v20.11.1/node-v20.11.1-linux-x64.tar.gz"
        "https://npmmirror.com/mirrors/node/v20.11.1/node-v20.11.1-linux-x64.tar.gz"
    )
    
    cd "$NODE_INSTALL_DIR"
    
    # 尝试从不同源下载
    downloaded=false
    for url in "${NODEJS_URLS[@]}"; do
        echo "尝试从 $url 下载 Node.js..."
        if download_with_retry "$url" "nodejs.tar.gz"; then
            downloaded=true
            break
        fi
    done
    
    if [ "$downloaded" = false ]; then
        echo "错误：无法下载 Node.js"
        return 1
    fi
    
    # 解压文件
    echo "解压 Node.js..."
    if ! tar -xzf nodejs.tar.gz; then
        echo "错误：解压失败"
        return 1
    fi
    
    # 清理下载文件
    rm nodejs.tar.gz
    
    # 设置环境变量
    export PATH="$NODE_INSTALL_DIR/node-v20.11.1-linux-x64/bin:$PATH"
    
    # 添加到 .bashrc 以持久化环境变量
    if ! grep -q "export PATH=\"$NODE_INSTALL_DIR/node-v20.11.1-linux-x64/bin:\$PATH\"" "$HOME/.bashrc"; then
        echo "export PATH=\"$NODE_INSTALL_DIR/node-v20.11.1-linux-x64/bin:\$PATH\"" >> "$HOME/.bashrc"
    fi
    
    cd - > /dev/null
    return 0
}

# 检查 node 是否已安装
if ! command -v node &> /dev/null; then
    echo "未找到 node，准备安装..."
    if ! install_nodejs; then
        echo "错误：Node.js 安装失败"
        exit 1
    fi
else
    # 检查 node 版本
    NODE_VERSION=$(node -v | cut -d 'v' -f 2)
    if [ "$(printf '%s\n' "20.0.0" "$NODE_VERSION" | sort -V | head -n1)" != "20.0.0" ]; then
        echo "当前 Node.js 版本 ($NODE_VERSION) 不满足要求，需要 >= 20.0.0"
        echo "准备安装所需版本..."
        if ! install_nodejs; then
            echo "错误：Node.js 安装失败"
            exit 1
        fi
    fi
fi

# 再次检查 node 是否可用
if ! command -v node &> /dev/null; then
    echo "错误：Node.js 安装失败"
    echo "请手动安装 Node.js >= 20.0.0"
    exit 1
fi

# 运行应用
echo "使用 Node.js $(node -v) 启动应用..."
NODE_ENV=production node .next/standalone/server.js