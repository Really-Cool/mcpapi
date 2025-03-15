import { NextRequest, NextResponse } from 'next/server';
import { MCPService } from '../services/mcp-service';
import { LLMService } from '../services/llm-service';
import { MCPItem } from '@/types/mcp';
import { convertToSerializable, MCPItemForRecommend } from '../mcp/utils';

/**
 * 推荐 API 响应接口
 */
interface RecommendationResponse {
  recommendations: (MCPItem | MCPItemForRecommend)[];
  explanation: string;
  query: string;
}

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

    const itemsForRecommend = items.map((item: MCPItem | any) => 
      convertToSerializable(item)
    );
    const llmResponse = await LLMService.getRecommendations(query, itemsForRecommend);
    // 将推荐结果转换回完整的 MCP 项目
    const fullRecommendations = MCPService.convertRecommendationsToFullItems(
      llmResponse.recommendations
    );
    const response: RecommendationResponse = {
      recommendations: fullRecommendations,
      explanation: llmResponse.explanation,
      query: llmResponse.query
    };
    console.log('推荐结果:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (error) {
    console.error('推荐 API 处理出错:', error);
    return NextResponse.json(
      { error: '处理推荐请求时出错' },
      { status: 500 }
    );
  }
}
