import { NextRequest, NextResponse } from 'next/server';
import { MCPService } from '../services/mcp-service';
import { LLMService } from '../services/llm-service';
import { MCPItem } from '@/types/mcp';

/**
 * 推荐 API 路由处理程序
 * 提供基于 LLM 的 MCP 推荐功能
 */
export async function POST(request: NextRequest) {
  try {
    const { query, items } = await request.json();
    if (!query) {
      return NextResponse.json(
        { error: '缺少查询参数' },
        { status: 400 }
      );
    }
    const mcpItems = items;
    console.log('mcpItems:', mcpItems);
    const serializableItems = mcpItems.map((item: MCPItem | any) => 
      'icon' in item ? MCPService.getPaginatedItems([item], 1, 1).items[0] : item
    );
    console.log('serializableItems:', serializableItems);
    const recommendations = await LLMService.getRecommendations(query, serializableItems);
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('推荐 API 处理出错:', error);
    return NextResponse.json(
      { error: '处理推荐请求时出错' },
      { status: 500 }
    );
  }
}
