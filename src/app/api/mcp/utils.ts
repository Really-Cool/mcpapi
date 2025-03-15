import { MCPItem } from '@/types/mcp';
import { ReactNode } from 'react';


/**
 * 为推荐系统优化的 MCPItem 版本
 * 只包含推荐所需的关键字段
 */
export interface MCPItemForRecommend {
  id: string;
  title: string;
  packageName?: string;
  description: string;
  iconName?: string; // 添加图标名称字段
}

/**
 * 将 MCPItem 转换为推荐系统所需的精简格式
 * @param item 原始 MCP 项目
 * @returns 精简后的 MCP 项目，只包含推荐所需字段
 */
export function convertToSerializable(item: MCPItem | any): MCPItemForRecommend {
  const { 
    id, 
    title,
    packageName,
    description,
    iconName = "📦" // 使用默认图标名称如果没有提供
  } = item as MCPItem;
  
  // 创建精简版本，使用iconName替代icon
  return {
    id,
    title,
    packageName,
    description,
    iconName
  };
}