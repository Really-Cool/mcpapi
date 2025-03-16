import { MCPItemForRecommend } from '../mcp/utils';
import OpenAI from 'openai';

// 定义LLM推荐响应接口
export interface LLMRecommendationResponse {
  recommendations: MCPItemForRecommend[];
  explanation: string;
  query: string;
}

// 缓存类型
type CacheItem = {
  data: LLMRecommendationResponse;
  timestamp: number;
};

/**
 * LLM服务 - 处理与大语言模型的交互
 */
export class LLMService {
  private static cache = new Map<string, CacheItem>();
  private static CACHE_TTL = 86400 * 1000; // 24小时，毫秒
  private static openai: OpenAI;

  /**
   * 初始化OpenAI客户端
   */
  private static getClient(): OpenAI {
    if (!this.openai) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY || '',
        baseURL: process.env.LLM_API_BASE_URL || 'https://api.deepseek.com', // 可配置为DeepSeek的API URL
      });
    }
    return this.openai;
  }

  /**
   * 生成缓存键
   */
  private static getCacheKey(query: string): string {
    return `recommend:${query}`;
  }

  /**
   * 从缓存获取结果
   */
  private static getFromCache(query: string): LLMRecommendationResponse | null {
    const cacheKey = this.getCacheKey(query);
    const cachedItem = this.cache.get(cacheKey);
    
    if (cachedItem && Date.now() - cachedItem.timestamp < this.CACHE_TTL) {
      console.log('缓存命中:', cacheKey);
      return cachedItem.data;
    }
    
    return null;
  }

  /**
   * 将结果存入缓存
   */
  private static saveToCache(query: string, result: LLMRecommendationResponse): void {
    const cacheKey = this.getCacheKey(query);
    this.cache.set(cacheKey, { 
      data: result, 
      timestamp: Date.now() 
    });
  }

  /**
   * 获取MCP推荐
   * @param query 用户查询
   * @param items 可供推荐的MCP项目列表（已转换为推荐格式）
   * @returns 推荐结果，包含推荐项目和解释
   */
  static async getRecommendations(
    query: string, 
    items: MCPItemForRecommend[]
  ): Promise<LLMRecommendationResponse> {
    // 验证输入
    if (!query || !query.trim()) {
      return this.getFallbackRecommendations('', items);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.warn('没有提供有效的MCP项目列表，使用兜底推荐');
      return this.getFallbackRecommendations(query, []);
    }

    // 尝试从缓存获取
    const cachedResult = this.getFromCache(query);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      const systemPrompt = `你是一个MCP (Model Context Protocol) 专家，帮助用户根据他们的需求找到最合适的MCP服务器。
      基于用户的查询和可用的MCP项目列表，推荐最相关的1-3个MCP项目。
      提供一个简短的解释，说明为什么这些MCP项目适合用户的需求。你主要推荐保险领域的MCP项目。比如保险产品的精算需要定价、保费和场景测试、敏感性测试等动作。
      回复格式为JSON，包含recommendations数组和explanation字段。
      每个推荐项目必须包含id、title和description字段。
      如果没有找到相关的MCP项目，可以返回空数组。`;
      
      const userPrompt = `查询: "${query}"
      
      可用的MCP项目:
      ${JSON.stringify(items, null, 2)}`;

      const openai = this.getClient();
      const response = await openai.chat.completions.create({
        model: process.env.LLM_MODEL || "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });
      
      const content = response.choices[0]?.message?.content || '';
      console.log('LLM 响应内容:', content);
      
      try {
        const parsedResponse = JSON.parse(content);
        
        // 验证响应格式
        if (!parsedResponse.recommendations || !Array.isArray(parsedResponse.recommendations)) {
          throw new Error('LLM 返回的数据缺少 recommendations 数组');
        }
        
        // 验证每个推荐项目的格式
        const validRecommendations = parsedResponse.recommendations.filter((item: any) => {
          return item && typeof item === 'object' && item.id && item.title && item.description;
        });
        
        if (validRecommendations.length === 0) {
          throw new Error('LLM 返回的推荐项目格式不正确');
        }
        
        // 构建结果
        const result: LLMRecommendationResponse = {
          recommendations: validRecommendations,
          explanation: parsedResponse.explanation || `基于您的查询"${query}"，以下是推荐的MCP服务器。`,
          query
        };
        
        this.saveToCache(query, result);
        return result;
      } catch (parseError) {
        console.warn('解析 LLM 响应失败，使用兜底推荐:', parseError);
        return this.getFallbackRecommendations(query, items);
      }
    } catch (error) {
      console.error('LLM API 调用失败，使用兜底推荐:', error);
      return this.getFallbackRecommendations(query, items);
    }
  }

  /**
   * 兜底推荐功能 - 当LLM调用失败时使用
   * @param query 用户查询
   * @param items 可供推荐的MCP项目列表
   * @returns 基于关键词匹配的推荐结果
   */
  static getFallbackRecommendations(
    query: string, 
    items: MCPItemForRecommend[]
  ): LLMRecommendationResponse {
    // 确保 items 是有效的数组
    const validItems = Array.isArray(items) ? items : [];
    
    if (validItems.length === 0) {
      return {
        recommendations: [],
        explanation: `没有找到与"${query}"相关的MCP服务器。`,
        query
      };
    }
    
    const lowerQuery = query.toLowerCase();
    
    // 简单的关键词匹配
    const matchedItems = validItems.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
    
    // 取前3个匹配项，如果没有匹配项，则返回前3个项目
    const recommendations = matchedItems.length > 0 
      ? matchedItems.slice(0, 3) 
      : validItems.slice(0, 3);
    
    return {
      recommendations,
      explanation: `基于您的查询"${query}"，我推荐以下MCP服务器，它们最符合您的需求。这些推荐考虑了功能匹配度、下载量和活跃状态。`,
      query
    };
  }
}
