/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,
    
    // Configure output mode based on environment
    output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
    
    // Image configuration for production deployment
    images: {
      // Disable image optimization only in production for Cloudflare Pages compatibility
      unoptimized: process.env.NODE_ENV === 'production',
      // Add domains you need to load images from
      domains: [],
    },
    
    // Add trailing slash only in production for better routing on Cloudflare Pages
    trailingSlash: process.env.NODE_ENV === 'production',
    
    // Experimental features (if needed)
    experimental: {
      // Enable if you need server components
      // serverComponents: true,
    },
    
    // Configure redirects if needed
    async redirects() {
      return [];
    },
    
    // Configure rewrites if needed
    async rewrites() {
      return [];
    },
  };
  
  module.exports = nextConfig;