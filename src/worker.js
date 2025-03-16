/**
 * Cloudflare Worker for serving Next.js application
 * This script handles requests and serves the Next.js application
 */

// Define allowed origins for CORS
const ALLOWED_ORIGINS = ['https://mcpapi.net', 'https://www.mcpapi.net'];

// Define asset extensions for caching
const ASSET_EXTENSIONS = ['js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'woff', 'woff2', 'ttf', 'eot'];

/**
 * Handle incoming requests
 * @param {Request} request - The incoming request
 * @param {Object} env - Environment variables
 * @param {Object} ctx - Context object
 * @returns {Response} - The response
 */
export default {
  async fetch(request, env, ctx) {
    try {
      // Get the URL and pathname
      const url = new URL(request.url);
      const { pathname } = url;
      
      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return handleCors(request);
      }
      
      // Add security headers to all responses
      const response = await fetch(request);
      const headers = new Headers(response.headers);
      
      // Add security headers
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('X-XSS-Protection', '1; mode=block');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://*.deepseek.com https://*.openai.com https://*.upstash.io;");
      
      // Add CORS headers
      const origin = request.headers.get('Origin');
      if (origin && ALLOWED_ORIGINS.includes(origin)) {
        headers.set('Access-Control-Allow-Origin', origin);
      }
      
      // Add caching headers for static assets
      if (isAsset(pathname)) {
        headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year
      } else {
        headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      }
      
      // Return the modified response
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response('Server error', { status: 500 });
    }
  }
};

/**
 * Handle CORS preflight requests
 * @param {Request} request - The incoming request
 * @returns {Response} - CORS preflight response
 */
function handleCors(request) {
  const origin = request.headers.get('Origin');
  
  // Check if the origin is allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    };
    
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  return new Response(null, { status: 403 });
}

/**
 * Check if a pathname is for a static asset
 * @param {string} pathname - The URL pathname
 * @returns {boolean} - True if the pathname is for a static asset
 */
function isAsset(pathname) {
  const extension = pathname.split('.').pop().toLowerCase();
  return ASSET_EXTENSIONS.includes(extension);
}
