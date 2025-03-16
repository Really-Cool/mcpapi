/**
 * Cloudflare Workers 配置文件
 * 用于自定义 Cloudflare Pages 的部署行为
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * 处理传入的请求
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    // 获取原始响应
    const response = await fetch(request)
    
    // 创建响应头
    const headers = new Headers(response.headers)
    
    // 添加安全相关的响应头
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('X-Frame-Options', 'DENY')
    headers.set('X-XSS-Protection', '1; mode=block')
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://*.deepseek.com https://*.openai.com https://*.upstash.io;")
    
    // 缓存控制
    if (request.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
      headers.set('Cache-Control', 'public, max-age=31536000') // 1年缓存
    } else {
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    }
    
    // 返回修改后的响应
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    })
  } catch (err) {
    return new Response('服务器错误', { status: 500 })
  }
}
