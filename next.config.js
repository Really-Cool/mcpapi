/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 配置输出目录
  distDir: '.next',
  // 配置源代码目录
  transpilePackages: [],
  // 配置页面扩展名
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // 配置图像优化
  images: {
    domains: [],
    unoptimized: true, // 在 Cloudflare Pages 上禁用图像优化
  },
  // 配置环境变量
  env: {
    APP_ENV: process.env.APP_ENV || 'development',
  },
  // 优化构建输出
  output: 'standalone',
  // 确保正确处理路径
  trailingSlash: true,
  // 配置 webpack
  webpack: (config, { dev, isServer }) => {
    // 仅在生产环境中应用优化
    if (!dev) {
      // 优化分块策略
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 20 * 1024 * 1024, // 20MB
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // 安全地获取包名
              const packageNameMatch = module.context ? 
                module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/) : null;
              return packageNameMatch ? 
                `npm.${packageNameMatch[1].replace('@', '')}` : 'npm.unknown';
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name: 'shared',
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      };

      // 减少 webpack 缓存文件大小
      if (isServer) {
        config.cache = {
          type: 'filesystem',
          compression: 'gzip',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          buildDependencies: {
            config: [__filename],
          },
        };
      }
    }
    return config;
  },
};

module.exports = nextConfig;
