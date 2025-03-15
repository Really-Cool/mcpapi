import { NextRequest, NextResponse } from 'next/server';
import { MCPService } from '../services/mcp-service';
import { MCPItemForRecommend } from './utils';

// 扩展类型以支持分页和搜索
export interface MCPSearchResponse {
  items: MCPItemForRecommend[];
  total: number;
  page: number;
  pageSize: number;
  query?: string;
}

/**
 * MCP API 路由处理程序
 * 提供分页和搜索功能
 */
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    // 使用服务层过滤项目
    const filteredItems = MCPService.filterItems(query);
    
    // 使用服务层处理分页
    const paginatedResult = MCPService.getPaginatedItems(filteredItems, page, pageSize);

    // 返回分页结果
    return NextResponse.json({
      ...paginatedResult,
      query: query || undefined
    });
  } catch (error) {
    console.error('MCP API 处理出错:', error);
    return NextResponse.json(
      { error: '处理MCP数据时出错' },
      { status: 500 }
    );
  }
}
