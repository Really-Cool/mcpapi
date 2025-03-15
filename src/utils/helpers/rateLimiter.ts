import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { NextRequest, NextResponse } from 'next/server';

// 环境变量配置
// 注意：需要在 .env.local 中添加以下环境变量
// UPSTASH_REDIS_REST_URL=your_redis_url
// UPSTASH_REDIS_REST_TOKEN=your_redis_token

// 创建限流器
let limiter: Ratelimit;

// 内存存储的请求计数器
// 用于在没有 Redis 的环境中进行简单限流
const memoryStore: Record<string, { count: number, resetTime: number }> = {};

/**
 * 内存存储的限流实现
 * 注意：这只适用于单实例部署，不适合生产环境的多实例部署
 */
class MemoryRatelimit {
  private windowMs: number;
  private maxRequests: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * 检查请求是否超过限制
   * @param identifier 请求标识符
   * @returns 限流结果
   */
  async limit(identifier: string) {
    const now = Date.now();
    const key = `ratelimit:${identifier}`;
    
    // 如果记录不存在或已过期，创建新记录
    if (!memoryStore[key] || now > memoryStore[key].resetTime) {
      memoryStore[key] = {
        count: 1,
        resetTime: now + this.windowMs
      };
      
      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: Math.floor(memoryStore[key].resetTime / 1000)
      };
    }
    
    // 检查是否超过限制
    if (memoryStore[key].count >= this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: Math.floor(memoryStore[key].resetTime / 1000)
      };
    }
    
    // 增加计数
    memoryStore[key].count += 1;
    
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - memoryStore[key].count,
      reset: Math.floor(memoryStore[key].resetTime / 1000)
    };
  }
}

/**
 * 初始化限流器
 * 如果环境变量未设置，则使用内存存储
 */
function initRateLimiter() {
  try {
    // 检查环境变量是否存在
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      // 使用 Upstash Redis
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      // 创建限流器，QPS 设置为 5
      limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 s'),
        analytics: true,
      });
      console.log('使用 Redis 进行限流');
    } else {
      // 如果环境变量未设置，使用内存存储
      console.warn('使用内存存储进行限流，生产环境建议配置 Redis');
      limiter = new MemoryRatelimit(5, 1000) as unknown as Ratelimit;
    }
  } catch (error) {
    console.error('初始化限流器失败:', error);
    // 降级为内存存储限流
    console.warn('降级为内存存储进行限流');
    limiter = new MemoryRatelimit(5, 1000) as unknown as Ratelimit;
  }
}

// 初始化限流器
initRateLimiter();

/**
 * 获取请求的唯一标识符
 * @param request NextRequest 对象
 * @returns 请求的唯一标识符
 */
function getIdentifier(request: NextRequest): string {
  // 优先使用 Authorization 头部
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    // 从 Bearer token 中提取标识符
    const token = authHeader.replace('Bearer ', '');
    return `auth_${token}`;
  }

  // 其次使用 IP 地址
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0].trim() || 
             realIp || 
             '127.0.0.1';
  
  return `ip_${ip}`;
}

/**
 * 应用限流检查
 * @param request NextRequest 对象
 * @returns 如果被限流，返回错误响应；否则返回 null
 */
export async function checkRateLimit(request: NextRequest): Promise<NextResponse | null> {
  try {
    const identifier = getIdentifier(request);
    const { success, limit, reset, remaining } = await limiter.limit(identifier);

    // 添加限流信息到响应头
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', limit.toString());
    headers.set('X-RateLimit-Remaining', remaining.toString());
    headers.set('X-RateLimit-Reset', reset.toString());

    if (!success) {
      // 请求被限流
      return new NextResponse(
        JSON.stringify({
          error: '请求过于频繁，请稍后再试',
          details: '超出 API 调用限制'
        }),
        {
          status: 429,
          headers,
          statusText: 'Too Many Requests'
        }
      );
    }

    // 请求未被限流，返回 null
    return null;
  } catch (error) {
    console.error('限流检查失败:', error);
    // 限流检查失败时，允许请求通过
    return null;
  }
}

/**
 * 重置限流计数器（用于测试）
 * @param identifier 请求标识符
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  const key = `ratelimit:${identifier}`;
  if (memoryStore[key]) {
    delete memoryStore[key];
  }
}
