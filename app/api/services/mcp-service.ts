import { mcpSections } from '@/data/mcp-data';
import { MCPItem } from '@/types/mcp';
import { MCPItemForRecommend} from '../mcp/utils';

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
   * 将MCP项目转换为推荐格式并分页
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
    
    // 计算分页
    const total = items.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize
    };
  }

  /**
   * 将推荐结果转换回完整的MCP项目
   * @param recommendedItems 推荐系统返回的项目列表
   * @returns 完整的MCP项目列表
   */
  static convertRecommendationsToFullItems(
    recommendedItems: MCPItemForRecommend[]
  ): (MCPItem | MCPItemForRecommend)[] {
    if (!recommendedItems || !Array.isArray(recommendedItems)) {
      console.warn('无效的推荐项目列表:', recommendedItems);
      return [];
    }
    
    const allItems = this.getAllItems();
    
    // 确保返回的每个项目都有正确的属性格式
    return recommendedItems.map(item => {
      const originalItem = allItems.find(original => original.id === item.id);
      if (originalItem) {
        console.log('找到匹配项:', originalItem.id);
        return originalItem;
      } else {
        // 如果找不到匹配项，确保返回的对象符合前端组件期望的格式
        return {
          id: item.id,
          title: item.title,
          packageName: item.packageName || '未知包',
          description: item.description,
        };
      }
    });
  }
}
