#!/bin/bash

# 清理脚本 - 删除已迁移的原有目录和文件
# 此脚本会删除已经迁移到 src 目录的原有目录和文件

echo "开始清理已迁移的目录和文件..."

# 确保我们在项目根目录
cd "$(dirname "$0")"

# 定义要删除的目录
DIRS_TO_REMOVE=(
  "app"
  "components"
  "contexts"
  "data"
  "hooks"
  "lib"
  "types"
  "utils"
  "e2e"
)

# 定义要删除的文件
FILES_TO_REMOVE=(
  "jest.config.js"
  "jest.setup.js"
  "next.config.mjs"
  "package.json.new"
)

# 删除目录
for dir in "${DIRS_TO_REMOVE[@]}"; do
  if [ -d "$dir" ]; then
    echo "删除目录: $dir"
    rm -rf "$dir"
  else
    echo "目录不存在，跳过: $dir"
  fi
done

# 删除文件
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    echo "删除文件: $file"
    rm "$file"
  else
    echo "文件不存在，跳过: $file"
  fi
done

echo "清理完成！"
echo "所有已迁移的目录和文件已被删除。"
echo "项目现在使用新的 src 目录结构。"
