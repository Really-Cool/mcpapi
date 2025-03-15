import { mcpSections } from '@/data/mcp-data';
import { MCPItem } from '@/types/mcp';
import { NextRequest, NextResponse } from 'next/server';
import { ReactElement } from 'react';

// 扩展类型以支持分页和搜索
export interface MCPSearchResponse {
  items: Omit<MCPItem, 'icon'>[];
  total: number;
  page: number;
  pageSize: number;
  query?: string;
}

// 创建一个不包含 icon 的 MCPItem 版本
type MCPItemWithoutIcon = Omit<MCPItem, 'icon'> & {
  iconName?: string;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  // 从所有部分收集项目
  const allItems = mcpSections.flatMap(section => section.items);
  
  // 如果有查询，过滤项目
  let filteredItems = allItems;
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredItems = allItems.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery) ||
      item.packageName.toLowerCase().includes(lowerQuery)
    );
  }

  // 转换项目，移除 icon 属性（不能被序列化）
  const serializableItems = filteredItems.map(item => {
    // 创建一个不包含 icon 的新对象
    const { icon, ...itemWithoutIcon } = item;
    
    // 添加图标名称信息（可选）
    const itemWithIconName: MCPItemWithoutIcon = {
      ...itemWithoutIcon,
      iconName: getIconName(item)
    };
    
    return itemWithIconName;
  });

  // 计算分页
  const total = serializableItems.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = serializableItems.slice(startIndex, endIndex);

  // 返回分页结果
  return NextResponse.json({
    items: paginatedItems,
    total,
    page,
    pageSize,
    query: query || undefined
  });
}

// 辅助函数：获取图标名称
function getIconName(item: MCPItem): string {
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
