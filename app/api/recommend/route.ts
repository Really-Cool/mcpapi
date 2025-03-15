import { mcpSections } from '@/data/mcp-data';
import { MCPItem } from '@/types/mcp';
import { NextRequest, NextResponse } from 'next/server';
import { ReactElement } from 'react';

// 定义LLM推荐响应接口
export interface LLMRecommendationResponse {
  recommendations: Omit<MCPItem, 'icon'>[];
  explanation: string;
  query: string;
}

// 创建一个不包含 icon 的 MCPItem 版本
type MCPItemWithoutIcon = Omit<MCPItem, 'icon'> & {
  iconName?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { query, items } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: '缺少查询参数' },
        { status: 400 }
      );
    }

    // 如果没有提供items，则使用所有MCP项目
    const mcpItems = items || mcpSections.flatMap(section => section.items);
    
    // 处理项目，移除 icon 属性（不能被序列化）
    const serializableItems = mcpItems.map((item: any) => {
      // 如果项目已经没有 icon 属性（来自前一个 API 调用）
      if (!('icon' in item)) {
        return item as MCPItemWithoutIcon;
      }
      
      // 否则，创建一个不包含 icon 的新对象
      const { icon, ...itemWithoutIcon } = item as MCPItem;
      
      // 添加图标名称信息
      return {
        ...itemWithoutIcon,
        iconName: getIconName(item as MCPItem)
      } as MCPItemWithoutIcon;
    });
    
    // 准备发送给LLM的数据
    const llmData = {
      model: "deepseek-chat", // 可配置
      messages: [
        {
          role: "system",
          content: `你是一个MCP (Model Context Protocol) 专家，帮助用户根据他们的需求找到最合适的MCP服务器。
          基于用户的查询和可用的MCP项目列表，推荐最相关的1-3个MCP项目。
          提供一个简短的解释，说明为什么这些MCP项目适合用户的需求。
          回复格式为JSON，包含recommendations数组和explanation字段。`
        },
        {
          role: "user",
          content: `查询: "${query}"
          
          可用的MCP项目:
          ${JSON.stringify(serializableItems, null, 2)}`
        }
      ],
      stream: false
    };

    // 模拟LLM调用 - 在实际实现中，这里会调用真实的LLM API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(llmData)
    });
    
    // const llmResponse = await response.json();
    // 解析LLM响应并提取推荐
    
    // 模拟LLM响应
    const mockRecommendations = getMockRecommendations(query, serializableItems);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('LLM推荐出错:', error);
    return NextResponse.json(
      { error: '处理推荐时出错' },
      { status: 500 }
    );
  }
}

// 模拟LLM推荐功能 - 在实际实现中会被真实的LLM响应替代
function getMockRecommendations(query: string, items: MCPItemWithoutIcon[]): LLMRecommendationResponse {
  const lowerQuery = query.toLowerCase();
  
  // 简单的关键词匹配
  const matchedItems = items.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) || 
    item.description.toLowerCase().includes(lowerQuery) ||
    item.packageName.toLowerCase().includes(lowerQuery)
  );
  
  // 取前3个匹配项，如果没有匹配项，则返回前3个项目
  const recommendations = matchedItems.length > 0 
    ? matchedItems.slice(0, 3) 
    : items.slice(0, 3);
  
  return {
    recommendations,
    explanation: `基于您的查询"${query}"，我推荐以下MCP服务器，它们最符合您的需求。这些推荐考虑了功能匹配度、下载量和活跃状态。`,
    query
  };
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
