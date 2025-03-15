import { MCPItem } from '@/types/mcp';
import { ReactElement } from 'react';

/**
 * 从 MCPItem 中提取图标名称
 * 将 React 组件转换为可序列化的字符串表示
 */
export function getIconName(item: MCPItem): string {
  try {
    // 检查 icon 是否为 React 元素
    const icon = item.icon as ReactElement;
    
    // 如果是 span 元素（包含 emoji）
    if (icon && typeof icon === 'object' && icon.type === 'span') {
      return 'Emoji';
    }
    
    // 如果是 Lucide 图标
    if (icon && typeof icon === 'object' && typeof icon.type === 'function') {
      return icon.type.name || 'Icon';
    }
    
    // 默认情况
    return 'Icon';
  } catch (error) {
    // 如果解析过程中出错，返回默认值
    return 'Icon';
  }
}

/**
 * 创建一个不包含 icon 的 MCPItem 版本
 * 用于 API 响应中的序列化
 */
export type MCPItemForRecommend = Omit<MCPItem, 'icon'> & {
  iconName?: string;
};

/**
 * 将 MCPItem 转换为可序列化的格式
 * 移除不可序列化的 React 组件
 */
export function convertToSerializable(item: MCPItem | any): MCPItemForRecommend {
  // 如果项目已经没有 icon 属性（来自前一个 API 调用）
  if (!('icon' in item)) {
    return item as MCPItemForRecommend;
  }
  
  // 否则，创建一个不包含 icon 的新对象
  const { icon, ...itemWithoutIcon } = item as MCPItem;
  
  // 添加图标名称信息
  return {
    ...itemWithoutIcon,
    iconName: getIconName(item as MCPItem)
  } as MCPItemForRecommend;
}
