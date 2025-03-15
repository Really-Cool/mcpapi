import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './rateLimiter';

/**
 * 请求验证结果接口
 */
export interface RequestValidationResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: string;
    status: number;
  };
}

/**
 * 验证并解析 JSON 请求
 * @param request NextRequest 对象
 * @returns 包含验证结果和解析数据的对象
 */
export async function validateJsonRequest<T>(request: NextRequest): Promise<RequestValidationResult<T>> {
  // 应用限流检查
  const rateLimitResponse = await checkRateLimit(request);
  if (rateLimitResponse) {
    const errorData = await rateLimitResponse.json();
    return {
      success: false,
      error: {
        message: errorData.error,
        details: errorData.details,
        status: 429
      }
    };
  }

  // 验证内容类型
  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return {
      success: false,
      error: {
        message: '请求必须是 JSON 格式',
        status: 400
      }
    };
  }

  // 获取请求体文本并验证非空
  const text = await request.text();
  if (!text || text.trim() === '') {
    return {
      success: false,
      error: {
        message: '请求体不能为空',
        status: 400
      }
    };
  }

  // 安全解析 JSON
  try {
    const data = JSON.parse(text) as T;
    return {
      success: true,
      data
    };
  } catch (e) {
    return {
      success: false,
      error: {
        message: 'JSON 格式无效',
        details: (e as Error).message,
        status: 400
      }
    };
  }
}

/**
 * 创建错误响应
 * @param message 错误消息
 * @param status HTTP 状态码
 * @param details 错误详情（可选）
 * @returns NextResponse 错误响应
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
  details?: string
): NextResponse {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

/**
 * 验证请求字段
 * @param data 请求数据
 * @param requiredFields 必需字段数组
 * @returns 验证结果对象
 */
export function validateFields<T>(
  data: T,
  requiredFields: { field: keyof T; type?: string; isArray?: boolean }[]
): RequestValidationResult<T> {
  for (const { field, type, isArray } of requiredFields) {
    const value = data[field];
    
    // 检查字段是否存在
    if (value === undefined || value === null) {
      return {
        success: false,
        error: {
          message: `缺少必需参数: ${String(field)}`,
          status: 400
        }
      };
    }
    
    // 检查类型
    if (type && typeof value !== type) {
      return {
        success: false,
        error: {
          message: `参数 ${String(field)} 必须是 ${type} 类型`,
          status: 400
        }
      };
    }
    
    // 检查是否为数组
    if (isArray && !Array.isArray(value)) {
      return {
        success: false,
        error: {
          message: `参数 ${String(field)} 必须是数组`,
          status: 400
        }
      };
    }
  }
  
  return { success: true, data };
}
