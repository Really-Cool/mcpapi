import { mcpSections } from '@/data/mcp-data';
import { MCPItem } from '@/types/mcp';
import { MCPItemForRecommend, convertToSerializable } from '../mcp/utils';

/**
 * MCP服务 - 处理MCP数据的查询和过滤
 */
export class MCPService {
  /**
   * 获取所有MCP项目
   */
  static getAllItems(): MCPItem[] {
    return mcpSections.flatMap(section => section.items);
  }

  /**
   * 根据查询过滤MCP项目
   * TODO 换成真实的查询接口
   */
  static filterItems(query: string): MCPItem[] {
    if (!query || !query.trim()) {
      return this.getAllItems();
    }

    const lowerQuery = query.toLowerCase();
    const filteredItems = this.getAllItems().filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery) ||
      item.packageName.toLowerCase().includes(lowerQuery)
    );
    if (filteredItems.length === 0) {
      return this.getAllItems();
    }
    return filteredItems;
  }

  /**
   * 将MCP项目转换为可序列化格式并分页
   */
  static getPaginatedItems(
    items: MCPItem[], 
    page: number = 1, 
    pageSize: number = 10
  ): {
    items: MCPItemForRecommend[];
    total: number;
    page: number;
    pageSize: number;
  } {
    // 转换为可序列化格式
    const serializableItems = items.map(item => convertToSerializable(item));
    
    // 计算分页
    const total = serializableItems.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = serializableItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize
    };
  }
}
