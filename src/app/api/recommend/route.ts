import { NextRequest, NextResponse } from 'next/server';
import { MCPService } from '../services/mcp-service';
import { LLMService } from '../services/llm-service';
import { MCPItem } from '@/types/mcp';
import { convertToSerializable, MCPItemForRecommend } from '../mcp/utils';
import { validateJsonRequest, validateFields, createErrorResponse } from '@/utils/helpers/requestValidation';

/**
 * 推荐 API 响应接口
 */
interface RecommendationResponse {
  recommendations: (MCPItem | MCPItemForRecommend)[];
  explanation: string;
  query: string;
}

/**
 * 推荐请求接口
 */
interface RecommendRequest {
  query: string;
  items: MCPItem[] | any[];
}

/**
 * 推荐 API 路由处理程序
 * 提供基于 LLM 的 MCP 推荐功能
 */
export async function POST(request: NextRequest) {
  try {
    // 使用全局请求验证
    const validationResult = await validateJsonRequest<RecommendRequest>(request);
    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error?.message || '请求验证失败',
        validationResult.error?.status || 400,
        validationResult.error?.details
      );
    }

    // 验证必填字段
    const fieldsValidation = validateFields(validationResult.data!, [
      { field: 'query', type: 'string' },
      { field: 'items', isArray: true }
    ]);

    if (!fieldsValidation.success) {
      return createErrorResponse(
        fieldsValidation.error?.message || '字段验证失败',
        fieldsValidation.error?.status || 400
      );
    }

    const { query, items } = validationResult.data!;

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
    return createErrorResponse(
      '处理推荐请求时出错',
      500,
      (error as Error).message
    );
  }
}
