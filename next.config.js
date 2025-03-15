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
  },
  // 配置环境变量
  env: {
    APP_ENV: process.env.APP_ENV || 'development',
  },
};

module.exports = nextConfig;
